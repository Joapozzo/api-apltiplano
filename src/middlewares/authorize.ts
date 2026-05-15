import type { NextFunction, Request, Response } from "express";
import type { AppRole } from "../types/auth.types.js";

export function authorize(...allowedRoles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        error: "La solicitud no estA autenticada",
        code: "UNAUTHENTICATED",
      });
    }

    const hasAllowedRole = req.auth.roles.some((role: AppRole) => allowedRoles.includes(role));
    if (!hasAllowedRole) {
      return res.status(403).json({
        success: false,
        error: "No tenEs permisos para acceder a este recurso",
        code: "FORBIDDEN",
      });
    }

    return next();
  };
}
