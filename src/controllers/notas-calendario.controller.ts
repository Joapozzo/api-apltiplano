import type { Request, Response } from "express";
import {
  createNota,
  deleteNota,
  getNotaById,
  getNotas,
  getNotasByMes,
  toggleCompletada,
  updateNota,
} from "../services/notas-calendario.service.js";
import { AppError } from "../utils/app-error.js";

function parseOptionalDate(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("Fecha inválida", 400);
  }

  return date;
}

function parseRequiredDate(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(`El campo ${fieldName} es obligatorio`, 400);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`El campo ${fieldName} no contiene una fecha válida`, 400);
  }

  return date;
}

function getAuthenticatedUserId(req: Request) {
  if (!req.auth) {
    throw new AppError("La solicitud no está autenticada", 401);
  }

  return req.auth.id_usuario;
}

function handleNotasError(error: unknown, res: Response, fallbackMessage: string) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    error: fallbackMessage,
  });
}

export class NotasCalendarioController {
  static async getNotas(req: Request, res: Response) {
    try {
      const idUsuario = getAuthenticatedUserId(req);
      const completada =
        typeof req.query.completada === "string"
          ? req.query.completada === "true"
          : undefined;
      const filtros: {
        id_usuario: number;
        fecha_desde?: Date;
        fecha_hasta?: Date;
        tipo?: string;
        completada?: boolean;
      } = {
        id_usuario: idUsuario,
      };

      const fechaDesde = parseOptionalDate(req.query.fecha_desde);
      const fechaHasta = parseOptionalDate(req.query.fecha_hasta);
      const tipo = typeof req.query.tipo === "string" ? req.query.tipo : undefined;

      if (fechaDesde) {
        filtros.fecha_desde = fechaDesde;
      }

      if (fechaHasta) {
        filtros.fecha_hasta = fechaHasta;
      }

      if (tipo) {
        filtros.tipo = tipo;
      }

      if (typeof completada === "boolean") {
        filtros.completada = completada;
      }

      const data = await getNotas(filtros);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return handleNotasError(error, res, "No se pudieron obtener las notas");
    }
  }

  static async getNotasByMes(req: Request, res: Response) {
    try {
      const idUsuario = getAuthenticatedUserId(req);
      const anio = Number(req.params.anio);
      const mes = Number(req.params.mes);

      if (!Number.isInteger(anio) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
        throw new AppError("Parámetros de mes inválidos", 400);
      }

      const data = await getNotasByMes(anio, mes, idUsuario);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return handleNotasError(error, res, "No se pudieron obtener las notas del mes");
    }
  }

  static async getNotaById(req: Request, res: Response) {
    try {
      const idUsuario = getAuthenticatedUserId(req);
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        throw new AppError("ID de nota inválido", 400);
      }

      const data = await getNotaById(id, idUsuario);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return handleNotasError(error, res, "No se pudo obtener la nota");
    }
  }

  static async createNota(req: Request, res: Response) {
    try {
      const idUsuario = getAuthenticatedUserId(req);

      if (!req.body.titulo || typeof req.body.titulo !== "string") {
        throw new AppError("El título es obligatorio", 400);
      }

      if (!["nota", "recordatorio", "tarea"].includes(String(req.body.tipo))) {
        throw new AppError("El tipo de nota es inválido", 400);
      }

      const payload: {
        titulo: string;
        fecha: Date;
        tipo: "nota" | "recordatorio" | "tarea";
        descripcion?: string;
        fecha_fin?: Date;
        color?: string;
        todo_el_dia?: boolean;
      } = {
        titulo: String(req.body.titulo ?? "").trim(),
        fecha: parseRequiredDate(req.body.fecha, "fecha"),
        tipo: req.body.tipo,
      };

      if (typeof req.body.descripcion === "string") {
        payload.descripcion = req.body.descripcion;
      }

      const fechaFin = parseOptionalDate(req.body.fecha_fin);
      if (fechaFin) {
        payload.fecha_fin = fechaFin;
      }

      if (typeof req.body.color === "string") {
        payload.color = req.body.color;
      }

      if (typeof req.body.todo_el_dia === "boolean") {
        payload.todo_el_dia = req.body.todo_el_dia;
      }

      const data = await createNota(payload, idUsuario);

      return res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      return handleNotasError(error, res, "No se pudo crear la nota");
    }
  }

  static async updateNota(req: Request, res: Response) {
    try {
      const idUsuario = getAuthenticatedUserId(req);
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        throw new AppError("ID de nota inválido", 400);
      }

      if (req.body.tipo && !["nota", "recordatorio", "tarea"].includes(String(req.body.tipo))) {
        throw new AppError("El tipo de nota es inválido", 400);
      }

      const payload: {
        titulo?: string;
        descripcion?: string;
        fecha?: Date;
        fecha_fin?: Date;
        tipo?: "nota" | "recordatorio" | "tarea";
        color?: string;
        todo_el_dia?: boolean;
      } = {};

      if (typeof req.body.titulo === "string") {
        payload.titulo = req.body.titulo;
      }

      if (typeof req.body.descripcion === "string") {
        payload.descripcion = req.body.descripcion;
      }

      if (req.body.fecha) {
        payload.fecha = parseRequiredDate(req.body.fecha, "fecha");
      }

      const fechaFin = parseOptionalDate(req.body.fecha_fin);
      if (fechaFin) {
        payload.fecha_fin = fechaFin;
      }

      if (req.body.tipo) {
        payload.tipo = req.body.tipo;
      }

      if (typeof req.body.color === "string") {
        payload.color = req.body.color;
      }

      if (typeof req.body.todo_el_dia === "boolean") {
        payload.todo_el_dia = req.body.todo_el_dia;
      }

      const data = await updateNota(id, payload, idUsuario);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return handleNotasError(error, res, "No se pudo actualizar la nota");
    }
  }

  static async toggleCompletada(req: Request, res: Response) {
    try {
      const idUsuario = getAuthenticatedUserId(req);
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        throw new AppError("ID de nota inválido", 400);
      }

      const data = await toggleCompletada(id, idUsuario);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return handleNotasError(error, res, "No se pudo actualizar el estado de la nota");
    }
  }

  static async deleteNota(req: Request, res: Response) {
    try {
      const idUsuario = getAuthenticatedUserId(req);
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        throw new AppError("ID de nota inválido", 400);
      }

      const data = await deleteNota(id, idUsuario);

      return res.json(data);
    } catch (error) {
      return handleNotasError(error, res, "No se pudo eliminar la nota");
    }
  }
}
