import { PrismaClient } from "@prisma/client";
// Crear una única instancia de PrismaClient
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
// Graceful shutdown is now handled in server.ts via server.close()
// These handlers serve as a fallback in case server.ts is bypassed (e.g., in tests)
process.on("beforeExit", async () => {
    await prisma.$disconnect();
});
export { prisma };
//# sourceMappingURL=prisma.js.map