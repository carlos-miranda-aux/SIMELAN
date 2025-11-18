// src/services/area.service.js
import prisma from "../../src/PrismaClient.js";

// PAGINATED function for table data
export const getAreas = async ({ skip, take }) => {
  const [areas, totalCount] = await prisma.$transaction([
    prisma.area.findMany({
      include: {
        departamento: true, 
      },
      skip: skip,
      take: take,
      orderBy: [
        { departamento: { nombre: 'asc' } },
        { nombre: 'asc' }
      ]
    }),
    prisma.area.count()
  ]);

  return { areas, totalCount };
};


// FULL LIST function for selectors in forms (no pagination applied)
export const getAllAreas = () => {
  return prisma.area.findMany({
    include: {
      departamento: true, 
    },
    orderBy: [
        { departamento: { nombre: 'asc' } },
        { nombre: 'asc' }
      ]
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