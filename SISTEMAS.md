# 🏢 Opsis Suite - Sistemas Disponibles

Suite completa de soluciones empresariales personalizadas para diferentes industrias.

## 📋 Sistemas Implementados

### 🚰 [Plomería](./sistemas/plomeria/)
Sistema de gestión completo para empresas de plomería.

**Características:**
- Gestión de órdenes de trabajo
- Control de inventario (materiales en camiones)
- Facturación e invoices
- Cotizaciones/presupuestos
- Seguimiento GPS de trabajos
- Dashboard de estadísticas
- Portal del cliente

**Stack:**
- Frontend: Next.js 14 + React 18 + TypeScript
- Backend: Supabase (PostgreSQL)
- UI: Legacy HTML/CSS/JS + Modern React components
- Base de datos: 14 tablas con relaciones completas

**URLs:**
- Repositorio: [opsis-plumbing](https://github.com/candewesth/opsis-plumbing)
- Documentación: [AUDIT_REPORT.md](./sistemas/plomeria/AUDIT_REPORT.md)
- Schema SQL: [0002_complete_schema.sql](./sistemas/plomeria/supabase/migrations/0002_complete_schema.sql)

---

### 🌿 Jardinería (En desarrollo)
Sistema de gestión para empresas de jardinería y mantenimiento de espacios verdes.

---

### 📦 Logística (En desarrollo)
Sistema de gestión de entregas y logística.

---

### 🚚 Mudanza (En desarrollo)
Sistema de gestión para empresas de mudanzas.

---

## 🏗️ Arquitectura Común

Todos los sistemas de Opsis Suite comparten:

### Stack Base:
```
Frontend:
├── Next.js 14 (App Router)
├── React 18 + TypeScript
├── Tailwind CSS
└── Supabase client library

Backend:
├── Supabase (PostgreSQL)
├── Server-side queries
└── RLS (Row Level Security)

UI Legacy (Opcional):
├── HTML/CSS/JS puro
├── CSS variables para theming
└── Dark mode support
```

### Estructura de Carpetas:
```
sistemas/
└── [sistema]/
    ├── web/                    # Next.js application
    │   ├── src/app/            # App Router pages
    │   ├── src/components/     # React components
    │   ├── src/lib/            # Utilities, data queries
    │   └── src/contexts/       # Context providers (i18n, etc)
    │
    ├── legacy/                 # Optional: Static HTML UI
    │   ├── *.html
    │   ├── *.css
    │   └── *.js
    │
    ├── supabase/               # Database migrations
    │   └── migrations/
    │       ├── 0001_init.sql
    │       └── 0002_schema.sql
    │
    ├── AUDIT_REPORT.md         # Code audit & recommendations
    ├── README.md               # Sistema-specific docs
    └── package.json
```

## � Autenticación Centralizada

**Todos los sistemas comparten un login único:**

### Acceso a Sistemas
```
URL: https://opsis-suite.com/login-central.html

Seleccionar sistema:
  ├── 🚰 Plomería
  ├── 🌿 Jardinería
  ├── 📦 Logística
  └── 🚚 Mudanza

Credenciales de desarrollo:
  Email:    dev@opsis-suite.com
  Password: opsis-dev-2025
  → Acceso a Super Admin Panel
```

### Flujo de Autenticación
1. Usuario entra a `login-central.html`
2. Selecciona sistema
3. Ingresa credenciales
4. Sistema valida y crea token
5. Routing automático:
   - **Dev/Admin** → Super Admin Panel (`./admin/superadmin.html`)
   - **Usuario** → Sistema asignado (`./sistemas/[sistema]/legacy/index.html`)

**Ver:** [AUTHENTICATION.md](./docs/AUTHENTICATION.md) para más detalles

---

## �🚀 Guía Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/candewesth/opsis-suite.git
cd opsis-suite
```

### 2. Acceder al Super Admin Panel (Desarrollo)
```
1. Abre: https://opsis-suite.com/login-central.html
2. Usa: dev@opsis-suite.com / opsis-dev-2025
3. Acceso completo a todos los sistemas
```

### 3. Instalar dependencias de un sistema
```bash
cd sistemas/plomeria/web
npm install
```

### 4. Conectar a Supabase
- Crear proyecto en Supabase
- Copiar `sistemas/plomeria/supabase/migrations/0002_complete_schema.sql`
- Ejecutar en Supabase SQL Editor
- Configurar `.env.local` con credenciales

### 5. Ejecutar desarrollo
```bash
cd sistemas/plomeria/web
npm run dev
```

## 📚 Documentación

- **[Arquitectura General](./docs/arquitectura.md)** _(próximamente)_
- **[Guía de Supabase](./docs/supabase-setup.md)** _(próximamente)_
- **[Guía de Deployment](./docs/deployment.md)** _(próximamente)_

## 🔒 Seguridad

Todos los sistemas incluyen:
- ✅ TypeScript para type-safety
- ✅ Supabase RLS (Row Level Security)
- ✅ Validación de entrada
- ✅ Autenticación integrada
- ✅ Variables de entorno seguros

## 🛠️ Desarrollo

### Crear un nuevo sistema
1. Copiar `sistemas/plomeria/` → `sistemas/nuevo-sistema/`
2. Adaptar tipos en `web/src/lib/types.ts`
3. Actualizar datos de demo en `web/src/lib/demo-data.ts`
4. Modificar schema SQL en `supabase/migrations/`
5. Actualizar este README

### Contribuir
Todas las contribuciones son bienvenidas. Por favor:
1. Fork del repositorio
2. Crear rama feature
3. Commit con mensajes claros
4. Push y pull request

## 📄 Licencia

[Tu licencia aquí]

---

**Última actualización:** 12 de noviembre de 2025
