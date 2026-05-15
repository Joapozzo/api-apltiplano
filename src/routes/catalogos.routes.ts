import { Router } from "express";
import { CatalogosController } from "../controllers/catalogos.controller.js";

const router = Router();

router.get("/", CatalogosController.getAll);
router.get("/lugares", CatalogosController.getLugares);
router.post("/lugares", CatalogosController.createLugar);
router.get("/actividades", CatalogosController.getActividades);
router.post("/actividades", CatalogosController.createActividad);
router.get("/dificultades", CatalogosController.getDificultades);

export default router;

