import { randomUUID } from "node:crypto";
import { prisma } from "../../database/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { storageAdapter } from "../adapters/index.js";
function buildCarpeta(idServicio) {
    return `altiplano/servicios/${idServicio}`;
}
function buildGeneratedPublicId(idServicio) {
    return `${buildCarpeta(idServicio)}/${Date.now()}-${randomUUID().slice(0, 8)}`;
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
            carpeta: buildCarpeta(dto.id_servicio),
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
    static async eliminarImagenesServicio(id_servicio) {
        const carpeta = buildCarpeta(id_servicio);
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