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

export const createDevice = (data) => prisma.device.create({ data });

export const updateDevice = (id, data) =>
  prisma.device.update({
    where: { id: Number(id) },
    data,
  });

export const deleteDevice = (id) =>
  prisma.device.delete({
    where: { id: Number(id) },
  });
