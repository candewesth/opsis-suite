/**
 * OPSIS SUITE - FINAL ADVANCED FEATURES
 * Documentos, Widgets, Temas, Roles, Backups
 */

// ============================================================================
// 6. GESTOR DE DOCUMENTOS
// ============================================================================

class DocumentManager {
  constructor() {
    this.documents = [];
    this.folders = [];
    this.init();
  }

  init() {
    this.loadDocuments();
    this.loadFolders();
  }

  createFolder(name, parentId = null) {
    const folder = {
      id: Date.now(),
      name,
      parentId,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()
    };

    this.folders.push(folder);
    this.saveFolders();
    return folder;
  }

  uploadDocument(file, folderId = null, metadata = {}) {
    // En producción, esto subiría a un servidor/cloud storage
    // Por ahora, simulamos con File API + localStorage
    
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const document = {
          id: Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          folderId,
          data: e.target.result, // Base64 para archivos pequeños
          metadata: {
            ...metadata,
            relatedTo: metadata.relatedTo || null, // { type: 'customer', id: 123 }
            tags: metadata.tags || []
          },
          uploadedAt: new Date().toISOString(),
          uploadedBy: this.getCurrentUser(),
          url: null, // URL del servidor en producción
          shared: false,
          shareLink: null
        };

        this.documents.unshift(document);
        this.saveDocuments();
        resolve(document);
      };

      reader.onerror = () => reject(new Error('Error al leer archivo'));
      
