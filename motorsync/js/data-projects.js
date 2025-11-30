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

  const DEFAULT_PROJECTS = [
    {
      id: 'PRJ-001',
      idSync: 'IDSync250001',
      name: 'HVAC Installation - Downtown Office',
      client: 'Gaslamp Quarter Properties',
      contact: 'Michael Chen',
      phone: '(619) 555-0101',
      email: 'mchen@gaslampprops.com',
      address: '701 Fifth Ave, San Diego, CA 92101',
      description: 'Complete HVAC system installation for 3-story office building',
      startDate: '2025-11-15',
      endDate: '2025-12-15',
      amount: 45000,
      status: 'active',
      serviceType: 'HVAC',
      technician: 'Juan García',
      priority: 'high',
    },
    {
      id: 'PRJ-002',
      idSync: 'IDSync250002',
      name: 'Commercial Plumbing Repair',
      client: 'La Jolla Shores Hotel',
      contact: 'Sarah Martinez',
      phone: '(858) 555-0202',
      email: 'smartinez@ljshores.com',
      address: '8110 Camino Del Oro, La Jolla, CA 92037',
      description: 'Emergency plumbing repair and water heater replacement',
      startDate: '2025-11-20',
      endDate: '2025-11-25',
      amount: 12500,
      status: 'active',
      serviceType: 'Plumbing',
      technician: 'María López',
      priority: 'high',
    },
    {
      id: 'PRJ-003',
      idSync: 'IDSync250003',
      name: 'Solar Panel Installation',
      client: 'Rancho Bernardo Estates',
      contact: 'David Thompson',
      phone: '(858) 555-0303',
      email: 'dthompson@rbhoa.com',
      address: '16925 Hierba Dr, San Diego, CA 92128',
      description: 'Residential solar panel system - 12kW capacity',
      startDate: '2025-12-01',
      endDate: '2025-12-20',
      amount: 35000,
      status: 'scheduled',
      serviceType: 'Solar',
      technician: 'Carlos Rodríguez',
      priority: 'medium',
    },
    {
      id: 'PRJ-004',
      idSync: 'IDSync250004',
      name: 'Electrical System Upgrade',
      client: 'Coronado Island Resort',
      contact: 'Jennifer Walsh',
      phone: '(619) 555-0404',
      email: 'jwalsh@coronadoresort.com',
      address: '1500 Orange Ave, Coronado, CA 92118',
      description: 'Main electrical panel upgrade and EV charger installation',
      startDate: '2025-11-01',
      endDate: '2025-11-10',
      amount: 28000,
      status: 'completed',
      serviceType: 'Electrical',
      technician: 'Ana Martínez',
      priority: 'medium',
    },
    {
      id: 'PRJ-005',
      idSync: 'IDSync250005',
      name: 'Fire Suppression System',
      client: 'Mission Valley Mall',
      contact: 'Robert Garcia',
      phone: '(619) 555-0505',
      email: 'rgarcia@mvmall.com',
      address: '1640 Camino Del Rio N, San Diego, CA 92108',
      description: 'Fire sprinkler system inspection and upgrade',
      startDate: '2025-11-18',
      endDate: '2025-11-30',
      amount: 52000,
      status: 'active',
      serviceType: 'Fire Systems',
      technician: 'Luis Installer',
      priority: 'high',
    },
    {
      id: 'PRJ-006',
      idSync: 'IDSync250006',
      name: 'Restaurant Kitchen Ventilation',
      client: 'Pacific Beach Seafood',
      contact: 'Tony Nguyen',
      phone: '(858) 555-0606',
      email: 'tnguyen@pbseafood.com',
      address: '4150 Mission Blvd, San Diego, CA 92109',
      description: 'Commercial kitchen hood and ventilation system installation',
      startDate: '2025-10-15',
      endDate: '2025-10-28',
      amount: 18500,
      status: 'completed',
      serviceType: 'HVAC',
      technician: 'Marco Tech',
      priority: 'medium',
    },
    {
      id: 'PRJ-007',
      idSync: 'IDSync250007',
      name: 'Office Building Renovation',
      client: 'Sorrento Valley Tech Park',
      contact: 'Lisa Kim',
      phone: '(858) 555-0707',
      email: 'lkim@svtechpark.com',
      address: '10770 Wateridge Cir, San Diego, CA 92121',
      description: 'Complete MEP renovation for tech office space',
      startDate: '2025-12-05',
      endDate: '2026-01-15',
      amount: 125000,
      status: 'scheduled',
      serviceType: 'Construction',
      technician: 'Rosa SuperTech',
      priority: 'high',
    },
    {
      id: 'PRJ-008',
      idSync: 'IDSync250008',
      name: 'Pool Equipment Replacement',
      client: 'Del Mar Heights Community',
      contact: 'Amanda Foster',
      phone: '(858) 555-0808',
      email: 'afoster@dmhoa.com',
      address: '3850 Valley Centre Dr, San Diego, CA 92130',
      description: 'Community pool pump and filtration system replacement',
      startDate: '2025-11-22',
      endDate: '2025-11-28',
      amount: 15000,
      status: 'active',
      serviceType: 'Pool Services',
      technician: 'Diego Flores',
      priority: 'low',
    },
    {
      id: 'PRJ-009',
      idSync: 'IDSync250009',
      name: 'Medical Office HVAC',
      client: 'Scripps Clinic Carmel Valley',
      contact: 'Dr. James Miller',
      phone: '(858) 555-0909',
      email: 'jmiller@scripps.org',
      address: '3811 Valley Centre Dr, San Diego, CA 92130',
      description: 'Specialized HVAC for medical facility with clean room requirements',
      startDate: '2025-10-01',
      endDate: '2025-10-20',
      amount: 68000,
      status: 'completed',
      serviceType: 'HVAC',
      technician: 'Lucía Ortega',
      priority: 'medium',
    },
    {
      id: 'PRJ-010',
      idSync: 'IDSync250010',
      name: 'Warehouse Lighting Retrofit',
      client: 'Otay Mesa Distribution',
      contact: 'Carlos Mendez',
      phone: '(619) 555-1010',
      email: 'cmendez@otaydist.com',
      address: '9855 Businesspark Ave, San Diego, CA 92154',
      description: 'LED lighting upgrade for 50,000 sq ft warehouse',
      startDate: '2025-12-10',
      endDate: '2025-12-18',
      amount: 42000,
      status: 'scheduled',
      serviceType: 'Electrical',
      technician: 'Eva Torres',
      priority: 'medium',
    },
  ];

  const TECHNICIANS = [
    'Juan García',
    'María López',
    'Carlos Rodríguez',
    'Ana Martínez',
    'Luis Installer',
    'Marco Tech',
    'Rosa SuperTech',
    'Diego Flores',
    'Lucía Ortega',
    'Eva Torres',
  ];

  const APPOINTMENT_TYPES = ['inspection', 'installation', 'review', 'handoff', 'maintenance'];
  const APPOINTMENT_DURATIONS = [45, 60, 90, 120];

  function parseJSON(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (err) {
      return fallback;
    }
  }

  function persist(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

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
