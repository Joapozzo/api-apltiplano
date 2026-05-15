import { prisma } from "../database/prisma.js";
import { JWTService } from "./jwt.service.js";
export class InscripcionesService {
    static async generateLink(id_expedicion, id_cliente, expiresInDays = 7) {
        const [expedicion, cliente] = await Promise.all([
            prisma.expediciones.findFirst({
                where: { id_expedicion },
                include: {
                    servicios: {
                        include: { lugares: true, actividades: true, dificultades: true },
                    },
                },
            }),
            prisma.clientes.findUnique({ where: { id_cliente } }),
        ]);
        if (!expedicion) {
            throw new Error("Expedición no encontrada");
        }
        if (!cliente) {
            throw new Error("Cliente no encontrado");
        }
        const token = JWTService.generateToken(id_expedicion, id_cliente, expiresInDays);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);
        await prisma.inscripcion_tokens.create({
            data: {
                token,
                id_expedicion,
                id_cliente,
                expires_at: expiresAt,
            },
        });
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
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
    static async validateToken(token) {
        const payload = JWTService.verifyToken(token);
        if (!payload) {
            return { valid: false, error: "Token inválido o expirado" };
        }
        const tokenRecord = await prisma.inscripcion_tokens.findUnique({
            where: { token },
            include: {
                clientes: true,
            },
        });
        if (!tokenRecord) {
            return { valid: false, error: "Token no encontrado" };
        }
        if (tokenRecord.usado) {
            return { valid: false, error: "Token ya utilizado" };
        }
        if (tokenRecord.expires_at < new Date()) {
            return { valid: false, error: "Token expirado" };
        }
        if (tokenRecord.id_expedicion !== payload.id_expedicion ||
            tokenRecord.id_cliente !== payload.id_cliente) {
            return { valid: false, error: "Token no coincide con el registro" };
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
            return { valid: false, error: "Expedición no encontrada" };
        }
        const c = tokenRecord.clientes;
        return {
            valid: true,
            expedicion,
            servicio: expedicion.servicios,
            cliente: {
                id_cliente: c.id_cliente,
                nombre: c.nombre,
                apellido: c.apellido,
                email: c.email,
            },
        };
    }
    static async submitInscripcion(data) {
        const validation = await this.validateToken(data.token);
        if (!validation.valid) {
            throw new Error(validation.error || "Token inválido");
        }
        const expedicion = validation.expedicion;
        const id_cliente = validation.cliente.id_cliente;
        if (expedicion.cupos_ocupados >= expedicion.cupos_disponibles) {
            throw new Error("No hay cupos disponibles");
        }
        const duplicada = await prisma.inscripciones.findFirst({
            where: {
                id_cliente,
                id_expedicion: expedicion.id_expedicion,
                estado: { not: "Cancelado" },
            },
        });
        if (duplicada) {
            throw new Error("Este cliente ya tiene una inscripción activa en esta expedición");
        }
        const fnac = typeof data.usuario.fecha_nacimiento === "string"
            ? new Date(data.usuario.fecha_nacimiento)
            : data.usuario.fecha_nacimiento;
        return await prisma.$transaction(async (tx) => {
            const inscripcion = await tx.inscripciones.create({
                data: {
                    id_cliente,
                    id_expedicion: expedicion.id_expedicion,
                    fecha_inscripcion: new Date(),
                    estado: "Inscripto",
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
                data: { usado: true, id_inscripcion: inscripcion.id_inscripcion },
            });
            return {
                success: true,
                inscripcion_id: inscripcion.id_inscripcion,
                mensaje: "Inscripción realizada exitosamente",
            };
        });
    }
    static async listInscripciones(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.estado) {
            where.estado = filters.estado;
        }
        if (filters.expedicion) {
            where.id_expedicion = filters.expedicion;
        }
        if (filters.search) {
            where.OR = [
                { clientes: { nombre: { contains: filters.search, mode: "insensitive" } } },
                { clientes: { apellido: { contains: filters.search, mode: "insensitive" } } },
                { clientes: { email: { contains: filters.search, mode: "insensitive" } } },
                { dni: { contains: filters.search, mode: "insensitive" } },
            ];
        }
        const [inscripciones, total] = await Promise.all([
            prisma.inscripciones.findMany({
                where,
                skip,
                take: limit,
                include: {
                    clientes: true,
                    expediciones: {
                        include: {
                            servicios: { include: { lugares: true } },
                        },
                    },
                },
                orderBy: { fecha_inscripcion: "desc" },
            }),
            prisma.inscripciones.count({ where }),
        ]);
        return {
            inscripciones,
            total,
            pages: Math.ceil(total / limit),
            page,
            limit,
        };
    }
    static async getInscripcionById(id) {
        return await prisma.inscripciones.findUnique({
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
    }
    static async updateInscripcion(id, data) {
        return await prisma.inscripciones.update({
            where: { id_inscripcion: id },
            data,
            include: {
                clientes: true,
                expediciones: { include: { servicios: true } },
            },
        });
    }
    static async deleteInscripcion(id) {
        const inscripcion = await prisma.inscripciones.findUnique({
            where: { id_inscripcion: id },
        });
        if (!inscripcion) {
            throw new Error("Inscripción no encontrada");
        }
        await prisma.expediciones.update({
            where: { id_expedicion: inscripcion.id_expedicion },
            data: { cupos_ocupados: { decrement: 1 } },
        });
        await prisma.inscripciones.delete({
            where: { id_inscripcion: id },
        });
        return { success: true };
    }
    static async listTokens(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.id_expedicion) {
            where.id_expedicion = filters.id_expedicion;
        }
        if (filters.usado !== undefined) {
            where.usado = filters.usado;
        }
        if (filters.expirado === true) {
            where.expires_at = { lt: new Date() };
        }
        else if (filters.expirado === false) {
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
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const now = new Date();
        const data = rows.map((r) => {
            const expirado = r.expires_at < now;
            return {
                id: r.id,
                token: r.token,
                url: `${baseUrl}/inscripcion/${r.token}`,
                id_expedicion: r.id_expedicion,
                id_cliente: r.id_cliente,
                cliente: r.clientes,
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
    static async disableToken(id) {
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
//# sourceMappingURL=inscripciones.service.js.map