import { Router } from "express";
import {
  getAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea
} from "../controllers/area.controller.js";
import { verifyRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/get", verifyToken, verifyRole(["ADMIN", "EDITOR", "USER"]), getAreas);
router.get("/get/:id", verifyToken, verifyRole(["ADMIN", "EDITOR", "USER"]), getArea);
router.post("/post", verifyToken, verifyRole(["ADMIN", "EDITOR"]), createArea);
router.put("/put/:id", verifyToken, verifyRole(["ADMIN", "EDITOR"]), updateArea);
router.delete("/delete/:id", verifyToken, verifyRole(["ADMIN"]), deleteArea);

export default router;