import type { Prisma } from "@prisma/client";
import type { AppRole, AuthenticatedRequestUser } from "../types/auth.types.js";
import { APP_ROLES } from "../types/auth.types.js";
import { decryptClientePii } from "../utils/data-protection.js";

/** Perfil de sesión (/auth/me, authenticate): sin agregados pesados. */
export const userMeSelect = {
  id_usuario: true,
  firebase_uid: true,
  email: true,
  username: true,
  nombre: true,
  apellido: true,
  activo: true,
  fecha_registro: true,
  fecha_actualizacion: true,
  usuario_roles: {
    include: {
      roles: true,
    },
  },
  cliente: {
    select: {
      id_cliente: true,
      nombre: true,
      apellido: true,
      email: true,
      fecha_creacion: true,
    },
  },
} as const;

export const userBaseSelect = {
  ...userMeSelect,
  cliente: {
    select: {
      id_cliente: true,
      nombre: true,
      apellido: true,
      email: true,
      fecha_creacion: true,
      _count: {
        select: {
          inscripciones: true,
        },
      },
    },
  },
} as const;

type UserWithRelations = Prisma.usuariosGetPayload<{
  select: typeof userBaseSelect;
}>;

type UserMeRelations = Prisma.usuariosGetPayload<{
  select: typeof userMeSelect;
}>;

type UserForResponse = UserWithRelations | UserMeRelations;

function mapRoles(usuarioRoles: UserForResponse["usuario_roles"]): AppRole[] {
  return usuarioRoles.map((item) => item.roles.codigo as AppRole);
}

export function mapAuthenticatedUser(user: UserForResponse): AuthenticatedRequestUser {
  return {
    id_usuario: user.id_usuario,
    firebase_uid: user.firebase_uid,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    activo: user.activo,
    roles: mapRoles(user.usuario_roles),
  };
}

function clienteInscripcionesCount(cliente: UserForResponse["cliente"]): number {
  if (!cliente || !("_count" in cliente) || !cliente._count) return 0;
  return cliente._count.inscripciones;
}

export function mapUserResponse(user: UserForResponse) {
  const roles = mapRoles(user.usuario_roles);
  const nombre = (decryptClientePii({ nombre: user.nombre }).nombre as string) ?? user.nombre;
  const apellido = (decryptClientePii({ apellido: user.apellido }).apellido as string) ?? user.apellido;
  const cliente = user.cliente ? decryptClientePii(user.cliente) : null;

  return {
    id_usuario: user.id_usuario,
    firebase_uid: user.firebase_uid,
    email: user.email,
    username: user.username,
    nombre,
    apellido,
    activo: user.activo,
    fecha_registro: user.fecha_registro,
    fecha_actualizacion: user.fecha_actualizacion,
    roles,
    rol_principal: roles[0] ?? APP_ROLES.USER,
    cliente: cliente
      ? {
          id_cliente: cliente.id_cliente as number,
          nombre: cliente.nombre as string,
          apellido: cliente.apellido as string,
          email: cliente.email as string,
          fecha_creacion: user.cliente!.fecha_creacion,
          total_inscripciones: clienteInscripcionesCount(user.cliente),
        }
      : null,
  };
}

export async function syncClienteFromUsuario(
  tx: Prisma.TransactionClient,
  input: {
    id_usuario: number;
    email: string;
    nombre: string;
    apellido: string;
  },
  options?: {
    ensureCliente?: boolean;
    syncEmail?: boolean;
  },
) {
  const existingCliente = await tx.clientes.findUnique({
    where: { id_usuario: input.id_usuario },
  });

  if (existingCliente) {
    return tx.clientes.update({
      where: { id_cliente: existingCliente.id_cliente },
      data: {
        nombre: input.nombre,
        apellido: input.apellido,
        ...(options?.syncEmail ? { email: input.email } : {}),
      },
    });
  }

  if (!options?.ensureCliente) {
    return null;
  }

  return tx.clientes.create({
    data: {
      id_usuario: input.id_usuario,
      email: input.email,
      nombre: input.nombre,
      apellido: input.apellido,
    },
  });
}
