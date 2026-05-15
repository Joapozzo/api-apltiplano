import type { ApiSuccessResponse } from "../types/api.types.js";
import type { CreateActividadBody, CreateLugarBody } from "../types/catalogos.dto.js";
export declare class CatalogosService {
    /**
     * Garantiza una fila en ubicaciones para altas rápidas de lugares (solo nombre/desc en UI).
     */
    private static ensureDefaultUbicacionId;
    /**
     * Obtener todos los lugares
     */
    static getLugares(): Promise<ApiSuccessResponse<{
        nombre: string;
        id_lugar: number;
    }[]>>;
    /**
     * Obtener todas las actividades
     */
    static getActividades(): Promise<ApiSuccessResponse<{
        nombre: string;
        id_actividad: number;
    }[]>>;
    /**
     * Obtener todas las dificultades
     */
    static getDificultades(): Promise<ApiSuccessResponse<{
        id_dificultad: number;
        nivel: string;
    }[]>>;
    static createLugar(input: CreateLugarBody): Promise<ApiSuccessResponse<{
        nombre: string;
        id_lugar: number;
        descripcion: string | null;
    }>>;
    static createActividad(input: CreateActividadBody): Promise<ApiSuccessResponse<{
        nombre: string;
        id_actividad: number;
        descripcion: string | null;
    }>>;
}
//# sourceMappingURL=catalogos.service.d.ts.map