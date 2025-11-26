import prisma from "../../src/PrismaClient.js";
import ExcelJS from "exceljs";

// =====================================================================
// SECCIÓN 1: FUNCIONES CRUD ESTÁNDAR
// =====================================================================

export const getActiveDevices = async ({ skip, take, search }) => {
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
      orderBy: { id: 'desc' }
    }),
    prisma.device.count({ where: whereClause }),
  ]);

  return { devices, totalCount };
};

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

// =====================================================================
// SECCIÓN 2: IMPORTACIÓN MASIVA INTELIGENTE
// =====================================================================

export const importDevicesFromExcel = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);

  const devicesToProcess = [];
  const errors = [];

  // 1. Cargar catálogos base para búsquedas rápidas
  const [areas, users] = await Promise.all([
    prisma.area.findMany({ include: { departamento: true } }),
    prisma.user.findMany(),
  ]);

  const clean = (txt) => txt ? txt.toString().trim() : "";
  const cleanLower = (txt) => clean(txt).toLowerCase();

  // Mapas en memoria
  const userMap = new Map(users.map(i => [cleanLower(i.nombre), i.id]));
  const areaMap = new Map();
  areas.forEach(a => {
    // Clave compuesta: "nombreArea|nombreDepto"
    areaMap.set(`${cleanLower(a.nombre)}|${cleanLower(a.departamento?.nombre)}`, a.id);
  });

  // 2. Mapear Encabezados Dinámicamente (Fila 1)
  const headerMap = {};
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cleanLower(cell.value)] = colNumber;
  });

  // 3. Leer Filas y Preparar Datos
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    // Helper para obtener valor por nombre de columna
    const getVal = (key) => {
      const idx = headerMap[key];
      return idx ? row.getCell(idx).text?.trim() : null;
    };

    // --- Extracción de Datos (con variantes de nombres de columna) ---
    const etiqueta = getVal('etiqueta');
    
    const nombreRaw = getVal('nombre equipo') || getVal('nombre');
    const serieRaw = getVal('n° serie') || getVal('serie') || getVal('numero serie') || getVal('serial');
    
    // Estos campos se procesarán para crear catálogos si no existen
    const tipoStr = getVal('tipo');
    const estadoStr = getVal('estado');
    
    // Captura robusta de Sistema Operativo
    const rawOS = getVal('sistema operativo') || getVal('so') || getVal('os');
    let osStr = null;
    if (rawOS) {
        // Normalizar "windows 10" -> "Windows 10" (Capitalize)
        const trimmed = rawOS.trim().toLowerCase();
        osStr = trimmed.charAt(0).toUpperCase() + trimmed.slice(1); 
    }

    const marca = getVal('marca') || "Genérico";
    const modelo = getVal('modelo') || "Genérico";
    const ip_equipo = getVal('ip') || getVal('ip equipo');
    const descripcion = getVal('descripcion') || "Importado masivamente";
    
    const responsableStr = getVal('responsable (jefe)') || getVal('responsable') || getVal('usuario');
    const perfilesStr = getVal('perfiles acceso') || getVal('perfiles') || getVal('perfiles de usuario');
    
    const areaStr = getVal('área') || getVal('area');
    const deptoStr = getVal('departamento');

    // --- Valores por Defecto (Para evitar rechazos) ---
    const nombre_equipo = nombreRaw || `Equipo Fila ${rowNumber}`;
    // Si no hay serie, generamos una única para cumplir restricción UNIQUE
    const numero_serie = serieRaw || `SN-GEN-${rowNumber}-${Date.now().toString().slice(-4)}`;

    // Resolver IDs existentes
    const usuarioId = userMap.get(cleanLower(responsableStr)) || null;

    let areaId = null;
    if (areaStr && deptoStr) {
      areaId = areaMap.get(`${cleanLower(areaStr)}|${cleanLower(deptoStr)}`);
    }
    // Fallback: buscar solo por nombre de área
    if (!areaId && areaStr) {
      const possibleArea = areas.find(a => cleanLower(a.nombre) === cleanLower(areaStr));
      if (possibleArea) areaId = possibleArea.id;
    }

    // Empaquetar para la siguiente fase
    devicesToProcess.push({
      deviceData: {
        etiqueta: etiqueta || null,
        nombre_equipo,
        numero_serie,
        marca,
        modelo,
        ip_equipo: ip_equipo || null,
        descripcion,
        perfiles_usuario: perfilesStr || null,
        usuarioId,
        areaId
      },
      meta: {
        tipo: tipoStr || "Estación",   // Default si viene vacío
        estado: estadoStr || "Activo", // Default si viene vacío
        os: osStr                      // Puede ser null
      }
    });
  });

  // 4. Procesamiento e Inserción (Creación de Catálogos al Vuelo)
  let successCount = 0;
  
  // Cachés locales para no consultar la BD repetidamente
  const typesCache = new Map();
  const statusCache = new Map();
  const osCache = new Map();

  // Función auxiliar: Busca o Crea en catálogo
  const getOrCreateCatalog = async (modelName, value, cache) => {
    if (!value) return null;
    const key = cleanLower(value);
    
    // 1. Buscar en caché local
    if (cache.has(key)) return cache.get(key);

    // 2. Buscar en BD
    let item = await prisma[modelName].findFirst({ where: { nombre: value } });
    
    // 3. Si no existe, CREAR
    if (!item) {
      try {
        item = await prisma[modelName].create({ data: { nombre: value } });
      } catch (e) {
        // Si falla (ej. condición de carrera), intentar buscar de nuevo
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
      // A. Resolver o Crear Tipo
      const tipoId = await getOrCreateCatalog('deviceType', item.meta.tipo, typesCache);
      
      // B. Resolver o Crear Estado
      const estadoId = await getOrCreateCatalog('deviceStatus', item.meta.estado, statusCache);
      
      // C. Resolver o Crear Sistema Operativo
      const sistemaOperativoId = await getOrCreateCatalog('operatingSystem', item.meta.os, osCache);

      // Construir objeto final
      const finalData = {
        ...item.deviceData,
        tipoId: tipoId, 
        estadoId: estadoId,
        sistemaOperativoId: sistemaOperativoId 
      };

      // Upsert (Crear o Actualizar si la serie ya existe)
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