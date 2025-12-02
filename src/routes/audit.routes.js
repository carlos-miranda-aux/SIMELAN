// src/routes/audit.routes.js
import { Router } from "express";
import { getAuditLogs } from "../controllers/audit.controller.js";
import { verifyToken, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/audit -> Protegido solo para ADMIN
router.get("/", verifyToken, verifyRole(["ADMIN", "EDITOR"]), getAuditLogs);

export default router;