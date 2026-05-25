import { encrypt, decrypt } from "./encryption.js";
/** Campos PII de la fila inscripciones (se guardan cifrados en DB) */
export const INSCRIPCION_PII_FIELDS = [
    "dni",
    "telefono",
    "provincia",
    "emergencia_nombre",
    "emergencia_telefono",
];
/** Campos de clientes/usuarios que deben permanecer en texto plano (búsqueda y display) */
export const CLIENT_PLAIN_FIELDS = ["nombre", "apellido"];
export function isEncryptionEnabled() {
    return Boolean(process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 64);
}
export function isEncryptedValue(value) {
    const parts = value.split(":");
    return parts.length === 3 && parts.every((part) => /^[0-9a-f]+$/i.test(part));
}
export function maybeDecrypt(value) {
    if (value == null || value === "" || !isEncryptionEnabled()) {
        return value;
    }
    if (isEncryptedValue(value)) {
        return decrypt(value);
    }
    return value;
}
export function encryptInscripcionPii(data) {
    return encryptObjectFields(data, [...INSCRIPCION_PII_FIELDS]);
}
export function decryptInscripcionPii(data) {
    return decryptObjectFields(data, [...INSCRIPCION_PII_FIELDS]);
}
export function decryptClientePii(data) {
    return decryptObjectFields(data, ["nombre", "apellido", "email", "telefono"]);
}
export function decryptInscripcionRecord(inscripcion) {
    const result = decryptInscripcionPii({ ...inscripcion });
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
    return result;
}
/** @deprecated Usar encryptInscripcionPii — no cifrar nombre/apellido de clientes */
export function encryptSensitiveData(data) {
    return encryptInscripcionPii(data);
}
/** @deprecated Usar decryptInscripcionPii / decryptClientePii */
export function decryptSensitiveData(data) {
    return decryptObjectFields(data, [
        ...INSCRIPCION_PII_FIELDS,
        "nombre",
        "apellido",
        "email",
        "telefono",
    ]);
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