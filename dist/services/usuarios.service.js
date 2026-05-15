import { APP_ROLES } from "../types/auth.types.js";
import { prisma } from "../database/prisma.js";
import { mapUserResponse, syncClienteFromUsuario, userBaseSelect } from "./usuarios.shared.js";
export class UsuariosServiceError extends Error {
    status;
    code;
    constructor(message, status, code) {
        super(message);
        this.name = "UsuariosServiceError";
        this.status = status;
        this.code = code;
    }
}
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function normalizeFirebaseUid(firebaseUid) {
    return firebaseUid.trim();
}
function normalizeUsername(username) {
    const normalized = username?.trim();
    return normalized && normalized.length > 0 ? normalized : null;
}
async function getRoleOrThrow(roleCode) {
    const role = await prisma.roles.findUnique({
        where: { codigo: roleCode },
    });
    if (!role) {
        throw new UsuariosServiceError(`Rol "${roleCode}" no configurado`, 500, "ROLE_NOT_CONFIGURED");
    }
    return role;
}
async function ensureUniqueUserFields(input) {
    if (input.firebase_uid) {
        const byUid = await prisma.usuarios.findUnique({
            where: { firebase_uid: input.firebase_uid },
            select: { id_usuario: true },
        });
        if (byUid && byUid.id_usuario !== input.excludeUserId) {
            throw new UsuariosServiceError("Ya existe un usuario con ese Firebase UID", 409, "FIREBASE_UID_ALREADY_EXISTS");
        }
    }
    if (input.email) {
        const byEmail = await prisma.usuarios.findUnique({
            where: { email: input.email },
            select: { id_usuario: true },
        });
        if (byEmail && byEmail.id_usuario !== input.excludeUserId) {
            throw new UsuariosServiceError("Ya existe un usuario con ese email", 409, "EMAIL_ALREADY_EXISTS");
        }
    }
    if (input.username) {
        const byUsername = await prisma.usuarios.findUnique({
            where: { username: input.username },
            select: { id_usuario: true },
        });
        if (byUsername && byUsername.id_usuario !== input.excludeUserId) {
            throw new UsuariosServiceError("Ya existe un usuario con ese username", 409, "USERNAME_ALREADY_EXISTS");
        }
    }
}
async function getUserOrThrow(idUsuario) {
    const user = await prisma.usuarios.findUnique({
        where: { id_usuario: idUsuario },
        select: userBaseSelect,
    });
    if (!user) {
        throw new UsuariosServiceError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }
    return user;
}
export class UsuariosService {
    static async getAll(filters = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.search) {
            where.OR = [
                { nombre: { contains: filters.search, mode: "insensitive" } },
                { apellido: { contains: filters.search, mode: "insensitive" } },
                { email: { contains: filters.search, mode: "insensitive" } },
                { username: { contains: filters.search, mode: "insensitive" } },
            ];
        }
        if (filters.activo !== undefined) {
            where.activo = filters.activo;
        }
        if (filters.role) {
            where.usuario_roles = {
                some: {
                    roles: {
                        codigo: filters.role,
                    },
                },
            };
        }
        const [users, total] = await Promise.all([
            prisma.usuarios.findMany({
                where,
                skip,
                take: limit,
                select: userBaseSelect,
                orderBy: { id_usuario: "desc" },
            }),
            prisma.usuarios.count({ where }),
        ]);
        const data = users.map(mapUserResponse);
        return {
            success: true,
            data: {
                data,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    static async getById(idUsuario) {
        const user = await getUserOrThrow(idUsuario);
        return {
            success: true,
            data: mapUserResponse(user),
        };
    }
    static async getMe(idUsuario) {
        return this.getById(idUsuario);
    }
    static async create(data) {
        const firebaseUid = normalizeFirebaseUid(data.firebase_uid);
        const email = normalizeEmail(data.email);
        const username = normalizeUsername(data.username);
        const roleCode = data.rol?.trim() || APP_ROLES.USER;
        const nombre = data.nombre.trim();
        const apellido = data.apellido.trim();
        await ensureUniqueUserFields({
            firebase_uid: firebaseUid,
            email,
            username,
        });
        const role = await getRoleOrThrow(roleCode);
        const createdUser = await prisma.$transaction(async (tx) => {
            const user = await tx.usuarios.create({
                data: {
                    firebase_uid: firebaseUid,
                    email,
                    nombre,
                    apellido,
                    username,
                    activo: data.activo ?? true,
                    usuario_roles: {
                        create: {
                            id_rol: role.id_rol,
                        },
                    },
                },
                select: userBaseSelect,
            });
            if (roleCode === APP_ROLES.USER) {
                await syncClienteFromUsuario(tx, {
                    id_usuario: user.id_usuario,
                    email: user.email,
                    nombre: user.nombre,
                    apellido: user.apellido,
                }, {
                    ensureCliente: true,
                    syncEmail: true,
                });
            }
            return tx.usuarios.findUniqueOrThrow({
                where: { id_usuario: user.id_usuario },
                select: userBaseSelect,
            });
        });
        return {
            success: true,
            data: mapUserResponse(createdUser),
            message: "Usuario creado exitosamente",
        };
    }
    static async update(idUsuario, data) {
        const existingUser = await getUserOrThrow(idUsuario);
        const normalizedUsername = data.username !== undefined ? normalizeUsername(data.username) : null;
        await ensureUniqueUserFields(data.username !== undefined
            ? {
                username: normalizedUsername,
                excludeUserId: idUsuario,
            }
            : {
                excludeUserId: idUsuario,
            });
        const updateData = {};
        if (data.nombre !== undefined) {
            updateData.nombre = data.nombre.trim();
        }
        if (data.apellido !== undefined) {
            updateData.apellido = data.apellido.trim();
        }
        if (data.username !== undefined) {
            updateData.username = normalizedUsername;
        }
        const updatedUser = await prisma.$transaction(async (tx) => {
            const user = await tx.usuarios.update({
                where: { id_usuario: idUsuario },
                data: updateData,
                select: userBaseSelect,
            });
            await syncClienteFromUsuario(tx, {
                id_usuario: user.id_usuario,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
            }, {
                ensureCliente: Boolean(existingUser.cliente),
                syncEmail: false,
            });
            return tx.usuarios.findUniqueOrThrow({
                where: { id_usuario: idUsuario },
                select: userBaseSelect,
            });
        });
        return {
            success: true,
            data: mapUserResponse(updatedUser),
            message: "Usuario actualizado exitosamente",
        };
    }
    static async updateMe(idUsuario, data) {
        return this.update(idUsuario, data);
    }
    static async setActivo(idUsuario, activo) {
        await getUserOrThrow(idUsuario);
        const updatedUser = await prisma.usuarios.update({
            where: { id_usuario: idUsuario },
            data: { activo },
            select: userBaseSelect,
        });
        return {
            success: true,
            data: mapUserResponse(updatedUser),
            message: activo ? "Usuario activado exitosamente" : "Usuario desactivado exitosamente",
        };
    }
    static async setRole(idUsuario, roleCode) {
        const user = await getUserOrThrow(idUsuario);
        const role = await getRoleOrThrow(roleCode);
        const updatedUser = await prisma.$transaction(async (tx) => {
            await tx.usuario_roles.deleteMany({
                where: { id_usuario: idUsuario },
            });
            await tx.usuario_roles.create({
                data: {
                    id_usuario: idUsuario,
                    id_rol: role.id_rol,
                },
            });
            await syncClienteFromUsuario(tx, {
                id_usuario: user.id_usuario,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
            }, {
                ensureCliente: roleCode === APP_ROLES.USER || Boolean(user.cliente),
                syncEmail: false,
            });
            return tx.usuarios.findUniqueOrThrow({
                where: { id_usuario: idUsuario },
                select: userBaseSelect,
            });
        });
        return {
            success: true,
            data: mapUserResponse(updatedUser),
            message: "Rol actualizado exitosamente",
        };
    }
}
//# sourceMappingURL=usuarios.service.js.map