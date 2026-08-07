/** Fechas de calendario (día civil), no instantes con hora. */

const ES_AR = "es-AR";

function utcYmd(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Serializa un día de calendario como `YYYY-MM-DD`.
 * El API guarda estos campos como DateTime a medianoche UTC.
 */
export function formatDateOnly(value: Date | string | null | undefined): string | null {
  if (value == null || value === "") return null;

  if (typeof value === "string") {
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return utcYmd(parsed);
  }

  if (Number.isNaN(value.getTime())) return null;
  return utcYmd(value);
}

/** Parsea input `YYYY-MM-DD` (o ISO) a Date UTC midnight del día civil. */
export function parseDateOnlyInput(value: string): Date {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const y = Number(match[1]);
    const m = Number(match[2]);
    const d = Number(match[3]);
    return new Date(Date.UTC(y, m - 1, d));
  }
  return new Date(value);
}

/** Formatea un día de calendario para mensajes / UI interna en es-AR. */
export function formatCalendarDateAR(
  value: Date | string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  const ymd = formatDateOnly(value);
  if (!ymd) return "";
  const parts = ymd.split("-");
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!y || !m || !d) return "";
  const local = new Date(y, m - 1, d, 12, 0, 0, 0);
  return local.toLocaleDateString(ES_AR, options);
}
