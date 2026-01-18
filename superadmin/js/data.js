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
//   AFTER:  getCompany(id) { 
//             const { data } = await supabase.from('companies').select().eq('id', id).single();
//             return data;
//           }
// ============================================================================

// ---------------------------------------------------------------------------
// Storage configuration (toggle between local and Supabase later)
// Change SUPERADMIN_STORAGE_MODE to 'supabase' once credentials are ready
// and the Supabase client is available globally (window.supabase or supabase).
// ---------------------------------------------------------------------------
const SUPERADMIN_STORAGE_MODE = (typeof window !== 'undefined' && window.OPSIS_SUPERADMIN_STORAGE_MODE) || 'local';
const SUPERADMIN_SUPABASE_CONFIG = (typeof window !== 'undefined' && window.OPSIS_SUPABASE_CONFIG) || {
    url: '',
    key: ''
};

// Local storage driver (async interface for compatibility with Supabase)
const LocalStorageDriver = {
    type: 'local',
    keyMap: {
        companies: 'opsis_companies',
        team: 'opsis_team',
        tickets: 'opsis_tickets',
        products: 'opsis_products',
        plans: 'opsis_plans',
        industries: 'opsis_industries',
        invoices: 'opsis_invoices'
    },
    get(collection) {
        const key = this.keyMap[collection] || collection;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('[LocalStorageDriver] get error:', e);
            return [];
        }
    },
    set(collection, value) {
        const key = this.keyMap[collection] || collection;
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('[LocalStorageDriver] set error:', e);
            return false;
        }
    },
    insert(collection, record) {
        const data = this.get(collection);
        data.push(record);
        this.set(collection, data);
        return record;
    },
    update(collection, id, updates) {
        const data = this.get(collection);
        const index = data.findIndex(item => item.id == id);
        if (index === -1) return null;
        data[index] = { ...data[index], ...updates };
        this.set(collection, data);
        return data[index];
    },
    remove(collection, id) {
        const data = this.get(collection);
        const index = data.findIndex(item => item.id == id);
        if (index === -1) return false;
        data.splice(index, 1);
        this.set(collection, data);
        return true;
    }
};

// Supabase demo driver (behaves async but stores locally)
const SupabaseDemoDriver = {
    type: 'supabase',
    enabled: true,
    async get(collection, filters = {}) {
        const data = LocalStorageDriver.get(collection) || [];
        if (!filters || Object.keys(filters).length === 0) return data;
        return data.filter(item => Object.entries(filters).every(([k, v]) => item[k] == v));
    },
    async insert(collection, record) {
        const inserted = LocalStorageDriver.insert(collection, record);
        return Promise.resolve(inserted);
    },
    async update(collection, id, updates) {
        const updated = LocalStorageDriver.update(collection, id, updates);
        return Promise.resolve(updated);
    },
    async remove(collection, id) {
        const removed = LocalStorageDriver.remove(collection, id);
        return Promise.resolve(removed);
    },
    async set(collection, records) {
        const ok = LocalStorageDriver.set(collection, records);
        return Promise.resolve(ok);
    }
};

