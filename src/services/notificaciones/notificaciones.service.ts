import { prisma } from "../../database/prisma.js";
import type {
  NotificacionesResumen,
  NotificacionesListParams,
  NotificacionSeveridad,
} from "../../types/notificaciones.dto.js";
import { NOTIFICACION_SEVERIDAD } from "../../types/notificaciones.dto.js";

export async function getResumen(): Promise<NotificacionesResumen> {
  const donde = { leida: false, archivada: false };

  const no_leidas = await prisma.notificaciones_admin.count({ where: donde });

  const por_severidadObj = await prisma.notificaciones_admin.groupBy({
    by: ["severidad"],
    where: donde,
    _count: { id_notificacion: true },
  });

  const por_severidad: Record<NotificacionSeveridad, number> = {
    [NOTIFICACION_SEVERIDAD.CRITICAL]: 0,
    [NOTIFICACION_SEVERIDAD.WARNING]: 0,
    [NOTIFICACION_SEVERIDAD.INFO]: 0,
  };

  for (const item of por_severidadObj) {
    if (item.severidad in por_severidad) {
      por_severidad[item.severidad as NotificacionSeveridad] = item._count.id_notificacion;
    }
  }

  const items = await prisma.notificaciones_admin.findMany({
    where: donde,
    orderBy: [{ created_at: "desc" }],
    take: 5,
  });

  return { no_leidas, por_severidad, items: items as any };
}

export async function getNotificaciones(params: NotificacionesListParams) {
  const { leida, severidad, tipo, limit = 50, cursor, page } = params;

  const donde: Record<string, unknown> = { archivada: false };
  if (leida !== undefined) donde.leida = leida;
  if (severidad) donde.severidad = severidad;
  if (tipo) donde.tipo = tipo;

  const take = Math.min(limit, 50);

  let skip = 0;
  if (page) skip = (page - 1) * take;
  if (cursor) skip = 0;

  const cursorObj = cursor ? { id_notificacion: cursor } : undefined;
  const [items, total] = await Promise.all([
    prisma.notificaciones_admin.findMany({
      where: donde,
      orderBy: [{ created_at: "desc" }],
      take,
      skip,
      ...(cursorObj ? { cursor: cursorObj } : {}),
    }),
    prisma.notificaciones_admin.count({ where: donde }),
  ]);

  return {
    items: items as any,
    total,
    limit: take,
    hasMore: skip + take < total,
  };
}

export async function marcarLeida(id_notificacion: number): Promise<boolean> {
  const result = await prisma.notificaciones_admin.update({
    where: { id_notificacion },
    data: { leida: true, leida_at: new Date() },
  });
  return !!result;
}

export async function marcarTodasLeidas(): Promise<number> {
  const result = await prisma.notificaciones_admin.updateMany({
    where: { leida: false, archivada: false },
    data: { leida: true, leida_at: new Date() },
  });
  return result.count;
}
