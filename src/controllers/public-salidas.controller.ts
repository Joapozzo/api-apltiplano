import type { Request, Response } from "express";
import { PublicSalidasService } from "../services/public-salidas.service.js";
import type { ApiErrorResponse } from "../types/api.types.js";
import {
  publicCatalogQuerySchema,
  salidaDetalleQuerySchema,
  salidaIdentificadorParamSchema,
  salidasCalendarioQuerySchema,
} from "../types/public-salidas.dto.js";

export class PublicSalidasController {
  static async list(req: Request, res: Response) {
    const parsed = publicCatalogQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const err: ApiErrorResponse = {
        success: false,
        error: "Parámetros inválidos",
        message: parsed.error.issues.map((i) => i.message).join("; "),
      };
      return res.status(400).json(err);
    }

    try {
      const result = await PublicSalidasService.list(parsed.data);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al listar salidas";
      const err: ApiErrorResponse = { success: false, error: message };
      res.status(500).json(err);
    }
  }

  static async calendario(req: Request, res: Response) {
    const parsed = salidasCalendarioQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const err: ApiErrorResponse = {
        success: false,
        error: "Parámetros inválidos",
        message: parsed.error.issues.map((i) => i.message).join("; "),
      };
      return res.status(400).json(err);
    }

    try {
      const result = await PublicSalidasService.calendarioPorAnio(parsed.data);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al obtener calendario";
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

    const queryParsed = salidaDetalleQuerySchema.safeParse(req.query);
    if (!queryParsed.success) {
      const err: ApiErrorResponse = {
        success: false,
        error: "Query inválida",
        message: queryParsed.error.issues.map((i) => i.message).join("; "),
      };
      return res.status(400).json(err);
    }

    try {
      const result = await PublicSalidasService.getDetalle(paramParsed.data, queryParsed.data.id_expedicion);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al obtener salida";
      const err: ApiErrorResponse = { success: false, error: message };
      const status = message === "Salida no encontrada" ? 404 : 500;
      res.status(status).json(err);
    }
  }
}
