import prisma from "../../src/PrismaClient.js";

// Paginado con orden dinámico
export const getAreas = async ({ skip, take, sortBy, order }) => {
  let orderBy = { nombre: 'asc' };
  
  if (sortBy) {
      if (sortBy.includes('.')) {
          // Soporte para 'departamento.nombre'
          const [relation, field] = sortBy.split('.');
          orderBy = { [relation]: { [field]: order } };
      } else {
          orderBy = { [sortBy]: order };
      }
  }

  const [areas, totalCount] = await prisma.$transaction([
    prisma.area.findMany({
      include: {
        departamento: true, 
      },
      skip: skip,
      take: take,
      orderBy: orderBy
    }),
    prisma.area.count()
  ]);

  return { areas, totalCount };
};

// Lista completa (para selectores)
export const getAllAreas = () => {
  return prisma.area.findMany({
    include: { departamento: true },
    orderBy: [
        { departamento: { nombre: 'asc' } },
        { nombre: 'asc' }
      ]
  });
};

export const getAreaById = (id) => prisma.area.findUnique({
    where: { id: Number(id) },
    include: { departamento: true },
});

export const createArea = (data) => prisma.area.create({
    data: {
      nombre: data.nombre,
      departamentoId: Number(data.departamentoId)
    }
});

export const updateArea = (id, data) => prisma.area.update({
    where: { id: Number(id) },
    data: {
      nombre: data.nombre,
      departamentoId: Number(data.departamentoId)
    },
});

export const deleteArea = (id) => prisma.area.delete({ where: { id: Number(id) } });