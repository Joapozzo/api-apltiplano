import { prisma } from "../../database/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { UploadService } from "../services/upload.service.js";
import { parseParamId } from "../../utils/express-helpers.js";
export class UploadController {
    static async subirImagen(req, res, next) {
        try {
            const idServicio = Number.parseInt(parseParamId(req.params.id_servicio), 10);
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
            const focalX = typeof req.body.focal_x === "string" || typeof req.body.focal_x === "number"
                ? Number(req.body.focal_x)
                : undefined;
            const focalY = typeof req.body.focal_y === "string" || typeof req.body.focal_y === "number"
                ? Number(req.body.focal_y)
                : undefined;
            const result = await UploadService.subirImagen({
                id_servicio: idServicio,
                buffer: req.fileBuffer,
                mimetype: req.fileMimetype,
                public_id: typeof req.body.public_id === "string" ? req.body.public_id : undefined,
                focal_x: Number.isFinite(focalX) ? focalX : undefined,
                focal_y: Number.isFinite(focalY) ? focalY : undefined,
            });
            res.status(201).json({
                url: result.url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
                focal_x: result.focal_x,
                focal_y: result.focal_y,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async actualizarFocal(req, res, next) {
        try {
            const idServicio = Number.parseInt(parseParamId(req.params.id_servicio), 10);
            const publicId = typeof req.body.public_id === "string" ? req.body.public_id : "";
            const focalX = Number(req.body.focal_x);
            const focalY = Number(req.body.focal_y);
            if (!Number.isInteger(idServicio)) {
                throw new AppError("ID de servicio inválido", 400);
            }
            if (!publicId.trim()) {
                throw new AppError("El public_id es obligatorio", 400);
            }
            if (!Number.isFinite(focalX) || !Number.isFinite(focalY)) {
                throw new AppError("focal_x y focal_y son obligatorios", 400);
            }
            const result = await UploadService.actualizarFocal({
                id_servicio: idServicio,
                public_id: publicId,
                focal_x: focalX,
                focal_y: focalY,
            });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async eliminarImagen(req, res, next) {
        try {
            const idServicio = Number.parseInt(parseParamId(req.params.id_servicio), 10);
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
    static async subirFotoCoordinador(req, res, next) {
        try {
            const idCoordinador = Number.parseInt(parseParamId(req.params.id_coordinador), 10);
            if (!Number.isInteger(idCoordinador)) {
                throw new AppError("ID de coordinador inválido", 400);
            }
            if (!req.fileBuffer || !req.fileMimetype) {
                throw new AppError("No se recibió una imagen procesada", 400);
            }
            const result = await UploadService.subirFotoCoordinador({
                id_coordinador: idCoordinador,
                buffer: req.fileBuffer,
                mimetype: req.fileMimetype,
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
    static async eliminarFotoCoordinador(req, res, next) {
        try {
            const idCoordinador = Number.parseInt(parseParamId(req.params.id_coordinador), 10);
            if (!Number.isInteger(idCoordinador)) {
                throw new AppError("ID de coordinador inválido", 400);
            }
            await UploadService.eliminarFotoCoordinador(idCoordinador);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    static async getFotoCoordinador(req, res, next) {
        try {
            const idCoordinador = Number.parseInt(parseParamId(req.params.id_coordinador), 10);
            if (!Number.isInteger(idCoordinador)) {
                throw new AppError("ID de coordinador inválido", 400);
            }
            const foto = await UploadService.getFotoCoordinador(idCoordinador);
            res.json(foto);
        }
        catch (error) {
            next(error);
        }
    }
    static async getImagenesServicio(req, res, next) {
        try {
            const idServicio = Number.parseInt(parseParamId(req.params.id_servicio), 10);
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
                    foto_focal_x: true,
                    foto_focal_y: true,
                    fotos_focal: true,
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