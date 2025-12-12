# NotifySync - Guía de Integración

Sistema centralizado de notificaciones para MotorSync y todos sus módulos premium.

## 📦 Instalación en Módulos

### 1. Importar el script en tu módulo HTML

```html
<!-- En cualquier página de módulo premium -->
<script src="notifications-manager.js"></script>
```

### 2. El sistema se inicializa automáticamente

No necesitas llamar `init()` manualmente.

---

## 🚀 Ejemplos de Uso

### **ProjectSync - Nuevo Proyecto Creado**

```javascript
// Cuando se crea un nuevo proyecto
function createProject(projectData) {
  // ... lógica de creación ...
  
  NotifyManager.create({
    type: 'success',
    title: 'Nuevo Proyecto Creado',
    message: `El proyecto "${projectData.name}" ha sido creado exitosamente`,
    module: 'projectsync',
    link: `projectsync.html?id=${projectData.id}`,
    metadata: {
      projectId: projectData.id,
      clientName: projectData.client,
      createdBy: currentUser.id
    }
  });
}
```

### **ProjectSync - Cambio de Estado**

```javascript
// Cuando cambia el estado de un proyecto
function updateProjectStatus(projectId, newStatus) {
  // ... actualizar estado ...
  
  const statusMessages = {
    'in_progress': { type: 'info', title: 'Proyecto en Progreso' },
    'completed': { type: 'success', title: 'Proyecto Completado' },
    'on_hold': { type: 'warning', title: 'Proyecto en Pausa' },
    'cancelled': { type: 'error', title: 'Proyecto Cancelado' }
  };
  
  const config = statusMessages[newStatus];
  
  NotifyManager.create({
    type: config.type,
    title: config.title,
    message: `El proyecto #${projectId} cambió a estado: ${newStatus}`,
    module: 'projectsync',
    link: `projectsync.html?id=${projectId}`,
    metadata: { projectId, status: newStatus }
  });
}
```

### **TimeSync - Timesheet Aprobado**

```javascript
// Cuando se aprueba un timesheet
function approveTimesheet(timesheetId, employeeName, hours) {
  // ... aprobar timesheet ...
  
  NotifyManager.create({
    type: 'success',
    title: 'Timesheet Aprobado',
    message: `Timesheet de ${employeeName} aprobado (${hours}h)`,
    module: 'timesync',
    link: `timesync.html?view=approved&id=${timesheetId}`,
    metadata: {
      timesheetId,
      employeeId: employee.id,
      hours,
      approvedBy: supervisor.id
    }
  });
}
```

### **TimeSync - Timesheet Rechazado**

```javascript
function rejectTimesheet(timesheetId, employeeName, reason) {
  NotifyManager.create({
    type: 'error',
    title: 'Timesheet Rechazado',
    message: `Timesheet de ${employeeName} requiere correcciones: ${reason}`,
    module: 'timesync',
    link: `timesync.html?view=pending&id=${timesheetId}`,
    metadata: { timesheetId, reason }
  });
}
```

### **ThreadSync - Nuevo Mensaje**

```javascript
// Cuando llega un mensaje nuevo
function onNewMessage(threadId, message) {
  NotifyManager.create({
    type: 'info',
    title: 'Nuevo Mensaje',
    message: `${message.sender}: ${message.preview}`,
    module: 'threadsync',
    link: `threadsync.html?thread=${threadId}`,
    metadata: {
      threadId,
      senderId: message.senderId,
      messageId: message.id
    }
  });
}
```

### **ThreadSync - Mención en Conversación**

```javascript
function onMentioned(threadId, mentionedBy, message) {
  NotifyManager.create({
    type: 'warning',
    title: 'Te Mencionaron',
    message: `${mentionedBy} te mencionó: "${message}"`,
    module: 'threadsync',
    link: `threadsync.html?thread=${threadId}#mention`,
    metadata: { threadId, mentionedBy }
  });
}
```

### **Warehouse - Stock Bajo**

```javascript
// Alerta de inventario bajo
function checkInventoryLevels() {
  const lowStockItems = inventory.filter(item => item.quantity < item.minStock);
  
  lowStockItems.forEach(item => {
    NotifyManager.create({
      type: 'warning',
      title: 'Stock Bajo',
      message: `${item.name}: Solo quedan ${item.quantity} unidades (mínimo: ${item.minStock})`,
      module: 'warehouse',
      link: `warehouse.html?view=inventory&item=${item.id}`,
      metadata: {
        itemId: item.id,
        currentStock: item.quantity,
        minStock: item.minStock
      }
    });
  });
}
```

### **Warehouse - Equipo en Mantenimiento**

```javascript
function scheduleMaintenanceAlert(equipmentId, dueDate) {
  NotifyManager.create({
    type: 'info',
    title: 'Mantenimiento Programado',
    message: `Equipo #${equipmentId} requiere mantenimiento el ${dueDate}`,
    module: 'warehouse',
    link: `warehouse.html?view=maintenance&id=${equipmentId}`,
    metadata: { equipmentId, dueDate }
  });
}
```

### **Estimator - Nueva Cotización**

```javascript
function onQuoteCreated(quoteId, clientName, total) {
  NotifyManager.create({
    type: 'success',
    title: 'Nueva Cotización',
    message: `Cotización #${quoteId} para ${clientName} - Total: $${total}`,
    module: 'estimator',
    link: `estimator.html?quote=${quoteId}`,
    metadata: { quoteId, clientName, total }
  });
}
```

### **Estimator - Cotización Requiere Aprobación**

```javascript
function requestQuoteApproval(quoteId, amount) {
  NotifyManager.create({
    type: 'warning',
    title: 'Aprobación Requerida',
    message: `Cotización #${quoteId} requiere aprobación (>$${amount})`,
    module: 'estimator',
    link: `estimator.html?quote=${quoteId}&action=approve`,
    metadata: { quoteId, amount, requiresApproval: true }
  });
}
```

---

## 🎯 API Completa

### **Crear Notificación**

```javascript
NotifyManager.create({
  type: 'success' | 'info' | 'warning' | 'error',  // Requerido
  title: 'Título de la notificación',              // Requerido
  message: 'Mensaje descriptivo',                  // Requerido
  module: 'projectsync',                           // Requerido (ID del módulo)
  link: 'url-destino.html',                        // Opcional
  metadata: { key: 'value' }                       // Opcional
});
```

### **Obtener Notificaciones**

```javascript
// Todas las notificaciones
const all = NotifyManager.getAll();

