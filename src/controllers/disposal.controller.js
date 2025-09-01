// controllers/disposal.controller.js
import * as disposalService from "../services/disposal.service.js";

export const getDisposals = async (req, res) => {
  try {
    const disposals = await disposalService.getDisposals();
    res.json(disposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDisposal = async (req, res) => {
  try {
    const { id } = req.params;
    const disposal = await disposalService.getDisposal(id);
    if (!disposal) return res.status(404).json({ error: "Baja no encontrada" });
    res.json(disposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDisposal = async (req, res) => {
  try {
    const newDisposal = await disposalService.createDisposal(req.body);
    res.status(201).json(newDisposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
