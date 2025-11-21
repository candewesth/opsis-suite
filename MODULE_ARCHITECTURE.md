# Arquitectura de Módulos - Opsis Suite

## Patrón Estándar de Integración de Módulos

Este documento establece el estándar arquitectónico para todos los módulos de Opsis Suite, basado en la implementación de **MotorSync** (ProjectSync + ThreadSync).

---

## 🏗️ Estructura de Módulos

Cada módulo de Opsis Suite sigue esta estructura:

### 1. **Página Hub del Módulo** (Ejemplo: `motorsync.html`)
- Dashboard integrado del módulo
- Puede contener vista general o ser punto de entrada
- **Opcional**: Puede servir solo como redirector a sub-módulos

### 2. **Sub-Módulos Independientes** (Ejemplo: `projectsync.html`, `threadsync-list.html`)
- Páginas standalone con funcionalidad específica
- Navegación completa (header + sidebar)
- Auto-suficientes (no dependen de página padre)

### 3. **Páginas de Detalle** (Ejemplo: `threadsync.html?id=thread-1`)
- Vistas individuales de elementos
- Carga dinámica vía URL parameters
- Botón de regreso a lista

---

## 🎨 Componentes Estándar

### Header (Todas las páginas)
```html
<header style="background: linear-gradient(135deg, #02735E 0%, #035951 50%, #034040 100%); 
               background-size: 200% 200%; 
               animation: aire 8s ease infinite; 
               padding: 18px 32px; 
               display: flex; 
               align-items: center; 
               gap: 32px;">
  
  <!-- Logo Opsis Suite + Nombre Empresa -->
  <div class="logo">
    <div class="logo-text">
      <div class="logo-title">Opsis Suite</div>
      <div id="company-name-header">CVE San Diego</div>
    </div>
  </div>
  
  <!-- Module Tabs -->
  <div class="module-tabs">
    <a href="motorsync.html" class="module-tab active">MotorSync</a>
    <a href="../timesync/timesync.html" class="module-tab">TimeSync</a>
    <a href="../toolsync/toolsync.html" class="module-tab">ToolSync</a>
    <!-- Agregar más módulos aquí -->
  </div>
</header>
```

**Características:**
- ✅ Gradiente verde animado (aire effect)
- ✅ Logo + nombre de empresa
- ✅ Tabs de módulos contratados
- ✅ Módulo activo resaltado

### Sidebar (Todas las páginas)
```html
<aside id="sidebar">
  <!-- Dashboard -->
  <div class="sidebar-item" data-page="dashboard">Dashboard</div>
  
  <!-- Módulo Padre -->
  <div class="sidebar-item" data-page="motorsync">MotorSync</div>
  
  <!-- Sub-módulos (indentados 32px) -->
  <div style="margin-left: 32px;">
    <a href="projectsync.html" class="sidebar-item">ProjectSync</a>
    <a href="threadsync-list.html" class="sidebar-item active">ThreadSync</a>
  </div>
  
  <!-- Otros módulos -->
  <div class="sidebar-item">Clientes</div>
  <div class="sidebar-item">Management</div>
  <!-- ... -->
</aside>
```

**Características:**
- ✅ Módulo padre + sub-módulos anidados
- ✅ Sub-módulos indentados 32px a la izquierda
- ✅ Item activo marcado con clase `.active`
- ✅ Links directos a páginas standalone

---

## 📐 Layout Grid

Todas las páginas usan el mismo grid layout:

```css
.app-shell {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

header {
  grid-column: 1 / -1; /* Full width */
}
```

---

## 🎯 Módulos Actuales

### ✅ **MotorSync** (Implementado)
**Descripción:** Sistema operacional base - Gestión de proyectos y comunicación

**Sub-módulos:**
1. **ProjectSync** (`projectsync.html`)
   - Gestión de proyectos
   - Mapas de ubicación
   - Agenda de citas
   - Tabs: Resumen | Proyectos | Agenda

2. **ThreadSync** (`threadsync-list.html` + `threadsync.html`)
   - Lista de conversaciones por proyecto (3 columnas)
   - Vista individual de thread con comentarios
   - Filtros: Todos | Mis Threads | Menciones | No Leídos | Archivados

