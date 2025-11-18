// src/controllers/area.controller.js
import * as areaService from "../services/area.service.js";

export const getAreas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Si se pide limit=0 o no se proporciona, devolvemos la lista completa (para Selects)
    if (isNaN(limit) || limit === 0 || req.query.limit === undefined || req.query.limit === '0') {
        const areas = await areaService.getAllAreas();
        return res.json(areas);
    }
    
    // Paginación para la tabla de AdminSettings
    const { areas, totalCount } = await areaService.getAreas({ skip, take: limit });

    res.json({
      data: areas,
      totalCount: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });

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
    // Manejar error de clave duplicada
    if (error.code === 'P2002') {
        return res.status(400).json({ error: "Ya existe un área con ese nombre en este departamento." });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateArea = async (req, res) => {
  try {
    const area = await areaService.updateArea(req.params.id, req.body);
    res.json(area);
  } catch (error) {
    if (error.code === 'P2002') {
        return res.status(400).json({ error: "Ya existe un área con ese nombre en este departamento." });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteArea = async (req, res) => {
  try {
    await areaService.deleteArea(req.params.id);
    res.json({ message: "Area deleted" });
  } catch (error) {
    // Error si el área está siendo usada por un usuario o dispositivo
    if (error.code === 'P2003') {
        return res.status(400).json({ error: "No se puede eliminar el área porque está asignada a uno o más usuarios/equipos." });
    }
    res.status(500).json({ error: error.message });
  }
};