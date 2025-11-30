(function () {
  const KEY = 'clientsync_clients';
  const DEFAULTS = [
    { id: 'CLI-1001', name: 'Residencial Torres', segment: 'Residencial', value: 21500, status: 'active', contact: 'Laura Melgar', tickets: 4 },
    { id: 'CLI-1002', name: 'Comercial Plaza', segment: 'Comercial', value: 18900, status: 'active', contact: 'Raúl Medina', tickets: 6 },
    { id: 'CLI-1003', name: 'Hotel Pacífico', segment: 'Hospitality', value: 12400, status: 'pending', contact: 'Patricia Lugo', tickets: 2 },
    { id: 'CLI-1004', name: 'Harbor Logistics', segment: 'Industrial', value: 9800, status: 'inactive', contact: 'Carlos Ochoa', tickets: 0 }
  ];

  function loadClients() {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (stored && Array.isArray(stored) && stored.length) return stored;
    } catch (err) {
      console.warn('No se pudieron cargar clientes', err);
    }
    localStorage.setItem(KEY, JSON.stringify(DEFAULTS));
    return DEFAULTS;
  }

  window.ClientData = { load: loadClients, defaults: DEFAULTS };
})();
