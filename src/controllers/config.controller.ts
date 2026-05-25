import type { Request, Response } from "express";
import { z } from "zod";
import { ConfigService, ConfigServiceError } from "../services/config.service.js";
import type { ApiSuccessResponse, ApiErrorResponse } from "../types/api.types.js";
import { parseParamId } from "../utils/express-helpers.js";

const patchSingleSchema = z.object({
  valor: z.union([z.string(), z.number(), z.boolean()]).transform(String),
});

const patchBatchSchema = z.object({
  items: z
    .array(
      z.object({
        clave: z.string(),
        valor: z.union([z.string(), z.number(), z.boolean()]).transform(String),
      })
    )
    .min(1)
    .max(50),
});

function handleError(error: unknown, res: Response, fallback: string) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: "Datos inválidos",
      code: "INVALID_PAYLOAD",
    });
  }

  if (error instanceof ConfigServiceError) {
    return res.status(error.status).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  console.error("Config controller error:", error);
  return res.status(500).json({
    success: false,
    error: fallback,
  });
}

export class ConfigController {
  static async getAll(req: Request, res: Response) {
    try {
      const config = await ConfigService.getAll();
      res.json({
        success: true,
        data: config,
      } as ApiSuccessResponse<typeof config>);
    } catch (error) {
      handleError(error, res, "Error al obtener configuración");
    }
  }

  static async getByClave(req: Request, res: Response) {
    try {
      const clave = parseParamId(req.params.clave);
      if (!clave) {
        return res.status(400).json({ success: false, error: "Clave requerida" });
      }
      const config = await ConfigService.getByClave(clave);

      if (!config) {
        return res.status(404).json({
          success: false,
          error: "Configuración no encontrada",
          code: "NOT_FOUND",
        } as ApiErrorResponse);
      }

      res.json({
        success: true,
        data: config,
      } as ApiSuccessResponse<typeof config>);
    } catch (error) {
      handleError(error, res, "Error al obtener configuración");
    }
  }

  static async set(req: Request, res: Response) {
    try {
      const clave = parseParamId(req.params.clave);
      if (!clave) {
        return res.status(400).json({ success: false, error: "Clave requerida" });
      }
      const parsed = patchSingleSchema.parse(req.body);
      const updated = await ConfigService.set(clave, parsed.valor);

      res.json({
        success: true,
        data: updated,
      } as ApiSuccessResponse<typeof updated>);
    } catch (error) {
      handleError(error, res, "Error al actualizar configuración");
    }
  }

  static async setBatch(req: Request, res: Response) {
    try {
      const parsed = patchBatchSchema.parse(req.body);
      const updated = await ConfigService.setBatch(parsed.items);

      res.json({
        success: true,
        data: updated,
        message: `Se actualizaron ${updated.length} configuraciones`,
      } as ApiSuccessResponse<typeof updated>);
    } catch (error) {
      handleError(error, res, "Error al actualizar configuración");
    }
  }
}