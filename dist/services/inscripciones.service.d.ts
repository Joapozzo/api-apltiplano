export interface CreateInscripcionData {
    token: string;
    usuario: {
        nombre: string;
        apellido: string;
        dni: string;
        fecha_nacimiento: Date | string;
        email: string;
        telefono?: string;
        provincia?: string;
        emergencia_nombre?: string;
        emergencia_telefono?: string;
    };
    datos_medicos?: {
        cobertura_medica?: string;
        grupo_sanguineo?: string;
        alergias: boolean;
        alergias_detalle?: string;
        diabetes: boolean;
        asma: boolean;
        hipertension: boolean;
        otros_antecedentes?: string;
    };
    actividad_fisica?: {
        realiza_entrenamiento: boolean;
        tipo_entrenamiento?: string;
        frecuencia_semanal?: number;
        experiencia_trekking: boolean;
        altura_cm?: number;
        peso_kg?: number;
    };
}
export declare class InscripcionesService {
    static generateLink(id_expedicion: number, id_cliente: number, expiresInDays?: number): Promise<{
        success: boolean;
        data: {
            token: string;
            url: string;
            expires_at: string;
        };
    }>;
    static validateToken(token: string): Promise<{
        valid: false;
        error: string;
        expedicion?: never;
        servicio?: never;
        cliente?: never;
    } | {
        valid: true;
        expedicion: {
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
        };
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
        cliente: {
            id_cliente: number;
            nombre: string;
            apellido: string;
            email: string;
        };
        error?: never;
    }>;
    static submitInscripcion(data: CreateInscripcionData): Promise<{
        success: boolean;
        inscripcion_id: number;
        mensaje: string;
    }>;
    static listInscripciones(filters: {
        estado?: string;
        expedicion?: number;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        inscripciones: ({
            clientes: {
                id_usuario: number;
                email: string;
                nombre: string;
                apellido: string;
                id_cliente: number;
                fecha_creacion: Date;
            };
            expediciones: {
                servicios: {
                    lugares: {
                        nombre: string;
                        id_lugar: number;
                        tipo_lugar: string;
                        altitud: number;
                        descripcion: string | null;
                        id_ubicacion: number;
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
        total: number;
        pages: number;
        page: number;
        limit: number;
    }>;
    static getInscripcionById(id: number): Promise<({
        clientes: {
            id_usuario: number;
            email: string;
            nombre: string;
            apellido: string;
            id_cliente: number;
            fecha_creacion: Date;
        };
        expediciones: {
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
        };
        inscripcion_datos_medicos: {
            id_inscripcion: number;
            cobertura_medica: string | null;
            grupo_sanguineo: string | null;
            alergias: boolean;
            alergias_detalle: string | null;
            diabetes: boolean;
            asma: boolean;
            hipertension: boolean;
            otros_antecedentes: string | null;
            id_dato_medico: number;
        } | null;
        inscripcion_actividad_fisica: {
            id_inscripcion: number;
            realiza_entrenamiento: boolean;
            tipo_entrenamiento: string | null;
            frecuencia_semanal: number | null;
            experiencia_trekking: boolean;
            altura_cm: number | null;
            peso_kg: number | null;
            id_actividad_fisica: number;
        } | null;
        pagos: {
            id_inscripcion: number;
            estado: string;
            fecha_pago: Date;
            id_pago: number;
            monto: import("@prisma/client/runtime/library").Decimal;
            moneda: string;
            tipo: string;
            metodo_pago: string;
        }[];
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
    }) | null>;
    static updateInscripcion(id: number, data: Record<string, unknown>): Promise<{
        clientes: {
            id_usuario: number;
            email: string;
            nombre: string;
            apellido: string;
            id_cliente: number;
            fecha_creacion: Date;
        };
        expediciones: {
            servicios: {
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
    }>;
    static deleteInscripcion(id: number): Promise<{
        success: boolean;
    }>;
    static listTokens(filters: {
        id_expedicion?: number;
        usado?: boolean;
        expirado?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: number;
            token: string;
            url: string;
            id_expedicion: number;
            id_cliente: number;
            cliente: {
                email: string;
                nombre: string;
                apellido: string;
                id_cliente: number;
            };
            expedicion: {
                id_expedicion: number;
                nombre: string;
                fecha_salida: string;
            };
            expires_at: string;
            usado: boolean;
            created_at: string;
            expirado: boolean;
            activo: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    static disableToken(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=inscripciones.service.d.ts.map