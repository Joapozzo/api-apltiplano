import { encrypt, decrypt } from "./encryption.js";
export function isEncryptionEnabled() {
    return Boolean(process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 64);
}
export function encryptSensitiveData(data) {
    if (!isEncryptionEnabled()) {
        return data;
    }
    const sensitiveFields = ["dni", "telefono", "email", "nombre", "apellido", "provincia", "emergencia_nombre", "emergencia_telefono"];
    const result = { ...data };
    for (const field of sensitiveFields) {
        if (result[field] && typeof result[field] === "string") {
            const value = result[field];
            if (!value.includes(":")) {
                result[field] = encrypt(value);
            }
        }
    }
    return result;
}
export function decryptSensitiveData(data) {
    if (!isEncryptionEnabled()) {
        return data;
    }
    const sensitiveFields = ["dni", "telefono", "email", "nombre", "apellido", "provincia", "emergencia_nombre", "emergencia_telefono"];
    const result = { ...data };
    for (const field of sensitiveFields) {
        if (result[field] && typeof result[field] === "string") {
            const value = result[field];
            if (value.includes(":")) {
                try {
                    result[field] = decrypt(value);
                }
                catch {
                    // Keep encrypted if decryption fails
                }
            }
        }
    }
    return result;
}
export function encryptObjectFields(obj, fields) {
    if (!isEncryptionEnabled()) {
        return obj;
    }
    const result = { ...obj };
    for (const field of fields) {
        if (result[field] && typeof result[field] === "string") {
            const value = result[field];
            if (!value.includes(":")) {
                result[field] = encrypt(value);
            }
        }
    }
    return result;
}
export function decryptObjectFields(obj, fields) {
    if (!isEncryptionEnabled()) {
        return obj;
    }
    const result = { ...obj };
    for (const field of fields) {
        if (result[field] && typeof result[field] === "string") {
            const value = result[field];
            if (value.includes(":")) {
                result[field] = decrypt(value);
            }
        }
    }
    return result;
}
//# sourceMappingURL=data-protection.js.map