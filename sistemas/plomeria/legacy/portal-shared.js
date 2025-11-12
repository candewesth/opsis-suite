(function (global) {
  const STORAGE_KEYS = {
    orders: 'opsis_orders',
    customers: 'opsis_customers',
    quotes: 'opsis_quotes',
    invoices: 'opsis_invoices',
    portalRequests: 'opsis_portal_requests',
  };

  const ORDER_STATES = {
    draft: { label: 'Borrador' },
    scheduled: { label: 'Programada' },
    en_route: { label: 'En ruta' },
    on_site: { label: 'En sitio' },
    job_done: { label: 'Completada' },
    invoiced: { label: 'Facturada' },
    paid: { label: 'Pagada' },
    archived: { label: 'Archivada' },
  };

  const ORDER_SEEDS = [
    {
      id: 'ORD-101',
      customer: 'Atlas Builders',
      status: 'scheduled',
      window: '08:00 - 11:00',
      date: '2024-06-18',
      service: 'Instalación general',
      total: 18200,
      priority: 'high',
      crewLead: 'Ana Owner',
      technicians: ['Marco Tech'],
    },
    {
      id: 'ORD-102',
      customer: 'Cedar Homes',
      status: 'on_site',
      window: '13:00 - 16:00',
      date: '2024-06-19',
      service: 'Mantenimiento trimestral',
      total: 6200,
      priority: 'normal',
      crewLead: 'Sara Field',
      technicians: ['Sara Field'],
    },
  ];

  const CUSTOMER_SEEDS = [
    { id: 'C-1', name: 'Atlas Builders', type: 'contractor' },
    { id: 'C-2', name: 'Cedar Homes', type: 'commercial' },
  ];

  const QUOTE_SEEDS = [
    { id: 'Q-200', customer: 'Atlas Builders', total: 12900, status: 'draft', issued: '2024-06-01', validUntil: '2024-06-30' },
    { id: 'Q-201', customer: 'Cedar Homes', total: 6200, status: 'sent', issued: '2024-06-05', validUntil: '2024-06-25' },
  ];

  const INVOICE_SEEDS = [
    { id: 'INV-410', customer: 'Cedar Homes', total: 9800, status: 'open', issued: '2024-05-15', due: '2024-06-15' },
    { id: 'INV-411', customer: 'Atlas Builders', total: 14300, status: 'paid', issued: '2024-05-05', due: '2024-05-20' },
  ];

  function loadCollection(key, fallback = []) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS[key]);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (err) {
      console.warn('Portal storage error', err);
      return fallback;
    }
  }

  function saveCollection(key, value) {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (err) {
      console.warn('Portal storage write error', err);
    }
  }

  function bootstrapCollections() {
    if (!localStorage.getItem(STORAGE_KEYS.orders)) saveCollection('orders', ORDER_SEEDS);
    if (!localStorage.getItem(STORAGE_KEYS.customers)) saveCollection('customers', CUSTOMER_SEEDS);
    if (!localStorage.getItem(STORAGE_KEYS.quotes)) saveCollection('quotes', QUOTE_SEEDS);
    if (!localStorage.getItem(STORAGE_KEYS.invoices)) saveCollection('invoices', INVOICE_SEEDS);
    if (!localStorage.getItem(STORAGE_KEYS.portalRequests)) saveCollection('portalRequests', []);
  }

  function getData() {
    bootstrapCollections();
    return {
      orders: loadCollection('orders', ORDER_SEEDS),
      customers: loadCollection('customers', CUSTOMER_SEEDS),
      quotes: loadCollection('quotes', QUOTE_SEEDS),
      invoices: loadCollection('invoices', INVOICE_SEEDS),
      portalRequests: loadCollection('portalRequests', []),
    };
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
  }

  function formatShortDate(dateString) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  }

  function formatStatus(status) {
    if (!status) return '—';
    return ORDER_STATES[status]?.label || status.replace(/_/g, ' ');
  }

  function getQuoteStatusMeta(status = '') {
    const map = {
      draft: { label: 'Borrador', color: '#475569' },
      sent: { label: 'Enviada', color: '#1d4ed8' },
      approved: { label: 'Aprobada', color: '#15803d' },
      won: { label: 'Ganada', color: '#15803d' },
      lost: { label: 'Perdida', color: '#b91c1c' },
    };
    const key = status.toLowerCase();
    return map[key] || { label: formatStatus(status), color: '#475569' };
  }

  function getInvoiceStatusMeta(status = '') {
    const map = {
      open: { label: 'Abierta', color: '#1d4ed8' },
      due: { label: 'Por vencer', color: '#c2410c' },
      overdue: { label: 'Vencida', color: '#b91c1c' },
      pending: { label: 'Pendiente', color: '#c2410c' },
      paid: { label: 'Pagada', color: '#15803d' },
    };
    const key = status.toLowerCase();
    return map[key] || { label: formatStatus(status), color: '#475569' };
  }

  function isOrderCompleted(status) {
    return ['job_done', 'paid', 'invoiced', 'completed', 'archived'].includes((status || '').toLowerCase());
  }

  function savePortalRequest(payload) {
    const current = loadCollection('portalRequests', []);
    current.unshift(payload);
    saveCollection('portalRequests', current);
    return current;
  }

  global.OpsisPortal = {
    STORAGE_KEYS,
    getData,
    formatCurrency,
    formatShortDate,
    formatStatus,
    getQuoteStatusMeta,
    getInvoiceStatusMeta,
    isOrderCompleted,
    savePortalRequest,
  };
})(window);
