import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";
import { logger } from "../services/logger.service.js";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: (_req: Request, _res: Response) => {
    logger.warn({ message: "Rate limit exceeded" }, "Rate limit blocked");
    return {
      success: false,
      error: "Demasiadas solicitudes. Intenta de nuevo en 15 minutos.",
    };
  },
  skip: (req) => {
    if (req.path === "/" || req.path === "/health") return true;
    return false;
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: (_req: Request, _res: Response) => {
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
  message: (_req: Request, _res: Response) => {
    logger.warn({ message: "Inscripcion rate limit exceeded" }, "Inscripcion rate limit blocked");
    return {
      success: false,
      error: "Demasiadas inscripciones. Intenta de nuevo en 1 minuto.",
    };
  },
});
