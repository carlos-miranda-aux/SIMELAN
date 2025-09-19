import { Router } from "express";
import {
  getAuditLogs,
  getAuditLogsByUser,
  getAuditLogsByResource,
  getAuditLogsByDate
} from "../controllers/audit.controller.js";
import { verifyRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, verifyRole(["ADMIN", "EDITOR"]), getAuditLogs);
router.get("/user/:userId", verifyToken, verifyRole(["ADMIN", "EDITOR"]), getAuditLogsByUser);
router.get("/filter", verifyToken, verifyRole(["ADMIN", "EDITOR"]), getAuditLogsByResource); // /filter?resource=Maintenance&action=CREATE
router.get("/date", verifyToken, verifyRole(["ADMIN", "EDITOR"]), getAuditLogsByDate);       // /date?startDate=2025-09-01&endDate=2025-09-04

export default router;
