# ✅ Testing Checklist - Opsis Suite

## 📋 Tabla de Contenidos
- [Navegación y UI](#navegación-y-ui)
- [Funcionalidades Core](#funcionalidades-core)
- [Sistema de Reportes](#sistema-de-reportes)
- [Sistema de Integraciones](#sistema-de-integraciones)
- [Notificaciones](#notificaciones)
- [Responsive Design](#responsive-design)
- [Performance](#performance)
- [Seguridad](#seguridad)

---

## 🧭 Navegación y UI

### Sidebar Navigation
- [ ] **Íconos consistentes** - Todos los íconos son 20px × 20px
- [ ] **Links funcionan** - Cada link del sidebar navega correctamente
- [ ] **Analytics link presente** - Todas las páginas tienen acceso a Analytics
- [ ] **Hover states** - Los links cambian color al pasar el mouse
- [ ] **Active state** - El link activo se muestra destacado

**Páginas a verificar:**
- [ ] motorsync.html
- [ ] plansync.html
- [ ] projectsync.html
- [ ] threadsync.html
- [ ] threadsync-list.html
- [ ] analytics.html

### Hash Navigation (SPA)
- [ ] **Desde Analytics → Clientes** - `analytics.html` → click "Clientes" → abre `motorsync.html#customers`
- [ ] **Desde Analytics → Management** - `analytics.html` → click "Management" → abre `motorsync.html#management`
- [ ] **Desde Analytics → Configuración** - `analytics.html` → click "Configuración" → abre `motorsync.html#settings`
- [ ] **Hash detectado al cargar** - Abrir `motorsync.html#customers` directamente muestra sección de clientes
- [ ] **Sin doble click** - La navegación funciona al primer click (bug anterior corregido)

**Escenarios:**
```
1. Estar en analytics.html
2. Click en "Clientes" en sidebar
3. Verificar: Se abre motorsync.html Y la sección Clientes está visible
4. Repetir para Management y Configuración
```

### Elementos Visuales
- [ ] **Logo Verdi** - Se muestra correctamente en todas las páginas
- [ ] **Colores consistentes** - Verde Verdi (#02735E) usado apropiadamente
- [ ] **Tipografía** - Fuentes cargan correctamente
- [ ] **Spacing** - Márgenes y padding consistentes
- [ ] **Alineación** - Elementos alineados correctamente

---

## ⚙️ Funcionalidades Core

### MotorSync (motorsync.html)
- [ ] **Dashboard carga** - Página principal se muestra correctamente
- [ ] **Clientes** - Sección de clientes funcional
  - [ ] Ver lista de clientes
  - [ ] Buscar clientes
  - [ ] Abrir detalle de cliente
  - [ ] Crear nuevo cliente
- [ ] **Management** - Sección de gestión funcional
  - [ ] Ver equipos
  - [ ] Gestionar roles
  - [ ] Configurar permisos
- [ ] **Configuración** - Sección de settings funcional
  - [ ] Perfil de usuario
  - [ ] Notificaciones
  - [ ] Integraciones

### PlanSync
- [ ] **Calendario** - Vista de calendario se muestra
- [ ] **Eventos** - Crear/editar/eliminar eventos
- [ ] **Vistas** - Cambiar entre día/semana/mes
- [ ] **Asignaciones** - Asignar recursos a eventos

### ProjectSync
- [ ] **Lista de proyectos** - Proyectos se muestran correctamente
- [ ] **Filtros** - Filtrar por estado, cliente, fecha
- [ ] **Mapa** - Vista de mapa con ubicaciones
- [ ] **Detalle** - Abrir detalle de proyecto
- [ ] **CRUD** - Crear, leer, actualizar, eliminar proyectos

### ThreadSync
- [ ] **Lista de threads** - Oportunidades se muestran
- [ ] **Estados** - Cambiar estado de thread
- [ ] **Notas** - Agregar/editar notas
- [ ] **Archivos** - Adjuntar documentos
- [ ] **Conversión** - Convertir thread a proyecto

---

## 📊 Sistema de Reportes

### Generación de Reportes (analytics.html)

#### Reportes PDF
- [ ] **Reporte de Desempeño**
  - [ ] Seleccionar "Desempeño" en dropdown
  - [ ] Elegir fechas inicio y fin
  - [ ] Seleccionar formato "PDF"
  - [ ] Click "Generar Reporte"
  - [ ] Verificar descarga: `reporte_desempeño_YYYYMMDD_HHMMSS.pdf`
  - [ ] Abrir PDF y verificar:
    - [ ] Header verde Verdi (RGB: 2, 115, 94)
    - [ ] Título "Reporte de Desempeño"
    - [ ] Período de fechas correcto
    - [ ] Tabla con 5 métricas
    - [ ] Resumen ejecutivo de 4 líneas
    - [ ] Formato profesional

- [ ] **Reporte de Proyectos**
  - [ ] Seleccionar "Proyectos"
  - [ ] Generar PDF
  - [ ] Verificar:
    - [ ] 5 proyectos en tabla
    - [ ] Columnas: Proyecto, Cliente, Estado, Progreso, Entrega
    - [ ] Resumen con estadísticas de proyectos

- [ ] **Reporte de Ingresos**
  - [ ] Seleccionar "Ingresos"
  - [ ] Generar PDF
  - [ ] Verificar:
    - [ ] 5 categorías financieras
    - [ ] Comparación mes actual vs anterior
    - [ ] Tendencias (↑↓)
    - [ ] Resumen financiero

- [ ] **Reporte de Equipo**
  - [ ] Seleccionar "Equipo"
  - [ ] Generar PDF
  - [ ] Verificar:
    - [ ] 5 miembros del equipo
    - [ ] Roles, proyectos activos, horas/semana
    - [ ] Ratings con estrellas
    - [ ] Resumen de capacidad

#### Reportes Excel/CSV
- [ ] **Exportar a Excel**
  - [ ] Seleccionar cualquier tipo de reporte
  - [ ] Elegir formato "Excel"
  - [ ] Click "Generar Reporte"
  - [ ] Verificar descarga: `reporte_tipo_YYYYMMDD_HHMMSS.csv`
  - [ ] Abrir en Excel/Numbers/Google Sheets
  - [ ] Verificar:
    - [ ] Datos en formato CSV correcto
    - [ ] Columnas separadas por comas
    - [ ] Headers presentes
    - [ ] Datos legibles

- [ ] **Exportar a CSV**
  - [ ] Seleccionar formato "CSV"
  - [ ] Generar y descargar
  - [ ] Abrir en editor de texto
  - [ ] Verificar formato CSV válido

#### Programación de Reportes
- [ ] **Abrir modal**
  - [ ] Click en "Programar Reporte"
  - [ ] Modal se abre correctamente
- [ ] **Configurar programación**
  - [ ] Seleccionar tipo de reporte
  - [ ] Elegir frecuencia (Diario/Semanal/Mensual)
  - [ ] Ingresar email de destino
  - [ ] Click "Programar"
  - [ ] Verificar notificación de confirmación

---

## 🔌 Sistema de Integraciones

### IntegrationsManager (integrations.js)

#### Verificar Carga
- [ ] **Script cargado** - Abrir console: `window.IntegrationsManager` existe
- [ ] **Clase disponible** - Puede instanciar: `new IntegrationsManager()`
- [ ] **localStorage** - Lee/escribe en `opsis_integrations` y `opsis_webhooks`

#### Email (SendGrid)
```javascript
// Test en console:
const im = new IntegrationsManager();
im.enableIntegration('email', 'SG.test_api_key');
im.sendEmail('test@example.com', 'Test Subject', 'Test Body', [])
  .then(result => console.log('Email result:', result));
```
- [ ] **Activar integración** - `enableIntegration('email', 'api_key')` retorna true
- [ ] **Enviar email** - Mock retorna `{ success: true, messageId: 'msg_...' }`
- [ ] **Desactivar** - `disableIntegration('email')` funciona
- [ ] **Estado** - `getStatus().email.enabled` refleja estado correcto

#### WhatsApp (Twilio)
```javascript
im.enableIntegration('whatsapp', 'ACxxxx:authtoken');
im.sendWhatsApp('+1234567890', 'Hola desde Opsis', null)
  .then(result => console.log('WhatsApp result:', result));
```
- [ ] **Activar** - Integration habilitada
- [ ] **Enviar mensaje** - Mock retorna `{ success: true, sid: 'SM...' }`
- [ ] **Con media** - Probar con URL de imagen
- [ ] **Verificar delay** - Respuesta toma ~1 segundo (mock)

#### Calendar (Google)
```javascript
im.enableIntegration('calendar', 'calendar_api_key');
const event = {
  title: 'Reunión de Proyecto',
  start: '2025-11-15T10:00:00',
  end: '2025-11-15T11:00:00',
  description: 'Revisión semanal',
  attendees: ['juan@example.com']
};
im.createCalendarEvent(event)
  .then(result => console.log('Calendar result:', result));
```
- [ ] **Crear evento** - Retorna `{ success: true, eventId: '...' }`
- [ ] **Obtener eventos** - `getCalendarEvents(start, end)` retorna array de 3 eventos
- [ ] **Fechas válidas** - Formato ISO correcto

#### Payments (Stripe)
```javascript
im.enableIntegration('payments', 'sk_test_xxx');
im.createPaymentIntent(5000, 'mxn')
  .then(pi => {
    console.log('Payment Intent:', pi);
    return im.processPayment('pm_test_xxx', 5000);
  })
  .then(result => console.log('Payment result:', result));
```
- [ ] **Payment Intent** - Retorna `{ clientSecret: 'pi_...' }`
- [ ] **Process payment** - 90% retorna success, 10% falla (random)
- [ ] **Error handling** - Manejar rechazo de tarjeta
- [ ] **Monto correcto** - Amount se pasa correctamente

#### SMS (Twilio)
```javascript
im.enableIntegration('sms', 'ACxxxx:authtoken');
im.sendSMS('+1234567890', 'Código de verificación: 123456')
  .then(result => console.log('SMS result:', result));
```
- [ ] **Enviar SMS** - Retorna `{ success: true, sid: 'SM...' }`
- [ ] **Delay** - Simulación de ~1 segundo

#### Webhooks
```javascript
im.registerWebhook('project.created', 'https://example.com/webhook', 'secret_key')
  .then(webhook => console.log('Webhook registered:', webhook));

im.triggerWebhook('project.created', { projectId: 123, name: 'Nuevo Proyecto' })
  .then(results => console.log('Webhook results:', results));
```
- [ ] **Registrar webhook** - Genera `whsec_` secret automático
- [ ] **Almacenar** - Se guarda en localStorage `opsis_webhooks`
- [ ] **Trigger** - Envía a todos los webhooks registrados para ese evento
- [ ] **Multi-webhook** - Puede haber varios webhooks para un evento
- [ ] **Verificar secret** - Secret incluido en payload

#### Persistencia
- [ ] **localStorage escribe** - Cambios se guardan automáticamente
- [ ] **localStorage lee** - Al recargar página, configuración persiste
- [ ] **Verificar en DevTools** - Application → Local Storage → `opsis_integrations`, `opsis_webhooks`

---

## 🔔 Notificaciones

### NotifyManager (test-notifications.html)
- [ ] **Página carga** - `test-notifications.html` abre correctamente
- [ ] **Tipos de notificaciones**
  - [ ] Success (verde)
  - [ ] Error (rojo)
  - [ ] Warning (amarillo)
  - [ ] Info (azul)
- [ ] **Canales**
  - [ ] In-App (toast)
  - [ ] Email (mock)
  - [ ] SMS (mock)
  - [ ] WhatsApp (mock)
  - [ ] Push (mock)
- [ ] **Test buttons** - Cada botón genera notificación apropiada
- [ ] **Auto-dismiss** - Notificaciones desaparecen después de 5 segundos
- [ ] **Manual dismiss** - Click en X cierra notificación
- [ ] **Stack** - Múltiples notificaciones se apilan correctamente

---

## 📱 Responsive Design

### Breakpoints
- [ ] **Desktop (>1200px)** - Layout completo con sidebar
- [ ] **Tablet (768px-1200px)** - Sidebar colapsa a íconos
- [ ] **Mobile (<768px)** - Sidebar se oculta, menú hamburguesa

### Elementos a Verificar
- [ ] **Sidebar** - Se adapta en móvil
- [ ] **Tablas** - Scroll horizontal en móvil
- [ ] **Formularios** - Inputs de ancho completo
- [ ] **Modals** - Centrados y responsivos
- [ ] **Charts** - Redimensionan apropiadamente
- [ ] **Maps** - Funcionan en touch devices

### Test en Dispositivos
- [ ] **iPhone (Safari)** - iOS Safari 15+
- [ ] **Android (Chrome)** - Android Chrome
- [ ] **iPad (Safari)** - Tablet landscape/portrait
- [ ] **Desktop** - Chrome, Firefox, Safari, Edge

---

## ⚡ Performance

### Tiempos de Carga
- [ ] **Página inicial** - Carga en <3 segundos
- [ ] **Navegación** - Transiciones <500ms
- [ ] **PDF generation** - Genera en <2 segundos para reportes estándar
- [ ] **Charts** - Renderiza en <1 segundo

### Recursos
- [ ] **JavaScript** - Total bundle <500KB
- [ ] **CSS** - Total styles <100KB
- [ ] **Images** - Optimizadas y lazy loading
- [ ] **Fonts** - Cargadas eficientemente

### Browser Console
- [ ] **Sin errores** - Console limpio sin errors
- [ ] **Sin warnings críticos** - Warnings menores aceptables
- [ ] **Network tab** - Todos los recursos cargan (status 200)
- [ ] **Memory leaks** - Sin crecimiento descontrolado de memoria

---

## 🔒 Seguridad

### Autenticación
- [ ] **Login funciona** - Credenciales válidas permiten acceso
- [ ] **Login falla** - Credenciales inválidas bloquean acceso
- [ ] **Session** - Mantiene sesión al recargar
- [ ] **Logout** - Cierra sesión correctamente

### Protección de Datos
- [ ] **API Keys ocultos** - No se exponen en código frontend
- [ ] **localStorage** - Datos sensibles encriptados (si aplica)
- [ ] **HTTPS** - Producción usa HTTPS
- [ ] **CORS** - Configurado apropiadamente

### XSS Prevention
- [ ] **Input sanitization** - Inputs de usuario sanitizados
- [ ] **HTML escaping** - Contenido dinámico escapado
- [ ] **SQL injection** - N/A (frontend only, pero verificar en backend futuro)

---

## 🧪 Test Cases Específicos

### Bug Regressions (Verificar que no vuelvan)
- [ ] **Bug: Doble click en Analytics → Clientes**
  - **Estado:** ✅ CORREGIDO con hash navigation
  - **Test:** Un solo click debe funcionar
  - **Reproducir:** analytics.html → click Clientes → debe abrir Clientes directamente

- [ ] **Bug: Íconos 16px en algunos archivos**
  - **Estado:** ✅ CORREGIDO - todos a 20px
  - **Test:** Inspeccionar todos los íconos del sidebar
  - **Reproducir:** Abrir DevTools → Inspeccionar SVG → verificar width="20" height="20"

- [ ] **Bug: Missing Analytics link**
  - **Estado:** ✅ CORREGIDO - agregado a todas las páginas
  - **Test:** Verificar link en cada página
  - **Páginas:** motorsync, plansync, projectsync, threadsync, threadsync-list

### Edge Cases
- [ ] **Reporte sin datos** - ¿Qué pasa si no hay datos para el período?
- [ ] **Fechas inválidas** - Fecha fin antes de fecha inicio
- [ ] **API key inválido** - ¿Se maneja el error apropiadamente?
- [ ] **Webhook URL inválido** - ¿Valida formato de URL?
- [ ] **Conexión perdida** - ¿Maneja offline gracefully?

---

## 📝 Checklist de Deployment

### Pre-Deploy
- [ ] **Todos los tests pasan** - Checklist completo ✅
- [ ] **Sin console errors** - Logs limpios
- [ ] **Code review** - Cambios revisados
- [ ] **Documentation** - README y guides actualizados
- [ ] **Git** - Todo committed y pushed

### Deploy
- [ ] **Build** - Si aplica (minify, bundle)
- [ ] **Staging** - Testear en ambiente de staging
- [ ] **Backups** - Backup de producción actual
- [ ] **Deploy** - Subir a producción
- [ ] **Smoke tests** - Tests básicos post-deploy

### Post-Deploy
- [ ] **Verificar producción** - Todo funciona en prod
- [ ] **Monitor errors** - Revisar error logs
- [ ] **User feedback** - Solicitar feedback de usuarios
- [ ] **Rollback plan** - Tener plan de rollback listo

---

## 🎯 Prioridades de Testing

### Crítico (Must Test)
1. ✅ Hash navigation (bug fix reciente)
2. ✅ PDF report generation (nueva feature)
3. ✅ Íconos 20px consistentes (bug fix)
4. ✅ Analytics links en todas las páginas

### Alto (Should Test)
1. Excel/CSV export
2. IntegrationsManager basic functions
3. Webhook system
4. Notificaciones

### Medio (Nice to Test)
1. Responsive en todos los breakpoints
2. Performance metrics
3. All CRUD operations

### Bajo (Can Skip for Now)
1. Edge cases extremos
2. Old browser support
3. Accessibility deep dive

---

## ✅ Sign-Off

**Tester:** ___________________________

**Fecha:** ___________________________

**Versión:** 2.1

**Resultado General:**
- [ ] ✅ PASS - Todo funciona correctamente
- [ ] ⚠️ PASS con warnings - Funciona pero hay issues menores
- [ ] ❌ FAIL - Issues críticos encontrados

**Notas adicionales:**
_________________________________________
_________________________________________
_________________________________________

---

**Siguiente revisión:** ___________________________
