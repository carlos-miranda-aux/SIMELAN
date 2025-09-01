import * as maintenanceService from "../services/maintenance.service.js";

export const getMaintenances = async (req, res) => {
  try {
    const maintenances = await maintenanceService.getMaintenances();
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mantenimientos" });
  }
};

export const getMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceService.getMaintenanceById(req.params.id);
    if (!maintenance) return res.status(404).json({ error: "Mantenimiento no encontrado" });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mantenimiento" });
  }
};

export const createMaintenance = async (req, res) => {
  try {
    const newMaintenance = await maintenanceService.createMaintenance(req.body);
    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(500).json({ error: "Error al crear mantenimiento" });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const updatedMaintenance = await maintenanceService.updateMaintenance(req.params.id, req.body);
    res.json(updatedMaintenance);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar mantenimiento" });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    await maintenanceService.deleteMaintenance(req.params.id);
    res.json({ message: "Mantenimiento eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar mantenimiento" });
  }
};
