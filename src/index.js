import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./PrismaClient.js";
import bcrypt from "bcryptjs";

// Importar rutas
import departmentRoutes from "./routes/department.routes.js";
import osRoutes from "./routes/operatingSystem.routes.js";
import deviceTypeRoutes from "./routes/deviceType.routes.js";
import deviceStatusRoutes from "./routes/deviceStatus.routes.js";
import userRoutes from "./routes/user.routes.js";
import devicesRoutes from "./routes/devices.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import disposalRoutes from "./routes/disposal.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// rutas
app.use("/api/departments", departmentRoutes);
app.use("/api/operating-systems", osRoutes);
app.use("/api/device-types", deviceTypeRoutes);
app.use("/api/device-status", deviceStatusRoutes);
app.use("/api/users", userRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/maintenances", maintenanceRoutes);
app.use("/api/disposals", disposalRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  try {
    await prisma.$connect();
    console.log("Conectado a la BD");

    // 🔹 Crear superusuario por defecto si no existe
    const superAdmin = await prisma.userSistema.findFirst({
      where: { username: "superadmin", rol: "ADMIN" }
    });

    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash("superadmin123", 10); // contraseña inicial
      const user = await prisma.userSistema.create({
        data: {
          username: "superadmin",
          email: "superadmin@crownparadise.com",
          password: hashedPassword,
          nombre: "Super Administrador",
          rol: "ADMIN",
        },
      });
      console.log("Superusuario creado:", user.username);
    } else {
      console.log("Superusuario ya existe:", superAdmin.username);
    }
  } catch (err) {
    console.error("Error al conectar a la DB o crear superusuario:", err);
  }
});
