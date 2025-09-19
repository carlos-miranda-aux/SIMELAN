import { Router } from "express";
import { register, login, deleteUser, updatePassword, getUsers } from "../controllers/auth.controller.js";
import { verifyToken, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas solo con token
router.get("/get", verifyToken, verifyRole(["EDITOR", "ADMIN"]), getUsers);
router.delete("/delete/:id", verifyToken, verifyRole(["ADMIN"]), deleteUser);
router.put("/put/:id/password", verifyToken, verifyRole(["USER", "EDITOR", "ADMIN"]), updatePassword);

export default router;
