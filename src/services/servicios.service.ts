import { prisma } from "../database/prisma.js";
import type { ApiSuccessResponse, ApiPaginatedResponse } from "../types/api.types.js";
import { assertCatalogoActivo } from "../utils/catalog-referential.js";
import { purgeNotificacionesServicio } from "../utils/notificaciones-cleanup.js";
import { defaultSlugForNombre } from "../utils/servicio-slug.js";
import { AppError } from "../utils/app-error.js";
import { normalizeExperienciaRequerida } from "../utils/servicio-payload.js";
import {
  normalizeItinerariosPayload,
  syncItinerariosForServicio,
} from "../utils/itinerario-payload.js";

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

export class ServiciosService {
  /**
   * Obtener todos los servicios con filtros opcionales
   */
  static async getAll(filters: ServicioFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.activo !== undefined) {
      where.activo = filters.activo;
    }

    if (filters.destacado !== undefined) {
      where.destacado = filters.destacado;
    }

    if (filters.lugar) {
      where.id_lugar = filters.lugar;
    }

    if (filters.actividad) {
      where.id_actividad = filters.actividad;
    }

    if (filters.dificultad) {
      where.id_dificultad = filters.dificultad;
    }

    if (filters.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: "insensitive" } },
        { descripcion_completa: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [servicios, total] = await Promise.all([
      prisma.servicios.findMany({
        where,
        skip,
        take: limit,
        include: {
          lugares: {
            include: {
              ubicaciones: true,
            },
          },
          actividades: true,
          dificultades: true,
        },
        orderBy: {
          nombre: "asc",
        },
      }),
      prisma.servicios.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data: servicios,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    } as ApiPaginatedResponse<(typeof servicios)[0]>;
  }

  /**
   * Obtener servicio por ID
   */
  static async getById(id: number) {
    const servicio = await prisma.servicios.findUnique({
      where: { id_servicio: id },
      include: {
        lugares: {
          include: {
            ubicaciones: true,
          },
        },
        actividades: true,
        dificultades: true,
        itinerarios: {
          orderBy: {
            dia: "asc",
          },
        },
      },
    });

    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }

    return {
      success: true,
      data: servicio,
    } as ApiSuccessResponse<typeof servicio>;
  }

  /**
   * Obtener servicios activos (para selects)
   */
  static async getActive() {
    const servicios = await prisma.servicios.findMany({
      where: {
        activo: true,
      },
      select: {
        id_servicio: true,
        nombre: true,
        id_lugar: true,
        lugares: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      success: true,
      data: servicios,
    } as ApiSuccessResponse<typeof servicios>;
  }

  /**
   * Crear nuevo servicio
   */
  static async create(data: any) {
    await Promise.all([
      assertCatalogoActivo("lugares", data.id_lugar),
      assertCatalogoActivo("actividades", data.id_actividad),
      assertCatalogoActivo("dificultades", data.id_dificultad),
    ]);

    const itinerariosPayload = normalizeItinerariosPayload(data.itinerarios);

    const servicio = await prisma.servicios.create({
      data: {
        nombre: data.nombre,
        slug: data.slug?.trim() || defaultSlugForNombre(data.nombre),
        id_lugar: data.id_lugar,
        id_actividad: data.id_actividad,
        id_dificultad: data.id_dificultad,
        duracion_dias: data.duracion_dias,
        duracion_noches: data.duracion_noches,
        altura_maxima: data.altura_maxima,
        desnivel: data.desnivel || null,
        descripcion_completa: data.descripcion_completa || null,
        desc_resumen: data.desc_resumen || null,
        descripcion_recorrido:
          data.itinerarios !== undefined ? null : data.descripcion_recorrido || null,
        sobre_lugar: data.sobre_lugar || null,
        clima_recomendado: data.clima_recomendado || null,
        temperatura_dia_min: data.temperatura_dia_min || null,
        temperatura_dia_max: data.temperatura_dia_max || null,
        temperatura_noche_min: data.temperatura_noche_min || null,
        temporada_recomendada: data.temporada_recomendada || [],
        experiencia_requerida: normalizeExperienciaRequerida(data.experiencia_requerida),
        horas_caminata_diarias: data.horas_caminata_diarias || null,
        peso_mochila: data.peso_mochila || null,
        conocimientos_tecnicos_requeridos: data.conocimientos_tecnicos_requeridos || false,
        punto_encuentro: data.punto_encuentro || null,
        comodidades: data.comodidades || null,
        briefing_info: data.briefing_info || null,
        consideraciones_especiales: data.consideraciones_especiales || [],
        modalidad: data.modalidad || null,
        cupos_maximos: data.cupos_maximos || null,
        ratio_guia_pasajero: data.ratio_guia_pasajero || null,
        alimentacion_detalle: data.alimentacion_detalle || null,
        servicios_incluidos: data.servicios_incluidos || [],
        servicios_no_incluidos: data.servicios_no_incluidos || [],
        servicios_adicionales_disponibles: data.servicios_adicionales_disponibles || [],
        diferenciadores: data.diferenciadores || [],
        gestion_cargas: data.gestion_cargas || [],
        destacado: data.destacado || false,
        activo: data.activo !== undefined ? data.activo : true,
        url_foto: data.url_foto || null,
        urls_fotos: data.urls_fotos || [],
      },
      include: {
        lugares: true,
        actividades: true,
        dificultades: true,
      },
    });

    if (data.itinerarios !== undefined) {
      await syncItinerariosForServicio(
        servicio.id_servicio,
        itinerariosPayload,
        data.duracion_dias,
      );
    }

    const servicioConItinerarios = await prisma.servicios.findUnique({
      where: { id_servicio: servicio.id_servicio },
      include: {
        lugares: true,
        actividades: true,
        dificultades: true,
        itinerarios: { orderBy: { dia: "asc" } },
      },
    });

    return {
      success: true,
      data: servicioConItinerarios ?? servicio,
    } as ApiSuccessResponse<typeof servicio>;
  }

  /**
   * Actualizar servicio
   */
  static async update(id: number, data: any) {
    const existing = await prisma.servicios.findUnique({
      where: { id_servicio: id },
      select: { activo: true },
    });

    if (!existing) {
      throw new Error("Servicio no encontrado");
    }

    const itinerariosPayload = normalizeItinerariosPayload(data.itinerarios);

    const servicio = await prisma.servicios.update({
      where: { id_servicio: id },
      data: {
        nombre: data.nombre,
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        id_lugar: data.id_lugar,
        id_actividad: data.id_actividad,
        id_dificultad: data.id_dificultad,
        duracion_dias: data.duracion_dias,
        duracion_noches: data.duracion_noches,
        altura_maxima: data.altura_maxima,
        desnivel: data.desnivel !== undefined ? data.desnivel : null,
        descripcion_completa:
          data.descripcion_completa !== undefined ? data.descripcion_completa : null,
        desc_resumen: data.desc_resumen !== undefined ? data.desc_resumen : null,
        ...(data.itinerarios !== undefined
          ? { descripcion_recorrido: null }
          : data.descripcion_recorrido !== undefined
            ? { descripcion_recorrido: data.descripcion_recorrido }
            : {}),
        sobre_lugar: data.sobre_lugar !== undefined ? data.sobre_lugar : null,
        clima_recomendado: data.clima_recomendado !== undefined ? data.clima_recomendado : null,
        temperatura_dia_min: data.temperatura_dia_min !== undefined ? data.temperatura_dia_min : null,
        temperatura_dia_max: data.temperatura_dia_max !== undefined ? data.temperatura_dia_max : null,
        temperatura_noche_min: data.temperatura_noche_min !== undefined ? data.temperatura_noche_min : null,
        temporada_recomendada: data.temporada_recomendada || [],
        experiencia_requerida:
          data.experiencia_requerida !== undefined
            ? normalizeExperienciaRequerida(data.experiencia_requerida)
            : null,
        horas_caminata_diarias: data.horas_caminata_diarias !== undefined ? data.horas_caminata_diarias : null,
        peso_mochila: data.peso_mochila !== undefined ? data.peso_mochila : null,
        conocimientos_tecnicos_requeridos:
          data.conocimientos_tecnicos_requeridos !== undefined ? data.conocimientos_tecnicos_requeridos : false,
        punto_encuentro: data.punto_encuentro !== undefined ? data.punto_encuentro : null,
        comodidades: data.comodidades !== undefined ? data.comodidades : null,
        briefing_info: data.briefing_info !== undefined ? data.briefing_info : null,
        consideraciones_especiales: data.consideraciones_especiales || [],
        modalidad: data.modalidad !== undefined ? data.modalidad : null,
        cupos_maximos: data.cupos_maximos !== undefined ? data.cupos_maximos : null,
        ratio_guia_pasajero: data.ratio_guia_pasajero !== undefined ? data.ratio_guia_pasajero : null,
        alimentacion_detalle: data.alimentacion_detalle !== undefined ? data.alimentacion_detalle : null,
        servicios_incluidos: data.servicios_incluidos || [],
        servicios_no_incluidos: data.servicios_no_incluidos || [],
        servicios_adicionales_disponibles: data.servicios_adicionales_disponibles || [],
        diferenciadores: data.diferenciadores || [],
        gestion_cargas: data.gestion_cargas || [],
        destacado: data.destacado !== undefined ? data.destacado : false,
        activo: data.activo !== undefined ? data.activo : existing.activo,
        url_foto: data.url_foto !== undefined ? data.url_foto : null,
        urls_fotos: data.urls_fotos || [],
      },
      include: {
        lugares: true,
        actividades: true,
        dificultades: true,
      },
    });

    if (data.itinerarios !== undefined) {
      await syncItinerariosForServicio(
        id,
        itinerariosPayload,
        data.duracion_dias,
      );
    }

    const servicioConItinerarios = await prisma.servicios.findUnique({
      where: { id_servicio: id },
      include: {
        lugares: true,
        actividades: true,
        dificultades: true,
        itinerarios: { orderBy: { dia: "asc" } },
      },
    });

    return {
      success: true,
      data: servicioConItinerarios ?? servicio,
    } as ApiSuccessResponse<typeof servicio>;
  }

  /**
   * Actualizar solo el itinerario (recorrido) de un servicio existente.
   */
  static async updateItinerarios(
    id: number,
    data: { itinerarios?: unknown; duracion_dias?: number },
  ) {
    const existing = await prisma.servicios.findUnique({
      where: { id_servicio: id },
      select: { duracion_dias: true },
    });

    if (!existing) {
      throw new AppError("Servicio no encontrado", 404);
    }

    const duracionDias = data.duracion_dias ?? existing.duracion_dias;
    const itinerariosPayload = normalizeItinerariosPayload(data.itinerarios);

    await prisma.servicios.update({
      where: { id_servicio: id },
      data: {
        descripcion_recorrido: null,
        ...(data.duracion_dias !== undefined ? { duracion_dias: data.duracion_dias } : {}),
      },
    });

    await syncItinerariosForServicio(id, itinerariosPayload, duracionDias);

    const servicio = await prisma.servicios.findUnique({
      where: { id_servicio: id },
      include: {
        lugares: true,
        actividades: true,
        dificultades: true,
        itinerarios: { orderBy: { dia: "asc" } },
      },
    });

    return {
      success: true,
      data: servicio,
    } as ApiSuccessResponse<typeof servicio>;
  }

  /**
   * Eliminar servicio
   */
  static async delete(id: number) {
    const servicio = await prisma.servicios.findUnique({
      where: { id_servicio: id },
    });

    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }

    const expediciones = await prisma.expediciones.findMany({
      where: { id_servicio: id },
    });

    if (expediciones.length > 0) {
      throw new AppError("No se puede eliminar el servicio porque tiene expediciones asociadas", 409);
    }

    await prisma.servicios.delete({
      where: { id_servicio: id },
    });

    return {
      success: true,
      data: { id },
    } as ApiSuccessResponse<{ id: number }>;
  }

  /**
   * Toggle activo
   */
  static async toggleActivo(id: number) {
    const servicio = await prisma.servicios.findUnique({
      where: { id_servicio: id },
      select: { activo: true },
    });

    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }

    const nuevoActivo = !servicio.activo;

    const updated = await prisma.servicios.update({
      where: { id_servicio: id },
      data: { activo: nuevoActivo },
    });

    if (!nuevoActivo) {
      await purgeNotificacionesServicio(id);
    }

    return {
      success: true,
      data: updated,
    } as ApiSuccessResponse<typeof updated>;
  }

  /**
   * Toggle destacado
   */
  static async toggleDestacado(id: number) {
    const servicio = await prisma.servicios.findUnique({
      where: { id_servicio: id },
      select: { destacado: true },
    });

    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }

    const updated = await prisma.servicios.update({
      where: { id_servicio: id },
      data: { destacado: !servicio.destacado },
    });

    return {
      success: true,
      data: updated,
    } as ApiSuccessResponse<typeof updated>;
  }
}
