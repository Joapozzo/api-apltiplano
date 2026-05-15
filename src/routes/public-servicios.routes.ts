import { Router } from "express";
import { PublicServiciosController } from "../controllers/public-servicios.controller.js";

const router = Router();

router.get("/", PublicServiciosController.list);
router.get("/:identificador", PublicServiciosController.getByIdentificador);

export default router;
