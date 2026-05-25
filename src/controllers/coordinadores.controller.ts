import type { Request, Response } from "express";
import { issueCsrfToken } from "../middlewares/csrf.js";
import { CoordinadoresService } from "../services/coordinadores.service.js";
import { z } from "zod";
import { parseParamId } from "../utils/express-helpers.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";

const createCoordinadorSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  dni: z.string().min(1, "El DNI es requerido"),
  certificaciones: z.array(z.string()).optional(),
  especialidades: z.array(z.string()).optional(),
});

const updateCoordinadorSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  dni: z.string().min(1).optional(),
  certificaciones: z.array(z.string()).optional(),
  especialidades: z.array(z.string()).optional(),
  activo: z.boolean().optional(),
});

const asignarExpedicionSchema = z.object({
  id_expedicion: z.number().int().positive("ID de expedición inválido"),
  rol: z.string().min(1, "El rol es requerido"),
});

function parseId(req: Request): number {
  const paramId = parseParamId(req.params.id);
  if (!paramId) throw new AppError("ID inválido", 400);
  const id = parseInt(paramId, 10);
  if (isNaN(id)) throw new AppError("ID inválido", 400);
  return id;
}

export class CoordinadoresController {
  static list = asyncHandler(async (req: Request, res: Response) => {
    const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const filters: { activo?: boolean; search?: string } = {};
    if (activo !== undefined) filters.activo = activo;
    if (search) filters.search = search;

    const result = await CoordinadoresService.list(filters);
    const csrfToken = issueCsrfToken(req, res);

    res.json({ ...result, csrfToken });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req);
    const result = await CoordinadoresService.getById(id);
    res.json(result);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const parsed = createCoordinadorSchema.parse(req.body);
    const result = await CoordinadoresService.create({
      nombre: parsed.nombre,
      apellido: parsed.apellido,
      dni: parsed.dni,
      ...(parsed.certificaciones !== undefined && { certificaciones: parsed.certificaciones }),
      ...(parsed.especialidades !== undefined && { especialidades: parsed.especialidades }),
    });

    res.status(201).json(result);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req);
    const parsed = updateCoordinadorSchema.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (parsed.nombre !== undefined) updateData.nombre = parsed.nombre;
    if (parsed.apellido !== undefined) updateData.apellido = parsed.apellido;
    if (parsed.dni !== undefined) updateData.dni = parsed.dni;
    if (parsed.certificaciones !== undefined) updateData.certificaciones = parsed.certificaciones;
    if (parsed.especialidades !== undefined) updateData.especialidades = parsed.especialidades;
    if (parsed.activo !== undefined) updateData.activo = parsed.activo;
    const result = await CoordinadoresService.update(id, updateData as any);
    res.json(result);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req);
    const result = await CoordinadoresService.delete(id);
    res.json(result);
  });

  static asignarAExpedicion = asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req);
    const parsed = asignarExpedicionSchema.parse(req.body);
    const result = await CoordinadoresService.asignarAExpedicion(id, parsed);
    res.json(result);
  });

  static desasignarDeExpedicion = asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req);
    const paramIdExp = parseParamId(req.params.id_expedicion);
    if (!paramIdExp) throw new AppError("ID de expedición inválido", 400);
    const id_expedicion = parseInt(paramIdExp, 10);
    if (isNaN(id_expedicion)) throw new AppError("ID de expedición inválido", 400);

    const result = await CoordinadoresService.desasignarDeExpedicion(id, id_expedicion);
    res.json(result);
  });

  static getHistorial = asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req);
    const result = await CoordinadoresService.getHistorial(id);
    res.json(result);
  });
}
