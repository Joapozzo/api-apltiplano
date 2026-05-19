import { Router } from "express";
import { ConfigController } from "../controllers/config.controller.js";

const router = Router();

router.get("/sistema", ConfigController.getAll);
router.get("/sistema/:clave", ConfigController.getByClave);
router.patch("/sistema/:clave", ConfigController.set);
router.patch("/sistema", ConfigController.setBatch);

export default router;