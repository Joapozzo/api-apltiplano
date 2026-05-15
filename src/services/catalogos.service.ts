import { prisma } from "../database/prisma.js";
import type { ApiSuccessResponse } from "../types/api.types.js";
import type { CreateActividadBody, CreateLugarBody } from "../types/catalogos.dto.js";

export class CatalogosService {
  /**
   * Garantiza una fila en ubicaciones para altas rápidas de lugares (solo nombre/desc en UI).
   */
  private static async ensureDefaultUbicacionId(): Promise<number> {
    const existing = await prisma.ubicaciones.findFirst({
      orderBy: { id_ubicacion: "asc" },
    });
    if (existing) return existing.id_ubicacion;
    const created = await prisma.ubicaciones.create({
      data: {
        pais: "Argentina",
        provincia: "Sin especificar",
        zona: "General",
      },
    });
    return created.id_ubicacion;
  }

  /**
   * Obtener todos los lugares
   */
  static async getLugares() {
    const lugares = await prisma.lugares.findMany({
      select: {
        id_lugar: true,
        nombre: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      success: true,
      data: lugares,
    } as ApiSuccessResponse<typeof lugares>;
  }

  /**
   * Obtener todas las actividades
   */
  static async getActividades() {
    const actividades = await prisma.actividades.findMany({
      select: {
        id_actividad: true,
        nombre: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      success: true,
      data: actividades,
    } as ApiSuccessResponse<typeof actividades>;
  }

  /**
   * Obtener todas las dificultades
   */
  static async getDificultades() {
    const dificultades = await prisma.dificultades.findMany({
      select: {
        id_dificultad: true,
        nivel: true,
      },
      orderBy: {
        id_dificultad: "asc",
      },
    });

    return {
      success: true,
      data: dificultades,
    } as ApiSuccessResponse<typeof dificultades>;
  }

  static async createLugar(input: CreateLugarBody) {
    const nombre = input.nombre?.trim() ?? "";
    if (!nombre) {
      throw new Error("El nombre del lugar es obligatorio");
    }
    const descripcion = input.descripcion?.trim() || null;
    const id_ubicacion = await this.ensureDefaultUbicacionId();

    const lugar = await prisma.lugares.create({
      data: {
        nombre,
        descripcion,
        tipo_lugar: "sin_clasificar",
        altitud: 0,
        id_ubicacion,
      },
      select: {
        id_lugar: true,
        nombre: true,
        descripcion: true,
      },
    });

    return {
      success: true,
      data: lugar,
    } as ApiSuccessResponse<typeof lugar>;
  }

  static async createActividad(input: CreateActividadBody) {
    const nombre = input.nombre?.trim() ?? "";
    if (!nombre) {
      throw new Error("El nombre de la actividad es obligatorio");
    }
    const descripcion = input.descripcion?.trim() || null;

    const actividad = await prisma.actividades.create({
      data: {
        nombre,
        descripcion,
      },
      select: {
        id_actividad: true,
        nombre: true,
        descripcion: true,
      },
    });

    return {
      success: true,
      data: actividad,
    } as ApiSuccessResponse<typeof actividad>;
  }
}

