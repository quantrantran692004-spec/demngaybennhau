(() => {
  'use strict';

  const STICKERS = ['💖', '💕', '🥰', '🐻', '🐱', '🌸', '🧸', '😽', '😘', '🥹', '😍', '❤️‍🔥', '🎀', '🍓', '💌', '✨'];
  const MAX_VOICE_BYTES = 10 * 1024 * 1024;
  const MAX_RECORD_SECONDS = 90;
  const $ = (id) => document.getElementById(id);
  const CHAT_BUBBLE_ICON = `<svg class="chat-bubble-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false"><path d="M13 10H8.75a5.25 5.25 0 0 0-5.25 5.25v6.5A5.25 5.25 0 0 0 8.75 27H10v4l5-4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".58"/><path d="M14 4.75h13.25a5.25 5.25 0 0 1 5.25 5.25v8.25a5.25 5.25 0 0 1-5.25 5.25h-3.5l-5 4.25V23.5H14a5.25 5.25 0 0 1-5.25-5.25V10A5.25 5.25 0 0 1 14 4.75Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15" cy="14.5" r="1.25" fill="currentColor"/><circle cx="20.5" cy="14.5" r="1.25" fill="currentColor"/><circle cx="26" cy="14.5" r="1.25" fill="currentColor"/></svg>`;
  const shellMarkup = `
    <div id="chat-shell" aria-hidden="true">
      <section class="chat-window" role="dialog" aria-modal="true" aria-labelledby="chat-title">
        <header class="chat-header">
          <div class="chat-header-brand"><span class="chat-header-mark" aria-hidden="true">${CHAT_BUBBLE_ICON}</span><div><div class="chat-header-kicker">Her Private World · Kết nối riêng tư</div><h2 id="chat-title">Tin nhắn riêng</h2></div></div>
          <button id="chat-close" class="chat-close" type="button" aria-label="Đóng tin nhắn">×</button>
        </header>
        <div class="chat-workspace">
          <aside id="chat-sidebar" class="chat-sidebar" aria-label="Bạn bè và lời mời">
            <div id="chat-login-card" class="chat-login-card">
              <strong>Đăng nhập để bắt đầu kết bạn.</strong><br>
              Chat chỉ hoạt động giữa hai tài khoản đã chấp nhận kết bạn; dữ liệu hội thoại được tách theo từng cặp bạn bè.
              <button id="chat-login-open" class="chat-btn chat-btn-primary" type="button" style="width:100%;margin-top:.75rem">Đăng nhập / tạo tài khoản</button>
            </div>
            <div id="chat-account-area" class="chat-hidden">
              <section class="chat-card">
                <p class="chat-card-title">Tên hiển thị của bạn</p>
                <form id="chat-name-form" class="chat-code-row">
                  <input id="chat-name-input" class="chat-field" maxlength="40" placeholder="Ví dụ: Hương" aria-label="Tên bạn bè sẽ nhìn thấy">
                  <button class="chat-btn" type="submit">Lưu</button>
                </form>
                <p class="chat-help">Tên này chỉ hiện với người đang có lời mời hoặc đã kết bạn với bạn.</p>
                <p id="chat-name-status" class="chat-status" role="status"></p>
              </section>

              <section class="chat-card">
                <p class="chat-card-title">Mã kết bạn của bạn</p>
                <div class="chat-code-row"><code id="chat-own-code" class="chat-code-value">Đang tải…</code>
                  <button id="chat-share-code" class="chat-btn chat-btn-icon" type="button" aria-label="Chia sẻ mã kết bạn" title="Chia sẻ mã">↗</button>
                </div>
                <p class="chat-help">Chia sẻ mã này cho người bạn muốn kết nối. Họ cần gửi lời mời và bạn chấp nhận trước khi hai người nhắn tin.</p>
              </section>

              <section class="chat-card">
                <p class="chat-card-title">Thêm bạn bằng mã</p>
                <form id="chat-add-friend-form" class="space-y-2">
                  <input id="chat-friend-code" class="chat-field" maxlength="10" autocomplete="off" autocapitalize="characters" placeholder="Nhập mã 10 ký tự" aria-label="Mã kết bạn">
                  <button id="chat-send-request" class="chat-btn chat-btn-primary" type="submit" style="width:100%">Gửi lời mời kết bạn</button>
                </form>
                <p id="chat-add-status" class="chat-status" role="status"></p>
              </section>

              <section class="chat-card">
                <p class="chat-sidebar-title">Lời mời đang chờ</p>
                <div id="chat-incoming-list" class="chat-list"><div class="chat-list-empty">Chưa có lời mời mới.</div></div>
                <div id="chat-outgoing-list" class="chat-list" style="margin-top:.45rem"></div>
              </section>

              <section class="chat-card" style="margin-bottom:.25rem">
                <p class="chat-sidebar-title">Bạn bè</p>
                <div id="chat-friends-list" class="chat-list"><div class="chat-list-empty">Bạn chưa kết bạn với ai.</div></div>
              </section>
            </div>
          </aside>

          <main id="chat-thread" class="chat-thread" aria-label="Cuộc trò chuyện">
            <div id="chat-empty-thread" class="chat-empty-thread">Chọn một người bạn để mở cuộc trò chuyện.<br>Chỉ người đã kết bạn mới có thể nhắn tin.</div>
            <div id="chat-thread-content" class="chat-hidden" style="display:flex;min-height:0;flex:1;flex-direction:column">
              <header class="chat-thread-header">
                <button id="chat-back" class="chat-back" type="button" aria-label="Quay lại danh sách bạn bè">‹</button>
                <span class="chat-contact-avatar" aria-hidden="true">${CHAT_BUBBLE_ICON}</span>
                <div style="min-width:0"><h3 id="chat-thread-name" class="chat-thread-name">Bạn</h3><p id="chat-thread-hint" class="chat-thread-hint">Cuộc trò chuyện riêng 1–1</p></div>
              </header>
              <div id="chat-messages" class="chat-messages" aria-live="polite"><div class="chat-list-empty">Đang tải tin nhắn…</div></div>
              <div class="chat-composer">
                <div id="chat-recording-row" class="chat-recording-row chat-hidden"><span id="chat-voice-status">Đang ghi âm…</span>
                  <div class="chat-request-actions">
                    <button id="chat-voice-stop" class="chat-btn" type="button">Dừng</button>
                    <button id="chat-voice-cancel" class="chat-btn" type="button">Hủy</button>
                    <button id="chat-voice-send" class="chat-btn chat-btn-primary chat-hidden" type="button">Gửi tin thoại</button>
                  </div>
                </div>
                <audio id="chat-voice-preview" class="chat-voice-player chat-hidden" controls preload="metadata"></audio>
                <div id="chat-composer-status" class="chat-status" role="status"></div>
                <form id="chat-composer-form" class="chat-composer-form">
                  <textarea id="chat-message-input" class="chat-field" maxlength="2000" rows="1" placeholder="Viết tin nhắn riêng…" aria-label="Nội dung tin nhắn"></textarea>
                  <div class="chat-composer-actions">
                    <button id="chat-voice-start" class="chat-btn chat-btn-icon" type="button" title="Ghi tin thoại" aria-label="Ghi tin nhắn thoại">🎙</button>
                    <button id="chat-sticker-toggle" class="chat-btn chat-btn-icon" type="button" title="Chọn sticker" aria-label="Chọn sticker">☺</button>
                    <button id="chat-heart-send" class="chat-btn chat-btn-icon" type="button" title="Bắn tim" aria-label="Bắn tim">💖</button>
                    <button id="chat-text-send" class="chat-btn chat-btn-primary chat-btn-icon" type="submit" title="Gửi tin nhắn" aria-label="Gửi tin nhắn">➤</button>
                  </div>
                </form>
                <div id="chat-sticker-picker" class="chat-sticker-picker chat-hidden" aria-label="Sticker"></div>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>`;

  function init() {
    if (!$('chat-open') || $('chat-shell')) return;
    document.body.insertAdjacentHTML('beforeend', shellMarkup);
    const shell = $('chat-shell');
    const client = window.loveCloud?.client || null;
    let userId = null;
    let currentUser = null;
    let activeFriend = null;
    let relationships = [];
    let requestChannel = null;
    let messageChannel = null;
    let recorder = null;
    let recorderStream = null;
    let recorderTimer = null;
    let recorderStartedAt = 0;
    let recorderCancelled = false;
    let voiceChunks = [];
    let pendingVoice = null;
    let pendingVoicePeer = null;

    function setStatus(id, text, kind = '') {
      const el = $(id);
      if (!el) return;
      el.textContent = text;
      el.classList.toggle('is-error', kind === 'error');
      el.classList.toggle('is-success', kind === 'success');
    }

    function openChat() {
      shell.classList.add('is-open');
      shell.setAttribute('aria-hidden', 'false');
      window.lockMobilePageScroll?.();
      $('chat-close')?.focus({ preventScroll: true });
      if (!client) {
        $('chat-login-card').innerHTML = '<strong>Chat cloud chưa sẵn sàng.</strong><br>Hãy kiểm tra cấu hình Supabase của website rồi tải lại trang.';
        $('chat-login-open')?.classList.add('chat-hidden');
        $('chat-account-area')?.classList.add('chat-hidden');
        return;
      }
      if (!userId) $('chat-login-open')?.focus({ preventScroll: true });
    }

    function closeChat() {
      if ((recorder && recorder.state !== 'inactive') || pendingVoice) cancelRecording();
      shell.classList.remove('is-open', 'chat-thread-active');
      shell.setAttribute('aria-hidden', 'true');
      window.unlockMobilePageScroll?.();
      $('chat-open')?.focus({ preventScroll: true });
    }

    $('chat-open').addEventListener('click', openChat);
    $('chat-close').addEventListener('click', closeChat);
    shell.addEventListener('click', (event) => { if (event.target === shell) closeChat(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && shell.classList.contains('is-open')) closeChat(); });
    $('chat-login-open').addEventListener('click', () => document.getElementById('cloud-open-auth')?.click());
    $('chat-back').addEventListener('click', () => shell.classList.remove('chat-thread-active'));

    for (const sticker of STICKERS) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chat-sticker';
      button.textContent = sticker;
      button.setAttribute('aria-label', `Gửi sticker ${sticker}`);
      button.addEventListener('click', () => sendMessage('sticker', sticker));
      $('chat-sticker-picker').append(button);
    }

    $('chat-sticker-toggle').addEventListener('click', () => $('chat-sticker-picker').classList.toggle('chat-hidden'));
    $('chat-heart-send').addEventListener('click', () => sendMessage('heart', '💖'));
    $('chat-composer-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = $('chat-message-input');
      const text = input.value.trim();
      if (!text) return;
      sendMessage('text', text).then((ok) => { if (ok) input.value = ''; });
    });

    $('chat-name-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!client || !userId) return;
      const displayName = $('chat-name-input').value.trim();
      if (!displayName || displayName.length > 40) return setStatus('chat-name-status', 'Nhập tên từ 1 đến 40 ký tự.', 'error');
      const { error } = await client.from('chat_profiles').update({ display_name: displayName, updated_at: new Date().toISOString() }).eq('user_id', userId);
      if (error) return setStatus('chat-name-status', error.message || 'Không lưu được tên.', 'error');
      setStatus('chat-name-status', 'Đã lưu. Tên mới sẽ hiện với bạn bè.', 'success');
      await loadRelationships();
      if (activeFriend) setThreadName(activeFriend);
    });

    $('chat-add-friend-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!client || !userId) return setStatus('chat-add-status', 'Hãy đăng nhập để gửi lời mời.', 'error');
      const code = $('chat-friend-code').value.trim().toUpperCase().replace(/\s/g, '');
      if (!/^[A-F0-9]{10}$/.test(code)) return setStatus('chat-add-status', 'Mã kết bạn gồm 10 ký tự chữ/số.', 'error');
      const button = $('chat-send-request');
      button.disabled = true;
      button.textContent = 'Đang gửi…';
      setStatus('chat-add-status', '');
      try {
        const { error } = await client.rpc('request_chat_friend_by_code', { p_code: code });
        if (error) throw error;
        $('chat-friend-code').value = '';
        setStatus('chat-add-status', 'Đã gửi lời mời. Hai người chỉ nhắn được sau khi người nhận chấp nhận.', 'success');
        await loadRelationships();
      } catch (error) {
        setStatus('chat-add-status', error.message || 'Chưa gửi được lời mời.', 'error');
      } finally {
        button.disabled = false;
        button.textContent = 'Gửi lời mời kết bạn';
      }
    });

    $('chat-share-code').addEventListener('click', async () => {
      const code = $('chat-own-code').textContent.trim();
      if (!/^[A-F0-9]{10}$/.test(code)) return;
      const link = new URL('/', location.origin);
      link.searchParams.set('addfriend', code);
      const shareText = `Mã kết bạn Her Private World: ${code}\nMở link để gửi lời mời: ${link.toString()}`;
      try {
        if (navigator.share) await navigator.share({ title: 'Kết bạn riêng tư', text: shareText, url: link.toString() });
        else { await copyText(shareText); setStatus('chat-add-status', 'Đã chép mã và link mời vào bộ nhớ tạm.', 'success'); }
      } catch (error) {
        if (error?.name !== 'AbortError') {
          try { await copyText(shareText); setStatus('chat-add-status', 'Đã chép mã và link mời vào bộ nhớ tạm.', 'success'); }
          catch { setStatus('chat-add-status', `Mã kết bạn của bạn là ${code}.`, 'success'); }
        }
      }
    });

    async function copyText(text) {
      if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
      const input = document.createElement('textarea');
      input.value = text;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.append(input);
      input.select();
      const copied = document.execCommand('copy');
      input.remove();
      if (!copied) throw new Error('Không chép được vào bộ nhớ tạm.');
    }

    function canonicalPair(first, second) {
      return first < second ? [first, second] : [second, first];
    }

    function setThreadName(friend) {
      $('chat-thread-name').textContent = friend.display_name || 'Bạn của mình';
    }

    function displayNameMap(rows) {
      return new Map((rows || []).map((row) => [row.user_id, row.display_name || 'Bạn của mình']));
    }

    function renderEmptyList(container, text) {
      container.replaceChildren();
      const empty = document.createElement('div');
      empty.className = 'chat-list-empty';
      empty.textContent = text;
      container.append(empty);
    }

    async function loadRelationships() {
      if (!client || !userId) return;
      const [lowResult, highResult, incomingResult, outgoingResult] = await Promise.all([
        client.from('chat_friendships').select('user_low,user_high,created_at').eq('user_low', userId).order('created_at', { ascending: false }),
        client.from('chat_friendships').select('user_low,user_high,created_at').eq('user_high', userId).order('created_at', { ascending: false }),
        client.from('chat_friend_requests').select('id,requester_id,recipient_id,created_at').eq('recipient_id', userId).eq('status', 'pending').order('created_at', { ascending: false }),
        client.from('chat_friend_requests').select('id,requester_id,recipient_id,created_at').eq('requester_id', userId).eq('status', 'pending').order('created_at', { ascending: false })
      ]);
      const error = lowResult.error || highResult.error || incomingResult.error || outgoingResult.error;
      if (error) {
        setStatus('chat-composer-status', error.message || 'Không tải được danh sách chat. Kiểm tra migration Supabase.', 'error');
        return;
      }
      const allFriendships = [...(lowResult.data || []), ...(highResult.data || [])];
      const friendIds = [...new Set(allFriendships.map((row) => row.user_low === userId ? row.user_high : row.user_low))];
      const incoming = incomingResult.data || [];
      const outgoing = outgoingResult.data || [];
      const cardIds = [...new Set([...friendIds, ...incoming.map((row) => row.requester_id), ...outgoing.map((row) => row.recipient_id)])];
      let cards = [];
      if (cardIds.length) {
        const cardResult = await client.from('chat_profiles').select('user_id,display_name').in('user_id', cardIds);
        if (cardResult.error) {
          setStatus('chat-composer-status', cardResult.error.message || 'Không tải được tên người chat.', 'error');
          return;
        }
        cards = cardResult.data || [];
      }
      const names = displayNameMap(cards);
      relationships = friendIds.map((id) => ({ id, display_name: names.get(id) || 'Bạn của mình' }));
      renderFriends();
      renderRequests(incoming, outgoing, names);
    }

    function renderFriends() {
      const list = $('chat-friends-list');
      if (!relationships.length) return renderEmptyList(list, 'Bạn chưa kết bạn với ai. Chia sẻ mã của bạn hoặc nhập mã của một người bạn.');
      list.replaceChildren();
      relationships.forEach((friend) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `chat-contact${activeFriend?.id === friend.id ? ' is-active' : ''}`;
        const avatar = document.createElement('span');
        avatar.className = 'chat-contact-avatar';
        avatar.innerHTML = CHAT_BUBBLE_ICON;
        const detail = document.createElement('span');
        detail.style.minWidth = '0';
        const name = document.createElement('span');
        name.className = 'chat-contact-name';
        name.textContent = friend.display_name;
        const sub = document.createElement('span');
        sub.className = 'chat-contact-sub';
        sub.textContent = 'Bạn bè · nhắn tin riêng';
        detail.append(name, sub);
        button.append(avatar, detail);
        button.addEventListener('click', () => openThread(friend));
        list.append(button);
      });
    }

    function renderRequests(incoming, outgoing, names) {
      const inList = $('chat-incoming-list');
      if (!incoming.length) renderEmptyList(inList, 'Chưa có lời mời mới.');
      else {
        inList.replaceChildren();
        incoming.forEach((request) => {
          const item = document.createElement('div');
          item.className = 'chat-request';
          const label = document.createElement('span');
          label.className = 'chat-request-name';
          label.textContent = names.get(request.requester_id) || 'Một người muốn kết bạn';
          const actions = document.createElement('span');
          actions.className = 'chat-request-actions';
          actions.append(makeRequestAction('Chấp nhận', request.id, 'accepted'), makeRequestAction('Từ chối', request.id, 'declined'));
          item.append(label, actions);
          inList.append(item);
        });
      }
      const outList = $('chat-outgoing-list');
      if (!outgoing.length) { outList.replaceChildren(); return; }
      outList.replaceChildren();
      outgoing.forEach((request) => {
        const item = document.createElement('div');
        item.className = 'chat-request';
        const label = document.createElement('span');
        label.className = 'chat-request-name';
        label.textContent = `Đang chờ ${names.get(request.recipient_id) || 'người nhận'} chấp nhận`;
        item.append(label);
        outList.append(item);
      });
    }

    function makeRequestAction(label, requestId, status) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chat-btn${status === 'accepted' ? ' chat-btn-primary' : ''}`;
      button.textContent = label;
      button.addEventListener('click', async () => {
        button.disabled = true;
        const { error } = await client.from('chat_friend_requests').update({ status }).eq('id', requestId).eq('recipient_id', userId).eq('status', 'pending');
        if (error) {
          setStatus('chat-composer-status', error.message || 'Không cập nhật được lời mời.', 'error');
          button.disabled = false;
          return;
        }
        await loadRelationships();
      });
      return button;
    }

    async function openThread(friend) {
      activeFriend = friend;
      shell.classList.add('chat-thread-active');
      $('chat-empty-thread').classList.add('chat-hidden');
      $('chat-thread-content').classList.remove('chat-hidden');
      setThreadName(friend);
      setStatus('chat-composer-status', '');
      $('chat-sticker-picker').classList.add('chat-hidden');
      await loadMessages();
      subscribeToMessages();
      renderFriends();
      $('chat-message-input').focus({ preventScroll: true });
    }

    async function loadMessages() {
      if (!client || !userId || !activeFriend) return;
      const [low, high] = canonicalPair(userId, activeFriend.id);
      const { data, error } = await client.from('chat_messages')
        .select('id,user_low,user_high,sender_id,message_type,content,media_path,created_at')
        .eq('user_low', low).eq('user_high', high)
        .order('created_at', { ascending: false }).limit(100);
      if (error) {
        $('chat-messages').replaceChildren();
        const empty = document.createElement('div');
        empty.className = 'chat-list-empty';
        empty.textContent = error.message || 'Không tải được tin nhắn. Hãy kiểm tra cấu hình Supabase.';
        $('chat-messages').append(empty);
        return;
      }
      const messages = (data || []).reverse();
      const container = $('chat-messages');
      container.replaceChildren();
      if (!messages.length) {
        const first = document.createElement('div');
        first.className = 'chat-list-empty';
        first.textContent = 'Cuộc trò chuyện bắt đầu từ đây. Hãy gửi lời chào đầu tiên.';
        container.append(first);
        return;
      }
      for (const row of messages) container.append(await makeMessage(row));
      container.scrollTop = container.scrollHeight;
    }

    async function makeMessage(row) {
      const rowEl = document.createElement('div');
      rowEl.className = `chat-message-row${row.sender_id === userId ? ' is-mine' : ''}`;
      rowEl.dataset.messageId = row.id;
      const bubble = document.createElement('div');
      bubble.className = 'chat-message-bubble';
      if (row.message_type === 'sticker') {
        bubble.classList.add('is-sticker');
        bubble.textContent = row.content || '💌';
      } else if (row.message_type === 'heart') {
        bubble.classList.add('is-heart');
        bubble.textContent = row.content || '💖';
      } else if (row.message_type === 'voice') {
        const player = document.createElement('audio');
        player.className = 'chat-voice-player';
        player.controls = true;
        player.preload = 'none';
        player.setAttribute('aria-label', 'Tin nhắn thoại');
        const { data, error } = await client.storage.from('chat-voice').createSignedUrl(row.media_path, 60 * 60);
        if (error) {
          player.setAttribute('aria-label', 'Không tải được tin nhắn thoại');
          bubble.textContent = 'Tin nhắn thoại không khả dụng.';
        } else {
          player.src = data.signedUrl;
          bubble.append(player);
        }
      } else {
        const text = document.createElement('div');
        text.textContent = row.content || '';
        bubble.append(text);
      }
      if (row.message_type !== 'sticker' && row.message_type !== 'heart') {
        const time = document.createElement('div');
        time.className = 'chat-message-time';
        time.textContent = new Date(row.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        bubble.append(time);
      }
      rowEl.append(bubble);
      return rowEl;
    }

    function subscribeToMessages() {
      if (!client || !activeFriend) return;
      if (messageChannel) client.removeChannel(messageChannel);
      const [low, high] = canonicalPair(userId, activeFriend.id);
      messageChannel = client.channel(`chat-messages-${userId}-${activeFriend.id}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `user_low=eq.${low}`
        }, (payload) => {
          if (payload.new?.user_high === high && activeFriend?.id === (payload.new?.user_low === userId ? payload.new?.user_high : payload.new?.user_low)) {
            loadMessages();
          }
        })
        .subscribe();
    }

    async function sendMessage(messageType, content) {
      if (!client || !userId || !activeFriend) return false;
      if (messageType === 'text' && content.length > 2000) {
        setStatus('chat-composer-status', 'Tin nhắn tối đa 2.000 ký tự.', 'error');
        return false;
      }
      const [low, high] = canonicalPair(userId, activeFriend.id);
      const insert = { user_low: low, user_high: high, sender_id: userId, message_type: messageType, content, media_path: null };
      const { error } = await client.from('chat_messages').insert(insert);
      if (error) {
        setStatus('chat-composer-status', error.message || 'Không gửi được tin nhắn.', 'error');
        return false;
      }
      setStatus('chat-composer-status', '');
      $('chat-sticker-picker').classList.add('chat-hidden');
      await loadMessages();
      return true;
    }

    $('chat-voice-start').addEventListener('click', startRecording);
    $('chat-voice-stop').addEventListener('click', stopRecording);
    $('chat-voice-cancel').addEventListener('click', cancelRecording);
    $('chat-voice-send').addEventListener('click', sendVoice);

    function setVoiceUi(state) {
      const row = $('chat-recording-row');
      row.classList.toggle('chat-hidden', state === 'idle');
      $('chat-voice-start').classList.toggle('chat-hidden', state !== 'idle');
      $('chat-voice-stop').classList.toggle('chat-hidden', state !== 'recording');
      $('chat-voice-cancel').classList.toggle('chat-hidden', state === 'idle');
      $('chat-voice-send').classList.toggle('chat-hidden', state !== 'ready');
      $('chat-voice-preview').classList.toggle('chat-hidden', state !== 'ready');
      $('chat-text-send').disabled = state === 'recording';
    }

    function getSupportedVoiceType() {
      if (!window.MediaRecorder?.isTypeSupported) return '';
      return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg']
        .find((type) => MediaRecorder.isTypeSupported(type)) || '';
    }

    async function startRecording() {
      if (!activeFriend) return setStatus('chat-composer-status', 'Hãy chọn một người bạn trước.', 'error');
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return setStatus('chat-composer-status', 'Trình duyệt này chưa hỗ trợ ghi tin nhắn thoại.', 'error');
      try {
        recorderStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = getSupportedVoiceType();
        recorder = new MediaRecorder(recorderStream, mimeType ? { mimeType } : undefined);
        voiceChunks = [];
        pendingVoice = null;
        pendingVoicePeer = activeFriend.id;
        recorderCancelled = false;
        recorder.ondataavailable = (event) => { if (event.data?.size) voiceChunks.push(event.data); };
        recorder.onstop = () => {
          recorderStream?.getTracks().forEach((track) => track.stop());
          recorderStream = null;
          if (recorderCancelled) {
            voiceChunks = [];
            pendingVoice = null;
            setVoiceUi('idle');
            setStatus('chat-composer-status', 'Đã hủy bản ghi.');
            return;
          }
          const type = (recorder?.mimeType || mimeType || 'audio/webm').split(';')[0];
          pendingVoice = new Blob(voiceChunks, { type });
          voiceChunks = [];
          if (!pendingVoice.size || pendingVoice.size > MAX_VOICE_BYTES) {
            pendingVoice = null;
            setVoiceUi('idle');
            return setStatus('chat-composer-status', 'Voice rỗng hoặc vượt quá 10 MB. Hãy ghi ngắn hơn.', 'error');
          }
          $('chat-voice-preview').src = URL.createObjectURL(pendingVoice);
          $('chat-voice-status').textContent = `Đã ghi ${formatDuration((Date.now() - recorderStartedAt) / 1000)} · có thể nghe thử rồi gửi`;
          setVoiceUi('ready');
        };
        recorder.start();
        recorderStartedAt = Date.now();
        setVoiceUi('recording');
        updateRecordingClock();
        recorderTimer = window.setInterval(updateRecordingClock, 500);
        setStatus('chat-composer-status', 'Cho phép micro trong trình duyệt; bản ghi tối đa 90 giây.');
      } catch (error) {
        recorderStream?.getTracks().forEach((track) => track.stop());
        recorderStream = null;
        setVoiceUi('idle');
        setStatus('chat-composer-status', error.message || 'Không truy cập được micro. Hãy kiểm tra quyền microphone.', 'error');
      }
    }

    function updateRecordingClock() {
      const seconds = (Date.now() - recorderStartedAt) / 1000;
      $('chat-voice-status').textContent = `Đang ghi âm · ${formatDuration(seconds)} / 01:30`;
      if (seconds >= MAX_RECORD_SECONDS) stopRecording();
    }

    function formatDuration(seconds) {
      const safe = Math.max(0, Math.floor(seconds));
      return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
    }

    function clearRecorderTimer() {
      if (recorderTimer) window.clearInterval(recorderTimer);
      recorderTimer = null;
    }

    function stopRecording() {
      clearRecorderTimer();
      if (recorder && recorder.state !== 'inactive') recorder.stop();
    }

    function cancelRecording() {
      clearRecorderTimer();
      if (recorder && recorder.state !== 'inactive') {
        recorderCancelled = true;
        recorder.stop();
      } else {
        pendingVoice = null;
        pendingVoicePeer = null;
        $('chat-voice-preview').removeAttribute('src');
        setVoiceUi('idle');
        setStatus('chat-composer-status', 'Đã hủy bản ghi.');
      }
    }

    async function sendVoice() {
      if (!pendingVoice || !activeFriend || activeFriend.id !== pendingVoicePeer) {
        return setStatus('chat-composer-status', 'Hãy quay lại đúng cuộc trò chuyện đã ghi voice.', 'error');
      }
      const [low, high] = canonicalPair(userId, activeFriend.id);
      const id = crypto.randomUUID();
      const contentType = pendingVoice.type || 'audio/webm';
      const extension = contentType.includes('mp4') ? 'm4a' : contentType.includes('ogg') ? 'ogg' : contentType.includes('wav') ? 'wav' : 'webm';
      const path = `${low}/${high}/${id}.${extension}`;
      const blob = pendingVoice;
      const button = $('chat-voice-send');
      button.disabled = true;
      button.textContent = 'Đang gửi…';
      try {
        const { error: uploadError } = await client.storage.from('chat-voice').upload(path, blob, { contentType, upsert: false, cacheControl: '3600' });
        if (uploadError) throw uploadError;
        const { error: rowError } = await client.from('chat_messages').insert({
          user_low: low, user_high: high, sender_id: userId,
          message_type: 'voice', content: null, media_path: path
        });
        if (rowError) {
          await client.storage.from('chat-voice').remove([path]);
          throw rowError;
        }
        pendingVoice = null;
        pendingVoicePeer = null;
        $('chat-voice-preview').pause();
        $('chat-voice-preview').removeAttribute('src');
        $('chat-voice-preview').load();
        setVoiceUi('idle');
        setStatus('chat-composer-status', 'Đã gửi tin nhắn thoại.', 'success');
        await loadMessages();
      } catch (error) {
        setStatus('chat-composer-status', error.message || 'Không gửi được tin thoại.', 'error');
      } finally {
        button.disabled = false;
        button.textContent = 'Gửi tin thoại';
      }
    }

    function formatTime(value) {
      return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    async function loadCode() {
      const { data, error } = await client.rpc('create_or_get_chat_invite_code');
      if (error) {
        $('chat-own-code').textContent = 'Chưa khả dụng';
        setStatus('chat-add-status', error.message || 'Không lấy được mã kết bạn. Hãy chạy migration chat.', 'error');
        return;
      }
      $('chat-own-code').textContent = String(data || '');
    }

    async function ensureOwnProfile(user) {
      const { error: upsertError } = await client.from('chat_profiles').upsert({ user_id: user.id }, { onConflict: 'user_id', ignoreDuplicates: true });
      if (upsertError) throw upsertError;
      const { data, error } = await client.from('chat_profiles').select('display_name').eq('user_id', user.id).single();
      if (error) throw error;
      $('chat-name-input').value = data.display_name || 'Bạn của mình';
    }

    async function activateUser(user) {
      const nextId = user?.id || null;
      if (nextId === userId) return;
      if ((recorder && recorder.state !== 'inactive') || pendingVoice) cancelRecording();
      if (requestChannel) client.removeChannel(requestChannel);
      if (messageChannel) client.removeChannel(messageChannel);
      requestChannel = null;
      messageChannel = null;
      userId = nextId;
      currentUser = user || null;
      activeFriend = null;
      relationships = [];
      $('chat-thread-content').classList.add('chat-hidden');
      $('chat-empty-thread').classList.remove('chat-hidden');
      shell.classList.remove('chat-thread-active');
      $('chat-messages').replaceChildren();
      if (!userId) {
        $('chat-login-card').classList.remove('chat-hidden');
        $('chat-account-area').classList.add('chat-hidden');
        renderEmptyList($('chat-friends-list'), 'Đăng nhập để xem danh sách bạn bè.');
        renderEmptyList($('chat-incoming-list'), 'Đăng nhập để xem lời mời.');
        return;
      }
      $('chat-login-card').classList.add('chat-hidden');
      $('chat-account-area').classList.remove('chat-hidden');
      try {
        await ensureOwnProfile(currentUser);
        await loadCode();
        await loadRelationships();
        subscribeToRequests();
      } catch (error) {
        setStatus('chat-composer-status', error.message || 'Chưa khởi tạo được chat. Hãy chạy supabase/chat_schema.sql.', 'error');
        $('chat-own-code').textContent = 'Chưa khả dụng';
      }
      const invitedCode = new URLSearchParams(location.search).get('addfriend');
      if (invitedCode && /^[A-F0-9]{10}$/i.test(invitedCode)) {
        $('chat-friend-code').value = invitedCode.toUpperCase();
        openChat();
      }
    }

    function subscribeToRequests() {
      if (!client || !userId) return;
      if (requestChannel) client.removeChannel(requestChannel);
      requestChannel = client.channel(`chat-requests-${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_friend_requests', filter: `recipient_id=eq.${userId}` }, () => loadRelationships())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_friend_requests', filter: `requester_id=eq.${userId}` }, () => loadRelationships())
        .subscribe();
    }

    if (client) {
      const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
        window.setTimeout(() => activateUser(session?.user || null), 0);
      });
      client.auth.getSession().then(({ data }) => activateUser(data?.session?.user || null)).catch((error) => {
        setStatus('chat-composer-status', error.message || 'Không khôi phục được phiên đăng nhập.', 'error');
      });
      window.addEventListener('pagehide', () => {
        if (authListener?.subscription) authListener.subscription.unsubscribe();
        if (requestChannel) client.removeChannel(requestChannel);
        if (messageChannel) client.removeChannel(messageChannel);
        clearRecorderTimer();
        recorderStream?.getTracks().forEach((track) => track.stop());
      }, { once: true });
    } else {
      $('chat-login-card').innerHTML = '<strong>Chat cloud chưa được cấu hình.</strong><br>Hãy thêm cấu hình Supabase cho website để dùng kết bạn và tin nhắn.';
      $('chat-login-open')?.classList.add('chat-hidden');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
