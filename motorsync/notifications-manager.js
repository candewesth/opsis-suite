/**
 * NotifySync - Sistema Central de Notificaciones
 * Gestiona notificaciones entre todos los módulos premium de MotorSync
 * 
 * USO:
 * 1. Importar en cualquier módulo: <script src="notifications-manager.js"></script>
 * 2. Crear notificación: NotifyManager.create({ type, title, message, module, link })
 * 3. Las notificaciones aparecen automáticamente en NotifySync y dashboard
 */

const NotifyManager = {
  
  // Configuración de módulos premium disponibles
  MODULES: {
    PROJECTSYNC: { id: 'projectsync', name: 'ProjectSync', color: '#02735E' },
    TIMESYNC: { id: 'timesync', name: 'TimeSync', color: '#3b82f6' },
    THREADSYNC: { id: 'threadsync', name: 'ThreadSync', color: '#8b5cf6' },
    WAREHOUSE: { id: 'warehouse', name: 'Warehouse', color: '#f59e0b' },
    ESTIMATOR: { id: 'estimator', name: 'Estimator', color: '#06b6d4' },
    MOTORSYNC: { id: 'motorsync', name: 'MotorSync', color: '#10b981' }
  },

  // Tipos de notificaciones
  TYPES: {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error'
  },

  // LocalStorage keys
  STORAGE_KEYS: {
    NOTIFICATIONS: 'motorsync_notifications',
    ACTIVE_MODULES: 'motorsync_active_modules',
    SETTINGS: 'motorsync_notification_settings'
  },

  /**
   * Inicializar sistema de notificaciones
   * Debe llamarse al cargar cada página
   */
  init() {
    // Crear estructura de datos si no existe
    if (!localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
    
    // Configurar módulos activos por defecto
    if (!localStorage.getItem(this.STORAGE_KEYS.ACTIVE_MODULES)) {
      const defaultModules = Object.keys(this.MODULES);
      localStorage.setItem(this.STORAGE_KEYS.ACTIVE_MODULES, JSON.stringify(defaultModules));
    }

    // Configuración por defecto
    if (!localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) {
      const defaultSettings = {
        enabled: true,
        maxNotifications: 100,
        autoDeleteAfterDays: 30,
        showDesktopNotifications: false
      };
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }

    // Limpiar notificaciones antiguas
    this.cleanOldNotifications();
  },

  /**
   * Crear una nueva notificación
   * @param {Object} config - Configuración de la notificación
   * @param {string} config.type - Tipo: 'success' | 'info' | 'warning' | 'error'
   * @param {string} config.title - Título de la notificación
   * @param {string} config.message - Mensaje descriptivo
   * @param {string} config.module - ID del módulo que genera la notificación
   * @param {string} [config.link] - URL opcional para acción
   * @param {Object} [config.metadata] - Datos adicionales (proyecto_id, user_id, etc.)
   * @returns {Object} Notificación creada
   */
  create({ type, title, message, module, link = null, metadata = {} }) {
    // Validar tipo
    if (!Object.values(this.TYPES).includes(type)) {
      console.error(`Tipo de notificación inválido: ${type}`);
      return null;
    }

    // Validar módulo
    const moduleData = Object.values(this.MODULES).find(m => m.id === module);
    if (!moduleData) {
      console.error(`Módulo no reconocido: ${module}`);
      return null;
    }

    // Verificar si el módulo está activo
    if (!this.isModuleActive(module)) {
      console.log(`Módulo ${module} no está activo, notificación no creada`);
      return null;
    }

    // Verificar si las notificaciones están habilitadas
    const settings = this.getSettings();
    if (!settings.enabled) {
      console.log('Notificaciones deshabilitadas globalmente');
      return null;
    }

    // Crear notificación
    const notification = {
      id: this.generateId(),
      type,
      title,
      message,
      module,
      moduleName: moduleData.name,
      moduleColor: moduleData.color,
      link,
      metadata,
      timestamp: new Date().toISOString(),
      read: false,
      createdAt: Date.now()
    };

    // Guardar en localStorage
    const notifications = this.getAll();
    notifications.unshift(notification); // Agregar al inicio

    // Limitar cantidad de notificaciones
    if (notifications.length > settings.maxNotifications) {
      notifications.splice(settings.maxNotifications);
    }

    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));

    // Trigger evento personalizado para actualizar UI
    this.dispatchUpdateEvent();

    // Notificación de escritorio (opcional)
    if (settings.showDesktopNotifications && 'Notification' in window) {
      this.showDesktopNotification(notification);
    }

    console.log(`✅ Notificación creada: [${moduleData.name}] ${title}`);
    return notification;
  },

  /**
   * Obtener todas las notificaciones
   * @returns {Array} Lista de notificaciones
   */
  getAll() {
    const data = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Obtener notificaciones no leídas
   * @returns {Array} Notificaciones sin leer
   */
  getUnread() {
    return this.getAll().filter(n => !n.read);
  },

  /**
   * Obtener notificaciones por módulo
   * @param {string} moduleId - ID del módulo
   * @returns {Array} Notificaciones del módulo
   */
  getByModule(moduleId) {
    return this.getAll().filter(n => n.module === moduleId);
  },

  /**
   * Obtener notificaciones por tipo
   * @param {string} type - Tipo de notificación
   * @returns {Array} Notificaciones del tipo especificado
   */
  getByType(type) {
    return this.getAll().filter(n => n.type === type);
  },

  /**
   * Marcar notificación como leída
   * @param {string} id - ID de la notificación
   */
  markAsRead(id) {
    const notifications = this.getAll();
    const notification = notifications.find(n => n.id === id);
    
    if (notification) {
      notification.read = true;
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      this.dispatchUpdateEvent();
    }
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  markAllAsRead() {
    const notifications = this.getAll();
    notifications.forEach(n => n.read = true);
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    this.dispatchUpdateEvent();
  },

  /**
   * Eliminar una notificación
   * @param {string} id - ID de la notificación
   */
  delete(id) {
    let notifications = this.getAll();
    notifications = notifications.filter(n => n.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    this.dispatchUpdateEvent();
  },

  /**
   * Eliminar todas las notificaciones
   */
  deleteAll() {
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    this.dispatchUpdateEvent();
  },

  /**
   * Limpiar notificaciones antiguas según configuración
   */
  cleanOldNotifications() {
    const settings = this.getSettings();
    const maxAge = settings.autoDeleteAfterDays * 24 * 60 * 60 * 1000; // Días a milisegundos
    const now = Date.now();
    
    let notifications = this.getAll();
    const initialCount = notifications.length;
    
    notifications = notifications.filter(n => {
      const age = now - n.createdAt;
      return age < maxAge;
    });

    if (notifications.length < initialCount) {
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      console.log(`🧹 Limpiadas ${initialCount - notifications.length} notificaciones antiguas`);
    }
  },

  /**
   * Verificar si un módulo está activo
   * @param {string} moduleId - ID del módulo
   * @returns {boolean} True si el módulo está activo
   */
  isModuleActive(moduleId) {
    const activeModules = this.getActiveModules();
    return activeModules.includes(moduleId.toUpperCase());
  },

  /**
   * Obtener lista de módulos activos
   * @returns {Array} IDs de módulos activos
   */
  getActiveModules() {
    const data = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_MODULES);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Activar/desactivar un módulo
   * @param {string} moduleId - ID del módulo
   * @param {boolean} active - True para activar, false para desactivar
   */
  setModuleActive(moduleId, active) {
    let activeModules = this.getActiveModules();
    const moduleKey = moduleId.toUpperCase();
    
    if (active && !activeModules.includes(moduleKey)) {
      activeModules.push(moduleKey);
    } else if (!active) {
      activeModules = activeModules.filter(m => m !== moduleKey);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.ACTIVE_MODULES, JSON.stringify(activeModules));
    console.log(`📦 Módulo ${moduleId}: ${active ? 'activado' : 'desactivado'}`);
  },

  /**
   * Obtener configuración de notificaciones
   * @returns {Object} Configuración actual
   */
  getSettings() {
    const data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  },

  /**
   * Actualizar configuración
   * @param {Object} newSettings - Nuevas configuraciones
   */
  updateSettings(newSettings) {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    console.log('⚙️ Configuración actualizada:', updatedSettings);
  },

  /**
   * Generar ID único para notificación
   * @returns {string} ID único
   */
  generateId() {
    return `notify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Disparar evento de actualización
   * Permite que otras páginas detecten cambios en notificaciones
   */
  dispatchUpdateEvent() {
    const event = new CustomEvent('notificationsUpdated', {
      detail: {
        count: this.getAll().length,
        unreadCount: this.getUnread().length
      }
    });
    window.dispatchEvent(event);
  },

  /**
   * Mostrar notificación de escritorio (si está habilitado)
   * @param {Object} notification - Objeto de notificación
   */
  showDesktopNotification(notification) {
    if (Notification.permission === 'granted') {
      new Notification(`${notification.moduleName}: ${notification.title}`, {
        body: notification.message,
        icon: '/assets/icons/motorsync-icon.png',
        badge: '/assets/icons/motorsync-badge.png',
        tag: notification.id
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showDesktopNotification(notification);
        }
      });
    }
  },

  /**
   * Obtener estadísticas de notificaciones
   * @returns {Object} Estadísticas
   */
  getStats() {
    const notifications = this.getAll();
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: {
        success: notifications.filter(n => n.type === 'success').length,
        info: notifications.filter(n => n.type === 'info').length,
        warning: notifications.filter(n => n.type === 'warning').length,
        error: notifications.filter(n => n.type === 'error').length
      },
      byModule: Object.values(this.MODULES).reduce((acc, module) => {
        acc[module.id] = notifications.filter(n => n.module === module.id).length;
        return acc;
      }, {})
    };
  }
};

// Auto-inicializar al cargar el script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => NotifyManager.init());
} else {
  NotifyManager.init();
}

// Exponer globalmente
window.NotifyManager = NotifyManager;
