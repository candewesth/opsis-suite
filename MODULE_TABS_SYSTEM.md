# Sistema Dinámico de Pestañas de Módulos

## Descripción General

El sistema de pestañas de módulos permite que las compañías agreguen nuevos módulos de Opsis Suite de forma dinámica. Las pestañas se renderizan automáticamente en el header según los módulos habilitados para cada compañía.

## Arquitectura

### Registro de Módulos

El sistema utiliza un objeto `MODULE_REGISTRY` que define todos los módulos disponibles:

```javascript
const MODULE_REGISTRY = {
  motorsync: {
    name: 'MotorSync',
    url: 'motorsync.html',
    order: 1,
    enabled: true // Siempre habilitado (módulo base)
  },
  timesync: {
    name: 'TimeSync',
    url: '../timesync/timesync.html',
    order: 2,
    enabled: true
  },
  projectsync: {
    name: 'ProjectSync',
    url: 'projectsync.html',
    order: 3,
    enabled: false // Se habilita cuando la compañía hace upgrade
  },
  warehousesync: {
    name: 'WarehouseSync',
    url: '../warehouse/inventory.html',
    order: 4,
    enabled: false
  },
  financesync: {
    name: 'FinanceSync',
    url: '../finance/dashboard.html',
    order: 5,
    enabled: false
  }
};
```

## Funciones Principales

### `renderModuleTabs()`

Renderiza las pestañas dinámicamente basándose en los módulos habilitados:

- Filtra módulos con `enabled: true`
- Ordena por el campo `order`
- Marca como activa la pestaña actual
- Aplica estilos diferenciados para pestañas activas/inactivas

### `enableModule(moduleKey)`

Habilita un módulo y re-renderiza las pestañas:

```javascript
// Ejemplo: Habilitar ProjectSync cuando la compañía hace upgrade
enableModule('projectsync');
```

### `disableModule(moduleKey)`

Deshabilita un módulo (excepto MotorSync que es el módulo base):

```javascript
// Ejemplo: Deshabilitar un módulo
disableModule('financesync');
```

## Uso

### Agregar Módulos Nuevos

Cuando una compañía compra un nuevo módulo:

```javascript
// En el panel de administración o durante el proceso de upgrade
enableModule('warehousesync');
enableModule('financesync');
```

Las pestañas aparecerán automáticamente en el header, ordenadas de izquierda a derecha.

### Agregar Nuevos Módulos al Sistema

Para agregar un módulo completamente nuevo al sistema:

```javascript
MODULE_REGISTRY.newsync = {
  name: 'NewSync',
  url: '../newsync/dashboard.html',
  order: 6,
  enabled: false
};
```

## Integración con Supabase

Para producción, el sistema debe conectarse con Supabase para persistir los módulos habilitados:

```javascript
// Cargar módulos habilitados desde Supabase
async function loadCompanyModules() {
  const { data, error } = await supabase
    .from('company_modules')
    .select('module_key')
    .eq('company_id', currentCompanyId)
    .eq('enabled', true);
  
  if (data) {
    data.forEach(row => {
      if (MODULE_REGISTRY[row.module_key]) {
        MODULE_REGISTRY[row.module_key].enabled = true;
      }
    });
    renderModuleTabs();
  }
}

// Habilitar módulo y guardar en Supabase
async function enableModuleAndSave(moduleKey) {
  enableModule(moduleKey);
  
  const { error } = await supabase
    .from('company_modules')
    .upsert({
      company_id: currentCompanyId,
      module_key: moduleKey,
      enabled: true,
      enabled_at: new Date().toISOString()
    });
  
  if (error) console.error('Error al guardar módulo:', error);
}
```

## Estructura de Base de Datos (Supabase)

### Tabla: `company_modules`

```sql
CREATE TABLE company_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  module_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  enabled_at TIMESTAMP WITH TIME ZONE,
  disabled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, module_key)
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_company_modules_company ON company_modules(company_id);
CREATE INDEX idx_company_modules_enabled ON company_modules(enabled);
```

## Estilos de Pestañas

Las pestañas utilizan estilos sutiles y profesionales:

