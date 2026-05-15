import { decryptFields, SensitiveFields } from "../utils/encryption.js";
const PUBLIC_PATHS = ["/api/servicios", "/api/salidas", "/api/user/servicios", "/api/user/salidas"];
const SENSITIVE_RESPONSE_FIELDS = {
    "usuarios.email": ["email"],
    "clientes.email": ["email", "nombre", "apellido", "telefono"],
    "inscripciones.dni": ["dni", "telefono", "provincia", "emergencia_nombre", "emergencia_telefono"],
    "inscripcion_datos_medicos": ["grupo_sanguineo", "cobertura_medica"],
};
function isEncryptedValue(value) {
    if (!value)
        return false;
    const parts = value.split(":");
    return parts.length === 3 && parts.every(p => /^[0-9a-f]+$/.test(p));
}
export function decryptResponse(req, res, next) {
    const isPublicPath = PUBLIC_PATHS.some(p => req.path.startsWith(p));
    if (isPublicPath || req.method === "GET") {
        return next();
    }
    const originalJson = res.json.bind(res);
    res.json = function (body) {
        if (!body || typeof body !== "object") {
            return originalJson(body);
        }
        const data = body;
        const decrypted = JSON.parse(JSON.stringify(data));
        if (decrypted.data) {
            if (Array.isArray(decrypted.data)) {
                decrypted.data = decrypted.data.map((item) => decryptSensitiveFields(item));
            }
            else if (decrypted.data && typeof decrypted.data === "object") {
                decrypted.data = decryptSensitiveFields(decrypted.data);
            }
        }
        return originalJson(decrypted);
    };
    next();
}
function decryptSensitiveFields(data) {
    const result = { ...data };
    for (const [key, value] of Object.entries(result)) {
        if (typeof value === "string" && isEncryptedValue(value)) {
            try {
                const { decrypt } = require("../utils/encryption.js");
                result[key] = decrypt(value);
            }
            catch {
                // Mantener valor encriptado si no se puede desencriptar
            }
        }
        else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            result[key] = decryptSensitiveFields(value);
        }
    }
    return result;
}
export const decryptMiddleware = decryptResponse;
//# sourceMappingURL=decrypt-response.js.map