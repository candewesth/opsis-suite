# Guía de Migración a Supabase

## Resumen

Este documento describe cómo migrar Opsis Suite de localStorage a Supabase. La arquitectura actual ya está preparada con una capa de abstracción que facilita esta transición.

---

## Arquitectura Actual

### Capas de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    Páginas/Componentes                       │
│   (list.html, onboarding.html, dashboard.html, etc.)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Capa de Abstracción                       │
│   SuperAdminData, MotorSyncData, ProjectSyncData            │
│   - CRUD Methods (get, create, update, delete)              │
│   - Aggregations (getTotals, getRevenue, etc.)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Capa de Storage                           │
│   _storage.get(), _storage.set(), _storage.remove()         │
│   Actualmente: localStorage                                  │
│   Futuro: Supabase Client                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Claves de localStorage Actuales

### SuperAdmin (`/superadmin/js/data.js`)
| Clave | Tipo | Descripción |
|-------|------|-------------|
| `opsis_companies` | Array | Lista de empresas clientes |
| `opsis_team` | Array | Equipo interno de Opsis |
| `opsis_tickets` | Array | Tickets de soporte |
| `opsis_invoices` | Array | Facturas emitidas |

### MotorSync (`/motorsync/js/data-*.js`)
| Clave | Tipo | Descripción |
|-------|------|-------------|
| `motorsync_projects_{companyId}` | Array | Proyectos por empresa |
| `motorsync_clients_{companyId}` | Array | Clientes por empresa |
| `motorsync_threads_{companyId}` | Array | Comunicaciones |

### Configuración Global
| Clave | Tipo | Descripción |
|-------|------|-------------|
| `opsis_settings` | Object | Configuración activa (empresa, tema, etc.) |
| `opsis_auth` | Object | Sesión de autenticación |

---

## Pasos de Migración

### Paso 1: Configurar Supabase

```javascript
// supabase/config.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Paso 2: Crear Tablas en Supabase

```sql
-- Companies (opsis_companies)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    industry TEXT,
    plan TEXT DEFAULT 'starter',
    status TEXT DEFAULT 'active',
    mrr NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    products JSONB DEFAULT '[]',
    users JSONB DEFAULT '{}'
);

