import { randomUUID } from "node:crypto";
import { prisma } from "../../database/prisma.js";
import { AppError } from "../../utils/app-error.js";
import {
  normalizeFocal,
  parseFotosFocalMap,
  publicIdFromImageUrl,
  removeFotosFocalEntry,
  setFotosFocalEntry,
} from "../../utils/fotos-focal.js";
import type {
  ActualizarFocalImagenDTO,
  EliminarFotoCoordinadorOptions,
  SubirFotoCoordinadorDTO,
  SubirImagenDTO,
} from "../types/upload.types.js";
import { storageAdapter } from "../adapters/index.js";
import {
  coordinadorFotoCarpeta,
  coordinadorFotoPublicId,
  servicioCarpeta,
  servicioPublicIdGenerated,
} from "../utils/upload-paths.js";

function buildGeneratedPublicId(idServicio: number) {
  return servicioPublicIdGenerated(idServicio, `${Date.now()}-${randomUUID().slice(0, 8)}`);
}

function matchesPublicId(url: string, publicId: string) {
  const normalizedUrl = decodeURIComponent(url.split("?")[0] ?? url);
  return normalizedUrl.endsWith(`/${publicId}.webp`) || normalizedUrl.includes(`/${publicId}.`);
}

function dedupeUrls(urls: string[]) {
  return Array.from(new Set(urls));
}

export class UploadService {
  static async subirImagen(dto: SubirImagenDTO) {
    const servicio = await prisma.servicios.findUnique({
      where: {
        id_servicio: dto.id_servicio,
      },
      select: {
        id_servicio: true,
        url_foto: true,
        urls_fotos: true,
        fotos_focal: true,
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
    const nextUrlFoto =
      !servicio.url_foto || matchesPublicId(servicio.url_foto, publicId) ? result.url : servicio.url_foto;

    const focal =
      dto.focal_x != null && dto.focal_y != null
        ? normalizeFocal({ x: dto.focal_x, y: dto.focal_y })
        : { x: 0.5, y: 0.5 };

    const fotosFocal = setFotosFocalEntry(servicio.fotos_focal, result.public_id, focal);
    const isPrincipal = Boolean(nextUrlFoto && matchesPublicId(nextUrlFoto, result.public_id));

    await prisma.servicios.update({
      where: {
        id_servicio: dto.id_servicio,
      },
      data: {
        url_foto: dedupedUrls.length > 0 ? nextUrlFoto : null,
        urls_fotos: dedupedUrls,
        fotos_focal: fotosFocal,
        ...(isPrincipal
          ? {
              foto_focal_x: focal.x,
              foto_focal_y: focal.y,
            }
          : {}),
      },
    });

    return {
      ...result,
      focal_x: focal.x,
      focal_y: focal.y,
    };
  }

  static async actualizarFocal(dto: ActualizarFocalImagenDTO) {
    const servicio = await prisma.servicios.findUnique({
      where: { id_servicio: dto.id_servicio },
      select: {
        id_servicio: true,
        url_foto: true,
        urls_fotos: true,
        fotos_focal: true,
      },
    });

    if (!servicio) {
      throw new AppError("Servicio no encontrado", 404);
    }

    const belongs =
      (servicio.url_foto && matchesPublicId(servicio.url_foto, dto.public_id)) ||
      servicio.urls_fotos.some((url) => matchesPublicId(url, dto.public_id));

    if (!belongs) {
      throw new AppError("La imagen no pertenece a este servicio", 404);
    }

    const focal = normalizeFocal({ x: dto.focal_x, y: dto.focal_y });
    const fotosFocal = setFotosFocalEntry(servicio.fotos_focal, dto.public_id, focal);
    const isPrincipal = Boolean(servicio.url_foto && matchesPublicId(servicio.url_foto, dto.public_id));

    await prisma.servicios.update({
      where: { id_servicio: dto.id_servicio },
      data: {
        fotos_focal: fotosFocal,
        ...(isPrincipal
          ? {
              foto_focal_x: focal.x,
              foto_focal_y: focal.y,
            }
          : {}),
      },
    });

    return { public_id: dto.public_id, focal_x: focal.x, focal_y: focal.y };
  }

  static async eliminarImagen(public_id: string, id_servicio: number) {
    const servicio = await prisma.servicios.findUnique({
      where: {
        id_servicio,
      },
      select: {
        id_servicio: true,
        url_foto: true,
        urls_fotos: true,
        fotos_focal: true,
      },
    });

    if (!servicio) {
      throw new AppError("Servicio no encontrado", 404);
    }

    await storageAdapter.delete(public_id);

    const remainingUrls = servicio.urls_fotos.filter((url) => !matchesPublicId(url, public_id));
    const wasPrimaryDeleted = servicio.url_foto ? matchesPublicId(servicio.url_foto, public_id) : false;
    const nextPrimary = wasPrimaryDeleted ? (remainingUrls[0] ?? null) : servicio.url_foto;
    const fotosFocal = removeFotosFocalEntry(servicio.fotos_focal, public_id);

    let nextFocalX = 0.5;
    let nextFocalY = 0.5;
    if (nextPrimary) {
      const nextPublicId = publicIdFromImageUrl(nextPrimary);
      const map = parseFotosFocalMap(fotosFocal);
      if (nextPublicId && map[nextPublicId]) {
        nextFocalX = map[nextPublicId].x;
        nextFocalY = map[nextPublicId].y;
      }
    }

    await prisma.servicios.update({
      where: {
        id_servicio,
      },
      data: {
        url_foto: remainingUrls.length > 0 ? nextPrimary : null,
        urls_fotos: remainingUrls,
        fotos_focal: fotosFocal,
        foto_focal_x: remainingUrls.length > 0 ? nextFocalX : 0.5,
        foto_focal_y: remainingUrls.length > 0 ? nextFocalY : 0.5,
      },
    });
  }

  static async subirFotoCoordinador(dto: SubirFotoCoordinadorDTO) {
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

  static async eliminarFotoCoordinador(id_coordinador: number, options: EliminarFotoCoordinadorOptions = {}) {
    const coordinador = await prisma.coordinadores.findUnique({
      where: { id_coordinador },
      select: { id_coordinador: true, foto_public_id: true },
    });

    if (!coordinador) {
      throw new AppError("Coordinador no encontrado", 404);
    }

    if (!coordinador.foto_public_id) {
      if (options.skipNotFound) return;
      throw new AppError("El coordinador no tiene foto", 404);
    }

    await storageAdapter.delete(coordinador.foto_public_id);

    await prisma.coordinadores.update({
      where: { id_coordinador },
      data: { url_foto: null, foto_public_id: null },
    });
  }

  static async getFotoCoordinador(id_coordinador: number) {
    const coordinador = await prisma.coordinadores.findUnique({
      where: { id_coordinador },
      select: { url_foto: true, foto_public_id: true },
    });

    if (!coordinador) {
      throw new AppError("Coordinador no encontrado", 404);
    }

    return coordinador;
  }

  static async eliminarImagenesServicio(id_servicio: number) {
    const carpeta = servicioCarpeta(id_servicio);

    await storageAdapter.deleteFolder(carpeta);

    await prisma.servicios.update({
      where: {
        id_servicio,
      },
      data: {
        url_foto: null,
        urls_fotos: [],
        fotos_focal: {},
        foto_focal_x: 0.5,
        foto_focal_y: 0.5,
      },
    });
  }
}
