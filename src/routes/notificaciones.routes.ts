import { Router } from "express";
import { NotificacionesController } from "../controllers/notificaciones.controller.js";

const router = Router();

router.get("/resumen", NotificacionesController.getResumen);
router.get("/", NotificacionesController.list);
router.patch("/:id/leida", NotificacionesController.marcarLeida);
router.patch("/marcar-todas-leidas", NotificacionesController.marcarTodasLeidas);
router.post("/sincronizar", NotificacionesController.sincronizar);

export default router;