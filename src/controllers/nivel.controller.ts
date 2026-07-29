import type { Request, Response } from "express";
import { ZodError } from "zod";
import { asyncHandler } from "../middlewares/error-handler.js";
import { evaluarNivelSchema } from "../types/nivel.dto.js";
import {
  evaluarNivel,
  getCuestionarioPublico,
  toHttpError,
} from "../services/nivel/nivel-cuestionario.service.js";

function zodErrorResponse(error: ZodError) {
  return {
    success: false as const,
    error: error.issues[0]?.message ?? "Datos inválidos",
    details: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
  };
}

export class NivelController {
  static getCuestionario = asyncHandler(async (_req: Request, res: Response) => {
    try {
      const result = await getCuestionarioPublico();
      res.json(result);
    } catch (error) {
      const mapped = toHttpError(error);
      res.status(mapped.status).json({ success: false, error: mapped.message, code: mapped.code });
    }
  });

  static evaluar = asyncHandler(async (req: Request, res: Response) => {
    try {
      const parsed = evaluarNivelSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(zodErrorResponse(parsed.error));
        return;
      }
      const result = await evaluarNivel(parsed.data);
      res.status(201).json(result);
    } catch (error) {
      try {
        const mapped = toHttpError(error);
        res.status(mapped.status).json({ success: false, error: mapped.message, code: mapped.code });
      } catch {
        throw error;
      }
    }
  });
}
