import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authLimiter } from "../middlewares/rate-limit.js";

const router = Router();

router.get("/csrf", AuthController.csrf);
router.post("/register", authLimiter, AuthController.register);
router.get("/me", authenticate, AuthController.me);

export default router;
