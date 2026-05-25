import "express";
import type { AppRole } from "./auth.types.js";

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
    fileBuffer?: Buffer;
    fileMimetype?: string;
  }
}