// src/services/maintenance.service.js
import prisma from "../../src/PrismaClient.js";

// 👈 CORRECCIÓN: 'getMaintenances' ahora acepta 'where'
export const getMaintenances = async ({ skip, take, where, sortBy, order }) => {
  // Ordenamiento dinámico
  let orderBy = { fecha_programada: 'desc' };
  if (sortBy) {
      if (sortBy.includes('.')) {
          // Soporte para device.nombre_equipo
          const parts = sortBy.split('.');
          if(parts.length === 2) orderBy = { [parts[0]]: { [parts[1]]: order } };
          if(parts.length === 3) orderBy = { [parts[0]]: { [parts[1]]: { [parts[2]]: order } } };
      } else {
          orderBy = { [sortBy]: order };
      }
  }

  const [maintenances, totalCount] = await prisma.$transaction([
    prisma.maintenance.findMany({
      where: where,
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
      orderBy: orderBy // 👈 Usar dinámico
    }),
    prisma.maintenance.count({ where: where })
  ]);

  return { maintenances, totalCount };
};
// --- El resto de funciones (sin cambios) ---

export const getMaintenanceById = (id) =>
  prisma.maintenance.findUnique({
    where: { id: Number(id) },
    include: {
      device: { // La relación es Device -> Area -> Departamento
        include: {
          usuario: true,
          area: { // Usar la relación 'area'
            include: {
              departamento: true // Y luego incluir el departamento
            }
          },
          tipo: true,
        },
      },
    },
  });

export const createMaintenance = (data) =>
  prisma.maintenance.create({ data });

export const updateMaintenance = (id, data) =>
  prisma.maintenance.update({
    where: { id: Number(id) },
    data,
  });

export const deleteMaintenance = (id) =>
  prisma.maintenance.delete({
    where: { id: Number(id) },
  });