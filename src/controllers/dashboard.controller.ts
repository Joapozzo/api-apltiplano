import type { Request, Response } from "express";
import { getDashboardResumen } from "../services/dashboard/dashboard-resumen.service.js";
import { getDashboardActividad } from "../services/dashboard/dashboard-actividad.service.js";
import { getDashboardAlertas } from "../services/dashboard/dashboard-alertas.service.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";

export class DashboardController {
  static getResumen = asyncHandler(async (req: Request, res: Response) => {
    const now = new Date();
    const fechaDesde = req.query.fecha_desde
      ? new Date(String(req.query.fecha_desde))
      : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const fechaHasta = req.query.fecha_hasta
      ? new Date(String(req.query.fecha_hasta))
      : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    if (Number.isNaN(fechaDesde.getTime()) || Number.isNaN(fechaHasta.getTime())) {
      throw new AppError("Las fechas enviadas no son válidas", 400);
    }

    const data = await getDashboardResumen({
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
    });

    res.json({ success: true, data });
  });

  static getActividad = asyncHandler(async (_req: Request, res: Response) => {
    const data = await getDashboardActividad();
    res.json({ success: true, data });
  });

  static getAlertas = asyncHandler(async (_req: Request, res: Response) => {
    const data = await getDashboardAlertas();
    res.json({ success: true, data });
  });
}
