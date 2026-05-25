import { prisma } from "../database/prisma.js";
import { storageAdapter } from "../uploads/adapters/index.js";
import type { ApiSuccessResponse } from "../types/api.types.js";

export interface CreateCoordinadorData {
  nombre: string;
  apellido: string;
  dni: string;
  certificaciones?: string[];
  especialidades?: string[];
}

export interface UpdateCoordinadorData {
  nombre?: string;
  apellido?: string;
  dni?: string;
  certificaciones?: string[];
  especialidades?: string[];
  activo?: boolean;
}

export interface AsignarAExpedicionData {
  id_expedicion: number;
  rol: string;
}

const selectCoordinador = {
  id_coordinador: true,
  nombre: true,
  apellido: true,
  dni: true,
  certificaciones: true,
  especialidades: true,
  activo: true,
  url_foto: true,
  foto_public_id: true,
};

const selectCoordinadorWithExpediciones = {
  ...selectCoordinador,
  expedicion_coordinadores: {
    orderBy: { expediciones: { fecha_salida: "desc" as const } },
    select: {
      id: true,
      rol: true,
      expediciones: {
        select: {
          id_expedicion: true,
          fecha_salida: true,
          fecha_fin: true,
          estado: true,
          servicios: {
            select: {
              nombre: true,
              slug: true,
            },
          },
        },
      },
    },
  },
};

export class CoordinadoresService {
  static async list(filters?: { activo?: boolean; search?: string }) {
    const where: Record<string, unknown> = {};

    if (filters?.activo !== undefined) {
      where.activo = filters.activo;
    }

    if (filters?.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: "insensitive" } },
        { apellido: { contains: filters.search, mode: "insensitive" } },
        { dni: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const coordinadores = await prisma.coordinadores.findMany({
      where,
      select: {
        ...selectCoordinador,
        _count: {
          select: { expedicion_coordinadores: true },
        },
      },
      orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
    });

    return {
      success: true,
      data: coordinadores.map((c) => ({
        ...c,
        total_expediciones: c._count.expedicion_coordinadores,
      })),
    };
  }

  static async getById(id: number) {
    const coordinador = await prisma.coordinadores.findUnique({
      where: { id_coordinador: id },
      select: selectCoordinadorWithExpediciones,
    });

    if (!coordinador) {
      throw new Error("Coordinador no encontrado");
    }

    const historial = coordinador.expedicion_coordinadores
      .filter((ec) => ec.expediciones && ec.expediciones.fecha_salida)
      .map((ec) => ({
        id_expedicion: ec.expediciones!.id_expedicion,
        servicio: ec.expediciones!.servicios!.nombre,
        slug: ec.expediciones!.servicios!.slug,
        fecha_salida: ec.expediciones!.fecha_salida,
        fecha_fin: ec.expediciones!.fecha_fin,
        estado: ec.expediciones!.estado,
        rol: ec.rol,
      }));

    return {
      success: true,
      data: {
        id_coordinador: coordinador.id_coordinador,
        nombre: coordinador.nombre,
        apellido: coordinador.apellido,
        dni: coordinador.dni,
        certificaciones: coordinador.certificaciones,
        especialidades: coordinador.especialidades,
        activo: coordinador.activo,
        url_foto: coordinador.url_foto,
        historial,
        total_expediciones: historial.length,
      },
    };
  }

