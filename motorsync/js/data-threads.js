(function () {
  const THREADS_KEY = 'threadsync_threads';
  const SETTINGS_KEY = 'opsis_settings';

  function getActiveCompanyId() {
    try {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      const id = settings.companyId || settings.company || settings.companyName;
      if (id && typeof id === 'string') {
        return id.trim().toLowerCase().replace(/[^a-z0-9_-]+/gi, '-');
      }
    } catch (err) {
      /* ignore */
    }
    return 'default';
  }

  function scopedKey(base) {
    const company = getActiveCompanyId();
    return `${base}_${company}`;
  }

  function loadThreads() {
    const key = scopedKey(THREADS_KEY);
    try {
      let stored = JSON.parse(localStorage.getItem(key) || 'null');
      
      // Fallback al key genérico si el scoped está vacío
      if (!stored || Object.keys(stored).length === 0) {
        stored = JSON.parse(localStorage.getItem(THREADS_KEY) || 'null');
      }
      
      // Fallback a DemoSeeds si está disponible
      if (!stored || Object.keys(stored).length === 0) {
        if (window.DemoSeeds && typeof DemoSeeds.getThreadListMap === 'function') {
          stored = DemoSeeds.getThreadListMap();
        }
      }
      
      return stored || {};
    } catch (err) {
      console.warn('No se pudieron cargar threads', err);
      return {};
    }
  }

  function saveThreads(threads) {
    if (!threads || typeof threads !== 'object') return;
    const key = scopedKey(THREADS_KEY);
    try {
      localStorage.setItem(key, JSON.stringify(threads));
    } catch (err) {
      console.warn('No se pudieron guardar threads', err);
    }
  }

  function getThread(threadId) {
    const threads = loadThreads();
    return threads[threadId] || null;
  }

  function updateThread(threadId, data) {
    const threads = loadThreads();
    threads[threadId] = { ...threads[threadId], ...data };
    saveThreads(threads);
    return threads[threadId];
  }

  function deleteThread(threadId) {
    const threads = loadThreads();
    delete threads[threadId];
    saveThreads(threads);
  }

  function createThread(data) {
    const threads = loadThreads();
    const id = data.id || `thread-${Date.now()}`;
    threads[id] = { ...data, id };
    saveThreads(threads);
    return threads[id];
  }

  window.ThreadData = {
    load: loadThreads,
    save: saveThreads,
    get: getThread,
    update: updateThread,
    delete: deleteThread,
    create: createThread,
    getActiveCompanyId,
    scopedKey
  };
})();
