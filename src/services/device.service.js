// services/device.service.js
import prisma from "../../src/PrismaClient.js";

export const getDevices = () =>
  prisma.device.findMany({
    include: {
      usuario: true,
      tipo: true,
      estado: true,
      sistema_operativo: true,
    },
  });

export const getDeviceById = (id) =>
  prisma.device.findUnique({
    where: { id: Number(id) },
    include: {
      usuario: true,
      tipo: true,
      estado: true,
      sistema_operativo: true,
    },
  });

// 📌 Nuevo: obtener solo dispositivos activos
export const getActiveDevices = () => 
  prisma.device.findMany({
    where: {
      estado: {
        NOT: {
          nombre: "Baja", // Filtra los que no tienen el estado "Baja"
        },
      },
    },
    include: {
      usuario: true,
      tipo: true,
      estado: true,
      sistema_operativo: true,
    },
  });


export const createDevice = (data) => prisma.device.create({ data });

export const deleteDevice = (id) =>
  prisma.device.delete({
    where: { id: Number(id) },
  });

export const getInactiveDevices = () =>
  prisma.device.findMany({
    where: {
      estado: {
        nombre: "Baja",
      },
    },
    include: {
      usuario: true,
      tipo: true,
      estado: true,
      sistema_operativo: true,
    },
  });

// Actualizar la función para incluir la fecha de baja
export const updateDevice = (id, data) =>
  prisma.device.update({
    where: { id: Number(id) },
    data,
  });