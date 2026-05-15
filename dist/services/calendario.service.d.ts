export declare function getVistaCalendario(anio: number, mes: number, id_usuario: number): Promise<{
    expediciones: {
        id_expedicion: number;
        nombre_servicio: string;
        slug: string | null;
        fecha_salida: Date;
        fecha_fin: Date;
        estado: string;
        cupos_disponibles: number;
    }[];
    notas: {
        id_usuario: number;
        fecha_actualizacion: Date;
        fecha_creacion: Date;
        fecha_fin: Date | null;
        tipo: string;
        descripcion: string | null;
        titulo: string;
        fecha: Date;
        color: string | null;
        todo_el_dia: boolean;
        id_nota: number;
        completada: boolean;
    }[];
}>;
//# sourceMappingURL=calendario.service.d.ts.map