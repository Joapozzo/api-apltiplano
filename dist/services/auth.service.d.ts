import type { DecodedIdToken } from "firebase-admin/auth";
import type { AuthenticatedRequestUser } from "../types/auth.types.js";
export interface RegisterWithFirebaseInput {
    nombre?: string | undefined;
    apellido?: string | undefined;
    username?: string | undefined;
}
export declare class AuthServiceError extends Error {
    status: number;
    code: string | undefined;
    constructor(message: string, status: number, code?: string);
}
export declare class AuthService {
    static verifyIdToken(idToken: string): Promise<DecodedIdToken>;
    static registerWithFirebaseToken(idToken: string, input: RegisterWithFirebaseInput): Promise<{
        success: true;
        data: {
            user: {
                id_usuario: number;
                firebase_uid: string;
                email: string;
                username: string | null;
                nombre: string;
                apellido: string;
                activo: boolean;
                fecha_registro: Date;
                fecha_actualizacion: Date;
                roles: import("../types/auth.types.js").AppRole[];
                rol_principal: import("../types/auth.types.js").AppRole;
                cliente: {
                    id_cliente: number;
                    nombre: string;
                    apellido: string;
                    email: string;
                    fecha_creacion: Date;
                    total_inscripciones: number;
                } | null;
            };
        };
        message: string;
    }>;
    static getCurrentUser(idToken: string): Promise<{
        success: true;
        data: {
            user: {
                id_usuario: number;
                firebase_uid: string;
                email: string;
                username: string | null;
                nombre: string;
                apellido: string;
                activo: boolean;
                fecha_registro: Date;
                fecha_actualizacion: Date;
                roles: import("../types/auth.types.js").AppRole[];
                rol_principal: import("../types/auth.types.js").AppRole;
                cliente: {
                    id_cliente: number;
                    nombre: string;
                    apellido: string;
                    email: string;
                    fecha_creacion: Date;
                    total_inscripciones: number;
                } | null;
            };
        };
    }>;
    static authenticateRequest(idToken: string): Promise<AuthenticatedRequestUser>;
}
//# sourceMappingURL=auth.service.d.ts.map