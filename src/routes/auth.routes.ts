import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.get("/csrf", AuthController.csrf);
router.post("/register", AuthController.register);
router.get("/me", authenticate, AuthController.me);

export default router;
