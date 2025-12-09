(function () {
  const MENU = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: 'motorsync.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
    },
    {
      id: 'plansync',
      label: 'PlanSync',
      href: 'plansync.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    },
    {
      id: 'projectsync',
      label: 'ProjectSync',
      href: 'projectsync.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>',
    },
    {
      id: 'threadsync',
      label: 'ThreadSync',
      href: 'threadview.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    },
    {
      id: 'notifications',
      label: 'NotifySync',
      href: 'NotifySync.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
    },
    {
      id: 'howsync',
      label: 'HowSync',
      href: 'howsync.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: 'analytics.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
    },
    {
      id: 'clientsync',
      label: 'ClientSync',
      href: 'clientsync.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87m-3-12.13a4 4 0 0 1 0 7.75"></path></svg>',
    },
    {
      id: 'management',
      label: 'Management',
      href: 'management.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
    },
    {
      id: 'settings',
      label: 'Configuración',
      href: 'settings.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.4-6.4l-4.2 4.2m-7.1 0L2.6 5.6m18.8 12.8l-4.2-4.2m-7.1 0l-4.5 4.5"></path></svg>',
    },
  ];

  const SIDEBAR_STYLES = `
    #sidebar.ops-sidebar {
      width: 260px;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      padding: 12px 0 16px;
      position: sticky;
      top: 0;
    }
    #sidebar.ops-sidebar nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 12px;
      flex: 1;
    }
    #sidebar.ops-sidebar .sidebar-item {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #475569;
      font-weight: 600;
      font-size: 14px;
      border-radius: 12px;
      transition: all 0.2s ease;
      border-radius: 10px;
    }
    #sidebar.ops-sidebar .sidebar-item svg {
      color: #64748b;
    }
    #sidebar.ops-sidebar .sidebar-item:hover {
      background: rgba(2, 115, 94, 0.08);
      color: #02735E;
    }
    #sidebar.ops-sidebar .sidebar-item.active {
      background: transparent;
      color: #02735E;
      font-weight: 700;
      box-shadow: none;
    }
    #sidebar.ops-sidebar .sidebar-footer {
      padding: 16px 24px 0;
      border-top: 1px solid #e2e8f0;
      margin-top: 16px;
    }
    #sidebar.ops-sidebar .sidebar-footer button {
      width: 100%;
      border: none;
      border-radius: 12px;
      padding: 10px 16px;
      font-weight: 600;
      font-size: 13px;
      background: #eef2ff;
      color: #312e81;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
    }
    @media (max-width: 1024px) {
      #sidebar.ops-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        z-index: 40;
      }
    }
  `;

  function ensureStyles() {
    if (document.getElementById('ops-sidebar-styles')) return;
    const style = document.createElement('style');
    style.id = 'ops-sidebar-styles';
    style.textContent = SIDEBAR_STYLES;
    document.head.appendChild(style);
  }

  function detectActive() {
    const manual = document.body.dataset.sidebarActive || '';
    if (manual) return manual.toLowerCase();
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.dataset.active) return sidebar.dataset.active.toLowerCase();
    const path = (window.location && window.location.pathname) || '';
    const match = MENU.find((item) => path.endsWith(`/${item.href}`) || path.endsWith(item.href));
    return (match && match.id) || 'dashboard';
  }

  function normalizeReturnDestination(value) {
    if (!value) return 'motorsync.html';
    const trimmed = value.trim();
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('file://')) {
      return trimmed;
    }
    const basePath = trimmed.split(/[?#]/)[0];
    if (/\.html?$/i.test(basePath)) return trimmed;
    return `${trimmed}.html`;
  }

  function setupReturnBreadcrumbs() {
    const params = new URLSearchParams(window.location.search);
    const queryTarget = params.get('returnTo');
    document.querySelectorAll('.back-button[data-return-target]').forEach((button) => {
      if (button.dataset.returnBound === 'true') return;
      const fallback = button.dataset.returnTarget || 'motorsync';
      const destination = normalizeReturnDestination(queryTarget || fallback);
      button.dataset.returnBound = 'true';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = destination;
      });
      button.setAttribute('data-return-href', destination);
    });
  }

  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    ensureStyles();
    const activeId = detectActive();
    sidebar.classList.add('ops-sidebar');
    sidebar.innerHTML = `
      <nav aria-label="Navegación principal">
        ${MENU.map((item) => {
          const isActive = item.id === activeId;
          return `<a href="${item.href}" data-page="${item.id}" class="sidebar-item${isActive ? ' active' : ''}">${item.icon}<span>${item.label}</span></a>`;
        }).join('')}
      </nav>
      <div class="sidebar-footer">
        <button type="button" onclick="window.open('../INTEGRATION_FLOW.md', '_blank')" aria-label="Ver documentación del sistema">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><circle cx="12" cy="16" r="1"></circle></svg>
          Guía rápida
        </button>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    setupReturnBreadcrumbs();
  });
  window.refreshSidebar = renderSidebar;
})();
