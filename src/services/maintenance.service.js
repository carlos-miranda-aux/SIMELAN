// src/services/maintenance.service.js
import prisma from "../../src/PrismaClient.js";
import * as auditService from "./audit.service.js"; // 👈 IMPORTAR

export const getMaintenances = async ({ skip, take, where, sortBy, order }) => {
  const finalWhere = {
    ...where,
    deletedAt: null
  };

  let orderBy = { fecha_programada: 'desc' };
  if (sortBy) {
    if (sortBy.includes('.')) {
      const parts = sortBy.split('.');
      if (parts.length === 2) orderBy = { [parts[0]]: { [parts[1]]: order } };
      if (parts.length === 3) orderBy = { [parts[0]]: { [parts[1]]: { [parts[2]]: order } } };
    } else {
      orderBy = { [sortBy]: order };
    }
  }

  const [maintenances, totalCount] = await prisma.$transaction([
    prisma.maintenance.findMany({
      where: finalWhere,
      include: {
        device: {
          select: {
            id: true, etiqueta: true, nombre_equipo: true, numero_serie: true, ip_equipo: true,
            usuario: { select: { nombre: true, usuario_login: true } },
            area: { select: { nombre: true, departamento: { select: { nombre: true } } } }
          }
        }
      },
      skip: skip,
      take: take,
      orderBy: orderBy
    }),
    prisma.maintenance.count({ where: finalWhere })
  ]);

  return { maintenances, totalCount };
};

export const getMaintenanceById = (id) =>
  prisma.maintenance.findFirst({
    where: {
      id: Number(id),
      deletedAt: null
    },
    include: {
      device: {
        include: {
          usuario: true,
          area: {
            include: {
              departamento: true
            }
          },
          tipo: true,
        },
      },
    },
  });

export const createMaintenance = async (data, user) => {
  const newManto = await prisma.maintenance.create({ data });

  // 📝 REGISTRAR
  await auditService.logActivity({
    action: 'CREATE',
    entity: 'Maintenance',
    entityId: newManto.id,
    newData: newManto,
    user: user,
    details: `Mantenimiento programado para equipo ID: ${newManto.deviceId}`
  });

  return newManto;
};

export const updateMaintenance = async (id, data, user) => {
  const mantoId = Number(id);
  const oldManto = await prisma.maintenance.findFirst({ where: { id: mantoId } });

  const updatedManto = await prisma.maintenance.update({
    where: { id: mantoId },
    data,
  });

  let details = "Actualización de mantenimiento";
  if (oldManto.estado !== 'realizado' && updatedManto.estado === 'realizado') {
    details = "Mantenimiento COMPLETADO";
  }

  // 📝 REGISTRAR
  await auditService.logActivity({
    action: 'UPDATE',
    entity: 'Maintenance',
    entityId: mantoId,
    oldData: oldManto,
    newData: updatedManto,
    user: user,
    details: details
  });

  return updatedManto;
};

export const deleteMaintenance = async (id, user) => {
  const mantoId = Number(id);
  const oldManto = await prisma.maintenance.findFirst({ where: { id: mantoId } });

  const deleted = await prisma.maintenance.update({
    where: { id: mantoId },
    data: { deletedAt: new Date() }
  });

  // 📝 REGISTRAR
  await auditService.logActivity({
    action: 'DELETE',
    entity: 'Maintenance',
    entityId: mantoId,
    oldData: oldManto,
    user: user,
    details: "Mantenimiento eliminado"
  });

  return deleted;
};