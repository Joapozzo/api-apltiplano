import "dotenv/config";
import { validateEnv } from "./middlewares/env-validator.js";
import app from "./app.js";
import { prisma } from "./database/prisma.js";
import { logger } from "./services/logger.service.js";

// ==============================
// Validate environment variables at startup
// ==============================
validateEnv();

const PORT = parseInt(process.env.PORT || "3001", 10);

// ==============================
// Create HTTP server
// ==============================
const server = app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV }, `Server started on port ${PORT}`);
});

// ==============================
// Graceful shutdown
// ==============================
async function gracefulShutdown(signal: string) {
  logger.info({ signal }, `Received ${signal}. Starting graceful shutdown...`);

  // Give the server 10 seconds to stop accepting new connections
  // and finish handling existing ones
  const shutdownTimeout = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
  shutdownTimeout.unref();

  server.close(async (err) => {
    if (err) {
      logger.error({ err }, "Error closing HTTP server");
      process.exit(1);
    }

    logger.info("HTTP server closed");

    try {
      await prisma.$disconnect();
      logger.info("Database connection closed");
    } catch (dbErr) {
      logger.error({ err: dbErr }, "Error disconnecting database");
    }

    clearTimeout(shutdownTimeout);
    logger.info("Graceful shutdown completed");
    process.exit(0);
  });
}

// Handle termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught errors at the process level
process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught exception");
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled promise rejection");
});
