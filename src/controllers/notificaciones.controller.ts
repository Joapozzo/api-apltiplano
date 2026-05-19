import type { Request, Response } from "express";
import { z } from "zod";
import * as notificacionesService from "../services/notificaciones/notificaciones.service.js";
import { syncAlertasOperativas } from "../services/notificaciones/notificaciones-sync.service.js";

const NotificacionesQuerySchema = z.object({
  leida: z.coerce.boolean().optional(),
  severidad: z.enum(["info", "warning", "critical"]).optional(),
  tipo: z.string().optional(),
  limit: z.coerce.number().max(50).optional(),
  cursor: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
});

const MarcarLeidaSchema = z.object({
  leida: z.boolean(),
});

export class NotificacionesController {
  static async getResumen(req: Request, res: Response) {
    await syncAlertasOperativas(true);
    const data = await notificacionesService.getResumen();
    res.json({ success: true, data });
  }

  static async list(req: Request, res: Response) {
    const parsed = NotificacionesQuerySchema.parse(req.query);
    const params: Record<string, unknown> = {};
    if (parsed.leida !== undefined) params.leida = parsed.leida;
    if (parsed.severidad) params.severidad = parsed.severidad;
    if (parsed.tipo) params.tipo = parsed.tipo;
    if (parsed.limit) params.limit = parsed.limit;
    if (parsed.cursor) params.cursor = parsed.cursor;
    if (parsed.page) params.page = parsed.page;
    
    const data = await notificacionesService.getNotificaciones(params as any);
    res.json({ success: true, data });
  }

  static async marcarLeida(req: Request, res: Response) {
    const { id } = req.params;
    const parsed = MarcarLeidaSchema.parse(req.body);
    const idNum = parseInt(String(id), 10);

    if (isNaN(idNum)) {
      return res.status(400).json({ success: false, error: "ID inválido" });
    }

    const result = await notificacionesService.marcarLeida(idNum);
    if (!result) {
      return res.status(404).json({ success: false, error: "Notificación no encontrada" });
    }

    res.json({ success: true, data: { leida: true } });
  }

  static async marcarTodasLeidas(req: Request, res: Response) {
    const count = await notificacionesService.marcarTodasLeidas();
    res.json({ success: true, data: { actualizadas: count } });
  }

  static async sincronizar(req: Request, res: Response) {
    const result = await syncAlertasOperativas(false);
    res.json({ success: true, data: result });
  }
}