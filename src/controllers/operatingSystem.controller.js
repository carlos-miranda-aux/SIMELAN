// src/controllers/operatingSystem.controller.js
import {
  getOperatingSystems,
  getOperatingSystemById,
  createOperatingSystem,
  updateOperatingSystem,
  deleteOperatingSystem
} from "../services/operatingSystem.service.js";

// Obtener todos
export const getOperatingSystemsController = async (req, res) => {
  try {
    const systems = await getOperatingSystems();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener sistemas operativos" });
  }
};

// Obtener por id
export const getOperatingSystemController = async (req, res) => {
  try {
    const { id } = req.params;
    const system = await getOperatingSystemById(id);

    if (!system) {
      return res.status(404).json({ error: "Sistema operativo no encontrado" });
    }

    res.json(system);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener sistema operativo" });
  }
};

// Crear
export const createOperatingSystemController = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newSystem = await createOperatingSystem({ nombre });
    res.status(201).json(newSystem);
  } catch (error) {
    res.status(500).json({ error: "Error al crear sistema operativo" });
  }
};

// Actualizar
export const updateOperatingSystemController = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const updatedSystem = await updateOperatingSystem(id, { nombre });
    res.json(updatedSystem);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar sistema operativo" });
  }
};

// Eliminar
export const deleteOperatingSystemController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOperatingSystem(id);
    res.json({ message: "Sistema operativo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar sistema operativo" });
  }
};
