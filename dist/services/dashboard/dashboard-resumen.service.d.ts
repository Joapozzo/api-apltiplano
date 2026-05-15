import { Prisma } from "@prisma/client";
export interface DashboardFiltros {
    fecha_desde?: Date;
    fecha_hasta?: Date;
}
export interface DashboardResumenResponse {
    resumen: {
        expediciones_activas: number;
        cupos_totales: number;
        cupos_ocupados: number;
        porcentaje_ocupacion: number;
        inscripciones_periodo: number;
        ingresos_estimados: Prisma.Decimal;
        moneda: string;
    };
    expediciones_proximas: Array<{
        id_expedicion: number;
        nombre_servicio: string;
        slug: string | null;
        fecha_salida: Date;
        fecha_fin: Date;
        estado: string;
        cupos_disponibles: number;
        cupos_ocupados: number;
        coordinadores: Array<{
            nombre: string;
            apellido: string;
            rol: string;
        }>;
    }>;
}
export declare function getDashboardResumen(filtros: DashboardFiltros): Promise<DashboardResumenResponse>;
//# sourceMappingURL=dashboard-resumen.service.d.ts.map