import { AppError } from "./app-error.js";

const PRISMA_INTERNAL_MESSAGE_PATTERNS = [
  /^Invalid `prisma\./,
  /Unknown argument/,
  /PrismaClient/,
  /invocation in/,
  /Timed out trying to acquire a postgres advisory lock/,
];

export const GENERIC_SERVER_ERROR =
  "No se pudo completar la operación. Intentá de nuevo en unos minutos.";

export function isPrismaInternalError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;

  const name = (err as Error).name ?? "";
  if (
    name === "PrismaClientValidationError" ||
    name === "PrismaClientInitializationError" ||
    name === "PrismaClientRustPanicError"
  ) {
    return true;
  }

  const message = (err as Error).message ?? "";
  return PRISMA_INTERNAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

export function toSafeAppError(
  err: unknown,
  userMessage = GENERIC_SERVER_ERROR,
  statusCode = 500,
): AppError {
  if (err instanceof AppError) return err;
  return new AppError(userMessage, statusCode);
}

export function rethrowAsSafeAppError(
  err: unknown,
  userMessage = GENERIC_SERVER_ERROR,
  statusCode = 500,
): never {
  if (err instanceof AppError) throw err;
  if (isPrismaInternalError(err)) {
    throw new AppError(userMessage, statusCode);
  }
  throw err;
}
