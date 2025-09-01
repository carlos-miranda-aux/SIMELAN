import { Router } from "express";
import {
  getDeviceTypes,
  getDeviceType,
  createDeviceType,
  updateDeviceType,
  deleteDeviceType,
} from "../controllers/deviceType.controller.js";

const router = Router();

router.get("/get", getDeviceTypes);
router.get("/get/:id", getDeviceType);
router.post("/post", createDeviceType);
router.put("/put/:id", updateDeviceType);
router.delete("/delete/:id", deleteDeviceType);

export default router;
