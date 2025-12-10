/**
 * Shared module tabs registry + renderer for every MotorSync page.
 * - Define window.MODULE_TABS_CONFIG before loading this file to customize the registry.
 * - Call ModuleTabs.setEnabled('toolsync', true) to toggle modules at runtime.
 */
(function ensureDemoSeedsLoaded() {
  if (typeof window === 'undefined' || window.DemoSeeds) return;
  try {
    const request = new XMLHttpRequest();
    request.open('GET', 'js/seeds.js?v=verdi2', false);
    request.send(null);
    if (request.status >= 200 && request.status < 400) {
      // eslint-disable-next-line no-new-func
      new Function(request.responseText)();
    } else {
      console.warn('No se pudo cargar js/seeds.js; demoMode se desactiva.');
    }
  } catch (err) {
    console.warn('Error al cargar seeds.js', err);
  }
})();

(function () {
  if (typeof window === 'undefined' || !window.localStorage || window.__DemoStoragePatched) return;
  const storageTarget = window.localStorage;
  const nativeGet = Storage.prototype.getItem;
  const nativeSet = Storage.prototype.setItem;
  const nativeRemove = Storage.prototype.removeItem;
  const DEMO_PREFIX = '__demo__';

  const SEED_LOADERS = {
    projectsync_projects() {
      return JSON.stringify((window.DemoSeeds && typeof window.DemoSeeds.getProjects === 'function'
        ? window.DemoSeeds.getProjects()
        : []) || []);
    },
    threadsync_threads() {
      return JSON.stringify((window.DemoSeeds && typeof window.DemoSeeds.getThreadListMap === 'function'
        ? window.DemoSeeds.getThreadListMap()
        : {}) || {});
    },
    clientsync_clients() {
      return JSON.stringify((window.DemoSeeds && typeof window.DemoSeeds.getClients === 'function'
        ? window.DemoSeeds.getClients()
        : []) || []);
    },
    projectDrafts() {
      return '[]';
    },
    usedIDSyncs() {
      return '[]';
    },
    lastIDSync() {
      return '1000';
    }
  };

  function isDemoMode() {
    return Boolean(window.DemoSeeds && typeof window.DemoSeeds.isEnabled === 'function' && window.DemoSeeds.isEnabled());
  }

  function overlayKey(key) {
    return `${DEMO_PREFIX}${key}`;
  }

  function hasLoader(key) {
    return Object.prototype.hasOwnProperty.call(SEED_LOADERS, key);
  }

  window.__DemoStoragePatched = true;

  Storage.prototype.getItem = function patchedGetItem(key) {
    if (this === storageTarget && isDemoMode() && hasLoader(key)) {
      const demoKey = overlayKey(key);
      const existing = nativeGet.call(this, demoKey);
      if (existing !== null) return existing;
      const seeds = SEED_LOADERS[key]();
      nativeSet.call(this, demoKey, seeds);
      return seeds;
    }
    return nativeGet.call(this, key);
  };

  Storage.prototype.setItem = function patchedSetItem(key, value) {
    if (this === storageTarget && isDemoMode() && hasLoader(key)) {
      return nativeSet.call(this, overlayKey(key), value);
    }
    return nativeSet.call(this, key, value);
  };

  Storage.prototype.removeItem = function patchedRemoveItem(key) {
    if (this === storageTarget && isDemoMode() && hasLoader(key)) {
      return nativeRemove.call(this, overlayKey(key));
    }
    return nativeRemove.call(this, key);
  };

  window.DemoMode = {
    isEnabled: () => isDemoMode(),
    set(enabled) {
      if (window.DemoSeeds && typeof window.DemoSeeds.setMode === 'function') {
        window.DemoSeeds.setMode(Boolean(enabled));
        window.dispatchEvent(new CustomEvent('demoModeChanged', { detail: { enabled: isDemoMode() } }));
      }
    },
    toggle() {
      if (window.DemoSeeds && typeof window.DemoSeeds.toggleMode === 'function') {
        window.DemoSeeds.toggleMode();
        window.dispatchEvent(new CustomEvent('demoModeChanged', { detail: { enabled: isDemoMode() } }));
      }
    }
  };
})();

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
