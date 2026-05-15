import { Router } from "express";
import { ExpedicionesController } from "../controllers/expediciones.controller.js";

const router = Router();

// GET endpoints
router.get("/", ExpedicionesController.getAll);
router.get("/active", ExpedicionesController.getActive);
router.get("/:id", ExpedicionesController.getById);

// POST endpoint - crear
router.post("/", ExpedicionesController.create);

// PUT endpoint - actualizar
router.put("/:id", ExpedicionesController.update);

// DELETE endpoint - eliminar
router.delete("/:id", ExpedicionesController.delete);

// PATCH endpoints
router.patch("/:id/estado", ExpedicionesController.changeEstado);
router.patch("/:id/recalcular-cupos", ExpedicionesController.recalcularCupos);

export default router;
