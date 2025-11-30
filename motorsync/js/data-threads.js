(function () {
  const THREADS_KEY = 'threadsync_threads';
  function loadThreads() {
    try {
      return JSON.parse(localStorage.getItem(THREADS_KEY) || '{}');
    } catch (err) {
      console.warn('No se pudieron cargar threads', err);
      return {};
    }
  }
  window.ThreadData = { load: loadThreads };
})();
