(function () {
  const portal = window.OpsisPortal;
  if (!portal) return;

  const settings = JSON.parse(localStorage.getItem('opsis_settings') || '{}');
  const state = {
    customer: '',
    companyName: (settings.companyName || 'Tu compañía').trim() || 'Tu compañía',
    selectedOrderId: null,
    data: portal.getData(),
  };

  function init() {
    applyTheme(settings.theme || 'light');
    setupThemeToggle();
    deriveCustomer();
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
    const btn = document.getElementById('client-theme-toggle');
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

  function deriveCustomer() {
    const { customers, orders } = state.data;
    state.customer = customers[0]?.name || orders[0]?.customer || 'Cliente Opsis';
    if (!state.selectedOrderId && orders.length) {
      const primary = orders.find((order) => order.customer === state.customer) || orders[0];
      state.selectedOrderId = primary?.id || null;
    }
    const customerFromStorage = localStorage.getItem('portal_customer');
    if (customerFromStorage) state.customer = customerFromStorage;
    const badge = document.getElementById('client-customer-name');
    if (badge) badge.textContent = state.customer;
  }

  function renderMeta() {
    updateText('portal-company-name', state.companyName);
    updateText('portal-company-label', state.companyName);
    updateText('client-greeting-name', state.customer);
    const lastUpdate = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date());
    updateText('client-last-update', lastUpdate);
  }

  function bindEvents() {
    const form = document.getElementById('client-request-form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const payload = {
          id: `REQ-${Date.now().toString(36).toUpperCase()}`,
          origin: 'client',
          customer: state.customer,
          summary: formData.get('summary') || '',
          site: formData.get('address') || '',
          preferredDate: formData.get('preferredDate') || '',
          notes: formData.get('notes') || '',
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        state.data.portalRequests = portal.savePortalRequest(payload);
        form.reset();
        renderRequests();
        alert('Solicitud recibida. Nuestro equipo te contactará en breve.');
      });
    }
    const newBtn = document.getElementById('btn-client-new');
    if (newBtn && form) {
      newBtn.addEventListener('click', () => {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const first = form.querySelector('input, textarea');
        if (first) first.focus();
      });
    }
    const supportBtn = document.getElementById('btn-client-support');
    if (supportBtn) {
      supportBtn.addEventListener('click', () => {
        window.location.href = 'mailto:soporte@opsis.com?subject=Portal%20Cliente';
      });
    }
  }

  function renderAll() {
    renderKpis();
    renderOrders();
    renderDetail();
    renderDocuments();
    renderRequests();
  }

  function getCustomerOrders() {
    return (state.data.orders || []).filter((order) => order.customer === state.customer);
  }

  function renderKpis() {
    const orders = getCustomerOrders();
    const openCount = orders.filter((order) => !portal.isOrderCompleted(order.status)).length;
    const quotes = (state.data.quotes || []).filter((quote) => quote.customer === state.customer);
    const invoices = (state.data.invoices || []).filter((invoice) => invoice.customer === state.customer);
    const pending = invoices
      .filter((inv) => ['open', 'due', 'pending', 'overdue'].includes((inv.status || '').toLowerCase()))
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
    const quoteValue = quotes[0] ? portal.formatCurrency(quotes[0].total) : '$0';

    updateText('client-kpi-open', openCount);
    updateText('client-kpi-open-hint', 'En seguimiento');
    updateText('client-kpi-quote', quoteValue);
    updateText('client-kpi-quote-hint', quotes[0] ? portal.getQuoteStatusMeta(quotes[0].status).label : 'Sin cotizaciones activas');
    updateText('client-kpi-invoice', portal.formatCurrency(pending));
    updateText('client-kpi-invoice-hint', pending ? 'Pendiente de pago' : 'Al corriente');
  }

  function renderOrders() {
    const body = document.getElementById('client-orders-body');
    if (!body) return;
    const orders = getCustomerOrders().slice(0, 6);
    if (!orders.length) {
      body.innerHTML = '<tr><td colspan="4">Sin órdenes registradas</td></tr>';
      return;
    }
    body.innerHTML = orders
      .map(
        (order) => `
        <tr data-order="${order.id}" class="${order.id === state.selectedOrderId ? 'active' : ''}">
          <td>${order.id}</td>
          <td>${portal.formatStatus(order.status)}</td>
          <td>${order.window || '—'}</td>
          <td>${portal.formatCurrency(order.total)}</td>
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
    const grid = document.getElementById('client-detail-grid');
    const timeline = document.getElementById('client-timeline');
    if (!grid || !timeline) return;
    const orders = getCustomerOrders();
    const order = orders.find((o) => o.id === state.selectedOrderId) || orders[0] || null;
    if (!order) {
      grid.innerHTML = '<p>Selecciona una orden para ver los detalles.</p>';
      timeline.innerHTML = '<li>Sin información</li>';
      return;
    }
    grid.innerHTML = `
      <div class="portal-detail-card">
        <div class="portal-detail-label">Orden</div>
        <div class="portal-detail-value">${order.id}</div>
      </div>
      <div class="portal-detail-card">
        <div class="portal-detail-label">Ventana</div>
        <div class="portal-detail-value">${order.window || '—'}</div>
      </div>
      <div class="portal-detail-card">
        <div class="portal-detail-label">Prioridad</div>
        <div class="portal-detail-value">${(order.priority || 'Normal').toUpperCase()}</div>
      </div>
      <div class="portal-detail-card">
        <div class="portal-detail-label">Responsable</div>
        <div class="portal-detail-value">${order.crewLead || 'Asignando'}</div>
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

  function renderDocuments() {
    const body = document.getElementById('client-documents-body');
    if (!body) return;
    const docs = [];
    (state.data.quotes || [])
      .filter((quote) => quote.customer === state.customer)
      .forEach((quote) =>
        docs.push({
          label: `Cotización ${quote.id}`,
          status: portal.getQuoteStatusMeta(quote.status).label,
          value: portal.formatCurrency(quote.total),
          date: portal.formatShortDate(quote.issued),
        })
      );
    (state.data.invoices || [])
      .filter((invoice) => invoice.customer === state.customer)
      .forEach((invoice) =>
        docs.push({
          label: `Factura ${invoice.id}`,
          status: portal.getInvoiceStatusMeta(invoice.status).label,
          value: portal.formatCurrency(invoice.total),
          date: portal.formatShortDate(invoice.due || invoice.date),
        })
      );
    if (!docs.length) {
      body.innerHTML = '<tr><td colspan="5">Sin documentos disponibles</td></tr>';
      return;
    }
    body.innerHTML = docs
      .slice(0, 8)
      .map(
        (doc) => `
        <tr>
          <td>${doc.label}</td>
          <td>${doc.status}</td>
          <td>${doc.value}</td>
          <td>${doc.date}</td>
          <td><button class="btn btn-secondary" style="padding:6px 12px;">Descargar</button></td>
        </tr>`
      )
      .join('');
  }

  function renderRequests() {
    const log = document.getElementById('client-request-log');
    if (!log) return;
    const entries = (state.data.portalRequests || [])
      .filter((req) => req.origin === 'client' && req.customer === state.customer)
      .slice(0, 4);
    if (!entries.length) {
      log.innerHTML = '<p class="stat-change">Aún no has registrado solicitudes.</p>';
      return;
    }
    log.innerHTML = entries
      .map(
        (entry) => `
        <div class="portal-log-item">
          <div>
            <strong>${entry.summary || 'Solicitud'}</strong>
            <span>${entry.site || 'Sitio pendiente'}</span>
          </div>
          <div style="text-align:right;">
            <strong>${portal.formatShortDate(entry.preferredDate || entry.createdAt)}</strong>
            <span style="display:block; color:var(--text-secondary);">${portal.formatStatus(entry.status)}</span>
          </div>
        </div>`
      )
      .join('');
  }

  function updateText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
