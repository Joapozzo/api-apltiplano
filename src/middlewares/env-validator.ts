import { logger } from "../services/logger.service.js";

const REQUIRED_VARS: { key: string; description: string; minLength?: number }[] = [
  { key: "DATABASE_URL", description: "PostgreSQL connection string for Prisma" },
  { key: "JWT_SECRET", description: "Secret key for JWT token encryption (min 32 chars)", minLength: 32 },
  { key: "CSRF_SECRET", description: "Secret key for CSRF token HMAC signing (min 32 chars)", minLength: 32 },
  {
    key: "ENCRYPTION_KEY",
    description: "AES-256-GCM encryption key for sensitive user data (64 hex chars)",
    minLength: 64,
  },
  { key: "FIREBASE_PROJECT_ID", description: "Firebase project ID" },
  { key: "FIREBASE_CLIENT_EMAIL", description: "Firebase admin client email" },
  { key: "FIREBASE_PRIVATE_KEY", description: "Firebase admin private key" },
];

const WARN_VARS: { key: string; description: string }[] = [
  { key: "RESEND_API_KEY", description: "Resend API key for transactional emails. Emails are skipped if missing." },
  { key: "CLOUDINARY_CLOUD_NAME", description: "Cloudinary cloud name. Falls back to local storage." },
  { key: "CLOUDINARY_API_KEY", description: "Cloudinary API key." },
  { key: "CLOUDINARY_API_SECRET", description: "Cloudinary API secret." },
  { key: "ALLOWED_ORIGINS", description: "Comma-separated list of allowed CORS origins." },
  { key: "LOG_LEVEL", description: "Pino log level (trace, debug, info, warn, error, fatal)" },
];

export function validateEnv(): void {
  const missing: string[] = [];

  for (const { key, description, minLength } of REQUIRED_VARS) {
    const value = process.env[key];

    if (!value || value.trim() === "") {
      missing.push(`  - ${key}: ${description}`);
      continue;
    }

    if (minLength !== undefined && value.length < minLength) {
      missing.push(`  - ${key}: must be at least ${minLength} characters (got ${value.length})`);
    }
  }

  if (missing.length > 0) {
    const message = [
      "FATAL: Missing or invalid required environment variables:",
      ...missing,
      "",
      "Please set them in your .env file or environment before starting the server.",
      "See env.example for a complete reference.",
    ].join("\n");
    logger.error(message);
    process.exit(1);
  }

  // Warn about optional vars that are missing
  for (const { key, description } of WARN_VARS) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      logger.warn({ key }, `Environment variable ${key} is not set. ${description}`);
    }
  }

  logger.info("[ENV] All required environment variables are valid.");
}
