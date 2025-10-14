import * as deviceTypeService from "../services/deviceType.service.js";

export const getDeviceTypes = async (req, res) => {
  try {
    const deviceTypes = await deviceTypeService.getDeviceTypes();
    res.json(deviceTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeviceType = async (req, res) => {
  try {
    const { id } = req.params;
    const deviceType = await deviceTypeService.getDeviceTypeById(id);
    if (!deviceType) return res.status(404).json({ message: "DeviceType not found" });
    res.json(deviceType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDeviceType = async (req, res) => {
  try {
    const newDeviceType = await deviceTypeService.createDeviceType(req.body);
    res.status(201).json(newDeviceType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDeviceType = async (req, res) => {
  try {
    const oldDeviceType = await deviceTypeService.getDeviceTypeById(req.params.id);
    if (!oldDeviceType) return res.status(404).json({ message: "DeviceType not found" });
    const updatedDeviceType = await deviceTypeService.updateDeviceType(req.params.id, req.body);
    res.json(updatedDeviceType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDeviceType = async (req, res) => {
  try {
    const oldDeviceType = await deviceTypeService.getDeviceTypeById(req.params.id);
    if (!oldDeviceType) return res.status(404).json({ message: "DeviceType not found" });
    await deviceTypeService.deleteDeviceType(req.params.id);
    res.json({ message: "DeviceType deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};