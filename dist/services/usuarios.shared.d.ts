import type { Prisma } from "@prisma/client";
import type { AppRole, AuthenticatedRequestUser } from "../types/auth.types.js";
export declare const userBaseSelect: {
    readonly id_usuario: true;
    readonly firebase_uid: true;
    readonly email: true;
    readonly username: true;
    readonly nombre: true;
    readonly apellido: true;
    readonly activo: true;
    readonly fecha_registro: true;
    readonly fecha_actualizacion: true;
    readonly usuario_roles: {
        readonly include: {
            readonly roles: true;
        };
    };
    readonly cliente: {
        readonly select: {
            readonly id_cliente: true;
            readonly nombre: true;
            readonly apellido: true;
            readonly email: true;
            readonly fecha_creacion: true;
            readonly _count: {
                readonly select: {
                    readonly inscripciones: true;
                };
            };
        };
    };
};
type UserWithRelations = Prisma.usuariosGetPayload<{
    select: typeof userBaseSelect;
}>;
export declare function mapAuthenticatedUser(user: UserWithRelations): AuthenticatedRequestUser;
export declare function mapUserResponse(user: UserWithRelations): {
    id_usuario: number;
    firebase_uid: string;
    email: string;
    username: string | null;
    nombre: string;
    apellido: string;
    activo: boolean;
    fecha_registro: Date;
    fecha_actualizacion: Date;
    roles: AppRole[];
    rol_principal: AppRole;
    cliente: {
        id_cliente: number;
        nombre: string;
        apellido: string;
        email: string;
        fecha_creacion: Date;
        total_inscripciones: number;
    } | null;
};
export declare function syncClienteFromUsuario(tx: Prisma.TransactionClient, input: {
    id_usuario: number;
    email: string;
    nombre: string;
    apellido: string;
}, options?: {
    ensureCliente?: boolean;
    syncEmail?: boolean;
}): Promise<{
    id_usuario: number;
    email: string;
    nombre: string;
    apellido: string;
    id_cliente: number;
    fecha_creacion: Date;
} | null>;
export {};
//# sourceMappingURL=usuarios.shared.d.ts.map