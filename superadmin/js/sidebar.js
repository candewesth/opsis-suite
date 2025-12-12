// ============================================================================
// SUPERADMIN SIDEBAR - Opsis Suite
// Navigation and sidebar management
// ============================================================================

const SuperAdminSidebar = {
    // Navigation structure
    navigation: {
        main: [
            { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/superadmin/index.html' }
        ],
        management: [
            { id: 'companies', label: 'Compañías', icon: '🏢', href: '/superadmin/companies/list.html', badge: null },
            { id: 'billing', label: 'Facturación', icon: '💰', href: '/superadmin/billing/overview.html' },
            { id: 'team', label: 'Mi Equipo', icon: '👥', href: '/superadmin/team/list.html' }
        ],
        support: [
            { id: 'tickets', label: 'Tickets', icon: '🎫', href: '/superadmin/support/tickets.html', badge: '3' },
            { id: 'analytics', label: 'Analytics', icon: '📈', href: '/superadmin/analytics/usage.html' }
        ],
        system: [
            { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/superadmin/settings/general.html' },
            { id: 'industries', label: 'Industrias', icon: '🏭', href: '/superadmin/settings/industries.html' },
            { id: 'products', label: 'Productos', icon: '📦', href: '/superadmin/settings/products.html' }
        ]
    },

    // Get current page ID from URL
    getCurrentPageId() {
        const path = window.location.pathname;
        
        if (path.includes('/companies/')) return 'companies';
        if (path.includes('/billing/')) return 'billing';
        if (path.includes('/team/')) return 'team';
        if (path.includes('/support/')) return 'tickets';
        if (path.includes('/analytics/')) return 'analytics';
        if (path.includes('/settings/industries')) return 'industries';
        if (path.includes('/settings/products')) return 'products';
        if (path.includes('/settings/')) return 'settings';
        if (path.includes('/index.html') || path.endsWith('/superadmin/')) return 'dashboard';
        
        return 'dashboard';
    },

    // Render sidebar HTML
    render() {
        const currentPage = this.getCurrentPageId();
        
        const renderLinks = (links) => {
            return links.map(link => `
                <a href="${link.href}" class="nav-link ${link.id === currentPage ? 'active' : ''}" data-page="${link.id}">
                    <span class="icon">${link.icon}</span>
                    <span>${link.label}</span>
                    ${link.badge ? `<span class="badge">${link.badge}</span>` : ''}
                </a>
            `).join('');
        };

        return `
            <div class="sidebar-logo">
                <div class="logo-icon">⚡</div>
                <div class="logo-text">
                    Opsis Suite
                    <span>SuperAdmin</span>
                </div>
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-section">
                    ${renderLinks(this.navigation.main)}
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Gestión</div>
                    ${renderLinks(this.navigation.management)}
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Soporte</div>
                    ${renderLinks(this.navigation.support)}
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Sistema</div>
                    ${renderLinks(this.navigation.system)}
                </div>
            </nav>
            
            <div class="sidebar-footer" style="position: absolute; bottom: 1rem; left: 1rem; right: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--hover-bg); border-radius: var(--border-radius);">
                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, var(--primary-green), #4ecdc4); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">A</div>
                    <div>
                        <div style="font-weight: 500; font-size: 0.875rem;">Admin</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">Super Admin</div>
                    </div>
                    <button onclick="SuperAdminSidebar.toggleTheme()" style="margin-left: auto; background: none; border: none; cursor: pointer; font-size: 1.25rem;" id="themeToggle">🌙</button>
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
            if (toggle) toggle.textContent = '☀️';
        }
    },

    // Toggle dark/light theme
    toggleTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const toggle = document.getElementById('themeToggle');
        
        if (isDark) {
            document.body.removeAttribute('data-theme');
            if (toggle) toggle.textContent = '🌙';
            localStorage.setItem('opsis-theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            if (toggle) toggle.textContent = '☀️';
            localStorage.setItem('opsis-theme', 'dark');
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SuperAdminSidebar.init();
});
