(function () {
  if (window.uiToast && window.uiConfirm) return;

  const STYLE_ID = 'ui-feedback-styles';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .ui-toast {
        position: fixed;
        top: 22px;
        right: 22px;
        z-index: 5000;
        background: var(--bg-card, #ffffff);
        border-radius: 12px;
        padding: 14px 16px;
        box-shadow: 0 18px 40px rgba(15,23,42,0.18);
        border: 2px solid #0f766e;
        color: var(--text-primary, #0f172a);
        font-weight: 600;
        min-width: 260px;
        max-width: 360px;
        transition: all 0.2s ease;
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }
      .ui-toast-success { border-color: #10b981; }
      .ui-toast-info { border-color: #0f766e; }
      .ui-toast-warning { border-color: #d97706; }
      .ui-toast-error { border-color: #dc2626; }
      .ui-toast-icon {
        width: 20px;
        height: 20px;
        flex: 0 0 20px;
      }
      .ui-confirm-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15,23,42,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5000;
        padding: 20px;
      }
      .ui-confirm-card {
        background: var(--bg-card, #ffffff);
        color: var(--text-primary, #0f172a);
        border-radius: 16px;
        border: 1px solid var(--border-color, #e2e8f0);
        padding: 22px;
        max-width: 420px;
        width: 100%;
        box-shadow: 0 25px 50px rgba(15,23,42,0.3);
      }
      .ui-confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 18px;
      }
      .ui-btn {
        border-radius: 10px;
        padding: 10px 16px;
        font-weight: 600;
        border: 1px solid #e2e8f0;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .ui-btn-primary {
        background: linear-gradient(135deg, #02735E, #035951);
        color: #fff;
        border: none;
      }
      .ui-btn-secondary {
        background: #f8fafc;
        color: #334155;
      }
    `;
    document.head.appendChild(style);
  }

  const icons = {
    success: '<path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    info: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    warning: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    error: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };

  function uiToast(type = 'info', message = '') {
    const toast = document.createElement('div');
    toast.className = `ui-toast ui-toast-${type}`;
    toast.innerHTML = `
      <svg class="ui-toast-icon" viewBox="0 0 24 24" fill="none">${icons[type] || icons.info}</svg>
      <div style="flex:1;">${message}</div>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  function uiConfirm(message, { confirmText = 'Confirmar', cancelText = 'Cancelar' } = {}) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'ui-confirm-overlay';
      overlay.innerHTML = `
        <div class="ui-confirm-card">
          <div style="font-size:15px; line-height:1.5;">${message}</div>
          <div class="ui-confirm-actions">
            <button class="ui-btn ui-btn-secondary" data-action="cancel">${cancelText}</button>
            <button class="ui-btn ui-btn-primary" data-action="confirm">${confirmText}</button>
          </div>
        </div>
      `;
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) {
          overlay.remove();
          resolve(false);
        }
      });
      overlay.querySelector('[data-action="cancel"]').onclick = () => {
        overlay.remove();
        resolve(false);
      };
      overlay.querySelector('[data-action="confirm"]').onclick = () => {
        overlay.remove();
        resolve(true);
      };
      document.body.appendChild(overlay);
    });
  }

  window.uiToast = uiToast;
  window.uiConfirm = uiConfirm;
})();
