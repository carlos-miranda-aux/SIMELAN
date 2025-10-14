import * as maintenanceService from "../services/maintenance.service.js";

export const getMaintenances = async (req, res) => {
  try {
    const maintenances = await maintenanceService.getMaintenances();
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceService.getMaintenanceById(req.params.id);
    if (!maintenance) return res.status(404).json({ message: "Maintenance not found" });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMaintenance = async (req, res) => {
  try {
    const newMaintenance = await maintenanceService.createMaintenance(req.body);
    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const oldMaintenance = await maintenanceService.getMaintenanceById(req.params.id);
    if (!oldMaintenance) return res.status(404).json({ message: "Maintenance not found" });
    const updatedMaintenance = await maintenanceService.updateMaintenance(req.params.id, req.body);
    res.json(updatedMaintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    const oldMaintenance = await maintenanceService.getMaintenanceById(req.params.id);
    if (!oldMaintenance) return res.status(404).json({ message: "Maintenance not found" });
    await maintenanceService.deleteMaintenance(req.params.id);
    res.json({ message: "Maintenance deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};