// src/utils/preloadData.js
import prisma from "../PrismaClient.js";

/*
 * Precarga datos maestros (Departamentos, Áreas, Tipos, Estados, SO)
 * Asegura que existan los registros base sin duplicarlos.
 */
export const preloadMasterData = async () => {
    console.log("Iniciando precarga de datos maestros...");
    
    const DEPARTMENTS = [
        "Gerencia General", 
        "Capital Humano", 
        "Mantenimiento", 
        "Contraloría",
        "Ventas", 
        "Alimentos y Bebidas", 
        "Animación y Deportes", 
        "División Cuartos",
        "Spa", 
        "Golden Shores",
        "TI", 
    ];

    let deptMap = {};

    // 1. Cargando Departamentos (Upsert para evitar duplicados)
    console.log("Verificando Departamentos...");
    for (const nombre of DEPARTMENTS) {
        const dept = await prisma.department.upsert({
            where: { nombre },
            update: {},
            create: { nombre }
        });
        deptMap[dept.nombre] = dept.id;
    }

    // 2. Cargando Áreas
    console.log("Verificando Áreas...");
    const AREAS = [
        // Gerencia General
        { nombre: "Gerencia General", deptoName: "Gerencia General" },

        // Recursos Humanos
        { nombre: "Capital Humano", deptoName: "Capital Humano" },

        // Mantenimiento
        { nombre: "Mantenimiento", deptoName: "Mantenimiento" },

        // Contraloría
        { nombre: "Sistemas", deptoName: "Contraloría" },
        { nombre: "Contabilidad", deptoName: "Contraloría" },
        { nombre: "Compras", deptoName: "Contraloría" },
        { nombre: "Almacén", deptoName: "Contraloría" },
        { nombre: "Costos", deptoName: "Contraloría" },
        { nombre: "Calidad", deptoName: "Contraloría" },

        // Ventas
        { nombre: "Ventas", deptoName: "Ventas" },
        { nombre: "Grupos", deptoName: "Ventas" },
        { nombre: "Reservaciones", deptoName: "Ventas" },
        { nombre: "Experiencia al Huesped", deptoName: "Ventas" },

        // Alimentos y Bebidas
        { nombre: "Alimentos y Bebidas", deptoName: "Alimentos y Bebidas" },

        // Animación y Deportes
        { nombre: "Animación y Deportes", deptoName: "Animación y Deportes" },

        // División Cuartos
        { nombre: "Recepción", deptoName: "División Cuartos" },
        { nombre: "Concierge", deptoName: "División Cuartos" },
        { nombre: "Ama de Llaves", deptoName: "División Cuartos" },
        { nombre: "Areas Publicas", deptoName: "División Cuartos" },
        { nombre: "Seguridad", deptoName: "División Cuartos" },
        { nombre: "Lavanderia", deptoName: "División Cuartos" },
        { nombre: "División Cuartos", deptoName: "División Cuartos" },
        { nombre: "Telefonos", deptoName: "División Cuartos" },

        // Spa
        { nombre: "Spa", deptoName: "Spa" },

        // Golden Shores
        { nombre: "Golden Shores", deptoName: "Golden Shores" },

        // TI
        { nombre: "Business Center", deptoName: "TI" },
        { nombre: "Servidores", deptoName: "TI" },
        { nombre: "Backup", deptoName: "TI" },
    ];

    for (const area of AREAS) {
        const deptId = deptMap[area.deptoName];
        if (deptId) {
            // Buscamos si existe para no duplicar (la combinación nombre+depto es única)
            const existing = await prisma.area.findFirst({
                where: { 
                    nombre: area.nombre,
                    departamentoId: deptId
                }
            });

            if (!existing) {
                await prisma.area.create({
                    data: {
                        nombre: area.nombre,
                        departamentoId: deptId
                    }
                });
            }
        } else {
            console.warn(`⚠️ No se encontró el departamento '${area.deptoName}' para el área '${area.nombre}'`);
        }
    }
    
    // 3. Tipos de Dispositivo
    console.log("Verificando Tipos de Dispositivo...");
    const DEVICE_TYPES = ["Laptop", "Estación", "Servidor", "AIO"];
    await Promise.all(
        DEVICE_TYPES.map(nombre => 
            prisma.deviceType.upsert({
                where: { nombre },
                update: {},
                create: { nombre }
            })
        )
    );
    
    // 4. Estados de Dispositivo
    console.log("Verificando Estados...");
    const DEVICE_STATUSES = ["Activo", "Baja"];
    await Promise.all(
        DEVICE_STATUSES.map(nombre => 
            prisma.deviceStatus.upsert({
                where: { nombre },
                update: {},
                create: { nombre }
            })
        )
    );
    
    // 5. Sistemas Operativos (CORREGIDO)
    // Usamos los nombres genéricos para que coincidan con la importación de Excel
    console.log("Verificando Sistemas Operativos...");
    const OS_LIST = ["Windows 11", "Windows 10", "Windows 7", "Windows Server", "Windows XP"];
    
    await Promise.all(
        OS_LIST.map(nombre => 
            prisma.operatingSystem.upsert({
                where: { nombre },
                update: {},
                create: { nombre }
            })
        )
    );

    console.log("Precarga de datos maestros finalizada.");
};