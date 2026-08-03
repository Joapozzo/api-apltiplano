import { prisma } from "../database/prisma.js";
import { JWTService } from "./jwt.service.js";
import { getPublicFrontendUrl } from "../utils/frontend-url.js";
import { getInscripcionEstadoInicial, getInscripcionTokenDias } from "../utils/config-runtime.js";
import { emitInscripcionNueva } from "./notificaciones/notificaciones-emit.service.js";
import { syncAlertasOperativas } from "./notificaciones/notificaciones-sync.service.js";
import { EmailService } from "./email.service.js";
import crypto from "crypto";
import type { Prisma } from "@prisma/client";
import { APP_ROLES } from "../types/auth.types.js";
import { syncClienteFromUsuario } from "./usuarios.shared.js";
import { decryptClientePii, decryptInscripcionRecord } from "../utils/data-protection.js";
import { INSCRIPCION_ESTADOS, normalizeInscripcionUpdate } from "../utils/inscripcion-estado.js";
import { removeInscripcionRecord } from "../utils/inscripcion-cleanup.js";
import { ExpedicionesService } from "./expediciones.service.js";

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

type ClienteResumen = {
  id_cliente: number;
  nombre: string;
  apellido: string;
  email: string;
};

async function resolveOrCreateClienteForInscripcion(
  tx: Prisma.TransactionClient,
  usuario: { nombre: string; apellido: string; email: string },
): Promise<ClienteResumen> {
  const email = usuario.email.trim().toLowerCase();
  const nombre = usuario.nombre.trim();
  const apellido = usuario.apellido.trim();

  const existingCliente = await tx.clientes.findUnique({ where: { email } });
  if (existingCliente) {
    await tx.clientes.update({
      where: { id_cliente: existingCliente.id_cliente },
      data: { nombre, apellido },
    });
    await tx.usuarios.update({
      where: { id_usuario: existingCliente.id_usuario },
      data: { nombre, apellido },
    });
    return {
      id_cliente: existingCliente.id_cliente,
      nombre,
      apellido,
      email,
    };
  }

  let usuarioRow = await tx.usuarios.findUnique({ where: { email } });
  if (!usuarioRow) {
    const userRole = await tx.roles.findUnique({ where: { codigo: APP_ROLES.USER } });
    if (!userRole) {
      throw new Error('Rol "USER" no configurado. Ejecutá: npx prisma db seed');
    }

    usuarioRow = await tx.usuarios.create({
      data: {
        firebase_uid: `pending-inscripcion-${crypto.randomUUID()}`,
        email,
        nombre,
        apellido,
        usuario_roles: {
          create: { id_rol: userRole.id_rol },
        },
      },
    });
  }

  const cliente = await syncClienteFromUsuario(
    tx,
    { id_usuario: usuarioRow.id_usuario, email, nombre, apellido },
    { ensureCliente: true, syncEmail: true },
  );

  if (!cliente) {
    throw new Error("No se pudo crear el cliente");
  }

  return {
    id_cliente: cliente.id_cliente,
    nombre,
    apellido,
    email,
  };
}

export class InscripcionesService {
  static async generateLink(id_expedicion: number, id_cliente: number | null, expiresInDays?: number) {
    const diasToken = expiresInDays ?? (await getInscripcionTokenDias());
    const expedicion = await prisma.expediciones.findFirst({
      where: { id_expedicion },
      include: {
        servicios: {
          include: { lugares: true, actividades: true, dificultades: true },
        },
      },
    });

    if (!expedicion) {
      throw new Error("Expedición no encontrada");
    }

    if (id_cliente !== null) {
      const cliente = await prisma.clientes.findUnique({ where: { id_cliente } });
      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }
    }

    const token = JWTService.generateToken(id_expedicion, id_cliente, diasToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + diasToken);

    await prisma.inscripcion_tokens.create({
      data: {
        token,
        id_expedicion,
        id_cliente,
        expires_at: expiresAt,
      },
    });

    const baseUrl = getPublicFrontendUrl();
    const url = `${baseUrl}/inscripcion/${token}`;