**Rutas:**
- Hub: `/dashboard/motorsync.html`
- ProjectSync: `/dashboard/projectsync.html`
- ThreadSync List: `/dashboard/threadsync-list.html`
- ThreadSync Detail: `/dashboard/threadsync.html?id=thread-1`

---

## 🔮 Módulos Futuros (Por Implementar)

### **TimeSync**
**Descripción:** Gestión de tiempo, asistencia y nómina

**Sub-módulos sugeridos:**
1. **Timecards** - Control de asistencia
2. **Projects** - Proyectos con tiempo
3. **Reports** - Reportes de tiempo
4. **Schedule** - Programación de turnos
5. **Staff** - Gestión de personal
6. **Timesheet Adjuster** - Ajustes de hojas de tiempo

**Rutas propuestas:**
- Hub: `/timesync/timesync.html`
- Sub-módulos: `/timesync/timecards.html`, `/timesync/projects.html`, etc.

**Archivos existentes a integrar:**
- `timesync/timecards.html`
- `timesync/projects.html`
- `timesync/reports.html`
- `timesync/schedule.html`
- `timesync/staff.html`
- `timesync/timesheet-adjuster.html`

---

### **ToolSync**
**Descripción:** Gestión de inventario, herramientas y equipos

**Sub-módulos sugeridos:**
1. **Inventory** - Inventario general
2. **Equipment** - Equipos y maquinaria
3. **Maintenance** - Mantenimiento preventivo
4. **Assignments** - Asignaciones de herramientas

**Rutas propuestas:**
- Hub: `/warehouse/toolsync.html`
- Sub-módulos: `/warehouse/inventory.html`, `/warehouse/equipment-detail.html`, etc.

**Archivos existentes a integrar:**
- `warehouse/inventory.html`
- `warehouse/equipment-detail.html`
- `warehouse/maintenance.html`
- `warehouse/assignments.html`

---

### **HumanSync**
**Descripción:** Gestión de recursos humanos, perfiles y capacitación

**Sub-módulos sugeridos:**
1. **Team Management** - Gestión de equipos
2. **Users** - Usuarios y permisos
3. **Activity** - Registro de actividad
4. **Onboarding** - Proceso de incorporación
5. **Training** - Capacitación y certificaciones

**Rutas propuestas:**
- Hub: `/company/humansync.html`
- Sub-módulos: `/company/team-management.html`, `/company/users.html`, etc.

**Archivos existentes a integrar:**
- `company/users.html`
- `company/activity.html`
- `dashboard/team-management.html`
- `dashboard/add-team-members.html`
- `dashboard/onboarding-multiproduct.html`

---

### **FinnaSync**
**Descripción:** Gestión financiera, facturación y reportes

**Sub-módulos sugeridos:**
1. **Billing** - Facturación y cobros
2. **Reports** - Reportes financieros
3. **Integrations** - Integraciones contables
4. **Analytics** - Análisis financiero

**Rutas propuestas:**
- Hub: `/company/finnasync.html`
- Sub-módulos: `/company/billing.html`, `/company/reports.html`, etc.

**Archivos existentes a integrar:**
- `company/billing.html`
- `company/reports.html`
- `company/integrations.html`
- `dashboard/analytics-admin.html`
- `dashboard/billing-admin.html`

---

## 🔄 Flujo de Navegación Estándar

### Ejemplo: MotorSync → ThreadSync

```
1. Usuario en Dashboard
   ↓ Click "MotorSync" en sidebar
2. motorsync.html (Hub)
   ↓ Click "ThreadSync" en sidebar
3. threadsync-list.html (Lista de threads en 3 columnas)
   ↓ Click en thread card
4. threadsync.html?id=thread-1 (Detalle individual)
   ↓ Click "← Volver a ThreadSync"
5. threadsync-list.html (Regreso a lista)
```

### Patrón General:
```
Hub Módulo → Sub-módulo Lista → Detalle Individual → [Volver] → Sub-módulo Lista
```

---

## 🎨 Estilo Visual Consistente

### Colores del Sistema (Verdi Palette)
```css
--verdi-dark: #022326;
--verdi-mid: #034040;
--verdi-accent: #035951;
--verdi-light: #02735E;
--primary-color: #02735E;
```

