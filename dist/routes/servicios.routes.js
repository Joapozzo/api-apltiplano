import { Router } from "express";
import { ServiciosController } from "../controllers/servicios.controller.js";
const router = Router();
router.get("/", ServiciosController.getAll);
router.get("/active", ServiciosController.getActive);
router.post("/", ServiciosController.create);
router.get("/:id", ServiciosController.getById);
router.put("/:id", ServiciosController.update);
router.delete("/:id", ServiciosController.delete);
router.patch("/:id/toggle-activo", ServiciosController.toggleActivo);
router.patch("/:id/toggle-destacado", ServiciosController.toggleDestacado);
export default router;
//# sourceMappingURL=servicios.routes.js.map