// src/routes/operatingSystem.routes.js
import { Router } from "express";
import {
  getOperatingSystems,
  getOperatingSystem,
  createOperatingSystem,
  updateOperatingSystem,
  deleteOperatingSystem
} from "../controllers/operatingSystem.controller.js"; // 👈 Nombres corregidos
import { verifyRole, verifyToken } from "../middlewares/auth.middleware.js"

const router = Router();

router.get("/get", verifyToken, verifyRole(["ADMIN", "EDITOR", "USER"]), getOperatingSystems);
router.get("/get/:id", verifyToken, verifyRole(["ADMIN", "EDITOR", "USER"]), getOperatingSystem);
router.post("/post", verifyToken, verifyRole(["ADMIN", "EDITOR"]), createOperatingSystem);
router.put("/put/:id", verifyToken, verifyRole(["ADMIN", "EDITOR"]), updateOperatingSystem);
router.delete("/delete/:id", verifyToken, verifyRole(["ADMIN"]), deleteOperatingSystem);

export default router;