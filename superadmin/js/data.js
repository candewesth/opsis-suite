// ============================================================================
// SUPERADMIN DATA - Opsis Suite
// Data Abstraction Layer - Ready for Supabase Migration
// ============================================================================
// 
// MIGRATION NOTES:
// ----------------
// All methods are designed with async patterns in mind. Currently they use
// localStorage but can be switched to Supabase by:
// 1. Changing _storage methods to use supabase client
// 2. Making all public methods async
// 3. Replacing localStorage calls with supabase queries
//
// Example migration:
//   BEFORE: getCompany(id) { return this.companies.find(c => c.id === id); }
//   AFTER:  async getCompany(id) { 
//             const { data } = await supabase.from('companies').select().eq('id', id).single();
//             return data;
//           }
// ============================================================================

const SuperAdminData = {
    // ========================================================================
    // STORAGE LAYER (Replace with Supabase)
    // ========================================================================
    _storage: {
        // Storage keys
        KEYS: {
            COMPANIES: 'opsis_companies',
            TEAM: 'opsis_team',
            TICKETS: 'opsis_tickets',
            PRODUCTS: 'opsis_products',
            PLANS: 'opsis_plans',
            INDUSTRIES: 'opsis_industries',
            INVOICES: 'opsis_invoices'
        },
        
        // Get from storage
        get(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.warn('Storage get error:', e);
                return null;
            }
        },
        
        // Set to storage
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Storage set error:', e);
                return false;
            }
        },
        
        // Remove from storage
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        }
    },

    // ========================================================================
    // DEFAULT DATA (Seed data - will be replaced by DB)
    // ========================================================================
    _defaults: {
        companies: [
            { 
                id: 1, 
                name: "Constructora ABC S.A.", 
                industry: "construccion", 
                plan: "Professional", 
                products: ["MotorSync"], // Base siempre incluido
                premiumModules: ["TimeSync"], // Módulos premium adicionales
                status: "active", 
                users: 24, 
                mrr: 328, // $249 (Professional) + $79 (TimeSync)
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
                products: ["MotorSync"],
                premiumModules: ["TimeSync", "HumanSync"],
                status: "active", 
                users: 35, 
                mrr: 707, // $499 (Enterprise) + $79 (TimeSync) + $129 (HumanSync)
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
                products: ["MotorSync"],
                premiumModules: ["FleetSync"],
                status: "active", 
                users: 18, 
                mrr: 398, // $249 (Professional) + $149 (FleetSync)
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
                plan: "Trial", 
                products: ["MotorSync"],
                premiumModules: [],
                status: "trial", 
                users: 3, 
                mrr: 0, // Trial gratuito
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
                products: ["MotorSync"],
                premiumModules: ["TimeSync", "ToolSync"],
                status: "active", 
                users: 12, 
                mrr: 397, // $249 (Professional) + $79 (TimeSync) + $69 (ToolSync)
                domain: "jardines-verdes",
                email: "admin@jardinesverdes.com",
                phone: "+1 555-0105",
                createdAt: "2024-04-20",
                lastActive: "2024-12-11"
            }
        ],
        
        team: [
            { id: 1, name: 'Carlos Mendoza', email: 'carlos@opsis-suite.com', role: 'super_admin', status: 'active', avatar: 'C', lastLogin: '2024-12-11 09:15', permissions: ['all'] },
            { id: 2, name: 'María García', email: 'maria@opsis-suite.com', role: 'support_admin', status: 'active', avatar: 'M', lastLogin: '2024-12-11 08:30', permissions: ['support', 'companies.view'] },
            { id: 3, name: 'Juan Pérez', email: 'juan@opsis-suite.com', role: 'data_analyst', status: 'active', avatar: 'J', lastLogin: '2024-12-10 16:45', permissions: ['analytics', 'reports'] },
            { id: 4, name: 'Ana Rodríguez', email: 'ana@opsis-suite.com', role: 'billing_admin', status: 'active', avatar: 'A', lastLogin: '2024-12-11 10:20', permissions: ['billing', 'invoices', 'subscriptions'] }
        ],
        
        tickets: [
            { id: 1, companyId: 1, company: 'Constructora ABC', subject: 'Error al generar reporte', priority: 'high', status: 'open', created: '2024-12-10', assignee: 'María García' },
            { id: 2, companyId: 2, company: 'Clínica San José', subject: 'Solicitud de capacitación', priority: 'medium', status: 'in-progress', created: '2024-12-09', assignee: 'María García' },
            { id: 3, companyId: 5, company: 'Jardines Verdes', subject: 'Pregunta sobre facturación', priority: 'low', status: 'open', created: '2024-12-11', assignee: null }
        ],
        
        invoices: [
            { id: 1, companyId: 1, company: 'Constructora ABC', amount: 299, status: 'paid', date: '2024-12-01', dueDate: '2024-12-15', concept: 'Suscripción Professional - Diciembre 2024' },
            { id: 2, companyId: 2, company: 'Clínica San José', amount: 499, status: 'paid', date: '2024-12-01', dueDate: '2024-12-15', concept: 'Suscripción Enterprise - Diciembre 2024' },
            { id: 3, companyId: 3, company: 'Transportes del Norte', amount: 349, status: 'pending', date: '2024-12-01', dueDate: '2024-12-15', concept: 'Suscripción Professional - Diciembre 2024' },
            { id: 4, companyId: 5, company: 'Jardines Verdes', amount: 399, status: 'paid', date: '2024-12-01', dueDate: '2024-12-15', concept: 'Suscripción Professional - Diciembre 2024' }
        ]
    },

    // ========================================================================
    // IN-MEMORY DATA (Loaded from storage/defaults)
    // ========================================================================
    companies: [],
    team: [],
    tickets: [],
    invoices: [],
    
    // Static catalogs
    industries: {
        'construccion': { name: 'Construcción y Obras', icon: 'fas fa-hard-hat', color: '#f59e0b' },
        'medica': { name: 'Médica y Salud', icon: 'fas fa-hospital', color: '#ef4444' },
        'transporte': { name: 'Transporte y Logística', icon: 'fas fa-truck', color: '#3b82f6' },
        'retail': { name: 'Retail y Comercio', icon: 'fas fa-shopping-cart', color: '#8b5cf6' },
        'jardineria': { name: 'Jardinería y Paisajismo', icon: 'fas fa-leaf', color: '#22c55e' },
        'tecnologia': { name: 'Tecnología', icon: 'fas fa-laptop-code', color: '#06b6d4' },
        'educacion': { name: 'Educación', icon: 'fas fa-graduation-cap', color: '#ec4899' },
        'restaurante': { name: 'Restaurantes y Hoteles', icon: 'fas fa-utensils', color: '#f97316' },
        'inmobiliaria': { name: 'Bienes Raíces', icon: 'fas fa-home', color: '#14b8a6' },
        'automotriz': { name: 'Automotriz', icon: 'fas fa-car', color: '#6366f1' },
        'otros': { name: 'Otras Industrias', icon: 'fas fa-cog', color: '#64748b' }
    },
    
    // MÓDULOS DEL SISTEMA
    // MotorSync = INCLUIDO en todos los planes
    // Los demás son PREMIUM (cobro adicional)
    products: {
        'motorsync': { 
            name: 'MotorSync', 
            icon: 'fas fa-wrench', 
            description: 'Gestión de proyectos, clientes y operaciones', 
            price: 0,  // INCLUIDO en el plan
            type: 'base',
            status: 'active',
            features: ['Gestión de proyectos', 'CRM de clientes', 'Cotizaciones', 'Dashboard operacional']
        },
        'timesync': { 
            name: 'TimeSync', 
            icon: 'fas fa-clock', 
            description: 'Control de tiempo y planificación de personal', 
            price: 79,
            type: 'premium',
            status: 'active',
            features: ['Timesheet digital', 'Programación de turnos', 'Control de asistencia', 'Reportes de horas']
        },
        'toolsync': { 
            name: 'ToolSync', 
            icon: 'fas fa-hammer', 
            description: 'Inventario de herramientas y equipos', 
            price: 69,
            type: 'premium',
            status: 'active',
            features: ['Inventario de herramientas', 'Tracking de equipos', 'Mantenimiento preventivo', 'Asignación por proyecto']
        },
        'humansync': { 
            name: 'HumanSync', 
            icon: 'fas fa-users', 
            description: 'Recursos humanos y nómina', 
            price: 129,
            type: 'premium',
            status: 'coming-soon',
            features: ['Gestión de empleados', 'Nómina automatizada', 'Beneficios', 'Evaluaciones']
        },
        'fleetsync': { 
            name: 'FleetSync', 
            icon: 'fas fa-truck', 
            description: 'Gestión de flotas y vehículos', 
            price: 149,
            type: 'premium',
            status: 'coming-soon',
            features: ['Tracking GPS', 'Mantenimiento vehicular', 'Combustible', 'Rutas optimizadas']
        }
    },
    
    // PLANES - Incluyen MotorSync
    // Los módulos premium se suman al precio del plan
    plans: {
        'trial': { 
            name: 'Trial', 
            price: 0, 
            duration: '14 días', 
            color: '#64748b', 
            users: 3,
            storage: '5GB',
            maxPremiumModules: 1,
            features: ['MotorSync incluido', 'Hasta 3 usuarios', '5GB almacenamiento', '1 módulo premium de prueba'],
            description: 'Prueba gratuita de 14 días'
        },
        'starter': { 
            name: 'Starter', 
            price: 149, 
            duration: 'mensual', 
            color: '#22c55e',
            users: 5,
            storage: '10GB',
            maxPremiumModules: 1,
            features: ['MotorSync incluido', 'Hasta 5 usuarios', '10GB almacenamiento', '1 módulo premium'],
            description: 'Ideal para pequeños negocios'
        },
        'professional': { 
            name: 'Professional', 
            price: 249, 
            duration: 'mensual', 
            color: '#3b82f6',
            users: 25,
            storage: '50GB',
            maxPremiumModules: 3,
            features: ['MotorSync incluido', 'Hasta 25 usuarios', '50GB almacenamiento', 'Hasta 3 módulos premium'],
            description: 'Para empresas en crecimiento'
        },
        'enterprise': { 
            name: 'Enterprise', 
            price: 499, 
            duration: 'mensual', 
            color: '#8b5cf6',
            users: -1, // ilimitado
            storage: '500GB',
            maxPremiumModules: -1, // ilimitado
            features: ['MotorSync incluido', 'Usuarios ilimitados', '500GB almacenamiento', 'Todos los módulos premium', 'Soporte prioritario', 'API access'],
            description: 'Solución completa para grandes empresas'
        }
    },

    // ========================================================================
    // PRICING CALCULATOR
    // ========================================================================
    
    // Calculate MRR for a company based on plan + premium modules
    // MotorSync ya está incluido en el precio del plan
    calculateMRR(planKey, premiumModules = []) {
        const plan = this.plans[planKey.toLowerCase()];
        if (!plan) return 0;
        
        // Plan (incluye MotorSync) + Premium modules
        let total = plan.price;
        
        // Add premium modules
        premiumModules.forEach(moduleKey => {
            const product = this.products[moduleKey.toLowerCase()];
            if (product && product.type === 'premium') {
                total += product.price;
            }
        });
        
        return total;
    },
    
    // Get pricing breakdown for display
    getPricingBreakdown(planKey, premiumModules = []) {
        const plan = this.plans[planKey.toLowerCase()];
        if (!plan) return null;
        
        const breakdown = {
            plan: { name: plan.name, price: plan.price, users: plan.users },
            baseModule: { name: 'MotorSync', price: 0, included: true },
            premiumModules: [],
            total: plan.price
        };
        
        premiumModules.forEach(moduleKey => {
            const product = this.products[moduleKey.toLowerCase()];
            if (product && product.type === 'premium') {
                breakdown.premiumModules.push({
                    key: moduleKey,
                    name: product.name,
                    price: product.price
                });
                breakdown.total += product.price;
            }
        });
        
        return breakdown;
    },
    
    // Get available premium modules
    getPremiumModules() {
        return Object.entries(this.products)
            .filter(([key, product]) => product.type === 'premium')
            .map(([key, product]) => ({ key, ...product }));
    },
    
    // Get active premium modules
    getActivePremiumModules() {
        return this.getPremiumModules().filter(m => m.status === 'active');
    },

    // ========================================================================
    // COMPANIES CRUD
    // ========================================================================
    
    // Get all companies (with optional filters)
    getCompanies(filters = {}) {
        let result = [...this.companies];
        
        if (filters.status) {
            result = result.filter(c => c.status === filters.status);
        }
        if (filters.industry) {
            result = result.filter(c => c.industry === filters.industry);
        }
        if (filters.plan) {
            result = result.filter(c => c.plan.toLowerCase() === filters.plan.toLowerCase());
        }
        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(c => 
                c.name.toLowerCase().includes(term) ||
                c.email.toLowerCase().includes(term) ||
                c.domain.toLowerCase().includes(term)
            );
        }
        
        return result;
    },
    
    // Get single company by ID
    getCompany(id) {
        return this.companies.find(c => c.id == id) || null;
    },
    
    // Get company by domain
    getCompanyByDomain(domain) {
        return this.companies.find(c => c.domain === domain) || null;
    },
    
    // Get company by ID (alias)
    getCompanyById(id) {
        return this.getCompany(id);
    },
    
    // Create new company
    createCompany(data) {
        const newId = Math.max(0, ...this.companies.map(c => c.id)) + 1;
        const company = {
            id: newId,
            name: data.name,
            industry: data.industry || 'otros',
            plan: data.plan || 'Trial',
            products: data.products || ['MotorSync'],
            status: data.status || 'trial',
            users: data.users || 1,
            mrr: data.mrr || 0,
            domain: data.domain || this._generateDomain(data.name),
            email: data.email || '',
            phone: data.phone || '',
            createdAt: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0],
            ...data
        };
        
        this.companies.push(company);
        this.persistCompanies();
        return company;
    },
    
    // Update company
    updateCompany(id, updates) {
        const index = this.companies.findIndex(c => c.id == id);
        if (index === -1) return null;
        
        this.companies[index] = { ...this.companies[index], ...updates };
        this.persistCompanies();
        return this.companies[index];
    },
    
    // Delete company
    deleteCompany(id) {
        const index = this.companies.findIndex(c => c.id == id);
        if (index === -1) return false;
        
        this.companies.splice(index, 1);
        this.persistCompanies();
        return true;
    },
    
    // Get active companies
    getActiveCompanies() {
        return this.companies.filter(c => c.status === 'active' || c.status === 'trial');
    },

    // ========================================================================
    // TEAM CRUD
    // ========================================================================
    
    getTeamMembers(filters = {}) {
        let result = [...this.team];
        if (filters.role) {
            result = result.filter(t => t.role === filters.role);
        }
        if (filters.status) {
            result = result.filter(t => t.status === filters.status);
        }
        return result;
    },
    
    getTeamMember(id) {
        return this.team.find(t => t.id == id) || null;
    },
    
    createTeamMember(data) {
        const newId = Math.max(0, ...this.team.map(t => t.id)) + 1;
        const member = {
            id: newId,
            name: data.name,
            email: data.email,
            role: data.role || 'support_admin',
            status: 'active',
            avatar: data.name.charAt(0).toUpperCase(),
            lastLogin: null,
            permissions: data.permissions || [],
            createdAt: new Date().toISOString(),
            ...data
        };
        
        this.team.push(member);
        this.persistTeam();
        return member;
    },
    
    updateTeamMember(id, updates) {
        const index = this.team.findIndex(t => t.id == id);
        if (index === -1) return null;
        
        this.team[index] = { ...this.team[index], ...updates };
        this.persistTeam();
        return this.team[index];
    },
    
    deleteTeamMember(id) {
        const index = this.team.findIndex(t => t.id == id);
        if (index === -1) return false;
        
        this.team.splice(index, 1);
        this.persistTeam();
        return true;
    },

    // ========================================================================
    // TICKETS CRUD
    // ========================================================================
    
    getTickets(filters = {}) {
        let result = [...this.tickets];
        if (filters.status) {
            result = result.filter(t => t.status === filters.status);
        }
        if (filters.priority) {
            result = result.filter(t => t.priority === filters.priority);
        }
        if (filters.companyId) {
            result = result.filter(t => t.companyId == filters.companyId);
        }
        return result;
    },
    
    getTicket(id) {
        return this.tickets.find(t => t.id == id) || null;
    },
    
    createTicket(data) {
        const newId = Math.max(0, ...this.tickets.map(t => t.id)) + 1;
        const ticket = {
            id: newId,
            companyId: data.companyId,
            company: data.company || '',
            subject: data.subject,
            priority: data.priority || 'medium',
            status: 'open',
            created: new Date().toISOString().split('T')[0],
            assignee: data.assignee || null,
            ...data
        };
        
        this.tickets.push(ticket);
        this.persistTickets();
        return ticket;
    },
    
    updateTicket(id, updates) {
        const index = this.tickets.findIndex(t => t.id == id);
        if (index === -1) return null;
        
        this.tickets[index] = { ...this.tickets[index], ...updates };
        this.persistTickets();
        return this.tickets[index];
    },
    
    deleteTicket(id) {
        const index = this.tickets.findIndex(t => t.id == id);
        if (index === -1) return false;
        
        this.tickets.splice(index, 1);
        this.persistTickets();
        return true;
    },

    // ========================================================================
    // INVOICES CRUD
    // ========================================================================
    
    getInvoices(filters = {}) {
        let result = [...this.invoices];
        if (filters.status) {
            result = result.filter(i => i.status === filters.status);
        }
        if (filters.companyId) {
            result = result.filter(i => i.companyId == filters.companyId);
        }
        return result;
    },
    
    getInvoice(id) {
        return this.invoices.find(i => i.id == id) || null;
    },
    
    createInvoice(data) {
        const newId = Math.max(0, ...this.invoices.map(i => i.id)) + 1;
        const invoice = {
            id: newId,
            companyId: data.companyId,
            company: data.company || '',
            amount: data.amount || 0,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            dueDate: data.dueDate || new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
            concept: data.concept || '',
            ...data
        };
        
        this.invoices.push(invoice);
        this.persistInvoices();
        return invoice;
    },
    
    updateInvoice(id, updates) {
        const index = this.invoices.findIndex(i => i.id == id);
        if (index === -1) return null;
        
        this.invoices[index] = { ...this.invoices[index], ...updates };
        this.persistInvoices();
        return this.invoices[index];
    },

    // ========================================================================
    // AGGREGATIONS & ANALYTICS
    // ========================================================================
    
    getTotals() {
        return {
            companies: this.companies.length,
            activeCompanies: this.companies.filter(c => c.status === 'active').length,
            trialCompanies: this.companies.filter(c => c.status === 'trial').length,
            inactiveCompanies: this.companies.filter(c => c.status === 'inactive').length,
            totalUsers: this.companies.reduce((sum, c) => sum + (c.users || 0), 0),
            mrr: this.companies.reduce((sum, c) => sum + (c.mrr || 0), 0),
            arr: this.companies.reduce((sum, c) => sum + (c.mrr || 0), 0) * 12,
            openTickets: this.tickets.filter(t => t.status === 'open').length,
            pendingInvoices: this.invoices.filter(i => i.status === 'pending').length,
            teamMembers: this.team.length
        };
    },
    
    getRevenueByPlan() {
        const result = {};
        this.companies.forEach(company => {
            const plan = company.plan.toLowerCase();
            if (!result[plan]) {
                result[plan] = { count: 0, revenue: 0 };
            }
            result[plan].count++;
            result[plan].revenue += company.mrr || 0;
        });
        return result;
    },
    
    getRevenueByIndustry() {
        const result = {};
        this.companies.forEach(company => {
            if (!result[company.industry]) {
                result[company.industry] = { count: 0, revenue: 0 };
            }
            result[company.industry].count++;
            result[company.industry].revenue += company.mrr || 0;
        });
        return result;
    },
    
    getProductUsage() {
        const result = {};
        Object.keys(this.products).forEach(key => {
            result[key] = { name: this.products[key].name, count: 0 };
        });
        
        this.companies.forEach(company => {
            (company.products || []).forEach(product => {
                const key = product.toLowerCase().replace(/\s+/g, '');
                if (result[key]) {
                    result[key].count++;
                }
            });
        });
        return result;
    },

    // ========================================================================
    // CATALOG HELPERS
    // ========================================================================
    
    getIndustry(key) {
        return this.industries[key] || { name: key, icon: 'fas fa-building', color: '#64748b' };
    },
    
    getProduct(key) {
        return this.products[key.toLowerCase()] || null;
    },
    
    getPlan(key) {
        return this.plans[key.toLowerCase()] || null;
    },
    
    getRoleName(role) {
        const names = { 
            'super_admin': 'Super Admin', 
            'support_admin': 'Admin Soporte', 
            'data_analyst': 'Analista',
            'billing_admin': 'Admin Facturación'
        };
        return names[role] || role;
    },
    
    getRoleColor(role) {
        const colors = { 
            'super_admin': '#ef4444', 
            'support_admin': '#f59e0b', 
            'data_analyst': '#3b82f6',
            'billing_admin': '#8b5cf6'
        };
        return colors[role] || '#64748b';
    },
    
    getStatusName(status) {
        const names = { 
            'active': 'Activo', 
            'trial': 'Prueba', 
            'inactive': 'Inactivo',
            'suspended': 'Suspendido',
            'open': 'Abierto',
            'in-progress': 'En Progreso',
            'closed': 'Cerrado',
            'pending': 'Pendiente',
            'paid': 'Pagado',
            'overdue': 'Vencido'
        };
        return names[status] || status;
    },

    // ========================================================================
    // PERSISTENCE METHODS
    // ========================================================================
    
    persistCompanies() {
        this._storage.set(this._storage.KEYS.COMPANIES, this.companies);
    },
    
    persistTeam() {
        this._storage.set(this._storage.KEYS.TEAM, this.team);
    },
    
    persistTickets() {
        this._storage.set(this._storage.KEYS.TICKETS, this.tickets);
    },
    
    persistInvoices() {
        this._storage.set(this._storage.KEYS.INVOICES, this.invoices);
    },
    
    persistAll() {
        this.persistCompanies();
        this.persistTeam();
        this.persistTickets();
        this.persistInvoices();
    },

    // ========================================================================
    // UTILITIES
    // ========================================================================
    
    _generateDomain(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 30);
    },
    
    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    
    init() {
        // Load from storage or use defaults
        const storedCompanies = this._storage.get(this._storage.KEYS.COMPANIES);
        const storedTeam = this._storage.get(this._storage.KEYS.TEAM);
        const storedTickets = this._storage.get(this._storage.KEYS.TICKETS);
        const storedInvoices = this._storage.get(this._storage.KEYS.INVOICES);
        
        this.companies = storedCompanies || [...this._defaults.companies];
        this.team = storedTeam || [...this._defaults.team];
        this.tickets = storedTickets || [...this._defaults.tickets];
        this.invoices = storedInvoices || [...this._defaults.invoices];
        
        // Calculate product usage counts
        this._updateProductCounts();
        
        console.log('SuperAdminData initialized:', {
            companies: this.companies.length,
            team: this.team.length,
            tickets: this.tickets.length,
            invoices: this.invoices.length
        });
    },
    
    _updateProductCounts() {
        // Reset counts
        Object.keys(this.products).forEach(key => {
            this.products[key].companies = 0;
        });
        
        // Count usage
        this.companies.forEach(company => {
            (company.products || []).forEach(product => {
                const key = product.toLowerCase().replace(/\s+/g, '');
                if (this.products[key]) {
                    this.products[key].companies++;
                }
            });
        });
    },
    
    // Reset to defaults (useful for testing)
    reset() {
        Object.values(this._storage.KEYS).forEach(key => {
            this._storage.remove(key);
        });
        this.init();
    }
};

// Auto-initialize
SuperAdminData.init();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuperAdminData;
}
