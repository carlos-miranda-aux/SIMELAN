import express from "express";
import prisma from "../PrismaClient.js";

const router = express.Router();

// GET /devices -> lista todos los equipos
router.get("/", async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        usuario: true, // Esto funciona porque en el modelo Device tienes `usuario User?`
      },
    });
    res.json(devices);
  } catch (error) {
    console.error("❌ Error en /devices:", error); // 👈 imprime el error real
    res.status(500).json({ error: "Error al obtener los dispositivos" });
  }
});

export default router;
