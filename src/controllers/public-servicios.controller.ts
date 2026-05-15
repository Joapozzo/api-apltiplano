import type { Request, Response } from "express";
import { PublicServiciosService } from "../services/public-servicios.service.js";
import type { ApiErrorResponse } from "../types/api.types.js";
import {
  serviciosCatalogQuerySchema,
  salidaIdentificadorParamSchema,
} from "../types/public-salidas.dto.js";

export class PublicServiciosController {
  static async list(req: Request, res: Response) {
    const parsed = serviciosCatalogQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const err: ApiErrorResponse = {
        success: false,
        error: "Parámetros inválidos",
        message: parsed.error.issues.map((i) => i.message).join("; "),
      };
      return res.status(400).json(err);
    }

    try {
      const result = await PublicServiciosService.listCatalog(parsed.data);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al listar servicios";
      const err: ApiErrorResponse = { success: false, error: message };
      res.status(500).json(err);
    }
  }

  static async getByIdentificador(req: Request, res: Response) {
    const paramParsed = salidaIdentificadorParamSchema.safeParse(req.params.identificador);
    if (!paramParsed.success) {
      const err: ApiErrorResponse = {
        success: false,
        error: "Identificador inválido",
        message: paramParsed.error.issues.map((i) => i.message).join("; "),
      };
      return res.status(400).json(err);
    }

    try {
      const result = await PublicServiciosService.getByIdentificador(paramParsed.data);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al obtener servicio";
      const err: ApiErrorResponse = { success: false, error: message };
      const status = message === "Servicio no encontrado" ? 404 : 500;
      res.status(status).json(err);
    }
  }
}
