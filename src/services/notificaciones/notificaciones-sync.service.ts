import { prisma } from "../../database/prisma.js";
import { getNotificacionesRules, getInscripcionesIncompletasRules } from "../../utils/notificaciones-rules.js";
import { purgeNotificacionesHuerfanas } from "../../utils/notificaciones-cleanup.js";
import {
  getNotificacionUmbralCuposCriticos,
  getNotificacionDiasPresupuestoAviso,
  getNotificacionDiasSalidaProxima,
  getNotificacionDiasSalidaUrgente,
} from "../../utils/config-runtime.js";

const SYNC_CACHE: { synced_at: number } = { synced_at: 0 };
const SYNC_COOLDOWN_MS = 30000;

export async function syncAlertasOperativas(throttle = true): Promise<{ synced: boolean; count: number }> {
  const now = Date.now();

  if (throttle && now - SYNC_CACHE.synced_at < SYNC_COOLDOWN_MS) {
    return { synced: false, count: 0 };
  }

  SYNC_CACHE.synced_at = now;

  const [umbralCuposCriticos, diasPresupuestoAviso, diasSalidaProxima, diasSalidaUrgente] = await Promise.all([
    getNotificacionUmbralCuposCriticos(),
    getNotificacionDiasPresupuestoAviso(),
    getNotificacionDiasSalidaProxima(),
    getNotificacionDiasSalidaUrgente(),
  ]);

  const expediciones = await prisma.expediciones.findMany({
    where: {
      estado: { in: ["Activa", "Completa"] },
      servicios: { activo: true },
    },
    include: {
      servicios: { select: { nombre: true } },
      inscripciones: {
        where: { estado: { not: "Cancelada" } },
        include: {
          clientes: { select: { nombre: true, apellido: true } },
          inscripcion_datos_medicos: { select: { id_inscripcion: true } },
          inscripcion_actividad_fisica: { select: { id_inscripcion: true } },
        },
      },
    },
  });

  const expedicionesConDatos = expediciones.map((exp) => ({
    id_expedicion: exp.id_expedicion,
    estado: exp.estado,
    fecha_salida: exp.fecha_salida,
    cupos_disponibles: exp.cupos_disponibles,
    cupos_ocupados: exp.cupos_ocupados,
    presupuesto_valido_hasta: exp.presupuesto_valido_hasta,
    servicios: { nombre: exp.servicios.nombre },
  }));

  const inscripcionesDummy: Array<{
    id_inscripcion: number;
    id_cliente: number;
    clientes: { nombre: string; apellido: string };
    estado: string;
  }> = [];

  const reglasExp = getNotificacionesRules(
    expedicionesConDatos,
    inscripcionesDummy,
    umbralCuposCriticos,
    diasPresupuestoAviso,
    diasSalidaProxima,
    diasSalidaUrgente,
  );

  const idsInscripciones = expediciones.flatMap((e) => e.inscripciones.map((i) => i.id_inscripcion));

  const inscripcionesConEmergencia = await prisma.inscripciones.findMany({
    where: { id_inscripcion: { in: idsInscripciones } },
    select: {
      id_inscripcion: true,
      emergencia_nombre: true,
      emergencia_telefono: true,
    },
  });
  const emergenciaIds = new Set(
    inscripcionesConEmergencia.filter((i) => i.emergencia_nombre && i.emergencia_telefono).map((i) => i.id_inscripcion),
  );

  const inscripcionesIncompletas = expediciones.flatMap((exp) =>
    exp.inscripciones.map((ins) => ({
      id_inscripcion: ins.id_inscripcion,
      clientes: ins.clientes,
      tiene_datos_medicos: Array.isArray(ins.inscripcion_datos_medicos) && ins.inscripcion_datos_medicos.length > 0,
      tiene_actividad_fisica:
        Array.isArray(ins.inscripcion_actividad_fisica) && ins.inscripcion_actividad_fisica.length > 0,
      tiene_emergencia: emergenciaIds.has(ins.id_inscripcion),
    })),
  );

  const reglasInsc = getInscripcionesIncompletasRules(inscripcionesIncompletas);

  const allRules = [...reglasExp.nuevas, ...reglasInsc];
  const allArchivar = [...new Set([...reglasExp.archivar])];

  const deleteOps =
    allArchivar.length > 0
      ? [prisma.notificaciones_admin.deleteMany({ where: { dedupe_key: { in: allArchivar } } })]
      : [];

  const upsertOps = allRules.map((rule) =>
    prisma.notificaciones_admin.upsert({
      where: { dedupe_key: rule.dedupeKey },
      update: {
        tipo: rule.tipo,
        severidad: rule.severidad,
        titulo: rule.titulo,
        mensaje: rule.mensaje,
        enlace: rule.enlace ?? undefined,
        metadata: rule.metadata ?? undefined,
        archivada: false,
      } as any,
      create: {
        dedupe_key: rule.dedupeKey,
        tipo: rule.tipo,
        severidad: rule.severidad,
        titulo: rule.titulo,
        mensaje: rule.mensaje,
        enlace: rule.enlace ?? undefined,
        metadata: rule.metadata ?? undefined,
        archivada: false,
        leida: false,
      } as any,
    }),
  );

  await prisma.$transaction([...deleteOps, ...upsertOps]);
  await purgeNotificacionesHuerfanas();

  return { synced: true, count: allRules.length };
}
