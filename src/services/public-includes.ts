import type { Prisma } from "@prisma/client";

/** Servicio completo para ficha pública (hero, galería, itinerario, etc.) */
export const publicServicioDetailInclude = {
  lugares: {
    include: {
      ubicaciones: true,
    },
  },
  actividades: true,
  dificultades: true,
  itinerarios: {
    orderBy: { dia: "asc" as const },
  },
  servicio_items: {
    include: {
      items_servicio: true,
    },
  },
} satisfies Prisma.serviciosInclude;

export const publicExpedicionDetailInclude = {
  servicios: {
    include: publicServicioDetailInclude,
  },
  expedicion_precios: true,
} satisfies Prisma.expedicionesInclude;
