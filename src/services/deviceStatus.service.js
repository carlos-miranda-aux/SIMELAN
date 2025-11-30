import prisma from "../../src/PrismaClient.js";

export const getDeviceStatuses = async ({ skip, take, sortBy, order }) => {
  const orderBy = sortBy ? { [sortBy]: order } : { nombre: 'asc' };

  const [deviceStatuses, totalCount] = await prisma.$transaction([
    prisma.deviceStatus.findMany({
      skip: skip,
      take: take,
      orderBy: orderBy
    }),
    prisma.deviceStatus.count()
  ]);
  return { deviceStatuses, totalCount };
};

export const getAllDeviceStatuses = () => {
    return prisma.deviceStatus.findMany({ orderBy: { nombre: 'asc' } });
};

export const getDeviceStatusById = (id) => prisma.deviceStatus.findUnique({ where: { id: Number(id) } });
export const createDeviceStatus = (data) => prisma.deviceStatus.create({ data });
export const updateDeviceStatus = (id, data) => prisma.deviceStatus.update({ where: { id: Number(id) }, data });
export const deleteDeviceStatus = (id) => prisma.deviceStatus.delete({ where: { id: Number(id) } });