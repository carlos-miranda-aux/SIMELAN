// src/services/audit.service.js
import prisma from "../PrismaClient.js";

/**
 * Registra una acción en la bitácora de auditoría.
 * @param {Object} params
 * @param {string} params.action - Tipo de acción: 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'UNAUTHORIZED_ACCESS', etc.
 * @param {string} params.entity - Nombre de la entidad: 'Device', 'User', 'Maintenance', 'Security'.
 * @param {number} params.entityId - ID del registro afectado (puede ser 0 para eventos generales).
 * @param {Object} [params.oldData] - Objeto con los datos anteriores.
 * @param {Object} [params.newData] - Objeto con los datos nuevos.
 * @param {Object} [params.user] - El objeto req.user (id, username, rol).
 * @param {string} [params.details] - Detalle opcional en texto.
 */
export const logActivity = async ({
  action,
  entity,
  entityId,
  oldData = null,
  newData = null,
  user = null,
  details = null
}) => {
  try {
    // CORRECCIÓN: Definimos acciones que pueden no tener un ID de entidad específico (o ser 0)
    const actionsWithoutId = ['LOGIN_FAIL', 'UNAUTHORIZED_ACCESS', 'IMPORT'];
    
    // Si no hay ID (null/undefined) y la acción NO está en la lista blanca, no guardamos nada para evitar basura.
    // Pero si la acción ES 'UNAUTHORIZED_ACCESS', pasará esta validación.
    if ((entityId === null || entityId === undefined) && !actionsWithoutId.includes(action)) {
        return;
    }

    await prisma.auditLog.create({
      data: {
        action,
        entity,
        // Si viene un ID válido (incluido el 0) lo usamos, si no, ponemos 0 por defecto para evitar errores de SQL
        entityId: (entityId !== null && entityId !== undefined) ? Number(entityId) : 0, 
        
        // Convertimos a JSON puro para limpiar metadatos de Prisma que a veces causan error
        oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : undefined, 
        newData: newData ? JSON.parse(JSON.stringify(newData)) : undefined,
        
        userId: user ? Number(user.id) : null,
        details: details || null,
      }
    });
  } catch (error) {
    // Solo logueamos el error en consola para no interrumpir el flujo principal del usuario
    console.error("⚠️ Error al registrar auditoría:", error.message);
  }
};

/**
 * Obtiene los logs paginados con filtros opcionales
 */
export const getAuditLogs = async ({ skip, take, entity, userId }) => {
  const where = {};
  
  // Filtros dinámicos
  if (entity) where.entity = entity;
  if (userId) where.userId = Number(userId);

  const [logs, totalCount] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' }, // Los más recientes primero
      include: {
        user: {
          select: { username: true, nombre: true, rol: true } // Solo traemos datos necesarios del usuario
        }
      }
    }),
    prisma.auditLog.count({ where })
  ]);

  return { logs, totalCount };
};