import * as userService from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
