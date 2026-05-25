import type { Request, Response } from "express";
import { z } from "zod";
import { AuthService, AuthServiceError } from "../services/auth.service.js";
import { extractBearerToken } from "../utils/auth-header.js";
import { issueCsrfToken } from "../middlewares/csrf.js";

const registerSchema = z.object({
  nombre: z.string().trim().optional(),
  apellido: z.string().trim().optional(),
  username: z.string().trim().min(1).optional(),
});

export class AuthController {
  /** Bootstrap CSRF (cookie + token) sin requerir sesión Firebase. */
  static async csrf(req: Request, res: Response) {
    const csrfToken = issueCsrfToken(req, res);
    return res.json({ success: true, csrfToken });
  }

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

      const csrfToken = issueCsrfToken(req, res);
      
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
      
      const csrfToken = issueCsrfToken(req, res);
      
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
