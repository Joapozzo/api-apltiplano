export declare const APP_ROLES: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
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
//# sourceMappingURL=auth.types.d.ts.map