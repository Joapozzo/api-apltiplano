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
export declare function getDashboardActividad(): Promise<ActividadReciente[]>;
//# sourceMappingURL=dashboard-actividad.service.d.ts.map