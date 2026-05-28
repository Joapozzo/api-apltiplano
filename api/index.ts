import "dotenv/config";

let app: Awaited<typeof import("../dist/app.js")>["default"];

if (process.env.VERCEL) {
  const { validateEnv } = await import("../dist/middlewares/env-validator.js");
  validateEnv();
  ({ default: app } = await import("../dist/app.js"));
} else {
  const { validateEnv } = await import("../src/middlewares/env-validator.js");
  validateEnv();
  ({ default: app } = await import("../src/app.js"));
}

export default app;