-- Team (opsis_team)  
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    status TEXT DEFAULT 'active',
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets (opsis_tickets)
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    assigned_to UUID REFERENCES team_members(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices (opsis_invoices)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    due_date DATE,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- Projects (motorsync_projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    name TEXT NOT NULL,
    client TEXT,
    status TEXT DEFAULT 'active',
    budget NUMERIC,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

### Paso 3: Modificar Capa de Storage

El cambio principal es en `_storage` dentro de cada archivo `data.js`:

**ANTES (localStorage):**
```javascript
const _storage = {
    KEYS: {
        COMPANIES: 'opsis_companies',
        TEAM: 'opsis_team',
        TICKETS: 'opsis_tickets',
        INVOICES: 'opsis_invoices'
    },
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};
```

**DESPUÉS (Supabase):**
```javascript
import { supabase } from '../supabase/config.js';

const _storage = {
    TABLES: {
        COMPANIES: 'companies',
        TEAM: 'team_members',
        TICKETS: 'tickets',
        INVOICES: 'invoices'
    },
    
    async get(table, filters = {}) {
        let query = supabase.from(table).select('*');
        
        Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
        
        const { data, error } = await query;
        if (error) throw error;
        return data;
    },
    
    async insert(table, record) {
        const { data, error } = await supabase
            .from(table)
            .insert(record)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    
    async update(table, id, updates) {
        const { data, error } = await supabase
            .from(table)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    
    async remove(table, id) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};
```

### Paso 4: Actualizar Métodos CRUD

Los métodos públicos se vuelven async:

**ANTES:**
```javascript
getCompanies(filters = {}) {
    let companies = _cache.companies || [];
    // filtrar...
    return companies;
}

createCompany(data) {
    const company = { id: generateId(), ...data };
    _cache.companies.push(company);
    this.persistCompanies();
    return company;
}
```

**DESPUÉS:**
```javascript
async getCompanies(filters = {}) {
    const companies = await _storage.get('companies', filters);
    return companies;
}

async createCompany(data) {
    const company = await _storage.insert('companies', data);
    return company;
}
```

### Paso 5: Actualizar Páginas que Consumen

Cambiar llamadas síncronas a async/await:

**ANTES:**
```javascript
function loadCompanies() {
    const companies = SuperAdminData.getCompanies();
    renderTable(companies);
}
```

**DESPUÉS:**
```javascript
async function loadCompanies() {
    const companies = await SuperAdminData.getCompanies();
    renderTable(companies);
}
```

---

## Checklist de Migración

### SuperAdmin
- [ ] `/superadmin/js/data.js` - Cambiar _storage a Supabase
- [ ] `/superadmin/companies/list.html` - Async/await
- [ ] `/superadmin/companies/onboarding.html` - Async/await
- [ ] `/superadmin/companies/detail.html` - Async/await
- [ ] `/superadmin/team/list.html` - Async/await
- [ ] `/superadmin/tickets/list.html` - Async/await
- [ ] `/superadmin/billing/overview.html` - Async/await
- [ ] `/superadmin/dashboard.html` - Async/await

### MotorSync
- [ ] `/motorsync/js/data-projects.js` - Cambiar a Supabase
- [ ] `/motorsync/js/data-clients.js` - Cambiar a Supabase
- [ ] `/motorsync/js/data-threads.js` - Cambiar a Supabase
- [ ] Actualizar todas las páginas con async/await

### Autenticación
- [ ] Implementar Supabase Auth
- [ ] Reemplazar `opsis_auth` localStorage con sesión Supabase
- [ ] Agregar RLS policies basadas en user_id

---

## Row Level Security (RLS)

Ejemplo de políticas para multi-tenant:

```sql
-- Las empresas solo ven sus propios datos
CREATE POLICY "Companies see own data" ON projects
    FOR ALL
    USING (company_id = auth.jwt() ->> 'company_id');

-- SuperAdmins ven todo
CREATE POLICY "SuperAdmins see all" ON companies
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'superadmin');
```

---

## Migración de Datos Existentes

Script para migrar datos de localStorage a Supabase:

```javascript
async function migrateToSupabase() {
    // 1. Leer datos actuales
    const companies = JSON.parse(localStorage.getItem('opsis_companies') || '[]');
    const team = JSON.parse(localStorage.getItem('opsis_team') || '[]');
    const tickets = JSON.parse(localStorage.getItem('opsis_tickets') || '[]');
    const invoices = JSON.parse(localStorage.getItem('opsis_invoices') || '[]');
    
    // 2. Insertar en Supabase
    console.log('Migrando companies...');
    for (const company of companies) {
        await supabase.from('companies').upsert(company);
    }
    
    console.log('Migrando team...');
    for (const member of team) {
        await supabase.from('team_members').upsert(member);
    }
    
    console.log('Migrando tickets...');
    for (const ticket of tickets) {
        await supabase.from('tickets').upsert(ticket);
    }
    
    console.log('Migrando invoices...');
    for (const invoice of invoices) {
        await supabase.from('invoices').upsert(invoice);
    }
    
    console.log('✅ Migración completada');
}
```

---

## Beneficios Post-Migración

1. **Persistencia real** - Los datos no se pierden al limpiar el navegador
2. **Multi-dispositivo** - Usuarios pueden acceder desde cualquier lugar
3. **Tiempo real** - Supabase Realtime para actualizaciones instantáneas
4. **Seguridad** - RLS a nivel de base de datos
5. **Escalabilidad** - PostgreSQL manejando millones de registros
6. **Backups** - Automáticos en Supabase

---

## Estimación de Tiempo

| Fase | Tiempo Estimado |
|------|-----------------|
| Setup Supabase + Tablas | 2-3 horas |
| Migrar SuperAdmin data.js | 3-4 horas |
| Actualizar páginas SuperAdmin | 4-5 horas |
| Migrar MotorSync data layers | 4-5 horas |
| Actualizar páginas MotorSync | 4-5 horas |
| Implementar Auth | 3-4 horas |
| Testing + QA | 4-6 horas |
| **Total** | **24-32 horas** |

---

## Contacto

Para preguntas sobre la migración, contactar al equipo de desarrollo.

---

*Documento generado automáticamente como parte de la preparación de migración.*
*Última actualización: 2024*
