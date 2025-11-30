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
      href: 'threadsync-list.html',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
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

  function detectActive() {
    const manual = document.body.dataset.sidebarActive || '';
    if (manual) return manual.toLowerCase();
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.dataset.active) return sidebar.dataset.active.toLowerCase();
    const path = (window.location && window.location.pathname) || '';
    const match = MENU.find((item) => path.endsWith(`/${item.href}`) || path.endsWith(item.href));
    return (match && match.id) || 'dashboard';
  }

  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const activeId = detectActive();
    sidebar.innerHTML = MENU.map((item) => {
      const isActive = item.id === activeId;
      return `<a href="${item.href}" class="sidebar-item${isActive ? ' active' : ''}">${item.icon}<span>${item.label}</span></a>`;
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', renderSidebar);
  window.refreshSidebar = renderSidebar;
})();
