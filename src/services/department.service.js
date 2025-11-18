// src/services/department.service.js
import prisma from "../../src/PrismaClient.js"

export const getDepartments = async ({ skip, take }) => { // 👈 Paginado
  const [departments, totalCount] = await prisma.$transaction([
    prisma.department.findMany({
      skip: skip,
      take: take,
      orderBy: { nombre: 'asc' }
    }),
    prisma.department.count()
  ]);
  return { departments, totalCount };
};

export const getAllDepartments = () => prisma.department.findMany({ // 👈 Lista Completa
    orderBy: { nombre: 'asc' }
});

export const getDepartmentById = (id) => prisma.department.findUnique({
  where: { id: Number(id) },
});

export const createDepartment = (data) => prisma.department.create({ data });

export const updateDepartment = (id, data) => prisma.department.update({
  where: { id: Number(id) },
  data,
});

export const deleteDepartment = (id) => prisma.department.delete({
  where: { id: Number(id) },
});