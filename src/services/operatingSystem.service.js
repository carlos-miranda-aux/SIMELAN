import prisma from "../../src/PrismaClient.js";

// Paginado con ordenamiento
export const getOperatingSystems = async ({ skip, take, sortBy, order }) => {
  const orderBy = sortBy ? { [sortBy]: order } : { nombre: 'asc' };

  const [operatingSystems, totalCount] = await prisma.$transaction([
    prisma.operatingSystem.findMany({
      skip: skip,
      take: take,
      orderBy: orderBy
    }),
    prisma.operatingSystem.count()
  ]);
  return { operatingSystems, totalCount };
};

// Lista completa para selectores
export const getAllOperatingSystems = () => {
    return prisma.operatingSystem.findMany({
        orderBy: { nombre: 'asc' }
    });
};

export const getOperatingSystemById = (id) =>
  prisma.operatingSystem.findUnique({ where: { id: Number(id) } });

export const createOperatingSystem = (data) =>
  prisma.operatingSystem.create({ data });

export const updateOperatingSystem = (id, data) =>
  prisma.operatingSystem.update({ where: { id: Number(id) }, data });

export const deleteOperatingSystem = (id) =>
  prisma.operatingSystem.delete({ where: { id: Number(id) } });