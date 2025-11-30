import prisma from "../../src/PrismaClient.js";

export const getDeviceTypes = async ({ skip, take, sortBy, order }) => {
  const orderBy = sortBy ? { [sortBy]: order } : { nombre: 'asc' };

  const [deviceTypes, totalCount] = await prisma.$transaction([
    prisma.deviceType.findMany({
      skip: skip,
      take: take,
      orderBy: orderBy
    }),
    prisma.deviceType.count()
  ]);
  return { deviceTypes, totalCount };
};

export const getAllDeviceTypes = () => {
    return prisma.deviceType.findMany({ orderBy: { nombre: 'asc' } });
};

export const getDeviceTypeById = (id) => prisma.deviceType.findUnique({ where: { id: Number(id) } });
export const createDeviceType = (data) => prisma.deviceType.create({ data });
export const updateDeviceType = (id, data) => prisma.deviceType.update({ where: { id: Number(id) }, data });
export const deleteDeviceType = (id) => prisma.deviceType.delete({ where: { id: Number(id) } });