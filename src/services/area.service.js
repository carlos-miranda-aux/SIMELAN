// src/services/area.service.js
import prisma from "../../src/PrismaClient.js";
import * as auditService from "./audit.service.js"; // 👈 IMPORTAR

export const getAreas = async ({ skip, take, sortBy, order }) => {
  let orderBy = { nombre: 'asc' };
  
  if (sortBy) {
      if (sortBy.includes('.')) {
          const [relation, field] = sortBy.split('.');
          orderBy = { [relation]: { [field]: order } };
      } else {
          orderBy = { [sortBy]: order };
      }
  }

  const whereClause = { deletedAt: null };

  const [areas, totalCount] = await prisma.$transaction([
    prisma.area.findMany({
      where: whereClause,
      include: {
        departamento: true, 
      },
      skip: skip,
      take: take,
      orderBy: orderBy
    }),
    prisma.area.count({ where: whereClause })
  ]);

  return { areas, totalCount };
};

export const getAllAreas = () => {
  return prisma.area.findMany({
    where: { deletedAt: null },
    include: { departamento: true },
    orderBy: [
        { departamento: { nombre: 'asc' } },
        { nombre: 'asc' }
      ]
  });
};

export const getAreaById = (id) => prisma.area.findFirst({
    where: { 
        id: Number(id),
        deletedAt: null 
    },
    include: { departamento: true },
});

export const createArea = async (data, user) => { // 👈 Recibe 'user'
    const newArea = await prisma.area.create({
      data: {
        nombre: data.nombre,
        departamentoId: Number(data.departamentoId)
      }
    });

    // 📝 AUDITORÍA
    await auditService.logActivity({
        action: 'CREATE',
        entity: 'Area',
        entityId: newArea.id,
        newData: newArea,
        user: user,
        details: `Área creada: ${newArea.nombre}`
    });

    return newArea;
};

export const updateArea = async (id, data, user) => { // 👈 Recibe 'user'
    const areaId = Number(id);
    const oldArea = await prisma.area.findFirst({ where: { id: areaId } });

    const updatedArea = await prisma.area.update({
      where: { id: areaId },
      data: {
        nombre: data.nombre,
        departamentoId: Number(data.departamentoId)
      },
    });

    // 📝 AUDITORÍA
    await auditService.logActivity({
        action: 'UPDATE',
        entity: 'Area',
        entityId: areaId,
        oldData: oldArea,
        newData: updatedArea,
        user: user,
        details: `Área actualizada: ${updatedArea.nombre}`
    });

    return updatedArea;
};

export const deleteArea = async (id, user) => { // 👈 Recibe 'user'
    const areaId = Number(id);
    const oldArea = await prisma.area.findFirst({ where: { id: areaId } });

    const deleted = await prisma.area.update({ 
        where: { id: areaId },
        data: { deletedAt: new Date() }
    });

    // 📝 AUDITORÍA
    await auditService.logActivity({
        action: 'DELETE',
        entity: 'Area',
        entityId: areaId,
        oldData: oldArea,
        user: user,
        details: `Área eliminada (Soft Delete)`
    });

    return deleted;
};