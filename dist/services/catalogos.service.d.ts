import type { ApiSuccessResponse } from "../types/api.types.js";
export type { CreateActividadBody, CreateLugarBody, CreateUbicacionBody, CreateDificultadBody, } from "../types/catalogos.dto.js";
export declare function getAllUbicaciones(activo?: boolean): Promise<ApiSuccessResponse<{
    activo: boolean;
    provincia: string;
    id_ubicacion: number;
    orden: number;
    pais: string;
    zona: string;
}[]>>;
export declare function getUbicacionById(id: number): Promise<ApiSuccessResponse<{
    lugares: {
        nombre: string;
        activo: boolean;
        id_lugar: number;
    }[];
} & {
    activo: boolean;
    provincia: string;
    id_ubicacion: number;
    orden: number;
    pais: string;
    zona: string;
}>>;
export declare function createUbicacion(data: {
    pais: string;
    provincia: string;
    zona: string;
    orden?: number;
}): Promise<ApiSuccessResponse<{
    activo: boolean;
    provincia: string;
    id_ubicacion: number;
    orden: number;
    pais: string;
    zona: string;
}>>;
export declare function updateUbicacion(id: number, data: Partial<{
    pais: string;
    provincia: string;
    zona: string;
    orden: number;
    activo: boolean;
}>): Promise<ApiSuccessResponse<{
    activo: boolean;
    provincia: string;
    id_ubicacion: number;
    orden: number;
    pais: string;
    zona: string;
}>>;
export declare function toggleUbicacionActivo(id: number): Promise<ApiSuccessResponse<{
    activo: boolean;
    provincia: string;
    id_ubicacion: number;
    orden: number;
    pais: string;
    zona: string;
}>>;
export declare function deleteUbicacion(id: number): Promise<{
    success: boolean;
    data: {
        id: number;
    };
}>;
export declare function getAllLugares(activo?: boolean, id_ubicacion?: number): Promise<ApiSuccessResponse<({
    ubicaciones: {
        provincia: string;
        pais: string;
        zona: string;
    };
} & {
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_lugar: number;
    id_ubicacion: number;
    orden: number;
    tipo_lugar: string;
    altitud: number;
})[]>>;
export declare function getLugarById(id: number): Promise<ApiSuccessResponse<{
    ubicaciones: {
        provincia: string;
        id_ubicacion: number;
        pais: string;
        zona: string;
    };
    servicios: {
        nombre: string;
        id_servicio: number;
    }[];
} & {
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_lugar: number;
    id_ubicacion: number;
    orden: number;
    tipo_lugar: string;
    altitud: number;
}>>;
export declare function createLugar(data: {
    nombre: string;
    id_ubicacion: number;
    tipo_lugar?: string;
    altitud?: number;
    descripcion?: string | null;
    orden?: number;
}): Promise<ApiSuccessResponse<{
    ubicaciones: {
        provincia: string;
        pais: string;
        zona: string;
    };
} & {
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_lugar: number;
    id_ubicacion: number;
    orden: number;
    tipo_lugar: string;
    altitud: number;
}>>;
export declare function updateLugar(id: number, data: Partial<{
    nombre: string;
    id_ubicacion: number;
    tipo_lugar: string;
    altitud: number;
    descripcion: string | null;
    orden: number;
    activo: boolean;
}>): Promise<ApiSuccessResponse<{
    ubicaciones: {
        provincia: string;
        pais: string;
        zona: string;
    };
} & {
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_lugar: number;
    id_ubicacion: number;
    orden: number;
    tipo_lugar: string;
    altitud: number;
}>>;
export declare function toggleLugarActivo(id: number): Promise<ApiSuccessResponse<{
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_lugar: number;
    id_ubicacion: number;
    orden: number;
    tipo_lugar: string;
    altitud: number;
}>>;
export declare function deleteLugar(id: number): Promise<{
    success: boolean;
    data: {
        id: number;
    };
}>;
export declare function getAllActividades(activo?: boolean): Promise<ApiSuccessResponse<{
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_actividad: number;
    orden: number;
}[]>>;
export declare function getActividadById(id: number): Promise<ApiSuccessResponse<{
    servicios: {
        nombre: string;
        id_servicio: number;
    }[];
} & {
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_actividad: number;
    orden: number;
}>>;
export declare function createActividad(data: {
    nombre: string;
    descripcion?: string | null;
    orden?: number;
}): Promise<ApiSuccessResponse<{
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_actividad: number;
    orden: number;
}>>;
export declare function updateActividad(id: number, data: Partial<{
    nombre: string;
    descripcion: string | null;
    orden: number;
    activo: boolean;
}>): Promise<ApiSuccessResponse<{
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_actividad: number;
    orden: number;
}>>;
export declare function toggleActividadActivo(id: number): Promise<ApiSuccessResponse<{
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    id_actividad: number;
    orden: number;
}>>;
export declare function deleteActividad(id: number): Promise<{
    success: boolean;
    data: {
        id: number;
    };
}>;
export declare function getAllDificultades(activo?: boolean): Promise<ApiSuccessResponse<{
    activo: boolean;
    descripcion: string | null;
    id_dificultad: number;
    orden: number;
    nivel: string;
}[]>>;
export declare function getDificultadById(id: number): Promise<ApiSuccessResponse<{
    servicios: {
        nombre: string;
        id_servicio: number;
    }[];
} & {
    activo: boolean;
    descripcion: string | null;
    id_dificultad: number;
    orden: number;
    nivel: string;
}>>;
export declare function createDificultad(data: {
    nivel: string;
    descripcion?: string | null;
    orden?: number;
}): Promise<ApiSuccessResponse<{
    activo: boolean;
    descripcion: string | null;
    id_dificultad: number;
    orden: number;
    nivel: string;
}>>;
export declare function updateDificultad(id: number, data: Partial<{
    nivel: string;
    descripcion: string | null;
    orden: number;
    activo: boolean;
}>): Promise<ApiSuccessResponse<{
    activo: boolean;
    descripcion: string | null;
    id_dificultad: number;
    orden: number;
    nivel: string;
}>>;
export declare function toggleDificultadActivo(id: number): Promise<ApiSuccessResponse<{
    activo: boolean;
    descripcion: string | null;
    id_dificultad: number;
    orden: number;
    nivel: string;
}>>;
export declare function deleteDificultad(id: number): Promise<{
    success: boolean;
    data: {
        id: number;
    };
}>;
export declare function getCatalogosCompletos(): Promise<{
    success: boolean;
    data: {
        ubicaciones: {
            activo: boolean;
            provincia: string;
            id_ubicacion: number;
            orden: number;
            pais: string;
            zona: string;
        }[];
        lugares: ({
            ubicaciones: {
                provincia: string;
                pais: string;
                zona: string;
            };
        } & {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_lugar: number;
            id_ubicacion: number;
            orden: number;
            tipo_lugar: string;
            altitud: number;
        })[];
        actividades: {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_actividad: number;
            orden: number;
        }[];
        dificultades: {
            activo: boolean;
            descripcion: string | null;
            id_dificultad: number;
            orden: number;
            nivel: string;
        }[];
        items_servicio_activos: {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_item_servicio: number;
            categoria: string;
            es_adicional: boolean;
        }[];
    };
}>;
//# sourceMappingURL=catalogos.service.d.ts.map