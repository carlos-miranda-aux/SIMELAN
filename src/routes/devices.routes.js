import { Router } from "express";
import {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../controllers/device.controller.js";

const router = Router();

router.get("/get", getDevices);
router.get("/get/:id", getDevice);
router.post("/post", createDevice);
router.put("/put/:id", updateDevice);
router.delete("/delete/:id", deleteDevice);

export default router;
