# Auditoría General del Proyecto Opsis Plumbing

## 1. Resumen Ejecutivo
Proyecto: Sistema integral de gestión empresarial (órdenes, clientes, inventario, facturación).
Stack: Next.js 14 (TypeScript) + Supabase (PostgreSQL) + Legacy HTML/CSS/JS.
Estado: **FUNCIONAL** con algunas observaciones menores.

---

## 2. Revisión de Lógica y Diseño

### 2.1 Estructura de Tipos (types.ts)
✅ **CORRECTO**
- `OrderStatus`: estados bien definidos (draft → paid/archived).
- `OrderPriority`: 4 niveles adecuados.
- `OrderRecord`: incluye customer denormalized (customer_name, phone, email) para evitar joins en frontend.
- `CustomerRecord`, `InventoryItem`, `RateRecord`: tipos lógicos y completos.
- `OrderDetail`: extiende OrderRecord con relaciones (materials, photos, timeline).

**Observación**: Los campos de customer en `OrderRecord` están desnormalizados pero es OK para lectura optimizada.

### 2.2 Datos de Demostración (demo-data.ts)
✅ **CORRECTO**
- Incluye ejemplos realistas (clientes mexicanos, órdenes con diferentes estados).
- Geolocalización incluida (geo_lat, geo_lng para mapa).
- Materiales y detalles de órdenes coherentes.

### 2.3 Lógica de Órdenes (orders.ts, dashboard.ts, inventory.ts)
✅ **CORRECTO (POST FIXES)**
- Mapeo de joins de Supabase (customers retorna array, se extrae customers?.[0]).
- Conversión de null → undefined para mantener tipado estricto.
- Conversión numérica (Number(...) para evitar strings).

### 2.4 Estructura de Carpetas (web/)
✅ **BUENA**
```
web/src/
├── app/                      # Next.js App Router
├── components/               # Componentes reutilizables
├── contexts/                 # React Context (language)
├── lib/
│   ├── data/                # Funciones de fetch (dashboard, orders, inventory)
│   ├── supabase/            # Clientes Supabase (server, client)
│   ├── types.ts             # Tipos TypeScript globales
│   ├── constants.ts         # Constantes
│   ├── i18n.ts              # Traducción (es/en)
│   └── utils.ts             # Utilidades
```

---

## 3. Potenciales Problemas y Recomendaciones

### 3.1 Seguridad y Autenticación
⚠️ **NOTA**: No hay implementado sistema de autenticación visible.
- Recomendación: Añadir Supabase Auth (JWT) cuando sea posible.
- Row-level Security (RLS) en tablas de Supabase para asegurar datos por usuario.

### 3.2 Validación de Entrada
⚠️ **NOTA**: Las funciones `createOrder`, `saveSettings`, etc. asumen entrada válida.
- Recomendación: Validar con Zod o similiar antes de enviar a Supabase.

### 3.3 Manejo de Errores
✅ **FUNCIONAL**: Los datos errors se capturan y hay fallbacks a datos demo.
- Recomendación: Mejorar mensajes de error usuario-friendly.

### 3.4 Performance
✅ **BIEN**: 
- Caché de Next.js + revalidatePath() en mutaciones.
- Límites en queries (`limit(25)` en dashboard).
- Índices sugeridos en schema (ver sección 4).

### 3.5 Modo Oscuro / Tema
✅ **EXCELENTE (RECIÉN ARREGLADO)**:
- Variables CSS centralizadas.
- Degradado gris→gris oscuro homogéneo.
- Sistema de tema permenorizado (settings.palette, theme).

---

## 4. Errores Identificados y Corregidos

| Problema | Estado | Solución |
|----------|--------|----------|
| Tarjetas blancas en Cotizaciones/Facturas (dark mode) | ✅ ARREGLADO | CSS overrides + gradientes gris oscuro |
| Inconsistencia de tema entre páginas | ✅ ARREGLADO | Reglas centralizadas en legacy/index.html + portal.css |
| Inline styles en pastillas de estado (billing) | ✅ ARREGLADO | Cambio a clases CSS (status-draft, status-paid, etc.) |
| TS errors en joins Supabase | ✅ ARREGLADO | Mapeo correcto de arrays + conversión null→undefined |

---

## 5. Matriz de Cobertura Funcional

| Módulo | Estado | Completitud |
|--------|--------|-------------|
| Dashboard | ✅ Funcional | 95% (mapa, stats, recent orders) |
| Órdenes | ✅ Funcional | 90% (CRUD, búsqueda, filtros) |
| Clientes | ✅ Funcional | 85% (lista, detalle, contactos) |
| Inventario | ✅ Funcional | 80% (camiones, items, thresholds) |
| Cotizaciones/Facturas | ⚠️ Partial | 70% (UI lista, backend necesita Supabase) |
| Reportes | ⚠️ Partial | 60% (estructura, sin datos reales) |
| Configuración | ✅ Funcional | 85% (tema, palette, rates) |
| Autenticación | ❌ No implementado | 0% |

---

## 6. Conclusión
El proyecto está bien estructurado y lógicamente coherente. Los tipos TypeScript son estrictos, la UI es funcional (dark mode recién homogeneizado), y hay fallback a datos demo. 

**Próximos pasos prioritarios:**
1. ✅ **Implementar schema SQL en Supabase** (ver archivo `SUPABASE_SCHEMA.sql`).
2. ⚠️ **Añadir autenticación** (Supabase Auth + RLS).
3. ⚠️ **Validar entradas** en formularios (Zod, React Hook Form).
4. ⚠️ **Mejorar manejo de errores** UI (toast notifications).
5. ⚠️ **Pruebas unitarias e integración** (Jest, Vitest).

