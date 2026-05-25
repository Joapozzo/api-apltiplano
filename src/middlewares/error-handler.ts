import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { logger } from "../services/logger.service.js";

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  logger.error(
    {
      err,
      type: err.constructor?.name ?? typeof err,
      message: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    },
    "Unhandled error"
  );

  // Handle known AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    res.status(400).json({
      success: false,
      error: "Error de validación",
      details: (err as any).issues ?? (err as any).errors,
    });
    return;
  }

  // Handle Multer errors (file upload size, etc.)
  if (err.name === "MulterError") {
    const multerErr = err as any;
    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE: "El archivo excede el tamaño máximo permitido",
      LIMIT_FILE_COUNT: "Demasiados archivos",
      LIMIT_UNEXPECTED_FILE: "Tipo de archivo no esperado",
      LIMIT_FIELD_KEY: "Nombre de campo inválido",
      LIMIT_FIELD_VALUE: "Valor de campo demasiado largo",
      LIMIT_FIELD_COUNT: "Demasiados campos",
      LIMIT_PART_COUNT: "Demasiadas partes en el formulario",
    };
    res.status(400).json({
      success: false,
      error: messages[multerErr.code] ?? "Error al subir archivo",
    });
    return;
  }

  // Handle Prisma known errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as any;
    // P2002 = unique constraint violation
    if (prismaErr.code === "P2002") {
      res.status(409).json({
        success: false,
        error: "Ya existe un registro con ese valor único",
      });
      return;
    }
    // P2025 = record not found
    if (prismaErr.code === "P2025") {
      res.status(404).json({
        success: false,
        error: "Registro no encontrado",
      });
      return;
    }
  }

  // Handle JSON parse errors
  if ((err as any).type === "entity.parse.failed") {
    res.status(400).json({
      success: false,
      error: "JSON inválido en el cuerpo de la solicitud",
    });
    return;
  }

  // Fallback: 500 Internal Server Error
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message || "Error interno del servidor",
  });
}

/**
 * Wrapper for async route handlers to catch rejected promises
 * and forward them to the error handler middleware.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
