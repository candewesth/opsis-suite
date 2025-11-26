# 🔄 Flujo de Integración: ThreadSync → PlanSync → ProjectSync

## 📋 Resumen

Este documento describe la integración completa entre los tres módulos principales de MotorSync para gestionar el ciclo completo desde oportunidades hasta proyectos completados.

---

## 🎯 Flujo Completo del Sistema

```
┌─────────────────┐
│   ThreadSync    │  1️⃣ Captar Oportunidad
│  (Oportunidad)  │  
└────────┬────────┘
         │
         ├─► "Agendar Cita" ──────────┐
         │                            │
         └─► "Convertir a Proyecto"   │
                     │                │
                     ▼                ▼
         ┌─────────────────┐  ┌─────────────────┐
         │  ProjectSync    │  │    PlanSync     │
         │   (Proyecto)    │  │    (Agenda)     │
         └────────┬────────┘  └─────────────────┘
                  │                    │
                  └─► "Agendar Visita" │
                            │          │
                            ▼          │
                    ┌─────────────────┐│
                    │   Citas con     ││
                    │  origen y link  ││
                    └─────────────────┘▼
```

---

## 🔗 Conexiones Implementadas

### 1️⃣ **ThreadSync → PlanSync** (Agendar Cita desde Oportunidad)

**Botón**: "Agendar Cita" en ThreadSync
**Ubicación**: Header de acciones del thread
**Función**: `scheduleAppointmentFromThread()`

**Flujo**:
1. Usuario abre una oportunidad en ThreadSync
2. Hace clic en botón "Agendar Cita"
3. Sistema extrae datos del thread:
   - ID del thread
   - Nombre del cliente
   - Asunto/descripción
   - Dirección (si existe)
4. Almacena datos temporalmente en `localStorage.temp_appointment_data`
5. Redirige a PlanSync con parámetros: `?action=new&source=thread&id=THR-XXX`
6. PlanSync abre modal de Nueva Cita con campos pre-llenados:
   - Cliente: nombre del cliente del thread
   - Título: "Visita - [asunto]"
   - Tipo: "inspection" (inspección por defecto)
   - Notas: incluye ID del thread

**Datos enviados**:
```javascript
{
  sourceType: 'thread',
  sourceId: 'THR-001',
  client: 'Nombre del cliente',
  title: 'Visita - Asunto',
  notes: 'Thread: THR-001\nDescripción...',
  type: 'inspection',
  address: 'Dirección si existe'
}
```

---

### 2️⃣ **ThreadSync → ProjectSync** (Convertir a Proyecto)

**Botón**: "Convertir a Proyecto" en ThreadSync
**Ubicación**: Header de acciones (solo visible si no está convertido)
**Función**: `convertToProject()` (ya existía)

**Flujo**:
1. Usuario marca oportunidad como "Ganada"
2. Hace clic en "Convertir a Proyecto"
3. Modal solicita datos adicionales del proyecto
4. Sistema crea proyecto en ProjectSync
5. Vincula thread con proyecto (campo `convertedToProject`)
6. Botón cambia a "Ir al ProjectSync"

---

### 3️⃣ **ProjectSync → PlanSync** (Agendar Visita desde Proyecto)

**Botón**: Icono de calendario en tabla de proyectos
**Ubicación**: Columna de acciones junto a botón "Ver"
**Función**: `scheduleAppointmentFromProject(projectId)`

**Flujo**:
1. Usuario ve lista de proyectos en ProjectSync
2. Hace clic en icono de calendario 📅 del proyecto
3. Sistema extrae datos del proyecto:
   - ID del proyecto
   - Nombre del proyecto
   - Cliente
   - Dirección
4. Almacena datos temporalmente en `localStorage.temp_appointment_data`
5. Redirige a PlanSync con parámetros: `?action=new&source=project&id=PRJ-XXX`
6. PlanSync abre modal de Nueva Cita con campos pre-llenados:
   - Proyecto: seleccionado automáticamente
   - Cliente: del proyecto
   - Título: "Visita de trabajo - [nombre proyecto]"
   - Tipo: "installation" (instalación por defecto)
   - Dirección: del proyecto

**Datos enviados**:
```javascript
{
  sourceType: 'project',
  sourceId: 'PRJ-001',
  projectId: 'PRJ-001',
  projectName: 'Nombre del proyecto',
  client: 'Cliente del proyecto',
  title: 'Visita de trabajo - Proyecto',
  notes: 'Proyecto: Nombre\nCliente: ...',
  type: 'installation',
  address: 'Dirección del proyecto'
}
```

---

## 📊 Estructura de Datos Mejorada

### **Appointments (Citas) en PlanSync**

Ahora incluyen campos de integración:

```javascript
{
  id: 'APT-001',
  projectId: 'PRJ-001' || null,         // Proyecto asociado (opcional)
  projectName: 'Nombre',
  client: 'Cliente',                     // Ahora obligatorio
  title: 'Título de la cita',
  date: '2025-11-26',
  time: '09:00',
  duration: 60,
  type: 'inspection',                    // inspection, installation, review, etc.
  technician: 'Juan García',
  status: 'pending',                     // pending, confirmed, completed, cancelled
  notes: 'Notas...',
  address: 'Dirección',
  
  // 🆕 Campos de integración
  sourceType: 'thread' || 'project' || null,  // Origen de la cita
  sourceId: 'THR-001' || 'PRJ-001' || null    // ID del origen
}
```

---

## 🎨 Interfaz Visual

### **Tarjetas de Citas en PlanSync**

