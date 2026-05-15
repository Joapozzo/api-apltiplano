import { PrismaClient } from "@prisma/client";

// Crear una única instancia de PrismaClient
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

// Manejar desconexión al cerrar la aplicación
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// Manejar señales de terminación
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };
