# 🔐 Arquitectura de Seguridad Multi-Tenant

## Opsis Suite - Plan de Implementación con Supabase

Este documento define la arquitectura de seguridad para el sistema multi-tenant de Opsis Suite. Es **CRÍTICO** que se sigan estas prácticas al migrar a producción.

---

## 📋 Índice

1. [Principios de Seguridad](#principios-de-seguridad)
2. [Estructura de Base de Datos](#estructura-de-base-de-datos)
3. [Autenticación](#autenticación)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Gestión de Sesiones](#gestión-de-sesiones)
6. [Onboarding de Compañías](#onboarding-de-compañías)
7. [Roles y Permisos](#roles-y-permisos)
8. [Audit Logs](#audit-logs)
9. [Checklist de Seguridad](#checklist-de-seguridad)

---

## 🎯 Principios de Seguridad

### Nunca hacer:
- ❌ Generar contraseñas y mostrarlas en pantalla
- ❌ Almacenar contraseñas en localStorage
- ❌ Enviar contraseñas por email
- ❌ Tokens JWT sin expiración
- ❌ Datos sin aislamiento por tenant
- ❌ SQL queries sin RLS

### Siempre hacer:
- ✅ Magic links o invitaciones por email
- ✅ Tokens con expiración corta (1h access, 7d refresh)
- ✅ RLS en TODAS las tablas
- ✅ company_id en cada registro
- ✅ Audit logs de acciones críticas
- ✅ Validación server-side

---

## 🗄️ Estructura de Base de Datos

### Tablas Core

```sql
-- Organizaciones (Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,  -- e.g., "abc-constructora"
    plan TEXT DEFAULT 'starter',  -- starter, professional, enterprise
    status TEXT DEFAULT 'pending', -- pending, active, suspended
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Miembros de Organización
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- owner, admin, manager, member
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending', -- pending, active, suspended
    UNIQUE(organization_id, user_id)
);

-- Productos contratados por organización
CREATE TABLE organization_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    product_key TEXT NOT NULL, -- motorsync, timesync, toolsync, etc.
    status TEXT DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}'
);

-- Invitaciones pendientes
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    token TEXT UNIQUE NOT NULL,
    invited_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
    used_at TIMESTAMPTZ
);
```

### Ejemplo: Tabla de Vehículos (MotorSync)

```sql
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    -- ↑ CRÍTICO: Siempre incluir organization_id
    name TEXT NOT NULL,
    plate TEXT,
    type TEXT,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Índice para performance
CREATE INDEX idx_vehicles_org ON vehicles(organization_id);
```

---

## 🔑 Autenticación

### Flujo de Onboarding (Crear Compañía)

```
SuperAdmin crea compañía
        ↓
Se crea registro en 'organizations'
        ↓
Se genera invitación con token único
        ↓
Se envía email con magic link
        ↓
Usuario hace clic (dentro de 24h)
        ↓
Se crea cuenta en auth.users
        ↓
Se vincula a organization_members
        ↓
Usuario establece su contraseña
        ↓
Cuenta activa ✓
```

### Código de Invitación

```javascript
// En Edge Function: invite-user
async function inviteUser(organizationId, email, role, invitedBy) {
    // 1. Generar token único
    const token = crypto.randomUUID();
    
    // 2. Guardar invitación
    const { error } = await supabase.from('invitations').insert({
        organization_id: organizationId,
        email,
        role,
        token,
        invited_by: invitedBy,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    });
    
    // 3. Enviar email
    await sendInvitationEmail(email, token, organizationName);
    
    return { success: true };
}
```

### Código de Activación

```javascript
// En Edge Function: accept-invitation
async function acceptInvitation(token, password) {
    // 1. Verificar token válido
    const { data: invitation } = await supabase
        .from('invitations')
        .select('*, organizations(*)')
        .eq('token', token)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();
    
    if (!invitation) throw new Error('Invitación inválida o expirada');
    
    // 2. Crear usuario en Supabase Auth
    const { data: user, error } = await supabase.auth.admin.createUser({
        email: invitation.email,
        password,
        email_confirm: true,
        user_metadata: {
            organization_id: invitation.organization_id,
            role: invitation.role
        }
    });
    
    // 3. Crear membresía
    await supabase.from('organization_members').insert({
        organization_id: invitation.organization_id,
        user_id: user.id,
        role: invitation.role,
        status: 'active',
        joined_at: new Date()
    });
    
    // 4. Marcar invitación como usada
    await supabase.from('invitations')
        .update({ used_at: new Date() })
        .eq('id', invitation.id);
    
    return { success: true };
}
```

---

## 🛡️ Row Level Security (RLS)

### Políticas Obligatorias

```sql
-- Habilitar RLS en TODAS las tablas
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Función helper para obtener org_id del usuario actual
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
    LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Política: Solo ver datos de tu organización
CREATE POLICY "Users can view own org data" ON vehicles
    FOR SELECT
    USING (organization_id = get_user_organization_id());

-- Política: Solo insertar en tu organización
CREATE POLICY "Users can insert in own org" ON vehicles
    FOR INSERT
    WITH CHECK (organization_id = get_user_organization_id());

-- Política: Solo actualizar tu organización
CREATE POLICY "Users can update own org" ON vehicles
    FOR UPDATE
    USING (organization_id = get_user_organization_id());

-- Política: Solo eliminar en tu organización
CREATE POLICY "Users can delete own org" ON vehicles
    FOR DELETE
    USING (organization_id = get_user_organization_id());
```

### Política para SuperAdmin

```sql
-- Los SuperAdmin pueden ver todo (usar con cuidado)
CREATE POLICY "SuperAdmin full access" ON vehicles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'is_super_admin' = 'true'
        )
    );
```

---

## 🎫 Gestión de Sesiones

### Configuración de Supabase Auth

```javascript
// supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Usar cookies seguras en producción
        storage: window.localStorage, // Cambiar a custom storage con cookies en prod
    }
})
```

### Token Refresh

```javascript
// Configurar expiración corta en Supabase Dashboard:
// - Access Token: 1 hora
// - Refresh Token: 7 días

// El cliente auto-renueva, pero manejar errores:
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
        console.log('Token renovado');
    }
    if (event === 'SIGNED_OUT') {
        // Redirigir a login
        window.location.href = '/login';
    }
});
```

---

## 🏢 Onboarding de Compañías

### Flujo desde SuperAdmin

```javascript
// 1. SuperAdmin crea organización
async function createOrganization(data) {
    // Crear org
    const { data: org } = await supabase.from('organizations').insert({
        name: data.name,
        domain: data.domain,
        plan: data.plan,
        status: 'pending'
    }).select().single();
    
    // Agregar productos
    for (const product of data.products) {
        await supabase.from('organization_products').insert({
            organization_id: org.id,
            product_key: product
        });
    }
    
    // Enviar invitación al admin
    await supabase.functions.invoke('invite-user', {
        body: {
            organizationId: org.id,
            email: data.adminEmail,
            role: 'owner'
        }
    });
    
    return org;
}
```

### Email de Activación (Template)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Estilos Verdi + Aire */
        .container { max-width: 600px; margin: 0 auto; font-family: 'Inter', sans-serif; }
        .header { background: linear-gradient(135deg, #022326, #034040); padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 40px; background: #f8fafc; }
        .btn { 
            background: linear-gradient(135deg, #02735E, #035951);
            color: white;
            padding: 16px 32px;
            border-radius: 10px;
            text-decoration: none;
            display: inline-block;
            font-weight: 600;
        }
        .warning { 
            background: #fef3c7; 
            border-left: 4px solid #f59e0b; 
            padding: 16px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Bienvenido a Opsis Suite</h1>
        </div>
        <div class="content">
            <p>¡Hola!</p>
            <p>Tu cuenta para <strong>{{organization_name}}</strong> está lista.</p>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{activation_url}}" class="btn">Activar mi cuenta</a>
            </p>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul>
                    <li>Este enlace expira en 24 horas</li>
                    <li>Es de un solo uso</li>
                    <li>Si no solicitaste esta cuenta, ignora este correo</li>
                </ul>
            </div>
            
            <p>¿Problemas? Contacta a <a href="mailto:soporte@opsis-suite.com">soporte@opsis-suite.com</a></p>
        </div>
    </div>
</body>
</html>
```

---

## 👥 Roles y Permisos

### Matriz de Permisos

| Acción | Owner | Admin | Manager | Member |
|--------|-------|-------|---------|--------|
| Ver datos de la org | ✅ | ✅ | ✅ | ✅ |
| Crear registros | ✅ | ✅ | ✅ | ✅ |
| Editar registros | ✅ | ✅ | ✅ | ⚠️* |
| Eliminar registros | ✅ | ✅ | ⚠️* | ❌ |
| Invitar usuarios | ✅ | ✅ | ❌ | ❌ |
| Gestionar roles | ✅ | ⚠️* | ❌ | ❌ |
| Cambiar plan | ✅ | ❌ | ❌ | ❌ |
| Eliminar org | ✅ | ❌ | ❌ | ❌ |

*Solo los que ellos crearon

### Implementación en RLS

```sql
-- Función para verificar rol
CREATE OR REPLACE FUNCTION user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
    role_hierarchy TEXT[] := ARRAY['member', 'manager', 'admin', 'owner'];
BEGIN
    SELECT role INTO user_role
    FROM organization_members
    WHERE user_id = auth.uid()
    AND status = 'active';
    
    RETURN array_position(role_hierarchy, user_role) >= 
           array_position(role_hierarchy, required_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política: Solo admin+ puede eliminar
CREATE POLICY "Admin can delete" ON vehicles
    FOR DELETE
    USING (
        organization_id = get_user_organization_id()
        AND user_has_role('admin')
    );
```

---

## 📝 Audit Logs

### Tabla de Auditoría

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE, LOGIN, etc.
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda
CREATE INDEX idx_audit_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
```

### Trigger Automático

```sql
-- Función para logging automático
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        organization_id,
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data
    ) VALUES (
        COALESCE(NEW.organization_id, OLD.organization_id),
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) END,
        CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar a tablas críticas
CREATE TRIGGER audit_vehicles
    AFTER INSERT OR UPDATE OR DELETE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

---

## ✅ Checklist de Seguridad

### Antes de ir a Producción

- [ ] RLS habilitado en TODAS las tablas
- [ ] Políticas RLS probadas con diferentes roles
- [ ] Tokens con expiración configurada
- [ ] Rate limiting en Edge Functions
- [ ] CORS configurado correctamente
- [ ] Variables de entorno seguras (no en código)
- [ ] Audit logs funcionando
- [ ] Backups automáticos activos
- [ ] SSL/TLS en todos los endpoints
- [ ] Sanitización de inputs
- [ ] Validación server-side (no solo client)
- [ ] Manejo de errores sin exponer info sensible

### Testing de Seguridad

```bash
# 1. Probar RLS: Usuario A no debe ver datos de Usuario B
# 2. Probar tokens expirados
# 3. Probar invitaciones expiradas
# 4. Probar roles: member no puede eliminar
# 5. Probar SQL injection (debería fallar)
# 6. Probar XSS en inputs
# 7. Probar rate limiting
```

---

## 📚 Recursos

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Multi-tenancy](https://supabase.com/docs/guides/auth/managing-multi-tenancy)
- [OWASP Security Checklist](https://owasp.org/www-project-web-security-testing-guide/)

---

**Última actualización:** Diciembre 2024  
**Autor:** Equipo Opsis Suite  
**Estado:** Documento de planificación (implementar al migrar a Supabase)
