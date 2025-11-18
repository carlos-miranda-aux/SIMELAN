import prisma from "../PrismaClient.js";

export const getAreas = () => {
  return prisma.area.findMany({
    include: {
      departamento: true, // Para ver a qué depto pertenece
    },
    orderBy: {
      departamento: { nombre: 'asc' }
    }
  });
};

export const getAreaById = (id) =>
  prisma.area.findUnique({
    where: { id: Number(id) },
    include: { departamento: true },
  });

export const createArea = (data) =>
  prisma.area.create({
    data: {
      nombre: data.nombre,
      departamentoId: Number(data.departamentoId)
    }
  });

export const updateArea = (id, data) =>
  prisma.area.update({
    where: { id: Number(id) },
    data: {
      nombre: data.nombre,
      departamentoId: Number(data.departamentoId)
    },
  });

export const deleteArea = (id) =>
  prisma.area.delete({
    where: { id: Number(id) },
  });