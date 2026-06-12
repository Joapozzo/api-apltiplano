import type { NextFunction, Request, Response } from "express";
import { AuthService, AuthServiceError } from "../services/auth.service.js";
import { extractBearerToken } from "../utils/auth-header.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req.header("authorization"));

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Falta el token Bearer de Firebase",
        code: "MISSING_BEARER_TOKEN",
      });
    }

    const { auth, profile } = await AuthService.authenticateRequest(token);
    req.auth = auth;
    req.authUser = profile;
    next();
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return res.status(error.status).json({
        success: false,
        error: error.message,
        code: error.code,
      });
    }

    return res.status(500).json({
      success: false,
      error: "No se pudo autenticar la solicitud",
    });
  }
}
