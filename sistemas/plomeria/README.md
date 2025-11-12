# Opsis Plumbing

Migración del panel operativo de Google Apps Script a un stack moderno basado en:

- **Next.js 14** (App Router) dentro de `web/`
- **Supabase** como base de datos, autenticación y almacenamiento
- **Vercel** para despliegues serverless

## Estructura

```
.
├─ web/                     # Frontend Next.js + Tailwind + Supabase client
└─ supabase/migrations/     # SQL para crear tablas, enums y políticas base
```

## Primeros pasos

1. Entra al directorio `web` y copia `.env.example` a `.env.local` con las llaves de tu proyecto Supabase.
2. Ejecuta `npm install` seguido de `npm run dev` para levantar el panel en `http://localhost:3000`.
3. En tu instancia de Supabase corre `supabase/migrations/0001_init.sql` (CLI o editor web) para crear tablas equivalentes a las Hojas de Cálculo originales.
4. Ajusta las políticas RLS antes de ir a producción; las incluidas permiten accesos abiertos para acelerar pruebas locales.

## Despliegue recomendado

- Sube este repositorio a GitHub.
- En Vercel, crea un proyecto apuntando a `web/` como raíz e ingresa las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (y la `SUPABASE_SERVICE_ROLE_KEY` si ocupas acciones privilegiadas).
- Cada push a `main` disparará builds automáticos.

## Documentación adicional

Consulta `web/README.md` para detalles sobre scripts de npm, arquitectura interna, providers de idioma/tema y flujo de datos.
