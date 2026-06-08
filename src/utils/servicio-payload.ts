/** La columna en DB es TEXT; normaliza valores legacy (ej. rating numérico del form viejo). */
export function normalizeExperienciaRequerida(value: unknown): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || null;
  }
  return null;
}
