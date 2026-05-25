import type { Request, Response } from "express";
import { z } from "zod";
import {
  getAllUbicaciones,
  getUbicacionById,
  createUbicacion,
  updateUbicacion,
  toggleUbicacionActivo,
  deleteUbicacion,
  getAllLugares,
  getLugarById,
  createLugar,
  updateLugar,
  toggleLugarActivo,
  deleteLugar,
  getAllActividades,
  getActividadById,
  createActividad,
  updateActividad,
  toggleActividadActivo,
  deleteActividad,
  getAllDificultades,
  getDificultadById,
  createDificultad,
  updateDificultad,
  toggleDificultadActivo,
  deleteDificultad,
  getCatalogosCompletos,
} from "../services/catalogos.service.js";
import {
  createActividadSchema,
  createDificultadSchema,
  createLugarSchema,
  createUbicacionSchema,
} from "../types/catalogos.dto.js";
import { CatalogosServiceError } from "../utils/catalog-referential.js";
import { parseParamId } from "../utils/express-helpers.js";

function parseIdParam(req: Request, res: Response): number | null {
  const idParam = parseParamId(req.params.id);
  if (!idParam) {
    res.status(400).json({ success: false, error: "ID requerido" });
    return null;
  }
  const id = parseInt(idParam);
  if (isNaN(id)) {
    res.status(400).json({ success: false, error: "ID inválido" });
    return null;
  }
  return id;
}

function handleError(error: unknown, res: Response, fallback: string) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: error.issues[0]?.message ?? "Datos inválidos",
      code: "INVALID_PAYLOAD",
    });
  }

  if (error instanceof CatalogosServiceError) {
    return res.status(error.status).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  console.error("Catalogos controller error:", error);
  return res.status(500).json({ success: false, error: fallback });
}

// ============ CATÁLOGO COMPLETO ============

export class CatalogosController {
  static async getAll(_req: Request, res: Response) {
    try {
      const result = await getCatalogosCompletos();
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener catálogos");
    }
  }

  // ============ UBICACIONES ============

  static async getUbicaciones(req: Request, res: Response) {
    try {
      const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
      const result = await getAllUbicaciones(activo);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener ubicaciones");
    }
  }

  static async getUbicacionById(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await getUbicacionById(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener ubicación");
    }
  }

