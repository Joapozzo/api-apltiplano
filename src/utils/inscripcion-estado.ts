export const INSCRIPCION_ESTADOS = {
  INSCRIPTO: "Inscripto",
  CONFIRMADO: "Confirmado",
  PENDIENTE: "Pendiente",
  CANCELADO: "Cancelado",
} as const;

export type InscripcionEstado =
  (typeof INSCRIPCION_ESTADOS)[keyof typeof INSCRIPCION_ESTADOS];

const ESTADOS_OCUPAN_CUPO: Set<string> = new Set([
  INSCRIPCION_ESTADOS.INSCRIPTO,
  INSCRIPCION_ESTADOS.CONFIRMADO,
  INSCRIPCION_ESTADOS.PENDIENTE,
]);

export function inscripcionOcupaCupo(estado: string): boolean {
  return ESTADOS_OCUPAN_CUPO.has(estado);
}

export function inscripcionPagosCompletos(input: {
  estado: string;
  reserva_pagada: boolean;
  saldo_pagado: boolean;
}): boolean {
  if (input.estado === INSCRIPCION_ESTADOS.CANCELADO) return false;
  if (input.estado === INSCRIPCION_ESTADOS.CONFIRMADO) return true;
  return input.reserva_pagada && input.saldo_pagado;
}

export function normalizeInscripcionUpdate(data: Record<string, unknown>): Record<string, unknown> {
  const patch = { ...data };
  const reserva = patch.reserva_pagada === true;
  const saldo = patch.saldo_pagado === true;

  if (reserva && saldo) {
    const estado = patch.estado as string | undefined;
    if (!estado || estado === INSCRIPCION_ESTADOS.INSCRIPTO || estado === INSCRIPCION_ESTADOS.PENDIENTE) {
      patch.estado = INSCRIPCION_ESTADOS.CONFIRMADO;
    }
  }

  return patch;
}
