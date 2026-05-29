import rateLimit from "express-rate-limit";
import { logger } from "../services/logger.service.js";
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: (_req, _res) => {
        logger.warn({ message: "Rate limit exceeded" }, "Rate limit blocked");
        return {
            success: false,
            error: "Demasiadas solicitudes. Intenta de nuevo en 15 minutos.",
        };
    },
    skip: (req) => {
        if (req.path === "/" || req.path === "/health")
            return true;
        return false;
    },
});
const authRateLimitMax = Number.parseInt(process.env.AUTH_RATE_LIMIT_MAX ?? "30", 10);
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number.isFinite(authRateLimitMax) && authRateLimitMax > 0 ? authRateLimitMax : 30,
    standardHeaders: true,
    legacyHeaders: false,
    /** Solo cuentan intentos fallidos (401/4xx/5xx); el login exitoso no agota el cupo. */
    skipSuccessfulRequests: true,
    message: (_req, _res) => {
        logger.warn({ message: "Auth rate limit exceeded" }, "Auth rate limit blocked");
        return {
            success: false,
            error: "Demasiados intentos de login. Intenta de nuevo en 15 minutos.",
        };
    },
});
export const inscriptionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: (_req, _res) => {
        logger.warn({ message: "Inscripcion rate limit exceeded" }, "Inscripcion rate limit blocked");
        return {
            success: false,
            error: "Demasiadas inscripciones. Intenta de nuevo en 1 minuto.",
        };
    },
});
//# sourceMappingURL=rate-limit.js.map