// Supabase driver placeholder (disabled until config + client are present)
const SupabaseDriver = {
    type: 'supabase',
    enabled: false,
    client: null,
    tableMap: {
        companies: 'companies',
        team: 'team_members',
        tickets: 'tickets',
        products: 'products',
        plans: 'plans',
        industries: 'industries',
        invoices: 'invoices'
    },
    init(config) {
        if (!config || !config.url || !config.key) return false;
        const supabaseGlobal = (typeof supabase !== 'undefined' && supabase.createClient)
            ? supabase
            : (typeof window !== 'undefined' && window.supabase && window.supabase.createClient ? window.supabase : null);
        if (!supabaseGlobal || typeof supabaseGlobal.createClient !== 'function') {
            console.warn('[SupabaseDriver] Supabase client not loaded. Include @supabase/supabase-js before enabling this mode.');
            return false;
        }
        this.client = supabaseGlobal.createClient(config.url, config.key);
        this.enabled = true;
        return true;
    },
    resolveTable(collection) {
        return this.tableMap[collection] || collection;
    },
    async get(collection, filters = {}) {
        if (!this.enabled || !this.client) throw new Error('Supabase driver not initialized');
        const table = this.resolveTable(collection);
        let query = this.client.from(table).select('*');
        Object.entries(filters || {}).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },
    async insert(collection, record) {
        if (!this.enabled || !this.client) throw new Error('Supabase driver not initialized');
        const table = this.resolveTable(collection);
        const { data, error } = await this.client.from(table).insert(record).select().single();
        if (error) throw error;
        return data;
    },
    async update(collection, id, updates) {
        if (!this.enabled || !this.client) throw new Error('Supabase driver not initialized');
        const table = this.resolveTable(collection);
        const { data, error } = await this.client.from(table).update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    async remove(collection, id) {
        if (!this.enabled || !this.client) throw new Error('Supabase driver not initialized');
        const table = this.resolveTable(collection);
        const { error } = await this.client.from(table).delete().eq('id', id);
        if (error) throw error;
        return true;
    },
    async set(collection, records) {
        if (!this.enabled || !this.client) throw new Error('Supabase driver not initialized');
        const table = this.resolveTable(collection);
        const { error } = await this.client.from(table).upsert(records);
        if (error) throw error;
        return true;
    }
};

const SuperAdminData = {
    // ========================================================================
    // STORAGE LAYER (Replace with Supabase)
    // ========================================================================
    _storage: {
        MODE: SUPERADMIN_STORAGE_MODE,
        supabaseConfig: SUPERADMIN_SUPABASE_CONFIG,
        driver: LocalStorageDriver,
        initDriver() {
            if (this.MODE === 'supabase-demo') {
                this.driver = SupabaseDemoDriver;
            } else if (this.MODE === 'supabase' && SupabaseDriver.init(this.supabaseConfig)) {
                this.driver = SupabaseDriver;
            } else {
                this.driver = LocalStorageDriver;
            }
            return this.driver;
        },
        get(collection, filters = {}) {
            return this.driver.get(collection, filters);
        },
        set(collection, value) {
            if (typeof this.driver.set === 'function') {
                return this.driver.set(collection, value);
            }
            return LocalStorageDriver.set(collection, value);
        },
        insert(collection, record) {
            if (typeof this.driver.insert === 'function') {
                return this.driver.insert(collection, record);
            }
            const existing = this.get(collection);
            existing.push(record);
            this.set(collection, existing);
            return record;
        },
        update(collection, id, updates) {
            if (typeof this.driver.update === 'function') {
                return this.driver.update(collection, id, updates);
            }
            const existing = this.get(collection);
            const index = existing.findIndex(item => item.id == id);
            if (index === -1) return null;
            existing[index] = { ...existing[index], ...updates };
            this.set(collection, existing);
            return existing[index];
        },
        remove(collection, id) {
            if (typeof this.driver.remove === 'function') {
                return this.driver.remove(collection, id);
            }
            const existing = this.get(collection);
            const index = existing.findIndex(item => item.id == id);
            if (index === -1) return false;
            existing.splice(index, 1);
            this.set(collection, existing);
            return true;
        },
        isSupabase() {
            return this.driver && this.driver.type === 'supabase' && this.driver.enabled;
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
        'construccion': { name: 'Construcción y Obras', icon: 'fas fa-hard-hat', color: '#022326' },
        'medica': { name: 'Médica y Salud', icon: 'fas fa-hospital', color: '#034040' },
        'transporte': { name: 'Transporte y Logística', icon: 'fas fa-truck', color: '#035951' },
        'retail': { name: 'Retail y Comercio', icon: 'fas fa-shopping-cart', color: '#02735E' },
        'jardineria': { name: 'Jardinería y Paisajismo', icon: 'fas fa-leaf', color: '#10b981' },
        'tecnologia': { name: 'Tecnología', icon: 'fas fa-laptop-code', color: '#022326' },
        'educacion': { name: 'Educación', icon: 'fas fa-graduation-cap', color: '#034040' },
        'restaurante': { name: 'Restaurantes y Hoteles', icon: 'fas fa-utensils', color: '#035951' },
        'inmobiliaria': { name: 'Bienes Raíces', icon: 'fas fa-home', color: '#02735E' },
        'automotriz': { name: 'Automotriz', icon: 'fas fa-car', color: '#10b981' },
        'otros': { name: 'Otras Industrias', icon: 'fas fa-cog', color: '#034040' }
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
        if (this._storage.isSupabase()) {
            return this._storage.get('companies', filters);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.get('companies', { id }).then(rows => (rows || []).find(c => c.id == id) || null);
        }
        return this.companies.find(c => c.id == id) || null;
    },
    
    // Get company by domain
    getCompanyByDomain(domain) {
        if (this._storage.isSupabase()) {
            return this._storage.get('companies', { domain }).then(rows => (rows || []).find(c => c.domain === domain) || null);
        }
        return this.companies.find(c => c.domain === domain) || null;
    },
    
    // Get company by ID (alias)
    getCompanyById(id) {
        return this.getCompany(id);
    },
    
    // Create new company
    createCompany(data) {
        if (this._storage.isSupabase()) {
            return this._storage.insert('companies', data);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.update('companies', id, updates);
        }
        const index = this.companies.findIndex(c => c.id == id);
        if (index === -1) return null;
        
        this.companies[index] = { ...this.companies[index], ...updates };
        this.persistCompanies();
        return this.companies[index];
    },
    
    // Delete company
    deleteCompany(id) {
        if (this._storage.isSupabase()) {
            return this._storage.remove('companies', id);
        }
        const index = this.companies.findIndex(c => c.id == id);
        if (index === -1) return false;
        
        this.companies.splice(index, 1);
        this.persistCompanies();
        return true;
    },
    
    // Get active companies
    getActiveCompanies() {
        if (this._storage.isSupabase()) {
            return this._storage.get('companies', { status: 'active' });
        }
        return this.companies.filter(c => c.status === 'active' || c.status === 'trial');
    },

    // ========================================================================
    // TEAM CRUD
    // ========================================================================
    
    getTeamMembers(filters = {}) {
        if (this._storage.isSupabase()) {
            return this._storage.get('team', filters);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.get('team', { id }).then(rows => (rows || []).find(t => t.id == id) || null);
        }
        return this.team.find(t => t.id == id) || null;
    },
    
    createTeamMember(data) {
        if (this._storage.isSupabase()) {
            return this._storage.insert('team', data);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.update('team', id, updates);
        }
        const index = this.team.findIndex(t => t.id == id);
        if (index === -1) return null;
        
        this.team[index] = { ...this.team[index], ...updates };
        this.persistTeam();
        return this.team[index];
    },
    
    deleteTeamMember(id) {
        if (this._storage.isSupabase()) {
            return this._storage.remove('team', id);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.get('tickets', filters);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.get('tickets', { id }).then(rows => (rows || []).find(t => t.id == id) || null);
        }
        return this.tickets.find(t => t.id == id) || null;
    },
    
    createTicket(data) {
        if (this._storage.isSupabase()) {
            return this._storage.insert('tickets', data);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.update('tickets', id, updates);
        }
        const index = this.tickets.findIndex(t => t.id == id);
        if (index === -1) return null;
        
        this.tickets[index] = { ...this.tickets[index], ...updates };
        this.persistTickets();
        return this.tickets[index];
    },
    
    deleteTicket(id) {
        if (this._storage.isSupabase()) {
            return this._storage.remove('tickets', id);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.get('invoices', filters);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.get('invoices', { id }).then(rows => (rows || []).find(i => i.id == id) || null);
        }
        return this.invoices.find(i => i.id == id) || null;
    },
    
    createInvoice(data) {
        if (this._storage.isSupabase()) {
            return this._storage.insert('invoices', data);
        }
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
        if (this._storage.isSupabase()) {
            return this._storage.update('invoices', id, updates);
        }
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
        this._storage.set('companies', this.companies);
    },
    
    persistTeam() {
        this._storage.set('team', this.team);
    },
    
    persistTickets() {
        this._storage.set('tickets', this.tickets);
    },
    
    persistInvoices() {
        this._storage.set('invoices', this.invoices);
    },
    
    persistAll() {
        this.persistCompanies();
        this.persistTeam();
        this.persistTickets();
        this.persistInvoices();
        return true;
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
        this._storage.initDriver();

        if (this._storage.isSupabase()) {
            this.ready = this._loadFromSupabase();
            return this.ready;
        }

        const storedCompanies = this._storage.get('companies');
        const storedTeam = this._storage.get('team');
        const storedTickets = this._storage.get('tickets');
        const storedInvoices = this._storage.get('invoices');
        
        this.companies = storedCompanies && storedCompanies.length ? storedCompanies : [...this._defaults.companies];
        this.team = storedTeam && storedTeam.length ? storedTeam : [...this._defaults.team];
        this.tickets = storedTickets && storedTickets.length ? storedTickets : [...this._defaults.tickets];
        this.invoices = storedInvoices && storedInvoices.length ? storedInvoices : [...this._defaults.invoices];
        
        // Calculate product usage counts
        this._updateProductCounts();
        
        console.log('SuperAdminData initialized:', {
            storage: this._storage.isSupabase() ? 'supabase' : 'local',
            companies: this.companies.length,
            team: this.team.length,
            tickets: this.tickets.length,
            invoices: this.invoices.length
        });
        this.ready = Promise.resolve(true);
        return this.ready;
    },

    async _loadFromSupabase() {
        const [storedCompanies, storedTeam, storedTickets, storedInvoices] = await Promise.all([
            this._storage.get('companies'),
            this._storage.get('team'),
            this._storage.get('tickets'),
            this._storage.get('invoices')
        ]);

        this.companies = storedCompanies && storedCompanies.length ? storedCompanies : [...this._defaults.companies];
        this.team = storedTeam && storedTeam.length ? storedTeam : [...this._defaults.team];
        this.tickets = storedTickets && storedTickets.length ? storedTickets : [...this._defaults.tickets];
        this.invoices = storedInvoices && storedInvoices.length ? storedInvoices : [...this._defaults.invoices];

        this._updateProductCounts();
        console.log('SuperAdminData initialized (supabase):', {
            companies: this.companies.length,
            team: this.team.length,
            tickets: this.tickets.length,
            invoices: this.invoices.length
        });
        return true;
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
    async reset() {
        await Promise.all([
            this._storage.remove('companies'),
            this._storage.remove('team'),
            this._storage.remove('tickets'),
            this._storage.remove('invoices')
        ]);
        this.ready = this.init();
        return this.ready;
    }
};

// Auto-initialize
SuperAdminData.ready = SuperAdminData.init();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuperAdminData;
}
