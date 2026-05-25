import crypto from "crypto";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
function getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 64) {
        return null;
    }
    try {
        const keyBuffer = Buffer.from(key, "hex");
        if (keyBuffer.length !== 32) {
            return null;
        }
        return keyBuffer;
    }
    catch {
        return null;
    }
}
export function isEncryptionAvailable() {
    return getEncryptionKey() !== null;
}
export function encrypt(plaintext) {
    if (!plaintext)
        return "";
    const key = getEncryptionKey();
    if (!key) {
        throw new Error("ENCRYPTION_KEY is not configured — cannot encrypt sensitive data. " +
            "Set ENCRYPTION_KEY in your .env file (64 hex chars). " +
            "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH,
    });
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}
export function decrypt(encryptedData) {
    if (!encryptedData)
        return "";
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
        return encryptedData;
    }
    const ivHex = parts[0];
    const authTagHex = parts[1];
    const ciphertext = parts[2];
    if (!ivHex || !authTagHex || !ciphertext) {
        return encryptedData;
    }
    const key = getEncryptionKey();
    if (!key) {
        return encryptedData;
    }
    try {
        const iv = Buffer.from(ivHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
            authTagLength: AUTH_TAG_LENGTH,
        });
        decipher.setAuthTag(authTag);
        const decrypted = decipher.update(ciphertext, "hex", "utf8") + decipher.final("utf8");
        return decrypted;
    }
    catch {
        return encryptedData;
    }
}
export function hashData(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}
export function generateEncryptionKey() {
    return crypto.randomBytes(32).toString("hex");
}
export const SensitiveFields = {
    usuario: ["email", "nombre", "apellido", "telefono"],
    cliente: ["email", "nombre", "apellido", "telefono", "dni"],
    inscripcion: ["dni", "telefono", "provincia", "emergencia_nombre", "emergencia_telefono"],
    datos_medicos: ["grupo_sanguineo", "cobertura_medica"],
};
export function encryptFields(data, fields) {
    if (!data)
        return data;
    const result = { ...data };
    for (const field of fields) {
        if (result[field] && typeof result[field] === "string") {
            result[field] = encrypt(result[field]);
        }
    }
    return result;
}
export function decryptFields(data, fields) {
    if (!data)
        return data;
    const result = { ...data };
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
//# sourceMappingURL=encryption.js.map