Las citas ahora muestran su origen con un link directo:

**Para citas desde Thread**:
```
┌─────────────────────────────────┐
│ 🔍 Inspección inicial           │
│ Cliente: ABC Corp               │
│ ⏰ 09:00 (60 min)               │
│ 👤 Juan García                  │
│ 📍 123 Main St                  │
│ 💬 Ver en ThreadSync →          │ ← Link directo
└─────────────────────────────────┘
```

**Para citas desde Proyecto**:
```
┌─────────────────────────────────┐
│ 🔧 Visita de trabajo            │
│ Proyecto ABC                    │
│ ⏰ 14:00 (120 min)              │
│ 👤 María López                  │
│ 📍 456 Oak Ave                  │
│ 🏠 Ver en ProjectSync →         │ ← Link directo
└─────────────────────────────────┘
```

---

## 🔄 Casos de Uso

### **Caso 1: Lead nuevo → Inspección → Proyecto**

1. **ThreadSync**: Entra lead "Instalación eléctrica - ABC Corp"
2. **ThreadSync**: Click "Agendar Cita" → inspección para mañana
3. **PlanSync**: Se crea cita de inspección vinculada al thread
4. **PlanSync**: Técnico completa inspección, actualiza notas
5. **ThreadSync**: Lead se marca como "Ganado"
6. **ThreadSync**: Click "Convertir a Proyecto"
7. **ProjectSync**: Proyecto creado con datos del thread
8. **ProjectSync**: Click icono 📅 "Agendar Visita"
9. **PlanSync**: Se crea cita de trabajo vinculada al proyecto
10. **ProjectSync**: Proyecto avanza hasta completarse

### **Caso 2: Proyecto existente → Seguimiento**

1. **ProjectSync**: Proyecto en progreso
2. **ProjectSync**: Click icono 📅 para agendar supervisión
3. **PlanSync**: Cita de seguimiento programada
4. **PlanSync**: Click "Ver en ProjectSync" para ver detalles del proyecto
5. **ProjectSync**: Actualizar estado según visita

### **Caso 3: Oportunidad sin proyecto → Solo inspección**

1. **ThreadSync**: Oportunidad requiere inspección
2. **ThreadSync**: Click "Agendar Cita"
3. **PlanSync**: Cita creada SIN proyecto asociado
4. **PlanSync**: Campo cliente muestra nombre del lead
5. **ThreadSync**: Si se cierra como perdido, cita permanece como registro

---

## 💾 LocalStorage Keys

El sistema utiliza las siguientes claves:

```javascript
// Datos principales
'threadsync_threads'         // Threads/oportunidades
'projectsync_projects'       // Proyectos
'projectsync_appointments'   // Citas/agenda

// Datos temporales de integración
'temp_appointment_data'      // Datos temporales al crear cita desde thread/proyecto
```

---

## 🎯 Tipos de Citas

| Tipo | Icono | Uso Principal | Origen Común |
|------|-------|---------------|--------------|
| `inspection` | 🔍 | Inspección inicial, cotización | Thread |
| `installation` | 🔧 | Trabajo de instalación | Proyecto |
| `review` | 👀 | Revisión, supervisión | Proyecto |
| `meeting` | 🤝 | Reunión con cliente | Thread/Proyecto |
| `delivery` | 📦 | Entrega final | Proyecto |
| `maintenance` | 🔨 | Mantenimiento, garantía | Proyecto |
| `other` | 📌 | Otros | Cualquiera |

---

## ✅ Validaciones

### **Al crear cita desde Thread**:
- ✅ Thread debe existir
- ✅ Cliente es obligatorio (pre-llenado con nombre del thread)
- ⚠️ Proyecto es opcional (thread aún no convertido)

### **Al crear cita desde Proyecto**:
- ✅ Proyecto debe existir
- ✅ Cliente pre-llenado del proyecto
- ✅ Proyecto asociado automáticamente
- ✅ Dirección heredada del proyecto

---

## 🔐 Permisos y Accesos

Todos los usuarios con acceso a los módulos pueden:
- ✅ Crear citas desde threads
- ✅ Crear citas desde proyectos
- ✅ Ver origen de las citas
- ✅ Navegar entre módulos con los links

---

## 🚀 Próximas Mejoras Sugeridas

1. **Sincronización bidireccional**: 
   - Mostrar citas próximas en card del thread
   - Mostrar citas del proyecto en vista de detalles

2. **Historial de citas**:
   - En ThreadSync: mostrar todas las citas de la oportunidad
   - En ProjectSync: timeline de visitas del proyecto

3. **Notificaciones**:
   - Recordatorios automáticos antes de las citas
   - Notificar al crear cita desde thread/proyecto

4. **Estadísticas**:
   - % de threads con cita agendada
   - Tiempo promedio entre inspección y conversión
   - Citas completadas vs pendientes por proyecto

5. **Exportar**:
   - Reporte de citas por thread
   - Reporte de citas por proyecto
   - Calendar sync (Google/Outlook)

---

## 📝 Notas Técnicas

- **Compatibilidad**: Los appointments antiguos sin `sourceType` siguen funcionando
- **Limpieza**: `temp_appointment_data` se elimina automáticamente después de usar
- **Navegación**: Los links usan `onclick="event.stopPropagation()"` para evitar conflictos
- **IDs**: Thread IDs con prefijo `THR-`, Project IDs con `PRJ-`, Appointments con `APT-`

---

**Última actualización**: 26 de noviembre de 2025
**Commit**: 64eff26
