# ✅ CHECKLIST: Agregar Nueva Página/Módulo

## 🚨 OBLIGATORIO - Siempre que agregues una nueva página

### 1. **Crear la página con estructura completa**
```html
<div class="app-shell">
  <!-- HEADER con logo + module tabs -->
  <header>
    <div class="logo">
      <div class="logo-text">
        <div class="logo-title">Opsis Suite</div>
        <div id="company-name-header">CVE San Diego</div>
      </div>
    </div>
    <div class="module-tabs">
      <!-- Todas las pestañas de módulos -->
    </div>
  </header>

  <div class="app-content-wrapper">
    <!-- SIDEBAR completo -->
    <aside>
      <!-- Todos los links de navegación -->
    </aside>

    <!-- MAIN CONTENT -->
    <main>
      <!-- Contenido de la página -->
    </main>
  </div>
</div>
```

### 2. **Agregar en module-tabs del HEADER** (si aplica)
Páginas que deben tener el link en tabs:
- [ ] motorsync.html (Dashboard principal)
- [ ] plansync.html
- [ ] projectsync.html
- [ ] threadsync-list.html / threadsync.html
- [ ] howsync.html
- [ ] analytics.html
- [ ] **[NUEVA PÁGINA]**

### 3. **Agregar en SIDEBAR de TODAS las páginas**
Archivos que DEBEN actualizarse:
- [ ] motorsync.html (Dashboard principal)
- [ ] plansync.html
- [ ] threadsync.html
- [ ] howsync.html (cuando tenga sidebar)
- [ ] analytics.html
- [ ] **[NUEVA PÁGINA]**

**Código para agregar en sidebar:**
```html
<a href="[nueva-pagina].html" class="sidebar-item">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <!-- Icono SVG apropiado -->
  </svg>
  <span>[Nombre del Módulo]</span>
</a>
```

### 4. **Ubicación en el sidebar**
Orden estándar:
1. Dashboard
2. PlanSync
3. ProjectSync
4. ThreadSync
5. HowSync
6. Analytics
7. **← Aquí va tu nueva página si es un módulo principal**
8. Clientes (divisor)
9. Management
10. Configuración (margin-top: auto)

---

## 📋 PÁGINAS ACTUALES

### Páginas CON sidebar completo:
- ✅ motorsync.html (Dashboard)
- ✅ plansync.html
- ✅ threadsync.html
- ✅ analytics.html

### Páginas SIN sidebar (diseño standalone):
- ❌ NotifySync.html (header simple, sin sidebar)
- ❌ ProjectSync.html (header simple, sin sidebar)
- ❌ TimeSync.html (header simple, sin sidebar)

### Páginas pendientes de implementar sidebar:
- ⏳ howsync.html (existe pero sin sidebar completo)

---

## 🔧 PATRÓN DE SIDEBAR ESTÁNDAR

```html
<aside>
  <a href="motorsync.html" class="sidebar-item [active si es dashboard]">
    <svg><!-- Dashboard icon --></svg>
    <span>Dashboard</span>
  </a>

  <a href="plansync.html" class="sidebar-item">
    <svg><!-- Calendar icon --></svg>
    <span>PlanSync</span>
  </a>

  <a href="projectsync.html" class="sidebar-item">
    <svg><!-- Project icon --></svg>
    <span>ProjectSync</span>
  </a>

  <a href="threadsync-list.html" class="sidebar-item">
    <svg><!-- Message icon --></svg>
    <span>ThreadSync</span>
  </a>

  <a href="howsync.html" class="sidebar-item">
    <svg><!-- Broadcast icon --></svg>
    <span>HowSync</span>
  </a>

  <a href="analytics.html" class="sidebar-item">
    <svg><!-- Chart icon --></svg>
    <span>Analytics</span>
  </a>

  <!-- AQUÍ VA TU NUEVA PÁGINA -->

  <div class="sidebar-item" onclick="window.location.href='motorsync.html'">
    <svg><!-- Users icon --></svg>
    <span>Clientes</span>
  </div>

  <div class="sidebar-item" onclick="window.location.href='motorsync.html'">
    <svg><!-- Dollar icon --></svg>
    <span>Management</span>
  </div>

  <div class="sidebar-item" onclick="window.location.href='motorsync.html'" style="margin-top: auto;">
    <svg><!-- Settings icon --></svg>
    <span>Configuración</span>
  </div>
</aside>
```

---

## ⚠️ ERRORES COMUNES A EVITAR

### ❌ NO HACER:
1. Crear página sin sidebar cuando otras lo tienen
2. Olvidar agregar el link en otras páginas
3. Agregar solo en algunas páginas (debe ser en TODAS)
4. Usar nombres de archivo inconsistentes
5. Olvidar marcar como `active` en su propia página

### ✅ SÍ HACER:
1. Copiar estructura completa de plansync.html o threadsync.html
2. Agregar link en TODAS las páginas con sidebar
3. Probar navegación desde todas las páginas
4. Usar nomenclatura consistente (lowercase, sin espacios)
5. Documentar la nueva página en README.md

---

## 🎯 COMANDOS DE VERIFICACIÓN

```bash
# Buscar si el link existe en todas las páginas
cd /Users/candewesth/Documents/GitHub/opsis-suite/motorsync
grep -n "nueva-pagina.html" motorsync.html plansync.html threadsync.html analytics.html

# Verificar estructura de sidebar
grep -A 50 "<aside" nueva-pagina.html

# Contar links en sidebar (debe ser >= 8)
grep -c "sidebar-item" nueva-pagina.html
```

---

## 📝 NOTAS

**Última actualización:** 29 de noviembre de 2025

**Incidente que motivó este checklist:**
- Analytics se creó sin sidebar → páginas huérfanas
- ThreadSync y PlanSync no tenían link a Analytics
- Navegación rota entre módulos

**Commit del fix:** 26d1df8 - "Fix: Analytics sidebar + links en todas páginas"

---

## 🚀 PROCESO RECOMENDADO

1. Crear nueva página desde cero O copiar plansync.html como base
2. Ejecutar búsqueda global: `grep -r "sidebar-item" motorsync/*.html`
3. Identificar TODAS las páginas con sidebar
4. Agregar link en cada una
5. Probar navegación completa
6. Commit con mensaje descriptivo
7. Actualizar este checklist si es necesario
