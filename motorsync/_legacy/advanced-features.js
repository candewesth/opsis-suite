/**
 * OPSIS SUITE - ADVANCED FEATURES
 * Sistema completo de funcionalidades avanzadas para MotorSync
 * Incluye: Búsqueda Global, Notificaciones, Timeline, Tareas, Documentos, etc.
 */

// ============================================================================
// 1. BÚSQUEDA GLOBAL (Ctrl+K / Cmd+K)
// ============================================================================

class GlobalSearch {
  constructor() {
    this.modal = null;
    this.searchInput = null;
    this.resultsContainer = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createModal();
    this.bindKeyboardShortcut();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'global-search-modal';
    modal.className = 'global-search-modal';
    modal.innerHTML = `
      <div class="search-modal-overlay"></div>
      <div class="search-modal-content">
        <div class="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            id="global-search-input" 
            placeholder="Buscar clientes, proyectos, facturas, equipos..." 
            autocomplete="off"
          />
          <kbd class="search-kbd">ESC</kbd>
        </div>
        <div class="search-results" id="search-results">
          <div class="search-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <p>Escribe para buscar en todos los módulos</p>
            <div class="search-tips">
              <span><kbd>↑</kbd> <kbd>↓</kbd> navegar</span>
              <span><kbd>↵</kbd> abrir</span>
              <span><kbd>ESC</kbd> cerrar</span>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    this.modal = modal;
    this.searchInput = document.getElementById('global-search-input');
    this.resultsContainer = document.getElementById('search-results');
    
    // Event listeners
    this.modal.querySelector('.search-modal-overlay').addEventListener('click', () => this.close());
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    this.searchInput.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
  }

  bindKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K o Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }
      
      // ESC para cerrar
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.modal.style.display = 'flex';
    this.isOpen = true;
    setTimeout(() => {
      this.searchInput.focus();
    }, 100);
  }

  close() {
    this.modal.style.display = 'none';
    this.isOpen = false;
    this.searchInput.value = '';
    this.resultsContainer.innerHTML = `
      <div class="search-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <p>Escribe para buscar en todos los módulos</p>
      </div>
    `;
  }

  handleSearch(query) {
    if (!query || query.length < 2) {
      this.resultsContainer.innerHTML = `
        <div class="search-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>Escribe al menos 2 caracteres</p>
        </div>
      `;
      return;
    }

    const results = this.searchAll(query);
    this.renderResults(results);
  }

  searchAll(query) {
    const lowerQuery = query.toLowerCase();
    const results = {
      customers: [],
      projects: [],
      invoices: [],
      team: [],
      tasks: []
    };

    // Buscar en clientes (mock data - integrar con datos reales)
    const mockCustomers = this.getMockCustomers();
    results.customers = mockCustomers.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.company.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    // Buscar en proyectos
    const mockProjects = this.getMockProjects();
    results.projects = mockProjects.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.location.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    // Buscar en facturas
    const mockInvoices = this.getMockInvoices();
    results.invoices = mockInvoices.filter(i => 
      i.number.toLowerCase().includes(lowerQuery) ||
      i.customer.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    // Buscar en equipo
    const mockTeam = this.getMockTeam();
    results.team = mockTeam.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.role.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    return results;
  }

  renderResults(results) {
    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalResults === 0) {
      this.resultsContainer.innerHTML = `
        <div class="search-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="11" y1="16" x2="11.01" y2="16"></line>
          </svg>
          <p>No se encontraron resultados</p>
        </div>
      `;
      return;
    }

    let html = '';

    if (results.customers.length > 0) {
      html += '<div class="search-category">';
      html += '<div class="search-category-header">👥 Clientes</div>';
      results.customers.forEach(customer => {
        html += `
          <div class="search-result-item" data-type="customer" data-id="${customer.id}">
            <div class="search-result-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="search-result-content">
              <div class="search-result-title">${customer.name}</div>
              <div class="search-result-subtitle">${customer.company} • ${customer.email}</div>
            </div>
            <div class="search-result-arrow">→</div>
          </div>
        `;
      });
      html += '</div>';
    }

    if (results.projects.length > 0) {
      html += '<div class="search-category">';
      html += '<div class="search-category-header">📊 Proyectos</div>';
      results.projects.forEach(project => {
        html += `
          <div class="search-result-item" data-type="project" data-id="${project.id}">
            <div class="search-result-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <div class="search-result-content">
              <div class="search-result-title">${project.name}</div>
              <div class="search-result-subtitle">${project.location} • ${project.status}</div>
            </div>
            <div class="search-result-arrow">→</div>
          </div>
        `;
      });
      html += '</div>';
    }

    if (results.invoices.length > 0) {
      html += '<div class="search-category">';
      html += '<div class="search-category-header">💰 Facturas</div>';
      results.invoices.forEach(invoice => {
        html += `
          <div class="search-result-item" data-type="invoice" data-id="${invoice.id}">
            <div class="search-result-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
              </svg>
            </div>
            <div class="search-result-content">
              <div class="search-result-title">${invoice.number}</div>
              <div class="search-result-subtitle">${invoice.customer} • $${invoice.amount.toLocaleString()}</div>
            </div>
            <div class="search-result-arrow">→</div>
          </div>
        `;
      });
      html += '</div>';
    }

    if (results.team.length > 0) {
      html += '<div class="search-category">';
      html += '<div class="search-category-header">👨‍💼 Equipo</div>';
      results.team.forEach(member => {
        html += `
          <div class="search-result-item" data-type="team" data-id="${member.id}">
            <div class="search-result-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21a8 8 0 1 0-16 0"></path>
              </svg>
            </div>
            <div class="search-result-content">
              <div class="search-result-title">${member.name}</div>
              <div class="search-result-subtitle">${member.role} • ${member.department}</div>
            </div>
            <div class="search-result-arrow">→</div>
          </div>
        `;
      });
      html += '</div>';
    }

    this.resultsContainer.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        this.handleResultClick(item.dataset.type, item.dataset.id);
      });
    });
  }

  handleResultClick(type, id) {
    console.log(`Navigating to ${type} with ID: ${id}`);
    
    // Implementar navegación según el tipo
    switch(type) {
      case 'customer':
        if (window.app && window.app.showPage) {
          window.app.showPage('customers');
          // TODO: Seleccionar cliente específico
        }
        break;
      case 'project':
        window.location.href = 'projectsync.html';
        break;
      case 'invoice':
        if (window.app && window.app.showPage) {
          window.app.showPage('management');
        }
        break;
      case 'team':
        if (window.app && window.app.showPage) {
          window.app.showPage('management');
        }
        break;
    }
    
    this.close();
  }

  handleKeyNavigation(e) {
    const items = this.resultsContainer.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    const activeItem = this.resultsContainer.querySelector('.search-result-item.active');
    let currentIndex = activeItem ? Array.from(items).indexOf(activeItem) : -1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    } else if (e.key === 'Enter' && activeItem) {
      e.preventDefault();
      activeItem.click();
      return;
    } else {
      return;
    }

    items.forEach(item => item.classList.remove('active'));
    items[currentIndex].classList.add('active');
    items[currentIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // Mock data methods
  getMockCustomers() {
    return [
      { id: 1, name: 'Juan Pérez', company: 'Construcciones ABC', email: 'juan@abc.com', phone: '555-1234' },
      { id: 2, name: 'María González', company: 'Inmobiliaria XYZ', email: 'maria@xyz.com', phone: '555-5678' },
      { id: 3, name: 'Carlos Rodríguez', company: 'Desarrollos Norte', email: 'carlos@norte.com', phone: '555-9012' },
      { id: 4, name: 'Ana López', company: 'Constructora Sur', email: 'ana@sur.com', phone: '555-3456' },
      { id: 5, name: 'Luis Martínez', company: 'Proyectos Este', email: 'luis@este.com', phone: '555-7890' },
      { id: 6, name: 'Carmen Sánchez', company: 'Edificaciones Oeste', email: 'carmen@oeste.com', phone: '555-2345' },
      { id: 7, name: 'Roberto Torres', company: 'Viviendas Modernas', email: 'roberto@modernas.com', phone: '555-6789' },
      { id: 8, name: 'Elena Ramírez', company: 'Casas del Valle', email: 'elena@valle.com', phone: '555-0123' }
    ];
  }

  getMockProjects() {
    return [
      { id: 1, name: 'Residencial Los Pinos', location: 'Tijuana, BC', status: 'En Proceso', progress: 65 },
      { id: 2, name: 'Plaza Comercial Centro', location: 'Ensenada, BC', status: 'Planeación', progress: 25 },
      { id: 3, name: 'Conjunto Habitacional Norte', location: 'Mexicali, BC', status: 'En Proceso', progress: 45 },
      { id: 4, name: 'Torre de Oficinas Premium', location: 'Tijuana, BC', status: 'Completado', progress: 100 },
      { id: 5, name: 'Fraccionamiento Las Palmas', location: 'Rosarito, BC', status: 'En Proceso', progress: 80 }
    ];
  }

  getMockInvoices() {
    return [
      { id: 1, number: 'FAC-2025-001', customer: 'Construcciones ABC', amount: 125000, status: 'Pagada' },
      { id: 2, number: 'FAC-2025-002', customer: 'Inmobiliaria XYZ', amount: 89500, status: 'Pendiente' },
      { id: 3, number: 'FAC-2025-003', customer: 'Desarrollos Norte', amount: 230000, status: 'Vencida' },
      { id: 4, number: 'FAC-2025-004', customer: 'Constructora Sur', amount: 175000, status: 'Pagada' },
      { id: 5, number: 'FAC-2025-005', customer: 'Proyectos Este', amount: 95000, status: 'Pendiente' }
    ];
  }

  getMockTeam() {
    return [
      { id: 1, name: 'Pedro Sánchez', role: 'Project Manager', department: 'Operaciones' },
      { id: 2, name: 'Laura Gómez', role: 'Estimador', department: 'Estimación' },
      { id: 3, name: 'Miguel Hernández', role: 'Supervisor', department: 'Operaciones' },
      { id: 4, name: 'Sofia Díaz', role: 'Administrativo', department: 'Administración' },
      { id: 5, name: 'Jorge Castro', role: 'Operador', department: 'Campo' }
    ];
  }
}

// ============================================================================
// 2. CENTRO DE NOTIFICACIONES
// ============================================================================

class NotificationCenter {
  constructor() {
    this.notifications = [];
    this.maxNotifications = 50;
    this.unreadCount = 0;
    this.panel = null;
    this.init();
  }

  init() {
    this.loadNotifications();
    this.createPanel();
    this.updateBadge();
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.id = 'notification-center-panel';
    panel.className = 'notification-center-panel';
    panel.innerHTML = `
      <div class="notification-panel-overlay"></div>
      <div class="notification-panel-content">
        <div class="notification-panel-header">
          <h3>🔔 Notificaciones</h3>
          <div class="notification-panel-actions">
            <button class="btn-icon" id="mark-all-read" title="Marcar todas como leídas">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button class="btn-icon" id="clear-all-notifications" title="Limpiar todas">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button class="btn-icon" id="close-notification-panel">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="notification-panel-filters">
          <button class="filter-btn active" data-filter="all">Todas</button>
          <button class="filter-btn" data-filter="unread">No leídas</button>
          <button class="filter-btn" data-filter="success">Éxito</button>
          <button class="filter-btn" data-filter="error">Errores</button>
          <button class="filter-btn" data-filter="warning">Alertas</button>
        </div>
        <div class="notification-panel-list" id="notification-list">
          <!-- Notificaciones se cargan aquí -->
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    
    this.panel = panel;
    this.bindPanelEvents();
    this.renderNotifications();
  }

