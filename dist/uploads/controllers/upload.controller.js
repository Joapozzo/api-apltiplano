import { prisma } from "../../database/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { UploadService } from "../services/upload.service.js";
export class UploadController {
    static async subirImagen(req, res, next) {
        try {
            const idServicio = Number.parseInt(req.params.id_servicio ?? "", 10);
            if (!Number.isInteger(idServicio)) {
                throw new AppError("ID de servicio inválido", 400);
            }
            const servicio = await prisma.servicios.findUnique({
                where: {
                    id_servicio: idServicio,
                },
                select: {
                    id_servicio: true,
                },
            });
            if (!servicio) {
                throw new AppError("Servicio no encontrado", 404);
            }
            if (!req.fileBuffer || !req.fileMimetype) {
                throw new AppError("No se recibió una imagen procesada", 400);
            }
            const result = await UploadService.subirImagen({
                id_servicio: idServicio,
                buffer: req.fileBuffer,
                mimetype: req.fileMimetype,
                public_id: typeof req.body.public_id === "string" ? req.body.public_id : undefined,
            });
            res.status(201).json({
                url: result.url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async eliminarImagen(req, res, next) {
        try {
            const idServicio = Number.parseInt(req.params.id_servicio ?? "", 10);
            const publicId = typeof req.body.public_id === "string" ? req.body.public_id : "";
            if (!Number.isInteger(idServicio)) {
                throw new AppError("ID de servicio inválido", 400);
            }
            if (!publicId.trim()) {
                throw new AppError("El public_id es obligatorio", 400);
            }
            await UploadService.eliminarImagen(publicId, idServicio);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    static async getImagenesServicio(req, res, next) {
        try {
            const idServicio = Number.parseInt(req.params.id_servicio ?? "", 10);
            if (!Number.isInteger(idServicio)) {
                throw new AppError("ID de servicio inválido", 400);
            }
            const servicio = await prisma.servicios.findUnique({
                where: {
                    id_servicio: idServicio,
                },
                select: {
                    url_foto: true,
                    urls_fotos: true,
                },
            });
            if (!servicio) {
                throw new AppError("Servicio no encontrado", 404);
            }
            res.json(servicio);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=upload.controller.js.map