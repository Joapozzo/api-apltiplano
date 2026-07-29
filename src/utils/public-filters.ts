import type { Prisma } from "@prisma/client";
import type { PublicCatalogQuery } from "../types/public-salidas.dto.js";

/** Legacy msnm slugs → id_dificultad (seed: Inicial=4, Moderada=1, Media-alta=2, Exigente=3). */
const LEGACY_DIFICULTAD_TO_ID: Record<string, number> = {
  inicial: 4,
  medio: 1,
  avanzado: 3,
};

/**
 * Filtro público: búsqueda + dificultad por id_dificultad (fuente de verdad = catálogo dificultades).
 * Acepta: "todas" | id numérico | slug legacy (inicial|medio|avanzado).
 */
export function buildServicioPublicWhere(
  q?: string,
  dificultad: PublicCatalogQuery["dificultad"] = "todas",
): Prisma.serviciosWhereInput {
  const where: Prisma.serviciosWhereInput = {};

  if (q) {
    where.OR = [
      { nombre: { contains: q, mode: "insensitive" } },
      { desc_resumen: { contains: q, mode: "insensitive" } },
      { descripcion_completa: { contains: q, mode: "insensitive" } },
    ];
  }

  if (dificultad && dificultad !== "todas") {
    const asNum = Number.parseInt(String(dificultad), 10);
    if (Number.isFinite(asNum) && asNum > 0) {
      where.id_dificultad = asNum;
    } else {
      const legacyId = LEGACY_DIFICULTAD_TO_ID[String(dificultad).toLowerCase()];
      if (legacyId) {
        where.id_dificultad = legacyId;
      }
    }
  }

  return where;
}
