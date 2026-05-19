import { Router } from "express";
import { CatalogosController } from "../controllers/catalogos.controller.js";

const router = Router();

// Catálogo completo (para formularios)
router.get("/", CatalogosController.getAll);

// ============ UBICACIONES ============
router.get("/ubicaciones", CatalogosController.getUbicaciones);
router.get("/ubicaciones/:id", CatalogosController.getUbicacionById);
router.post("/ubicaciones", CatalogosController.createUbicacion);
router.patch("/ubicaciones/:id", CatalogosController.updateUbicacion);
router.patch("/ubicaciones/:id/activo", CatalogosController.toggleUbicacionActivo);
router.delete("/ubicaciones/:id", CatalogosController.deleteUbicacion);

// ============ LUGARES ============
router.get("/lugares", CatalogosController.getLugares);
router.get("/lugares/:id", CatalogosController.getLugarById);
router.post("/lugares", CatalogosController.createLugar);
router.patch("/lugares/:id", CatalogosController.updateLugar);
router.patch("/lugares/:id/activo", CatalogosController.toggleLugarActivo);
router.delete("/lugares/:id", CatalogosController.deleteLugar);

// ============ ACTIVIDADES ============
router.get("/actividades", CatalogosController.getActividades);
router.get("/actividades/:id", CatalogosController.getActividadById);
router.post("/actividades", CatalogosController.createActividad);
router.patch("/actividades/:id", CatalogosController.updateActividad);
router.patch("/actividades/:id/activo", CatalogosController.toggleActividadActivo);
router.delete("/actividades/:id", CatalogosController.deleteActividad);

// ============ DIFICULTADES ============
router.get("/dificultades", CatalogosController.getDificultades);
router.get("/dificultades/:id", CatalogosController.getDificultadById);
router.post("/dificultades", CatalogosController.createDificultad);
router.patch("/dificultades/:id", CatalogosController.updateDificultad);
router.patch("/dificultades/:id/activo", CatalogosController.toggleDificultadActivo);
router.delete("/dificultades/:id", CatalogosController.deleteDificultad);

export default router;