// src/services/device.service.js

import prisma from "../../src/PrismaClient.js";
import ExcelJS from "exceljs";

// =====================================================================
// SECCIÓN 1: FUNCIONES CRUD ESTÁNDAR
// =====================================================================

export const getActiveDevices = async ({ skip, take, search, filter, sortBy, order }) => { 
  const whereClause = {
    estado: { NOT: { nombre: "Baja" } },
  };

  if (search) {
    whereClause.OR = [
      { etiqueta: { contains: search } },
      { nombre_equipo: { contains: search } },
      { numero_serie: { contains: search } },
      { marca: { contains: search } },
      { modelo: { contains: search } },
      { ip_equipo: { contains: search } },
      { perfiles_usuario: { contains: search } },
    ];
  }
  
  // 👇 LÓGICA DE FILTRADO (Se mantiene igual)
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const ninetyDaysFromNow = new Date(today);
  ninetyDaysFromNow.setDate(today.getDate() + 90);
  ninetyDaysFromNow.setHours(23, 59, 59, 999); 
  
  if (filter === 'no-panda') {
      whereClause.AND = whereClause.AND || [];
      whereClause.AND.push({ es_panda: false });
  } else if (filter === 'warranty-risk') {
      whereClause.AND = whereClause.AND || [];
      whereClause.AND.push({
          garantia_fin: { gte: today.toISOString(), lte: ninetyDaysFromNow.toISOString() }
      });
  } else if (filter === 'expired-warranty') {
      whereClause.AND = whereClause.AND || [];
      whereClause.AND.push({ garantia_fin: { lt: today.toISOString() } });
  } else if (filter === 'safe-warranty') {
      whereClause.AND = whereClause.AND || [];
      whereClause.AND.push({
          OR: [
              { garantia_fin: { gt: ninetyDaysFromNow.toISOString() } },
              { garantia_fin: null }
          ]
      });
  }

  // 👇 LÓGICA DE ORDENAMIENTO DINÁMICO
  let orderByClause = {};
  if (sortBy) {
      if (sortBy.includes('.')) {
          // Manejar relaciones (ej: 'tipo.nombre' -> { tipo: { nombre: 'asc' } })
          const [relation, field] = sortBy.split('.');
          orderByClause = { [relation]: { [field]: order } };
      } else {
          // Campo simple
          orderByClause = { [sortBy]: order };
      }
  } else {
      orderByClause = { id: 'desc' }; // Default
  }

  const [devices, totalCount] = await prisma.$transaction([
    prisma.device.findMany({
      where: whereClause,
      include: {
        usuario: true,
        tipo: true,
        estado: true,
        sistema_operativo: true,
        maintenances: true,
        area: { include: { departamento: true } },
      },
      skip: skip,
      take: take,
      orderBy: orderByClause // 👈 Usamos la cláusula dinámica
    }),
    prisma.device.count({ where: whereClause }),
  ]);

  return { devices, totalCount };
};

// ... (Resto de funciones: createDevice, updateDevice, deleteDevice... se mantienen IGUAL) ...
// (Para ahorrar espacio, asumo que mantienes el resto del archivo como estaba,
// ya que solo modificamos `getActiveDevices` y las importaciones)

export const createDevice = (data) => prisma.device.create({ data });

export const updateDevice = (id, data) =>
  prisma.device.update({
    where: { id: Number(id) },
    data,
  });

export const deleteDevice = (id) =>
  prisma.device.delete({
    where: { id: Number(id) },
  });

export const getDeviceById = (id) =>
  prisma.device.findUnique({
    where: { id: Number(id) },
    include: {
      usuario: true,
      tipo: true,
      estado: true,
      sistema_operativo: true,
      area: { include: { departamento: true } },
    },
  });

export const getAllActiveDeviceNames = () =>
  prisma.device.findMany({
    where: { estado: { NOT: { nombre: "Baja" } } },
    select: {
      id: true,
      etiqueta: true,
      nombre_equipo: true,
      tipo: { select: { nombre: true } }
    },
    orderBy: { etiqueta: 'asc' }
  });

export const getInactiveDevices = async ({ skip, take, search }) => {
  const whereClause = {
    estado: { nombre: "Baja" },
  };

  if (search) {
    whereClause.AND = {
      OR: [
        { etiqueta: { contains: search } },
        { nombre_equipo: { contains: search } },
        { numero_serie: { contains: search } },
        { motivo_baja: { contains: search } },
      ]
    };
  }
  
  const [devices, totalCount] = await prisma.$transaction([
    prisma.device.findMany({
      where: whereClause,
      include: {
        usuario: true, 
        tipo: true,
        estado: true,
        sistema_operativo: true,
        area: { include: { departamento: true } },
      },
      skip: skip,
      take: take,
      orderBy: { fecha_baja: 'desc' }
    }),
    prisma.device.count({ where: whereClause }),
  ]);
  
  return { devices, totalCount };
};

