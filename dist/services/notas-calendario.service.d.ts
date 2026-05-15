export interface NotasCalendarioFiltros {
    id_usuario: number;
    fecha_desde?: Date;
    fecha_hasta?: Date;
    tipo?: string;
    completada?: boolean;
}
export interface CreateNotaDTO {
    titulo: string;
    descripcion?: string;
    fecha: Date;
    fecha_fin?: Date;
    tipo: "nota" | "recordatorio" | "tarea";
    color?: string;
    todo_el_dia?: boolean;
}
export interface UpdateNotaDTO extends Partial<CreateNotaDTO> {
}
export declare function getNotas(filtros: NotasCalendarioFiltros): Promise<{
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
}[]>;
export declare function getNotasByMes(anio: number, mes: number, id_usuario: number): Promise<{
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
}[]>;
export declare function getNotaById(id: number, id_usuario: number): Promise<{
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
}>;
export declare function createNota(data: CreateNotaDTO, id_usuario: number): Promise<{
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
}>;
export declare function updateNota(id: number, data: UpdateNotaDTO, id_usuario: number): Promise<{
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
}>;
export declare function toggleCompletada(id: number, id_usuario: number): Promise<{
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
}>;
export declare function deleteNota(id: number, id_usuario: number): Promise<{
    success: boolean;
}>;
//# sourceMappingURL=notas-calendario.service.d.ts.map