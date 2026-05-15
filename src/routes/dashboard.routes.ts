import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { APP_ROLES } from "../types/auth.types.js";

const router = Router();

router.use("/admin/dashboard", authenticate, authorize(APP_ROLES.ADMIN));

router.get("/admin/dashboard/resumen", DashboardController.getResumen);
router.get("/admin/dashboard/actividad", DashboardController.getActividad);
router.get("/admin/dashboard/alertas", DashboardController.getAlertas);

export default router;
