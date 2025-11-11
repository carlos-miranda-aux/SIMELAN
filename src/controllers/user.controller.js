import * as userService from "../services/user.service.js";
import ExcelJS from "exceljs";

// 📌 Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Obtener un usuario por ID
export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const oldUser = await userService.getUserById(req.params.id);
    if (!oldUser) return res.status(404).json({ message: "Usuario no encontrado" });
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const oldUser = await userService.getUserById(req.params.id);
    if (!oldUser) return res.status(404).json({ message: "Usuario no encontrado" });
    await userService.deleteUser(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportUsers = async (req, res) => {
  try {
    const users = await userService.getUsers(); // Ya incluye el departamento
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios Crown");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Correo", key: "correo", width: 30 },
      { header: "Departamento", key: "departamento", width: 25 },
      { header: "Usuario de Login", key: "usuario_login", width: 20 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        departamento: user.departamento?.nombre || "N/A",
        usuario_login: user.usuario_login || "N/A",
      });
    });

    worksheet.getRow(1).font = { bold: true };
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=usuarios_crown.xlsx"
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al exportar usuarios" });
  }
};