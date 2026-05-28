# api-apltiplano

Backend API de Altiplano Experience.

## Deploy en Vercel

1. Conectar el repo en Vercel (Framework Preset: **Other**).
2. `postinstall` ejecuta `prisma generate` automáticamente en cada deploy.
3. Configurar **todas** las variables obligatorias en **Project → Settings → Environment Variables** (Production):

   - `DATABASE_URL`
   - `JWT_SECRET` (mín. 32 caracteres)
   - `CSRF_SECRET` (mín. 32 caracteres)
   - `ENCRYPTION_KEY` (64 hex chars)
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (con `\n` literales)
   - `NODE_ENV=production`

4. Redeploy.

Endpoints de verificación:

- `GET /health` — health check con ping a la base de datos
- `GET /` — info de la API

Desarrollo local: `pnpm dev` (usa `src/server.ts` con `app.listen()`).
