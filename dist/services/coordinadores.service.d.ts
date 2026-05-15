export interface CreateCoordinadorData {
    nombre: string;
    apellido: string;
    dni: string;
    certificaciones?: string[];
    especialidades?: string[];
}
export interface UpdateCoordinadorData {
    nombre?: string;
    apellido?: string;
    dni?: string;
    certificaciones?: string[];
    especialidades?: string[];
    activo?: boolean;
}
export interface AsignarAExpedicionData {
    id_expedicion: number;
    rol: string;
}
export declare class CoordinadoresService {
    static list(filters?: {
        activo?: boolean;
        search?: string;
    }): Promise<{
        success: boolean;
        data: {
            total_expediciones: number;
            nombre: string;
            apellido: string;
            activo: boolean;
            _count: {
                expedicion_coordinadores: number;
            };
            dni: string;
            id_coordinador: number;
            certificaciones: string[];
            especialidades: string[];
        }[];
    }>;
    static getById(id: number): Promise<{
        success: boolean;
        data: {
            id_coordinador: number;
            nombre: string;
            apellido: string;
            dni: string;
            certificaciones: string[];
            especialidades: string[];
            activo: boolean;
            historial: {
                id_expedicion: number;
                servicio: string;
                slug: string | null;
                fecha_salida: Date;
                fecha_fin: Date;
                estado: string;
                rol: string;
            }[];
            total_expediciones: number;
        };
    }>;
    static create(data: CreateCoordinadorData): Promise<{
        success: boolean;
        data: {
            nombre: string;
            apellido: string;
            activo: boolean;
            dni: string;
            id_coordinador: number;
            certificaciones: string[];
            especialidades: string[];
        };
    }>;
    static update(id: number, data: UpdateCoordinadorData): Promise<{
        success: boolean;
        data: {
            nombre: string;
            apellido: string;
            activo: boolean;
            dni: string;
            id_coordinador: number;
            certificaciones: string[];
            especialidades: string[];
        };
    }>;
    static delete(id: number): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    static asignarAExpedicion(id_coordinador: number, data: AsignarAExpedicionData): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    static desasignarDeExpedicion(id_coordinador: number, id_expedicion: number): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    static getHistorial(id: number): Promise<{
        success: boolean;
        data: {
            nombre: string;
            apellido: string;
            total_expediciones: number;
            expediciones: {
                id_expedicion: number;
                servicio: string;
                slug: string | null;
                fecha_salida: Date;
                fecha_fin: Date;
                estado: string;
                rol: string;
            }[];
        };
    }>;
}
//# sourceMappingURL=coordinadores.service.d.ts.map