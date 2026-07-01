import type { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma.js";

export type ItinerarioPayloadDia = {
  dia: number;
  titulo: string;
  descripcion?: string | null;
};

/** Filtra filas vacías y normaliza campos de texto. */
export function normalizeItinerariosPayload(raw: unknown): ItinerarioPayloadDia[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item): ItinerarioPayloadDia | null => {
      if (!item || typeof item !== "object") return null;
      const r = item as Record<string, unknown>;
      const titulo = String(r.titulo ?? "").trim();
      if (!titulo) return null;

      const descripcionRaw = r.descripcion;
      const descripcion =
        descripcionRaw == null || descripcionRaw === ""
          ? null
          : String(descripcionRaw).trim() || null;

      return {
        dia: Math.max(0, Math.min(60, Number(r.dia ?? 1) || 1)),
        titulo,
        descripcion,
      };
    })
    .filter((d): d is ItinerarioPayloadDia => d !== null)
    .sort((a, b) => a.dia - b.dia);
}

/** Texto concatenado para búsqueda legacy en descripcion_recorrido. */
export function buildDescripcionRecorridoFromItinerarios(
  itinerarios: ItinerarioPayloadDia[],
): string | null {
  if (itinerarios.length === 0) return null;

  const text = itinerarios
    .map((i) => {
      const header = i.dia === 0 ? i.titulo : `Día ${i.dia}: ${i.titulo}`;
      return i.descripcion ? `${header}\n${i.descripcion}` : header;
    })
    .join("\n\n");

  return text.length > 2000 ? text.slice(0, 2000) : text;
}

export async function syncItinerariosForServicio(
  idServicio: number,
  itinerarios: ItinerarioPayloadDia[],
  duracionDias: number,
): Promise<void> {
  await prisma.itinerarios.deleteMany({ where: { id_servicio: idServicio } });

  if (itinerarios.length === 0) return;

  const data: Prisma.itinerariosCreateManyInput[] = itinerarios.map((i) => ({
    id_servicio: idServicio,
    dia: i.dia,
    total_dias: duracionDias,
    titulo: i.titulo,
    descripcion: i.descripcion ?? null,
    comidas: [],
    actividades_especiales: [],
  }));

  await prisma.itinerarios.createMany({ data });
}
