import { randomUUID } from "node:crypto";
import { prisma } from "../../database/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { storageAdapter } from "../adapters/index.js";
import { coordinadorFotoCarpeta, coordinadorFotoPublicId, servicioCarpeta, servicioPublicIdGenerated, } from "../utils/upload-paths.js";
function buildGeneratedPublicId(idServicio) {
    return servicioPublicIdGenerated(idServicio, `${Date.now()}-${randomUUID().slice(0, 8)}`);
}
function matchesPublicId(url, publicId) {
    const normalizedUrl = decodeURIComponent(url.split("?")[0] ?? url);
    return normalizedUrl.endsWith(`/${publicId}.webp`) || normalizedUrl.includes(`/${publicId}.`);
}
function dedupeUrls(urls) {
    return Array.from(new Set(urls));
}
export class UploadService {
    static async subirImagen(dto) {
        const servicio = await prisma.servicios.findUnique({
            where: {
                id_servicio: dto.id_servicio,
            },
            select: {
                id_servicio: true,
                url_foto: true,
                urls_fotos: true,
            },
        });
        if (!servicio) {
            throw new AppError("Servicio no encontrado", 404);
        }
        const publicId = dto.public_id ?? buildGeneratedPublicId(dto.id_servicio);
        const result = await storageAdapter.upload({
            buffer: dto.buffer,
            mimetype: dto.mimetype,
            carpeta: servicioCarpeta(dto.id_servicio),
            public_id: publicId,
        });
        const hasMatchingExisting = servicio.urls_fotos.some((url) => matchesPublicId(url, publicId));
        const nextUrls = hasMatchingExisting
            ? servicio.urls_fotos.map((url) => (matchesPublicId(url, publicId) ? result.url : url))
            : [...servicio.urls_fotos, result.url];
        const dedupedUrls = dedupeUrls(nextUrls);
        const nextUrlFoto = !servicio.url_foto || matchesPublicId(servicio.url_foto, publicId)
            ? result.url
            : servicio.url_foto;
        await prisma.servicios.update({
            where: {
                id_servicio: dto.id_servicio,
            },
            data: {
                url_foto: dedupedUrls.length > 0 ? nextUrlFoto : null,
                urls_fotos: dedupedUrls,
            },
        });
        return result;
    }
    static async eliminarImagen(public_id, id_servicio) {
        const servicio = await prisma.servicios.findUnique({
            where: {
                id_servicio,
            },
            select: {
                id_servicio: true,
                url_foto: true,
                urls_fotos: true,
            },
        });
        if (!servicio) {
            throw new AppError("Servicio no encontrado", 404);
        }
        await storageAdapter.delete(public_id);
        const remainingUrls = servicio.urls_fotos.filter((url) => !matchesPublicId(url, public_id));
        const wasPrimaryDeleted = servicio.url_foto ? matchesPublicId(servicio.url_foto, public_id) : false;
        const nextPrimary = wasPrimaryDeleted ? (remainingUrls[0] ?? null) : servicio.url_foto;
        await prisma.servicios.update({
            where: {
                id_servicio,
            },
            data: {
                url_foto: remainingUrls.length > 0 ? nextPrimary : null,
                urls_fotos: remainingUrls,
            },
        });
    }
    static async subirFotoCoordinador(dto) {
        const coordinador = await prisma.coordinadores.findUnique({
            where: { id_coordinador: dto.id_coordinador },
            select: { id_coordinador: true, foto_public_id: true },
        });
        if (!coordinador) {
            throw new AppError("Coordinador no encontrado", 404);
        }
        const result = await storageAdapter.upload({
            buffer: dto.buffer,
            mimetype: dto.mimetype,
            carpeta: coordinadorFotoCarpeta(),
            public_id: coordinadorFotoPublicId(dto.id_coordinador),
        });
        await prisma.coordinadores.update({
            where: { id_coordinador: dto.id_coordinador },
            data: {
                url_foto: result.url,
                foto_public_id: result.public_id,
            },
        });
        return result;
    }
    static async eliminarFotoCoordinador(id_coordinador, options = {}) {
        const coordinador = await prisma.coordinadores.findUnique({
            where: { id_coordinador },
            select: { id_coordinador: true, foto_public_id: true },
        });
        if (!coordinador) {
            throw new AppError("Coordinador no encontrado", 404);
        }
        if (!coordinador.foto_public_id) {
            if (options.skipNotFound)
                return;
            throw new AppError("El coordinador no tiene foto", 404);
        }
        await storageAdapter.delete(coordinador.foto_public_id);
        await prisma.coordinadores.update({
            where: { id_coordinador },
            data: { url_foto: null, foto_public_id: null },
        });
    }
    static async getFotoCoordinador(id_coordinador) {
        const coordinador = await prisma.coordinadores.findUnique({
            where: { id_coordinador },
            select: { url_foto: true, foto_public_id: true },
        });
        if (!coordinador) {
            throw new AppError("Coordinador no encontrado", 404);
        }
        return coordinador;
    }
    static async eliminarImagenesServicio(id_servicio) {
        const carpeta = servicioCarpeta(id_servicio);
        await storageAdapter.deleteFolder(carpeta);
        await prisma.servicios.update({
            where: {
                id_servicio,
            },
            data: {
                url_foto: null,
                urls_fotos: [],
            },
        });
    }
}
//# sourceMappingURL=upload.service.js.map