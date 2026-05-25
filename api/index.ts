import "dotenv/config";
import { validateEnv } from "../src/middlewares/env-validator.js";
import app from "../src/app.js";

validateEnv();

export default app;
