import * as deviceService from "../services/device.service.js";

export const getDevices = async (req, res) => {
  try {
    const devices = await deviceService.getDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener dispositivos" });
  }
};

export const getDevice = async (req, res) => {
  try {
    const device = await deviceService.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: "Dispositivo no encontrado" });
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener dispositivo" });
  }
};

export const createDevice = async (req, res) => {
  try {
    const newDevice = await deviceService.createDevice(req.body);
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ error: "Error al crear dispositivo" });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const updatedDevice = await deviceService.updateDevice(req.params.id, req.body);
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar dispositivo" });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    await deviceService.deleteDevice(req.params.id);
    res.json({ message: "Dispositivo eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar dispositivo" });
  }
};
