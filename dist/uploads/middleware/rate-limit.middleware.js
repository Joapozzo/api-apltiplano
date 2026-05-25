import { rateLimit } from "express-rate-limit";
import { AppError } from "../../utils/app-error.js";
import { getUploadMaxPorMes } from "../../utils/config-runtime.js";
let uploadMaxPorMes = 50;
getUploadMaxPorMes()
    .then((val) => {
    uploadMaxPorMes = val;
})
    .catch(() => { });
export async function refreshUploadLimit() {
    uploadMaxPorMes = await getUploadMaxPorMes();
}
function getCurrentMonthKeySuffix() {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}
function getCurrentMonthEnd() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0) - 1);
}
function getMillisecondsUntilMonthEnd() {
    return Math.max(1, getCurrentMonthEnd().getTime() - Date.now());
}
class MonthlyUploadMemoryStore {
    localKeys = true;
    counters = new Map();
    resolveStorageKey(key) {
        return `${key}:${getCurrentMonthKeySuffix()}`;
    }
    getFreshRecord(key) {
        const storageKey = this.resolveStorageKey(key);
        const now = Date.now();
        const current = this.counters.get(storageKey);
        if (current && current.resetTime.getTime() > now) {
            return { storageKey, record: current };
        }
        const newRecord = {
            totalHits: 0,
            resetTime: getCurrentMonthEnd(),
        };
        this.counters.set(storageKey, newRecord);
        return { storageKey, record: newRecord };
    }
    async get(key) {
        const { record } = this.getFreshRecord(key);
        return {
            totalHits: record.totalHits,
            resetTime: record.resetTime,
        };
    }
    async increment(key) {
        const { record } = this.getFreshRecord(key);
        record.totalHits += 1;
        return {
            totalHits: record.totalHits,
            resetTime: record.resetTime,
        };
    }
    async decrement(key) {
        const { record } = this.getFreshRecord(key);
        record.totalHits = Math.max(0, record.totalHits - 1);
    }
    async resetKey(key) {
        this.counters.delete(this.resolveStorageKey(key));
    }
}
const rateLimitConfig = {
    max_por_mes: uploadMaxPorMes,
};
const deleteRateLimitConfig = {
    max_por_minuto: 10,
};
const uploadRateLimitStore = new MonthlyUploadMemoryStore();
const deleteRateLimitStore = new MonthlyUploadMemoryStore();
const uploadLimiter = rateLimit({
    windowMs: getMillisecondsUntilMonthEnd(),
    limit: rateLimitConfig.max_por_mes,
    keyGenerator: (request) => String(request.auth?.id_usuario ?? "anonymous"),
    standardHeaders: true,
    legacyHeaders: false,
    store: uploadRateLimitStore,
    message: "Límite de subida del mes alcanzado",
    handler: (request, response) => {
        const error = new AppError("Límite de subida del mes alcanzado", 429);
        response.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    },
});
const deleteLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: deleteRateLimitConfig.max_por_minuto,
    keyGenerator: (request) => String(request.auth?.id_usuario ?? "anonymous"),
    standardHeaders: true,
    legacyHeaders: false,
    store: deleteRateLimitStore,
    message: "Demasiados intentos de eliminación, intentá de nuevo en un minuto",
    handler: (request, response) => {
        const error = new AppError("Demasiados intentos de eliminación, intentá de nuevo en un minuto", 429);
        response.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    },
});
export async function getRateLimitInfo(id_usuario) {
    const rateInfo = await uploadRateLimitStore.get(String(id_usuario));
    const used = rateInfo?.totalHits ?? 0;
    return {
        max_por_mes: rateLimitConfig.max_por_mes,
        usadas: used,
        restantes: Math.max(0, rateLimitConfig.max_por_mes - used),
        resetTime: rateInfo?.resetTime ?? getCurrentMonthEnd(),
    };
}
export function rateLimitMiddleware(req, res, next) {
    uploadLimiter(req, res, next);
}
export function deleteRateLimitMiddleware(req, res, next) {
    deleteLimiter(req, res, next);
}
//# sourceMappingURL=rate-limit.middleware.js.map