  bindPanelEvents() {
    // Cerrar panel
    this.panel.querySelector('.notification-panel-overlay').addEventListener('click', () => this.close());
    this.panel.querySelector('#close-notification-panel').addEventListener('click', () => this.close());
    
    // Marcar todas como leídas
    this.panel.querySelector('#mark-all-read').addEventListener('click', () => this.markAllAsRead());
    
    // Limpiar todas
    this.panel.querySelector('#clear-all-notifications').addEventListener('click', () => this.clearAll());
    
    // Filtros
    this.panel.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.panel.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.filterNotifications(e.target.dataset.filter);
      });
    });
  }

  open() {
    this.panel.classList.add('open');
  }

  close() {
    this.panel.classList.remove('open');
  }

  toggle() {
    if (this.panel.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  }

  addNotification(title, message, type = 'info') {
    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(notification);
    
    // Limitar a max notificaciones
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }

    this.unreadCount++;
    this.saveNotifications();
    this.updateBadge();
    this.renderNotifications();
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      notification.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.saveNotifications();
      this.updateBadge();
      this.renderNotifications();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
    this.saveNotifications();
    this.updateBadge();
    this.renderNotifications();
  }

  deleteNotification(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    }
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.updateBadge();
    this.renderNotifications();
  }

  clearAll() {
    if (confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')) {
      this.notifications = [];
      this.unreadCount = 0;
      this.saveNotifications();
      this.updateBadge();
      this.renderNotifications();
    }
  }

  filterNotifications(filter) {
    let filtered = this.notifications;
    
    switch(filter) {
      case 'unread':
        filtered = this.notifications.filter(n => !n.read);
        break;
      case 'success':
      case 'error':
      case 'warning':
      case 'info':
        filtered = this.notifications.filter(n => n.type === filter);
        break;
    }

    this.renderNotifications(filtered);
  }

  renderNotifications(notificationsToRender = null) {
    const notifications = notificationsToRender || this.notifications;
    const listContainer = this.panel.querySelector('#notification-list');

    if (notifications.length === 0) {
      listContainer.innerHTML = `
        <div class="notification-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <p>No hay notificaciones</p>
        </div>
      `;
      return;
    }

    let html = '';
    notifications.forEach(notification => {
      const icon = this.getNotificationIcon(notification.type);
      const timeAgo = this.getTimeAgo(notification.timestamp);
      
      html += `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
          <div class="notification-icon notification-icon-${notification.type}">
            ${icon}
          </div>
          <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${timeAgo}</div>
          </div>
          <div class="notification-actions">
            ${!notification.read ? '<button class="btn-icon" data-action="mark-read" title="Marcar como leída">●</button>' : ''}
            <button class="btn-icon" data-action="delete" title="Eliminar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Bind action buttons
    listContainer.querySelectorAll('.notification-item').forEach(item => {
      const id = parseInt(item.dataset.id);
      
      const markReadBtn = item.querySelector('[data-action="mark-read"]');
      if (markReadBtn) {
        markReadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.markAsRead(id);
        });
      }

      const deleteBtn = item.querySelector('[data-action="delete"]');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteNotification(id);
      });

      // Click en item para marcar como leída
      item.addEventListener('click', () => {
        this.markAsRead(id);
      });
    });
  }

  getNotificationIcon(type) {
    const icons = {
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    return icons[type] || icons.info;
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return then.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  }

  updateBadge() {
    // Actualizar badge en el botón de notificaciones del header
    const badge = document.getElementById('notification-badge');
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  loadNotifications() {
    try {
      const stored = localStorage.getItem('opsis_notifications');
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.notifications || [];
        this.unreadCount = this.notifications.filter(n => !n.read).length;
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  }

  saveNotifications() {
    try {
      localStorage.setItem('opsis_notifications', JSON.stringify({
        notifications: this.notifications,
        lastUpdated: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Error saving notifications:', err);
    }
  }
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar búsqueda global
  window.globalSearch = new GlobalSearch();
  console.log('✅ Búsqueda Global inicializada (Ctrl+K)');

  // Inicializar centro de notificaciones
  window.notificationCenter = new NotificationCenter();
  console.log('✅ Centro de Notificaciones inicializado');

  // Agregar notificaciones de ejemplo (solo para demo)
  setTimeout(() => {
    window.notificationCenter.addNotification(
      'Bienvenido a Opsis Suite',
      'Sistema de notificaciones activado. Presiona Ctrl+K para búsqueda global.',
      'success'
    );
  }, 1000);
});
