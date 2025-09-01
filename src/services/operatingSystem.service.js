// src/services/operatingSystem.service.js
import prisma from "../PrismaClient.js";

export const getOperatingSystems = () =>
  prisma.operatingSystem.findMany();

export const getOperatingSystemById = (id) =>
  prisma.operatingSystem.findUnique({
    where: { id: Number(id) },
  });

export const createOperatingSystem = (data) =>
  prisma.operatingSystem.create({ data });

export const updateOperatingSystem = (id, data) =>
  prisma.operatingSystem.update({
    where: { id: Number(id) },
    data,
  });

export const deleteOperatingSystem = (id) =>
  prisma.operatingSystem.delete({
    where: { id: Number(id) },
  });
