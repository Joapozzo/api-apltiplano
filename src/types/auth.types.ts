export const APP_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export interface AuthenticatedRequestUser {
  id_usuario: number;
  firebase_uid: string;
  email: string;
  nombre: string;
  apellido: string;
  activo: boolean;
  roles: AppRole[];
}
