import type { Request, Response } from "express";
import { z } from "zod";
import { ConfigService } from "../services/config.service.js";
import type { ApiSuccessResponse } from "../types/api.types.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../middlewares/error-handler.js";
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
      }),
    )
    .min(1)
    .max(50),
});

export class ConfigController {
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const config = await ConfigService.getAll();
    res.json({
      success: true,
      data: config,
    } as ApiSuccessResponse<typeof config>);
  });

  static getByClave = asyncHandler(async (req: Request, res: Response) => {
    const clave = parseParamId(req.params.clave);
    if (!clave) throw new AppError("Clave requerida", 400);

    const config = await ConfigService.getByClave(clave);
    if (!config) throw new AppError("Configuración no encontrada", 404);

    res.json({
      success: true,
      data: config,
    } as ApiSuccessResponse<typeof config>);
  });

  static set = asyncHandler(async (req: Request, res: Response) => {
    const clave = parseParamId(req.params.clave);
    if (!clave) throw new AppError("Clave requerida", 400);

    const parsed = patchSingleSchema.parse(req.body);
    const updated = await ConfigService.set(clave, parsed.valor);

    res.json({
      success: true,
      data: updated,
    } as ApiSuccessResponse<typeof updated>);
  });

  static setBatch = asyncHandler(async (req: Request, res: Response) => {
    const parsed = patchBatchSchema.parse(req.body);
    const updated = await ConfigService.setBatch(parsed.items);

    res.json({
      success: true,
      data: updated,
      message: `Se actualizaron ${updated.length} configuraciones`,
    } as ApiSuccessResponse<typeof updated>);
  });
}
