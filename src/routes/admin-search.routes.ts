import { Router } from "express";
import { AdminSearchController } from "../controllers/admin-search.controller.js";

const router = Router();

router.get("/", AdminSearchController.search);

export default router;