import type { Request, Response } from "express";
import { ExpedicionesService, type ExpedicionFilters } from "../services/expediciones.service.js";
import type { ApiErrorResponse } from "../types/api.types.js";

export class ExpedicionesController {
  static async getAll(req: Request, res: Response) {
    try {
      const filters = {
        estado: req.query.estado as string | undefined,
        servicio: req.query.servicio
          ? parseInt(req.query.servicio as string)
          : undefined,
        fecha_desde: req.query.fecha_desde as string | undefined,
        fecha_hasta: req.query.fecha_hasta as string | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      };

      const result = await ExpedicionesService.getAll(filters as ExpedicionFilters);
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener expediciones",
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

      const result = await ExpedicionesService.getById(parseInt(id));
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener expedición",
      };
      const status = error.message === "Expedición no encontrada" ? 404 : 500;
      res.status(status).json(errorResponse);
    }
  }

  static async getActive(req: Request, res: Response) {
    try {
      const result = await ExpedicionesService.getActive();
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener expediciones activas",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = req.body;

      // Validaciones básicas
      if (!data.id_servicio) {
        return res.status(400).json({
          success: false,
          error: "El servicio es requerido",
        });
      }

      if (!data.fecha_salida || !data.fecha_fin) {
        return res.status(400).json({
          success: false,
          error: "Las fechas de salida y fin son requeridas",
        });
      }

      if (!data.cupos_disponibles || data.cupos_disponibles < 1) {
        return res.status(400).json({
          success: false,
          error: "Los cupos disponibles deben ser al menos 1",
        });
      }

      if (!data.precios || data.precios.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Debe agregar al menos un precio",
        });
      }

      const result = await ExpedicionesService.create(data);
      res.status(201).json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al crear expedición",
      };
      res.status(400).json(errorResponse);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID es requerido",
        });
      }

      // Validaciones básicas
      if (!data.id_servicio) {
        return res.status(400).json({
          success: false,
          error: "El servicio es requerido",
        });
      }

      if (!data.fecha_salida || !data.fecha_fin) {
        return res.status(400).json({
          success: false,
          error: "Las fechas de salida y fin son requeridas",
        });
      }

      const result = await ExpedicionesService.update(parseInt(id), data);
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al actualizar expedición",
      };
      const status = error.message === "Expedición no encontrada" ? 404 : 400;
      res.status(status).json(errorResponse);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID es requerido",
        });
      }

      const result = await ExpedicionesService.delete(parseInt(id));
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al eliminar expedición",
      };
      const status = error.message === "Expedición no encontrada" ? 404 : 400;
      res.status(status).json(errorResponse);
    }
  }

  static async changeEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID es requerido",
        });
      }

      if (!estado) {
        return res.status(400).json({
          success: false,
          error: "El estado es requerido",
        });
      }

      const result = await ExpedicionesService.changeEstado(parseInt(id), estado);
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al cambiar estado",
      };
      const status = error.message === "Expedición no encontrada" ? 404 : 400;
      res.status(status).json(errorResponse);
    }
  }

  static async recalcularCupos(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID es requerido",
        });
      }

      const result = await ExpedicionesService.recalcularCupos(parseInt(id));
      res.json({
        success: true,
        data: result,
        message: "Cupos recalculados exitosamente",
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al recalcular cupos",
      };
      res.status(500).json(errorResponse);
    }
  }
}
