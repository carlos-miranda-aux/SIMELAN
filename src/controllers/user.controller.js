import * as userService from "../services/user.service.js";

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