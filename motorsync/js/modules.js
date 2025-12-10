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

/**
 * Modal standardizer (Verdi + Aire)
 * - Aplica estilo único, ARIA y foco inicial
 * - Fuerza type="button" para evitar envíos accidentales
 * - Cierra con ESC o clic fuera (si no se deshabilita)
 */
(function standardizeModals() {
  if (typeof document === 'undefined') return;

  const OVERLAY_SELECTORS = ['.invite-overlay', '.modal-overlay', '.ops-modal-overlay', '.modal-backdrop', '[data-modal-overlay]'];

  function isCandidateOverlay(node) {
    if (!(node instanceof HTMLElement)) return false;
    if (OVERLAY_SELECTORS.some((selector) => node.matches?.(selector))) return true;
    const cls = node.className || '';
    const id = node.id || '';
    return /modal|overlay/i.test(cls) || /modal|overlay/i.test(id);
  }

  function ensureButtonTypes(root) {
    root.querySelectorAll('button:not([type])').forEach((btn) => {
      btn.setAttribute('type', 'button');
    });
  }

  function focusInitial(dialog) {
    if (!dialog) return;
    const target = dialog.querySelector('[autofocus], input, select, textarea, button');
    (target || dialog).focus({ preventScroll: true });
  }

  function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove('active', 'open');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.dataset.open = 'false';
  }

  function isOpen(overlay) {
    if (!overlay) return false;
    const aria = overlay.getAttribute('aria-hidden') === 'false';
    const data = overlay.dataset.open === 'true';
    const classes = overlay.classList.contains('active') || overlay.classList.contains('open');
    const visible = overlay.style.display === 'flex' || overlay.style.display === 'block';
    return aria || data || classes || visible;
  }

  function upgradeOverlay(overlay) {
    if (!overlay || overlay.dataset.opsModalBound === 'true') return;
    overlay.dataset.opsModalBound = 'true';
    overlay.classList.add('ops-modal-overlay');
    if (!overlay.hasAttribute('aria-hidden')) overlay.setAttribute('aria-hidden', 'true');

    const dialog = overlay.querySelector('[role="dialog"]') ||
      overlay.querySelector('.invite-card') ||
      overlay.querySelector('.modal-card') ||
      overlay.querySelector('.modal-content') ||
      overlay.firstElementChild;

    if (dialog) {
      dialog.classList.add('ops-modal');
      if (!dialog.hasAttribute('role')) dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      if (!dialog.hasAttribute('tabindex')) dialog.tabIndex = -1;
      const heading = dialog.querySelector('h1, h2, h3');
      if (heading && !dialog.getAttribute('aria-labelledby')) {
        if (!heading.id) heading.id = `modal-title-${Date.now()}`;
        dialog.setAttribute('aria-labelledby', heading.id);
      }
    }

    ensureButtonTypes(overlay);

    const allowBackdrop = overlay.dataset.closeOnBackdrop !== 'false';
    if (allowBackdrop) {
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) {
          closeOverlay(overlay);
        }
      });
    }

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && isOpen(overlay)) {
        closeOverlay(overlay);
      }
    });

    let openState = isOpen(overlay);
    if (openState && dialog) {
      overlay.setAttribute('aria-hidden', 'false');
      focusInitial(dialog);
    }

    const observer = new MutationObserver(() => {
      const nowOpen = isOpen(overlay);
      if (nowOpen && !openState) {
        overlay.setAttribute('aria-hidden', 'false');
        focusInitial(dialog);
      } else if (!nowOpen && openState) {
        overlay.setAttribute('aria-hidden', 'true');
      }
      openState = nowOpen;
    });

    observer.observe(overlay, { attributes: true, attributeFilter: ['class', 'style', 'aria-hidden', 'data-open'] });
  }

  document.addEventListener('DOMContentLoaded', () => {
    OVERLAY_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach(upgradeOverlay);
    });
    document.querySelectorAll('[class*="modal"], [id*="Modal"], [id*="modal"]').forEach((node) => {
      if (isCandidateOverlay(node)) upgradeOverlay(node);
    });

    const domObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (isCandidateOverlay(node)) {
            upgradeOverlay(node);
          }
          OVERLAY_SELECTORS.forEach((selector) => {
            node.querySelectorAll?.(selector).forEach(upgradeOverlay);
          });
          node.querySelectorAll?.('[class*="modal"], [id*="Modal"], [id*="modal"]').forEach((candidate) => {
            if (isCandidateOverlay(candidate)) upgradeOverlay(candidate);
          });
        });
      });
    });
    if (document.body) {
      domObserver.observe(document.body, { childList: true, subtree: true });
    }
  });
})();
