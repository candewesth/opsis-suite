(function KPIEngine() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  function parseDate(value) {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  function daysBetween(a, b) {
    return Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
  }

  function loadProjects() {
    try {
      const raw = localStorage.getItem('projectsync_projects') || '[]';
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function loadSchedule(projectId) {
    if (!projectId) return [];
    try {
      const key = `project_schedule_${projectId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  function loadDailyLogs(projectId) {
    if (!projectId) return [];
    try {
      const key = `daily_logs_${projectId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  function loadDocuments(projectId) {
    if (!projectId) return [];
    try {
      const key = `project_documents_${projectId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  function computeProjectMetrics(project) {
    const startDate = parseDate(project.startDate) || parseDate(project.start) || new Date();
    const endDate = parseDate(project.endDate) || parseDate(project.end) || startDate;
    const today = new Date();
    const schedule = loadSchedule(project.idSync || project.id || project.idSync);
    const totalScheduledDays = schedule.reduce((sum, phase) => sum + Math.max(1, Number(phase.duration || 0)), 0);
    const projectDuration = Math.max(1, daysBetween(startDate, endDate) || totalScheduledDays || 1);

    const elapsed = Math.min(projectDuration, daysBetween(startDate, today));
    const progressPercent = Math.min(100, Math.round((elapsed / projectDuration) * 100));

    const documents = loadDocuments(project.idSync || project.id);
    const permits = documents.filter((d) => d.category === 'permiso').length;
    const inspections = documents.filter((d) => d.category === 'inspeccion' || d.category === 'inspection').length;

    const logs = loadDailyLogs(project.idSync || project.id);
    const loggedHours = logs.reduce((sum, log) => sum + (Number(log.hours) || 0), 0);
    const plannedHours = (totalScheduledDays || projectDuration) * 8;

    const slaDays = daysBetween(today, endDate);
    let slaStatus = 'En tiempo';
    if (slaDays <= 0) slaStatus = 'Vencido';
    else if (slaDays <= 3) slaStatus = 'Riesgo';

    return {
      progressPercent,
      permits,
      inspections,
      plannedHours,
      loggedHours,
      slaStatus,
      slaDays,
      startDate,
      endDate,
    };
  }

  function updateText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) {
      el.textContent = value;
    }
  }

  function renderDashboardKpis(project) {
    if (!project) return;
    const metrics = computeProjectMetrics(project);
    updateText('kpi-progress', `${metrics.progressPercent}%`);
    updateText('kpi-permits', metrics.permits);
    updateText('kpi-hours', `${metrics.loggedHours}/${metrics.plannedHours}`);
    updateText('kpi-sla', metrics.slaStatus === 'Vencido' ? 'Vencido' : `${metrics.slaDays}d`);
  }

  function renderAnalytics(projects) {
    if (!projects.length) return;
    const current = projects.filter((p) => parseDate(p.startDate) && parseDate(p.endDate));
    updateText('current-month-value', current.length);
    updateText('previous-month-value', Math.max(0, current.length - 3));
    const growth = current.length ? Math.round(((current.length - Math.max(0, current.length - 3)) / Math.max(1, current.length - 3)) * 100) : 0;
    updateText('growth-percentage', `${growth > 0 ? '+' : ''}${growth}%`);
  }

  function renderClientInsights(projects) {
    const clientNameEl = document.querySelector('[data-client-name]');
    const clientName = clientNameEl ? clientNameEl.textContent.trim() : null;
    if (!clientName) return;
    const clientProjects = projects.filter((p) => (p.clientName || p.client || '').toLowerCase() === clientName.toLowerCase());
    updateText('client-insight-projects', clientProjects.length);
    const active = clientProjects.filter((p) => (p.status || '').toLowerCase() !== 'completed').length;
    updateText('client-insight-active', active);
  }

  function renderManagementKpis() {
    // Si hay datos de invitaciones en seeds
    try {
      const invites = (window.DemoSeeds && typeof DemoSeeds.getInvites === 'function') ? DemoSeeds.getInvites() : [];
      updateText('management-kpi-invites', invites.length);
      updateText('management-kpi-invites-hint', invites.length ? `${invites.length} pendientes de aceptación` : 'Sin pendientes');
    } catch (err) {
      console.warn('No se pudieron renderizar invites', err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const projects = loadProjects();
    const activeProject = projects[0] || null;
    if (activeProject) {
      renderDashboardKpis(activeProject);
    }
    renderAnalytics(projects);
    renderClientInsights(projects);
    renderManagementKpis();
  });

  window.KPIEngine = {
    computeProjectMetrics,
    renderDashboardKpis,
    renderAnalytics,
    renderClientInsights,
  };
})();
