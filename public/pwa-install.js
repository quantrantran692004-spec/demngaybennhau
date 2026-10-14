(() => {
  const card = document.getElementById('pwa-install-card');
  const button = document.getElementById('pwa-install-button');
  const help = document.getElementById('pwa-install-help');
  if (!card || !button || !help) return;

  let installPrompt = null;
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isMobile = isIOS || isAndroid;

  if (isMobile && !isStandalone) card.hidden = false;
  if (isStandalone) card.hidden = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    if (!isStandalone) {
      card.hidden = false;
      button.textContent = 'Cài ứng dụng';
    }
  });

  button.addEventListener('click', async () => {
    help.hidden = true;
    if (installPrompt) {
      button.disabled = true;
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        installPrompt = null;
        if (choice?.outcome === 'accepted') {
          card.hidden = true;
          return;
        }
      } catch { /* Trình duyệt có thể đóng lời nhắc trước khi trả kết quả. */ }
      button.disabled = false;
    }

    help.textContent = isIOS
      ? 'Trên iPhone/iPad: mở trang bằng Safari, chạm nút Chia sẻ rồi chọn “Thêm vào Màn hình chính”.'
      : isAndroid
        ? 'Trên Android: mở menu ⋮ của Chrome, chọn “Cài đặt ứng dụng” hoặc “Thêm vào Màn hình chính”.'
        : 'Mở trang bằng Safari trên iPhone/iPad hoặc Chrome trên Android, rồi chọn “Thêm vào Màn hình chính”.';
    help.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    card.hidden = true;
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('/pwa-sw.js', { scope: '/' }).catch(() => {});
  }
})();
