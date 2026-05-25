import { prisma } from "../database/prisma.js";
import type { servicios } from "@prisma/client";
import { identificadorMatchesServicio } from "./servicio-slug.js";

/**
 * Resuelve un servicio activo por slug en BD o por variantes derivadas del nombre.
 */
export async function findServicioActivoPorSlugIdentificador(
  identificador: string
): Promise<servicios | null> {
  const id = identificador.trim();
  if (!id) return null;

  const byColumn = await prisma.servicios.findFirst({
    where: { slug: id, activo: true },
  });
  if (byColumn) return byColumn;

  const activos = await prisma.servicios.findMany({
    where: { activo: true },
  });

  return (
    activos.find((s) => identificadorMatchesServicio(id, s.nombre, s.slug)) ?? null
  );
}
