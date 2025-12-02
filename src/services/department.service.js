// src/services/department.service.js
import prisma from "../../src/PrismaClient.js";
import * as auditService from "./audit.service.js"; // 👈 IMPORTAR

export const getDepartments = async ({ skip, take, sortBy, order }) => {
  const orderBy = sortBy ? { [sortBy]: order } : { nombre: 'asc' };
  const whereClause = { deletedAt: null };

  const [departments, totalCount] = await prisma.$transaction([
    prisma.department.findMany({
      where: whereClause,
      skip: skip,
      take: take,
      orderBy: orderBy
    }),
    prisma.department.count({ where: whereClause })
  ]);
  return { departments, totalCount };
};

export const getAllDepartments = () => prisma.department.findMany({
    where: { deletedAt: null },
    orderBy: { nombre: 'asc' }
});

export const getDepartmentById = (id) => prisma.department.findFirst({
  where: { id: Number(id), deletedAt: null },
});

export const createDepartment = async (data, user) => { // 👈 Recibe 'user'
  const newDept = await prisma.department.create({ data });

  // 📝 AUDITORÍA
  await auditService.logActivity({
      action: 'CREATE',
      entity: 'Department',
      entityId: newDept.id,
      newData: newDept,
      user: user,
      details: `Departamento creado: ${newDept.nombre}`
  });

  return newDept;
};

export const updateDepartment = async (id, data, user) => { // 👈 Recibe 'user'
  const deptId = Number(id);
  const oldDept = await prisma.department.findFirst({ where: { id: deptId } });

  const updatedDept = await prisma.department.update({
    where: { id: deptId },
    data,
  });

  // 📝 AUDITORÍA
  await auditService.logActivity({
      action: 'UPDATE',
      entity: 'Department',
      entityId: deptId,
      oldData: oldDept,
      newData: updatedDept,
      user: user,
      details: `Departamento actualizado`
  });

  return updatedDept;
};

export const deleteDepartment = async (id, user) => { // 👈 Recibe 'user'
  const deptId = Number(id);
  const oldDept = await prisma.department.findFirst({ where: { id: deptId } });

  const deleted = await prisma.department.update({
    where: { id: deptId },
    data: { deletedAt: new Date() }
  });

  // 📝 AUDITORÍA
  await auditService.logActivity({
      action: 'DELETE',
      entity: 'Department',
      entityId: deptId,
      oldData: oldDept,
      user: user,
      details: `Departamento eliminado`
  });

  return deleted;
};