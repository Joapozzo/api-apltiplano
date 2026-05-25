import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma.js";
import { getMonedaDefault } from "../../utils/config-runtime.js";
const ESTADOS_EXPEDICIONES_ACTIVAS = ["confirmada", "en_proceso"];
export async function getDashboardResumen(filtros) {
    const fechaDesde = filtros.fecha_desde ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const fechaHasta = filtros.fecha_hasta ??
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
    const hoy = new Date();
    const [expedicionesActivas, inscripcionesPeriodo, pagosPeriodo, expedicionesProximas] = await Promise.all([
        prisma.expediciones.findMany({
            where: {
                estado: {
                    in: ESTADOS_EXPEDICIONES_ACTIVAS,
                },
            },
            select: {
                id_expedicion: true,
                cupos_disponibles: true,
                cupos_ocupados: true,
            },
        }),
        prisma.inscripciones.count({
            where: {
                fecha_inscripcion: {
                    gte: fechaDesde,
                    lte: fechaHasta,
                },
            },
        }),
        prisma.pagos.aggregate({
            _sum: {
                monto: true,
            },
            where: {
                estado: "aprobado",
                fecha_pago: {
                    gte: fechaDesde,
                    lte: fechaHasta,
                },
            },
        }),
        prisma.expediciones.findMany({
            where: {
                fecha_salida: {
                    gte: hoy,
                },
            },
            take: 5,
            orderBy: {
                fecha_salida: "asc",
            },
            select: {
                id_expedicion: true,
                fecha_salida: true,
                fecha_fin: true,
                estado: true,
                cupos_disponibles: true,
                cupos_ocupados: true,
                servicios: {
                    select: {
                        nombre: true,
                        slug: true,
                    },
                },
                expedicion_coordinadores: {
                    select: {
                        rol: true,
                        coordinadores: {
                            select: {
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);
    const cuposTotales = expedicionesActivas.reduce((total, expedicion) => total + expedicion.cupos_disponibles, 0);
    const cuposOcupados = expedicionesActivas.reduce((total, expedicion) => total + expedicion.cupos_ocupados, 0);
    const porcentajeOcupacion = cuposTotales > 0 ? Number(((cuposOcupados / cuposTotales) * 100).toFixed(2)) : 0;
    const moneda = await getMonedaDefault();
    return {
        resumen: {
            expediciones_activas: expedicionesActivas.length,
            cupos_totales: cuposTotales,
            cupos_ocupados: cuposOcupados,
            porcentaje_ocupacion: porcentajeOcupacion,
            inscripciones_periodo: inscripcionesPeriodo,
            ingresos_estimados: pagosPeriodo._sum.monto ?? new Prisma.Decimal(0),
            moneda,
        },
        expediciones_proximas: expedicionesProximas.map((expedicion) => ({
            id_expedicion: expedicion.id_expedicion,
            nombre_servicio: expedicion.servicios.nombre,
            slug: expedicion.servicios.slug,
            fecha_salida: expedicion.fecha_salida,
            fecha_fin: expedicion.fecha_fin,
            estado: expedicion.estado,
            cupos_disponibles: expedicion.cupos_disponibles,
            cupos_ocupados: expedicion.cupos_ocupados,
            coordinadores: expedicion.expedicion_coordinadores.map((coordinador) => ({
                nombre: coordinador.coordinadores.nombre,
                apellido: coordinador.coordinadores.apellido,
                rol: coordinador.rol,
            })),
        })),
    };
}
//# sourceMappingURL=dashboard-resumen.service.js.map