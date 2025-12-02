// src/services/user.service.js
import prisma from "../../src/PrismaClient.js";
import ExcelJS from "exceljs";
import * as auditService from "./audit.service.js"; // 👈 IMPORTAR

// =====================================================================
// SECCIÓN 1: FUNCIONES CRUD ESTÁNDAR
// =====================================================================

export const getUsers = async ({ skip, take, search, sortBy, order }) => {
  const whereClause = {
    deletedAt: null // 👈 Soft Delete
  };

  if (search) {
    whereClause.OR = [
      { nombre: { contains: search } },
      { correo: { contains: search } },
      { usuario_login: { contains: search } }
    ];
  }

  let orderBy = { nombre: 'asc' };
  if (sortBy) {
    if (sortBy.includes('.')) {
      const [relation, field] = sortBy.split('.');
      orderBy = { [relation]: { [field]: order } };
    } else {
      orderBy = { [sortBy]: order };
    }
  }

  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,
      include: {
        area: { include: { departamento: true } }
      },
      skip: skip,
      take: take,
      orderBy: orderBy
    }),
    prisma.user.count({ where: whereClause })
  ]);

  return { users, totalCount };
};

export const getAllUsers = () => prisma.user.findMany({
  where: { deletedAt: null },
  select: { id: true, nombre: true },
  orderBy: { nombre: 'asc' }
});

export const getUserById = (id) => prisma.user.findFirst({
  where: {
    id: Number(id),
    deletedAt: null
  },
  include: { area: { include: { departamento: true } } }
});

export const createUser = async (data, user) => {
  const newUser = await prisma.user.create({
    data: {
      ...data,
      areaId: data.areaId ? Number(data.areaId) : null
    },
  });

  // 📝 REGISTRAR
  await auditService.logActivity({
    action: 'CREATE',
    entity: 'User',
    entityId: newUser.id,
    newData: newUser,
    user: user,
    details: `Staff creado: ${newUser.nombre}`
  });

  return newUser;
};

export const updateUser = async (id, data, user) => {
  const userId = Number(id);
  const oldUser = await prisma.user.findFirst({ where: { id: userId } });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      areaId: data.areaId ? Number(data.areaId) : null
    },
  });

  // 📝 REGISTRAR
  await auditService.logActivity({
    action: 'UPDATE',
    entity: 'User',
    entityId: userId,
    oldData: oldUser,
    newData: updatedUser,
    user: user,
    details: `Staff actualizado: ${updatedUser.nombre}`
  });

  return updatedUser;
};

export const deleteUser = async (id, user) => {
  const userId = Number(id);
  const oldUser = await prisma.user.findFirst({ where: { id: userId } });

  const deleted = await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() }
  });

  // 📝 REGISTRAR
  await auditService.logActivity({
    action: 'DELETE',
    entity: 'User',
    entityId: userId,
    oldData: oldUser,
    user: user,
    details: `Staff eliminado (Soft Delete)`
  });

  return deleted;
};

// =====================================================================
// SECCIÓN 2: HELPERS PARA IMPORTACIÓN
// =====================================================================

const clean = (txt) => txt ? txt.toString().trim() : "";
const cleanLower = (txt) => clean(txt).toLowerCase();

const extractRowData = (row, headerMap) => {
  const getVal = (key) => {
    const colIdx = headerMap[key];
    return colIdx ? row.getCell(colIdx).text?.trim() : null;
  };

  const nombreRaw = getVal('nombre');
  const correo = getVal('correo') || getVal('email');
  const areaNombre = getVal('área') || getVal('area');
  const deptoNombre = getVal('departamento') || getVal('depto');
  const usuario_login = getVal('usuario de login') || getVal('usuario') || getVal('login');
  const esJefeRaw = getVal('es jefe') || getVal('jefe') || getVal('es jefe de area');

  const es_jefe_de_area = ["si", "yes", "verdadero", "true"].includes(cleanLower(esJefeRaw));

  return {
    nombre: nombreRaw,
    correo: correo || null,
    areaNombre,
    deptoNombre,
    usuario_login: usuario_login || null,
    es_jefe_de_area
  };
};

const resolveArea = (data, context) => {
  let areaId = null;
  if (data.areaNombre && data.deptoNombre) {
    const key = `${cleanLower(data.areaNombre)}|${cleanLower(data.deptoNombre)}`;
    areaId = context.areaMap.get(key);

    if (!areaId) {
      const areasFound = context.areasList.filter(a => cleanLower(a.nombre) === cleanLower(data.areaNombre));
      if (areasFound.length === 1) areaId = areasFound[0].id;
    }
  }
  return areaId;
};

// =====================================================================
// SECCIÓN 3: FUNCIÓN PRINCIPAL DE IMPORTACIÓN
// =====================================================================

export const importUsersFromExcel = async (buffer, user) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);

  const usersToCreate = [];
  const errors = [];

  const areas = await prisma.area.findMany({
    where: { deletedAt: null },
    include: { departamento: true }
  });

  const context = {
    areaMap: new Map(areas.map(a => [`${cleanLower(a.nombre)}|${cleanLower(a.departamento?.nombre)}`, a.id])),
    areasList: areas
  };

  const headerMap = {};
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cleanLower(cell.value)] = colNumber;
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const rowData = extractRowData(row, headerMap);
    const areaId = resolveArea(rowData, context);

    const nombreFinal = rowData.nombre || `Usuario Sin Nombre Fila ${rowNumber}`;

    usersToCreate.push({
      nombre: nombreFinal,
      correo: rowData.correo,
      areaId,
      usuario_login: rowData.usuario_login,
      es_jefe_de_area: rowData.es_jefe_de_area
    });
  });

  let successCount = 0;

  for (const u of usersToCreate) {
    try {
      const existing = await prisma.user.findFirst({ where: { nombre: u.nombre } });

      if (!existing) {
        await prisma.user.create({ data: u });
      } else {
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            ...u,
            deletedAt: null // Reactivar si estaba borrado
          }
        });
      }
      successCount++;
    } catch (error) {
      errors.push(`Error BD en fila '${u.nombre}': ${error.message}`);
    }
  }

  // 📝 REGISTRO DE AUDITORÍA MASIVA
  if (successCount > 0) {
    await auditService.logActivity({
      action: 'IMPORT',
      entity: 'User',
      entityId: 0,
      details: `Importación masiva de Staff: ${successCount} registros procesados.`,
      user: user
    });
  }

  return { successCount, errors };
};