(() => {
  'use strict';

  const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.content?.trim() || '';
  const supabaseUrl = meta('supabase-url');
  const supabaseAnonKey = meta('supabase-anon-key');
  const isConfigured = Boolean(
    supabaseUrl && supabaseAnonKey &&
    !supabaseUrl.includes('%VITE_') && !supabaseAnonKey.includes('%VITE_')
  );
  const gate = document.getElementById('cloud-auth-gate');
  const form = document.getElementById('cloud-auth-form');
  const emailInput = document.getElementById('cloud-auth-email');
  const passwordInput = document.getElementById('cloud-auth-password');
  const message = document.getElementById('cloud-auth-message');
  const signInButton = document.getElementById('cloud-sign-in');
  const signUpButton = document.getElementById('cloud-sign-up');
  const migrationToggle = document.getElementById('cloud-import-local');
  const accountLabel = document.getElementById('cloud-account-label');
  const accountStatus = document.getElementById('cloud-account-status');
  const signOutButton = document.getElementById('cloud-sign-out');
  let user = null;
  let mode = 'signin';
  let activeUserId = null;
  let imagePaths = {};
  let supabaseClient = null;
  const imageFields = ['herImage', 'hisImage', 'backgroundImage', 'heroImage', 'vinylImage', 'songImage'];
  const bucket = 'user-media';
  const MAX_AUDIO_BYTES = 50 * 1024 * 1024;

  function setMessage(text, isError = false) {
    if (!message) return;
    message.textContent = text;
    message.className = `mt-3 min-h-5 text-sm ${isError ? 'text-red-600' : 'text-pink-600'}`;
  }

  function setConfiguredStatus(text) {
    if (accountStatus) accountStatus.textContent = text;
  }

  function openGate() {
    if (gate) gate.classList.remove('hidden');
  }

  function closeGate() {
    if (gate) gate.classList.add('hidden');
  }

  function setMode(nextMode) {
    mode = nextMode;
    signInButton?.classList.toggle('ring-2', mode === 'signin');
    signInButton?.classList.toggle('ring-pink-300', mode === 'signin');
    signUpButton?.classList.toggle('ring-2', mode === 'signup');
    signUpButton?.classList.toggle('ring-pink-300', mode === 'signup');
    const submit = document.getElementById('cloud-auth-submit');
    if (submit) submit.textContent = mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản';
    setMessage(mode === 'signup' ? 'Tạo tài khoản riêng để dùng dữ liệu của bạn trên mọi thiết bị.' : 'Đăng nhập để tiếp tục dùng kho riêng của bạn.');
  }

  async function signImage(path) {
    const { data, error } = await supabaseClient.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
    if (error) throw error;
    return data.signedUrl;
  }

  async function getHydratedProfile(row) {
    const nextProfile = { ...window.LoveSpaceApp.getDefaultProfile(), ...(row.profile || {}) };
    imagePaths = row.image_paths || {};
    for (const field of imageFields) {
      const path = imagePaths[field];
      if (path) nextProfile[field] = await signImage(path);
    }
    return nextProfile;
  }

  async function uploadProfileImage(field, dataUrl) {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const extension = blob.type === 'image/png' ? 'png' : 'jpg';
    const path = `${user.id}/profile/${field}.${extension}`;
    const { error } = await supabaseClient.storage.from(bucket).upload(path, blob, {
      upsert: true,
      contentType: blob.type || 'image/jpeg',
      cacheControl: '3600'
    });
    if (error) throw error;
    imagePaths[field] = path;
  }

  async function saveProfile(profile) {
    if (!user) throw new Error('Hãy đăng nhập lại để lưu vào kho cloud.');
    for (const field of imageFields) {
      const value = profile[field];
      if (typeof value === 'string' && value.startsWith('data:image/')) {
        await uploadProfileImage(field, value);
      }
    }
    const cloudProfile = { ...profile };
    imageFields.forEach((field) => {
      if (imagePaths[field]) cloudProfile[field] = null;
    });
    const { error } = await supabaseClient.from('user_profiles').upsert({
      user_id: user.id,
      profile: cloudProfile,
      image_paths: imagePaths,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
  }

  async function loadOrCreateProfile() {
    const { data, error } = await supabaseClient.from('user_profiles')
      .select('profile,image_paths')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      const hydrated = await getHydratedProfile(data);
      window.LoveSpaceApp.setProfile(hydrated, user.id);
      return;
    }

    let firstProfile = window.LoveSpaceApp.getDefaultProfile();
    if (migrationToggle?.checked) {
      try {
        const localProfile = JSON.parse(localStorage.getItem('our_love_space_profile_v1') || 'null');
        if (localProfile && typeof localProfile === 'object') firstProfile = { ...firstProfile, ...localProfile };
      } catch (error) {
        console.warn('Không thể nhập cấu hình cũ từ trình duyệt:', error);
      }
    }
    window.LoveSpaceApp.setProfile(firstProfile, user.id);
    await saveProfile(firstProfile);
  }

  async function saveSong(file) {
    if (!user) throw new Error('Hãy đăng nhập để tải nhạc vào kho cloud.');
    if (file.size > MAX_AUDIO_BYTES) throw new Error('Mỗi bài nhạc cần nhỏ hơn 50 MB.');
    const id = crypto.randomUUID();
    const extension = (file.name.split('.').pop() || 'mp3').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'mp3';
    const path = `${user.id}/music/${id}.${extension}`;
    const { error: uploadError } = await supabaseClient.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: file.type || 'audio/mpeg',
      cacheControl: '3600'
    });
    if (uploadError) throw uploadError;
    const title = file.name.replace(/\.[^/.]+$/, '') || 'Bài hát mới';
    const { error: rowError } = await supabaseClient.from('user_music').insert({
      id,
      user_id: user.id,
      object_path: path,
      title,
      artist: 'Nhạc tải lên cá nhân',
      content_type: file.type || 'audio/mpeg',
      file_size: file.size
    });
    if (rowError) {
      await supabaseClient.storage.from(bucket).remove([path]);
      throw rowError;
    }
    const { data: signed, error: signedError } = await supabaseClient.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
    if (signedError) throw signedError;
    return { title, artist: 'Nhạc tải lên cá nhân', cover: '', audioUrl: signed.signedUrl, duration: 0, storageId: `cloud-${id}` };
  }

  async function restoreSongs() {
    if (!user) return;
    const { data, error } = await supabaseClient.from('user_music')
      .select('id,object_path,title,artist,content_type,file_size')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (error) throw error;
    const restored = [];
    for (const record of data || []) {
      const { data: signed, error: signedError } = await supabaseClient.storage.from(bucket)
        .createSignedUrl(record.object_path, 60 * 60 * 24 * 7);
      if (signedError) throw signedError;
      restored.push({
        title: record.title,
        artist: record.artist || 'Nhạc tải lên cá nhân',
        cover: '',
        audioUrl: signed.signedUrl,
        duration: 0,
        storageId: `cloud-${record.id}`
      });
    }
    window.LoveSpaceApp.restoreCloudSongs(restored);
  }

  async function activateSession(session) {
    user = session?.user || null;
    if (!user) {
      activeUserId = null;
      signOutButton?.classList.add('hidden');
      openGate();
      if (accountLabel) accountLabel.textContent = 'Chưa đăng nhập';
      setConfiguredStatus('Đăng nhập để đồng bộ ảnh và nhạc riêng trên thiết bị này.');
      return;
    }
    if (activeUserId === user.id) return;
    activeUserId = user.id;
    signOutButton?.classList.remove('hidden');
    imagePaths = {};
    closeGate();
    if (accountLabel) accountLabel.textContent = user.email || 'Tài khoản đã đăng nhập';
    setConfiguredStatus('Đang tải dữ liệu riêng của tài khoản…');
    try {
      await loadOrCreateProfile();
      await restoreSongs();
      setConfiguredStatus('Ảnh và nhạc được đồng bộ riêng với tài khoản này.');
    } catch (error) {
      console.error('Không thể tải dữ liệu cloud:', error);
      activeUserId = null;
      setConfiguredStatus('Không kết nối được kho cloud. Hãy kiểm tra cấu hình Supabase và thử tải lại.');
      setMessage(error.message || 'Không thể tải dữ liệu cloud.', true);
      openGate();
    }
  }

  const api = {
    isConfigured,
    get userId() { return user?.id || null; },
    async saveProfile(profile) {
      if (isConfigured) await saveProfile(profile);
    },
    async uploadSong(file) {
      return saveSong(file);
    }
  };
  window.loveCloud = api;

  if (!isConfigured) {
    setConfiguredStatus('Kho cloud chưa được cấu hình. Dữ liệu hiện tại chỉ lưu trên trình duyệt này.');
    if (accountLabel) accountLabel.textContent = 'Cloud chưa cấu hình';
    return;
  }
  if (!window.supabase?.createClient) {
    setConfiguredStatus('Không tải được thư viện đăng nhập cloud. Kiểm tra kết nối mạng rồi tải lại.');
    return;
  }

  supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  signInButton?.addEventListener('click', () => setMode('signin'));
  signUpButton?.addEventListener('click', () => setMode('signup'));
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput?.value.trim();
    const password = passwordInput?.value || '';
    if (!email || password.length < 8) {
      setMessage('Nhập email và mật khẩu tối thiểu 8 ký tự.', true);
      return;
    }
    const submit = document.getElementById('cloud-auth-submit');
    if (submit) { submit.disabled = true; submit.textContent = 'Đang xử lý…'; }
    try {
      const result = mode === 'signup'
        ? await supabaseClient.auth.signUp({ email, password })
        : await supabaseClient.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (mode === 'signup' && !result.data.session) {
        setMessage('Project đang yêu cầu xác nhận email. Hãy tắt “Confirm email” trong Supabase Authentication để đăng nhập ngay, không cần xác nhận.', true);
      } else if (result.data.session) {
        await activateSession(result.data.session);
      }
    } catch (error) {
      setMessage(error.message || 'Đăng nhập không thành công.', true);
    } finally {
      if (submit) { submit.disabled = false; submit.textContent = mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'; }
    }
  });
  signOutButton?.addEventListener('click', async () => {
    if (!confirm('Đăng xuất tài khoản này trên thiết bị hiện tại?')) return;
    await supabaseClient.auth.signOut();
    location.reload();
  });

  setMode('signin');
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => activateSession(session), 0);
  });
  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) setMessage(error.message, true);
    return activateSession(data?.session || null);
  }).catch((error) => {
    console.error('Không thể khôi phục phiên đăng nhập:', error);
    openGate();
    setMessage('Không thể khôi phục phiên. Hãy tải lại trang.', true);
  });
})();
