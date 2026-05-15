import type { Request, Response } from "express";
import { CatalogosService } from "../services/catalogos.service.js";
import type { ApiErrorResponse } from "../types/api.types.js";

export class CatalogosController {
  static async getLugares(req: Request, res: Response) {
    try {
      const result = await CatalogosService.getLugares();
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener lugares",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async getActividades(req: Request, res: Response) {
    try {
      const result = await CatalogosService.getActividades();
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener actividades",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async getDificultades(req: Request, res: Response) {
    try {
      const result = await CatalogosService.getDificultades();
      res.json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener dificultades",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const [lugares, actividades, dificultades] = await Promise.all([
        CatalogosService.getLugares(),
        CatalogosService.getActividades(),
        CatalogosService.getDificultades(),
      ]);

      res.json({
        success: true,
        data: {
          lugares: lugares.data,
          actividades: actividades.data,
          dificultades: dificultades.data,
        },
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener catálogos",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async createLugar(req: Request, res: Response) {
    try {
      const result = await CatalogosService.createLugar(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al crear lugar",
      };
      const status = error.message?.includes("obligatorio") ? 400 : 500;
      res.status(status).json(errorResponse);
    }
  }

  static async createActividad(req: Request, res: Response) {
    try {
      const result = await CatalogosService.createActividad(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al crear actividad",
      };
      const status = error.message?.includes("obligatorio") ? 400 : 500;
      res.status(status).json(errorResponse);
    }
  }
}

