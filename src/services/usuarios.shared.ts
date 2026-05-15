import type { Prisma } from "@prisma/client";
import type { AppRole, AuthenticatedRequestUser } from "../types/auth.types.js";
import { APP_ROLES } from "../types/auth.types.js";

export const userBaseSelect = {
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

function mapRoles(
  usuarioRoles: UserWithRelations["usuario_roles"]
): AppRole[] {
  return usuarioRoles.map((item) => item.roles.codigo as AppRole);
}

export function mapAuthenticatedUser(user: UserWithRelations): AuthenticatedRequestUser {
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

export function mapUserResponse(user: UserWithRelations) {
  const roles = mapRoles(user.usuario_roles);

  return {
    id_usuario: user.id_usuario,
    firebase_uid: user.firebase_uid,
    email: user.email,
    username: user.username,
    nombre: user.nombre,
    apellido: user.apellido,
    activo: user.activo,
    fecha_registro: user.fecha_registro,
    fecha_actualizacion: user.fecha_actualizacion,
    roles,
    rol_principal: roles[0] ?? APP_ROLES.USER,
    cliente: user.cliente
      ? {
          id_cliente: user.cliente.id_cliente,
          nombre: user.cliente.nombre,
          apellido: user.cliente.apellido,
          email: user.cliente.email,
          fecha_creacion: user.cliente.fecha_creacion,
          total_inscripciones: user.cliente._count.inscripciones,
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
  }
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
