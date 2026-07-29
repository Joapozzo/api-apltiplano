import { Router } from "express";
import { AdminNivelController } from "../controllers/admin-nivel.controller.js";

const router = Router();

router.get("/cuestionario", AdminNivelController.getCuestionario);
router.post("/preview", AdminNivelController.preview);
router.get("/evaluaciones", AdminNivelController.listEvaluaciones);
router.post("/recalcular-rangos", AdminNivelController.recalcularRangos);

router.post("/preguntas", AdminNivelController.createPregunta);
router.patch("/preguntas/:id", AdminNivelController.updatePregunta);

router.post("/preguntas/:idPregunta/opciones", AdminNivelController.createOpcion);
router.patch("/opciones/:id", AdminNivelController.updateOpcion);

export default router;
