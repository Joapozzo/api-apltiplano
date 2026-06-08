import type { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma.js";
import { NOTIFICACION_TIPOS } from "../types/notificaciones.dto.js";

const TIPOS_SALIDA = [
  NOTIFICACION_TIPOS.SALIDA_CUPOS_LLENOS,
  NOTIFICACION_TIPOS.SALIDA_CUPOS_CRITICOS,
  NOTIFICACION_TIPOS.SALIDA_PRESUPUESTO_POR_VENCER,
  NOTIFICACION_TIPOS.SALIDA_PRESUPUESTO_VENCIDO,
  NOTIFICACION_TIPOS.SALIDA_PROXIMA,
  NOTIFICACION_TIPOS.SALIDA_URGENTE,
  NOTIFICACION_TIPOS.SALIDA_ESTADO_COMPLETA,
] as const;

const TIPOS_INSCRIPCION = [
  NOTIFICACION_TIPOS.INSCRIPCION_NUEVA,
  NOTIFICACION_TIPOS.INSCRIPCION_SIN_DATOS_MEDICOS,
  NOTIFICACION_TIPOS.INSCRIPCION_SIN_ACTIVIDAD_FISICA,
  NOTIFICACION_TIPOS.INSCRIPCION_SIN_EMERGENCIA,
] as const;

export function dedupeKeysExpedicion(id_expedicion: number): string[] {
  return TIPOS_SALIDA.map((tipo) => `${tipo}:exp:${id_expedicion}`);
}

export function dedupeKeysInscripcion(id_inscripcion: number): string[] {
  return TIPOS_INSCRIPCION.map((tipo) => `${tipo}:${id_inscripcion}`);
}

export async function purgeNotificacionesExpedicion(
  id_expedicion: number,
  inscripcionIds: number[] = [],
  tx?: Prisma.TransactionClient,
): Promise<number> {
  const db = tx ?? prisma;
  const dedupeKeys = [
    ...dedupeKeysExpedicion(id_expedicion),
    ...inscripcionIds.flatMap((id) => dedupeKeysInscripcion(id)),
  ];

  const result = await db.notificaciones_admin.deleteMany({
    where: { dedupe_key: { in: dedupeKeys } },
  });

  return result.count;
}

export async function purgeNotificacionesSalidaExpedicion(
  id_expedicion: number,
  tx?: Prisma.TransactionClient,
): Promise<number> {
  const db = tx ?? prisma;
  const result = await db.notificaciones_admin.deleteMany({
    where: { dedupe_key: { in: dedupeKeysExpedicion(id_expedicion) } },
  });
  return result.count;
}

export async function purgeNotificacionesServicio(id_servicio: number): Promise<number> {
  const expediciones = await prisma.expediciones.findMany({
    where: { id_servicio },
    select: { id_expedicion: true },
  });

  if (expediciones.length === 0) return 0;

  const dedupeKeys = expediciones.flatMap((e) => dedupeKeysExpedicion(e.id_expedicion));

  const result = await prisma.notificaciones_admin.deleteMany({
    where: { dedupe_key: { in: dedupeKeys } },
  });

  return result.count;
}

export async function purgeNotificacionesHuerfanas(): Promise<{ salidas: number; inscripciones: number }> {
  const [expedicionesVigentes, inscripcionesVigentes, notificacionesSalida, notificacionesInscripcion] =
    await Promise.all([
      prisma.expediciones.findMany({
        where: {
          estado: { in: ["Activa", "Completa"] },
          servicios: { activo: true },
        },
        select: { id_expedicion: true },
      }),
      prisma.inscripciones.findMany({
        select: { id_inscripcion: true },
      }),
      prisma.notificaciones_admin.findMany({
        where: { tipo: { in: [...TIPOS_SALIDA] } },
        select: { dedupe_key: true, metadata: true },
      }),
      prisma.notificaciones_admin.findMany({
        where: { tipo: { in: [...TIPOS_INSCRIPCION] } },
        select: { dedupe_key: true, metadata: true },
      }),
    ]);

  const expedicionesValidas = new Set(expedicionesVigentes.map((e) => e.id_expedicion));
  const inscripcionesValidas = new Set(inscripcionesVigentes.map((i) => i.id_inscripcion));

  const salidaHuerfanas = notificacionesSalida
    .filter((n) => {
      const meta = n.metadata as { id_expedicion?: number } | null;
      const idFromMeta = meta?.id_expedicion;
      const idFromKey = parseExpedicionIdFromDedupeKey(n.dedupe_key);
      const id = idFromMeta ?? idFromKey;
      return id === undefined || !expedicionesValidas.has(id);
    })
    .map((n) => n.dedupe_key);

  const inscripcionHuerfanas = notificacionesInscripcion
    .filter((n) => {
      const meta = n.metadata as { id_inscripcion?: number } | null;
      const idFromMeta = meta?.id_inscripcion;
      const idFromKey = parseInscripcionIdFromDedupeKey(n.dedupe_key);
      const id = idFromMeta ?? idFromKey;
      return id === undefined || !inscripcionesValidas.has(id);
    })
    .map((n) => n.dedupe_key);

  const huerfanas = [...new Set([...salidaHuerfanas, ...inscripcionHuerfanas])];

  if (huerfanas.length === 0) {
    return { salidas: 0, inscripciones: 0 };
  }

  const result = await prisma.notificaciones_admin.deleteMany({
    where: { dedupe_key: { in: huerfanas } },
  });

  return {
    salidas: salidaHuerfanas.length,
    inscripciones: inscripcionHuerfanas.length,
  };
}

function parseExpedicionIdFromDedupeKey(dedupeKey: string): number | undefined {
  const match = dedupeKey.match(/:exp:(\d+)$/);
  if (!match?.[1]) return undefined;
  const id = parseInt(match[1], 10);
  return Number.isNaN(id) ? undefined : id;
}

function parseInscripcionIdFromDedupeKey(dedupeKey: string): number | undefined {
  const match = dedupeKey.match(/:(\d+)$/);
  if (!match?.[1]) return undefined;
  const id = parseInt(match[1], 10);
  return Number.isNaN(id) ? undefined : id;
}
