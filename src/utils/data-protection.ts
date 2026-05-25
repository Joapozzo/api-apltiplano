import { encrypt, decrypt } from "./encryption.js";

/** Campos PII de la fila inscripciones (se guardan cifrados en DB) */
export const INSCRIPCION_PII_FIELDS = [
  "dni",
  "telefono",
  "provincia",
  "emergencia_nombre",
  "emergencia_telefono",
] as const;

/** Campos de clientes/usuarios que deben permanecer en texto plano (búsqueda y display) */
export const CLIENT_PLAIN_FIELDS = ["nombre", "apellido"] as const;

export function isEncryptionEnabled(): boolean {
  return Boolean(process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 64);
}

export function isEncryptedValue(value: string): boolean {
  const parts = value.split(":");
  return parts.length === 3 && parts.every((part) => /^[0-9a-f]+$/i.test(part));
}

export function maybeDecrypt(value: string | null | undefined): string | null | undefined {
  if (value == null || value === "" || !isEncryptionEnabled()) {
    return value;
  }
  if (isEncryptedValue(value)) {
    return decrypt(value);
  }
  return value;
}

export function encryptInscripcionPii<T extends Record<string, unknown>>(data: T): T {
  return encryptObjectFields(data, [...INSCRIPCION_PII_FIELDS]) as T;
}

export function decryptInscripcionPii<T extends Record<string, unknown>>(data: T): T {
  return decryptObjectFields(data, [...INSCRIPCION_PII_FIELDS]) as T;
}

export function decryptClientePii<T extends Record<string, unknown>>(data: T): T {
  return decryptObjectFields(data, ["nombre", "apellido", "email", "telefono"]) as T;
}

export function decryptInscripcionRecord<T extends Record<string, unknown>>(inscripcion: T): T {
  const result = decryptInscripcionPii({ ...inscripcion }) as T & {
    clientes?: Record<string, unknown>;
    inscripcion_datos_medicos?: Record<string, unknown> | null;
  };

  if (result.clientes && typeof result.clientes === "object") {
    result.clientes = decryptClientePii(result.clientes);
  }

  if (result.inscripcion_datos_medicos && typeof result.inscripcion_datos_medicos === "object") {
    result.inscripcion_datos_medicos = decryptObjectFields(result.inscripcion_datos_medicos, [
      "cobertura_medica",
      "grupo_sanguineo",
      "alergias_detalle",
      "otros_antecedentes",
    ]);
  }

  return result as T;
}

/** @deprecated Usar encryptInscripcionPii — no cifrar nombre/apellido de clientes */
export function encryptSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  return encryptInscripcionPii(data);
}

/** @deprecated Usar decryptInscripcionPii / decryptClientePii */
export function decryptSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  return decryptObjectFields(data, [
    ...INSCRIPCION_PII_FIELDS,
    "nombre",
    "apellido",
    "email",
    "telefono",
  ]);
}

export function encryptObjectFields(obj: Record<string, unknown>, fields: string[]): Record<string, unknown> {
  if (!isEncryptionEnabled()) {
    return obj;
  }

  const result: Record<string, unknown> = { ...obj };
  for (const field of fields) {
    if (result[field] && typeof result[field] === "string") {
      const value = result[field] as string;
      if (!value.includes(":")) {
        result[field] = encrypt(value);
      }
    }
  }
  return result;
}

export function decryptObjectFields(obj: Record<string, unknown>, fields: string[]): Record<string, unknown> {
  if (!isEncryptionEnabled()) {
    return obj;
  }

  const result: Record<string, unknown> = { ...obj };
  for (const field of fields) {
    if (result[field] && typeof result[field] === "string") {
      const value = result[field] as string;
      if (value.includes(":")) {
        result[field] = decrypt(value);
      }
    }
  }
  return result;
}