```css
.module-tab {
  padding: 10px 28px;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

/* Pestaña activa: blanco con texto oscuro */
.module-tab.active {
  background: white !important;
  color: #1e293b !important;
}

/* Pestaña inactiva: gris claro con texto gris */
.module-tab:not(.active) {
  background: #e2e8f0;
  color: #64748b;
}

/* Hover en pestañas inactivas */
.module-tab:hover:not(.active) {
  background: #cbd5e1 !important;
}
```

## HTML del Contenedor

```html
<div class="module-tabs" id="module-tabs-container" style="display: flex; gap: 0;">
  <!-- Las pestañas se renderizan aquí dinámicamente -->
</div>
```

## Flujo de Trabajo

1. **Carga Inicial**: Al cargar la página, `renderModuleTabs()` se ejecuta automáticamente
2. **Detección de Página Activa**: Se compara la URL actual con las URLs registradas
3. **Renderizado Dinámico**: Se crean elementos `<a>` para cada módulo habilitado
4. **Orden Automático**: Los módulos se ordenan según el campo `order`
5. **Estilos Dinámicos**: Se aplican estilos inline basados en el estado activo/inactivo

## Módulos Disponibles

| Módulo | Nombre | URL | Orden | Por Defecto |
|--------|--------|-----|-------|-------------|
| `motorsync` | MotorSync | `motorsync.html` | 1 | ✅ Siempre |
| `timesync` | TimeSync | `../timesync/timesync.html` | 2 | ✅ Sí |
| `projectsync` | ProjectSync | `projectsync.html` | 3 | ❌ No |
| `warehousesync` | WarehouseSync | `../warehouse/inventory.html` | 4 | ❌ No |
| `financesync` | FinanceSync | `../finance/dashboard.html` | 5 | ❌ No |

## Ventajas del Sistema

✅ **Escalable**: Fácil agregar nuevos módulos sin modificar el HTML  
✅ **Flexible**: Habilitar/deshabilitar módulos por compañía  
✅ **Mantenible**: Un solo lugar para configurar todos los módulos  
✅ **Responsive**: Las pestañas se adaptan automáticamente  
✅ **Persistente**: Integración lista con Supabase para guardar preferencias  

## Casos de Uso

### 1. Compañía Nueva (Tier Básico)
- Solo MotorSync y TimeSync habilitados
- 2 pestañas visibles en el header

### 2. Compañía hace Upgrade a Tier Pro
```javascript
enableModule('projectsync');
enableModule('warehousesync');
```
- Ahora tiene 4 pestañas visibles

### 3. Compañía Enterprise (Todos los Módulos)
```javascript
enableModule('projectsync');
enableModule('warehousesync');
enableModule('financesync');
```
- Todas las pestañas visibles en orden

## Mantenimiento

### Agregar un Nuevo Módulo al Sistema

1. Agregar entrada en `MODULE_REGISTRY`
2. Configurar `name`, `url`, `order`, y `enabled`
3. El sistema automáticamente lo renderizará cuando `enabled: true`

### Cambiar el Orden de los Módulos

Modificar el campo `order` en cada módulo:

```javascript
timesync: { ..., order: 3 },
projectsync: { ..., order: 2 }
```

### Personalizar Estilos por Módulo

El sistema actualmente usa estilos uniformes, pero se puede extender:

```javascript
motorsync: {
  name: 'MotorSync',
  url: 'motorsync.html',
  order: 1,
  enabled: true,
  color: '#02735E',  // Color personalizado
  icon: 'motor.svg'  // Ícono personalizado
}
```

## Compatibilidad

- ✅ Funciona con el sistema de temas (light/dark)
- ✅ Compatible con navegación SPA
- ✅ Responsive y mobile-friendly
- ✅ Accesible (ARIA labels opcionales)

## Notas de Implementación

- El módulo `motorsync` nunca puede ser deshabilitado (módulo base)
- Las pestañas se renderizan en `DOMContentLoaded`
- El sistema detecta automáticamente la página activa por URL
- Los eventos hover se agregan dinámicamente a cada pestaña
