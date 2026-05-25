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
        tipo: string;
        descripcion: string | null;
        titulo: string;
        created_at: Date;
        fecha_fin: Date | null;
        fecha: Date;
        color: string | null;
        todo_el_dia: boolean;
        id_nota: number;
        completada: boolean;
        updated_at: Date;
    }[];
}>;
//# sourceMappingURL=calendario.service.d.ts.map