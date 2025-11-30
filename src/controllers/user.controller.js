// src/controllers/user.controller.js
import * as userService from "../services/user.service.js";
import ExcelJS from "exceljs";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    // Si limit viene como '0', lo tratamos como 0 numérico para el if, sino default 10
    const limitParam = req.query.limit; 
    const limit = (limitParam === '0') ? 0 : (parseInt(limitParam) || 10);
    
    const sortBy = req.query.sortBy || "nombre";
    const order = req.query.order || "asc";
    
    const skip = (page - 1) * limit;

    // 👈 CORRECCIÓN: Si el límite es 0, devolvemos TODOS los usuarios en formato Array simple
    if (limit === 0) {
        const { users } = await userService.getUsers({ 
            skip: 0, 
            take: undefined, // undefined hace que Prisma traiga todo
            sortBy, 
            order 
        });
        return res.json(users);
    }

    // Respuesta Paginada (Objeto)
    const { users, totalCount } = await userService.getUsers({ skip, take: limit, search: req.query.search, sortBy, order });

    res.json({
      data: users,
      totalCount: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const exportUsers = async (req, res) => {
  try {
    // Obtenemos todos los usuarios (sin paginación)
    const { users } = await userService.getUsers({ skip: 0, take: undefined }); 
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios Crown");
    
    // Definimos las columnas, agregando "Área" y ajustando "Departamento"
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Correo", key: "correo", width: 30 },
      { header: "Área", key: "area", width: 25 },          // 👈 Nueva columna
      { header: "Departamento", key: "departamento", width: 25 },
      { header: "Usuario de Login", key: "usuario_login", width: 20 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        // Accedemos a través de la relación: User -> Area -> Nombre
        area: user.area?.nombre || "N/A", 
        // Accedemos a través de la relación: User -> Area -> Departamento -> Nombre
        departamento: user.area?.departamento?.nombre || "N/A",
        usuario_login: user.usuario_login || "N/A",
      });
    });

    worksheet.getRow(1).font = { bold: true };
    
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=usuarios_crown.xlsx");
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al exportar usuarios" });
  }
};

export const importUsers = async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const result = await userService.importUsersFromExcel(req.file.buffer);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};