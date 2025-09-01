import * as deviceStatusService from "../services/deviceStatus.service.js";

export const getDeviceStatuses = async (req, res) => {
  try {
    const statuses = await deviceStatusService.getDeviceStatuses();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los estados de dispositivos" });
  }
};

export const getDeviceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await deviceStatusService.getDeviceStatusById(id);
    if (!status) {
      return res.status(404).json({ error: "Estado de dispositivo no encontrado" });
    }
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el estado de dispositivo" });
  }
};

export const createDeviceStatus = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newStatus = await deviceStatusService.createDeviceStatus({ nombre });
    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el estado de dispositivo" });
  }
};

export const updateDeviceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const updatedStatus = await deviceStatusService.updateDeviceStatus(id, { nombre });
    res.json(updatedStatus);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estado de dispositivo" });
  }
};

export const deleteDeviceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    await deviceStatusService.deleteDeviceStatus(id);
    res.json({ message: "Estado de dispositivo eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el estado de dispositivo" });
  }
};
