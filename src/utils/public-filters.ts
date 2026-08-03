import type { Prisma } from "@prisma/client";
import type { PublicCatalogQuery } from "../types/public-salidas.dto.js";
import {
  DIFICULTAD_TECNICA_VALUES,
  EXIGENCIA_FISICA_VALUES,
} from "../constants/servicio-nivel.js";

/** Legacy msnm slugs → id_dificultad (seed: Inicial=4, Intermedio=1, Avanzado=2). */
const LEGACY_DIFICULTAD_TO_ID: Record<string, number> = {
  inicial: 4,
  medio: 1,
  intermedio: 1,
  avanzado: 2,
  // legacy aliases
  moderada: 1,
  "media-alta": 2,
  exigente: 2,
};

function isExigenciaFisica(
  v: string,
): v is (typeof EXIGENCIA_FISICA_VALUES)[number] {
  return (EXIGENCIA_FISICA_VALUES as readonly string[]).includes(v);
}

function isDificultadTecnica(
  v: string,
): v is (typeof DIFICULTAD_TECNICA_VALUES)[number] {
  return (DIFICULTAD_TECNICA_VALUES as readonly string[]).includes(v);
}

/**
 * Filtro público: búsqueda + nivel (`id_dificultad`) + exigencia física + dificultad técnica.
 * Nivel acepta: "todas" | id numérico | slug legacy (inicial|medio|avanzado).
 */
export function buildServicioPublicWhere(
  q?: string,
  dificultad: PublicCatalogQuery["dificultad"] = "todas",
  exigencia_fisica: PublicCatalogQuery["exigencia_fisica"] = "todas",
  dificultad_tecnica: PublicCatalogQuery["dificultad_tecnica"] = "todas",
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

  if (exigencia_fisica && exigencia_fisica !== "todas" && isExigenciaFisica(exigencia_fisica)) {
    where.exigencia_fisica = exigencia_fisica;
  }

  if (
    dificultad_tecnica &&
    dificultad_tecnica !== "todas" &&
    isDificultadTecnica(dificultad_tecnica)
  ) {
    where.dificultad_tecnica = dificultad_tecnica;
  }

  return where;
}
