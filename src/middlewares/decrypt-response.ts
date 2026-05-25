import type { Request, Response, NextFunction } from "express";
import { decrypt, decryptFields, SensitiveFields } from "../utils/encryption.js";

const PUBLIC_PATHS = ["/api/servicios", "/api/salidas", "/api/user/servicios", "/api/user/salidas"];

const SENSITIVE_RESPONSE_FIELDS: Record<string, string[]> = {
  "usuarios.email": ["email"],
  "clientes.email": ["email", "nombre", "apellido", "telefono"],
  "inscripciones.dni": ["dni", "telefono", "provincia", "emergencia_nombre", "emergencia_telefono"],
  inscripcion_datos_medicos: ["grupo_sanguineo", "cobertura_medica"],
};

function isEncryptedValue(value: string): boolean {
  if (!value) return false;
  const parts = value.split(":");
  return parts.length === 3 && parts.every((p) => /^[0-9a-f]+$/.test(p));
}

export function decryptResponse(req: Request, res: Response, next: NextFunction) {
  const isPublicPath = PUBLIC_PATHS.some((p) => req.path.startsWith(p));

  if (isPublicPath || req.method === "GET") {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = function (body: unknown) {
    if (!body || typeof body !== "object") {
      return originalJson(body);
    }

    const data = body as Record<string, unknown>;
    const decrypted = JSON.parse(JSON.stringify(data));

    if (decrypted.data) {
      if (Array.isArray(decrypted.data)) {
        decrypted.data = decrypted.data.map((item: Record<string, unknown>) => decryptSensitiveFields(item));
      } else if (decrypted.data && typeof decrypted.data === "object") {
        decrypted.data = decryptSensitiveFields(decrypted.data as Record<string, unknown>);
      }
    }

    return originalJson(decrypted);
  };

  next();
}

function decryptSensitiveFields(data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data };

  for (const [key, value] of Object.entries(result)) {
    if (typeof value === "string" && isEncryptedValue(value)) {
      try {
        result[key] = decrypt(value);
      } catch {
        // Mantener valor encriptado si no se puede desencriptar
      }
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = decryptSensitiveFields(value as Record<string, unknown>);
    }
  }

  return result;
}

export const decryptMiddleware = decryptResponse;
