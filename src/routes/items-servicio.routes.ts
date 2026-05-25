import { Router } from "express";
import { ItemsServicioController } from "../controllers/items-servicio.controller.js";

const router = Router();

router.get("/", ItemsServicioController.getAll);
router.get("/suggestions", ItemsServicioController.getSuggestions);
router.get("/:id", ItemsServicioController.getById);
router.post("/", ItemsServicioController.create);
router.put("/:id", ItemsServicioController.update);
router.delete("/:id", ItemsServicioController.delete);

export default router;
