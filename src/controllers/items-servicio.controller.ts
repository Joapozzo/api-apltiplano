import type { Request, Response } from "express";
import {
  ItemsServicioService,
  type ItemServicioFilters,
} from "../services/items-servicio.service.js";
import type { ApiErrorResponse } from "../types/api.types.js";

export class ItemsServicioController {
  static async getAll(req: Request, res: Response) {
    try {
      const filters = {
        activo: req.query.activo
          ? req.query.activo === "true"
          : undefined,
        es_adicional: req.query.es_adicional
          ? req.query.es_adicional === "true"
          : undefined,
        categoria: req.query.categoria as string | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      };

      const result = await ItemsServicioService.getAll(filters as ItemServicioFilters);
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener items de servicio",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await ItemsServicioService.getById(parseInt(id));
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener item",
      };
      const status = error.message === "Item de servicio no encontrado" ? 404 : 500;
      res.status(status).json(errorResponse);
    }
  }

  static async getSuggestions(req: Request, res: Response) {
    try {
      const search = req.query.search as string | undefined;
      const result = await ItemsServicioService.getSuggestions(search);
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener sugerencias",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const result = await ItemsServicioService.create(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al crear item",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await ItemsServicioService.update(parseInt(id), req.body);
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al actualizar item",
      };
      const status = error.message === "Item de servicio no encontrado" ? 404 : 500;
      res.status(status).json(errorResponse);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await ItemsServicioService.delete(parseInt(id));
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al eliminar item",
      };
      const status = error.message?.includes("no encontrado") || error.message?.includes("usado") ? 400 : 500;
      res.status(status).json(errorResponse);
    }
  }
}

