import type { ApiSuccessResponse, ApiPaginatedResponse } from "../types/api.types.js";
export interface ServicioFilters {
    activo?: boolean;
    destacado?: boolean;
    lugar?: number;
    actividad?: number;
    dificultad?: number;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class ServiciosService {
    /**
     * Obtener todos los servicios con filtros opcionales
     */
    static getAll(filters?: ServicioFilters): Promise<ApiPaginatedResponse<{
        lugares: {
            ubicaciones: {
                activo: boolean;
                provincia: string;
                id_ubicacion: number;
                orden: number;
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
        };
        actividades: {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_actividad: number;
            orden: number;
        };
        dificultades: {
            activo: boolean;
            descripcion: string | null;
            id_dificultad: number;
            orden: number;
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
    }>>;
    /**
     * Obtener servicio por ID
     */
    static getById(id: number): Promise<ApiSuccessResponse<{
        lugares: {
            ubicaciones: {
                activo: boolean;
                provincia: string;
                id_ubicacion: number;
                orden: number;
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
        };
        actividades: {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_actividad: number;
            orden: number;
        };
        dificultades: {
            activo: boolean;
            descripcion: string | null;
            id_dificultad: number;
            orden: number;
            nivel: string;
        };
        itinerarios: {
            id_servicio: number;
            descripcion: string | null;
            titulo: string;
            peso_mochila: string | null;
            altitud: number | null;
            dia: number;
            id_itinerario: number;
            total_dias: number | null;
            hora_inicio: string | null;
            hora_fin: string | null;
            distancia_km: number | null;
            desnivel_metros: number | null;
            duracion_horas: string | null;
            alojamiento: string | null;
            comidas: string[];
            actividades_especiales: string[];
            intensidad: string | null;
        }[];
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
    }>>;
    /**
     * Obtener servicios activos (para selects)
     */
    static getActive(): Promise<ApiSuccessResponse<{
        nombre: string;
        lugares: {
            nombre: string;
        };
        id_servicio: number;
        id_lugar: number;
    }[]>>;
    /**
     * Crear nuevo servicio
     */
    static create(data: any): Promise<ApiSuccessResponse<{
        lugares: {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_lugar: number;
            id_ubicacion: number;
            orden: number;
            tipo_lugar: string;
            altitud: number;
        };
        actividades: {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_actividad: number;
            orden: number;
        };
        dificultades: {
            activo: boolean;
            descripcion: string | null;
            id_dificultad: number;
            orden: number;
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
    }>>;
    /**
     * Actualizar servicio
     */
    static update(id: number, data: any): Promise<ApiSuccessResponse<{
        lugares: {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_lugar: number;
            id_ubicacion: number;
            orden: number;
            tipo_lugar: string;
            altitud: number;
        };
        actividades: {
            nombre: string;
            activo: boolean;
            descripcion: string | null;
            id_actividad: number;
            orden: number;
        };
        dificultades: {
            activo: boolean;
            descripcion: string | null;
            id_dificultad: number;
            orden: number;
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
    }>>;
    /**
     * Eliminar servicio
     */
    static delete(id: number): Promise<ApiSuccessResponse<{
        id: number;
    }>>;
    /**
     * Toggle activo
     */
    static toggleActivo(id: number): Promise<ApiSuccessResponse<{
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
    }>>;
    /**
     * Toggle destacado
     */
    static toggleDestacado(id: number): Promise<ApiSuccessResponse<{
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
    }>>;
}
//# sourceMappingURL=servicios.service.d.ts.map