#!/usr/bin/env node

/**
 * Generates secure random values for ENCRYPTION_KEY, JWT_SECRET, and CSRF_SECRET.
 *
 * Usage: node scripts/generate-secrets.mjs
 * Output: Ready-to-copy .env snippet
 */

import crypto from "node:crypto";

const secrets = {
  JWT_SECRET: crypto.randomBytes(32).toString("hex"),
  CSRF_SECRET: crypto.randomBytes(32).toString("hex"),
  ENCRYPTION_KEY: crypto.randomBytes(32).toString("hex"),
};

console.log("# === Generated Secrets (copy to .env) ===\n");
console.log(`JWT_SECRET="${secrets.JWT_SECRET}"`);
console.log(`CSRF_SECRET="${secrets.CSRF_SECRET}"`);
console.log(`ENCRYPTION_KEY="${secrets.ENCRYPTION_KEY}"`);
console.log("\n# These values are 64 hex characters each (256 bits).");
console.log("# Store them securely and NEVER commit them to git.");
