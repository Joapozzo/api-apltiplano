import { prisma } from "../database/prisma.js";
import type { ApiSuccessResponse, ApiPaginatedResponse } from "../types/api.types.js";
import { AppError } from "../utils/app-error.js";
import { getExpedicionEstadoInicial, getPresupuestoDiasValidez } from "../utils/config-runtime.js";
import { emitSalidaEstadoCompleta } from "./notificaciones/notificaciones-emit.service.js";
import { syncAlertasOperativas } from "./notificaciones/notificaciones-sync.service.js";
import { decryptInscripcionRecord } from "../utils/data-protection.js";
import { removeInscripcionRecord } from "../utils/inscripcion-cleanup.js";
import { INSCRIPCION_ESTADOS } from "../utils/inscripcion-estado.js";

export interface ExpedicionFilters {
  estado?: string;
  servicio?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
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

export class ExpedicionesService {
  /**
   * Validar si una expedición tiene cupos disponibles
   */
  static async validateCuposDisponibles(id_expedicion: number) {
    const expedicion = await prisma.expediciones.findUnique({
      where: { id_expedicion },
      select: {
        id_expedicion: true,
        cupos_disponibles: true,
        cupos_ocupados: true,
        estado: true,
        servicios: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!expedicion) {
      return {
        valid: false,
        message: "Expedición no encontrada",
      };
    }

    if (expedicion.estado !== "Activa" && expedicion.estado !== "A") {
      return {
        valid: false,
        message: `La expedición "${expedicion.servicios.nombre}" no está activa`,
      };
    }

    const cuposLibres = expedicion.cupos_disponibles - expedicion.cupos_ocupados;

    if (cuposLibres <= 0) {
      return {
        valid: false,
        message: `La expedición "${expedicion.servicios.nombre}" no tiene cupos disponibles. Todos los cupos están ocupados.`,
        cuposLibres: 0,
      };
    }

    return {
      valid: true,
      message: `La expedición "${expedicion.servicios.nombre}" tiene ${cuposLibres} cupo${cuposLibres !== 1 ? "s" : ""} disponible${cuposLibres !== 1 ? "s" : ""}`,
      cuposLibres,
      expedicion,
    };
  }

  /**
   * Obtener todas las expediciones con filtros opcionales
   */
  static async getAll(filters: ExpedicionFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.estado) {
      where.estado = filters.estado;
    }

    if (filters.servicio) {
      where.id_servicio = filters.servicio;
    }

    if (filters.fecha_desde || filters.fecha_hasta) {
      where.fecha_salida = {};
      if (filters.fecha_desde) {
        where.fecha_salida.gte = new Date(filters.fecha_desde);
      }
      if (filters.fecha_hasta) {
        where.fecha_salida.lte = new Date(filters.fecha_hasta);
      }
    }

    if (filters.search) {
      const searchNum = parseInt(filters.search, 10);
      where.OR = [];
      if (!isNaN(searchNum)) {
        where.OR.push({ id_expedicion: searchNum });
      }
      where.OR.push({
        servicios: {
          nombre: { contains: filters.search, mode: "insensitive" },
        },
      });
    }

    const [expediciones, total] = await Promise.all([
      prisma.expediciones.findMany({
        where,
        skip,
        take: limit,
        include: {
          servicios: {
            include: {
              lugares: {
                include: {
                  ubicaciones: true,
                },
              },
              actividades: true,
              dificultades: true,
            },
          },
          expedicion_precios: true,
        },
        orderBy: {
          fecha_salida: "desc",
        },
      }),
      prisma.expediciones.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data: expediciones,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    } as ApiPaginatedResponse<(typeof expediciones)[0]>;
  }

  /**
   * Obtener expedición por ID
   */
  static async getById(id: number) {
    const expedicion = await prisma.expediciones.findUnique({
      where: { id_expedicion: id },
      include: {
        servicios: {
          include: {
            lugares: {
              include: {
                ubicaciones: true,
              },
            },
            actividades: true,
            dificultades: true,
          },
        },
        expedicion_precios: true,
        inscripciones: {
          include: {
            clientes: {
              select: {
                id_cliente: true,
                nombre: true,
                apellido: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!expedicion) {
      throw new Error("Expedición no encontrada");
    }

    const data = {
      ...expedicion,
      inscripciones: expedicion.inscripciones.map((ins) => decryptInscripcionRecord(ins)),
    };

    return {
      success: true,
      data,
    } as ApiSuccessResponse<typeof data>;
  }

  /**
   * Obtener expediciones activas (para selects)
   */
  static async getActive() {
    const expediciones = await prisma.expediciones.findMany({
      where: {
        OR: [{ estado: "A" }, { estado: "Activa" }],
      },
      include: {
        servicios: {
          select: {
            id_servicio: true,
            nombre: true,
          },
        },
        expedicion_precios: true,
      },
      orderBy: {
        fecha_salida: "asc",
      },
    });

    return {
      success: true,
      data: expediciones,
    } as ApiSuccessResponse<typeof expediciones>;
  }

  /**
   * Crear nueva expedición
   */
  static async create(data: ExpedicionCreateInput) {
    // Validar que el servicio existe
    const servicio = await prisma.servicios.findUnique({
      where: { id_servicio: data.id_servicio },
    });

    if (!servicio) {
      throw new Error("El servicio seleccionado no existe");
    }

    // Validar fechas
    const fechaSalida = new Date(data.fecha_salida);
    const fechaFin = new Date(data.fecha_fin);

    if (fechaSalida > fechaFin) {
      throw new Error("La fecha de fin debe ser posterior a la fecha de salida");
    }

    // Validar precios
    if (!data.precios || data.precios.length === 0) {
      throw new Error("Debe agregar al menos un precio");
    }

    const [estadoInicial, diasValidez] = await Promise.all([getExpedicionEstadoInicial(), getPresupuestoDiasValidez()]);

    let presupuestoHasta: Date | null;
    if (data.presupuesto_valido_hasta) {
      presupuestoHasta = new Date(data.presupuesto_valido_hasta);
    } else {
      const validezDate = new Date(fechaSalida);
      validezDate.setDate(validezDate.getDate() + diasValidez);
      presupuestoHasta = validezDate;
    }

    // Crear expedición con precios
    const expedicion = await prisma.expediciones.create({
      data: {
        id_servicio: data.id_servicio,
        fecha_salida: fechaSalida,
        fecha_fin: fechaFin,
        cupos_disponibles: data.cupos_disponibles,
        cupos_ocupados: 0,
        estado: data.estado || estadoInicial,
        presupuesto_valido_hasta: presupuestoHasta,
        expedicion_precios: {
          create: data.precios.map((p) => ({
            nombre_paquete: p.nombre_paquete,
            precio: p.precio,
            moneda: p.moneda,
          })),
        },
      },
      include: {
        servicios: {
          select: {
            nombre: true,
          },
        },
        expedicion_precios: true,
      },
    });

    return {
      success: true,
      data: expedicion,
      message: "Expedición creada exitosamente",
    } as ApiSuccessResponse<typeof expedicion>;
  }

  /**
   * Actualizar expedición existente
   */
  static async update(id: number, data: ExpedicionCreateInput) {
    // Verificar que existe
    const existente = await prisma.expediciones.findUnique({
      where: { id_expedicion: id },
      include: { inscripciones: true },
    });

    if (!existente) {
      throw new Error("Expedición no encontrada");
    }

    // Validar que no se reducen cupos por debajo de los ocupados
    if (data.cupos_disponibles < existente.cupos_ocupados) {
      throw new Error(
        `No se pueden reducir los cupos a ${data.cupos_disponibles}. Ya hay ${existente.cupos_ocupados} inscripciones confirmadas.`,
      );
    }

    // Validar fechas
    const fechaSalida = new Date(data.fecha_salida);
    const fechaFin = new Date(data.fecha_fin);

    if (fechaSalida > fechaFin) {
      throw new Error("La fecha de fin debe ser posterior a la fecha de salida");
    }

    // Actualizar expedición usando transacción
    const expedicion = await prisma.$transaction(async (tx) => {
      // Eliminar precios existentes
      await tx.expedicion_precios.deleteMany({
        where: { id_expedicion: id },
      });

      // Actualizar expedición y crear nuevos precios
      return tx.expediciones.update({
        where: { id_expedicion: id },
        data: {
          id_servicio: data.id_servicio,
          fecha_salida: fechaSalida,
          fecha_fin: fechaFin,
          cupos_disponibles: data.cupos_disponibles,
          estado: data.estado,
          presupuesto_valido_hasta: data.presupuesto_valido_hasta ? new Date(data.presupuesto_valido_hasta) : null,
          expedicion_precios: {
            create: data.precios.map((p) => ({
              nombre_paquete: p.nombre_paquete,
              precio: p.precio,
              moneda: p.moneda,
            })),
          },
        },
        include: {
          servicios: {
            select: {
              nombre: true,
            },
          },
          expedicion_precios: true,
        },
      });
    });

    return {
      success: true,
      data: expedicion,
      message: "Expedición actualizada exitosamente",
    } as ApiSuccessResponse<typeof expedicion>;
  }

  /**
   * Eliminar expedición
   */
  static async delete(id: number) {
    // Verificar que existe
    const existente = await prisma.expediciones.findUnique({
      where: { id_expedicion: id },
      include: {
        inscripciones: true,
        servicios: { select: { nombre: true } },
      },
    });

    if (!existente) {
      throw new Error("Expedición no encontrada");
    }

    // Verificar si tiene inscripciones activas
    const inscripcionesActivas = existente.inscripciones.filter((i) => i.estado !== "Cancelado");

    if (inscripcionesActivas.length > 0) {
      throw new AppError(
        `No se puede eliminar la expedición "${existente.servicios.nombre}". Tiene ${inscripcionesActivas.length} inscripción(es) activa(s).`,
        409,
      );
    }

    await prisma.$transaction(async (tx) => {
      for (const inscripcion of existente.inscripciones) {
        await removeInscripcionRecord(tx, inscripcion.id_inscripcion);
      }

      await tx.inscripcion_tokens.deleteMany({ where: { id_expedicion: id } });
      await tx.expedicion_coordinadores.deleteMany({ where: { id_expedicion: id } });
      await tx.expediciones.delete({ where: { id_expedicion: id } });
    });

    return {
      success: true,
      message: "Expedición eliminada exitosamente",
    };
  }

  /**
   * Cambiar estado de expedición
   */
  static async changeEstado(id: number, estado: string) {
    // Validar estado
    const estadosValidos = ["Activa", "Completa", "Finalizada", "Suspendida", "Cancelada"];
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(", ")}`);
    }

    // Verificar que existe
    const existente = await prisma.expediciones.findUnique({
      where: { id_expedicion: id },
    });

    if (!existente) {
      throw new Error("Expedición no encontrada");
    }

    // Actualizar estado
    const expedicion = await prisma.expediciones.update({
      where: { id_expedicion: id },
      data: { estado },
      include: {
        servicios: {
          select: { nombre: true },
        },
      },
    });

    return {
      success: true,
      data: expedicion,
      message: `Estado cambiado a ${estado}`,
    } as ApiSuccessResponse<typeof expedicion>;
  }

  /**
   * Recalcular cupos ocupados basado en inscripciones confirmadas
   */
  static async recalcularCupos(id_expedicion: number) {
    const inscripcionesConfirmadas = await prisma.inscripciones.count({
      where: {
        id_expedicion,
        estado: {
          in: [INSCRIPCION_ESTADOS.CONFIRMADO, INSCRIPCION_ESTADOS.INSCRIPTO, INSCRIPCION_ESTADOS.PENDIENTE],
        },
      },
    });

    const expedicion = await prisma.expediciones.update({
      where: { id_expedicion },
      data: {
        cupos_ocupados: inscripcionesConfirmadas,
      },
    });

    // Si se llenaron los cupos, cambiar estado a Completa
    if (expedicion.cupos_ocupados >= expedicion.cupos_disponibles && expedicion.estado === "Activa") {
      await prisma.expediciones.update({
        where: { id_expedicion },
        data: { estado: "Completa" },
      });
      const expedicionCompleta = await prisma.expediciones.findUnique({
        where: { id_expedicion },
        include: { servicios: true },
      });
      if (expedicionCompleta) {
        await emitSalidaEstadoCompleta({
          id_expedicion,
          nombre_servicio: expedicionCompleta.servicios.nombre,
          fecha_salida: expedicionCompleta.fecha_salida,
        });
      }
    }

    await syncAlertasOperativas(false);
    return expedicion;
  }
}
