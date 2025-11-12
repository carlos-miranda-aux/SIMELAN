import prisma from "../../src/PrismaClient.js";

export const getMaintenances = () =>
  prisma.maintenance.findMany({
    include: { device: true },
  });

  export const getMaintenanceById = (id) =>
  prisma.maintenance.findUnique({
    where: { id: Number(id) },
    include: {
      // Incluir el dispositivo...
      device: {
        // ...y del dispositivo, incluir sus relaciones
        include: {
          usuario: true,
          departamento: true,
          tipo: true,
        },
      },
    },
  });

export const createMaintenance = (data) =>
  prisma.maintenance.create({ data });

export const updateMaintenance = (id, data) =>
  prisma.maintenance.update({
    where: { id: Number(id) },
    data,
  });

export const deleteMaintenance = (id) =>
  prisma.maintenance.delete({
    where: { id: Number(id) },
  });

  