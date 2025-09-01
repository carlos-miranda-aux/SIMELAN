import prisma from "../../src/PrismaClient.js";

export const getDeviceTypes = () => prisma.deviceType.findMany();

export const getDeviceTypeById = (id) =>
  prisma.deviceType.findUnique({
    where: { id: Number(id) },
  });

export const createDeviceType = (data) =>
  prisma.deviceType.create({ data });

export const updateDeviceType = (id, data) =>
  prisma.deviceType.update({
    where: { id: Number(id) },
    data,
  });

export const deleteDeviceType = (id) =>
  prisma.deviceType.delete({
    where: { id: Number(id) },
  });
