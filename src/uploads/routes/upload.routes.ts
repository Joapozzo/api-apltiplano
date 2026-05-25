import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { APP_ROLES } from "../../types/auth.types.js";
import { UploadController } from "../controllers/upload.controller.js";
import { rateLimitMiddleware, deleteRateLimitMiddleware } from "../middleware/rate-limit.middleware.js";
import { uploadAvatarMiddleware, uploadMiddleware } from "../middleware/upload.middleware.js";

const router = Router();

router.use("/admin/servicios/:id_servicio/imagenes", authenticate, authorize(APP_ROLES.ADMIN));
router.use("/admin/coordinadores/:id_coordinador/foto", authenticate, authorize(APP_ROLES.ADMIN));

router.post(
  "/admin/servicios/:id_servicio/imagenes",
  rateLimitMiddleware,
  uploadMiddleware,
  UploadController.subirImagen,
);
router.delete("/admin/servicios/:id_servicio/imagenes", deleteRateLimitMiddleware, UploadController.eliminarImagen);
router.get("/admin/servicios/:id_servicio/imagenes", UploadController.getImagenesServicio);

router.post(
  "/admin/coordinadores/:id_coordinador/foto",
  rateLimitMiddleware,
  uploadAvatarMiddleware,
  UploadController.subirFotoCoordinador,
);
router.delete(
  "/admin/coordinadores/:id_coordinador/foto",
  deleteRateLimitMiddleware,
  UploadController.eliminarFotoCoordinador,
);
router.get("/admin/coordinadores/:id_coordinador/foto", UploadController.getFotoCoordinador);

export default router;
