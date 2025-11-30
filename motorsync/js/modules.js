/**
 * Shared module tabs registry + renderer for every MotorSync page.
 * - Define window.MODULE_TABS_CONFIG before loading this file to customize the registry.
 * - Call ModuleTabs.setEnabled('toolsync', true) to toggle modules at runtime.
 */
(function () {
  const DEFAULT_REGISTRY = {
    motorsync: { name: 'MotorSync', url: 'motorsync.html', order: 1, enabled: true },
    timesync: { name: 'TimeSync', url: '../timesync/timesync.html', order: 2, enabled: true },
  };

  const registry = {};

  function normalizeConfig(config) {
    return Object.keys(config || {}).reduce((acc, key) => {
      const entry = config[key];
      if (!entry || !entry.url) return acc;
      acc[key] = {
        name: entry.name || key,
        url: entry.url,
        order: typeof entry.order === 'number' ? entry.order : 99,
        enabled: entry.enabled !== false,
      };
      return acc;
    }, {});
  }

  function initRegistry() {
    const overrides = window.MODULE_TABS_CONFIG;
    const source = overrides ? normalizeConfig(overrides) : DEFAULT_REGISTRY;
    Object.keys(source).forEach((key) => {
      registry[key] = { ...source[key] };
    });
  }

  function getCurrentPath() {
    try {
      return window.location.pathname || '';
    } catch {
      return '';
    }
  }

  function render(targetId = 'module-tabs-container') {
    const container = document.getElementById(targetId);
    if (!container) return;

    const modules = Object.entries(registry)
      .filter(([, module]) => module.enabled)
      .sort((a, b) => a[1].order - b[1].order);

    const currentPath = getCurrentPath();
    container.innerHTML = modules
      .map(([key, module]) => {
        const isActive =
          (key === 'motorsync' && currentPath.includes('/motorsync/')) ||
          currentPath.endsWith(`/${module.url}`) ||
          currentPath.endsWith(module.url);
        return `<a href="${module.url}" class="module-tab${isActive ? ' active' : ''}">${module.name}</a>`;
      })
      .join('');
  }

  function highlightSidebar() {
    const links = document.querySelectorAll('#sidebar a.sidebar-item');
    if (!links.length) return;
    const currentPath = getCurrentPath();
    let matched = false;

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      let linkPath = '';
      try {
        linkPath = new URL(href, window.location.href).pathname;
      } catch (err) {
        return;
      }
      const isActive = currentPath === linkPath;
      link.classList.toggle('active', isActive);
      if (isActive) matched = true;
    });

    if (!matched) {
      const first = links[0];
      if (first) first.classList.add('active');
    }
  }

  function setEnabled(key, enabled) {
    if (!registry[key]) return;
    if (key === 'motorsync') {
      registry[key].enabled = true;
    } else {
      registry[key].enabled = Boolean(enabled);
    }
    render();
  }

  initRegistry();

  document.addEventListener('DOMContentLoaded', () => {
    render();
    highlightSidebar();
  });

  window.ModuleTabs = {
    registry,
    render,
    setEnabled,
    highlightSidebar,
    override(newConfig = {}) {
      Object.keys(registry).forEach((key) => delete registry[key]);
      const normalized = normalizeConfig(newConfig);
      Object.keys(normalized).forEach((key) => {
        registry[key] = normalized[key];
      });
      render();
      highlightSidebar();
    },
  };

  window.enableModule = (key) => setEnabled(key, true);
  window.disableModule = (key) => setEnabled(key, false);

  window.addEventListener('focus', highlightSidebar);
})();
