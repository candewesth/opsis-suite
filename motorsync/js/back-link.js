(function () {
  const FALLBACK_URL = 'motorsync.html';

  function sanitizeTarget(raw, fallback = '') {
    if (!raw && raw !== 0) return fallback;
    const trimmed = String(raw).trim();
    if (!trimmed) return fallback;

    if (/^(https?:|\/\/)/i.test(trimmed)) {
      try {
        const url = new URL(trimmed, window.location.href);
        const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : url.origin;
        if (origin && url.origin !== origin) return fallback;
        const path = url.pathname ? url.pathname.split('/').pop() || '' : '';
        const relative = path || FALLBACK_URL;
        return `${relative}${url.search || ''}${url.hash || ''}`;
      } catch (err) {
        return fallback;
      }
    }

    if (/^[A-Za-z0-9_.\-\/]+(\?[A-Za-z0-9_.\-\/&=%]*)?(#[A-Za-z0-9_.\-\/&=%]*)?$/.test(trimmed)) {
      return trimmed;
    }
    return fallback;
  }

  function splitUrl(raw) {
    const [beforeHash, hashPart = ''] = raw.split('#');
    const [pathPart, queryPart = ''] = beforeHash.split('?');
    return {
      path: pathPart || FALLBACK_URL,
      query: queryPart,
      hash: hashPart ? `#${hashPart}` : '',
    };
  }

  const queryParams = new URLSearchParams(window.location.search);
  const inboundRaw = queryParams.get('returnTo');
  const inboundTarget = sanitizeTarget(inboundRaw, '');
  const activeReturnTarget = inboundTarget || FALLBACK_URL;

  function buildLink(base, extras = {}, options = {}) {
    const sanitizedBase = base && typeof base === 'string' ? base : FALLBACK_URL;
    const { path, query, hash } = splitUrl(sanitizedBase);
    const params = new URLSearchParams(query || '');
    Object.entries(extras || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      params.set(key, value);
    });
    if (!params.has('returnTo')) {
      const override = options && options.overrideReturn ? sanitizeTarget(options.overrideReturn, '') : '';
      const target = override || inboundTarget || FALLBACK_URL;
      if (target) {
        params.set('returnTo', target);
      }
    }
    const finalQuery = params.toString();
    return `${path}${finalQuery ? `?${finalQuery}` : ''}${hash}`;
  }

  function getExtrasFromDataset(node) {
    const extras = {};
    Array.from(node.attributes).forEach((attr) => {
      if (attr.name.startsWith('data-return-param-')) {
        const key = attr.name.replace('data-return-param-', '');
        extras[key] = attr.value;
      }
    });
    return extras;
  }

  function bindReturnButtons() {
    document.querySelectorAll('[data-return-target]').forEach((el) => {
      if (el.dataset.returnBound === 'true') return;
      const fallback = sanitizeTarget(el.dataset.returnTarget, FALLBACK_URL);
      const destination = inboundTarget || fallback || FALLBACK_URL;
      const handler = (event) => {
        event.preventDefault();
        window.location.href = destination;
      };
      if (el.tagName === 'A') {
        el.setAttribute('href', destination);
      }
      el.addEventListener('click', handler);
      el.dataset.returnBound = 'true';
    });
  }

  function bindKeepReturnLinks() {
    document.querySelectorAll('[data-keep-return]').forEach((node) => {
      if (node.dataset.keepReturnBound === 'true') return;
      const attrValue = node.getAttribute('data-keep-return');
      const base = attrValue && attrValue !== '' ? attrValue : node.getAttribute('href') || '';
      if (!base) return;
      const extras = getExtrasFromDataset(node);
      const finalUrl = buildLink(base, extras);
      if (node.tagName === 'A') {
        node.setAttribute('href', finalUrl);
      } else {
        node.addEventListener('click', (event) => {
          if (node.tagName === 'BUTTON') event.preventDefault();
          window.location.href = finalUrl;
        });
      }
      node.dataset.keepReturnBound = 'true';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindReturnButtons();
    bindKeepReturnLinks();
  });

  window.ReturnNav = {
    fallback: FALLBACK_URL,
    raw: inboundRaw,
    resolved: activeReturnTarget,
    sanitize: sanitizeTarget,
    buildLink,
    navigate(base, extras = {}, options = {}) {
      window.location.href = buildLink(base, extras, options);
    },
    append(url, extras = {}, options = {}) {
      return buildLink(url, extras, options);
    },
    getReturnTarget() {
      return inboundTarget || FALLBACK_URL;
    },
  };
})();