### Gradientes Estándar
**Header:**
```css
background: linear-gradient(135deg, #02735E 0%, #035951 50%, #034040 100%);
animation: aire 8s ease infinite;
```

**Cards de Proyecto (Verde):**
```css
background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
border-left: 4px solid #10b981;
```

**Cards de Proyecto (Naranja - En Progreso):**
```css
background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
border-left: 4px solid #f97316;
```

**Cards de Proyecto (Azul - Programado):**
```css
background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
border-left: 4px solid #3b82f6;
```

---

## 📋 Checklist de Implementación por Módulo

Al crear un nuevo módulo, seguir esta checklist:

### Estructura de Archivos
- [ ] Crear carpeta del módulo (ej: `/timesync/`)
- [ ] Crear página hub (ej: `timesync.html`)
- [ ] Crear sub-módulos standalone (ej: `timecards.html`, `projects.html`)
- [ ] Crear páginas de detalle con URL params si es necesario

### Header
- [ ] Copiar estructura de header estándar
- [ ] Incluir logo + nombre empresa
- [ ] Agregar tabs de módulos
- [ ] Marcar módulo actual como activo
- [ ] Incluir animación `aire` en gradiente

### Sidebar
- [ ] Copiar estructura de sidebar estándar
- [ ] Incluir Dashboard link
- [ ] Agregar módulo padre
- [ ] Listar sub-módulos (indentados 32px)
- [ ] Marcar página actual como activa
- [ ] Incluir otros módulos del sistema

### Layout
- [ ] Grid: `grid-template-columns: 250px 1fr`
- [ ] Header span full width: `grid-column: 1 / -1`
- [ ] Sidebar fijo 250px
- [ ] Contenido principal responsive

### Navegación
- [ ] Links correctos entre sub-módulos
- [ ] URL parameters para vistas de detalle
- [ ] Botón "Volver" en páginas de detalle
- [ ] Breadcrumbs si es necesario

### Estilo
- [ ] Usar paleta Verdi
- [ ] Gradientes verdes en header
- [ ] Cards con border-left coloreado
- [ ] Botones consistentes (primary, secondary, white)
- [ ] Tipografía Helvetica Neue

### Funcionalidad
- [ ] JavaScript independiente por página
- [ ] Funciones de navegación
- [ ] Filtros y búsqueda si aplica
- [ ] Modales para acciones
- [ ] Validación de formularios

### Accesibilidad
- [ ] Roles ARIA apropiados
- [ ] Labels en formularios
- [ ] Skip links si es necesario
- [ ] Contraste de colores adecuado

---

## 🚀 Orden de Implementación Recomendado

1. ✅ **MotorSync** (Completado)
2. **TimeSync** - Alta prioridad (archivos ya existen)
3. **ToolSync** - Media prioridad (archivos parciales)
4. **HumanSync** - Media prioridad (varios archivos)
5. **FinnaSync** - Baja prioridad (implementación nueva)

---

## 📝 Notas de Diseño

### Filosofía Basecamp
- **Simplicidad**: Interfaces limpias y directas
- **3 columnas**: Para listas de items (threads, proyectos, etc.)
- **Gradientes sutiles**: No colores planos
- **Metadata compacta**: Iconos + texto pequeño
- **Cards con sombra**: Box-shadow sutil
- **Chips de filtro**: Botones pill-shaped

### Responsive Design
- Desktop: Grid completo con sidebar
- Tablet: Sidebar colapsable
- Mobile: Stack vertical, menú hamburguesa

### Performance
- Lazy loading para listas largas
- Caché de datos en sessionStorage
- Minimizar requests al servidor
- Optimizar imágenes y mapas

---

## 🔗 Referencias

- **Implementación base**: `/dashboard/motorsync.html`
- **ProjectSync ejemplo**: `/dashboard/projectsync.html`
- **ThreadSync lista**: `/dashboard/threadsync-list.html`
- **ThreadSync detalle**: `/dashboard/threadsync.html`
- **CSS compartido**: Inline en cada página (future: extract to `/assets/css/modules.css`)

---

**Última actualización:** 20 Nov 2025
**Versión:** 1.0
**Autor:** CVE San Diego Development Team
