import crypto from "crypto";
/**
 * Cookie CSRF first-party por defecto (front → `/api` vía rewrite de Next).
 * Solo `SameSite=None` si el browser pega al API en otro origen (`CSRF_CROSS_ORIGIN=true`).
 */
export function getCsrfCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    const crossOrigin = process.env.CSRF_CROSS_ORIGIN === "true";
    return {
        httpOnly: true,
        secure: crossOrigin || isProduction,
        sameSite: crossOrigin ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
    };
}
/** Cookie httpOnly + token para doble envío (header X-CSRF-Token). */
export function setCsrfCookie(res) {
    const csrfToken = generateCsrfToken();
    res.cookie("csrf_token", csrfToken, getCsrfCookieOptions());
    return csrfToken;
}
const CSRF_SECRET = process.env.CSRF_SECRET;
export function generateCsrfToken() {
    const token = crypto.randomBytes(32).toString("hex");
    const signature = crypto.createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
    return `${token}.${signature}`;
}
export function verifyCsrfToken(token) {
    if (!token)
        return false;
    const parts = token.split(".");
    if (parts.length !== 2)
        return false;
    const [tokenPart, signaturePart] = parts;
    if (!tokenPart || !signaturePart)
        return false;
    const expectedSignature = crypto.createHmac("sha256", CSRF_SECRET).update(tokenPart, "utf8").digest("hex");
    return signaturePart === expectedSignature;
}
/** Reutiliza cookie CSRF válida o emite una nueva (evita carreras entre peticiones paralelas). */
export function issueCsrfToken(req, res) {
    const existing = req.cookies?.csrf_token;
    if (typeof existing === "string" && verifyCsrfToken(existing)) {
        return existing;
    }
    return setCsrfCookie(res);
}
export function csrfMiddleware(req, res, next) {
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    if (safeMethods.includes(req.method)) {
        return next();
    }
    // SPA admin auth uses Firebase Bearer (not auto-sent by browsers). Cookie CSRF
    // fails cross-origin when third-party cookies are blocked; Bearer is enough here.
    const authorization = req.headers.authorization;
    if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
        return next();
    }
    const csrfHeader = req.headers["x-csrf-token"];
    const csrfToken = Array.isArray(csrfHeader) ? csrfHeader[0] : csrfHeader;
    const cookieToken = req.cookies?.csrf_token;
    if (!cookieToken) {
        return res.status(403).json({
            success: false,
            error: "CSRF token no encontrado",
            code: "CSRF_MISSING",
        });
    }
    if (!csrfToken) {
        return res.status(403).json({
            success: false,
            error: "CSRF token no proporcionado",
            code: "CSRF_MISSING_HEADER",
        });
    }
    if (csrfToken !== cookieToken) {
        return res.status(403).json({
            success: false,
            error: "CSRF token inválido",
            code: "CSRF_INVALID",
        });
    }
    next();
}
export function csrfProtection(enabled = true) {
    return enabled ? csrfMiddleware : (_req, _res, next) => next();
}
//# sourceMappingURL=csrf.js.map