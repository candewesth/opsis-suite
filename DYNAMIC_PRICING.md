# 🎯 Sistema de Precios Dinámico - Opsis Suite

## Visión General

Se ha implementado un **sistema de precios completamente dinámico** que se adapta automáticamente según el sistema de negocio seleccionado (Plomería, Jardinería, Logística, Mudanza).

---

## 🏗️ Arquitectura

### Estructura de Archivos

```
opsis-suite/
├── pricing.html              ← Página principal de precios (dinámica)
└── js/
    └── pricing-config.js     ← Configuración centralizada de precios
```

### Flujo de Datos

```
Usuario selecciona Sistema
        ↓
selectSystem() se ejecuta
        ↓
Actualiza variables CSS (colores)
        ↓
renderPricingCards() regenera tarjetas
        ↓
UI se actualiza en tiempo real
```

---

## 💰 Estructura de Precios por Sistema

### 1. **PLOMERÍA** 🚰
```javascript
{
    Básico:        $29/mes   (1 usuario)
    Profesional:   $79/mes   (5 usuarios)
    Empresarial:   $149/mes  (15 usuarios)
    Premium:       $299/mes  (∞ usuarios)
}
```

### 2. **JARDINERÍA** 🌿
```javascript
{
    Básico:        $25/mes   (1 usuario)
    Profesional:   $65/mes   (5 usuarios)
    Empresarial:   $125/mes  (15 usuarios)
    Premium:       $249/mes  (∞ usuarios)
}
```

### 3. **LOGÍSTICA** 📦
```javascript
{
    Básico:        $35/mes   (1 usuario)
    Profesional:   $89/mes   (5 usuarios)
    Empresarial:   $169/mes  (15 usuarios)
    Premium:       $329/mes  (∞ usuarios)
}
```

### 4. **MUDANZA** 🚚
```javascript
{
    Básico:        $31/mes   (1 usuario)
    Profesional:   $81/mes   (5 usuarios)
    Empresarial:   $151/mes  (15 usuarios)
    Premium:       $301/mes  (∞ usuarios)
}
```

---

## 🎨 Colores por Sistema

| Sistema | Color Claro | Color Oscuro |
|---------|-------------|-------------|
| Plomería | #0066cc (Azul) | #0052a3 |
| Jardinería | #00aa44 (Verde) | #008a3a |
| Logística | #ff8800 (Naranja) | #dd7000 |
| Mudanza | #cc00ff (Púrpura) | #9900cc |

---

## 🔧 Cómo Funciona

### 1. **pricing-config.js** - Configuración Centralizada

```javascript
const pricingConfig = {
    plomeria: {
        name: "Plomería",
        icon: "🚰",
        color: "#0066cc",
        colorDark: "#0052a3",
        plans: {
            basic: {
                name: "Básico",
                price: 29,
                users: 1,
                features: [...]
            },
            // ... otros planes
        }
    },
    // ... otros sistemas
}
```

### 2. **pricing.html** - Página Dinámica

**Selector de Sistemas:**
```html
<button class="system-btn active" onclick="selectSystem('plomeria')">🚰 Plomería</button>
<button class="system-btn" onclick="selectSystem('jardineria')">🌿 Jardinería</button>
<button class="system-btn" onclick="selectSystem('logistica')">📦 Logística</button>
<button class="system-btn" onclick="selectSystem('mudanza')">🚚 Mudanza</button>
```

**Contenedor de Tarjetas:**
```html
<div class="pricing-grid" id="pricing-grid">
    <!-- Tarjetas generadas dinámicamente aquí -->
</div>
```

### 3. **JavaScript** - Lógica Dinámica

```javascript
function selectSystem(system) {
    currentSystem = system;
    
    // 1. Actualizar botones activos
    document.querySelectorAll('.system-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // 2. Actualizar variables CSS
    const colors = systemColors[system];
    document.documentElement.style.setProperty('--system-color', colors.color);

    // 3. Actualizar header
    const config = pricingConfig[system];
    document.getElementById('logo-icon').textContent = config.icon;
    document.getElementById('logo-text').textContent = `Opsis ${config.name}`;

    // 4. Renderizar tarjetas
    renderPricingCards();
}
```

---

## 🎯 Rendimiento de Tarjetas

### Función `renderPricingCards()`

```javascript
function renderPricingCards() {
    const config = pricingConfig[currentSystem];
    const grid = document.getElementById('pricing-grid');
    grid.innerHTML = ''; // Limpiar
    
    // Para cada plan del sistema actual
    config.plans.forEach((plan) => {
        // Crear tarjeta con precio específico del sistema
        // Aplicar colores del sistema
        // Agregar características del plan
    });
}
```

**Ventajas:**
- ✅ Sin recarga de página
- ✅ Transición suave
- ✅ Renderización en tiempo real
- ✅ Fácil de mantener

---

## 🌐 Características Dinámicas

