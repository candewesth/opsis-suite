(function () {
  const KEY = 'clientsync_clients';

  function loadClients() {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (stored && Array.isArray(stored) && stored.length) return stored;
    } catch (err) {
      console.warn('No se pudieron cargar clientes', err);
    }
    const defaults = window.DemoSeeds ? DemoSeeds.getClients() : [];
    if (defaults.length) {
      localStorage.setItem(KEY, JSON.stringify(defaults));
    }
    return defaults;
  }

  window.ClientData = { load: loadClients };
})();
