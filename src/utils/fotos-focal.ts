export type FocalPoint = { x: number; y: number };

export type FotosFocalMap = Record<string, FocalPoint>;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

export function normalizeFocal(input: unknown): FocalPoint {
  if (!input || typeof input !== "object") return { x: 0.5, y: 0.5 };
  const raw = input as { x?: unknown; y?: unknown };
  return {
    x: clamp01(typeof raw.x === "number" ? raw.x : Number(raw.x)),
    y: clamp01(typeof raw.y === "number" ? raw.y : Number(raw.y)),
  };
}

export function parseFotosFocalMap(raw: unknown): FotosFocalMap {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: FotosFocalMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!key.trim()) continue;
    out[key] = normalizeFocal(value);
  }
  return out;
}

export function setFotosFocalEntry(
  raw: unknown,
  publicId: string,
  focal: FocalPoint,
): FotosFocalMap {
  const map = parseFotosFocalMap(raw);
  map[publicId] = normalizeFocal(focal);
  return map;
}

export function removeFotosFocalEntry(raw: unknown, publicId: string): FotosFocalMap {
  const map = parseFotosFocalMap(raw);
  delete map[publicId];
  return map;
}

/** Extrae public_id desde URL de Cloudinary o /storage/. */
export function publicIdFromImageUrl(url: string): string | null {
  const cleanUrl = decodeURIComponent((url.split("?")[0] ?? url).trim());
  if (!cleanUrl) return null;

  if (cleanUrl.startsWith("/storage/")) {
    return cleanUrl.replace(/^\/storage\//, "").replace(/\.[a-z0-9]+$/i, "") || null;
  }

  const uploadMarker = "/upload/";
  const uploadIndex = cleanUrl.indexOf(uploadMarker);
  if (uploadIndex === -1) return null;

  const afterUpload = cleanUrl.slice(uploadIndex + uploadMarker.length);
  const parts = afterUpload.split("/");
  const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));
  const publicIdParts = versionIndex >= 0 ? parts.slice(versionIndex + 1) : parts;
  const publicId = publicIdParts.join("/").replace(/\.[a-z0-9]+$/i, "");
  return publicId || null;
}

export function resolveFocalForUrl(
  url: string | null | undefined,
  fotoFocalX: number | null | undefined,
  fotoFocalY: number | null | undefined,
  fotosFocalRaw: unknown,
  isPrincipal = false,
): FocalPoint {
  if (!url) return { x: 0.5, y: 0.5 };
  const map = parseFotosFocalMap(fotosFocalRaw);
  const publicId = publicIdFromImageUrl(url);
  if (publicId && map[publicId]) return map[publicId];
  if (isPrincipal) {
    return {
      x: clamp01(fotoFocalX ?? 0.5),
      y: clamp01(fotoFocalY ?? 0.5),
    };
  }
  return { x: 0.5, y: 0.5 };
}