export const getPandaStatusCounts = async () => {
    const totalActiveDevices = await prisma.device.count({
        where: { estado: { NOT: { nombre: "Baja" } } }
    });

    const devicesWithPanda = await prisma.device.count({
        where: {
            estado: { NOT: { nombre: "Baja" } },
            es_panda: true
        }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const expiredWarrantiesCount = await prisma.device.count({
        where: {
            estado: { NOT: { nombre: "Baja" } },
            garantia_fin: { lt: today.toISOString() }
        }
    });

    const devicesWithoutPanda = totalActiveDevices - devicesWithPanda;

    return {
        totalActiveDevices,
        devicesWithPanda,
        devicesWithoutPanda,
        expiredWarrantiesCount 
    };
};

export const importDevicesFromExcel = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);

  const devicesToProcess = [];
  const errors = [];

  const [areas, users] = await Promise.all([
    prisma.area.findMany({ include: { departamento: true } }),
    prisma.user.findMany(),
  ]);

  const clean = (txt) => txt ? txt.toString().trim() : "";
  const cleanLower = (txt) => clean(txt).toLowerCase();

  const userLoginMap = new Map(users
    .filter(i => i.usuario_login) 
    .map(i => [cleanLower(i.usuario_login), i.id])
  );
  const userNameMap = new Map(users.map(i => [cleanLower(i.nombre), i.id]));
  
  const areaMap = new Map();
  areas.forEach(a => {
    areaMap.set(`${cleanLower(a.nombre)}|${cleanLower(a.departamento?.nombre)}`, a.id);
  });

  const headerMap = {};
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cleanLower(cell.value)] = colNumber;
  });
  
  const parseDateForPrisma = (dateStr) => {
      if (!dateStr) return null;
      try {
          const date = new Date(dateStr);
          return isNaN(date.getTime()) ? null : date.toISOString();
      } catch (e) {
          return null;
      }
  };

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const getVal = (key) => {
      const idx = headerMap[key];
      return idx ? row.getCell(idx).text?.trim() : null;
    };

    const etiqueta = getVal('etiqueta');
    
    const nombreRaw = getVal('nombre equipo') || getVal('nombre');
    const serieRaw = getVal('n° serie') || getVal('serie') || getVal('numero serie') || getVal('serial');
    
    const tipoStr = getVal('tipo');
    const estadoStr = getVal('estado');
    
    const rawOS = getVal('sistema operativo') || getVal('so') || getVal('os');
    let osStr = null;
    if (rawOS) {
        const trimmed = rawOS.trim().toLowerCase();
        osStr = trimmed.charAt(0).toUpperCase() + trimmed.slice(1); 
    }

    const marca = getVal('marca') || "Genérico";
    const modelo = getVal('modelo') || "Genérico";
    
    const ip_equipo_raw = getVal('ip') || getVal('ip equipo');
    const ip_equipo = ip_equipo_raw || "DHCP";
    
    const descripcion = getVal('descripcion') || ""; 
    
    const officeVersionStr = getVal('version office') || getVal('office version') || getVal('version de office') || getVal('office versión');
    const officeLicenseTypeStr = getVal('tipo licencia') || getVal('tipo de licencia') || getVal('licencia office') || getVal('tipo licencia office') || getVal('tipo de licencia office');
    
    const garantiaNumProdStr = getVal('n producto') || getVal('garantia numero producto') || getVal('numero de producto de garantia') || getVal('garantia numero');
    const garantiaInicioStr = getVal('inicio garantia') || getVal('garantia inicio');
    const garantiaFinStr = getVal('fin garantia') || getVal('garantia fin');

    const pandaStr = getVal('antivirus') || getVal('panda') || getVal('es panda');
    const es_panda = cleanLower(pandaStr) === "si" || cleanLower(pandaStr) === "yes" || cleanLower(pandaStr) === "verdadero" || cleanLower(pandaStr) === "true";

    const responsableLoginStr = getVal('usuario de login') || getVal('usuario login') || getVal('login') || getVal('usuarios') || getVal('usuario');
    const responsableNameStr = getVal('responsable (jefe') || getVal('responsable');
    
    const perfilesStr = getVal('perfiles acceso') || getVal('perfiles') || getVal('perfiles de usuario');
    
    const areaStr = getVal('área') || getVal('area');
    const deptoStr = getVal('departamento');

    const nombre_equipo = nombreRaw || `Equipo Fila ${rowNumber}`;
    const numero_serie = serieRaw || `SN-GEN-${rowNumber}-${Date.now().toString().slice(-4)}`;

    let usuarioId = null;
    
    if (responsableLoginStr) {
        usuarioId = userLoginMap.get(cleanLower(responsableLoginStr));
    }
    
    if (!usuarioId && responsableNameStr) {
        usuarioId = userNameMap.get(cleanLower(responsableNameStr));
    }

    let areaId = null;
    if (areaStr && deptoStr) {
      areaId = areaMap.get(`${cleanLower(areaStr)}|${cleanLower(deptoStr)}`);
    }
    if (!areaId && areaStr) {
      const possibleArea = areas.find(a => cleanLower(a.nombre) === cleanLower(areaStr));
      if (possibleArea) areaId = possibleArea.id;
    }

    devicesToProcess.push({
      deviceData: {
        etiqueta: etiqueta || null,
        nombre_equipo,
        numero_serie,
        marca,
        modelo,
        ip_equipo: ip_equipo,
        descripcion, 
        perfiles_usuario: perfilesStr || null,
        usuarioId, 
        areaId,
        office_version: officeVersionStr || null,
        office_tipo_licencia: officeLicenseTypeStr || null,
        garantia_numero_producto: garantiaNumProdStr || null,
        garantia_inicio: parseDateForPrisma(garantiaInicioStr),
        garantia_fin: parseDateForPrisma(garantiaFinStr),
        es_panda: es_panda, 
      },
      meta: {
        tipo: tipoStr || "Estación",
        estado: estadoStr || "Activo",
        os: osStr
      }
    });
  });

  let successCount = 0;
  
  const typesCache = new Map();
  const statusCache = new Map();
  const osCache = new Map();

  const getOrCreateCatalog = async (modelName, value, cache) => {
    if (!value) return null;
    const key = cleanLower(value);
    
    if (cache.has(key)) return cache.get(key);

    let item = await prisma[modelName].findFirst({ where: { nombre: value } });
    
    if (!item) {
      try {
        item = await prisma[modelName].create({ data: { nombre: value } });
      } catch (e) {
        item = await prisma[modelName].findFirst({ where: { nombre: value } });
      }
    }

    if (item) {
      cache.set(key, item.id);
      return item.id;
    }
    return null;
  };

  for (const item of devicesToProcess) {
    try {
      const tipoId = await getOrCreateCatalog('deviceType', item.meta.tipo, typesCache);
      const estadoId = await getOrCreateCatalog('deviceStatus', item.meta.estado, statusCache);
      const sistemaOperativoId = await getOrCreateCatalog('operatingSystem', item.meta.os, osCache);

      const finalData = {
        ...item.deviceData,
        tipoId: tipoId, 
        estadoId: estadoId,
        sistemaOperativoId: sistemaOperativoId 
      };

      const exists = await prisma.device.findUnique({ where: { numero_serie: finalData.numero_serie } });
      
      if (!exists) {
        await prisma.device.create({ data: finalData });
        successCount++;
      } else {
        await prisma.device.update({
          where: { id: exists.id },
          data: finalData
        });
        successCount++;
      }

    } catch (error) {
      errors.push(`Error procesando ${item.deviceData.nombre_equipo}: ${error.message}`);
    }
  }

  return { successCount, errors };
};

