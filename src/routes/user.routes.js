import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/get", getUsers);
router.get("/get/:id", getUser);
router.post("/post", createUser);
router.put("/put/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
