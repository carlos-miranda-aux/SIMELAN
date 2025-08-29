import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./PrismaClient.js"

import deviceRoutes from "./routes/devices.routes.js"; // ejemplo

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// rutas
app.use("/devices", deviceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

prisma.$connect()
  .then(() => console.log("Conectado a la BD"))
  .catch(err => console.log("Error en la conexion"))
