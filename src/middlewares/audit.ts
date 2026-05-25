import type { Request, Response, NextFunction } from "express";
import { logger } from "../services/logger.service.js";

export interface AuditLogEntry {
  timestamp: string;
  user_id?: number;
  user_email?: string;
  ip_address: string;
  user_agent: string;
  method: string;
  path: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  status_code: number;
  duration_ms?: number;
}

const SENSITIVE_PATHS = [
  "/api/usuarios",
  "/api/inscripciones",
  "/api/expediciones",
  "/api/servicios",
  "/api/catalogos",
  "/api/admin/notificaciones",
];

const SENSITIVE_ACTIONS = ["create", "update", "delete", "patch"];

export function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function (body: unknown) {
    const durationMs = Date.now() - startTime;
    const statusCode = res.statusCode;

    const isSensitivePath = SENSITIVE_PATHS.some((p) => req.path.startsWith(p));
    const isSensitiveAction = SENSITIVE_ACTIONS.some((a) => req.method.toLowerCase().includes(a));

    if (isSensitivePath || isSensitiveAction || statusCode >= 400) {
      const auditEntry: any = {
        timestamp: new Date().toISOString(),
        ip_address: req.ip || req.socket.remoteAddress || "unknown",
        user_agent: req.headers["user-agent"] || "unknown",
        method: req.method,
        path: req.path,
        action: `${req.method} ${req.path}`,
        resource_type: extractResourceType(req.path),
        status_code: statusCode,
        duration_ms: durationMs,
      };

      if (req.auth) {
        auditEntry.user_id = req.auth.id_usuario;
        auditEntry.user_email = req.auth.email;
      }

      const resourceId = extractResourceId(req.params);
      if (resourceId) {
        auditEntry.resource_id = resourceId;
      }

      logger.info({ audit: auditEntry }, "Audit log");
    }

    return originalSend.call(this, body);
  };

  next();
}

function extractResourceType(path: string): string | undefined {
  const segments = path.split("/").filter(Boolean);
  if (segments.length >= 2) {
    return segments[1];
  }
  return undefined;
}

function extractResourceId(params: Record<string, string | string[] | undefined>): string | undefined {
  const idFields = ["id", "id_usuario", "id_expedicion", "id_servicio", "id_cliente", "id_inscripcion"];
  for (const field of idFields) {
    const value = params[field];
    if (value && typeof value === "string") {
      return value;
    }
  }
  return undefined;
}

export const audit = auditMiddleware;