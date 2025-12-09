(function () {
  function sanitizeTarget(raw) {
    if (!raw) return 'motorsync.html';
    try {
      const url = new URL(raw, window.location.origin);
      if (url.origin !== window.location.origin) return 'motorsync.html';
      const path = url.pathname && url.pathname !== '/' ? url.pathname.replace(/^\//, '') : 'motorsync.html';
      return `${path}${url.search || ''}${url.hash || ''}` || 'motorsync.html';
    } catch (err) {
      if (/^[\w.\-\/#?=&]+$/.test(raw)) {
        return raw;
      }
      return 'motorsync.html';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const target = sanitizeTarget(params.get('returnTo'));

    document.querySelectorAll('[data-return-target="motorsync"]').forEach((el) => {
      const handler = (event) => {
        event.preventDefault();
        window.location.href = target;
      };

      if (el.tagName === 'A') {
        el.setAttribute('href', target);
      }

      el.addEventListener('click', handler);
    });
  });
})();
