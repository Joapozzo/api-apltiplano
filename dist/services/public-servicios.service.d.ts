import type { ApiPaginatedResponse, ApiSuccessResponse } from "../types/api.types.js";
import type { CatalogoServicioPar, ServiciosCatalogQuery } from "../types/public-salidas.dto.js";
import type { Prisma } from "@prisma/client";
export declare class PublicServiciosService {
    /**
     * Catálogo: todos los servicios activos (con o sin próxima salida), filtros y orden.
     */
    static listCatalog(query: ServiciosCatalogQuery): Promise<ApiPaginatedResponse<CatalogoServicioPar>>;
    static getByIdentificador(identificador: string): Promise<ApiSuccessResponse<{
        servicio: {
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
        expedicion: Omit<{
            expedicion_precios: {
                id_expedicion: number;
                moneda: string;
                id_expedicion_precio: number;
                nombre_paquete: string;
                precio: Prisma.Decimal;
            }[];
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
        }, "expedicion_precios"> & {
            fecha_salida: string;
            fecha_fin: string;
            precios: import("../utils/public-serializers.js").PublicPrecioItem[];
        };
    }> | ApiSuccessResponse<{
        servicio: {
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
    }>>;
}
//# sourceMappingURL=public-servicios.service.d.ts.map