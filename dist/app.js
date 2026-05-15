import express from "express";
import cookieParser from "cookie-parser";
import cors from "./middlewares/cors.js";
import { authenticate } from "./middlewares/authenticate.js";
import { authorize } from "./middlewares/authorize.js";
import { csrfProtection } from "./middlewares/csrf.js";
import { auditMiddleware } from "./middlewares/audit.js";
import inscripcionesRoutes from "./routes/inscripciones.routes.js";
import expedicionesRoutes from "./routes/expediciones.routes.js";
import serviciosRoutes from "./routes/servicios.routes.js";
import catalogosRoutes from "./routes/catalogos.routes.js";
import itemsServicioRoutes from "./routes/items-servicio.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { APP_ROLES } from "./types/auth.types.js";
const app = express();
const isProduction = process.env.NODE_ENV === "production";
// HTTPS redirect para producción
if (isProduction) {
    app.use((req, res, next) => {
        if (!req.secure && req.headers["x-forwarded-proto"] !== "https") {
            return res.redirect(301, `https://${req.hostname}${req.url}`);
        }
        next();
    });
}
// Middlewares
app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Auditoría para operaciones sensibles
app.use(auditMiddleware);
const csrfMiddleware = csrfProtection(true);
// Routes - CSRF protection on mutating endpoints
app.use("/api/auth", authRoutes);
app.use("/api/inscripciones", csrfMiddleware, inscripcionesRoutes);
app.use("/api/expediciones", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), expedicionesRoutes);
app.use("/api/servicios", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), serviciosRoutes);
app.use("/api/catalogos", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), catalogosRoutes);
app.use("/api/items-servicio", csrfMiddleware, authenticate, authorize(APP_ROLES.ADMIN), itemsServicioRoutes);
app.use("/api/usuarios", csrfMiddleware, authenticate, usuariosRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
    res.send("Altiplano API - Running");
});
export default app;
//# sourceMappingURL=app.js.map