import type { Request, Response } from "express";
import { ServiciosService, type ServicioFilters } from "../services/servicios.service.js";
import type { ApiErrorResponse } from "../types/api.types.js";
import { parseParamId } from "../utils/express-helpers.js";

export class ServiciosController {
  static async getAll(req: Request, res: Response) {
    try {
      const filters = {
        activo: req.query.activo
          ? req.query.activo === "true"
          : undefined,
        destacado: req.query.destacado
          ? req.query.destacado === "true"
          : undefined,
        lugar: req.query.lugar
          ? parseInt(req.query.lugar as string)
          : undefined,
        actividad: req.query.actividad
          ? parseInt(req.query.actividad as string)
          : undefined,
        dificultad: req.query.dificultad
          ? parseInt(req.query.dificultad as string)
          : undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      };

      const result = await ServiciosService.getAll(filters as ServicioFilters);
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener servicios",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);

      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await ServiciosService.getById(parseInt(id));
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener servicio",
      };
      const status = error.message === "Servicio no encontrado" ? 404 : 500;
      res.status(status).json(errorResponse);
    }
  }

  static async getActive(req: Request, res: Response) {
    try {
      const result = await ServiciosService.getActive();
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener servicios activos",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const result = await ServiciosService.create(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al crear servicio",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);
      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await ServiciosService.update(parseInt(id), req.body);
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al actualizar servicio",
      };
      const status = error.message === "Servicio no encontrado" ? 404 : 500;
      res.status(status).json(errorResponse);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);
      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await ServiciosService.delete(parseInt(id));
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al eliminar servicio",
      };
      const status = error.message?.includes("no encontrado") ? 404 : 500;
      res.status(status).json(errorResponse);
    }
  }

  static async toggleActivo(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);
      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await ServiciosService.toggleActivo(parseInt(id));
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al actualizar estado",
      };
      const status = error.message === "Servicio no encontrado" ? 404 : 500;
      res.status(status).json(errorResponse);
    }
  }

  static async toggleDestacado(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);
      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await ServiciosService.toggleDestacado(parseInt(id));
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al actualizar destacado",
      };
      const status = error.message === "Servicio no encontrado" ? 404 : 500;
      res.status(status).json(errorResponse);
    }
  }
}

