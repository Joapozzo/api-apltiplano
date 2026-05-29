import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "./middlewares/cors.js";
import { authenticate } from "./middlewares/authenticate.js";
import { authorize } from "./middlewares/authorize.js";
import { csrfProtection } from "./middlewares/csrf.js";
import { auditMiddleware } from "./middlewares/audit.js";
import { requestLogger } from "./middlewares/request-logger.js";
import { globalErrorHandler } from "./middlewares/error-handler.js";
import { apiLimiter, authLimiter, inscriptionLimiter } from "./middlewares/rate-limit.js";
import { prisma } from "./database/prisma.js";
import inscripcionesRoutes from "./routes/inscripciones.routes.js";
import expedicionesRoutes from "./routes/expediciones.routes.js";
import serviciosRoutes from "./routes/servicios.routes.js";
import catalogosRoutes from "./routes/catalogos.routes.js";
import itemsServicioRoutes from "./routes/items-servicio.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminSearchRoutes from "./routes/admin-search.routes.js";
import coordinadoresRoutes from "./routes/coordinadores.routes.js";
import uploadRoutes from "./uploads/routes/upload.routes.js";
import configRoutes from "./routes/config.routes.js";
import publicConfigRoutes from "./routes/public-config.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import notasCalendarioRoutes from "./routes/notas-calendario.routes.js";
import { APP_ROLES } from "./types/auth.types.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (isProduction || process.env.VERCEL) {
  app.set("trust proxy", 1);
}

// ==============================
// Security headers
// ==============================
app.use(helmet());

// ==============================
// Request logging (first middleware after security)
// ==============================
app.use(requestLogger);

// ==============================
// HTTPS redirect para producción
// ==============================
if (isProduction) {
  app.use((req, res, next) => {
    if (!req.secure && req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}

// ==============================
// Global rate limiter
// ==============================
app.use(apiLimiter);

// ==============================
// Body parsing & CORS
// ==============================
app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Auditoría para operaciones sensibles
// ==============================
app.use(auditMiddleware);

const csrfMiddleware = csrfProtection(true);

// ==============================
// Routes
// ==============================

// Health check (no rate limit, no auth, no CSRF)
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "disconnected",
    });
  }
});

app.get("/", (_req, res) => {
  res.json({
    name: "Altiplano API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes with stricter rate limiting
app.use("/api/auth", authLimiter, authRoutes);

// Inscription routes with inscription-specific rate limiting
app.use("/api/inscripciones", inscriptionLimiter, csrfMiddleware, inscripcionesRoutes);

// Admin-only routes with CSRF protection
app.use("/api/expediciones", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), expedicionesRoutes);
app.use("/api/servicios", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), serviciosRoutes);
app.use("/api/catalogos", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), catalogosRoutes);
app.use("/api/items-servicio", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), itemsServicioRoutes);
app.use("/api/usuarios", csrfMiddleware, authenticate, usuariosRoutes);
app.use("/api/coordinadores", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), coordinadoresRoutes);
app.use("/api/user", userRoutes);
app.use("/api", csrfMiddleware, uploadRoutes);
app.use("/api/admin/search", authenticate, authorize(APP_ROLES.ADMIN), adminSearchRoutes);
app.use("/api/config", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), configRoutes);
app.use("/api/public/config", publicConfigRoutes);
app.use("/api/admin/notificaciones", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), notificacionesRoutes);
app.use("/api", dashboardRoutes);

// Calendar notes routes (admin-only auth handled inside the router)
app.use(notasCalendarioRoutes);

// ==============================
// 404 handler for unknown routes
// ==============================
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
  });
});

// ==============================
// Global error handler (must be last)
// ==============================
app.use(globalErrorHandler);

export default app;
