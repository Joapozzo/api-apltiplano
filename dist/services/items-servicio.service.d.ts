import type { ApiSuccessResponse, ApiPaginatedResponse } from "../types/api.types.js";
export interface ItemServicioFilters {
    categoria?: string;
    activo?: boolean;
    es_adicional?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class ItemsServicioService {
    /**
     * Obtener todos los items de servicio con filtros opcionales
     */
    static getAll(filters?: ItemServicioFilters): Promise<ApiPaginatedResponse<{
        nombre: string;
        activo: boolean;
        descripcion: string | null;
        id_item_servicio: number;
        categoria: string;
        es_adicional: boolean;
    }>>;
    /**
     * Obtener item por ID
     */
    static getById(id: number): Promise<ApiSuccessResponse<{
        nombre: string;
        activo: boolean;
        descripcion: string | null;
        id_item_servicio: number;
        categoria: string;
        es_adicional: boolean;
    }>>;
    /**
     * Obtener sugerencias para autocompletado
     */
    static getSuggestions(search?: string): Promise<ApiSuccessResponse<string[]>>;
    /**
     * Crear nuevo item
     */
    static create(data: any): Promise<ApiSuccessResponse<{
        nombre: string;
        activo: boolean;
        descripcion: string | null;
        id_item_servicio: number;
        categoria: string;
        es_adicional: boolean;
    }>>;
    /**
     * Actualizar item
     */
    static update(id: number, data: any): Promise<ApiSuccessResponse<{
        nombre: string;
        activo: boolean;
        descripcion: string | null;
        id_item_servicio: number;
        categoria: string;
        es_adicional: boolean;
    }>>;
    /**
     * Eliminar item
     */
    static delete(id: number): Promise<ApiSuccessResponse<{
        id: number;
    }>>;
}
//# sourceMappingURL=items-servicio.service.d.ts.map