export const getExpiredWarrantyAnalysis = async (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const devices = await prisma.device.findMany({
        where: {
            estado: { NOT: { nombre: "Baja" } },
            garantia_fin: {
                lt: today.toISOString() 
            }
        },
        include: {
            tipo: { select: { nombre: true } },
            maintenances: { 
                select: {
                    estado: true,
                    tipo_mantenimiento: true,
                    fecha_realizacion: true,
                },
                where: {
                    estado: 'realizado', 
                    tipo_mantenimiento: 'Correctivo', 
                    fecha_realizacion: {
                        ...(startDate && { gte: new Date(startDate).toISOString() }),
                        ...(endDate && { lte: new Date(endDate).toISOString() }),
                    }
                },
                orderBy: {
                    fecha_realizacion: 'desc'
                }
            },
        },
        orderBy: {
            garantia_fin: 'asc' 
        }
    });

    return devices.map(d => {
        const correctives = d.maintenances.filter(m => 
             m.tipo_mantenimiento === 'Correctivo' && m.estado === 'realizado'
        );
        
        const lastCorrectiveDate = correctives.length > 0 
            ? correctives[0].fecha_realizacion 
            : null;
        
        const warrantyEnd = d.garantia_fin ? new Date(d.garantia_fin) : null;
        let daysExpired = null;
        if (warrantyEnd) {
            const diffTime = today.getTime() - warrantyEnd.getTime();
            daysExpired = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }

        return {
            etiqueta: d.etiqueta || "N/A",
            nombre_equipo: d.nombre_equipo || "N/A",
            numero_serie: d.numero_serie || "N/A",
            marca: d.marca || "N/A",
            modelo: d.modelo || "N/A",
            garantia_fin: warrantyEnd,
            daysExpired: daysExpired,
            correctiveCount: correctives.length,
            lastCorrective: lastCorrectiveDate,
        };
    });
};