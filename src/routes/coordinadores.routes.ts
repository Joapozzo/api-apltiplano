import { Router } from "express";
import { CoordinadoresController } from "../controllers/coordinadores.controller.js";

const router = Router();

router.get("/", CoordinadoresController.list);
router.get("/:id", CoordinadoresController.getById);
router.post("/", CoordinadoresController.create);
router.put("/:id", CoordinadoresController.update);
router.delete("/:id", CoordinadoresController.delete);
router.post("/:id/asignar", CoordinadoresController.asignarAExpedicion);
router.delete("/:id/desasignar/:id_expedicion", CoordinadoresController.desasignarDeExpedicion);
router.get("/:id/historial", CoordinadoresController.getHistorial);

export default router;
