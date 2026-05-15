import type { ApiPaginatedResponse, ApiSuccessResponse } from "../types/api.types.js";
export interface UsuarioFilters {
    search?: string | undefined;
    role?: string | undefined;
    activo?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}
export interface UsuarioCreateInput {
    firebase_uid: string;
    email: string;
    nombre: string;
    apellido: string;
    username?: string | undefined;
    rol?: string | undefined;
    activo?: boolean | undefined;
}
export interface UsuarioUpdateInput {
    nombre?: string | undefined;
    apellido?: string | undefined;
    username?: string | null | undefined;
}
export declare class UsuariosServiceError extends Error {
    status: number;
    code: string | undefined;
    constructor(message: string, status: number, code?: string);
}
export declare class UsuariosService {
    static getAll(filters?: UsuarioFilters): Promise<ApiPaginatedResponse<{
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
    }>>;
    static getById(idUsuario: number): Promise<ApiSuccessResponse<{
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
    }>>;
    static getMe(idUsuario: number): Promise<ApiSuccessResponse<{
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
    }>>;
    static create(data: UsuarioCreateInput): Promise<ApiSuccessResponse<{
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
    }>>;
    static update(idUsuario: number, data: UsuarioUpdateInput): Promise<ApiSuccessResponse<{
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
    }>>;
    static updateMe(idUsuario: number, data: UsuarioUpdateInput): Promise<ApiSuccessResponse<{
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
    }>>;
    static setActivo(idUsuario: number, activo: boolean): Promise<ApiSuccessResponse<{
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
    }>>;
    static setRole(idUsuario: number, roleCode: string): Promise<ApiSuccessResponse<{
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
    }>>;
}
//# sourceMappingURL=usuarios.service.d.ts.map