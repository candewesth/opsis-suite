// ============================================================================
// SUPERADMIN SIDEBAR - Opsis Suite
// Navigation and sidebar management - Verdi + Aire Design
// ============================================================================

const SuperAdminSidebar = {
    // Navigation structure with Font Awesome icons
    navigation: {
        main: [
            { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home', href: '/superadmin/index.html' }
        ],
        clientes: [
            { id: 'companies', label: 'Compañías', icon: 'fas fa-building', href: '/superadmin/companies/list.html', badge: '5' },
            { id: 'onboarding', label: 'Onboarding', icon: 'fas fa-rocket', href: '/superadmin/companies/onboarding.html' }
        ],
        finanzas: [
            { id: 'billing', label: 'Ingresos', icon: 'fas fa-chart-pie', href: '/superadmin/billing/overview.html' },
            { id: 'invoices', label: 'Facturas', icon: 'fas fa-file-invoice-dollar', href: '/superadmin/billing/invoices.html' },
            { id: 'subscriptions', label: 'Suscripciones', icon: 'fas fa-sync-alt', href: '/superadmin/billing/subscriptions.html' }
        ],
        equipo: [
            { id: 'team', label: 'Miembros', icon: 'fas fa-users', href: '/superadmin/team/list.html' },
            { id: 'roles', label: 'Roles', icon: 'fas fa-user-shield', href: '/superadmin/team/roles.html' }
        ],
        soporte: [
            { id: 'tickets', label: 'Tickets', icon: 'fas fa-ticket-alt', href: '/superadmin/support/tickets.html', badge: '3' },
            { id: 'knowledge', label: 'Base de Conocimiento', icon: 'fas fa-book', href: '/superadmin/support/knowledge.html' }
        ],
        configuracion: [
            { id: 'settings', label: 'General', icon: 'fas fa-cog', href: '/superadmin/settings/general.html' },
            { id: 'industries', label: 'Industrias', icon: 'fas fa-industry', href: '/superadmin/settings/industries.html' },
            { id: 'products', label: 'Productos', icon: 'fas fa-box', href: '/superadmin/settings/products.html' },
            { id: 'plans', label: 'Planes', icon: 'fas fa-tags', href: '/superadmin/settings/plans.html' }
        ]
    },

    // Get current page ID from URL
    getCurrentPageId() {
        const path = window.location.pathname;
        
        if (path.includes('/companies/onboarding')) return 'onboarding';
        if (path.includes('/companies/')) return 'companies';
        if (path.includes('/billing/invoices')) return 'invoices';
        if (path.includes('/billing/subscriptions')) return 'subscriptions';
        if (path.includes('/billing/')) return 'billing';
        if (path.includes('/team/roles')) return 'roles';
        if (path.includes('/team/')) return 'team';
        if (path.includes('/support/knowledge')) return 'knowledge';
        if (path.includes('/support/')) return 'tickets';
        if (path.includes('/settings/industries')) return 'industries';
        if (path.includes('/settings/products')) return 'products';
        if (path.includes('/settings/plans')) return 'plans';
        if (path.includes('/settings/')) return 'settings';
        if (path.includes('/index.html') || path.endsWith('/superadmin/') || path.endsWith('/superadmin')) return 'dashboard';
        
        return 'dashboard';
    },

    // Render sidebar HTML with Verdi + Aire design
    render() {
        const currentPage = this.getCurrentPageId();
        
        const renderLinks = (links) => {
            return links.map(link => `
                <a href="${link.href}" class="nav-item ${link.id === currentPage ? 'active' : ''}" data-page="${link.id}">
                    <i class="${link.icon}"></i>
                    <span>${link.label}</span>
                    ${link.badge ? `<span class="badge">${link.badge}</span>` : ''}
                </a>
            `).join('');
        };

        return `
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <i class="fas fa-cube"></i>
                </div>
                <div class="sidebar-brand">
                    <h1>Opsis Suite</h1>
                    <span>SuperAdmin</span>
                </div>
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-section">
                    <span class="nav-section-title">Principal</span>
                    ${renderLinks(this.navigation.main)}
                </div>
                
                <div class="nav-section">
                    <span class="nav-section-title">Clientes</span>
                    ${renderLinks(this.navigation.clientes)}
                </div>
                
                <div class="nav-section">
                    <span class="nav-section-title">Finanzas</span>
                    ${renderLinks(this.navigation.finanzas)}
                </div>
                
                <div class="nav-section">
                    <span class="nav-section-title">Equipo</span>
                    ${renderLinks(this.navigation.equipo)}
                </div>
                
                <div class="nav-section">
                    <span class="nav-section-title">Soporte</span>
                    ${renderLinks(this.navigation.soporte)}
                </div>
                
                <div class="nav-section">
                    <span class="nav-section-title">Configuración</span>
                    ${renderLinks(this.navigation.configuracion)}
                </div>
            </nav>
            
            <div class="sidebar-footer">
                <div class="sidebar-user">
                    <div class="sidebar-user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="sidebar-user-info">
                        <span class="sidebar-user-name">Admin</span>
                        <span class="sidebar-user-role">Super Administrador</span>
                    </div>
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
