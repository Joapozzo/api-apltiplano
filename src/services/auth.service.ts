import type { DecodedIdToken } from "firebase-admin/auth";
import { prisma } from "../database/prisma.js";
import { firebaseAdminAuth } from "./firebase-admin.service.js";
import type { AuthenticatedRequestUser } from "../types/auth.types.js";
import { APP_ROLES } from "../types/auth.types.js";
import { mapAuthenticatedUser, mapUserResponse, syncClienteFromUsuario, userBaseSelect } from "./usuarios.shared.js";

export interface RegisterWithFirebaseInput {
  nombre?: string | undefined;
  apellido?: string | undefined;
  username?: string | undefined;
}

export class AuthServiceError extends Error {
  status: number;
  code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AuthServiceError";
    this.status = status;
    this.code = code;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export class AuthService {
  static async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    try {
      return await firebaseAdminAuth().verifyIdToken(idToken, true);
    } catch {
      throw new AuthServiceError("Token de Firebase invAlido o expirado", 401, "INVALID_TOKEN");
    }
  }

  static async registerWithFirebaseToken(idToken: string, input: RegisterWithFirebaseInput) {
    const decoded = await this.verifyIdToken(idToken);

    if (!decoded.email) {
      throw new AuthServiceError("Firebase no devolviO un email para este usuario", 400, "MISSING_EMAIL");
    }

    const email = normalizeEmail(decoded.email);
    const firebaseUid = decoded.uid;
    const nombre = input.nombre?.trim() ?? "";
    const apellido = input.apellido?.trim() ?? "";
    const username = input.username?.trim() || undefined;

    const userRole = await prisma.roles.findUnique({
      where: { codigo: APP_ROLES.USER },
    });

    if (!userRole) {
      throw new AuthServiceError('Rol "USER" no configurado. EjecutA: npx prisma db seed', 500, "ROLE_NOT_CONFIGURED");
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingByUid = await tx.usuarios.findUnique({
        where: { firebase_uid: firebaseUid },
        select: userBaseSelect,
      });

      const existingByEmail =
        existingByUid ||
        (await tx.usuarios.findUnique({
          where: { email },
          select: userBaseSelect,
        }));

      if (existingByUid && existingByUid.email !== email) {
        const emailConflict = await tx.usuarios.findUnique({
          where: { email },
          select: { id_usuario: true },
        });

        if (emailConflict && emailConflict.id_usuario !== existingByUid.id_usuario) {
          throw new AuthServiceError(
            "El email de Firebase ya estA asociado a otro usuario local",
            409,
            "EMAIL_ALREADY_IN_USE",
          );
        }
      }

      const userData = {
        firebase_uid: firebaseUid,
        email,
        nombre,
        apellido,
        ...(username !== undefined ? { username } : {}),
        activo: true,
      };

      if (existingByUid) {
        const updatedUser = await tx.usuarios.update({
          where: { id_usuario: existingByUid.id_usuario },
          data: userData,
          select: userBaseSelect,
        });

        await syncClienteFromUsuario(
          tx,
          {
            id_usuario: updatedUser.id_usuario,
            email,
            nombre,
            apellido,
          },
          {
            ensureCliente: true,
            syncEmail: true,
          },
        );

        if (updatedUser.usuario_roles.length === 0) {
          await tx.usuario_roles.create({
            data: {
              id_usuario: updatedUser.id_usuario,
              id_rol: userRole.id_rol,
            },
          });
        }

        const userWithRoles = await tx.usuarios.findUniqueOrThrow({
          where: { id_usuario: updatedUser.id_usuario },
          select: userBaseSelect,
        });

        return {
          created: false,
          user: userWithRoles,
        };
      }

      if (existingByEmail) {
        if (existingByEmail.firebase_uid && existingByEmail.firebase_uid !== firebaseUid) {
          throw new AuthServiceError(
            "Ya existe un usuario local con ese email vinculado a otro UID de Firebase",
            409,
            "FIREBASE_UID_MISMATCH",
          );
        }

        const updatedUser = await tx.usuarios.update({
          where: { id_usuario: existingByEmail.id_usuario },
          data: userData,
          select: userBaseSelect,
        });

        await syncClienteFromUsuario(
          tx,
          {
            id_usuario: updatedUser.id_usuario,
            email,
            nombre,
            apellido,
          },
          {
            ensureCliente: true,
            syncEmail: true,
          },
        );

        if (updatedUser.usuario_roles.length === 0) {
          await tx.usuario_roles.create({
            data: {
              id_usuario: updatedUser.id_usuario,
              id_rol: userRole.id_rol,
            },
          });
        }

        const userWithRoles = await tx.usuarios.findUniqueOrThrow({
          where: { id_usuario: updatedUser.id_usuario },
          select: userBaseSelect,
        });

        return {
          created: false,
          user: userWithRoles,
        };
      }

      const createdUser = await tx.usuarios.create({
        data: {
          firebase_uid: firebaseUid,
          email,
          nombre,
          apellido,
          ...(username ? { username } : {}),
          usuario_roles: {
            create: {
              id_rol: userRole.id_rol,
            },
          },
        },
        select: userBaseSelect,
      });

      await syncClienteFromUsuario(
        tx,
        {
          id_usuario: createdUser.id_usuario,
          email,
          nombre,
          apellido,
        },
        {
          ensureCliente: true,
          syncEmail: true,
        },
      );

      return {
        created: true,
        user: await tx.usuarios.findUniqueOrThrow({
          where: { id_usuario: createdUser.id_usuario },
          select: userBaseSelect,
        }),
      };
    });

    return {
      success: true as const,
      data: {
        user: mapUserResponse(result.user),
      },
      message: result.created
        ? "Usuario registrado y sincronizado correctamente"
        : "Usuario sincronizado correctamente",
    };
  }

  static async getCurrentUser(idToken: string) {
    const decoded = await this.verifyIdToken(idToken);

    const user = await prisma.usuarios.findUnique({
      where: { firebase_uid: decoded.uid },
      select: userBaseSelect,
    });

    if (!user) {
      throw new AuthServiceError("Usuario no registrado en la base de datos", 401, "LOCAL_USER_NOT_FOUND");
    }

    if (!user.activo) {
      throw new AuthServiceError("El usuario estA inactivo", 403, "USER_INACTIVE");
    }

    return {
      success: true as const,
      data: {
        user: mapUserResponse(user),
      },
    };
  }

  static async authenticateRequest(idToken: string): Promise<AuthenticatedRequestUser> {
    const decoded = await this.verifyIdToken(idToken);

    const user = await prisma.usuarios.findUnique({
      where: { firebase_uid: decoded.uid },
      select: userBaseSelect,
    });

    if (!user) {
      throw new AuthServiceError("Usuario no registrado en la base de datos", 401, "LOCAL_USER_NOT_FOUND");
    }

    if (!user.activo) {
      throw new AuthServiceError("El usuario estA inactivo", 403, "USER_INACTIVE");
    }

    return mapAuthenticatedUser(user);
  }
}