  static async create(data: CreateCoordinadorData) {
    const exists = await prisma.coordinadores.findUnique({
      where: { dni: data.dni },
    });

    if (exists) {
      throw new Error("Ya existe un coordinador con ese DNI");
    }

    const coordinador = await prisma.coordinadores.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        certificaciones: data.certificaciones || [],
        especialidades: data.especialidades || [],
        activo: true,
      },
      select: selectCoordinador,
    });

    return {
      success: true,
      data: coordinador,
    };
  }

  static async update(id: number, data: UpdateCoordinadorData) {
    const exists = await prisma.coordinadores.findUnique({
      where: { id_coordinador: id },
    });

    if (!exists) {
      throw new Error("Coordinador no encontrado");
    }

    if (data.dni && data.dni !== exists.dni) {
      const dniExists = await prisma.coordinadores.findUnique({
        where: { dni: data.dni },
      });
      if (dniExists) {
        throw new Error("Ya existe otro coordinador con ese DNI");
      }
    }

    const coordinador = await prisma.coordinadores.update({
      where: { id_coordinador: id },
      data: {
        ...(data.nombre && { nombre: data.nombre }),
        ...(data.apellido && { apellido: data.apellido }),
        ...(data.dni && { dni: data.dni }),
        ...(data.certificaciones && { certificaciones: data.certificaciones }),
        ...(data.especialidades && { especialidades: data.especialidades }),
        ...(data.activo !== undefined && { activo: data.activo }),
      },
      select: selectCoordinador,
    });

    return {
      success: true,
      data: coordinador,
    };
  }

  static async delete(id: number) {
    const exists = await prisma.coordinadores.findUnique({
      where: { id_coordinador: id },
      select: { id_coordinador: true, foto_public_id: true },
    });

    if (!exists) {
      throw new Error("Coordinador no encontrado");
    }

    if (exists.foto_public_id) {
      try {
        await storageAdapter.delete(exists.foto_public_id);
      } catch {
        // Si falla Cloudinary, igual desactivamos el guía
      }
    }

    await prisma.coordinadores.update({
      where: { id_coordinador: id },
      data: { activo: false, url_foto: null, foto_public_id: null },
    });

    return {
      success: true,
      data: { message: "Coordinador eliminado" },
    };
  }

  static async asignarAExpedicion(id_coordinador: number, data: AsignarAExpedicionData) {
    const coordinador = await prisma.coordinadores.findUnique({
      where: { id_coordinador },
    });

    if (!coordinador) {
      throw new Error("Coordinador no encontrado");
    }

    const expedicion = await prisma.expediciones.findUnique({
      where: { id_expedicion: data.id_expedicion },
    });

    if (!expedicion) {
      throw new Error("Expedición no encontrada");
    }

    const existing = await prisma.expedicion_coordinadores.findFirst({
      where: {
        id_coordinador,
        id_expedicion: data.id_expedicion,
      },
    });

    if (existing) {
      throw new Error("El coordinador ya está asignado a esta expedición");
    }

    await prisma.expedicion_coordinadores.create({
      data: {
        id_coordinador,
        id_expedicion: data.id_expedicion,
        rol: data.rol,
      },
    });

    return {
      success: true,
      data: { message: "Coordinador asignado a la expedición" },
    };
  }

  static async desasignarDeExpedicion(id_coordinador: number, id_expedicion: number) {
    const existing = await prisma.expedicion_coordinadores.findFirst({
      where: {
        id_coordinador,
        id_expedicion,
      },
    });

    if (!existing) {
      throw new Error("El coordinador no está asignado a esta expedición");
    }

    await prisma.expedicion_coordinadores.delete({
      where: { id: existing.id },
    });

    return {
      success: true,
      data: { message: "Coordinador desasignado de la expedición" },
    };
  }

  static async getHistorial(id: number) {
    const coordinador = await prisma.coordinadores.findUnique({
      where: { id_coordinador: id },
      select: {
        id_coordinador: true,
        nombre: true,
        apellido: true,
        expedicion_coordinadores: {
          select: {
            rol: true,
            expediciones: {
              select: {
                id_expedicion: true,
                fecha_salida: true,
                fecha_fin: true,
                estado: true,
                servicios: {
                  select: {
                    nombre: true,
                    slug: true,
                  },
                },
              },
            },
          },
          orderBy: { expediciones: { fecha_salida: "desc" as const } },
        },
      },
    });

    if (!coordinador) {
      throw new Error("Coordinador no encontrado");
    }

    const expediciones = coordinador.expedicion_coordinadores
      .filter((ec) => ec.expediciones?.fecha_salida)
      .map((ec) => ({
        id_expedicion: ec.expediciones!.id_expedicion,
        servicio: ec.expediciones!.servicios!.nombre,
        slug: ec.expediciones!.servicios!.slug,
        fecha_salida: ec.expediciones!.fecha_salida,
        fecha_fin: ec.expediciones!.fecha_fin,
        estado: ec.expediciones!.estado,
        rol: ec.rol,
      }));

    return {
      success: true,
      data: {
        nombre: coordinador.nombre,
        apellido: coordinador.apellido,
        total_expediciones: expediciones.length,
        expediciones,
      },
    };
  }
}
