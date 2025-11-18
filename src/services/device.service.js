import prisma from "../../src/PrismaClient.js";

export const getActiveDevices = async ({ skip, take, search }) => {
  const whereClause = {
    estado: { NOT: { nombre: "Baja" } },
  };

  if (search) {
    whereClause.OR = [
      { etiqueta: { contains: search } },
      { nombre_equipo: { contains: search } },
      { numero_serie: { contains: search } },
      { marca: { contains: search } },
      { modelo: { contains: search } },
      { ip_equipo: { contains: search } },
    ];
  }

  const [devices, totalCount] = await prisma.$transaction([
    prisma.device.findMany({
      where: whereClause,
      include: {
        usuario: true,
        tipo: true,
        estado: true,
        sistema_operativo: true,
        maintenances: true,
        area: { include: { departamento: true } }, // 👈 Incluir Area y Depto
      },
      skip: skip,
      take: take,
      orderBy: { id: 'desc' }
    }),
    prisma.device.count({ where: whereClause }),
  ]);

  return { devices, totalCount };
};

export const getAllActiveDeviceNames = () =>
  prisma.device.findMany({
    where: { estado: { NOT: { nombre: "Baja" } } },
    select: {
      id: true,
      etiqueta: true,
      nombre_equipo: true,
      tipo: { select: { nombre: true } }
    },
    orderBy: { etiqueta: 'asc' }
  });

export const getInactiveDevices = async ({ skip, take, search }) => {
  const whereClause = {
    estado: { nombre: "Baja" },
  };

  if (search) {
    whereClause.AND = {
      OR: [
        { etiqueta: { contains: search } },
        { nombre_equipo: { contains: search } },
        { numero_serie: { contains: search } },
        { motivo_baja: { contains: search } },
      ]
    };
  }
  
  const [devices, totalCount] = await prisma.$transaction([
    prisma.device.findMany({
      where: whereClause,
      include: {
        usuario: true,
        tipo: true,
        estado: true,
        sistema_operativo: true,
        area: { include: { departamento: true } }, // 👈 Incluir Area y Depto
      },
      skip: skip,
      take: take,
      orderBy: { fecha_baja: 'desc' }
    }),
    prisma.device.count({ where: whereClause }),
  ]);
  
  return { devices, totalCount };
};

export const getDeviceById = (id) =>
  prisma.device.findUnique({
    where: { id: Number(id) },
    include: {
      usuario: true,
      tipo: true,
      estado: true,
      sistema_operativo: true,
      area: { include: { departamento: true } }, // 👈 Incluir
    },
  });

export const createDevice = (data) => prisma.device.create({ data });

export const deleteDevice = (id) =>
  prisma.device.delete({ where: { id: Number(id) } });

export const updateDevice = (id, data) =>
  prisma.device.update({ where: { id: Number(id) }, data });