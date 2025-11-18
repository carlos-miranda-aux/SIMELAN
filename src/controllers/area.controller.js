import * as areaService from "../services/area.service.js";

export const getAreas = async (req, res) => {
  try {
    const areas = await areaService.getAreas();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getArea = async (req, res) => {
  try {
    const area = await areaService.getAreaById(req.params.id);
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createArea = async (req, res) => {
  try {
    const area = await areaService.createArea(req.body);
    res.status(201).json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateArea = async (req, res) => {
  try {
    const area = await areaService.updateArea(req.params.id, req.body);
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteArea = async (req, res) => {
  try {
    await areaService.deleteArea(req.params.id);
    res.json({ message: "Area deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};