      // Para archivos pequeños (<1MB), guardar en localStorage
      if (file.size < 1024 * 1024) {
        reader.readAsDataURL(file);
      } else {
        // Archivos grandes: solo guardar metadata
        const document = {
          id: Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          folderId,
          data: null,
          metadata: {
            ...metadata,
            message: 'Archivo muy grande. En producción se subiría a servidor.'
          },
          uploadedAt: new Date().toISOString(),
          uploadedBy: this.getCurrentUser()
        };
        
        this.documents.unshift(document);
        this.saveDocuments();
        resolve(document);
      }
    });
  }

  downloadDocument(documentId) {
    const doc = this.documents.find(d => d.id === documentId);
    if (!doc) return null;

    if (doc.data) {
      // Descargar desde localStorage
      const link = document.createElement('a');
      link.href = doc.data;
      link.download = doc.name;
      link.click();
    } else if (doc.url) {
      // Descargar desde servidor (producción)
      window.open(doc.url, '_blank');
    }

    return doc;
  }

  deleteDocument(documentId) {
    this.documents = this.documents.filter(d => d.id !== documentId);
    this.saveDocuments();
  }

  shareDocument(documentId, expiresIn = 7) {
    const doc = this.documents.find(d => d.id === documentId);
    if (!doc) return null;

    const shareLink = `share/${this.generateShareCode()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    doc.shared = true;
    doc.shareLink = shareLink;
    doc.shareExpiresAt = expiresAt.toISOString();

    this.saveDocuments();
    
    return {
      link: `${window.location.origin}/${shareLink}`,
      expiresAt: doc.shareExpiresAt
    };
  }

  generateShareCode() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  getDocuments(filter = {}) {
    let filtered = [...this.documents];

    if (filter.folderId !== undefined) {
      filtered = filtered.filter(d => d.folderId === filter.folderId);
    }

    if (filter.type) {
      filtered = filtered.filter(d => d.type.includes(filter.type));
    }

    if (filter.relatedTo) {
      filtered = filtered.filter(d => 
        d.metadata.relatedTo && 
        d.metadata.relatedTo.type === filter.relatedTo.type &&
        d.metadata.relatedTo.id === filter.relatedTo.id
      );
    }

    return filtered;
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    return {
      id: user.id || 1,
      name: user.name || 'Usuario Actual'
    };
  }

  loadDocuments() {
    try {
      const stored = localStorage.getItem('opsis_documents');
      if (stored) {
        this.documents = JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  }

  saveDocuments() {
    try {
      localStorage.setItem('opsis_documents', JSON.stringify(this.documents));
    } catch (err) {
      console.error('Error saving documents:', err);
      if (err.name === 'QuotaExceededError') {
        alert('Espacio de almacenamiento lleno. Por favor elimina archivos antiguos.');
      }
    }
  }

  loadFolders() {
    try {
      const stored = localStorage.getItem('opsis_folders');
      if (stored) {
        this.folders = JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error loading folders:', err);
    }
  }

  saveFolders() {
    try {
      localStorage.setItem('opsis_folders', JSON.stringify(this.folders));
    } catch (err) {
      console.error('Error saving folders:', err);
    }
  }
}

// ============================================================================
// 7. WIDGETS PERSONALIZABLES
// ============================================================================

class WidgetManager {
  constructor() {
    this.widgets = [];
    this.layout = [];
    this.init();
  }

  init() {
    this.loadLayout();
    this.registerDefaultWidgets();
  }

  registerDefaultWidgets() {
    this.widgets = [
      { id: 'revenue', name: 'Ingresos', type: 'chart', size: '2x1', enabled: true },
      { id: 'projects', name: 'Proyectos', type: 'chart', size: '2x1', enabled: true },
      { id: 'tasks', name: 'Mis Tareas', type: 'list', size: '1x1', enabled: true },
      { id: 'team', name: 'Equipo', type: 'chart', size: '2x1', enabled: true },
      { id: 'customers', name: 'Clientes Nuevos', type: 'chart', size: '1x1', enabled: true },
      { id: 'activity', name: 'Actividad Reciente', type: 'list', size: '1x1', enabled: true }
    ];
  }

  saveLayout(newLayout) {
    this.layout = newLayout;
    try {
      localStorage.setItem('opsis_dashboard_layout', JSON.stringify(this.layout));
    } catch (err) {
      console.error('Error saving layout:', err);
    }
  }

  loadLayout() {
    try {
      const stored = localStorage.getItem('opsis_dashboard_layout');
      if (stored) {
        this.layout = JSON.parse(stored);
      } else {
        // Layout por defecto
        this.layout = [
          { widgetId: 'revenue', position: { x: 0, y: 0 }, size: { w: 2, h: 1 } },
          { widgetId: 'projects', position: { x: 2, y: 0 }, size: { w: 2, h: 1 } },
          { widgetId: 'tasks', position: { x: 0, y: 1 }, size: { w: 1, h: 1 } },
          { widgetId: 'activity', position: { x: 1, y: 1 }, size: { w: 1, h: 1 } }
        ];
      }
    } catch (err) {
      console.error('Error loading layout:', err);
    }
  }

  toggleWidget(widgetId) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.enabled = !widget.enabled;
      this.saveWidgets();
    }
  }

  resetLayout() {
    this.layout = [];
    this.loadLayout();
    this.saveLayout(this.layout);
  }

  saveWidgets() {
    try {
      localStorage.setItem('opsis_dashboard_widgets', JSON.stringify(this.widgets));
    } catch (err) {
      console.error('Error saving widgets:', err);
    }
  }
}

// ============================================================================
// 8. TEMAS PERSONALIZADOS
// ============================================================================

class ThemeManager {
  constructor() {
    this.themes = {
      verdi: {
        name: 'Verdi (Default)',
        primary: '#02735E',
        accent: '#035951',
        dark: '#022326'
      },
      ocean: {
        name: 'Ocean Blue',
        primary: '#0284c7',
        accent: '#0369a1',
        dark: '#082f49'
      },
      sunset: {
        name: 'Sunset Orange',
        primary: '#ea580c',
        accent: '#c2410c',
        dark: '#431407'
      },
      corporate: {
        name: 'Corporate Gray',
        primary: '#475569',
        accent: '#334155',
        dark: '#0f172a'
      }
    };
    
    this.settings = {
      theme: 'verdi',
      mode: 'light', // light, dark
      density: 'normal', // compact, normal, spacious
      fontSize: 'normal' // small, normal, large
    };

    this.init();
  }

  init() {
    this.loadSettings();
    this.applyTheme();
  }

  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.settings.theme = themeName;
      this.saveSettings();
      this.applyTheme();
    }
  }

  setMode(mode) {
    this.settings.mode = mode;
    document.documentElement.dataset.theme = mode;
    this.saveSettings();
  }

  setDensity(density) {
    this.settings.density = density;
    document.documentElement.dataset.density = density;
    this.saveSettings();
  }

  setFontSize(size) {
    this.settings.fontSize = size;
    
    const sizes = {
      small: '14px',
      normal: '16px',
      large: '18px'
    };

    document.documentElement.style.setProperty('--base-font-size', sizes[size]);
    this.saveSettings();
  }

  setCustomColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    this.settings.customPrimary = color;
    this.saveSettings();
  }

  applyTheme() {
    const theme = this.themes[this.settings.theme];
    if (theme) {
      document.documentElement.style.setProperty('--primary-color', theme.primary);
      document.documentElement.style.setProperty('--accent-color', theme.accent);
      document.documentElement.style.setProperty('--verdi-dark', theme.dark);
    }

    document.documentElement.dataset.theme = this.settings.mode;
    document.documentElement.dataset.density = this.settings.density;
    
    if (this.settings.fontSize) {
      this.setFontSize(this.settings.fontSize);
    }
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem('opsis_theme_settings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (err) {
      console.error('Error loading theme settings:', err);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('opsis_theme_settings', JSON.stringify(this.settings));
    } catch (err) {
      console.error('Error saving theme settings:', err);
    }
  }

  getAvailableThemes() {
    return Object.entries(this.themes).map(([key, theme]) => ({
      id: key,
      ...theme
    }));
  }
}

// ============================================================================
// 9. SISTEMA DE ROLES Y PERMISOS
// ============================================================================

class PermissionManager {
  constructor() {
    this.roles = {
      admin: {
        name: 'Administrador',
        permissions: ['all']
      },
      supervisor: {
        name: 'Supervisor',
        permissions: [
          'customers:read', 'customers:create', 'customers:update',
          'projects:read', 'projects:create', 'projects:update',
          'reports:read', 'reports:create',
          'team:read',
          'settings:read'
        ]
      },
      operator: {
        name: 'Operador',
        permissions: [
          'projects:read', 'projects:update',
          'tasks:read', 'tasks:create', 'tasks:update',
          'timeline:read', 'timeline:create'
        ]
      },
      estimator: {
        name: 'Estimador',
        permissions: [
          'customers:read',
          'quotes:read', 'quotes:create', 'quotes:update',
          'projects:read',
          'reports:read'
        ]
      }
    };

    this.currentUser = null;
    this.init();
  }

  init() {
    this.loadCurrentUser();
  }

  hasPermission(permission) {
    if (!this.currentUser || !this.currentUser.role) {
      return false;
    }

    const role = this.roles[this.currentUser.role];
    if (!role) return false;

    // Admin tiene todos los permisos
    if (role.permissions.includes('all')) {
      return true;
    }

    // Verificar permiso específico
    if (role.permissions.includes(permission)) {
      return true;
    }

    // Verificar permiso wildcard (ej: 'customers:*')
    const [resource, action] = permission.split(':');
    const wildcardPermission = `${resource}:*`;
    if (role.permissions.includes(wildcardPermission)) {
      return true;
    }

    return false;
  }

  canAccess(module) {
    const modulePermissions = {
      'dashboard': null, // Todos pueden acceder
      'customers': 'customers:read',
      'projects': 'projects:read',
      'reports': 'reports:read',
      'settings': 'settings:read',
      'team': 'team:read'
    };

    const requiredPermission = modulePermissions[module];
    
    if (!requiredPermission) {
      return true; // Módulo público
    }

    return this.hasPermission(requiredPermission);
  }

  setUserRole(userId, roleName) {
    if (!this.roles[roleName]) {
      throw new Error(`Rol ${roleName} no existe`);
    }

    // En producción, esto actualizaría en el backend
    const users = JSON.parse(localStorage.getItem('opsis_users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (user) {
      user.role = roleName;
      localStorage.setItem('opsis_users', JSON.stringify(users));
    }
  }

  loadCurrentUser() {
    try {
      const stored = localStorage.getItem('current_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        // Usuario por defecto (para desarrollo)
        this.currentUser = {
          id: 1,
          name: 'Usuario Actual',
          role: 'admin' // Cambiar según necesidad
        };
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));
      }
    } catch (err) {
      console.error('Error loading current user:', err);
    }
  }

  getRolePermissions(roleName) {
    return this.roles[roleName] || null;
  }

  getAllRoles() {
    return Object.entries(this.roles).map(([key, role]) => ({
      id: key,
      ...role
    }));
  }
}

// ============================================================================
// 10. EXPORTACIÓN Y BACKUPS
// ============================================================================

class BackupManager {
  constructor() {
    this.init();
  }

  init() {
    // Verificar espacio disponible
    this.checkStorageSpace();
  }

  exportAllData() {
    const data = {
      exportDate: new Date().toISOString(),
      version: '2.1',
      data: {
        customers: this.getLocalStorageItem('opsis_customers') || [],
        projects: this.getLocalStorageItem('opsis_projects') || [],
        tasks: this.getLocalStorageItem('opsis_tasks') || [],
        notifications: this.getLocalStorageItem('opsis_notifications') || {},
        timeline: this.getAllTimelines(),
        documents: this.getLocalStorageItem('opsis_documents') || [],
        settings: this.getLocalStorageItem('opsis_settings') || {},
        theme: this.getLocalStorageItem('opsis_theme_settings') || {}
      }
    };

    return data;
  }

  downloadBackup() {
    const backup = this.exportAllData();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const filename = `opsis_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);

    if (window.notificationCenter) {
      window.notificationCenter.addNotification(
        'Backup Creado',
        `Archivo: ${filename}`,
        'success'
      );
    }
  }

  importBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          
          if (!this.validateBackup(backup)) {
            reject(new Error('Archivo de backup inválido'));
            return;
          }

          // Confirmar antes de restaurar
          if (!confirm('¿Estás seguro? Esto sobrescribirá todos los datos actuales.')) {
            reject(new Error('Operación cancelada por el usuario'));
            return;
          }

          this.restoreBackup(backup);
          resolve(backup);

          if (window.notificationCenter) {
            window.notificationCenter.addNotification(
              'Backup Restaurado',
              'Datos restaurados exitosamente. Recarga la página.',
              'success'
            );
          }

          // Recargar la página después de 2 segundos
          setTimeout(() => {
            window.location.reload();
          }, 2000);

        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsText(file);
    });
  }

  validateBackup(backup) {
    return backup && 
           backup.version && 
           backup.data && 
           backup.exportDate;
  }

  restoreBackup(backup) {
    const { data } = backup;

    // Restaurar cada categoría
    if (data.customers) localStorage.setItem('opsis_customers', JSON.stringify(data.customers));
    if (data.projects) localStorage.setItem('opsis_projects', JSON.stringify(data.projects));
    if (data.tasks) localStorage.setItem('opsis_tasks', JSON.stringify(data.tasks));
    if (data.notifications) localStorage.setItem('opsis_notifications', JSON.stringify(data.notifications));
    if (data.documents) localStorage.setItem('opsis_documents', JSON.stringify(data.documents));
    if (data.settings) localStorage.setItem('opsis_settings', JSON.stringify(data.settings));
    if (data.theme) localStorage.setItem('opsis_theme_settings', JSON.stringify(data.theme));

    // Restaurar timelines
    if (data.timeline) {
      Object.entries(data.timeline).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    }
  }

  scheduleAutomaticBackup(frequency = 'weekly') {
    // En producción, esto programaría backups en el servidor
    const frequencies = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    };

    const interval = frequencies[frequency];
    
    if (interval) {
      localStorage.setItem('opsis_backup_schedule', JSON.stringify({
        frequency,
        lastBackup: new Date().toISOString(),
        nextBackup: new Date(Date.now() + interval).toISOString()
      }));
    }
  }

  checkStorageSpace() {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        const percentUsed = (estimate.usage / estimate.quota) * 100;
        
        if (percentUsed > 80) {
          if (window.notificationCenter) {
            window.notificationCenter.addNotification(
              'Espacio de Almacenamiento',
              `${percentUsed.toFixed(0)}% del espacio usado. Considera limpiar datos antiguos.`,
              'warning'
            );
          }
        }
      });
    }
  }

  clearOldData(daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoff = cutoffDate.toISOString();

    // Limpiar notificaciones antiguas
    const notifications = this.getLocalStorageItem('opsis_notifications');
    if (notifications && notifications.notifications) {
      notifications.notifications = notifications.notifications.filter(n => 
        n.timestamp > cutoff
      );
      localStorage.setItem('opsis_notifications', JSON.stringify(notifications));
    }

    // Limpiar tareas completadas antiguas
    const tasks = this.getLocalStorageItem('opsis_tasks');
    if (tasks) {
      const cleaned = tasks.filter(t => 
        t.status !== 'completed' || t.completedAt > cutoff
      );
      localStorage.setItem('opsis_tasks', JSON.stringify(cleaned));
    }

    if (window.notificationCenter) {
      window.notificationCenter.addNotification(
        'Limpieza Completada',
        'Datos antiguos eliminados exitosamente',
        'success'
      );
    }
  }

  getLocalStorageItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  getAllTimelines() {
    const timelines = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('opsis_timeline_')) {
        timelines[key] = this.getLocalStorageItem(key);
      }
    }

    return timelines;
  }
}

