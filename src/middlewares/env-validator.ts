/**
 * Validates that all required environment variables are set at startup.
 * Call this function at the very beginning of server.ts before importing
 * modules that depend on these variables.
 */

const REQUIRED_VARS: { key: string; description: string }[] = [
  { key: "DATABASE_URL", description: "PostgreSQL connection string for Prisma" },
  { key: "JWT_SECRET", description: "Secret key for JWT token encryption (min 32 chars)" },
  { key: "CSRF_SECRET", description: "Secret key for CSRF token generation (min 32 chars)" },
  { key: "FIREBASE_PROJECT_ID", description: "Firebase project ID" },
  { key: "FIREBASE_CLIENT_EMAIL", description: "Firebase admin client email" },
  { key: "FIREBASE_PRIVATE_KEY", description: "Firebase admin private key" },
];

const WARN_VARS: { key: string; description: string }[] = [
  { key: "ENCRYPTION_KEY", description: "AES-256-GCM encryption key (64 hex chars). Falls back to plaintext if missing." },
  { key: "RESEND_API_KEY", description: "Resend API key for transactional emails. Emails are skipped if missing." },
  { key: "CLOUDINARY_CLOUD_NAME", description: "Cloudinary cloud name. Falls back to local storage." },
  { key: "CLOUDINARY_API_KEY", description: "Cloudinary API key." },
  { key: "CLOUDINARY_API_SECRET", description: "Cloudinary API secret." },
  { key: "ALLOWED_ORIGINS", description: "Comma-separated list of allowed CORS origins." },
  { key: "LOG_LEVEL", description: "Pino log level (trace, debug, info, warn, error, fatal)" },
];

export function validateEnv(): void {
  const missing: string[] = [];

  for (const { key, description } of REQUIRED_VARS) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      missing.push(`  - ${key}: ${description}`);
    }
  }

  if (missing.length > 0) {
    const message = [
      "FATAL: Missing required environment variables:",
      ...missing,
      "",
      "Please set them in your .env file or environment before starting the server.",
      "See env.example for a complete reference.",
    ].join("\n");
    console.error(message);
    process.exit(1);
  }

  // Warn about optional vars that are missing
  for (const { key, description } of WARN_VARS) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      console.warn(`[WARN] Environment variable ${key} is not set. ${description}`);
    }
  }

  // Validate ENCRYPTION_KEY length if present
  const encKey = process.env.ENCRYPTION_KEY;
  if (encKey && encKey.length !== 64) {
    console.warn(
      `[WARN] ENCRYPTION_KEY is set but has length ${encKey.length} (expected 64 hex chars). ` +
      "Encryption/decryption will fall back to plaintext. Use the crypto utility to generate a valid key."
    );
  }

  // Validate JWT_SECRET length (should be at least 32 chars for AES-256)
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    console.warn(
      `[WARN] JWT_SECRET is only ${jwtSecret.length} characters long. For AES-256-CBC encryption, ` +
      "it should be at least 32 characters. scrypt will generate a 32-byte key, but a stronger secret is recommended."
    );
  }

  // Validate CSRF_SECRET length
  const csrfSecret = process.env.CSRF_SECRET;
  if (csrfSecret && csrfSecret.length < 32) {
    console.warn(
      `[WARN] CSRF_SECRET is only ${csrfSecret.length} characters long. ` +
      "It should be at least 32 characters for adequate security."
    );
  }

  console.info("[ENV] All required environment variables are set.");
}
