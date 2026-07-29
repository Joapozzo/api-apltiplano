/**
 * Pure scoring helpers for mountain-level questionnaire.
 * No Prisma / I/O — unit-testable.
 */

export type DificultadRango = {
  id_dificultad: number;
  nivel: string;
  descripcion?: string | null;
  puntaje_min: number;
  puntaje_max: number;
  orden: number;
  activo?: boolean;
};

export function sumarPuntos(opcionesSeleccionadas: Array<{ puntos: number }>): number {
  return opcionesSeleccionadas.reduce((acc, o) => acc + (Number.isFinite(o.puntos) ? o.puntos : 0), 0);
}

/**
 * Match total to a difficulty range (min inclusive, max inclusive).
 * If gaps: pick nearest active level with orden below (or equal) by score midpoint distance.
 * If still none: lowest orden active level.
 */
export function resolverNivel(
  total: number,
  dificultades: DificultadRango[],
): DificultadRango | null {
  const activas = dificultades
    .filter((d) => d.activo !== false)
    .slice()
    .sort((a, b) => a.orden - b.orden || a.id_dificultad - b.id_dificultad);

  if (activas.length === 0) return null;

  const exacto = activas.find((d) => total >= d.puntaje_min && total <= d.puntaje_max);
  if (exacto) return exacto;

  // Gap / overflow: choose closest by midpoint of range
  let mejor = activas[0]!;
  let mejorDist = Number.POSITIVE_INFINITY;
  for (const d of activas) {
    const mid = (d.puntaje_min + d.puntaje_max) / 2;
    const dist = Math.abs(total - mid);
    if (dist < mejorDist || (dist === mejorDist && d.orden < mejor.orden)) {
      mejorDist = dist;
      mejor = d;
    }
  }
  return mejor;
}

/** Split [0, scoreMax] into N equal integer bands for active difficulties ordered by orden. */
export function calcularRangosEquidistantes(
  scoreMax: number,
  dificultadesOrdenadas: Array<{ id_dificultad: number }>,
): Array<{ id_dificultad: number; puntaje_min: number; puntaje_max: number }> {
  const n = dificultadesOrdenadas.length;
  if (n === 0) return [];
  const max = Math.max(0, Math.floor(scoreMax));
  if (n === 1) {
    return [{ id_dificultad: dificultadesOrdenadas[0]!.id_dificultad, puntaje_min: 0, puntaje_max: Math.max(max, 999) }];
  }

  const band = Math.floor(max / n);
  const result: Array<{ id_dificultad: number; puntaje_min: number; puntaje_max: number }> = [];
  for (let i = 0; i < n; i++) {
    const min = i * band;
    const isLast = i === n - 1;
    const puntaje_max = isLast ? Math.max(max, 999) : min + band - 1;
    result.push({
      id_dificultad: dificultadesOrdenadas[i]!.id_dificultad,
      puntaje_min: min,
      puntaje_max: Math.max(puntaje_max, min),
    });
  }
  return result;
}
