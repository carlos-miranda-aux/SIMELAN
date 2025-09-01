import prisma from "../../src/PrismaClient.js";

export const getDeviceStatuses = () => prisma.deviceStatus.findMany();

export const getDeviceStatusById = (id) =>
  prisma.deviceStatus.findUnique({
    where: { id: Number(id) },
  });

export const createDeviceStatus = (data) =>
  prisma.deviceStatus.create({ data });

export const updateDeviceStatus = (id, data) =>
  prisma.deviceStatus.update({
    where: { id: Number(id) },
    data,
  });

export const deleteDeviceStatus = (id) =>
  prisma.deviceStatus.delete({
    where: { id: Number(id) },
  });
