import { mkdir, rm, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { AppError } from "../../utils/app-error.js";
import type { StorageAdapter, UploadPayload, UploadResult } from "../types/upload.types.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const storageRoot = path.resolve(currentDir, "../../../storage");

function sanitizePublicId(publicId: string): string {
  const sanitized = publicId.replace(/\.\./g, "").replace(/[\\/]/g, "/");
  const normalized = path.normalize(sanitized).replace(/^(\.\.(\/|\\|$))+/, "");

  if (!normalized || normalized !== path.normalize(publicId.replace(/\.\./g, "")).replace(/^(\.\.(\/|\\|$))+/, "")) {
    const safe = normalized.replace(/[^a-zA-Z0-9_\-\/]/g, "");
    if (!safe) {
      throw new AppError("Identificador de imagen inválido", 400);
    }
    return safe;
  }

  return normalized;
}

function getFilePathFromPublicId(publicId: string) {
  const sanitized = sanitizePublicId(publicId);
  const resolved = path.resolve(storageRoot, `${sanitized}.webp`);

  if (!resolved.startsWith(path.resolve(storageRoot))) {
    throw new AppError("Identificador de imagen inválido", 400);
  }

  return resolved;
}

async function upload(payload: UploadPayload): Promise<UploadResult> {
  const metadata = await sharp(payload.buffer).metadata();
  const finalPublicId =
    payload.public_id ?? `${payload.carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const filePath = getFilePathFromPublicId(finalPublicId);

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, payload.buffer);

  const fileStats = await stat(filePath);

  return {
    url: `/storage/${finalPublicId}.webp`,
    public_id: finalPublicId,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    formato: "webp",
    bytes: Number(fileStats.size),
  };
}

async function deleteByPublicId(publicId: string): Promise<void> {
  const filePath = getFilePathFromPublicId(publicId);

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw new AppError("No se pudo eliminar la imagen local", 500);
    }
  }
}

async function deleteFolder(carpeta: string): Promise<void> {
  const sanitized = sanitizePublicId(carpeta);
  const folderPath = path.resolve(storageRoot, sanitized);

  if (!folderPath.startsWith(path.resolve(storageRoot))) {
    throw new AppError("Ruta de carpeta inválida", 400);
  }

  await rm(folderPath, { recursive: true, force: true });
}

export const localAdapter: StorageAdapter = {
  upload,
  delete: deleteByPublicId,
  deleteFolder,
};
