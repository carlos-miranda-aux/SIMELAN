import prisma from "../../src/PrismaClient.js";

export const getUsers = async ({ skip, take, search }) => {
  const whereClause = search ? {
    OR: [
      { nombre: { contains: search } },
      { correo: { contains: search } },
      { usuario_login: { contains: search } }
    ]
  } : {};

  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,
      include: { 
        area: {  // 👈 Incluimos Area y su Departamento
            include: { departamento: true }
        } 
      },
      skip: skip,
      take: take,
      orderBy: { nombre: 'asc' }
    }),
    prisma.user.count({ where: whereClause })
  ]);

  return { users, totalCount };
};

export const getAllUsers = () => prisma.user.findMany({
  select: { id: true, nombre: true },
  orderBy: { nombre: 'asc' }
});

export const getUserById = (id) => prisma.user.findUnique({
  where: { id: Number(id) },
  include: { 
    area: { include: { departamento: true } } 
  }
});

export const createUser = (data) => prisma.user.create({
  data: {
      ...data,
      areaId: data.areaId ? Number(data.areaId) : null // 👈 Usamos areaId
  },
});

export const updateUser = (id, data) => prisma.user.update({
  where: { id: Number(id) },
  data: {
      ...data,
      areaId: data.areaId ? Number(data.areaId) : null
  },
});

export const deleteUser = (id) => prisma.user.delete({
  where: { id: Number(id) },
});