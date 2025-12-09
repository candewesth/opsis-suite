(function () {
  const PROJECTS_KEY = 'projectsync_projects';
  const APPOINTMENTS_KEY = 'projectsync_appointments';

  const statusConfig = {
    lead: { color: '#3b82f6', badge: 'LEAD' },
    scheduled: { color: '#eab308', badge: 'PROGRAMADO' },
    confirmed: { color: '#0ea5e9', badge: 'CONFIRMADO' },
    active: { color: '#02735E', badge: 'EN CURSO' },
    'in_progress': { color: '#f59e0b', badge: 'EN PROCESO' },
    completed: { color: '#059669', badge: 'COMPLETADO' },
    invoiced: { color: '#f97316', badge: 'FACTURADO' },
    paid: { color: '#10b981', badge: 'PAGADO' },
    cancelled: { color: '#ef4444', badge: 'CANCELADO' },
  };

  const workflowStates = {
    quoted: { color: '#3b82f6', emoji: '📋', name: 'Cotizado' },
    approved: { color: '#10b981', emoji: '✅', name: 'Aprobado' },
    scheduled: { color: '#8b5cf6', emoji: '📅', name: 'Programado' },
    'in-progress': { color: '#f59e0b', emoji: '🔧', name: 'En Proceso' },
    paused: { color: '#fbbf24', emoji: '⏸️', name: 'Pausado' },
    completed: { color: '#059669', emoji: '🎉', name: 'Completado' },
    cancelled: { color: '#ef4444', emoji: '❌', name: 'Cancelado' },
  };

  const DEFAULT_PROJECTS = (window.DemoSeeds && DemoSeeds.getProjects()) || [];

  function extractCounter(idSync) {
    if (!idSync) return 0;
    const match = idSync.match(/IDSync\d{2}(\d{4})/);
    return match ? parseInt(match[1], 10) : 0;
  }

  function normalizeProjects(projects) {
    const normalized = Array.isArray(projects) ? projects : [];
    const currentYearSuffix = new Date().getFullYear().toString().slice(-2);
    let counter = normalized.reduce((max, project) => Math.max(max, extractCounter(project.idSync)), 0);
    let changed = false;

    normalized.forEach((project, index) => {
      if (!project || typeof project !== 'object') return;
      if (!project.idSync || /^ORD-/i.test(project.idSync)) {
        counter += 1;
        project.idSync = `IDSync${currentYearSuffix}${String(counter).padStart(4, '0')}`;
        changed = true;
      }
      if (!project.id) {
        project.id = project.idSync || `PRJ-${String(index + 1).padStart(3, '0')}`;
        changed = true;
      }
      if (!project.name) {
        project.name = `Proyecto ${project.idSync}`;
        changed = true;
      }
      if (!project.client) {
        project.client = 'Cliente no especificado';
        changed = true;
      }
      if (!project.status) {
        project.status = 'active';
        changed = true;
      }
      if (!project.startDate) {
        project.startDate = new Date().toISOString().split('T')[0];
        changed = true;
      }
      if (!project.endDate) {
        project.endDate = project.startDate;
        changed = true;
      }
    });

    return { list: normalized, changed };
  }

  function loadProjects() {
    const stored = parseJSON(localStorage.getItem(PROJECTS_KEY), null);
    if (!Array.isArray(stored) || stored.length === 0) {
      const defaults = clone(DEFAULT_PROJECTS);
      persist(PROJECTS_KEY, defaults);
      return defaults;
    }

    const { list, changed } = normalizeProjects(stored);
    if (changed) persist(PROJECTS_KEY, list);
    return list;
  }

  function saveProjects(projects) {
    if (!Array.isArray(projects)) return;
    const { list } = normalizeProjects(projects);
    persist(PROJECTS_KEY, list);
  }

  function generateIdSync() {
    const projects = loadProjects();
    const year = new Date().getFullYear().toString().slice(-2);
    let maxCounter = projects.reduce((max, project) => Math.max(max, extractCounter(project.idSync)), 0);
    maxCounter += 1;
    return `IDSync${year}${String(maxCounter).padStart(4, '0')}`;
  }

  function buildAppointmentSeeds(projects) {
    const baseTimestamp = Date.now();
    const seeds = [];

    projects.forEach((project, index) => {
      if (!project || !['active', 'scheduled'].includes(project.status)) return;

      const occurrences = project.status === 'active' ? 2 : 1;
      for (let i = 0; i < occurrences; i += 1) {
        const start = project.startDate ? new Date(project.startDate) : new Date();
        const appointmentDate = new Date(start.getTime());
        if (!Number.isNaN(start.valueOf())) {
          appointmentDate.setDate(start.getDate() + index + i * 2);
        }

        const technician = TECHNICIANS[(index + i) % TECHNICIANS.length];
        const type = APPOINTMENT_TYPES[(index + i) % APPOINTMENT_TYPES.length];
        const duration = APPOINTMENT_DURATIONS[(index + i) % APPOINTMENT_DURATIONS.length];

        seeds.push({
          id: `APT-${baseTimestamp}-${index}-${i}`,
          projectId: project.idSync || project.id,
          projectName: project.name,
          client: project.client,
          title: i === 0 ? 'Inspección inicial' : 'Seguimiento operativo',
          date: appointmentDate.toISOString().split('T')[0],
          time: `${String(8 + ((index + i) % 6)).padStart(2, '0')}:00`,
          duration,
          type,
          technician,
          status: i === 0 ? 'confirmed' : 'pending',
          notes: project.description || '',
          address: project.address || '',
        });
      }
    });

    if (seeds.length === 0) {
      seeds.push({
        id: `APT-${baseTimestamp}-seed`,
        projectId: DEFAULT_PROJECTS[0].idSync,
        projectName: DEFAULT_PROJECTS[0].name,
        client: DEFAULT_PROJECTS[0].client,
        title: 'Visita inicial',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 60,
        type: 'inspection',
        technician: TECHNICIANS[0],
        status: 'confirmed',
        notes: DEFAULT_PROJECTS[0].description,
        address: DEFAULT_PROJECTS[0].address,
      });
    }

    return seeds;
  }

  function loadAppointments() {
    const stored = parseJSON(localStorage.getItem(APPOINTMENTS_KEY), null);
    if (Array.isArray(stored) && stored.length) {
      return stored;
    }
    const seeds = buildAppointmentSeeds(loadProjects());
    persist(APPOINTMENTS_KEY, seeds);
    return seeds;
  }

  function saveAppointments(appointments) {
    if (!Array.isArray(appointments)) return;
    persist(APPOINTMENTS_KEY, appointments);
  }

  function addAppointment(payload) {
    const appointments = loadAppointments();
    const appointment = Object.assign(
      {
        id: `APT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: 'Visita técnica',
        type: 'inspection',
        technician: TECHNICIANS[0],
        duration: 60,
        status: 'pending',
      },
      payload || {},
    );
    appointments.push(appointment);
    saveAppointments(appointments);
    return appointment;
  }

  const api = window.ProjectData || {};
  api.PROJECTS_KEY = PROJECTS_KEY;
  api.APPOINTMENTS_KEY = APPOINTMENTS_KEY;
  api.statusConfig = Object.assign({}, api.statusConfig, statusConfig);
  api.workflowStates = Object.assign({}, api.workflowStates, workflowStates);
  api.loadProjects = loadProjects;
  api.saveProjects = saveProjects;
  api.getDefaults = () => clone(DEFAULT_PROJECTS);
  api.generateIdSync = generateIdSync;
  api.loadAppointments = loadAppointments;
  api.saveAppointments = saveAppointments;
  api.seedAppointments = () => loadAppointments();
  api.seedDefaults = () => loadProjects();
  api.addAppointment = addAppointment;

  window.ProjectData = api;
})();
