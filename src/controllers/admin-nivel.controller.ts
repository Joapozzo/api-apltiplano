import type { Request, Response } from "express";
import { ZodError } from "zod";
import { asyncHandler } from "../middlewares/error-handler.js";
import { parseParamId } from "../utils/express-helpers.js";
import { AppError } from "../utils/app-error.js";
import {
  createOpcionNivelSchema,
  createPreguntaNivelSchema,
  evaluacionesListQuerySchema,
  previewNivelSchema,
  updateOpcionNivelSchema,
  updatePreguntaNivelSchema,
} from "../types/nivel.dto.js";
import {
  createOpcion,
  createPregunta,
  getCuestionarioAdmin,
  listEvaluaciones,
  previewNivel,
  recalcularRangosDificultades,
  toHttpError,
  updateOpcion,
  updatePregunta,
} from "../services/nivel/nivel-cuestionario.service.js";

function zodErrorResponse(error: ZodError) {
  return {
    success: false as const,
    error: error.issues[0]?.message ?? "Datos inválidos",
    details: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
  };
}

function parseId(req: Request, param = "id"): number {
  const raw = parseParamId(req.params[param]);
  if (!raw) throw new AppError("ID requerido", 400);
  const id = parseInt(raw, 10);
  if (Number.isNaN(id)) throw new AppError("ID inválido", 400);
  return id;
}

async function handleNivelError(error: unknown, res: Response) {
  try {
    const mapped = toHttpError(error);
    res.status(mapped.status).json({ success: false, error: mapped.message, code: mapped.code });
  } catch {
    throw error;
  }
}

export class AdminNivelController {
  static getCuestionario = asyncHandler(async (_req: Request, res: Response) => {
    try {
      res.json(await getCuestionarioAdmin());
    } catch (error) {
      await handleNivelError(error, res);
    }
  });

  static preview = asyncHandler(async (req: Request, res: Response) => {
    try {
      const parsed = previewNivelSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(zodErrorResponse(parsed.error));
        return;
      }
      res.json(await previewNivel(parsed.data));
    } catch (error) {
      await handleNivelError(error, res);
    }
  });

  static listEvaluaciones = asyncHandler(async (req: Request, res: Response) => {
    try {
      const parsed = evaluacionesListQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json(zodErrorResponse(parsed.error));
        return;
      }
      res.json(
        await listEvaluaciones({
          page: parsed.data.page,
          limit: parsed.data.limit,
          ...(parsed.data.email ? { email: parsed.data.email } : {}),
        }),
      );
    } catch (error) {
      await handleNivelError(error, res);
    }
  });

  static recalcularRangos = asyncHandler(async (_req: Request, res: Response) => {
    try {
      res.json(await recalcularRangosDificultades());
    } catch (error) {
      await handleNivelError(error, res);
    }
  });

  static createPregunta = asyncHandler(async (req: Request, res: Response) => {
    try {
      const parsed = createPreguntaNivelSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(zodErrorResponse(parsed.error));
        return;
      }
      const d = parsed.data;
      const result = await createPregunta({
        codigo: d.codigo,
        enunciado: d.enunciado,
        ...(d.orden !== undefined ? { orden: d.orden } : {}),
        ...(d.grupo !== undefined ? { grupo: d.grupo } : {}),
        ...(d.obligatoria !== undefined ? { obligatoria: d.obligatoria } : {}),
        ...(d.activa !== undefined ? { activa: d.activa } : {}),
      });
      res.status(201).json(result);
    } catch (error) {
      await handleNivelError(error, res);
    }
  });

  static updatePregunta = asyncHandler(async (req: Request, res: Response) => {
    try {
      const id = parseId(req);
      const parsed = updatePreguntaNivelSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(zodErrorResponse(parsed.error));
        return;
      }
      const d = parsed.data;
      res.json(
        await updatePregunta(id, {
          ...(d.enunciado !== undefined ? { enunciado: d.enunciado } : {}),
          ...(d.orden !== undefined ? { orden: d.orden } : {}),
          ...(d.grupo !== undefined ? { grupo: d.grupo } : {}),
          ...(d.obligatoria !== undefined ? { obligatoria: d.obligatoria } : {}),
          ...(d.activa !== undefined ? { activa: d.activa } : {}),
        }),
      );
    } catch (error) {
      await handleNivelError(error, res);
    }
  });

  static createOpcion = asyncHandler(async (req: Request, res: Response) => {
    try {
      const idPregunta = parseId(req, "idPregunta");
      const parsed = createOpcionNivelSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(zodErrorResponse(parsed.error));
        return;
      }
      const d = parsed.data;
      const result = await createOpcion(idPregunta, {
        codigo: d.codigo,
        texto: d.texto,
        ...(d.puntos !== undefined ? { puntos: d.puntos } : {}),
        ...(d.orden !== undefined ? { orden: d.orden } : {}),
        ...(d.activa !== undefined ? { activa: d.activa } : {}),
      });
      res.status(201).json(result);
    } catch (error) {
      await handleNivelError(error, res);
    }
  });

  static updateOpcion = asyncHandler(async (req: Request, res: Response) => {
    try {
      const id = parseId(req);
      const parsed = updateOpcionNivelSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(zodErrorResponse(parsed.error));
        return;
      }
      const d = parsed.data;
      res.json(
        await updateOpcion(id, {
          ...(d.texto !== undefined ? { texto: d.texto } : {}),
          ...(d.puntos !== undefined ? { puntos: d.puntos } : {}),
          ...(d.orden !== undefined ? { orden: d.orden } : {}),
          ...(d.activa !== undefined ? { activa: d.activa } : {}),
        }),
      );
    } catch (error) {
      await handleNivelError(error, res);
    }
  });
}
