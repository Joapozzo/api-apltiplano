import { prisma } from "../../database/prisma.js";
import { decryptClientePii } from "../../utils/data-protection.js";

export interface ActividadReciente {
  id_inscripcion: number;
  fecha_inscripcion: Date;
  estado: string;
  reserva_pagada: boolean;
  saldo_pagado: boolean;
  cliente: {
    nombre: string;
    apellido: string;
    email: string;
  };
  expedicion: {
    nombre_servicio: string;
    fecha_salida: Date;
  };
}

export async function getDashboardActividad(): Promise<ActividadReciente[]> {
  const inscripciones = await prisma.inscripciones.findMany({
    take: 10,
    orderBy: {
      fecha_inscripcion: "desc",
    },
    include: {
      clientes: {
        select: {
          nombre: true,
          apellido: true,
          email: true,
        },
      },
      expediciones: {
        select: {
          fecha_salida: true,
          servicios: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
  });

  return inscripciones.map((inscripcion) => {
    const cliente = decryptClientePii(inscripcion.clientes);
    return {
      id_inscripcion: inscripcion.id_inscripcion,
      fecha_inscripcion: inscripcion.fecha_inscripcion,
      estado: inscripcion.estado,
      reserva_pagada: inscripcion.reserva_pagada,
      saldo_pagado: inscripcion.saldo_pagado,
      cliente: {
        nombre: cliente.nombre as string,
        apellido: cliente.apellido as string,
        email: cliente.email as string,
      },
      expedicion: {
        nombre_servicio: inscripcion.expediciones.servicios.nombre,
        fecha_salida: inscripcion.expediciones.fecha_salida,
      },
    };
  });
}
