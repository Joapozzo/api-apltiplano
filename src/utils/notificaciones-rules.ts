import { NOTIFICACION_TIPOS, NOTIFICACION_SEVERIDAD } from "../types/notificaciones.dto.js";
import { expedicionEsOperativa, expedicionEstaFinalizada } from "./expedicion-estado.js";

interface NotificacionRule {
  dedupeKey: string;
  tipo: string;
  severidad: string;
  titulo: string;
  mensaje: string;
  enlace: string;
  metadata: Record<string, unknown>;
}

const UMBRALES_DEFAULT = {
  umbral_cupos_criticos: 2,
  dias_presupuesto_aviso: 7,
  dias_salida_proxima: 7,
  dias_salida_urgente: 3,
};

export function getNotificacionesRules(
  expediciones: Array<{
    id_expedicion: number;
    estado: string;
    fecha_salida: Date;
    cupos_disponibles: number;
    cupos_ocupados: number;
    presupuesto_valido_hasta: Date | null;
    servicios: { nombre: string };
  }>,
  inscripciones: Array<{
    id_inscripcion: number;
    id_cliente: number;
    clientes: { nombre: string; apellido: string };
    estado: string;
  }>,
  umbral_cupos_criticos: number = UMBRALES_DEFAULT.umbral_cupos_criticos,
  dias_presupuesto_aviso: number = UMBRALES_DEFAULT.dias_presupuesto_aviso,
  dias_salida_proxima: number = UMBRALES_DEFAULT.dias_salida_proxima,
  dias_salida_urgente: number = UMBRALES_DEFAULT.dias_salida_urgente
): { nuevas: NotificacionRule[]; archivar: string[] } {
  const nuevas: NotificacionRule[] = [];
  const archivar: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const exp of expediciones) {
    if (!expedicionEsOperativa(exp.estado)) {
      archivar.push(`SALIDA_CUPOS_LLENOS:exp:${exp.id_expedicion}`);
      archivar.push(`SALIDA_CUPOS_CRITICOS:exp:${exp.id_expedicion}`);
      archivar.push(`SALIDA_PRESUPUESTO_POR_VENCER:exp:${exp.id_expedicion}`);
      archivar.push(`SALIDA_PRESUPUESTO_VENCIDO:exp:${exp.id_expedicion}`);
      archivar.push(`SALIDA_PROXIMA:exp:${exp.id_expedicion}`);
      archivar.push(`SALIDA_URGENTE:exp:${exp.id_expedicion}`);
      continue;
    }

    const restantes = exp.cupos_disponibles - exp.cupos_ocupados;

    if (restantes <= 0) {
      nuevas.push({
        dedupeKey: `SALIDA_CUPOS_LLENOS:exp:${exp.id_expedicion}`,
        tipo: NOTIFICACION_TIPOS.SALIDA_CUPOS_LLENOS,
        severidad: NOTIFICACION_SEVERIDAD.CRITICAL,
        titulo: "Cupos completos",
        mensaje: `${exp.servicios.nombre} — ${exp.fecha_salida.toLocaleDateString("es-AR")}`,
        enlace: `/adm/salidas?id=${exp.id_expedicion}`,
        metadata: { id_expedicion: exp.id_expedicion },
      });
    } else {
      archivar.push(`SALIDA_CUPOS_LLENOS:exp:${exp.id_expedicion}`);
    }

    if (restantes > 0 && restantes <= umbral_cupos_criticos) {
      nuevas.push({
        dedupeKey: `SALIDA_CUPOS_CRITICOS:exp:${exp.id_expedicion}`,
        tipo: NOTIFICACION_TIPOS.SALIDA_CUPOS_CRITICOS,
        severidad: NOTIFICACION_SEVERIDAD.WARNING,
        titulo: "Cupos críticos",
        mensaje: `${exp.servicios.nombre} — ${restantes} lugar(es) disponible(s)`,
        enlace: `/adm/salidas?id=${exp.id_expedicion}`,
        metadata: { id_expedicion: exp.id_expedicion },
      });
    } else {
      archivar.push(`SALIDA_CUPOS_CRITICOS:exp:${exp.id_expedicion}`);
    }

    if (exp.presupuesto_valido_hasta) {
      const presupuestoFecha = new Date(exp.presupuesto_valido_hasta);
      presupuestoFecha.setHours(0, 0, 0, 0);
      const diasRestantes = Math.floor((presupuestoFecha.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diasRestantes < 0 && !expedicionEstaFinalizada(exp.estado)) {
        nuevas.push({
          dedupeKey: `SALIDA_PRESUPUESTO_VENCIDO:exp:${exp.id_expedicion}`,
          tipo: NOTIFICACION_TIPOS.SALIDA_PRESUPUESTO_VENCIDO,
          severidad: NOTIFICACION_SEVERIDAD.CRITICAL,
          titulo: "Presupuesto vencido",
          mensaje: `${exp.servicios.nombre} — vigente hasta ${exp.presupuesto_valido_hasta.toLocaleDateString("es-AR")}`,
          enlace: `/adm/salidas?id=${exp.id_expedicion}`,
          metadata: { id_expedicion: exp.id_expedicion },
        });
      } else if (diasRestantes >= 0 && diasRestantes <= dias_presupuesto_aviso) {
        nuevas.push({
          dedupeKey: `SALIDA_PRESUPUESTO_POR_VENCER:exp:${exp.id_expedicion}`,
          tipo: NOTIFICACION_TIPOS.SALIDA_PRESUPUESTO_POR_VENCER,
          severidad: NOTIFICACION_SEVERIDAD.WARNING,
          titulo: "Presupuesto por vencer",
          mensaje: `${exp.servicios.nombre} — vence en ${diasRestantes} día(s)`,
          enlace: `/adm/salidas?id=${exp.id_expedicion}`,
          metadata: { id_expedicion: exp.id_expedicion },
        });
      } else {
        archivar.push(`SALIDA_PRESUPUESTO_POR_VENCER:exp:${exp.id_expedicion}`);
        archivar.push(`SALIDA_PRESUPUESTO_VENCIDO:exp:${exp.id_expedicion}`);
      }
    }

    const diasHastaSalida = Math.floor((new Date(exp.fecha_salida).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diasHastaSalida >= 0 && diasHastaSalida <= dias_salida_urgente) {
      nuevas.push({
        dedupeKey: `SALIDA_URGENTE:exp:${exp.id_expedicion}`,
        tipo: NOTIFICACION_TIPOS.SALIDA_URGENTE,
        severidad: NOTIFICACION_SEVERIDAD.WARNING,
        titulo: "Salida muy próxima",
        mensaje: `${exp.servicios.nombre} — ${exp.fecha_salida.toLocaleDateString("es-AR")}`,
        enlace: `/adm/salidas?id=${exp.id_expedicion}`,
        metadata: { id_expedicion: exp.id_expedicion },
      });
    } else if (diasHastaSalida > dias_salida_urgente && diasHastaSalida <= dias_salida_proxima) {
      nuevas.push({
        dedupeKey: `SALIDA_PROXIMA:exp:${exp.id_expedicion}`,
        tipo: NOTIFICACION_TIPOS.SALIDA_PROXIMA,
        severidad: NOTIFICACION_SEVERIDAD.INFO,
        titulo: "Salida próxima",
        mensaje: `${exp.servicios.nombre} — ${exp.fecha_salida.toLocaleDateString("es-AR")}`,
        enlace: `/adm/salidas?id=${exp.id_expedicion}`,
        metadata: { id_expedicion: exp.id_expedicion },
      });
    } else {
      archivar.push(`SALIDA_PROXIMA:exp:${exp.id_expedicion}`);
      archivar.push(`SALIDA_URGENTE:exp:${exp.id_expedicion}`);
    }
  }

  return { nuevas, archivar };
}

export function getInscripcionesIncompletasRules(
  inscripciones: Array<{
    id_inscripcion: number;
    clientes: { nombre: string; apellido: string };
    tiene_datos_medicos: boolean;
    tiene_actividad_fisica: boolean;
    tiene_emergencia: boolean;
  }>
): NotificacionRule[] {
  const nuevas: NotificacionRule[] = [];

  for (const ins of inscripciones) {
    const nombreCompleto = `${ins.clientes.nombre} ${ins.clientes.apellido}`;

    if (!ins.tiene_datos_medicos) {
      nuevas.push({
        dedupeKey: `INSCRIPCION_SIN_DATOS_MEDICOS:${ins.id_inscripcion}`,
        tipo: NOTIFICACION_TIPOS.INSCRIPCION_SIN_DATOS_MEDICOS,
        severidad: NOTIFICACION_SEVERIDAD.WARNING,
        titulo: "Inscripción sin datos médicos",
        mensaje: nombreCompleto,
        enlace: `/adm/inscripciones?id=${ins.id_inscripcion}`,
        metadata: { id_inscripcion: ins.id_inscripcion },
      });
    }

    if (!ins.tiene_actividad_fisica) {
      nuevas.push({
        dedupeKey: `INSCRIPCION_SIN_ACTIVIDAD_FISICA:${ins.id_inscripcion}`,
        tipo: NOTIFICACION_TIPOS.INSCRIPCION_SIN_ACTIVIDAD_FISICA,
        severidad: NOTIFICACION_SEVERIDAD.WARNING,
        titulo: "Inscripción sin actividad física",
        mensaje: nombreCompleto,
        enlace: `/adm/inscripciones?id=${ins.id_inscripcion}`,
        metadata: { id_inscripcion: ins.id_inscripcion },
      });
    }

    if (!ins.tiene_emergencia) {
      nuevas.push({
        dedupeKey: `INSCRIPCION_SIN_EMERGENCIA:${ins.id_inscripcion}`,
        tipo: NOTIFICACION_TIPOS.INSCRIPCION_SIN_EMERGENCIA,
        severidad: NOTIFICACION_SEVERIDAD.WARNING,
        titulo: "Inscripción sin contacto de emergencia",
        mensaje: nombreCompleto,
        enlace: `/adm/inscripciones?id=${ins.id_inscripcion}`,
        metadata: { id_inscripcion: ins.id_inscripcion },
      });
    }
  }

  return nuevas;
}