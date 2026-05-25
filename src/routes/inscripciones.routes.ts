import { Router } from "express";
import { InscripcionesController } from "../controllers/inscripciones.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { APP_ROLES } from "../types/auth.types.js";

const router = Router();

router.get("/validate-token/:token", InscripcionesController.validateToken);
router.post("/submit", InscripcionesController.submit);

router.use(authenticate, authorize(APP_ROLES.ADMIN));

router.post("/generate-link", InscripcionesController.generateLink);
router.get("/tokens", InscripcionesController.listTokens);
router.put("/tokens/:id/disable", InscripcionesController.disableToken);
router.get("/", InscripcionesController.list);
router.get("/:id", InscripcionesController.getById);
router.put("/:id", InscripcionesController.update);
router.post("/:id/reembolsar", InscripcionesController.reembolsar);
router.delete("/:id", InscripcionesController.delete);

export default router;
