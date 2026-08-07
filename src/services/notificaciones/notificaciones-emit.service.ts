import { prisma } from "../../database/prisma.js";
import { NOTIFICACION_SEVERIDAD, NOTIFICACION_TIPOS } from "../../types/notificaciones.dto.js";
import { formatCalendarDateAR } from "../../utils/dates.js";

interface EmitOptions {
  tipo: string;
  severidad: string;
  titulo: string;
  mensaje: string;
  enlace?: string;
  metadata?: Record<string, unknown>;
}

async function upsertNotificacion(dedupeKey: string, options: EmitOptions) {
  return prisma.notificaciones_admin.upsert({
    where: { dedupe_key: dedupeKey },
    update: {
      tipo: options.tipo,
      severidad: options.severidad,
      titulo: options.titulo,
      mensaje: options.mensaje,
      enlace: options.enlace ?? undefined,
      metadata: options.metadata ?? undefined,
      archivada: false,
    } as any,
    create: {
      dedupe_key: dedupeKey,
      tipo: options.tipo,
      severidad: options.severidad,
      titulo: options.titulo,
      mensaje: options.mensaje,
      enlace: options.enlace ?? undefined,
      metadata: options.metadata ?? undefined,
      archivada: false,
      leida: false,
    } as any,
  });
}

export async function emitInscripcionNueva(data: {
  id_inscripcion: number;
  cliente: string;
  servicio: string;
  fecha_salida: Date;
}) {
  const dedupeKey = `${NOTIFICACION_TIPOS.INSCRIPCION_NUEVA}:${data.id_inscripcion}`;
  const mensaje = `${data.cliente} — ${data.servicio} (${formatCalendarDateAR(data.fecha_salida)})`;

  return upsertNotificacion(dedupeKey, {
    tipo: NOTIFICACION_TIPOS.INSCRIPCION_NUEVA,
    severidad: NOTIFICACION_SEVERIDAD.INFO,
    titulo: "Nueva inscripción",
    mensaje,
    enlace: `/adm/inscripciones?id=${data.id_inscripcion}`,
    metadata: { id_inscripcion: data.id_inscripcion },
  });
}

export async function emitSalidaEstadoCompleta(data: {
  id_expedicion: number;
  nombre_servicio: string;
  fecha_salida: Date;
}) {
  const dedupeKey = `${NOTIFICACION_TIPOS.SALIDA_ESTADO_COMPLETA}:exp:${data.id_expedicion}`;

  return upsertNotificacion(dedupeKey, {
    tipo: NOTIFICACION_TIPOS.SALIDA_ESTADO_COMPLETA,
    severidad: NOTIFICACION_SEVERIDAD.INFO,
    titulo: "Salida completada",
    mensaje: `${data.nombre_servicio} (${formatCalendarDateAR(data.fecha_salida)})`,
    enlace: `/adm/salidas?id=${data.id_expedicion}`,
    metadata: { id_expedicion: data.id_expedicion },
  });
}
