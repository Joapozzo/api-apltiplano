import type { Request, Response } from "express";
import { z } from "zod";
import { AuthService, AuthServiceError } from "../services/auth.service.js";
import { extractBearerToken } from "../utils/auth-header.js";
import { generateCsrfToken } from "../middlewares/csrf.js";

const registerSchema = z.object({
  nombre: z.string().trim().optional(),
  apellido: z.string().trim().optional(),
  username: z.string().trim().min(1).optional(),
});

function setCsrfCookie(res: Response) {
  const csrfToken = generateCsrfToken();
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("csrf_token", csrfToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  });
  
  return csrfToken;
}

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const token = extractBearerToken(req.header("authorization"));
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Falta el token Bearer de Firebase",
          code: "MISSING_BEARER_TOKEN",
        });
      }

      const payload = registerSchema.parse(req.body);
      const result = await AuthService.registerWithFirebaseToken(token, {
        ...(payload.nombre ? { nombre: payload.nombre } : {}),
        ...(payload.apellido ? { apellido: payload.apellido } : {}),
        ...(payload.username ? { username: payload.username } : {}),
      });

      const csrfToken = setCsrfCookie(res);
      
      return res.status(result.message.includes("registrado") ? 201 : 200).json({
        ...result,
        csrfToken,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: error.issues[0]?.message ?? "Datos invAlidos",
          code: "INVALID_PAYLOAD",
        });
      }

      if (error instanceof AuthServiceError) {
        return res.status(error.status).json({
          success: false,
          error: error.message,
          code: error.code,
        });
      }

      return res.status(500).json({
        success: false,
        error: "No se pudo registrar el usuario",
      });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const token = extractBearerToken(req.header("authorization"));
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Falta el token Bearer de Firebase",
          code: "MISSING_BEARER_TOKEN",
        });
      }

      const result = await AuthService.getCurrentUser(token);
      
      const csrfToken = setCsrfCookie(res);
      
      return res.json({
        ...result,
        csrfToken,
      });
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
        error: "No se pudo obtener el usuario actual",
      });
    }
  }
}
