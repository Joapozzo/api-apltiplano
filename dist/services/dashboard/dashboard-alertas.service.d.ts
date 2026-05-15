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
export declare function getDashboardAlertas(): Promise<DashboardAlertas>;
//# sourceMappingURL=dashboard-alertas.service.d.ts.map