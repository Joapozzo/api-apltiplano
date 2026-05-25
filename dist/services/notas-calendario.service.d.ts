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
}[]>;
export declare function getNotasByMes(anio: number, mes: number, id_usuario: number): Promise<{
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
}[]>;
export declare function getNotaById(id: number, id_usuario: number): Promise<{
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
}>;
export declare function createNota(data: CreateNotaDTO, id_usuario: number): Promise<{
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
}>;
export declare function updateNota(id: number, data: UpdateNotaDTO, id_usuario: number): Promise<{
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
}>;
export declare function toggleCompletada(id: number, id_usuario: number): Promise<{
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
}>;
export declare function deleteNota(id: number, id_usuario: number): Promise<{
    success: boolean;
}>;
//# sourceMappingURL=notas-calendario.service.d.ts.map