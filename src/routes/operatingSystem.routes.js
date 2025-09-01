// src/routes/operatingSystem.routes.js
import { Router } from "express";
import {
  getOperatingSystemsController,
  getOperatingSystemController,
  createOperatingSystemController,
  updateOperatingSystemController,
  deleteOperatingSystemController
} from "../controllers/operatingSystem.controller.js";

const router = Router();

router.get("/get", getOperatingSystemsController);
router.get("/getAll/:id", getOperatingSystemController);
router.post("/post", createOperatingSystemController);
router.put("/put/:id", updateOperatingSystemController);
router.delete("/delete/:id", deleteOperatingSystemController);

export default router;
