// controllers/disposal.controller.js
import * as disposalService from "../services/disposal.service.js";
import ExcelJS from "exceljs";
import { logAction } from "../services/audit.service.js";

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
    const disposal = await disposalService.getDisposal(req.params.id);
    if (!disposal) return res.status(404).json({ error: "Baja no encontrada" });
    res.json(disposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDisposal = async (req, res) => {
  const userId = req.user.id
  try {
    const disposal = await disposalService.createDisposal(req.body);

    await logAction(userId, "CREATE", "Disposal", disposal.id, null, disposal);

    res.status(201).json(disposal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDisposal = async (req, res) => {
  const userId = req.user.id;
  try {
    const oldDept = await disposalService.getDisposal(req.params.id);
    if (!oldDept) return res.status(404).json({ message: "Disposal not found" });
      
    const disposal = await disposalService.updateDisposal(
      req.params.id,
      req.body
    );

    await logAction(userId, "UPDATE", "Department", req.params.id, oldDept, department);

    res.json(disposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDisposal = async (req, res) => {
  const userId = req.user.id;
  try {
    const oldDisp = await departmentService.getDisposal(req.params.id);
    if (!oldDisp) return res.status(404).json({ message: "Disposal not found" });

    await disposalService.deleteDisposal(req.params.id);

    await logAction(userId, "DELETE", "Disposal", req.params.id, oldDisp, null);

    res.json({ message: "Baja eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 Exportar bajas a Excel
export const exportDisposalsExcel = async (req, res) => {
  try {
    const disposals = await disposalService.getDisposals();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bajas");

    worksheet.columns = [
      { header: "No", key: "id", width: 10 },
      { header: "Etiqueta Equipo", key: "etiqueta", width: 20 },
      { header: "Tipo Equipo", key: "tipo", width: 20 },
      { header: "Marca", key: "marca", width: 20 },
      { header: "Modelo", key: "modelo", width: 20 },
      { header: "Observaciones", key: "observaciones", width: 40 }
    ];

    disposals.forEach((d) => {
      worksheet.addRow({
        id: d.id,
        etiqueta: d.device?.etiqueta || "N/A",
        tipo: d.device?.tipo?.nombre || "N/A",  // 👈 relación incluida desde service
        marca: d.device?.marca || "N/A",
        modelo: d.device?.modelo || "N/A",
        observaciones: d.observaciones || ""
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=bajas.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
