// ============================================================================
// SUPERADMIN SIDEBAR - Opsis Suite
// Navigation and sidebar management - Verdi + Aire Design
// ============================================================================

const SuperAdminSidebar = {
    // Navigation structure with Font Awesome icons
    navigation: {
        main: [
            { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large', href: '/superadmin/index.html' }
        ],
        clientes: [
            { id: 'companies', label: 'Compañías', icon: 'fas fa-building', href: '/superadmin/companies/list.html' },
            { id: 'onboarding', label: 'Onboarding', icon: 'fas fa-user-plus', href: '/superadmin/companies/onboarding.html' }
        ],
        finanzas: [
            { id: 'billing', label: 'Facturación', icon: 'fas fa-file-invoice-dollar', href: '/superadmin/billing/overview.html' },
            { id: 'pagos', label: 'Pagos', icon: 'fas fa-credit-card', href: '/superadmin/billing/payments.html' },
            { id: 'planes', label: 'Planes', icon: 'fas fa-tags', href: '/superadmin/billing/plans.html' }
        ],
        equipo: [
            { id: 'team', label: 'Miembros', icon: 'fas fa-users', href: '/superadmin/team/list.html' },
            { id: 'roles', label: 'Roles', icon: 'fas fa-user-shield', href: '/superadmin/team/roles.html' }
        ],
        soporte: [
            { id: 'tickets', label: 'Tickets', icon: 'fas fa-headset', href: '/superadmin/support/tickets.html', badge: '3' },
            { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line', href: '/superadmin/analytics/usage.html' }
        ],
        configuracion: [
            { id: 'settings', label: 'General', icon: 'fas fa-cog', href: '/superadmin/settings/general.html' },
            { id: 'industries', label: 'Industrias', icon: 'fas fa-industry', href: '/superadmin/settings/industries.html' },
            { id: 'products', label: 'Productos', icon: 'fas fa-box', href: '/superadmin/settings/products.html' },
            { id: 'integraciones', label: 'Integraciones', icon: 'fas fa-plug', href: '/superadmin/settings/integrations.html' }
        ]
    },

    // Get current page ID from URL
    getCurrentPageId() {
        const path = window.location.pathname;
        
        if (path.includes('/companies/onboarding')) return 'onboarding';
        if (path.includes('/companies/')) return 'companies';
        if (path.includes('/billing/payments')) return 'pagos';
        if (path.includes('/billing/plans')) return 'planes';
        if (path.includes('/billing/')) return 'billing';
        if (path.includes('/team/roles')) return 'roles';
        if (path.includes('/team/')) return 'team';
        if (path.includes('/support/')) return 'tickets';
        if (path.includes('/analytics/')) return 'analytics';
        if (path.includes('/settings/industries')) return 'industries';
        if (path.includes('/settings/products')) return 'products';
        if (path.includes('/settings/integrations')) return 'integraciones';
        if (path.includes('/settings/')) return 'settings';
        if (path.includes('/index.html') || path.endsWith('/superadmin/')) return 'dashboard';
        
        return 'dashboard';
    },

    // Render sidebar HTML with Verdi + Aire design
    render() {
        const currentPage = this.getCurrentPageId();
        
        const renderLinks = (links) => {
            return links.map(link => `
                <a href="${link.href}" class="nav-link ${link.id === currentPage ? 'active' : ''}" data-page="${link.id}">
                    <i class="${link.icon}"></i>
                    <span>${link.label}</span>
                    ${link.badge ? `<span class="badge">${link.badge}</span>` : ''}
                </a>
            `).join('');
        };

        return `
            <div class="sidebar-logo">
                <div class="logo-icon">
                    <i class="fas fa-bolt"></i>
                </div>
                <div class="logo-text">
                    <span class="logo-main">Opsis Suite</span>
                    <span class="logo-sub">SuperAdmin</span>
                </div>
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-section">
                    ${renderLinks(this.navigation.main)}
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Clientes</div>
                    ${renderLinks(this.navigation.clientes)}
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Finanzas</div>
                    ${renderLinks(this.navigation.finanzas)}
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Equipo</div>
                    ${renderLinks(this.navigation.equipo)}
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Soporte</div>
                    ${renderLinks(this.navigation.soporte)}
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Configuración</div>
                    ${renderLinks(this.navigation.configuracion)}
                </div>
            </nav>
            
            <div class="sidebar-footer">
                <div class="user-profile">
                    <div class="user-avatar">A</div>
                    <div class="user-info">
                        <div class="user-name">Admin</div>
                        <div class="user-role">Super Admin</div>
                    </div>
                    <button onclick="SuperAdminSidebar.toggleTheme()" class="theme-toggle" id="themeToggle" title="Cambiar tema">
                        <i class="fas fa-moon"></i>
                    </button>
                </div>
            </div>
        `;
    },

    // Initialize sidebar
    init() {
        const sidebarContainer = document.getElementById('sidebar');
        if (sidebarContainer) {
            sidebarContainer.innerHTML = this.render();
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('opsis-theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            const toggle = document.getElementById('themeToggle');
            if (toggle) toggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    },

    // Toggle dark/light theme
    toggleTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const toggle = document.getElementById('themeToggle');
        
        if (isDark) {
            document.body.removeAttribute('data-theme');
            if (toggle) toggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('opsis-theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            if (toggle) toggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('opsis-theme', 'dark');
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SuperAdminSidebar.init();
});
