import { Router } from "express";
import publicServiciosRoutes from "./public-servicios.routes.js";
import publicSalidasRoutes from "./public-salidas.routes.js";

const router = Router();

router.use("/servicios", publicServiciosRoutes);
router.use("/salidas", publicSalidasRoutes);

export default router;
