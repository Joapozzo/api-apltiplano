import pino from "pino";
const isProduction = process.env.NODE_ENV === "production";
const SENSITIVE_FIELDS = [
    "email",
    "dni",
    "telefono",
    "phone",
    "password",
    "token",
    "jwt",
    "secret",
    "api_key",
    "apikey",
    "private_key",
    "credit_card",
    "card_number",
    "nombre",
    "apellido",
    "direccion",
    "address",
    "fecha_nacimiento",
    "date_of_birth",
    "emergencia_nombre",
    "emergencia_telefono",
    "firebase_uid",
];
function maskSensitiveData(obj) {
    if (obj === null || obj === undefined)
        return obj;
    if (typeof obj === "string")
        return SENSITIVE_FIELDS.some((f) => f.toLowerCase() in { string: 1 }) ? "***MASKED***" : obj;
    if (typeof obj !== "object")
        return obj;
    const masked = {};
    const input = obj;
    for (const key of Object.keys(input)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = SENSITIVE_FIELDS.some((f) => lowerKey.includes(f.toLowerCase()));
        if (isSensitive) {
            masked[key] = "***MASKED***";
        }
        else if (typeof input[key] === "object" && input[key] !== null) {
            masked[key] = maskSensitiveData(input[key]);
        }
        else {
            masked[key] = input[key];
        }
    }
    return masked;
}
const loggerOptions = {
    level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
    formatters: {
        level: (label) => {
            return { level: label };
        },
        log: (obj) => {
            return maskSensitiveData(obj);
        },
    },
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
            path: req.path,
            parameters: req.query,
            headers: {
                origin: req.headers.origin,
                "user-agent": req.headers["user-agent"],
            },
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
        err: (err) => ({
            type: err.type,
            message: err.message,
            stack: err.stack,
        }),
    },
};
// Solo en dev local con LOG_PRETTY=true (pino-pretty no funciona en serverless).
const usePrettyTransport = process.env.LOG_PRETTY === "true";
if (usePrettyTransport) {
    loggerOptions.transport = {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
        },
    };
}
export const logger = pino(loggerOptions);
export function createLogger(name) {
    return logger.child({ module: name });
}
export const loggers = {
    auth: createLogger("auth"),
    inscripciones: createLogger("inscripciones"),
    servicios: createLogger("servicios"),
    expediciones: createLogger("expediciones"),
    uploads: createLogger("uploads"),
    dashboard: createLogger("dashboard"),
    calendar: createLogger("calendar"),
};
//# sourceMappingURL=logger.service.js.map