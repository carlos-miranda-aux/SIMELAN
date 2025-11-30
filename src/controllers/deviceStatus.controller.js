import * as deviceStatusService from "../services/deviceStatus.service.js";

export const getDeviceStatuses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "nombre";
    const order = req.query.order || "asc";
    const skip = (page - 1) * limit;

    if (isNaN(limit) || limit === 0 || req.query.limit === '0') {
        const allStatuses = await deviceStatusService.getAllDeviceStatuses();
        return res.json(allStatuses);
    }

    const { deviceStatuses, totalCount } = await deviceStatusService.getDeviceStatuses({ 
        skip, 
        take: limit,
        sortBy,
        order
    });

    res.json({
      data: deviceStatuses,
      totalCount: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeviceStatus = async (req, res) => {
  try {
    const status = await deviceStatusService.getDeviceStatusById(req.params.id);
    if (!status) return res.status(404).json({ message: "Status not found" });
    res.json(status);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createDeviceStatus = async (req, res) => {
  try {
    const status = await deviceStatusService.createDeviceStatus(req.body);
    res.status(201).json(status);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateDeviceStatus = async (req, res) => {
  try {
    const oldStatus = await deviceStatusService.getDeviceStatusById(req.params.id);
    if (!oldStatus) return res.status(404).json({ message: "Status not found" });
    const status = await deviceStatusService.updateDeviceStatus(req.params.id, req.body);
    res.json(status);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteDeviceStatus = async (req, res) => {
  try {
    const oldStatus = await deviceStatusService.getDeviceStatusById(req.params.id);
    if (!oldStatus) return res.status(404).json({ message: "Status not found" });
    await deviceStatusService.deleteDeviceStatus(req.params.id);
    res.json({ message: "Status deleted" });
  } catch (error) {
    if (error.code === 'P2003') return res.status(400).json({ error: "No se puede eliminar porque está en uso." });
    res.status(500).json({ error: error.message });
  }
};