import { Router } from "express";
import {
  getMaintenances,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/maintenance.controller.js";

const router = Router();

router.get("/get", getMaintenances);
router.get("/get/:id", getMaintenance);
router.post("/post", createMaintenance);
router.put("/put/:id", updateMaintenance);
router.delete("/delete/:id", deleteMaintenance);

export default router;
