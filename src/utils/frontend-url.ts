/**
 * Public frontend origin for shareable links (inscripción, etc.).
 * One URL per environment via NEXT_FRONTEND_URL — never a comma-separated list.
 */
export function getPublicFrontendUrl(): string {
  const raw = (process.env.NEXT_FRONTEND_URL || "http://localhost:3000").trim();
  const first = raw.split(",")[0]?.trim() ?? "";
  const origin = first.replace(/\/$/, "");
  if (!origin) return "http://localhost:3000";
  if (origin.startsWith("http://") || origin.startsWith("https://")) return origin;
  return `https://${origin}`;
}