  static async createUbicacion(req: Request, res: Response) {
    try {
      const payload = createUbicacionSchema.parse(req.body);
      const result = await createUbicacion({
        pais: payload.pais,
        provincia: payload.provincia,
        zona: payload.zona,
        ...(payload.orden !== undefined ? { orden: payload.orden } : {}),
      });
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res, "Error al crear ubicación");
    }
  }

  static async updateUbicacion(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const data = req.body as Record<string, unknown>;
      const updateData: Record<string, unknown> = {};
      if (typeof data.pais === "string") updateData.pais = data.pais;
      if (typeof data.provincia === "string") updateData.provincia = data.provincia;
      if (typeof data.zona === "string") updateData.zona = data.zona;
      if (typeof data.orden === "number") updateData.orden = data.orden;
      if (typeof data.activo === "boolean") updateData.activo = data.activo;
      const result = await updateUbicacion(id, updateData as Parameters<typeof updateUbicacion>[1]);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al actualizar ubicación");
    }
  }

  static async toggleUbicacionActivo(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await toggleUbicacionActivo(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al cambiar estado");
    }
  }

  static async deleteUbicacion(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await deleteUbicacion(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al eliminar ubicación");
    }
  }

  // ============ LUGARES ============

  static async getLugares(req: Request, res: Response) {
    try {
      const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
      const id_ubicacion = req.query.id_ubicacion ? parseInt(req.query.id_ubicacion as string) : undefined;
      const result = await getAllLugares(activo, id_ubicacion);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener lugares");
    }
  }

  static async getLugarById(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await getLugarById(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener lugar");
    }
  }

  static async createLugar(req: Request, res: Response) {
    try {
      const payload = createLugarSchema.parse(req.body);
      const result = await createLugar({
        nombre: payload.nombre,
        ...(payload.id_ubicacion !== undefined ? { id_ubicacion: payload.id_ubicacion } : {}),
        ...(payload.tipo_lugar !== undefined ? { tipo_lugar: payload.tipo_lugar } : {}),
        ...(payload.altitud !== undefined ? { altitud: payload.altitud } : {}),
        ...(payload.descripcion !== undefined ? { descripcion: payload.descripcion } : {}),
        ...(payload.orden !== undefined ? { orden: payload.orden } : {}),
      });
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res, "Error al crear lugar");
    }
  }

  static async updateLugar(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const data = req.body as Record<string, unknown>;
      const updateData: Record<string, unknown> = {};
      if (typeof data.nombre === "string") updateData.nombre = data.nombre;
      if (typeof data.id_ubicacion === "number") updateData.id_ubicacion = data.id_ubicacion;
      if (typeof data.tipo_lugar === "string") updateData.tipo_lugar = data.tipo_lugar;
      if (typeof data.altitud === "number") updateData.altitud = data.altitud;
      if (typeof data.descripcion === "string") updateData.descripcion = data.descripcion;
      if (typeof data.orden === "number") updateData.orden = data.orden;
      if (typeof data.activo === "boolean") updateData.activo = data.activo;
      const result = await updateLugar(id, updateData);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al actualizar lugar");
    }
  }

  static async toggleLugarActivo(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await toggleLugarActivo(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al cambiar estado");
    }
  }

  static async deleteLugar(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await deleteLugar(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al eliminar lugar");
    }
  }

  // ============ ACTIVIDADES ============

  static async getActividades(req: Request, res: Response) {
    try {
      const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
      const result = await getAllActividades(activo);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener actividades");
    }
  }

  static async getActividadById(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await getActividadById(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener actividad");
    }
  }

  static async createActividad(req: Request, res: Response) {
    try {
      const payload = createActividadSchema.parse(req.body);
      const result = await createActividad({
        nombre: payload.nombre,
        ...(payload.descripcion !== undefined ? { descripcion: payload.descripcion } : {}),
        ...(payload.orden !== undefined ? { orden: payload.orden } : {}),
      });
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res, "Error al crear actividad");
    }
  }

  static async updateActividad(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const data = req.body as Record<string, unknown>;
      const updateData: Record<string, unknown> = {};
      if (typeof data.nombre === "string") updateData.nombre = data.nombre;
      if (typeof data.descripcion === "string") updateData.descripcion = data.descripcion;
      if (typeof data.orden === "number") updateData.orden = data.orden;
      if (typeof data.activo === "boolean") updateData.activo = data.activo;
      const result = await updateActividad(id, updateData);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al actualizar actividad");
    }
  }

  static async toggleActividadActivo(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await toggleActividadActivo(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al cambiar estado");
    }
  }

  static async deleteActividad(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await deleteActividad(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al eliminar actividad");
    }
  }

  // ============ DIFICULTADES ============

  static async getDificultades(req: Request, res: Response) {
    try {
      const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
      const result = await getAllDificultades(activo);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener dificultades");
    }
  }

  static async getDificultadById(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await getDificultadById(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al obtener dificultad");
    }
  }

  static async createDificultad(req: Request, res: Response) {
    try {
      const payload = createDificultadSchema.parse(req.body);
      const result = await createDificultad({
        nivel: payload.nivel,
        ...(payload.descripcion !== undefined ? { descripcion: payload.descripcion } : {}),
        ...(payload.orden !== undefined ? { orden: payload.orden } : {}),
      });
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res, "Error al crear dificultad");
    }
  }

  static async updateDificultad(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const data = req.body as Record<string, unknown>;
      const updateData: Record<string, unknown> = {};
      if (typeof data.nivel === "string") updateData.nivel = data.nivel;
      if (typeof data.descripcion === "string") updateData.descripcion = data.descripcion;
      if (typeof data.orden === "number") updateData.orden = data.orden;
      if (typeof data.activo === "boolean") updateData.activo = data.activo;
      const result = await updateDificultad(id, updateData);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al actualizar dificultad");
    }
  }

  static async toggleDificultadActivo(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await toggleDificultadActivo(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al cambiar estado");
    }
  }

  static async deleteDificultad(req: Request, res: Response) {
    try {
      const id = parseIdParam(req, res);
      if (id === null) return;
      const result = await deleteDificultad(id);
      res.json(result);
    } catch (error) {
      handleError(error, res, "Error al eliminar dificultad");
    }
  }
}