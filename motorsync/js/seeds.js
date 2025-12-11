(function () {
  const MODE_KEY = 'opsis_demo_mode';

  function readDemoMode() {
    try {
      const stored = localStorage.getItem(MODE_KEY);
      if (stored === null) {
        localStorage.setItem(MODE_KEY, 'true');
        return true;
      }
      return stored !== 'false';
    } catch (err) {
      console.warn('No se pudo leer demoMode, usando true por defecto.', err);
      return true;
    }
  }

  function writeDemoMode(enabled) {
    try {
      localStorage.setItem(MODE_KEY, enabled ? 'true' : 'false');
    } catch (err) {
      console.warn('No se pudo guardar el estado de demoMode.', err);
    }
  }

  function isoDaysFromNow(daysOffset) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return new Date(Date.now() + daysOffset * msPerDay).toISOString();
  }

  function addDays(isoDate, daysToAdd) {
    const base = new Date(isoDate || Date.now());
    return new Date(base.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
  }

  function deepClone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  const CLIENTS = [
    { id: 'CLI-1001', name: 'Residencial Torres', segment: 'Residencial', value: 21500, status: 'active', contact: 'Laura Melgar', tickets: 4 },
    { id: 'CLI-1002', name: 'Comercial Plaza', segment: 'Comercial', value: 18900, status: 'active', contact: 'Raúl Medina', tickets: 6 },
    { id: 'CLI-1003', name: 'Hotel Pacífico', segment: 'Hospitality', value: 12400, status: 'pending', contact: 'Patricia Lugo', tickets: 2 },
    { id: 'CLI-1004', name: 'Harbor Logistics', segment: 'Industrial', value: 9800, status: 'inactive', contact: 'Carlos Ochoa', tickets: 0 }
  ];

  const THREAD_DETAIL = {
    'thread-1': {
      title: 'Cambios en especificaciones técnicas',
      icon: 'document',
      address: 'Instalación HVAC Completo - Proyecto #1024',
      description: 'El cliente solicita modificar el tipo de refrigerante de R-410A a R-32 para cumplir nuevas normativas ambientales',
      createdBy: 'Juan Pérez',
      createdDate: '2025-11-20',
      createdTime: '14:30',
      project: 'Instalación HVAC Completo',
      projectId: 'project-1',
      status: 'unread',
      comments: 15,
      files: 3
    },
    'thread-2': {
      title: 'Coordinación de instalación',
      icon: 'maintenance',
      address: 'Instalación HVAC Completo - Proyecto #1024',
      description: 'Confirmar acceso al sitio el martes 21 nov a las 8:00 AM. Coordinación con seguridad del edificio',
      createdBy: 'María García',
      createdDate: '2025-11-19',
      createdTime: '10:15',
      project: 'Instalación HVAC Completo',
      projectId: 'project-1',
      status: 'read',
      comments: 8,
      files: 1
    },
    'thread-3': {
      title: 'Fotos del progreso - Semana 1',
      icon: 'camera',
      address: 'Instalación HVAC Completo - Proyecto #1024',
      description: 'Documentación fotográfica del avance de obra hasta el viernes. Todo según cronograma',
      createdBy: 'Carlos López',
      createdDate: '2025-11-17',
      createdTime: '16:45',
      project: 'Instalación HVAC Completo',
      projectId: 'project-1',
      status: 'read',
      comments: 12,
      files: 24
    },
    'thread-4': {
      title: 'Inspección de seguridad eléctrica',
      icon: 'alert',
      address: 'Reparación Sistema Eléctrico - Proyecto #1025',
      description: 'Resultados de la inspección inicial y recomendaciones de actualización del sistema',
      createdBy: 'Ana Martínez',
      createdDate: '2025-11-20',
      createdTime: '11:00',
      project: 'Reparación Sistema Eléctrico',
      projectId: 'project-2',
      status: 'unread',
      comments: 6,
      files: 2
    }
  };

  const THREAD_LIST = {
    'thread-1': {
      owner: 'Juan Pérez',
      createdBy: 'Juan Pérez',
      participants: ['Juan Pérez', 'Ana Martínez', 'Pedro Sánchez'],
      mentions: ['Ana Martínez'],
      isRead: true,
      isArchived: false,
      messages: [
        { id: 1, author: 'Juan Pérez', text: 'Necesitamos revisar las especificaciones del refrigerante', attachments: ['spec_r32.pdf'] },
        { id: 2, author: 'Ana Martínez', text: 'He revisado las regulaciones', attachments: [] },
        { id: 3, author: 'Juan Pérez', text: 'Perfecto, adjunto el plano actualizado', attachments: ['plano_hvac_v2.dwg', 'calculos.xlsx'] },
        { id: 4, author: 'Pedro Sánchez', text: '¿Cuándo podemos agendar la visita?', attachments: [] },
        { id: 5, author: 'Juan Pérez', text: 'El martes está bien', attachments: [] }
      ],
      location: 'Guadalajara, Jal.',
      projectId: 'project-1',
      projectName: 'Instalación HVAC Completo',
      clientName: 'Edificio Central',
      subject: 'Especificaciones técnicas refrigerante'
    },
    'thread-4': {
      owner: 'Ana Martínez',
      createdBy: 'Ana Martínez',
      participants: ['Ana Martínez', 'Roberto Díaz'],
      mentions: [],
      isRead: false,
      isArchived: false,
      messages: [
        { id: 1, author: 'Ana Martínez', text: 'Propuesta inicial para reparación eléctrica', attachments: ['propuesta.pdf'] }
      ],
      location: 'Monterrey, N.L.',
      projectId: 'project-2',
      projectName: 'Reparación Sistema Eléctrico',
      clientName: 'Planta Industrial',
      subject: 'Reparación urgente sistema eléctrico'
    },
    'thread-5': {
      owner: 'Luis García',
      createdBy: 'Luis García',
      participants: ['Luis García', 'Ana Martínez', 'María López'],
      mentions: ['Ana Martínez'],
      isRead: true,
      isArchived: false,
      messages: [
        { id: 1, author: 'Luis García', text: 'Thread sobre mantenimiento', attachments: [] }
      ],
      location: 'CDMX',
      projectId: null,
      projectName: null,
      clientName: 'Cliente XYZ',
      subject: 'Consulta mantenimiento'
    },
    'thread-6': {
      owner: 'Carlos Ruiz',
      createdBy: 'Carlos Ruiz',
      participants: ['Carlos Ruiz', 'Ana Martínez'],
      mentions: ['Ana Martínez'],
      isRead: false,
      isArchived: false,
      messages: [
        { id: 1, author: 'Carlos Ruiz', text: 'Urgente - revisar cotización', attachments: ['cotizacion.xlsx'] }
      ],
      location: 'Puebla, Pue.',
      projectId: null,
      projectName: null,
      clientName: 'Hotel Reforma',
      subject: 'Cotización instalación AC'
    },
    'thread-7': {
      owner: 'María López',
      createdBy: 'María López',
      participants: ['María López', 'Juan Pérez'],
      mentions: [],
      isRead: true,
      isArchived: false,
      messages: [
        { id: 1, author: 'María López', text: 'Thread de ejemplo', attachments: [] }
      ],
      location: 'Querétaro, Qro.',
      projectId: null,
      projectName: null,
      clientName: 'Corporativo ABC',
      subject: 'Consulta general'
    },
    'thread-8': {
      owner: 'Pedro Sánchez',
      createdBy: 'Pedro Sánchez',
      participants: ['Pedro Sánchez', 'Luis García'],
      mentions: [],
      isRead: true,
      isArchived: false,
      messages: [
        { id: 1, author: 'Pedro Sánchez', text: 'Seguimiento proyecto', attachments: [] }
      ],
      location: 'León, Gto.',
      projectId: 'project-3',
      projectName: 'Mantenimiento Preventivo Oficinas',
      clientName: 'Oficinas Corp',
      subject: 'Seguimiento mantenimiento'
    },
    'thread-9': {
      owner: 'Roberto Díaz',
      createdBy: 'Roberto Díaz',
      participants: ['Roberto Díaz', 'Carlos Ruiz'],
      mentions: [],
      isRead: false,
      isArchived: false,
      messages: [
        { id: 1, author: 'Roberto Díaz', text: 'Nuevo lead', attachments: [] }
      ],
      location: 'Aguascalientes, Ags.',
      projectId: null,
      projectName: null,
      clientName: 'Lead Nuevo',
      subject: 'Oportunidad comercial'
    },
    'thread-10': {
      owner: 'Juan Pérez',
      createdBy: 'Juan Pérez',
      participants: ['Juan Pérez', 'Ana Martínez'],
      mentions: [],
      isRead: true,
      isArchived: false,
      messages: [
        { id: 1, author: 'Juan Pérez', text: 'Thread activo', attachments: [] }
      ],
      location: 'Mérida, Yuc.',
      projectId: null,
      projectName: null,
      clientName: 'Cliente Mérida',
      subject: 'Instalación nueva'
    },
    'thread-11': {
      owner: 'Ana Martínez',
      createdBy: 'Ana Martínez',
      participants: ['Ana Martínez'],
      mentions: [],
      isRead: true,
      isArchived: true,
      messages: [
        { id: 1, author: 'Ana Martínez', text: 'Thread completado', attachments: [] }
      ],
      location: 'Tijuana, B.C.',
      projectId: null,
      projectName: null,
      clientName: 'Proyecto Finalizado',
      subject: 'Proyecto completado'
    }
  };

  const INVITES = [
    {
      id: 'INV-DEMO-001',
      name: 'Pedro García',
      email: 'pedro.garcia@email.com',
      role: 'tech',
      invitedBy: 'Candelario Delgado',
      tempPassword: 'OPS-472A',
      status: 'pending',
      sentAt: isoDaysFromNow(-2),
      expiresAt: addDays(isoDaysFromNow(-2), 7),
    },
    {
      id: 'INV-DEMO-002',
      name: 'Sofía Ramírez',
      email: 'sofia.ramirez@email.com',
      role: 'admin',
      invitedBy: 'Candelario Delgado',
      tempPassword: 'OPS-814B',
      status: 'pending',
      sentAt: isoDaysFromNow(-5),
      expiresAt: addDays(isoDaysFromNow(-5), 7),
    },
    {
      id: 'INV-DEMO-003',
      name: 'Miguel Torres',
      email: 'miguel.torres@email.com',
      role: 'tech',
      invitedBy: 'María González',
      tempPassword: 'OPS-639C',
      status: 'pending',
      sentAt: isoDaysFromNow(-7),
      expiresAt: addDays(isoDaysFromNow(-7), 3),
    },
  ];

  const PROJECTS = [
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
      priority: 'high'
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
      priority: 'high'
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
      priority: 'medium'
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
      priority: 'medium'
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
      priority: 'high'
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
      priority: 'medium'
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
      priority: 'high'
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
      priority: 'low'
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
      priority: 'medium'
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
      endDate: '2026-01-05',
      amount: 22000,
      status: 'scheduled',
      serviceType: 'Electrical',
      technician: 'Eduardo Ramos',
      priority: 'medium'
    }
  ];

  const DemoSeeds = {
    isEnabled() {
      return readDemoMode();
    },
    setMode(enabled) {
      writeDemoMode(Boolean(enabled));
    },
    toggleMode() {
      this.setMode(!this.isEnabled());
    },
    getClients() {
      return this.isEnabled() ? deepClone(CLIENTS) : [];
    },
    getProjects() {
      return this.isEnabled() ? deepClone(PROJECTS) : [];
    },
    getThreadListMap() {
      return this.isEnabled() ? deepClone(THREAD_LIST) : {};
    },
    getThreadDetailMap() {
      return this.isEnabled() ? deepClone(THREAD_DETAIL) : {};
    },
    getInvites() {
      return this.isEnabled() ? deepClone(INVITES) : [];
    }
  };

  window.DemoSeeds = DemoSeeds;
})();
