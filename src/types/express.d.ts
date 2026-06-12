import "express";
import type { Prisma } from "@prisma/client";
import type { AppRole } from "./auth.types.js";
import type { userMeSelect } from "../services/usuarios.shared.js";

type AuthUserProfile = Prisma.usuariosGetPayload<{
  select: typeof userMeSelect;
}>;

declare module "express" {
  interface Request {
    auth?: {
      id_usuario: number;
      firebase_uid: string;
      email: string;
      nombre: string;
      apellido: string;
      activo: boolean;
      roles: AppRole[];
    };
    /** Perfil cargado en authenticate (evita segunda query en /auth/me). */
    authUser?: AuthUserProfile;
    fileBuffer?: Buffer;
    fileMimetype?: string;
  }
}
