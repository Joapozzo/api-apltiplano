import { Router } from "express";
import { NivelController } from "../controllers/nivel.controller.js";

const router = Router();

router.get("/cuestionario", NivelController.getCuestionario);
router.post("/evaluar", NivelController.evaluar);

export default router;
