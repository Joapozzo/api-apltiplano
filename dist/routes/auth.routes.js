import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
const router = Router();
router.post("/register", AuthController.register);
router.get("/me", authenticate, AuthController.me);
export default router;
//# sourceMappingURL=auth.routes.js.map