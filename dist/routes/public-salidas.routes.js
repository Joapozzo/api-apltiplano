import { Router } from "express";
import { PublicSalidasController } from "../controllers/public-salidas.controller.js";
const router = Router();
router.get("/", PublicSalidasController.list);
router.get("/calendario", PublicSalidasController.calendario);
router.get("/:identificador", PublicSalidasController.getByIdentificador);
export default router;
//# sourceMappingURL=public-salidas.routes.js.map