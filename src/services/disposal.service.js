// services/disposal.service.js
import prisma from "../../src/PrismaClient.js";

export const getDisposals = () => prisma.disposal.findMany({
  include: { device: true } // para traer info del equipo dado de baja
});

export const getDisposal = (id) => prisma.disposal.findUnique({
  where: { id: Number(id) },
  include: { device: true }
});

export const createDisposal = (data) => prisma.disposal.create({
  data,
});
