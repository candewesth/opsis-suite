# Debug Notes - Dashboard Click Issue

## Problema
Cuando haces clic en "Dashboard" en el sidebar, se muestra la vista antigua del dashboard (sin header con pestaña MotorSync, sin ProjectSync/ThreadSync en sidebar).

## Cambios Realizados

### 1. Estructura HTML del Sidebar
```html
<!-- Dashboard es ahora un <a> tag, no <div> -->
<a href="motorsync.html" class="sidebar-item active" data-nav="page">
  <svg>...</svg>
  <span>Dashboard</span>
</a>

<!-- ProjectSync y ThreadSync también son <a> tags -->
<a href="projectsync.html" class="sidebar-item" data-nav="page">...</a>
<a href="threadsync-list.html" class="sidebar-item" data-nav="page">...</a>

<!-- Items de SPA siguen siendo <div> con data-page -->
<div class="sidebar-item" data-page="customers">...</div>
<div class="sidebar-item" data-page="management">...</div>
```

### 2. JavaScript Event Listener (línea ~10142)
```javascript
document.querySelectorAll('.sidebar-item').forEach((item) => {
  // Skip navigation links - they handle their own navigation
  if (item.hasAttribute('data-nav') || item.tagName === 'A') {
    console.log('✓ Skipping navigation link:', item.textContent.trim());
    return;
  }
  
  // Solo para <div> con data-page
  if (item.dataset.external) {
    item.addEventListener('click', () => {
      window.location.href = item.dataset.external;
    });
  } else if (item.dataset.page) {
    item.addEventListener('click', () => {
      this.showPage(item.dataset.page);
    });
  }
});
```

### 3. Layout CSS (línea ~41-73)
```css
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  flex: 1;
}
```

## Posibles Causas del Problema

### 1. Event Bubbling
El click en el `<a>` tag podría estar siendo capturado por un parent element antes de llegar al link.

### 2. preventDefault en otro lugar
Podría haber otro event listener que está llamando `preventDefault()`.

### 3. Cache del navegador
El navegador podría estar cacheando el JavaScript antiguo.

### 4. CSS pointer-events
Algún elemento encima del link podría tener `pointer-events: auto` bloqueando el click.

### 5. SPA Routing Conflict
La función `showPage()` podría estar siendo llamada de todas formas a pesar del `return`.

## Tests a Realizar en MacBook

### Test 1: Verificar Console Logs
Abrir DevTools (F12) y verificar que aparezca:
```
✓ Skipping navigation link: Dashboard
✓ Skipping navigation link: ProjectSync
✓ Skipping navigation link: ThreadSync
```

### Test 2: Hard Refresh
- Chrome/Edge: Ctrl+Shift+R (Cmd+Shift+R en Mac)
- Firefox: Ctrl+F5
- Safari: Cmd+Option+R

### Test 3: Disable Cache
En DevTools > Network tab > marcar "Disable cache"

### Test 4: Inspect Element
Hacer right-click en "Dashboard" > Inspect y verificar:
- Tag es `<a>` (no `<div>`)
- Tiene atributo `href="motorsync.html"`
- Tiene atributo `data-nav="page"`

### Test 5: Add Explicit Event Handler
Agregar esto temporalmente después del forEach (línea ~10170):
```javascript
document.querySelector('a.sidebar-item[href="motorsync.html"]')?.addEventListener('click', (e) => {
  console.log('Direct dashboard click handler');
  // No preventDefault - dejar que navegue normalmente
});
```

## Soluciones Alternativas

### Opción 1: Usar onclick inline
```html
<a href="motorsync.html" class="sidebar-item active" onclick="return true;">
```

### Opción 2: Eliminar clase .sidebar-item de los links
```html
<a href="motorsync.html" class="nav-link active">
```

### Opción 3: Agregar stopPropagation explícito
```javascript
if (item.tagName === 'A') {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
  }, true); // useCapture = true
  return;
}
```

### Opción 4: Refactor completo - separar selectores
```javascript
// Solo para SPA navigation
document.querySelectorAll('.sidebar-item[data-page]').forEach((item) => {
  item.addEventListener('click', () => {
    this.showPage(item.dataset.page);
  });
});

// Links normales no necesitan listeners
```

## Archivos Modificados
- `dashboard/motorsync.html` (líneas 41-73, 4111-4175, 10142-10170)
- `dashboard/projectsync.html` (nuevo)
- `dashboard/threadsync-list.html` (nuevo)
- `dashboard/threadsync.html` (renombrado de threadsync-detail.html)
- `MODULE_ARCHITECTURE.md` (nuevo)

## Ubicación del Bug
**Archivo:** `/workspaces/opsis-suite/dashboard/motorsync.html`
**Líneas críticas:**
- 4113: `<a href="motorsync.html" class="sidebar-item active" data-nav="page">`
- 10142-10170: Event listener forEach que debe ignorar este elemento
- 16289: `showPage()` function que cambia las vistas internas

## Siguiente Sesión
1. Pull latest changes: `git pull origin main`
2. Abrir `http://localhost:8001/dashboard/motorsync.html` en browser limpio
3. Verificar console logs
4. Probar las soluciones alternativas listadas arriba
