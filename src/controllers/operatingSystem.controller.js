import {
  getOperatingSystems,
  getOperatingSystemById,
  createOperatingSystem,
  updateOperatingSystem,
  deleteOperatingSystem
} from "../services/operatingSystem.service.js";

export const getOperatingSystemsController = async (req, res) => {
  try {
    const systems = await getOperatingSystems();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOperatingSystemController = async (req, res) => {
  try {
    const { id } = req.params;
    const system = await getOperatingSystemById(id);
    if (!system) return res.status(404).json({ message: "OperatingSystem not found" });
    res.json(system);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOperatingSystemController = async (req, res) => {
  try {
    const newSystem = await createOperatingSystem(req.body);
    res.status(201).json(newSystem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOperatingSystemController = async (req, res) => {
  try {
    const oldSystem = await getOperatingSystemById(req.params.id);
    if (!oldSystem) return res.status(404).json({ message: "OperatingSystem not found" });
    const updatedSystem = await updateOperatingSystem(req.params.id, req.body);
    res.json(updatedSystem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOperatingSystemController = async (req, res) => {
  try {
    const oldSystem = await getOperatingSystemById(req.params.id);
    if (!oldSystem) return res.status(404).json({ message: "OperatingSystem not found" });
    await deleteOperatingSystem(req.params.id);
    res.json({ message: "OperatingSystem deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};