// ============================================================================
// INICIALIZACIÓN FINAL
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gestor de documentos
  window.documentManager = new DocumentManager();
  console.log('✅ Document Manager inicializado');

  // Inicializar gestor de widgets
  window.widgetManager = new WidgetManager();
  console.log('✅ Widget Manager inicializado');

  // Inicializar gestor de temas
  window.themeManager = new ThemeManager();
  console.log('✅ Theme Manager inicializado');

  // Inicializar gestor de permisos
  window.permissionManager = new PermissionManager();
  console.log('✅ Permission Manager inicializado');

  // Inicializar gestor de backups
  window.backupManager = new BackupManager();
  console.log('✅ Backup Manager inicializado');

  console.log('🎉 TODAS LAS FUNCIONALIDADES AVANZADAS INICIALIZADAS');
  console.log('📊 Total de sistemas activos: 10');
  console.log('- Búsqueda Global (Ctrl+K)');
  console.log('- Centro de Notificaciones');
  console.log('- Timeline por Cliente');
  console.log('- Sistema de Tareas');
  console.log('- Dashboard con Gráficas');
  console.log('- Gestor de Documentos');
  console.log('- Widgets Personalizables');
  console.log('- Temas Avanzados');
  console.log('- Roles y Permisos');
  console.log('- Exportación y Backups');
});

// Exportar clases globalmente
window.DocumentManager = DocumentManager;
window.WidgetManager = WidgetManager;
window.ThemeManager = ThemeManager;
window.PermissionManager = PermissionManager;
window.BackupManager = BackupManager;
