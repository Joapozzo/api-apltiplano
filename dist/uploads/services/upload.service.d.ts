import type { SubirImagenDTO } from "../types/upload.types.js";
export declare class UploadService {
    static subirImagen(dto: SubirImagenDTO): Promise<import("../types/upload.types.js").UploadResult>;
    static eliminarImagen(public_id: string, id_servicio: number): Promise<void>;
    static eliminarImagenesServicio(id_servicio: number): Promise<void>;
}
//# sourceMappingURL=upload.service.d.ts.map