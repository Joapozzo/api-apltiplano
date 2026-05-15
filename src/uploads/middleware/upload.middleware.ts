import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { AppError } from "../../utils/app-error.js";
import { validateMagicBytes } from "../../utils/validate-image.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const MIN_FILE_SIZE = 1024;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new AppError("Solo se permiten imágenes JPG, PNG o WEBP", 400));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export async function procesarImagen(buffer: Buffer, mimetype: string): Promise<Buffer> {
  if (!allowedMimeTypes.includes(mimetype)) {
    throw new AppError("Formato de imagen no soportado", 400);
  }

  validateMagicBytes(buffer, mimetype);

  return sharp(buffer)
    .resize({
      width: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();
}

export function uploadMiddleware(req: Request, res: Response, next: NextFunction) {
  upload.single("imagen")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(new AppError("La imagen supera el máximo permitido de 10MB", 400));
        return;
      }

      next(new AppError(error.message, 400));
      return;
    }

    if (error) {
      next(error);
      return;
    }

    if (!req.file) {
      next(new AppError("Debes enviar una imagen en el campo 'imagen'", 400));
      return;
    }

    if (req.file.size < MIN_FILE_SIZE) {
      next(new AppError("La imagen es demasiado pequeña (mínimo 1KB)", 400));
      return;
    }

    try {
      req.fileBuffer = await procesarImagen(req.file.buffer, req.file.mimetype);
      req.fileMimetype = "image/webp";
      next();
    } catch (processingError) {
      const message = processingError instanceof Error ? processingError.message : "Error al procesar la imagen";
      next(new AppError(message, 400));
    }
  });
}
