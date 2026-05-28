import "dotenv/config";
import { validateEnv } from "../src/middlewares/env-validator.js";

validateEnv();

const { default: app } = await import("../src/app.js");

export default app;
