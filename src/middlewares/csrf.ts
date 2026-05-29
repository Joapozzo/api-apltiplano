import crypto from "crypto";
import type { CookieOptions } from "express";
import type { Request, Response, NextFunction } from "express";

/** Producción / Vercel: front y API en dominios distintos → SameSite=None + Secure. */
export function getCsrfCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const onVercel = Boolean(process.env.VERCEL);
  const crossOrigin =
    isProduction ||
    onVercel ||
    process.env.CSRF_CROSS_ORIGIN === "true";

  return {
    httpOnly: true,
    secure: crossOrigin || isProduction,
    sameSite: crossOrigin ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  };
}

/** Cookie httpOnly + token para doble envío (header X-CSRF-Token). */
export function setCsrfCookie(res: Response): string {
  const csrfToken = generateCsrfToken();
  res.cookie("csrf_token", csrfToken, getCsrfCookieOptions());
  return csrfToken;
}

const CSRF_SECRET = process.env.CSRF_SECRET!;

export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  const signature = crypto.createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
  return `${token}.${signature}`;
}

export function verifyCsrfToken(token: string): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [tokenPart, signaturePart] = parts;
  if (!tokenPart || !signaturePart) return false;

  const expectedSignature = crypto.createHmac("sha256", CSRF_SECRET).update(tokenPart, "utf8").digest("hex");

  return signaturePart === expectedSignature;
}

/** Reutiliza cookie CSRF válida o emite una nueva (evita carreras entre peticiones paralelas). */
export function issueCsrfToken(req: Request, res: Response): string {
  const existing = req.cookies?.csrf_token;
  if (typeof existing === "string" && verifyCsrfToken(existing)) {
    return existing;
  }
  return setCsrfCookie(res);
}

export function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
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

export function csrfProtection(enabled: boolean = true) {
  return enabled ? csrfMiddleware : (_req: Request, _res: Response, next: NextFunction) => next();
}
