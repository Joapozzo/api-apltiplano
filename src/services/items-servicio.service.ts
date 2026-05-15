import { prisma } from "../database/prisma.js";
import type { ApiSuccessResponse, ApiPaginatedResponse } from "../types/api.types.js";

export interface ItemServicioFilters {
  categoria?: string;
  activo?: boolean;
  es_adicional?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class ItemsServicioService {
  /**
   * Obtener todos los items de servicio con filtros opcionales
   */
  static async getAll(filters: ItemServicioFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.activo !== undefined) {
      where.activo = filters.activo;
    }

    if (filters.es_adicional !== undefined) {
      where.es_adicional = filters.es_adicional;
    }

    if (filters.categoria) {
      where.categoria = filters.categoria;
    }

    if (filters.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: "insensitive" } },
        { descripcion: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.items_servicio.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          nombre: "asc",
        },
      }),
      prisma.items_servicio.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data: items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    } as ApiPaginatedResponse<typeof items[0]>;
  }

  /**
   * Obtener item por ID
   */
  static async getById(id: number) {
    const item = await prisma.items_servicio.findUnique({
      where: { id_item_servicio: id },
    });

    if (!item) {
      throw new Error("Item de servicio no encontrado");
    }

    return {
      success: true,
      data: item,
    } as ApiSuccessResponse<typeof item>;
  }

  /**
   * Obtener sugerencias para autocompletado
   */
  static async getSuggestions(search?: string) {
    const where: any = {
      activo: true,
    };

    if (search) {
      where.nombre = { contains: search, mode: "insensitive" };
    }

    const items = await prisma.items_servicio.findMany({
      where,
      select: {
        nombre: true,
      },
      take: 10,
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      success: true,
      data: items.map((item) => item.nombre),
    } as ApiSuccessResponse<string[]>;
  }

  /**
   * Crear nuevo item
   */
  static async create(data: any) {
    const item = await prisma.items_servicio.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        categoria: data.categoria,
        es_adicional: data.es_adicional !== undefined ? data.es_adicional : false,
        activo: data.activo !== undefined ? data.activo : true,
      },
    });

    return {
      success: true,
      data: item,
    } as ApiSuccessResponse<typeof item>;
  }

  /**
   * Actualizar item
   */
  static async update(id: number, data: any) {
    const item = await prisma.items_servicio.update({
      where: { id_item_servicio: id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion !== undefined ? data.descripcion : null,
        categoria: data.categoria,
        es_adicional: data.es_adicional !== undefined ? data.es_adicional : false,
        activo: data.activo !== undefined ? data.activo : true,
      },
    });

    return {
      success: true,
      data: item,
    } as ApiSuccessResponse<typeof item>;
  }

  /**
   * Eliminar item
   */
  static async delete(id: number) {
    // Verificar si el item está siendo usado
    const itemUsado = await prisma.servicio_items.findFirst({
      where: { id_item_servicio: id },
    });

    if (itemUsado) {
      throw new Error("No se puede eliminar el item porque está siendo usado en servicios");
    }

    await prisma.items_servicio.delete({
      where: { id_item_servicio: id },
    });

    return {
      success: true,
      data: { id },
    } as ApiSuccessResponse<{ id: number }>;
  }
}

