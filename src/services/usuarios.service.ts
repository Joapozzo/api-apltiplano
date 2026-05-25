import { randomBytes } from "node:crypto";
import { APP_ROLES } from "../types/auth.types.js";
import { prisma } from "../database/prisma.js";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "../types/api.types.js";
import { firebaseAdminAuth } from "./firebase-admin.service.js";
import { mapUserResponse, syncClienteFromUsuario, userBaseSelect } from "./usuarios.shared.js";

export interface UsuarioFilters {
  search?: string | undefined;
  role?: string | undefined;
  activo?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface UsuarioCreateInput {
  email: string;
  nombre: string;
  apellido: string;
  username?: string | undefined;
  rol?: string | undefined;
  crear_perfil_cliente?: boolean | undefined;
  password?: string | undefined;
  activo?: boolean | undefined;
}

export interface UsuarioUpdateInput {
  nombre?: string | undefined;
  apellido?: string | undefined;
  username?: string | null | undefined;
}

export class UsuariosServiceError extends Error {
  status: number;
  code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "UsuariosServiceError";
    this.status = status;
    this.code = code;
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsername(username?: string | null | undefined) {
  const normalized = username?.trim();
  return normalized && normalized.length > 0 ? normalized : null;
}

async function getRoleOrThrow(roleCode: string) {
  const role = await prisma.roles.findUnique({
    where: { codigo: roleCode },
  });

  if (!role) {
    throw new UsuariosServiceError(`Rol "${roleCode}" no configurado`, 500, "ROLE_NOT_CONFIGURED");
  }

  return role;
}

function generateTempPassword(): string {
  return `${randomBytes(12).toString("base64url")}Aa1!`;
}

function resolveEnsureCliente(roleCode: string, crearPerfilCliente?: boolean): boolean {
  if (roleCode === APP_ROLES.ADMIN) {
    return false;
  }

  if (crearPerfilCliente !== undefined) {
    return crearPerfilCliente;
  }

  return roleCode === APP_ROLES.USER;
}

function mapFirebaseCreateError(error: unknown): UsuariosServiceError {
  const code =
    error && typeof error === "object" && "code" in error ? String((error as { code: string }).code) : undefined;

  if (code === "auth/email-already-exists") {
    return new UsuariosServiceError("Ya existe una cuenta con ese email", 409, "EMAIL_ALREADY_EXISTS");
  }

  if (code === "auth/invalid-password") {
    return new UsuariosServiceError("La contraseña no cumple los requisitos de Firebase", 400, "INVALID_PASSWORD");
  }

  return new UsuariosServiceError("No se pudo crear la cuenta en Firebase", 500, "FIREBASE_CREATE_FAILED");
}

async function createFirebaseUserOrThrow(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<string> {
  try {
    const record = await firebaseAdminAuth().createUser({
      email: input.email,
      password: input.password,
      displayName: input.displayName,
      emailVerified: false,
    });

    return record.uid;
  } catch (error) {
    if (error instanceof UsuariosServiceError) {
      throw error;
    }

    throw mapFirebaseCreateError(error);
  }
}

async function deleteFirebaseUserSafe(firebaseUid: string) {
  try {
    await firebaseAdminAuth().deleteUser(firebaseUid);
  } catch {
    // best-effort rollback
  }
}

async function ensureUniqueUserFields(input: {
  firebase_uid?: string;
  email?: string;
  username?: string | null;
  excludeUserId?: number;
}) {
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

async function getUserOrThrow(idUsuario: number) {
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
  static async getAll(filters: UsuarioFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

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
    } as ApiPaginatedResponse<(typeof data)[number]>;
  }

  static async getById(idUsuario: number) {
    const user = await getUserOrThrow(idUsuario);

    return {
      success: true,
      data: mapUserResponse(user),
    } as ApiSuccessResponse<ReturnType<typeof mapUserResponse>>;
  }

  static async getMe(idUsuario: number) {
    return this.getById(idUsuario);
  }

  static async create(data: UsuarioCreateInput) {
    const email = normalizeEmail(data.email);
    const username = normalizeUsername(data.username);
    const roleCode = data.rol?.trim() || APP_ROLES.USER;
    const nombre = data.nombre.trim();
    const apellido = data.apellido.trim();
    const ensureCliente = resolveEnsureCliente(roleCode, data.crear_perfil_cliente);
    const password = data.password?.trim() || generateTempPassword();
    const displayName = [nombre, apellido].filter(Boolean).join(" ").trim() || email;

    await ensureUniqueUserFields({
      email,
      username,
    });

    const role = await getRoleOrThrow(roleCode);
    const firebaseUid = await createFirebaseUserOrThrow({
      email,
      password,
      displayName,
    });

    try {
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

        if (ensureCliente) {
          await syncClienteFromUsuario(
            tx,
            {
              id_usuario: user.id_usuario,
              email: user.email,
              nombre: user.nombre,
              apellido: user.apellido,
            },
            {
              ensureCliente: true,
              syncEmail: true,
            },
          );
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
      } as ApiSuccessResponse<ReturnType<typeof mapUserResponse>>;
    } catch (error) {
      await deleteFirebaseUserSafe(firebaseUid);
      throw error;
    }
  }

  static async update(idUsuario: number, data: UsuarioUpdateInput) {
    const existingUser = await getUserOrThrow(idUsuario);
    const normalizedUsername = data.username !== undefined ? normalizeUsername(data.username) : null;

    await ensureUniqueUserFields(
      data.username !== undefined
        ? {
            username: normalizedUsername,
            excludeUserId: idUsuario,
          }
        : {
            excludeUserId: idUsuario,
          },
    );

    const updateData: {
      nombre?: string;
      apellido?: string;
      username?: string | null;
    } = {};

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

      await syncClienteFromUsuario(
        tx,
        {
          id_usuario: user.id_usuario,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
        },
        {
          ensureCliente: Boolean(existingUser.cliente),
          syncEmail: false,
        },
      );

      return tx.usuarios.findUniqueOrThrow({
        where: { id_usuario: idUsuario },
        select: userBaseSelect,
      });
    });

    return {
      success: true,
      data: mapUserResponse(updatedUser),
      message: "Usuario actualizado exitosamente",
    } as ApiSuccessResponse<ReturnType<typeof mapUserResponse>>;
  }

  static async updateMe(idUsuario: number, data: UsuarioUpdateInput) {
    return this.update(idUsuario, data);
  }

  static async setActivo(idUsuario: number, activo: boolean) {
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
    } as ApiSuccessResponse<ReturnType<typeof mapUserResponse>>;
  }

  static async setRole(idUsuario: number, roleCode: string) {
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

      await syncClienteFromUsuario(
        tx,
        {
          id_usuario: user.id_usuario,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
        },
        {
          ensureCliente: roleCode === APP_ROLES.USER || Boolean(user.cliente),
          syncEmail: false,
        },
      );

      return tx.usuarios.findUniqueOrThrow({
        where: { id_usuario: idUsuario },
        select: userBaseSelect,
      });
    });

    return {
      success: true,
      data: mapUserResponse(updatedUser),
      message: "Rol actualizado exitosamente",
    } as ApiSuccessResponse<ReturnType<typeof mapUserResponse>>;
  }
}
