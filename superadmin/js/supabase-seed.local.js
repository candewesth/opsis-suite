// Seed de datos en Supabase usando la config ya cargada por supabase-loader.
// No se versiona; usa tus claves locales (publishable) y tablas existentes.
(async () => {
    if (!window.OPSIS_SUPABASE_URL || !window.OPSIS_SUPABASE_KEY) {
        console.error('[SupabaseSeed] Falta OPSIS_SUPABASE_URL/KEY. Asegúrate de cargar supabase-env.local.js antes.');
        return;
    }
    const { createClient } = window.supabase || {};
    if (!createClient) {
        console.error('[SupabaseSeed] Supabase client no cargado. Revisa supabase-loader.');
        return;
    }
    const client = createClient(window.OPSIS_SUPABASE_URL, window.OPSIS_SUPABASE_KEY);

    const companies = [
        { id: 1, name: 'Constructora ABC S.A.', industry: 'construccion', plan: 'Professional', products: ['MotorSync'], premiumModules: ['TimeSync'], status: 'active', users: 24, mrr: 328, domain: 'abc-constructora', email: 'admin@abc-constructora.com', phone: '+1 555-0101', createdAt: '2024-01-15', lastActive: '2024-12-10' },
        { id: 2, name: 'Clínica San José', industry: 'medica', plan: 'Enterprise', products: ['MotorSync'], premiumModules: ['TimeSync', 'HumanSync'], status: 'active', users: 35, mrr: 707, domain: 'clinica-sanjose', email: 'it@clinicasanjose.com', phone: '+1 555-0102', createdAt: '2024-02-10', lastActive: '2024-12-11' },
        { id: 3, name: 'Transportes del Norte', industry: 'transporte', plan: 'Professional', products: ['MotorSync'], premiumModules: ['FleetSync'], status: 'active', users: 18, mrr: 398, domain: 'transportes-norte', email: 'sistemas@transnorte.com', phone: '+1 555-0103', createdAt: '2024-03-05', lastActive: '2024-12-09' },
        { id: 4, name: 'Supermercados La Familia', industry: 'retail', plan: 'Trial', products: ['MotorSync'], premiumModules: [], status: 'trial', users: 3, mrr: 0, domain: 'super-familia', email: 'gerencia@superfamilia.com', phone: '+1 555-0104', createdAt: '2024-11-28', lastActive: '2024-12-08' },
        { id: 5, name: 'Jardines Verdes', industry: 'jardineria', plan: 'Professional', products: ['MotorSync'], premiumModules: ['TimeSync', 'ToolSync'], status: 'active', users: 12, mrr: 397, domain: 'jardines-verdes', email: 'admin@jardinesverdes.com', phone: '+1 555-0105', createdAt: '2024-04-20', lastActive: '2024-12-11' }
    ];

    const team = [
        { id: 1, name: 'Carlos Mendoza', email: 'carlos@opsis-suite.com', role: 'super_admin', status: 'active', avatar: 'C', lastLogin: '2024-12-11 09:15', permissions: ['all'] },
        { id: 2, name: 'María García', email: 'maria@opsis-suite.com', role: 'support_admin', status: 'active', avatar: 'M', lastLogin: '2024-12-11 08:30', permissions: ['support', 'companies.view'] },
        { id: 3, name: 'Juan Pérez', email: 'juan@opsis-suite.com', role: 'data_analyst', status: 'active', avatar: 'J', lastLogin: '2024-12-10 16:45', permissions: ['analytics', 'reports'] },
        { id: 4, name: 'Ana Rodríguez', email: 'ana@opsis-suite.com', role: 'billing_admin', status: 'active', avatar: 'A', lastLogin: '2024-12-11 10:20', permissions: ['billing', 'invoices', 'subscriptions'] }
    ];

    const tickets = [
        { id: 1, companyId: 1, company: 'Constructora ABC', subject: 'Error al generar reporte', priority: 'high', status: 'open', created: '2024-12-10', assignee: 'María García' },
        { id: 2, companyId: 2, company: 'Clínica San José', subject: 'Solicitud de capacitación', priority: 'medium', status: 'in-progress', created: '2024-12-09', assignee: 'María García' },
        { id: 3, companyId: 5, company: 'Jardines Verdes', subject: 'Pregunta sobre facturación', priority: 'low', status: 'open', created: '2024-12-11', assignee: null }
    ];

    const invoices = [
        { id: 1, companyId: 1, company: 'Constructora ABC', amount: 299, status: 'paid', date: '2024-12-01', dueDate: '2024-12-15', concept: 'Suscripción Professional - Diciembre 2024' },
        { id: 2, companyId: 2, company: 'Clínica San José', amount: 499, status: 'paid', date: '2024-12-01', dueDate: '2024-12-15', concept: 'Suscripción Enterprise - Diciembre 2024' },
        { id: 3, companyId: 3, company: 'Transportes del Norte', amount: 349, status: 'pending', date: '2024-12-01', dueDate: '2024-12-15', concept: 'Suscripción Professional - Diciembre 2024' },
        { id: 4, companyId: 5, company: 'Jardines Verdes', amount: 399, status: 'paid', date: '2024-12-01', dueDate: '2024-12-15', concept: 'Suscripción Professional - Diciembre 2024' }
    ];

    async function upsert(table, rows) {
        const { error } = await client.from(table).upsert(rows);
        if (error) throw error;
        console.log(`[SupabaseSeed] Upsert ${rows.length} rows -> ${table}`);
    }

    try {
        await upsert('companies', companies);
        await upsert('team_members', team);
        await upsert('tickets', tickets);
        await upsert('invoices', invoices);
        console.log('[SupabaseSeed] ✅ Seed completado');
    } catch (e) {
        console.error('[SupabaseSeed] Error', e);
    }
})();
