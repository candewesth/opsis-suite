/**
 * DemoDataManager centraliza el manejo de datos locales de demostración.
 * Permite limpiar el entorno sin afectar configuraciones persistentes
 * como preferencias de la compañía o ajustes de notificaciones.
 */
const DemoDataManager = (() => {
  const protectedKeys = new Set([
    'opsis_settings',
    NotifyManager?.STORAGE_KEYS?.SETTINGS || 'motorsync_notification_settings'
  ]);

  return {
    registerProtectedKey(key) {
      if (key) protectedKeys.add(key);
    },

    reset() {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (!protectedKeys.has(key)) {
          localStorage.removeItem(key);
        }
      });
      if (typeof NotifyManager !== 'undefined') {
        NotifyManager.init();
      }
    }
  };
})();
