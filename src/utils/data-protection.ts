import { encrypt, decrypt } from "./encryption.js";

export function isEncryptionEnabled(): boolean {
  return Boolean(process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 64);
}

export function encryptSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  if (!isEncryptionEnabled()) {
    return data;
  }

  const sensitiveFields = ["dni", "telefono", "email", "nombre", "apellido", "provincia", "emergencia_nombre", "emergencia_telefono"];
  const result = { ...data };

  for (const field of sensitiveFields) {
    if (result[field] && typeof result[field] === "string") {
      const value = result[field] as string;
      if (!value.includes(":")) {
        result[field] = encrypt(value);
      }
    }
  }

  return result;
}

export function decryptSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  if (!isEncryptionEnabled()) {
    return data;
  }

  const sensitiveFields = ["dni", "telefono", "email", "nombre", "apellido", "provincia", "emergencia_nombre", "emergencia_telefono"];
  const result = { ...data };

  for (const field of sensitiveFields) {
    if (result[field] && typeof result[field] === "string") {
      const value = result[field] as string;
      if (value.includes(":")) {
        try {
          result[field] = decrypt(value);
        } catch {
          // Keep encrypted if decryption fails
        }
      }
    }
  }

  return result;
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