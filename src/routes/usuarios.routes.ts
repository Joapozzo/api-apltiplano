import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.controller.js";
import { authorize } from "../middlewares/authorize.js";
import { APP_ROLES } from "../types/auth.types.js";

const router = Router();

router.get("/me", UsuariosController.getMe);
router.patch("/me", UsuariosController.updateMe);

router.get("/", authorize(APP_ROLES.ADMIN), UsuariosController.getAll);
router.get("/:id", authorize(APP_ROLES.ADMIN), UsuariosController.getById);
router.post("/", authorize(APP_ROLES.ADMIN), UsuariosController.create);
router.patch("/:id", authorize(APP_ROLES.ADMIN), UsuariosController.update);
router.patch("/:id/activo", authorize(APP_ROLES.ADMIN), UsuariosController.updateActivo);
router.patch("/:id/rol", authorize(APP_ROLES.ADMIN), UsuariosController.updateRol);

export default router;
