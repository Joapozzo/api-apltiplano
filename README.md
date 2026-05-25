# api-apltiplano

Backend API de Altiplano Experience.

## Deploy en Vercel

1. Conectar el repo en Vercel (Framework Preset: **Other**).
2. Build Command: `pnpm build` (incluye `prisma generate`).
3. Configurar las variables de entorno de `env.example` en **Project → Settings → Environment Variables**.
4. Redeploy.

Endpoints de verificación:

- `GET /` — info de la API
- `GET /health` — health check con ping a la base de datos

Desarrollo local: `pnpm dev` (usa `src/server.ts` con `app.listen()`).
