import { prisma } from "../../database/prisma.js";

export interface DashboardAlertas {
  expediciones_cupos_criticos: Array<{
    id_expedicion: number;
    nombre_servicio: string;
    fecha_salida: Date;
    cupos_disponibles: number;
  }>;
  tokens_vencidos_sin_usar: Array<{
    id: number;
    expires_at: Date;
    cliente: {
      nombre: string;
      apellido: string;
    };
    expedicion: {
      nombre_servicio: string;
      fecha_salida: Date;
    };
  }>;
  inscripciones_sin_datos_medicos: Array<{
    id_inscripcion: number;
    cliente: {
      nombre: string;
      apellido: string;
    };
    expedicion: {
      nombre_servicio: string;
    };
  }>;
  presupuestos_por_vencer: Array<{
    id_expedicion: number;
    nombre_servicio: string;
    presupuesto_valido_hasta: Date;
  }>;
}

export async function getDashboardAlertas(): Promise<DashboardAlertas> {
  const hoy = new Date();
  const proximaSemana = new Date(hoy);
  proximaSemana.setDate(proximaSemana.getDate() + 7);

  const [
    expedicionesCuposCriticos,
    tokensVencidosSinUsar,
    inscripcionesSinDatosMedicos,
    presupuestosPorVencer,
  ] = await Promise.all([
    prisma.expediciones.findMany({
      where: {
        cupos_disponibles: {
          lte: 2,
        },
      },
      select: {
        id_expedicion: true,
        fecha_salida: true,
        cupos_disponibles: true,
        servicios: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        fecha_salida: "asc",
      },
    }),
    prisma.inscripcion_tokens.findMany({
      where: {
        expires_at: {
          lt: hoy,
        },
        usado: false,
      },
      select: {
        id: true,
        expires_at: true,
        clientes: {
          select: {
            nombre: true,
            apellido: true,
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
      orderBy: {
        expires_at: "asc",
      },
    }),
    prisma.inscripciones.findMany({
      where: {
        inscripcion_datos_medicos: null,
      },
      select: {
        id_inscripcion: true,
        clientes: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
        expediciones: {
          select: {
            servicios: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
      orderBy: {
        fecha_inscripcion: "desc",
      },
    }),
    prisma.expediciones.findMany({
      where: {
        presupuesto_valido_hasta: {
          gte: hoy,
          lte: proximaSemana,
        },
      },
      select: {
        id_expedicion: true,
        presupuesto_valido_hasta: true,
        servicios: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        presupuesto_valido_hasta: "asc",
      },
    }),
  ]);

  return {
    expediciones_cupos_criticos: expedicionesCuposCriticos.map((expedicion) => ({
      id_expedicion: expedicion.id_expedicion,
      nombre_servicio: expedicion.servicios.nombre,
      fecha_salida: expedicion.fecha_salida,
      cupos_disponibles: expedicion.cupos_disponibles,
    })),
    tokens_vencidos_sin_usar: tokensVencidosSinUsar.map((token) => ({
      id: token.id,
      expires_at: token.expires_at,
      cliente: {
        nombre: token.clientes.nombre,
        apellido: token.clientes.apellido,
      },
      expedicion: {
        nombre_servicio: token.expediciones.servicios.nombre,
        fecha_salida: token.expediciones.fecha_salida,
      },
    })),
    inscripciones_sin_datos_medicos: inscripcionesSinDatosMedicos.map((inscripcion) => ({
      id_inscripcion: inscripcion.id_inscripcion,
      cliente: {
        nombre: inscripcion.clientes.nombre,
        apellido: inscripcion.clientes.apellido,
      },
      expedicion: {
        nombre_servicio: inscripcion.expediciones.servicios.nombre,
      },
    })),
    presupuestos_por_vencer: presupuestosPorVencer
      .filter((expedicion) => expedicion.presupuesto_valido_hasta)
      .map((expedicion) => ({
        id_expedicion: expedicion.id_expedicion,
        nombre_servicio: expedicion.servicios.nombre,
        presupuesto_valido_hasta: expedicion.presupuesto_valido_hasta as Date,
      })),
  };
}
