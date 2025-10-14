import * as deviceStatusService from "../services/deviceStatus.service.js";

export const getDeviceStatuses = async (req, res) => {
  try {
    const statuses = await deviceStatusService.getDeviceStatuses();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeviceStatus = async (req, res) => {
  try {
    const status = await deviceStatusService.getDeviceStatusById(req.params.id);
    if (!status) return res.status(404).json({ message: "DeviceStatus not found" });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDeviceStatus = async (req, res) => {
  try {
    const status = await deviceStatusService.createDeviceStatus(req.body);
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDeviceStatus = async (req, res) => {
  try {
    const oldStatus = await deviceStatusService.getDeviceStatusById(req.params.id);
    if (!oldStatus) return res.status(404).json({ message: "DeviceStatus not found" });
    const status = await deviceStatusService.updateDeviceStatus(req.params.id, req.body);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDeviceStatus = async (req, res) => {
  try {
    const oldStatus = await deviceStatusService.getDeviceStatusById(req.params.id);
    if (!oldStatus) return res.status(404).json({ message: "DeviceStatus not found" });
    await deviceStatusService.deleteDeviceStatus(req.params.id);
    res.json({ message: "DeviceStatus deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};