import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { APP_ROLES } from "../types/auth.types.js";
import { NotasCalendarioController } from "../controllers/notas-calendario.controller.js";
import { CalendarioController } from "../controllers/calendario.controller.js";
const router = Router();
router.use("/admin/calendario", authenticate, authorize(APP_ROLES.ADMIN));
router.get("/admin/calendario/notas", NotasCalendarioController.getNotas);
router.get("/admin/calendario/notas/mes/:anio/:mes", NotasCalendarioController.getNotasByMes);
router.get("/admin/calendario/notas/:id", NotasCalendarioController.getNotaById);
router.post("/admin/calendario/notas", NotasCalendarioController.createNota);
router.put("/admin/calendario/notas/:id", NotasCalendarioController.updateNota);
router.patch("/admin/calendario/notas/:id/toggle", NotasCalendarioController.toggleCompletada);
router.delete("/admin/calendario/notas/:id", NotasCalendarioController.deleteNota);
router.get("/admin/calendario/vista/:anio/:mes", CalendarioController.getVistaCalendario);
export default router;
//# sourceMappingURL=notas-calendario.routes.js.map