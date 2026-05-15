import type { ApiSuccessResponse, ApiPaginatedResponse } from "../types/api.types.js";
export interface ExpedicionFilters {
    estado?: string;
    servicio?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
    page?: number;
    limit?: number;
}
export interface ExpedicionPrecioInput {
    id_expedicion_precio?: number;
    nombre_paquete: string;
    precio: number;
    moneda: string;
}
export interface ExpedicionCreateInput {
    id_servicio: number;
    fecha_salida: string;
    fecha_fin: string;
    cupos_disponibles: number;
    estado: string;
    presupuesto_valido_hasta?: string | null;
    precios: ExpedicionPrecioInput[];
}
export declare class ExpedicionesService {
    /**
     * Validar si una expedición tiene cupos disponibles
     */
    static validateCuposDisponibles(id_expedicion: number): Promise<{
        valid: boolean;
        message: string;
        cuposLibres?: never;
        expedicion?: never;
    } | {
        valid: boolean;
        message: string;
        cuposLibres: number;
        expedicion?: never;
    } | {
        valid: boolean;
        message: string;
        cuposLibres: number;
        expedicion: {
            servicios: {
                nombre: string;
            };
            id_expedicion: number;
            cupos_disponibles: number;
            cupos_ocupados: number;
            estado: string;
        };
    }>;
    /**
     * Obtener todas las expediciones con filtros opcionales
     */
    static getAll(filters?: ExpedicionFilters): Promise<ApiPaginatedResponse<{
        servicios: {
            lugares: {
                ubicaciones: {
                    provincia: string;
                    id_ubicacion: number;
                    pais: string;
                    zona: string;
                };
            } & {
                nombre: string;
                id_lugar: number;
                tipo_lugar: string;
                altitud: number;
                descripcion: string | null;
                id_ubicacion: number;
            };
            actividades: {
                nombre: string;
                id_actividad: number;
                descripcion: string | null;
            };
            dificultades: {
                id_dificultad: number;
                descripcion: string | null;
                nivel: string;
            };
        } & {
            nombre: string;
            activo: boolean;
            fecha_actualizacion: Date;
            fecha_creacion: Date;
            id_servicio: number;
            slug: string | null;
            id_lugar: number;
            id_actividad: number;
            id_dificultad: number;
            duracion_dias: number;
            duracion_noches: number;
            altura_maxima: number;
            desnivel: number | null;
            descripcion_completa: string | null;
            desc_resumen: string | null;
            descripcion_recorrido: string | null;
            sobre_lugar: string | null;
            clima_recomendado: string | null;
            temperatura_dia_min: number | null;
            temperatura_dia_max: number | null;
            temperatura_noche_min: number | null;
            temporada_recomendada: string[];
            experiencia_requerida: string | null;
            horas_caminata_diarias: string | null;
            peso_mochila: string | null;
            conocimientos_tecnicos_requeridos: boolean;
            punto_encuentro: string | null;
            comodidades: string | null;
            briefing_info: string | null;
            consideraciones_especiales: string[];
            modalidad: string | null;
            cupos_maximos: number | null;
            ratio_guia_pasajero: string | null;
            alimentacion_detalle: string | null;
            servicios_incluidos: string[];
            servicios_no_incluidos: string[];
            servicios_adicionales_disponibles: string[];
            diferenciadores: string[];
            gestion_cargas: string[];
            destacado: boolean;
            url_foto: string | null;
            urls_fotos: string[];
        };
        expedicion_precios: {
            id_expedicion: number;
            moneda: string;
            id_expedicion_precio: number;
            nombre_paquete: string;
            precio: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        fecha_actualizacion: Date;
        fecha_creacion: Date;
        id_expedicion: number;
        id_servicio: number;
        fecha_salida: Date;
        fecha_fin: Date;
        cupos_disponibles: number;
        cupos_ocupados: number;
        estado: string;
        presupuesto_valido_hasta: Date | null;
    }>>;
    /**
     * Obtener expedición por ID
     */
    static getById(id: number): Promise<ApiSuccessResponse<{
        inscripciones: ({
            clientes: {
                email: string;
                nombre: string;
                apellido: string;
                id_cliente: number;
            };
        } & {
            id_cliente: number;
            dni: string | null;
            telefono: string | null;
            fecha_nacimiento: Date | null;
            emergencia_nombre: string | null;
            emergencia_telefono: string | null;
            id_expedicion: number;
            id_inscripcion: number;
            estado: string;
            fecha_inscripcion: Date;
            reserva_pagada: boolean;
            saldo_pagado: boolean;
            provincia: string | null;
        })[];
        servicios: {
            lugares: {
                ubicaciones: {
                    provincia: string;
                    id_ubicacion: number;
                    pais: string;
                    zona: string;
                };
            } & {
                nombre: string;
                id_lugar: number;
                tipo_lugar: string;
                altitud: number;
                descripcion: string | null;
                id_ubicacion: number;
            };
            actividades: {
                nombre: string;
                id_actividad: number;
                descripcion: string | null;
            };
            dificultades: {
                id_dificultad: number;
                descripcion: string | null;
                nivel: string;
            };
        } & {
            nombre: string;
            activo: boolean;
            fecha_actualizacion: Date;
            fecha_creacion: Date;
            id_servicio: number;
            slug: string | null;
            id_lugar: number;
            id_actividad: number;
            id_dificultad: number;
            duracion_dias: number;
            duracion_noches: number;
            altura_maxima: number;
            desnivel: number | null;
            descripcion_completa: string | null;
            desc_resumen: string | null;
            descripcion_recorrido: string | null;
            sobre_lugar: string | null;
            clima_recomendado: string | null;
            temperatura_dia_min: number | null;
            temperatura_dia_max: number | null;
            temperatura_noche_min: number | null;
            temporada_recomendada: string[];
            experiencia_requerida: string | null;
            horas_caminata_diarias: string | null;
            peso_mochila: string | null;
            conocimientos_tecnicos_requeridos: boolean;
            punto_encuentro: string | null;
            comodidades: string | null;
            briefing_info: string | null;
            consideraciones_especiales: string[];
            modalidad: string | null;
            cupos_maximos: number | null;
            ratio_guia_pasajero: string | null;
            alimentacion_detalle: string | null;
            servicios_incluidos: string[];
            servicios_no_incluidos: string[];
            servicios_adicionales_disponibles: string[];
            diferenciadores: string[];
            gestion_cargas: string[];
            destacado: boolean;
            url_foto: string | null;
            urls_fotos: string[];
        };
        expedicion_precios: {
            id_expedicion: number;
            moneda: string;
            id_expedicion_precio: number;
            nombre_paquete: string;
            precio: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        fecha_actualizacion: Date;
        fecha_creacion: Date;
        id_expedicion: number;
        id_servicio: number;
        fecha_salida: Date;
        fecha_fin: Date;
        cupos_disponibles: number;
        cupos_ocupados: number;
        estado: string;
        presupuesto_valido_hasta: Date | null;
    }>>;
    /**
     * Obtener expediciones activas (para selects)
     */
    static getActive(): Promise<ApiSuccessResponse<({
        servicios: {
            nombre: string;
            id_servicio: number;
        };
        expedicion_precios: {
            id_expedicion: number;
            moneda: string;
            id_expedicion_precio: number;
            nombre_paquete: string;
            precio: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        fecha_actualizacion: Date;
        fecha_creacion: Date;
        id_expedicion: number;
        id_servicio: number;
        fecha_salida: Date;
        fecha_fin: Date;
        cupos_disponibles: number;
        cupos_ocupados: number;
        estado: string;
        presupuesto_valido_hasta: Date | null;
    })[]>>;
    /**
     * Crear nueva expedición
     */
    static create(data: ExpedicionCreateInput): Promise<ApiSuccessResponse<{
        servicios: {
            nombre: string;
        };
        expedicion_precios: {
            id_expedicion: number;
            moneda: string;
            id_expedicion_precio: number;
            nombre_paquete: string;
            precio: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        fecha_actualizacion: Date;
        fecha_creacion: Date;
        id_expedicion: number;
        id_servicio: number;
        fecha_salida: Date;
        fecha_fin: Date;
        cupos_disponibles: number;
        cupos_ocupados: number;
        estado: string;
        presupuesto_valido_hasta: Date | null;
    }>>;
    /**
     * Actualizar expedición existente
     */
    static update(id: number, data: ExpedicionCreateInput): Promise<ApiSuccessResponse<{
        servicios: {
            nombre: string;
        };
        expedicion_precios: {
            id_expedicion: number;
            moneda: string;
            id_expedicion_precio: number;
            nombre_paquete: string;
            precio: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        fecha_actualizacion: Date;
        fecha_creacion: Date;
        id_expedicion: number;
        id_servicio: number;
        fecha_salida: Date;
        fecha_fin: Date;
        cupos_disponibles: number;
        cupos_ocupados: number;
        estado: string;
        presupuesto_valido_hasta: Date | null;
    }>>;
    /**
     * Eliminar expedición
     */
    static delete(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Cambiar estado de expedición
     */
    static changeEstado(id: number, estado: string): Promise<ApiSuccessResponse<{
        servicios: {
            nombre: string;
        };
    } & {
        fecha_actualizacion: Date;
        fecha_creacion: Date;
        id_expedicion: number;
        id_servicio: number;
        fecha_salida: Date;
        fecha_fin: Date;
        cupos_disponibles: number;
        cupos_ocupados: number;
        estado: string;
        presupuesto_valido_hasta: Date | null;
    }>>;
    /**
     * Recalcular cupos ocupados basado en inscripciones confirmadas
     */
    static recalcularCupos(id_expedicion: number): Promise<{
        fecha_actualizacion: Date;
        fecha_creacion: Date;
        id_expedicion: number;
        id_servicio: number;
        fecha_salida: Date;
        fecha_fin: Date;
        cupos_disponibles: number;
        cupos_ocupados: number;
        estado: string;
        presupuesto_valido_hasta: Date | null;
    }>;
}
//# sourceMappingURL=expediciones.service.d.ts.map