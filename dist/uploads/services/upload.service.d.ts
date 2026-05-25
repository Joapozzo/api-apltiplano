import type { EliminarFotoCoordinadorOptions, SubirFotoCoordinadorDTO, SubirImagenDTO } from "../types/upload.types.js";
export declare class UploadService {
    static subirImagen(dto: SubirImagenDTO): Promise<import("../types/upload.types.js").UploadResult>;
    static eliminarImagen(public_id: string, id_servicio: number): Promise<void>;
    static subirFotoCoordinador(dto: SubirFotoCoordinadorDTO): Promise<import("../types/upload.types.js").UploadResult>;
    static eliminarFotoCoordinador(id_coordinador: number, options?: EliminarFotoCoordinadorOptions): Promise<void>;
    static getFotoCoordinador(id_coordinador: number): Promise<{
        url_foto: string | null;
        foto_public_id: string | null;
    }>;
    static eliminarImagenesServicio(id_servicio: number): Promise<void>;
}
//# sourceMappingURL=upload.service.d.ts.map