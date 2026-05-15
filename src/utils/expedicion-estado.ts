/** Estados de expedición considerados publicables (listados y detalle usuario). */
const ACTIVOS = new Set(["A", "Activa"]);

export function expedicionEstaActivaPublica(estado: string): boolean {
  return ACTIVOS.has(estado);
}