### 1. **Header Dinámico**
```
Antes: [Opsis Suite]
Después: [🚰 Opsis Plomería] (al seleccionar Plomería)
         [🌿 Opsis Jardinería] (al seleccionar Jardinería)
         etc.
```

### 2. **Colores Dinámicos**
```css
/* Variable CSS actualizada en tiempo real */
:root {
    --system-color: #0066cc; /* Cambios según selección */
}

.cta-button {
    background: linear-gradient(135deg, var(--system-color), ...);
}
```

### 3. **Tarjetas Actualizadas**
```
✓ Precio cambias automáticamente
✓ Cantidad de usuarios cambia
✓ Características específicas del sistema
✓ Colores del botón CTA
```

---

## 📱 Responsividad

### Mobile
- Selector de sistemas: Stack vertical
- Tarjetas: 1 columna
- Fuentes: Adaptadas
- Espaciado: Comprimido

### Tablet/Desktop
- Selector: Horizontal
- Tarjetas: 4 columnas (o grid automático)
- Fuentes: Normales
- Espaciado: Amplio

---

## 🌙 Dark Mode

La página soporta **dark mode completo**:

- ✅ Toggle de tema
- ✅ Persistencia en localStorage
- ✅ Estilos adaptados para dark mode
- ✅ Colores legibles en ambos modos
- ✅ Carga automática del tema guardado

---

## 🔄 Cómo Agregar un Nuevo Sistema

### Paso 1: Agregar a `pricing-config.js`

```javascript
const pricingConfig = {
    // ... sistemas existentes
    nuevosistema: {
        name: "Nuevo Sistema",
        icon: "🆕",
        color: "#ff0000",
        colorDark: "#cc0000",
        plans: {
            basic: { price: 25, ... },
            // ... otros planes
        }
    }
};
```

### Paso 2: Agregar a `systemColors`

```javascript
const systemColors = {
    // ... colores existentes
    nuevosistema: { color: '#ff0000', dark: '#cc0000' }
};
```

### Paso 3: Agregar botón en HTML

```html
<button class="system-btn" onclick="selectSystem('nuevosistema')">🆕 Nuevo Sistema</button>
```

---

## 📊 Modificar Precios

### Opción 1: Directo en `pricing-config.js`

```javascript
plomeria: {
    plans: {
        basic: {
            price: 29 → 35  // Cambiar precio
        }
    }
}
```

### Opción 2: Desde una API (Futuro)

```javascript
// Podría conectarse a una API para precios dinámicos
fetch('/api/pricing/plomeria')
    .then(res => res.json())
    .then(data => {
        pricingConfig.plomeria = data;
        renderPricingCards();
    });
```

---

## ✨ Características Técnicas

### Ventajas del Sistema

1. **Modular** - Configuración separada
2. **Escalable** - Fácil agregar nuevos sistemas
3. **Mantenible** - Cambios en un solo lugar
4. **Dinámico** - Sin recarga de página
5. **Performante** - Renderización eficiente
6. **Responsive** - Funciona en todos los dispositivos

### Stack Tecnológico

- HTML5 (Semántico)
- CSS3 (Variables, Grid, Flexbox)
- Vanilla JavaScript (Sin dependencias)
- localStorage (Persistencia de tema)

---

## 🚀 Roadmap Futuro

- [ ] **API Integration** - Obtener precios de backend
- [ ] **Descuentos Dinámicos** - Ofertas por volumen
- [ ] **Moneda Local** - Cambio automático de moneda
- [ ] **Comparador de Planes** - Herramienta visual
- [ ] **Historial de Cambios** - Analytics de selecciones
- [ ] **Test A/B** - Variaciones de precios
- [ ] **Cálculo ROI** - Estimaciones personalizadas

---

## 📈 Análisis de Precios

### Estrategia Actual

```
Plomería:   $29 → $299  (Rango: $270, Factor: 10.3x)
Jardinería: $25 → $249  (Rango: $224, Factor: 9.96x)
Logística:  $35 → $329  (Rango: $294, Factor: 9.4x)
Mudanza:    $31 → $301  (Rango: $270, Factor: 9.7x)
```

### Incrementos de Tier

```
Opal → Profesional:  +$50-65 (Promedio: +$54)
Profesional → Empresarial: +$60-84 (Promedio: +$72)
Empresarial → Premium: +$100-180 (Promedio: +$150)
```

---

## 🎓 Documentación

Para usuarios:
- Visitar `http://localhost:9001/pricing.html`
- Seleccionar su sistema de negocio
- Ver precios ajustados automáticamente

Para desarrolladores:
- Ver `js/pricing-config.js` para configuración
- Ver `pricing.html` para implementación
- Este documento para arquitectura

---

**Última actualización:** Noviembre 12, 2025  
**Versión:** 2.0 (Dynamic)  
**Status:** ✅ En Producción
