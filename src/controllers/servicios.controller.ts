import type { Request, Response } from "express";
import { ServiciosService, type ServicioFilters } from "../services/servicios.service.js";
import { parseParamId } from "../utils/express-helpers.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";

export class ServiciosController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      activo: req.query.activo ? req.query.activo === "true" : undefined,
      destacado: req.query.destacado ? req.query.destacado === "true" : undefined,
      lugar: req.query.lugar ? parseInt(req.query.lugar as string) : undefined,
      actividad: req.query.actividad ? parseInt(req.query.actividad as string) : undefined,
      dificultad: req.query.dificultad ? parseInt(req.query.dificultad as string) : undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
    };

    const result = await ServiciosService.getAll(filters as ServicioFilters);
    res.json(result);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseParamId(req.params.id);
    if (!id) throw new AppError("ID es requerido", 400);

    const result = await ServiciosService.getById(parseInt(id));
    res.json(result);
  });

  static getActive = asyncHandler(async (_req: Request, res: Response) => {
    const result = await ServiciosService.getActive();
    res.json(result);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const result = await ServiciosService.create(req.body);
    res.status(201).json(result);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseParamId(req.params.id);
    if (!id) throw new AppError("ID es requerido", 400);

    const result = await ServiciosService.update(parseInt(id), req.body);
    res.json(result);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseParamId(req.params.id);
    if (!id) throw new AppError("ID es requerido", 400);

    const result = await ServiciosService.delete(parseInt(id));
    res.json(result);
  });

  static toggleActivo = asyncHandler(async (req: Request, res: Response) => {
    const id = parseParamId(req.params.id);
    if (!id) throw new AppError("ID es requerido", 400);

    const result = await ServiciosService.toggleActivo(parseInt(id));
    res.json(result);
  });

  static toggleDestacado = asyncHandler(async (req: Request, res: Response) => {
    const id = parseParamId(req.params.id);
    if (!id) throw new AppError("ID es requerido", 400);

    const result = await ServiciosService.toggleDestacado(parseInt(id));
    res.json(result);
  });

  static updateItinerarios = asyncHandler(async (req: Request, res: Response) => {
    const id = parseParamId(req.params.id);
    if (!id) throw new AppError("ID es requerido", 400);

    const result = await ServiciosService.updateItinerarios(parseInt(id), req.body);
    res.json(result);
  });
}
