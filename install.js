/* Installation is available independently of the lecture API. */
(() => {
  const panel = document.getElementById('install-panel');
  const button = document.getElementById('install-app');
  const help = document.getElementById('install-help');
  const instructions = document.getElementById('install-instructions');
  const standalone = matchMedia('(display-mode: standalone)');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let deferredPrompt = null;
  let installed = false;
  const sync = () => {
    panel.hidden = installed || standalone.matches || navigator.standalone === true ||
      !(window.isSecureContext && /^https?:$/.test(location.protocol));
  };
  const closeHelp = () => {
    help.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  };
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    sync();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    closeHelp();
    sync();
  });
  standalone.addEventListener('change', sync);
  button.addEventListener('click', async () => {
    if (deferredPrompt) {
      const prompt = deferredPrompt;
      deferredPrompt = null;
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === 'accepted') {
          installed = true;
          closeHelp();
          sync();
        }
        return;
      } catch (error) {
        console.warn('Installation prompt unavailable', error);
      }
    }
    instructions.textContent = isIOS
      ? 'على iPhone أو iPad: افتح قائمة المشاركة في Chrome، ثم «إضافة إلى الشاشة الرئيسية» ثم «إضافة». قد تحتاج إلى اختيار «المزيد» لرؤية الخيار. إذا لم يظهر، افتح الموقع في Safari واستخدم مشاركة ← إضافة إلى الشاشة الرئيسية. فعّل «فتح كتطبيق ويب» إذا ظهر.'
      : 'في Chrome على Android: افتح قائمة ⋮ ثم «إضافة إلى الشاشة الرئيسية» أو «تثبيت التطبيق»، ثم أكّد التثبيت. على الكمبيوتر استخدم أيقونة التثبيت في شريط العنوان أو خيار تثبيت الصفحة كتطبيق من قائمة Chrome.';
    help.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  });
  document.getElementById('install-close').addEventListener('click', () => {
    closeHelp();
    button.focus();
  });
  sync();
})();

