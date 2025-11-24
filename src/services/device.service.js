import prisma from "../../src/PrismaClient.js";
import ExcelJS from "exceljs";

// ... (Mantén getActiveDevices, getAllActiveDeviceNames, getInactiveDevices, getDeviceById igual) ...

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
      { perfiles_usuario: { contains: search } }, // 👈 Agregamos búsqueda por perfil
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

// ... (Mantén createDevice, deleteDevice, updateDevice igual, Prisma manejará el nuevo campo automáticamente si se lo pasamos desde el controlador) ...
export const createDevice = (data) => prisma.device.create({ data });
export const updateDevice = (id, data) => prisma.device.update({ where: { id: Number(id) }, data });
export const deleteDevice = (id) => prisma.device.delete({ where: { id: Number(id) } });
// ... (getDeviceById, getInactiveDevices, getAllActiveDeviceNames también se quedan igual) ...
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


// 👇 ACTUALIZACIÓN: IMPORTACIÓN CON CAMPO "PERFILES"
export const importDevicesFromExcel = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);

  const devicesToCreate = [];
  const errors = [];

  const [areas, types, statuses, oss, users] = await Promise.all([
    prisma.area.findMany(),
    prisma.deviceType.findMany(),
    prisma.deviceStatus.findMany(),
    prisma.operatingSystem.findMany(),
    prisma.user.findMany(),
  ]);

  const clean = (txt) => txt ? txt.toString().toLowerCase().trim() : "";
  const areaMap = new Map(areas.map(i => [clean(i.nombre), i.id]));
  const typeMap = new Map(types.map(i => [clean(i.nombre), i.id]));
  const statusMap = new Map(statuses.map(i => [clean(i.nombre), i.id]));
  const osMap = new Map(oss.map(i => [clean(i.nombre), i.id]));
  const userMap = new Map(users.map(i => [clean(i.nombre), i.id]));

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    // Mapeo de Columnas Actualizado:
    // ... G: Estado, H: Area, I: Responsable (Jefe), J: Perfiles (Lista), K: SO, L: IP, M: Etiqueta, N: Descripcion
    
    const nombre_equipo = row.getCell(1).text?.trim(); // A
    const numero_serie = row.getCell(2).text?.trim();  // B
    const tipoStr = row.getCell(3).text?.trim();       // C
    const marca = row.getCell(4).text?.trim();         // D
    const modelo = row.getCell(5).text?.trim();        // E
    const estadoStr = row.getCell(6).text?.trim();     // F
    const areaStr = row.getCell(7).text?.trim();       // G
    const responsableStr = row.getCell(8).text?.trim();// H (Usuario Principal)
    const perfilesStr = row.getCell(9).text?.trim();   // I 👈 NUEVO: Lista de usuarios extra
    const osStr = row.getCell(10).text?.trim();        // J
    const ip_equipo = row.getCell(11).text?.trim();    // K
    const etiqueta = row.getCell(12).text?.trim();     // L
    const descripcion = row.getCell(13).text?.trim();  // M

    if (!nombre_equipo || !numero_serie || !tipoStr) {
      errors.push(`Fila ${rowNumber}: Faltan campos obligatorios.`);
      return;
    }

    const tipoId = typeMap.get(clean(tipoStr));
    const estadoId = statusMap.get(clean(estadoStr)) || statusMap.get("activo");
    const areaId = areaMap.get(clean(areaStr));
    const sistemaOperativoId = osMap.get(clean(osStr));
    const usuarioId = userMap.get(clean(responsableStr)); // ID del Jefe/Responsable

    if (!tipoId) {
        errors.push(`Fila ${rowNumber}: Tipo '${tipoStr}' no encontrado.`);
        return;
    }

    devicesToCreate.push({
      nombre_equipo,
      numero_serie,
      tipoId,
      estadoId,
      marca: marca || "Genérico",
      modelo: modelo || "Genérico",
      etiqueta: etiqueta || null,
      areaId,
      usuarioId,
      perfiles_usuario: perfilesStr || null, // 👈 Guardamos la lista aquí
      sistemaOperativoId,
      ip_equipo: ip_equipo || null,
      descripcion: descripcion || null
    });
  });

  let successCount = 0;
  for (const dev of devicesToCreate) {
    try {
        const exists = await prisma.device.findUnique({ where: { numero_serie: dev.numero_serie } });
        if (!exists) {
            await prisma.device.create({ data: dev });
            successCount++;
        } else {
            errors.push(`Serie duplicada: ${dev.numero_serie}`);
        }
    } catch (error) {
        errors.push(`Error en equipo ${dev.nombre_equipo}: ${error.message}`);
    }
  }

  return { successCount, errors };
}