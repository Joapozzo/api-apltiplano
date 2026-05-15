import crypto from "crypto";
const CSRF_SECRET = process.env.CSRF_SECRET || "altiplano-csrf-secret-change-in-production";
export function generateCsrfToken() {
    const token = crypto.randomBytes(32).toString("hex");
    const signature = crypto
        .createHmac("sha256", CSRF_SECRET)
        .update(token)
        .digest("hex");
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
    const expectedSignature = crypto
        .createHmac("sha256", CSRF_SECRET)
        .update(tokenPart, "utf8")
        .digest("hex");
    return signaturePart === expectedSignature;
}
export function csrfMiddleware(req, res, next) {
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    if (safeMethods.includes(req.method)) {
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