import type { Request, Response } from "express";
import { getVistaCalendario } from "../services/calendario.service.js";
import { AppError } from "../utils/app-error.js";

function handleCalendarioError(error: unknown, res: Response, fallbackMessage: string) {
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

export class CalendarioController {
  static async getVistaCalendario(req: Request, res: Response) {
    try {
      if (!req.auth) {
        throw new AppError("La solicitud no está autenticada", 401);
      }

      const anio = Number(req.params.anio);
      const mes = Number(req.params.mes);

      if (!Number.isInteger(anio) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
        throw new AppError("Parámetros de calendario inválidos", 400);
      }

      const data = await getVistaCalendario(anio, mes, req.auth.id_usuario);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return handleCalendarioError(error, res, "No se pudo obtener la vista de calendario");
    }
  }
}