    return {
      success: true,
      data: {
        token,
        url,
        expires_at: expiresAt.toISOString(),
      },
    };
  }

  static async validateToken(token: string) {
    const payload = JWTService.verifyToken(token);
    if (!payload) {
      return { valid: false as const, error: "Token inválido o expirado" };
    }

    const tokenRecord = await prisma.inscripcion_tokens.findUnique({
      where: { token },
      include: {
        clientes: true,
      },
    });

    if (!tokenRecord) {
      return { valid: false as const, error: "Token no encontrado" };
    }

    if (tokenRecord.usado) {
      return { valid: false as const, error: "Token ya utilizado" };
    }

    if (tokenRecord.expires_at < new Date()) {
      return { valid: false as const, error: "Token expirado" };
    }

    if (
      tokenRecord.id_expedicion !== payload.id_expedicion ||
      (tokenRecord.id_cliente ?? null) !== (payload.id_cliente ?? null)
    ) {
      return { valid: false as const, error: "Token no coincide con el registro" };
    }

    const expedicion = await prisma.expediciones.findUnique({
      where: { id_expedicion: payload.id_expedicion },
      include: {
        servicios: {
          include: {
            lugares: { include: { ubicaciones: true } },
            actividades: true,
            dificultades: true,
          },
        },
      },
    });

    if (!expedicion) {
      return { valid: false as const, error: "Expedición no encontrada" };
    }

    const c = tokenRecord.clientes ? decryptClientePii(tokenRecord.clientes) : null;

    return {
      valid: true as const,
      expedicion,
      servicio: expedicion.servicios,
      ...(c
        ? {
            cliente: {
              id_cliente: c.id_cliente as number,
              nombre: c.nombre as string,
              apellido: c.apellido as string,
              email: c.email as string,
            },
          }
        : {}),
    };
  }

  static async submitInscripcion(data: CreateInscripcionData) {
    const validation = await this.validateToken(data.token);
    if (!validation.valid) {
      throw new Error(validation.error || "Token inválido");
    }

    const expedicion = validation.expedicion!;
    const clienteFromToken = validation.cliente ?? null;

    const fnac =
      typeof data.usuario.fecha_nacimiento === "string"
        ? new Date(data.usuario.fecha_nacimiento)
        : data.usuario.fecha_nacimiento;

    const estadoInicial = await getInscripcionEstadoInicial();

    const result = await prisma.$transaction(async (tx) => {
      const resolvedCliente = clienteFromToken
        ? {
            id_cliente: clienteFromToken.id_cliente,
            nombre: data.usuario.nombre,
            apellido: data.usuario.apellido,
            email: clienteFromToken.email,
          }
        : await resolveOrCreateClienteForInscripcion(tx, data.usuario);

      const id_cliente = resolvedCliente.id_cliente;

      if (expedicion.cupos_ocupados >= expedicion.cupos_disponibles) {
        throw new Error("No hay cupos disponibles");
      }

      const duplicada = await tx.inscripciones.findFirst({
        where: {
          id_cliente,
          id_expedicion: expedicion.id_expedicion,
          estado: { not: "Cancelado" },
        },
      });
      if (duplicada) {
        throw new Error("Este cliente ya tiene una inscripción activa en esta expedición");
      }

      const inscripcion = await tx.inscripciones.create({
        data: {
          id_cliente,
          id_expedicion: expedicion.id_expedicion,
          fecha_inscripcion: new Date(),
          estado: estadoInicial,
          reserva_pagada: false,
          saldo_pagado: false,
          dni: data.usuario.dni,
          fecha_nacimiento: fnac,
          telefono: data.usuario.telefono ?? null,
          provincia: data.usuario.provincia ?? null,
          emergencia_nombre: data.usuario.emergencia_nombre ?? null,
          emergencia_telefono: data.usuario.emergencia_telefono ?? null,
        },
      });

      if (data.datos_medicos) {
        await tx.inscripcion_datos_medicos.create({
          data: {
            id_inscripcion: inscripcion.id_inscripcion,
            cobertura_medica: data.datos_medicos.cobertura_medica ?? null,
            grupo_sanguineo: data.datos_medicos.grupo_sanguineo ?? null,
            alergias: data.datos_medicos.alergias,
            alergias_detalle: data.datos_medicos.alergias_detalle ?? null,
            diabetes: data.datos_medicos.diabetes,
            asma: data.datos_medicos.asma,
            hipertension: data.datos_medicos.hipertension,
            otros_antecedentes: data.datos_medicos.otros_antecedentes ?? null,
          },
        });
      }

      if (data.actividad_fisica) {
        await tx.inscripcion_actividad_fisica.create({
          data: {
            id_inscripcion: inscripcion.id_inscripcion,
            realiza_entrenamiento: data.actividad_fisica.realiza_entrenamiento,
            tipo_entrenamiento: data.actividad_fisica.tipo_entrenamiento ?? null,
            frecuencia_semanal: data.actividad_fisica.frecuencia_semanal ?? null,
            experiencia_trekking: data.actividad_fisica.experiencia_trekking,
            altura_cm: data.actividad_fisica.altura_cm ?? null,
            peso_kg: data.actividad_fisica.peso_kg ?? null,
          },
        });
      }

      const clienteRow = await tx.clientes.findUniqueOrThrow({ where: { id_cliente } });

      await tx.clientes.update({
        where: { id_cliente },
        data: {
          nombre: data.usuario.nombre,
          apellido: data.usuario.apellido,
        },
      });

      await tx.usuarios.update({
        where: { id_usuario: clienteRow.id_usuario },
        data: {
          nombre: data.usuario.nombre,
          apellido: data.usuario.apellido,
        },
      });

      await tx.expediciones.update({
        where: { id_expedicion: expedicion.id_expedicion },
        data: { cupos_ocupados: { increment: 1 } },
      });

      await tx.inscripcion_tokens.update({
        where: { token: data.token },
        data: {
          usado: true,
          id_inscripcion: inscripcion.id_inscripcion,
          id_cliente,
        },
      });

      return {
        success: true,
        inscripcion_id: inscripcion.id_inscripcion,
        mensaje: "Inscripción realizada exitosamente",
        expedicion,
        cliente: resolvedCliente,
      };
    });

    const emitResult = result as {
      success: boolean;
      inscripcion_id: number;
      cliente?: { nombre: string; apellido: string; email: string };
      expedicion?: { servicios: { nombre: string; slug?: string }; fecha_salida: Date; fecha_fin: Date };
    };

    if (emitResult.success) {
      await emitInscripcionNueva({
        id_inscripcion: emitResult.inscripcion_id,
        cliente: `${emitResult.cliente!.nombre} ${emitResult.cliente!.apellido}`,
        servicio: emitResult.expedicion!.servicios.nombre,
        fecha_salida: emitResult.expedicion!.fecha_salida,
      });
      await syncAlertasOperativas(false);

      const expedicionData = emitResult.expedicion!;
      await EmailService.sendInscripcionConfirmacion({
        cliente: {
          nombre: emitResult.cliente!.nombre,
          apellido: emitResult.cliente!.apellido,
          email: emitResult.cliente!.email,
        },
        servicio: {
          nombre: expedicionData.servicios.nombre,
          slug: expedicionData.servicios.slug || "",
        },
        expedicion: {
          fecha_salida: expedicionData.fecha_salida.toISOString(),
          fecha_fin: expedicionData.fecha_fin.toISOString(),
        },
        inscripcion: {
          id: emitResult.inscripcion_id,
          estado: "Inscripto",
        },
      }).catch((err) => {
        console.error("Error enviando email de confirmación:", err);
      });
    }

    return {
      success: true,
      inscripcion_id: emitResult.inscripcion_id,
      mensaje: "Inscripción realizada exitosamente",
    };
  }

  static async listInscripciones(filters: {
    estado?: string;
    expedicion?: number;
    cliente?: number;
    activas?: boolean;
    detalle?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || (filters.cliente ? 50 : 10);
    const skip = (page - 1) * limit;
    const withDetail = filters.detalle ?? Boolean(filters.cliente);

    const where: Prisma.inscripcionesWhereInput = {};

    if (filters.estado) {
      where.estado = filters.estado;
    }

    if (filters.expedicion) {
      where.id_expedicion = filters.expedicion;
    }

    if (filters.cliente) {
      where.id_cliente = filters.cliente;
    }

    if (filters.activas) {
      where.estado = { not: "Cancelado" };
      where.expediciones = { fecha_fin: { gte: new Date() } };
    }

    if (filters.search) {
      where.OR = [
        { clientes: { nombre: { contains: filters.search, mode: "insensitive" } } },
        { clientes: { apellido: { contains: filters.search, mode: "insensitive" } } },
        { clientes: { email: { contains: filters.search, mode: "insensitive" } } },
        { dni: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const include = withDetail
      ? {
          clientes: true,
          inscripcion_datos_medicos: true,
          inscripcion_actividad_fisica: true,
          expediciones: {
            include: {
              servicios: {
                include: {
                  lugares: { include: { ubicaciones: true } },
                  actividades: true,
                  dificultades: true,
                },
              },
            },
          },
          pagos: { orderBy: { fecha_pago: "desc" as const } },
        }
      : {
          clientes: true,
          expediciones: {
            include: {
              servicios: { include: { lugares: true } },
            },
          },
        };

    const [inscripciones, total] = await Promise.all([
      prisma.inscripciones.findMany({
        where,
        skip,
        take: limit,
        include,
        orderBy: { fecha_inscripcion: "desc" },
      }),
      prisma.inscripciones.count({ where }),
    ]);

    return {
      inscripciones: inscripciones.map((row) => decryptInscripcionRecord(row)),
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  static async getInscripcionById(id: number) {
    const row = await prisma.inscripciones.findUnique({
      where: { id_inscripcion: id },
      include: {
        clientes: true,
        inscripcion_datos_medicos: true,
        inscripcion_actividad_fisica: true,
        expediciones: {
          include: {
            servicios: {
              include: {
                lugares: { include: { ubicaciones: true } },
                actividades: true,
                dificultades: true,
              },
            },
          },
        },
        pagos: { orderBy: { fecha_pago: "desc" } },
      },
    });

    return row ? decryptInscripcionRecord(row) : null;
  }

  static async updateInscripcion(id: number, data: Record<string, unknown>) {
    const patch = normalizeInscripcionUpdate(data);

    const row = await prisma.inscripciones.update({
      where: { id_inscripcion: id },
      data: patch,
      include: {
        clientes: true,
        expediciones: { include: { servicios: true } },
      },
    });

    return decryptInscripcionRecord(row);
  }

  static async reembolsarInscripcion(id: number) {
    const inscripcion = await prisma.inscripciones.findUnique({
      where: { id_inscripcion: id },
      include: {
        pagos: true,
        clientes: true,
        inscripcion_datos_medicos: true,
        inscripcion_actividad_fisica: true,
        expediciones: {
          include: {
            servicios: {
              include: {
                lugares: { include: { ubicaciones: true } },
                actividades: true,
                dificultades: true,
              },
            },
          },
        },
      },
    });

    if (!inscripcion) {
      throw new Error("Inscripción no encontrada");
    }

    const id_expedicion = inscripcion.id_expedicion;
    const snapshot = decryptInscripcionRecord({
      ...inscripcion,
      estado: INSCRIPCION_ESTADOS.CANCELADO,
      reserva_pagada: false,
      saldo_pagado: false,
    });

    await prisma.$transaction(async (tx) => {
      if (inscripcion.estado !== INSCRIPCION_ESTADOS.CANCELADO) {
        for (const pago of inscripcion.pagos) {
          if (pago.estado === "Reembolsado") continue;

          await tx.pagos.update({
            where: { id_pago: pago.id_pago },
            data: { estado: "Reembolsado" },
          });
        }
      }

      await removeInscripcionRecord(tx, id);
    });

    await ExpedicionesService.recalcularCupos(id_expedicion);

    return snapshot;
  }

  static async deleteInscripcion(id: number) {
    const inscripcion = await prisma.inscripciones.findUnique({
      where: { id_inscripcion: id },
    });

    if (!inscripcion) {
      throw new Error("Inscripción no encontrada");
    }

    await prisma.$transaction(async (tx) => {
      await removeInscripcionRecord(tx, id);
    });

    await ExpedicionesService.recalcularCupos(inscripcion.id_expedicion);

    return { success: true };
  }

  static async listTokens(filters: {
    id_expedicion?: number;
    usado?: boolean;
    expirado?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters.id_expedicion) {
      where.id_expedicion = filters.id_expedicion;
    }
    if (filters.usado !== undefined) {
      where.usado = filters.usado;
    }
    if (filters.expirado === true) {
      where.expires_at = { lt: new Date() };
    } else if (filters.expirado === false) {
      where.expires_at = { gte: new Date() };
    }

    const [rows, total] = await Promise.all([
      prisma.inscripcion_tokens.findMany({
        where,
        skip,
        take: limit,
        include: {
          expediciones: {
            include: { servicios: { select: { nombre: true } } },
          },
          clientes: { select: { id_cliente: true, nombre: true, apellido: true, email: true } },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.inscripcion_tokens.count({ where }),
    ]);

    const baseUrl = getPublicFrontendUrl();
    const now = new Date();

    const data = rows.map((r) => {
      const expirado = r.expires_at < now;
      return {
        id: r.id,
        token: r.token,
        url: `${baseUrl}/inscripcion/${r.token}`,
        id_expedicion: r.id_expedicion,
        id_cliente: r.id_cliente,
        cliente: r.clientes ? decryptClientePii(r.clientes) : null,
        expedicion: {
          id_expedicion: r.expediciones.id_expedicion,
          nombre: r.expediciones.servicios.nombre,
          fecha_salida: r.expediciones.fecha_salida.toISOString(),
        },
        expires_at: r.expires_at.toISOString(),
        usado: r.usado,
        created_at: r.created_at.toISOString(),
        expirado,
        activo: !r.usado && !expirado,
      };
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  static async disableToken(id: number) {
    const row = await prisma.inscripcion_tokens.findUnique({ where: { id } });
    if (!row) {
      throw new Error("Token no encontrado");
    }
    await prisma.inscripcion_tokens.update({
      where: { id },
      data: { expires_at: new Date(0) },
    });
    return { message: "Link deshabilitado" };
  }
}
