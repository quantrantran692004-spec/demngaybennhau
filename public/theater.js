(() => {
  'use strict';
  const DB_NAME = 'our_love_theater_db';
  const STORE = 'media';
  const IMAGE_TIME = 6500;
  const DEFAULT_SETTINGS = { effect: 'kenburns', transition: 'fade', speed: 'normal', duration: 6.5, auto: true, videoAudio: 'original' };
  const MAX_BYTES = 120 * 1024 * 1024;
  const $ = id => document.getElementById(id);
  const state = { scenes: [], audio: null, current: 0, playing: false, opened: false, timer: null, raf: 0, startedAt: 0, imageElapsed: 0, objectUrls: new Map(), loaded: false, dragging: null, selectedSong: null, theaterAudioSong: null, songScene: null, songVideoTime: 0, cover: null, inlineTimer: null, settings: { ...DEFAULT_SETTINGS }, playlist: [] };
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function loadSettings() { try { state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('our_love_theater_settings') || '{}') }; } catch (_) {} }
  function saveSettings() { localStorage.setItem('our_love_theater_settings', JSON.stringify(state.settings)); }
  function populateSettings() { refreshMusicList(); ['effect','transition','speed','duration','video-audio'].forEach(key => { const el = $('theater-' + key + '-select'); if (el) el.value = String(key === 'video-audio' ? state.settings.videoAudio : state.settings[key]); }); const auto = $('theater-auto-check'); if (auto) auto.checked = state.settings.auto; }
  function saveSettingsFromPanel() { saveSettings(); const panel = $('theater-settings-panel'); if (panel) panel.hidden = true; populateSettings(); toast('Đã lưu cấu hình rạp chiếu.'); }
  const toast = text => { const el = document.getElementById('garden-toast'); if (el) { el.textContent = text; el.classList.add('is-visible'); setTimeout(() => el.classList.remove('is-visible'), 2600); } else console.info(text); };
  const openDb = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Không mở được kho rạp chiếu.'));
  });
  const dbPut = record => openDb().then(db => new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(record);
    request.onsuccess = () => { db.close(); resolve(record); };
    request.onerror = () => { db.close(); reject(request.error); };
  }));
  const dbDelete = id => openDb().then(db => new Promise(resolve => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
    request.onsuccess = request.onerror = () => { db.close(); resolve(); };
  }));
  const dbAll = () => openDb().then(db => new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    request.onsuccess = () => { db.close(); resolve(request.result || []); };
    request.onerror = () => { db.close(); reject(request.error); };
  }));
  const isMedia = file => file.type.startsWith('image/') || file.type.startsWith('video/') || /\.(jpe?g|png|gif|webp|avif|mp4|webm|mov)$/i.test(file.name);
  const isAudio = file => file.type.startsWith('audio/') || /\.(mp3|m4a|wav|ogg|oga|aac|flac)$/i.test(file.name);
  function urlFor(record) {
    if (!state.objectUrls.has(record.id)) state.objectUrls.set(record.id, URL.createObjectURL(record.blob));
    return state.objectUrls.get(record.id);
  }
  function currentScene() { return state.songScene || state.scenes[state.current] || null; }
  // Mini bên ngoài chọn cảnh ảnh/video riêng, không thay đổi bộ chọn của rạp chính.
  function currentMiniScene() { return state.scenes[state.current] || state.songScene || null; }
  function clearTimer() { if (state.timer) { clearTimeout(state.timer); state.timer = null; } if (state.raf) cancelAnimationFrame(state.raf); state.raf = 0; }
  function stopMediaOnly() { const video = $('theater-video'); if (video) video.pause(); const audio = $('theater-audio'); if (audio) audio.pause(); }
  async function loadState() {
    loadSettings();
    if (state.loaded) return;
    try {
      const records = await dbAll();
      state.scenes = records.filter(r => r.kind === 'scene').sort((a,b) => a.order - b.order);
      state.audio = records.find(r => r.kind === 'audio') || null; state.cover = records.find(r => r.kind === 'cover') || null;
    } catch (error) { console.warn('Không thể đọc kho rạp chiếu:', error); }
    state.loaded = true;
    renderMini();
  }
  async function addFiles(files) {
    const list = Array.from(files || []);
    if (!list.length) return;
    let added = 0;
    for (const file of list) {
      if (file.size > MAX_BYTES) { toast(`${file.name} vượt quá 120 MB.`); continue; }
      if (!isMedia(file)) { toast(`${file.name} không phải ảnh/video hợp lệ.`); continue; }
      const record = { id: 'scene-' + Date.now() + '-' + Math.random().toString(36).slice(2), kind: 'scene', type: file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name) ? 'video' : 'image', name: file.name.replace(/\.[^/.]+$/, '') || 'Kỷ niệm', blob: file, order: state.scenes.length + added };
      await dbPut(record); state.scenes.push(record); added++;
    }
    if (added) { renderAll(); toast(`Đã thêm ${added} kỷ niệm.`); }
  }
  async function addAudio(file) {
    if (!file || !isAudio(file)) { toast('Hãy chọn file nhạc MP3 hoặc audio hợp lệ.'); return; }
    if (file.size > 50 * 1024 * 1024) { toast('Nhạc rạp chiếu cần nhỏ hơn 50 MB.'); return; }
    if (state.audio) await dbDelete(state.audio.id);
    state.audio = { id: 'audio-' + Date.now(), kind: 'audio', name: file.name.replace(/\.[^/.]+$/, '') || 'Nhạc kỷ niệm', blob: file };
    await dbPut(state.audio); renderAll(); toast('Đã thêm nhạc nền cho rạp chiếu.');
  }
  async function addCover(file) {
    if (!file || !file.type.startsWith('image/')) { toast('Hãy chọn một ảnh bìa hợp lệ.'); return; }
    if (state.cover) await dbDelete(state.cover.id);
    state.cover = { id: 'cover-' + Date.now(), kind: 'cover', name: file.name, blob: file };
    await dbPut(state.cover); renderMini(); toast('Đã cập nhật ảnh bìa.');
  }
  function stopInline() { if (state.inlineTimer) { clearTimeout(state.inlineTimer); state.inlineTimer = null; } const video = $('theater-mini-media')?.querySelector('video'); video?.pause(); }
  function startInline() {
    stopInline(); if (!state.selectedSong?.isPlaying || (!state.scenes.length && !state.songScene)) return;
    const scene = currentMiniScene();
    if (scene?.type === 'video') { const video = $('theater-mini-media')?.querySelector('video'); if (video) { if (Number.isFinite(state.songVideoTime)) video.currentTime = state.songVideoTime; video.addEventListener('timeupdate', () => { state.songVideoTime = video.currentTime || 0; }); video.play().catch(() => {}); } }
    else if (state.settings.auto) state.inlineTimer = setTimeout(() => { state.current = (state.current + 1) % state.scenes.length; renderMini(); startInline(); }, Number(state.settings.duration) * 1000);
  }
  function renderMini() {
    const card = $('theater-mini-card'); if (!card) return;
    card.classList.toggle('has-scenes', Boolean(state.selectedSong?.isPlaying)); card.classList.toggle('is-playing', Boolean(state.selectedSong?.isPlaying));
    const media = $('theater-mini-media'); const oldVideo = media.querySelector('video'); if (oldVideo && Number.isFinite(oldVideo.currentTime)) state.songVideoTime = oldVideo.currentTime; const scene = (!state.selectedSong?.isPlaying && state.cover) ? null : currentMiniScene(); media.innerHTML = '';
    if (scene) {
      const el = document.createElement(scene.type === 'video' ? 'video' : 'img');
      el.src = scene.url || urlFor(scene); el.muted = scene.type === 'video' && state.settings.videoAudio === 'mute'; el.playsInline = true; el.className = 'theater-mini-preview theater-effect-' + state.settings.effect; if (scene.type === 'video') { el.addEventListener('timeupdate', () => { state.songVideoTime = el.currentTime || 0; }); el.addEventListener('loadedmetadata', () => { if (state.songVideoTime > 0) el.currentTime = state.songVideoTime; }); }
      media.appendChild(el); $('theater-mini-title').textContent = scene.name;
      $('theater-mini-count').textContent = state.scenes.length ? `${state.current + 1}/${state.scenes.length}` : 'Video nhạc';
    } else {
      if (state.cover) { const cover = document.createElement('img'); cover.src = urlFor(state.cover); cover.className = 'theater-mini-preview'; cover.alt = 'Ảnh bìa kỷ niệm'; media.appendChild(cover); } else { const empty = document.createElement('div'); empty.className = 'theater-mini-preview-placeholder'; empty.textContent = state.selectedSong ? `♪ ${state.selectedSong.title}` : 'Thêm ảnh/video kỷ niệm'; media.appendChild(empty); }
      $('theater-mini-title').textContent = state.selectedSong?.title || 'Rạp chiếu kỷ niệm'; $('theater-mini-count').textContent = '0/0';
    }
    if (state.selectedSong?.isPlaying) startInline(); else stopInline();
  }
  function renderScenes() {
    const list = $('theater-scene-list'); if (!list) return;
    list.innerHTML = '';
    state.scenes.forEach((scene, index) => {
      const item = document.createElement('button'); item.type = 'button'; item.className = 'theater-scene' + (index === state.current ? ' is-active' : ''); item.dataset.index = index; item.draggable = true;
      item.addEventListener('dragstart', () => { state.dragging = index; item.classList.add('is-dragging'); });
      item.addEventListener('dragend', () => { state.dragging = null; item.classList.remove('is-dragging'); });
      item.addEventListener('dragover', event => event.preventDefault());
      item.addEventListener('drop', async event => { event.preventDefault(); const from = state.dragging; const to = index; if (from === null || from === to) return; const [moved] = state.scenes.splice(from, 1); state.scenes.splice(to, 0, moved); state.scenes.forEach((record, order) => { record.order = order; dbPut(record); }); state.current = Math.min(state.current, state.scenes.length - 1); renderAll(); });
      const thumb = document.createElement(scene.type === 'video' ? 'video' : 'img'); thumb.src = urlFor(scene); thumb.muted = true; thumb.playsInline = true; thumb.className = 'theater-scene-thumb-media';
      const box = document.createElement('span'); box.className = 'theater-scene-thumb'; box.appendChild(thumb);
      const text = document.createElement('span'); text.innerHTML = `<span class="theater-scene-name">${escapeHtml(scene.name)}</span><span class="theater-scene-type">${scene.type === 'video' ? 'Video' : 'Ảnh'} · ${index + 1}</span>`;
      item.append(box, text); item.onclick = () => showScene(index, state.playing); list.appendChild(item);
    });
  }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
  function renderAll() { renderMini(); renderScenes(); if (state.opened) showScene(state.current, false); }
  function setSourceAudio() {
    const audio = $('theater-audio'); if (!audio) return;
    const videoActive = currentScene()?.type === 'video' || state.selectedSong?.mediaType === 'video';
    if (videoActive) { audio.pause(); audio.removeAttribute('src'); return; }
    const source = state.theaterAudioSong && state.theaterAudioSong.mediaType !== 'video' ? state.theaterAudioSong.audioUrl : null;
    if (!source) { audio.pause(); audio.removeAttribute('src'); audio.load(); return; }
    if (audio.src !== source) { audio.src = source; audio.load(); }
  }
  function stageMedia(scene) {
    const stage = $('theater-stage'); stage.querySelectorAll('.theater-stage-media,.theater-empty').forEach(el => el.remove());
    if (!scene) { const empty = document.createElement('div'); empty.className = 'theater-empty'; empty.innerHTML = '<div><b>Rạp chiếu đang trống</b><span>Thêm ảnh hoặc video để bắt đầu câu chuyện của hai đứa.</span></div>'; stage.prepend(empty); return null; }
    const media = document.createElement(scene.type === 'video' ? 'video' : 'img'); media.id = 'theater-' + scene.type; media.className = 'theater-stage-media theater-enter theater-effect-' + state.settings.effect + ' theater-transition-' + state.settings.transition + (!reducedMotion && state.settings.effect === 'kenburns' ? ' theater-kenburns' : ''); media.src = scene.url || urlFor(scene); media.alt = scene.name; media.controls = false; media.playsInline = true; media.preload = 'metadata';
    if (scene.type === 'video') { media.muted = state.settings.videoAudio === 'mute'; media.onended = nextScene; media.onloadedmetadata = () => { if (state.songVideoTime > 0) media.currentTime = state.songVideoTime; updateProgress(); }; media.addEventListener('timeupdate', () => { state.songVideoTime = media.currentTime || 0; }); if (state.songVideoTime > 0) media.currentTime = state.songVideoTime; }
    stage.prepend(media); requestAnimationFrame(() => media.classList.remove('theater-enter'));
    $('theater-caption-title').textContent = scene.name; $('theater-caption-text').textContent = scene.type === 'video' ? 'Một đoạn phim trong câu chuyện của hai đứa.' : 'Một khoảnh khắc được giữ lại.';
    return media;
  }
  function showScene(index, autoplay) {
    if (!state.scenes.length && !state.songScene) { stageMedia(null); return; }
    clearTimer(); stopMediaOnly(); state.current = state.scenes.length ? (index + state.scenes.length) % state.scenes.length : 0; const scene = currentScene(); const media = stageMedia(scene); renderScenes(); renderMini(); $('theater-scene-index').textContent = `${state.current + 1}/${state.scenes.length}`;
    const progress = $('theater-progress'); progress.value = 0; $('theater-current-time').textContent = '0:00'; $('theater-duration').textContent = scene.type === 'image' ? formatTime(Number(state.settings.duration)) : '0:00';
    state.imageElapsed = 0; state.startedAt = performance.now();
    if (autoplay) startPlayback(media); else state.playing = false;
  }
  function startPlayback(media = document.getElementById('theater-' + (currentScene()?.type || 'image'))) {
    if (!currentScene()) return;
    window.TheaterHost?.pauseSong?.();
    state.playing = true; setSourceAudio(); const audio = $('theater-audio');
    if (currentScene().type === 'video') { audio?.pause(); media?.play().catch(() => {}); }
    else { if (state.theaterAudioSong && state.theaterAudioSong.mediaType !== 'video' && audio?.src) audio.play().catch(() => {}); if (state.settings.auto) state.timer = setTimeout(nextScene, Number(state.settings.duration) * 1000); }
    updateButtons(); updateProgressLoop();
  }
  function pausePlayback() { state.playing = false; clearTimer(); stopMediaOnly(); $('theater-audio')?.pause(); updateButtons(); }
  function togglePlayback() { if (state.playing) pausePlayback(); else startPlayback(); }
  function nextScene() { if (!state.scenes.length) return; showScene(state.current + 1, state.playing); }
  function prevScene() { if (!state.scenes.length) return; showScene(state.current - 1, state.playing); }
  function formatTime(value) { if (!Number.isFinite(value)) return '0:00'; const m = Math.floor(value / 60); const s = Math.floor(value % 60).toString().padStart(2, '0'); return `${m}:${s}`; }
  function updateButtons() { const btn = $('theater-play'); if (btn) btn.textContent = state.playing ? 'Ⅱ' : '▶'; }
  function updateProgress() {
    const scene = currentScene(); if (!scene) return;
    const media = document.getElementById('theater-' + scene.type); let current = 0, duration = scene.type === 'image' ? IMAGE_TIME / 1000 : media?.duration;
    if (scene.type === 'video' && media) { current = media.currentTime || 0; state.songVideoTime = current; duration = Number.isFinite(media.duration) ? media.duration : 0; }
    if (scene.type === 'image' && state.playing) current = Math.min(IMAGE_TIME / 1000, (performance.now() - state.startedAt) / 1000);
    const progress = $('theater-progress'); if (progress && duration) progress.value = Math.min(100, current / duration * 100);
    $('theater-current-time').textContent = formatTime(current); $('theater-duration').textContent = formatTime(duration || 0);
  }
  function updateProgressLoop() { if (!state.opened || !state.playing) return; updateProgress(); state.raf = requestAnimationFrame(updateProgressLoop); }
  function seek(value) { const scene = currentScene(); if (!scene) return; const media = document.getElementById('theater-' + scene.type); const percent = Number(value) / 100; if (scene.type === 'video' && media?.duration) { media.currentTime = media.duration * percent; state.songVideoTime = media.currentTime; } else if (scene.type === 'image') { state.startedAt = performance.now() - IMAGE_TIME * percent; } updateProgress(); }
  function openTheater() { window.TheaterHost?.pauseSong?.(); state.opened = true; state.playing = false; $('theater-modal').classList.add('is-open'); document.body.classList.add('theater-open'); loadState().then(() => { setSourceAudio(); showScene(state.current, false); const panel = $('theater-settings-panel'); if (panel) panel.hidden = true; populateSettings(); updateButtons(); }); }
  function closeTheater() { state.opened = false; pausePlayback(); $('theater-modal').classList.remove('is-open'); document.body.classList.remove('theater-open'); if (document.fullscreenElement) document.exitFullscreen?.(); }
  function toggleFullscreen() { const shell = $('theater-shell'); if (!document.fullscreenElement) shell.requestFullscreen?.(); else document.exitFullscreen?.(); }
  function refreshMusicList() {
    const select = $('theater-music-select'); if (!select) return;
    const songs = window.TheaterHost?.getSongs?.() || state.playlist || []; state.playlist = songs;
    select.innerHTML = '<option value="">Chọn bài trong playlist cũ</option>' + songs.map((song, i) => `<option value="${i}">${escapeHtml(song.title || 'Bài nhạc ' + (i + 1))} · ${escapeHtml(song.artist || '')}</option>`).join('');
    const current = songs.findIndex(song => song.audioUrl === state.theaterAudioSong?.audioUrl || song.id === state.theaterAudioSong?.id); if (current >= 0) select.value = String(current);
  }
  function toggleSettings() { const panel = $('theater-settings-panel'); if (!panel) return; panel.hidden = !panel.hidden; if (!panel.hidden) populateSettings(); }
  function chooseMusic() { const panel = $('theater-settings-panel'); if (panel?.hidden) toggleSettings(); else refreshMusicList(); $('theater-music-select')?.focus(); }
  function updateSetting(key, value) { const settingKey = key === 'video-audio' ? 'videoAudio' : key; state.settings[settingKey] = settingKey === 'duration' ? Number(value) : value; saveSettings(); const video = $('theater-video'); if (video && settingKey === 'videoAudio') video.muted = value === 'mute'; renderMini(); }
  function bind() {
    $('theater-open-btn')?.addEventListener('click', openTheater); $('theater-mini-open')?.addEventListener('click', openTheater); $('theater-close')?.addEventListener('click', closeTheater); $('theater-play')?.addEventListener('click', togglePlayback); $('theater-next')?.addEventListener('click', nextScene); $('theater-prev')?.addEventListener('click', prevScene); $('theater-fullscreen')?.addEventListener('click', toggleFullscreen); $('theater-progress')?.addEventListener('input', e => seek(e.target.value)); $('theater-volume')?.addEventListener('input', e => { $('theater-audio').volume = Number(e.target.value); });
    $('theater-mini-pause')?.addEventListener('click', pauseMusic); $('theater-mini-hide')?.addEventListener('click', hideInline); $('theater-mini-expand')?.addEventListener('click', openTheater); $('theater-mini-media')?.addEventListener('click', event => { if (event.target.closest('button')) return; const card = $('theater-mini-card'); const corner = card?.querySelector('.theater-mini-corner'); const visible = card?.classList.toggle('controls-visible'); if (corner) { corner.style.opacity = visible ? '1' : '0'; corner.style.transform = visible ? 'translateY(0)' : 'translateY(-4px)'; } toggleInlineOnly(); }); $('theater-stage')?.addEventListener('click', event => { if (event.target.closest('button,input,select')) return; togglePlayback(); }); $('theater-settings-open')?.addEventListener('click', toggleSettings); $('theater-save-settings')?.addEventListener('click', saveSettingsFromPanel); $('theater-settings-media')?.addEventListener('change', e => { addFiles(e.target.files); e.target.value = ''; }); $('theater-settings-cover')?.addEventListener('change', e => { addCover(e.target.files[0]); e.target.value = ''; }); $('theater-music-select')?.addEventListener('change', e => { if (e.target.value !== '') { const songs = window.TheaterHost?.getSongs?.() || []; const song = songs[Number(e.target.value)]; selectAudioSong(song); window.TheaterHost?.selectSong?.(e.target.value); } }); ['effect','transition','speed','duration','video-audio'].forEach(key => $('theater-' + key + '-select')?.addEventListener('change', e => updateSetting(key, e.target.value))); $('theater-auto-check')?.addEventListener('change', e => updateSetting('auto', e.target.checked));
    $('theater-clear')?.addEventListener('click', async () => { if (!confirm('Xóa toàn bộ cảnh trong rạp chiếu?')) return; for (const scene of state.scenes) await dbDelete(scene.id); state.scenes = []; renderAll(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.opened && !document.fullscreenElement) closeTheater(); }); $('theater-modal')?.addEventListener('click', e => { if (e.target.id === 'theater-modal') closeTheater(); });
  }
  function selectAudioSong(song) { state.theaterAudioSong = song ? { ...song, mediaType: song.mediaType || 'audio' } : null; setSourceAudio(); toast(song ? ('Đã chọn nhạc nền rạp: ' + song.title) : 'Rạp sẽ không dùng nhạc nền.'); }
  function setPlaylist(songs) { state.playlist = songs || []; refreshMusicList(); }
  function pauseMusic() { window.TheaterHost?.pauseSong?.(); state.selectedSong = state.selectedSong ? { ...state.selectedSong, isPlaying: false } : state.selectedSong; stopInline(); renderMini(); }
  function toggleInlineOnly() {
    if (!state.selectedSong) return;
    const nextPlaying = !state.selectedSong.isPlaying;
    state.selectedSong = { ...state.selectedSong, isPlaying: nextPlaying };
    renderMini();
  }
  function hideInline() { const card = $('theater-mini-card'); if (card) card.classList.add('is-hidden'); }
  function syncSong(song) {
    const previousId = state.selectedSong?.id || state.selectedSong?.storageId || state.selectedSong?.audioUrl;
    state.selectedSong = song || null;
    const nextId = song?.id || song?.storageId || song?.audioUrl;
    if (song?.isPlaying) $('theater-mini-card')?.classList.remove('is-hidden'); else $('theater-mini-card')?.classList.add('is-hidden');
    state.songScene = song?.mediaType === 'video' ? { id: 'song-video', type: 'video', name: song.title, url: song.audioUrl } : null;
    renderMini();
    if (state.opened && state.songScene && !state.scenes.length) showScene(0, Boolean(song.isPlaying));
  }
  function syncPlayback(playing) { state.selectedSong = state.selectedSong ? { ...state.selectedSong, isPlaying: playing } : state.selectedSong; renderMini(); }
  function pauseForPlaylist() { pausePlayback(); }
  window.TheaterApp = { open: openTheater, close: closeTheater, syncSong, syncPlayback, toggleSettings, chooseMusic, setPlaylist, selectAudioSong, pauseMusic, toggleInlineOnly, hideInline, pauseForPlaylist };
  window.addEventListener('DOMContentLoaded', () => { bind(); loadState(); });
})();
