# Opsis Plumbing Web App

Opsis Plumbing es la nueva versión del panel que antes vivía en Google Apps Script. Ahora corre con **Next.js 14 (App Router)**, se conecta a **Supabase** como base de datos Postgres administrada y está lista para desplegarse en **Vercel**.

## Características clave

- UI modular inspirada en el diseño original (dashboard, órdenes, detalle, clientes, inventario, reportes y ajustes).
- Integración con Leaflet para el mapa interactivo de trabajos.
- Server Components para lecturas y Server Actions para escrituras (crear órdenes, guardar ajustes).
- Providers para tema claro/oscuro, paletas de color y selector de idioma (ES/EN).
- Capa de datos con _fallback demo_ para trabajar aun sin credenciales de Supabase.

## Requisitos

- Node.js 18.17+ (recomendado 20+)
- Cuenta de Supabase y proyecto listo para ejecutar migraciones SQL

## Variables de entorno

Crea un archivo `.env.local` dentro de `/web` basado en `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=optional-if-you-need-admin-operations
```

## Migraciones de Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta el SQL de `../supabase/migrations/0001_init.sql` en el editor de la plataforma o con la CLI (`supabase db push`).
3. Opcional: carga datos iniciales manualmente o deja que la app use los _demo seeds_.

> ⚠️ Las políticas incluidas están abiertas para facilitar pruebas. Endurece las RLS según tu modelo de autenticación antes de ir a producción.

## Scripts

```bash
npm install        # instala dependencias
npm run dev        # arranca el servidor en modo desarrollo
npm run build      # compila para producción
npm run start      # sirve la build local
npm run lint       # lint de Next/TypeScript
```

## Arquitectura rápida

- `/src/app/(platform)` agrupa todas las rutas del panel con un layout compartido.
- `/src/lib/data` contiene la capa de acceso a Supabase (con fallback demo).
- `/src/lib/supabase` define los clientes para server/browser.
- `/src/components/layout` maneja shell, sidebar, topbar y providers de UI.

## Despliegue

1. Crea un proyecto en Vercel y selecciona este directorio (`web`) como raíz.
2. Configura las mismas variables de entorno en Vercel.
3. Vercel ejecutará `npm install && npm run build`. Al finalizar podrás acceder al dashboard en producción.
