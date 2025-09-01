import prisma from "../../src/PrismaClient.js"

export const getDepartments = () => prisma.department.findMany();

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
