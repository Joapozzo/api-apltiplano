import type { ApiPaginatedResponse, ApiSuccessResponse } from "../types/api.types.js";
import type { PublicCatalogQuery, SalidaPublicaPar, SalidaPublicaCalendarioResponse, SalidasCalendarioQuery } from "../types/public-salidas.dto.js";
import { normalizeExpedicionPublic, normalizeServicioPublic } from "../utils/public-serializers.js";
export declare class PublicSalidasService {
    /** Expediciones futuras con servicio/expedición alineados al front. */
    static list(query: PublicCatalogQuery): Promise<ApiPaginatedResponse<SalidaPublicaPar>>;
    static calendarioPorAnio(query: SalidasCalendarioQuery): Promise<ApiSuccessResponse<SalidaPublicaCalendarioResponse>>;
    static getDetalle(identificador: string, idExpedicionOpcional?: number): Promise<ApiSuccessResponse<{
        servicio: ReturnType<typeof normalizeServicioPublic>;
        expedicion: ReturnType<typeof normalizeExpedicionPublic>;
    }> | {
        success: true;
        data: {
            servicio: {
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
                servicio_items: ({
                    items_servicio: {
                        nombre: string;
                        activo: boolean;
                        descripcion: string | null;
                        id_item_servicio: number;
                        categoria: string;
                        es_adicional: boolean;
                    };
                } & {
                    id_servicio: number;
                    id_item_servicio: number;
                    id_servicio_item: number;
                    incluido: boolean;
                    observacion: string | null;
                })[];
                itinerarios: {
                    id_servicio: number;
                    peso_mochila: string | null;
                    altitud: number | null;
                    descripcion: string | null;
                    dia: number;
                    id_itinerario: number;
                    total_dias: number | null;
                    titulo: string;
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
            } & {
                fotos: string[];
                desc: string;
            };
            expedicion: null;
        };
    }>;
    private static getDetallePorExpedicionId;
    private static getDetallePorSlugServicio;
}
//# sourceMappingURL=public-salidas.service.d.ts.map