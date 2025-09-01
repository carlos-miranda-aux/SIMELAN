import { Router } from "express";
import {
  getDeviceStatuses,
  getDeviceStatus,
  createDeviceStatus,
  updateDeviceStatus,
  deleteDeviceStatus,
} from "../controllers/deviceStatus.controller.js";

const router = Router();

router.get("/get", getDeviceStatuses);
router.get("/get/:id", getDeviceStatus);
router.post("/post", createDeviceStatus);
router.put("/put/:id", updateDeviceStatus);
router.delete("/delete/:id", deleteDeviceStatus);

export default router;
