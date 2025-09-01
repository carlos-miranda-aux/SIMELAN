// routes/disposal.routes.js
import { Router } from "express";
import { getDisposals, getDisposal, createDisposal } from "../controllers/disposal.controller.js";

const router = Router();

router.get("/get", getDisposals);            // Listar todas las bajas
router.get("/get/:id", getDisposal);        // Ver detalle de una baja
router.post("/post", createDisposal);       // Registrar una baja de equipo

export default router;
