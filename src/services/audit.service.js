// src/services/audit.service.js
import prisma from "../PrismaClient.js"

export const logAction = async (userId, action, resource, resourceId, oldData = null, newData = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        oldData: oldData ? JSON.stringify(oldData) : null,
        newData: newData ? JSON.stringify(newData) : null,
      },
    });
  } catch (error) {
    console.error("Error guardando en auditoría:", error);
  }
};
