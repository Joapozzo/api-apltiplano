export const EXPEDICION_ESTADOS = {
  ACTIVA: "Activa",
  COMPLETA: "Completa",
  FINALIZADA: "Finalizada",
  SUSPENDIDA: "Suspendida",
  CANCELADA: "Cancelada",
} as const;

export type ExpedicionEstado = (typeof EXPEDICION_ESTADOS)[keyof typeof EXPEDICION_ESTADOS];

const ESTADOS_OPERATIVOS: Set<string> = new Set([EXPEDICION_ESTADOS.ACTIVA, EXPEDICION_ESTADOS.COMPLETA]);

const ESTADOS_PUBLICABLES: Set<string> = new Set(["A", EXPEDICION_ESTADOS.ACTIVA]);

const ESTADOS_FINALIZADOS: Set<string> = new Set([
  EXPEDICION_ESTADOS.COMPLETA,
  EXPEDICION_ESTADOS.FINALIZADA,
  EXPEDICION_ESTADOS.SUSPENDIDA,
  EXPEDICION_ESTADOS.CANCELADA,
]);

const ESTADOS_CANCELADOS: Set<string> = new Set([EXPEDICION_ESTADOS.CANCELADA, EXPEDICION_ESTADOS.SUSPENDIDA]);

export function expedicionEsOperativa(estado: string): boolean {
  return ESTADOS_OPERATIVOS.has(estado);
}

export function expedicionEstaActivaPublica(estado: string): boolean {
  return ESTADOS_PUBLICABLES.has(estado);
}

export function expedicionEstaFinalizada(estado: string): boolean {
  return ESTADOS_FINALIZADOS.has(estado);
}

export function expedicionEstaCancelada(estado: string): boolean {
  return ESTADOS_CANCELADOS.has(estado);
}

export function esEstadoValido(estado: string): estado is ExpedicionEstado {
  return Object.values(EXPEDICION_ESTADOS).includes(estado as ExpedicionEstado);
}
