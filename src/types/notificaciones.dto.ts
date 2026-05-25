export const NOTIFICACION_SEVERIDAD = {
  INFO: "info",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;

export type NotificacionSeveridad = (typeof NOTIFICACION_SEVERIDAD)[keyof typeof NOTIFICACION_SEVERIDAD];

export const NOTIFICACION_TIPOS = {
  INSCRIPCION_NUEVA: "INSCRIPCION_NUEVA",
  INSCRIPCION_SIN_DATOS_MEDICOS: "INSCRIPCION_SIN_DATOS_MEDICOS",
  INSCRIPCION_SIN_ACTIVIDAD_FISICA: "INSCRIPCION_SIN_ACTIVIDAD_FISICA",
  INSCRIPCION_SIN_EMERGENCIA: "INSCRIPCION_SIN_EMERGENCIA",
  SALIDA_CUPOS_LLENOS: "SALIDA_CUPOS_LLENOS",
  SALIDA_CUPOS_CRITICOS: "SALIDA_CUPOS_CRITICOS",
  SALIDA_PRESUPUESTO_POR_VENCER: "SALIDA_PRESUPUESTO_POR_VENCER",
  SALIDA_PRESUPUESTO_VENCIDO: "SALIDA_PRESUPUESTO_VENCIDO",
  SALIDA_PROXIMA: "SALIDA_PROXIMA",
  SALIDA_URGENTE: "SALIDA_URGENTE",
  SALIDA_ESTADO_COMPLETA: "SALIDA_ESTADO_COMPLETA",
} as const;

export type NotificacionTipo = (typeof NOTIFICACION_TIPOS)[keyof typeof NOTIFICACION_TIPOS];

export interface NotificacionAdmin {
  id_notificacion: number;
  tipo: string;
  severidad: string;
  titulo: string;
  mensaje: string;
  enlace: string | null;
  metadata: Record<string, unknown> | null;
  dedupe_key: string;
  leida: boolean;
  leida_at: Date | null;
  archivada: boolean;
  created_at: Date;
  expires_at: Date | null;
}

export interface NotificacionesResumen {
  no_leidas: number;
  por_severidad: Record<NotificacionSeveridad, number>;
  items: NotificacionAdmin[];
}

export interface NotificacionesListParams {
  leida?: boolean;
  severidad?: NotificacionSeveridad;
  tipo?: string;
  limit?: number;
  cursor?: number;
  page?: number;
}
