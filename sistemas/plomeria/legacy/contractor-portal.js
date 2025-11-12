(function () {
  const portal = window.OpsisPortal;
  if (!portal) return;

  const settings = JSON.parse(localStorage.getItem('opsis_settings') || '{}');
  const state = {
    contractor: '',
    companyName: (settings.companyName || 'Tu compañía').trim() || 'Tu compañía',
    selectedOrderId: null,
    data: portal.getData(),
  };

  function init() {
    applyTheme(settings.theme || 'light');
    setupThemeToggle();
    deriveContractor();
    bindEvents();
    renderAll();
    renderMeta();
  }

  function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.body.dataset.theme = next;
  }

  function persistTheme(theme) {
    settings.theme = theme;
    localStorage.setItem('opsis_settings', JSON.stringify(settings));
  }

  function setupThemeToggle() {
    const btn = document.getElementById('contractor-theme-toggle');
    if (!btn) return;
    const syncIcon = () => {
      btn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
    };
    syncIcon();
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      persistTheme(next);
      syncIcon();
    });
  }

  function deriveContractor() {
    const stored = localStorage.getItem('portal_contractor');
    const contractorCustomer = (state.data.customers || []).find((customer) => customer.type === 'contractor');
    const fallbackOrder = state.data.orders[0];
    state.contractor = stored || contractorCustomer?.name || fallbackOrder?.customer || 'Contratista';
    if (!state.selectedOrderId && fallbackOrder) {
      state.selectedOrderId = fallbackOrder.id;
    }
    const badge = document.getElementById('contractor-badge');
    if (badge) badge.textContent = state.contractor;
  }

  function renderMeta() {
    updateText('contractor-company-name', state.companyName);
    updateText('contractor-company-label', state.companyName);
    updateText('contractor-greeting-name', state.contractor);
    const lastUpdate = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date());
    updateText('contractor-last-update', lastUpdate);
  }

  function bindEvents() {
    const form = document.getElementById('contractor-request-form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const payload = {
          id: `REQ-${Date.now().toString(36).toUpperCase()}`,
          origin: 'contractor',
          customer: state.contractor,
          site: data.get('site') || '',
          scope: data.get('scope') || '',
          budget: Number(data.get('budget')) || 0,
          urgency: data.get('urgency') || 'normal',
          notes: data.get('notes') || '',
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        state.data.portalRequests = portal.savePortalRequest(payload);
        form.reset();
        renderRequests();
        alert('Solicitud registrada. Nuestro equipo revisará el alcance.');
      });
    }
    const newBtn = document.getElementById('btn-contractor-new');
    if (newBtn && form) {
      newBtn.addEventListener('click', () => {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const first = form.querySelector('input, textarea');
        if (first) first.focus();
      });
    }
    const exportBtn = document.getElementById('btn-contractor-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', downloadCsv);
    }
  }

  function renderAll() {
    renderKpis();
    renderOrders();
    renderDetail();
    renderRequests();
  }

  function getContractorOrders() {
    return (state.data.orders || []).filter((order) => order.customer === state.contractor);
  }

  function renderKpis() {
    const orders = getContractorOrders();
    const activeProjects = orders.filter((order) => !portal.isOrderCompleted(order.status));
    const totalValue = activeProjects.reduce((sum, order) => sum + (order.total || 0), 0);
    const crewSet = new Set();
    activeProjects.forEach((order) => {
      if (order.crewLead) crewSet.add(order.crewLead);
      (order.crew || []).forEach((member) => member && crewSet.add(member));
    });
    updateText('contractor-kpi-projects', activeProjects.length);
    updateText('contractor-kpi-projects-hint', 'Incluye órdenes en ruta');
    updateText('contractor-kpi-value', portal.formatCurrency(totalValue));
    updateText('contractor-kpi-value-hint', 'Valor estimado en curso');
    updateText('contractor-kpi-crew', crewSet.size);
    updateText('contractor-kpi-crew-hint', 'Integrantes asignados');
  }

  function renderOrders() {
    const body = document.getElementById('contractor-orders-body');
    if (!body) return;
    const orders = getContractorOrders();
    if (!orders.length) {
      body.innerHTML = '<tr><td colspan="4">Sin órdenes asociadas</td></tr>';
      return;
    }
    body.innerHTML = orders
      .slice(0, 8)
      .map(
        (order) => `
        <tr data-order="${order.id}" class="${order.id === state.selectedOrderId ? 'active' : ''}">
          <td>${order.customer}</td>
          <td>${portal.formatStatus(order.status)}</td>
          <td>${portal.formatCurrency(order.total)}</td>
          <td>${portal.formatShortDate(order.date)}</td>
        </tr>`
      )
      .join('');
    body.querySelectorAll('tr[data-order]').forEach((row) => {
      row.addEventListener('click', () => {
        state.selectedOrderId = row.dataset.order;
        renderDetail();
        renderOrders();
      });
    });
  }

  function renderDetail() {
    const grid = document.getElementById('contractor-detail-grid');
    const timeline = document.getElementById('contractor-timeline');
    if (!grid || !timeline) return;
    const orders = getContractorOrders();
    const order = orders.find((o) => o.id === state.selectedOrderId) || orders[0] || null;
    if (!order) {
      grid.innerHTML = '<p>Selecciona un proyecto para ver el avance.</p>';
      timeline.innerHTML = '<li>Sin datos</li>';
      return;
    }
    grid.innerHTML = `
      <div class="portal-detail-card">
        <div class="portal-detail-label">Orden</div>
        <div class="portal-detail-value">${order.id}</div>
      </div>
      <div class="portal-detail-card">
        <div class="portal-detail-label">Estado</div>
        <div class="portal-detail-value">${portal.formatStatus(order.status)}</div>
      </div>
      <div class="portal-detail-card">
        <div class="portal-detail-label">Monto</div>
        <div class="portal-detail-value">${portal.formatCurrency(order.total)}</div>
      </div>
      <div class="portal-detail-card">
        <div class="portal-detail-label">Crew lead</div>
        <div class="portal-detail-value">${order.crewLead || 'Por confirmar'}</div>
      </div>`;
    const stages = ['draft', 'scheduled', 'en_route', 'on_site', 'job_done', 'invoiced', 'paid'];
    const current = stages.indexOf((order.status || '').toLowerCase());
    timeline.innerHTML = stages
      .map((stage, index) => {
        const active = current >= 0 ? index <= current : stage === 'scheduled';
        return `<li class="${active ? 'active' : ''}">${portal.formatStatus(stage)}</li>`;
      })
      .join('');
  }

  function renderRequests() {
    const log = document.getElementById('contractor-request-log');
    if (!log) return;
    const entries = (state.data.portalRequests || [])
      .filter((req) => req.origin === 'contractor' && req.customer === state.contractor)
      .slice(0, 5);
    if (!entries.length) {
      log.innerHTML = '<p class="stat-change">No hay solicitudes recientes.</p>';
      return;
    }
    log.innerHTML = entries
      .map(
        (entry) => `
        <div class="portal-log-item">
          <div>
            <strong>${entry.scope || 'Solicitud'}</strong>
            <span>${entry.site || 'Sitio pendiente'}</span>
          </div>
          <div style="text-align:right;">
            <strong>${entry.urgency?.toUpperCase() || 'NORMAL'}</strong>
            <span style="display:block; color:var(--text-secondary);">${portal.formatShortDate(entry.createdAt)}</span>
          </div>
        </div>`
      )
      .join('');
  }

  function downloadCsv() {
    const rows = [['Orden', 'Estado', 'Monto', 'Fecha']];
    getContractorOrders().forEach((order) => {
      rows.push([order.id, portal.formatStatus(order.status), order.total || 0, order.date || '']);
    });
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'opsis-contratista-proyectos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function updateText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
