import * as deviceTypeService from "../services/deviceType.service.js";

export const getDeviceTypes = async (req, res) => {
  try {
    const deviceTypes = await deviceTypeService.getDeviceTypes();
    res.json(deviceTypes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los tipos de dispositivo" });
  }
};

export const getDeviceType = async (req, res) => {
  try {
    const { id } = req.params;
    const deviceType = await deviceTypeService.getDeviceTypeById(id);
    if (!deviceType) {
      return res.status(404).json({ error: "Tipo de dispositivo no encontrado" });
    }
    res.json(deviceType);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tipo de dispositivo" });
  }
};

export const createDeviceType = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newDeviceType = await deviceTypeService.createDeviceType({ nombre });
    res.status(201).json(newDeviceType);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el tipo de dispositivo" });
  }
};

export const updateDeviceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const updatedDeviceType = await deviceTypeService.updateDeviceType(id, { nombre });
    res.json(updatedDeviceType);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el tipo de dispositivo" });
  }
};

export const deleteDeviceType = async (req, res) => {
  try {
    const { id } = req.params;
    await deviceTypeService.deleteDeviceType(id);
    res.json({ message: "Tipo de dispositivo eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el tipo de dispositivo" });
  }
};
