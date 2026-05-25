import { prisma } from "../database/prisma.js";

export class CatalogosServiceError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "CatalogosServiceError";
    this.status = status;
    this.code = code;
  }
}

const PROTECTED_DIFICULTAD_IDS = [1, 2, 3];

export async function assertUbicacionDeletable(id: number): Promise<void> {
  const count = await prisma.lugares.count({
    where: { id_ubicacion: id },
  });

  if (count > 0) {
    throw new CatalogosServiceError(
      `No se puede eliminar la ubicación porque tiene ${count} lugar(es) asociado(s)`,
      409,
      "CATALOG_IN_USE",
    );
  }
}

export async function assertLugarDeletable(id: number): Promise<void> {
  const count = await prisma.servicios.count({
    where: { id_lugar: id },
  });

  if (count > 0) {
    throw new CatalogosServiceError(
      `No se puede eliminar el lugar porque está asociado a ${count} servicio(s)`,
      409,
      "CATALOG_IN_USE",
    );
  }
}

export async function assertActividadDeletable(id: number): Promise<void> {
  const count = await prisma.servicios.count({
    where: { id_actividad: id },
  });

  if (count > 0) {
    throw new CatalogosServiceError(
      `No se puede eliminar la actividad porque está asociada a ${count} servicio(s)`,
      409,
      "CATALOG_IN_USE",
    );
  }
}

export async function assertDificultadDeletable(id: number): Promise<void> {
  if (PROTECTED_DIFICULTAD_IDS.includes(id)) {
    throw new CatalogosServiceError(
      "No se puede eliminar la dificultad porque es del sistema (ids 1-3)",
      403,
      "CATALOG_PROTECTED",
    );
  }

  const count = await prisma.servicios.count({
    where: { id_dificultad: id },
  });

  if (count > 0) {
    throw new CatalogosServiceError(
      `No se puede eliminar la dificultad porque está asociada a ${count} servicio(s)`,
      409,
      "CATALOG_IN_USE",
    );
  }
}

export async function assertCatalogoActivo(
  tipo: "actividades" | "dificultades" | "lugares" | "ubicaciones",
  id: number,
): Promise<void> {
  let activo: boolean | null = null;

  if (tipo === "actividades") {
    const actividad = await prisma.actividades.findUnique({
      where: { id_actividad: id },
      select: { activo: true },
    });
    activo = actividad?.activo ?? null;
  } else if (tipo === "dificultades") {
    const dificultad = await prisma.dificultades.findUnique({
      where: { id_dificultad: id },
      select: { activo: true },
    });
    activo = dificultad?.activo ?? null;
  } else if (tipo === "lugares") {
    const lugar = await prisma.lugares.findUnique({
      where: { id_lugar: id },
      select: { activo: true },
    });
    activo = lugar?.activo ?? null;
  } else if (tipo === "ubicaciones") {
    const ubicacion = await prisma.ubicaciones.findUnique({
      where: { id_ubicacion: id },
      select: { activo: true },
    });
    activo = ubicacion?.activo ?? null;
  }

  if (activo === false) {
    throw new CatalogosServiceError(`El ${tipo.slice(0, -1)} seleccionado está inactivo`, 400, "CATALOG_INACTIVE");
  }
}