// Solo no leídas
const unread = NotifyManager.getUnread();

// Por módulo
const projectNotifications = NotifyManager.getByModule('projectsync');

// Por tipo
const warnings = NotifyManager.getByType('warning');
```

### **Marcar como Leída**

```javascript
// Una notificación
NotifyManager.markAsRead(notificationId);

// Todas
NotifyManager.markAllAsRead();
```

### **Eliminar Notificaciones**

```javascript
// Una notificación
NotifyManager.delete(notificationId);

// Todas
NotifyManager.deleteAll();
```

### **Estadísticas**

```javascript
const stats = NotifyManager.getStats();
// Retorna:
// {
//   total: 45,
//   unread: 12,
//   byType: { success: 20, info: 15, warning: 8, error: 2 },
//   byModule: { projectsync: 25, timesync: 10, ... }
// }
```

### **Gestión de Módulos Activos**

```javascript
// Verificar si un módulo está activo
const isActive = NotifyManager.isModuleActive('projectsync');

// Obtener módulos activos
const activeModules = NotifyManager.getActiveModules();

// Activar/desactivar módulo
NotifyManager.setModuleActive('projectsync', true);  // Activar
NotifyManager.setModuleActive('timesync', false);    // Desactivar
```

### **Configuración**

```javascript
// Obtener configuración actual
const settings = NotifyManager.getSettings();

// Actualizar configuración
NotifyManager.updateSettings({
  enabled: true,                    // Habilitar/deshabilitar notificaciones
  maxNotifications: 100,            // Máximo de notificaciones a mantener
  autoDeleteAfterDays: 30,          // Días antes de auto-eliminar
  showDesktopNotifications: false   // Notificaciones del navegador
});
```

---

## 🔔 Eventos en Tiempo Real

Escucha cambios en notificaciones desde cualquier página:

```javascript
// Detectar cuando se crean/actualizan notificaciones
window.addEventListener('notificationsUpdated', (event) => {
  console.log('Total:', event.detail.count);
  console.log('No leídas:', event.detail.unreadCount);
  
  // Actualizar UI
  updateNotificationBadge(event.detail.unreadCount);
});
```

---

## 📋 Módulos Disponibles

| ID | Nombre | Color |
|---|---|---|
| `projectsync` | ProjectSync | #02735E |
| `timesync` | TimeSync | #3b82f6 |
| `threadsync` | ThreadSync | #8b5cf6 |
| `warehouse` | Warehouse | #f59e0b |
| `estimator` | Estimator | #06b6d4 |
| `motorsync` | MotorSync | #10b981 |

---

## 🎨 Tipos de Notificaciones

- **`success`** (verde): Operaciones exitosas
- **`info`** (azul): Información general
- **`warning`** (amarillo): Alertas que requieren atención
- **`error`** (rojo): Errores o problemas críticos

---

## ✅ Checklist de Integración

Cuando crees un nuevo módulo premium:

1. ✅ Importar `<script src="notifications-manager.js"></script>`
2. ✅ Identificar eventos clave que deben generar notificaciones
3. ✅ Llamar `NotifyManager.create()` en esos eventos
4. ✅ Incluir metadata relevante para rastreo
5. ✅ Proporcionar links útiles para navegación rápida
6. ✅ Usar tipos apropiados (success/info/warning/error)
7. ✅ Probar que aparezcan en NotifySync.html y dashboard

---

## 🔒 Sistema de Permisos

Las notificaciones solo se crean si:
- ✅ El módulo está en la lista de activos (`motorsync_active_modules`)
- ✅ Las notificaciones están habilitadas globalmente
- ✅ El tipo y módulo son válidos

Esto permite que cada compañía solo vea notificaciones de los módulos que contrató.

---

## 🚀 Próximos Pasos

Cuando implementes cada módulo, usa esta guía para:
1. Copiar el ejemplo más parecido a tu caso de uso
2. Adaptar los datos según tu módulo
3. Probar que las notificaciones aparezcan correctamente
4. Verificar que los links funcionen

¡El sistema está listo para escalar con todos tus módulos premium!
