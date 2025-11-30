(function () {
  const PROJECTS_KEY = 'projectsync_projects';

  function getDefaultProjectsData() {
    return [
      { id: 'ORD-201', name: 'Instalación HVAC Completo', client: 'Residencial Torres', status: 'active', amount: 12500, startDate: '2025-11-10', endDate: '2025-11-20' },
      { id: 'ORD-202', name: 'Reparación Sistema Eléctrico', client: 'Planta Industrial', status: 'active', amount: 8400, startDate: '2025-11-12', endDate: '2025-11-28' },
      { id: 'ORD-203', name: 'Mantenimiento Preventivo', client: 'Oficinas Corp', status: 'scheduled', amount: 4200, startDate: '2025-11-26', endDate: '2025-11-28' },
      { id: 'ORD-204', name: 'Renovación Plomería', client: 'Edificio Norte', status: 'active', amount: 15600, startDate: '2025-11-05', endDate: '2025-11-30' },
      { id: 'ORD-205', name: 'Sistema Contra Incendios', client: 'Centro Comercial', status: 'completed', amount: 22000, startDate: '2025-10-15', endDate: '2025-11-10' },
      { id: 'ORD-206', name: 'Cableado Estructurado', client: 'Tech Hub', status: 'active', amount: 9800, startDate: '2025-11-20', endDate: '2025-12-05' },
      { id: 'ORD-207', name: 'Pintura Exterior', client: 'Hotel Plaza', status: 'scheduled', amount: 35000, startDate: '2025-12-01', endDate: '2025-12-15' },
      { id: 'ORD-208', name: 'Jardinería General', client: 'Parque Central', status: 'active', amount: 3200, startDate: '2025-11-01', endDate: '2025-11-30' },
      { id: 'ORD-209', name: 'Impermeabilización', client: 'Bodegas Sur', status: 'completed', amount: 18500, startDate: '2025-10-01', endDate: '2025-10-20' },
      { id: 'ORD-210', name: 'Instalación Cámaras', client: 'Seguridad Total', status: 'active', amount: 7500, startDate: '2025-11-20', endDate: '2025-11-28' },
      { id: 'ORD-211', name: 'Reparación Techo', client: 'Casa Blanca', status: 'completed', amount: 5600, startDate: '2025-10-20', endDate: '2025-11-05' },
      { id: 'ORD-212', name: 'Limpieza Industrial', client: 'Fabrica X', status: 'active', amount: 4500, startDate: '2025-11-01', endDate: '2025-11-30' },
      { id: 'ORD-213', name: 'Mantenimiento Elevadores', client: 'Torre Ejecutiva', status: 'scheduled', amount: 8900, startDate: '2025-11-27', endDate: '2025-11-28' },
      { id: 'ORD-214', name: 'Instalación Paneles Solares', client: 'Eco House', status: 'active', amount: 45000, startDate: '2025-11-15', endDate: '2025-12-10' },
      { id: 'ORD-215', name: 'Remodelación Baños', client: 'Restaurante Y', status: 'completed', amount: 12000, startDate: '2025-10-05', endDate: '2025-10-25' },
      { id: 'ORD-216', name: 'Cambio Luminarias', client: 'Oficinas Z', status: 'completed', amount: 3400, startDate: '2025-11-01', endDate: '2025-11-15' }
    ];
  }

  function loadProjectsFromStorage() {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (stored) {
      try {
        const projects = JSON.parse(stored);
        if (projects && projects.length > 0) return projects;
      } catch (err) {
        console.warn('No se pudieron parsear proyectos guardados', err);
      }
    }
    const defaults = getDefaultProjectsData();
    saveProjectsToStorage(defaults);
    return defaults;
  }

  function saveProjectsToStorage(projects) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }

  window.ProjectData = {
    loadProjects: loadProjectsFromStorage,
    saveProjects: saveProjectsToStorage,
    getDefaults: getDefaultProjectsData,
  };
})();
