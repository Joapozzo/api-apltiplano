import { prisma } from "../database/prisma.js";
import { getNotasByMes } from "./notas-calendario.service.js";

type ExpedicionCalendario = {
  id_expedicion: number;
  fecha_salida: Date;
  fecha_fin: Date;
  estado: string;
  cupos_disponibles: number;
  servicios: {
    nombre: string;
    slug: string | null;
  };
};

export async function getVistaCalendario(anio: number, mes: number, id_usuario: number) {
  const fechaDesde = new Date(Date.UTC(anio, mes - 1, 1, 0, 0, 0, 0));
  const fechaHasta = new Date(Date.UTC(anio, mes, 0, 23, 59, 59, 999));

  const [expediciones, notas] = await Promise.all([
    prisma.expediciones.findMany({
      where: {
        OR: [
          {
            fecha_salida: {
              gte: fechaDesde,
              lte: fechaHasta,
            },
          },
          {
            fecha_fin: {
              gte: fechaDesde,
              lte: fechaHasta,
            },
          },
        ],
      },
      select: {
        id_expedicion: true,
        fecha_salida: true,
        fecha_fin: true,
        estado: true,
        cupos_disponibles: true,
        servicios: {
          select: {
            nombre: true,
            slug: true,
          },
        },
      },
      orderBy: {
        fecha_salida: "asc",
      },
    }),
    getNotasByMes(anio, mes, id_usuario),
  ]);

  return {
    expediciones: expediciones.map((expedicion: ExpedicionCalendario) => ({
      id_expedicion: expedicion.id_expedicion,
      nombre_servicio: expedicion.servicios.nombre,
      slug: expedicion.servicios.slug,
      fecha_salida: expedicion.fecha_salida,
      fecha_fin: expedicion.fecha_fin,
      estado: expedicion.estado,
      cupos_disponibles: expedicion.cupos_disponibles,
    })),
    notas,
  };
}
