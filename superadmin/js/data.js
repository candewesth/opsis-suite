// ============================================================================
// SUPERADMIN DATA - Opsis Suite
// Data management and mock data for SuperAdmin
// ============================================================================

const SuperAdminData = {
    // ========================================================================
    // COMPANIES DATA
    // ========================================================================
    companies: [
        { 
            id: 1, 
            name: "Constructora ABC S.A.", 
            industry: "construccion", 
            plan: "Professional", 
            products: ["MotorSync", "TimeSync"], 
            status: "active", 
            users: 24, 
            mrr: 299,
            domain: "abc-constructora",
            email: "admin@abc-constructora.com",
            phone: "+1 555-0101",
            createdAt: "2024-01-15",
            lastActive: "2024-12-10"
        },
        { 
            id: 2, 
            name: "Clínica San José", 
            industry: "medica", 
            plan: "Enterprise", 
            products: ["MotorSync", "HumanSync", "TimeSync"], 
            status: "active", 
            users: 35, 
            mrr: 499,
            domain: "clinica-sanjose",
            email: "it@clinicasanjose.com",
            phone: "+1 555-0102",
            createdAt: "2024-02-10",
            lastActive: "2024-12-11"
        },
        { 
            id: 3, 
            name: "Transportes del Norte", 
            industry: "transporte", 
            plan: "Professional", 
            products: ["MotorSync", "FleetSync"], 
            status: "active", 
            users: 18, 
            mrr: 349,
            domain: "transportes-norte",
            email: "sistemas@transnorte.com",
            phone: "+1 555-0103",
            createdAt: "2024-03-05",
            lastActive: "2024-12-09"
        },
        { 
            id: 4, 
            name: "Supermercados La Familia", 
            industry: "retail", 
            plan: "Starter", 
            products: ["MotorSync"], 
            status: "trial", 
            users: 8, 
            mrr: 0,
            domain: "super-familia",
            email: "gerencia@superfamilia.com",
            phone: "+1 555-0104",
            createdAt: "2024-11-28",
            lastActive: "2024-12-08"
        },
        { 
            id: 5, 
            name: "Jardines Verdes", 
            industry: "jardineria", 
            plan: "Professional", 
            products: ["MotorSync", "TimeSync", "ToolSync"], 
            status: "active", 
            users: 12, 
            mrr: 399,
            domain: "jardines-verdes",
            email: "admin@jardinesverdes.com",
            phone: "+1 555-0105",
            createdAt: "2024-04-20",
            lastActive: "2024-12-11"
        }
    ],

    // ========================================================================
    // TEAM DATA (Your Opsis Team)
    // ========================================================================
    team: [
        { 
            id: 1, 
            name: 'Carlos Mendoza', 
            email: 'carlos@opsis-suite.com', 
            role: 'super_admin', 
            status: 'active',
            avatar: 'C',
            lastLogin: '2024-12-11 09:15',
            permissions: ['all']
        },
        { 
            id: 2, 
            name: 'María García', 
            email: 'maria@opsis-suite.com', 
            role: 'support_admin', 
            status: 'active',
            avatar: 'M',
            lastLogin: '2024-12-11 08:30',
            permissions: ['support', 'companies.view']
        },
        { 
            id: 3, 
            name: 'Juan Pérez', 
            email: 'juan@opsis-suite.com', 
            role: 'data_analyst', 
            status: 'active',
            avatar: 'J',
            lastLogin: '2024-12-10 16:45',
            permissions: ['analytics', 'reports']
        },
        { 
            id: 4, 
            name: 'Ana Rodríguez', 
            email: 'ana@opsis-suite.com', 
            role: 'billing_admin', 
            status: 'active',
            avatar: 'A',
            lastLogin: '2024-12-11 10:20',
            permissions: ['billing', 'invoices', 'subscriptions']
        }
    ],

    // ========================================================================
    // INDUSTRIES CATALOG
    // ========================================================================
    industries: {
        'construccion': { name: 'Construcción y Obras', icon: '🏗️', companies: 2, color: '#f59e0b' },
        'medica': { name: 'Médica y Salud', icon: '🏥', companies: 1, color: '#ef4444' },
        'transporte': { name: 'Transporte y Logística', icon: '🚛', companies: 1, color: '#3b82f6' },
        'retail': { name: 'Retail y Comercio', icon: '🛒', companies: 1, color: '#8b5cf6' },
        'jardineria': { name: 'Jardinería y Paisajismo', icon: '🌱', companies: 1, color: '#22c55e' },
        'tecnologia': { name: 'Tecnología', icon: '💻', companies: 0, color: '#06b6d4' },
        'educacion': { name: 'Educación', icon: '🎓', companies: 0, color: '#ec4899' },
        'restaurante': { name: 'Restaurantes y Hoteles', icon: '🍽️', companies: 0, color: '#f97316' },
        'inmobiliaria': { name: 'Bienes Raíces', icon: '🏠', companies: 0, color: '#14b8a6' },
        'automotriz': { name: 'Automotriz', icon: '🚗', companies: 0, color: '#6366f1' },
        'otros': { name: 'Otras Industrias', icon: '⚙️', companies: 0, color: '#64748b' }
    },

    // ========================================================================
    // PRODUCTS CATALOG
    // ========================================================================
    products: {
        'motorsync': { 
            name: 'MotorSync', 
            icon: '🔧', 
            description: 'Gestión de proyectos, clientes y operaciones',
            basePrice: 99,
            status: 'active',
            companies: 5
        },
        'timesync': { 
            name: 'TimeSync', 
            icon: '⏱️', 
            description: 'Control de tiempo y planificación',
            basePrice: 79,
            status: 'coming-soon',
            companies: 3
        },
        'toolsync': { 
            name: 'ToolSync', 
            icon: '🔨', 
            description: 'Inventario de herramientas y equipos',
            basePrice: 69,
            status: 'coming-soon',
            companies: 1
        },
        'humansync': { 
            name: 'HumanSync', 
            icon: '👥', 
            description: 'Recursos humanos y nómina',
            basePrice: 129,
            status: 'coming-soon',
            companies: 1
        },
        'fleetsync': { 
            name: 'FleetSync', 
            icon: '🚛', 
            description: 'Gestión de flotas y vehículos',
            basePrice: 149,
            status: 'coming-soon',
            companies: 1
        }
    },

    // ========================================================================
    // PLANS
    // ========================================================================
    plans: {
        'trial': { name: 'Trial', price: 0, duration: '14 días', color: '#64748b' },
        'starter': { name: 'Starter', price: 49, features: ['1 producto', '5 usuarios', '10GB'], color: '#22c55e' },
        'professional': { name: 'Professional', price: 99, features: ['3 productos', '25 usuarios', '50GB'], color: '#3b82f6' },
        'enterprise': { name: 'Enterprise', price: 249, features: ['Ilimitado', 'Ilimitado', '500GB'], color: '#8b5cf6' }
    },

    // ========================================================================
    // SUPPORT TICKETS
    // ========================================================================
    tickets: [
        { id: 1, company: 'Constructora ABC', subject: 'Error al generar reporte', priority: 'high', status: 'open', created: '2024-12-10', assignee: 'María García' },
        { id: 2, company: 'Clínica San José', subject: 'Solicitud de capacitación', priority: 'medium', status: 'in-progress', created: '2024-12-09', assignee: 'María García' },
        { id: 3, company: 'Jardines Verdes', subject: 'Pregunta sobre facturación', priority: 'low', status: 'open', created: '2024-12-11', assignee: null }
    ],

    // ========================================================================
    // HELPER METHODS
    // ========================================================================
    
    // Get company by ID
    getCompany(id) {
        return this.companies.find(c => c.id === id);
    },

    // Get team member by ID
    getTeamMember(id) {
        return this.team.find(t => t.id === id);
    },

    // Get industry info
    getIndustry(key) {
        return this.industries[key] || { name: key, icon: '🏢' };
    },

    // Calculate totals
    getTotals() {
        return {
            companies: this.companies.length,
            activeCompanies: this.companies.filter(c => c.status === 'active').length,
            totalUsers: this.companies.reduce((sum, c) => sum + c.users, 0),
            mrr: this.companies.reduce((sum, c) => sum + c.mrr, 0),
            arr: this.companies.reduce((sum, c) => sum + c.mrr, 0) * 12,
            openTickets: this.tickets.filter(t => t.status === 'open').length
        };
    },

    // Get role display name
    getRoleName(role) {
        const names = { 
            'super_admin': 'Super Admin', 
            'support_admin': 'Admin Soporte', 
            'data_analyst': 'Analista',
            'billing_admin': 'Admin Facturación'
        };
        return names[role] || role;
    },

    // Get role color
    getRoleColor(role) {
        const colors = { 
            'super_admin': '#ef4444', 
            'support_admin': '#f59e0b', 
            'data_analyst': '#3b82f6',
            'billing_admin': '#8b5cf6'
        };
        return colors[role] || '#64748b';
    },

    // Get status display
    getStatusName(status) {
        const names = { 
            'active': 'Activo', 
            'trial': 'Prueba', 
            'inactive': 'Inactivo',
            'suspended': 'Suspendido'
        };
        return names[status] || status;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuperAdminData;
}
