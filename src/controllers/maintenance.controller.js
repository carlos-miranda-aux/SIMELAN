import * as maintenanceService from "../services/maintenance.service.js";
import ExcelJS from "exceljs";

export const getMaintenances = async (req, res) => {
  try {
    const maintenances = await maintenanceService.getMaintenances();
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceService.getMaintenanceById(req.params.id);
    if (!maintenance) return res.status(404).json({ message: "Maintenance not found" });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMaintenance = async (req, res) => {
  try {
    const newMaintenance = await maintenanceService.createMaintenance(req.body);
    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const oldMaintenance = await maintenanceService.getMaintenanceById(req.params.id);
    if (!oldMaintenance) return res.status(404).json({ message: "Maintenance not found" });
    const updatedMaintenance = await maintenanceService.updateMaintenance(req.params.id, req.body);
    res.json(updatedMaintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    const oldMaintenance = await maintenanceService.getMaintenanceById(req.params.id);
    if (!oldMaintenance) return res.status(404).json({ message: "Maintenance not found" });
    await maintenanceService.deleteMaintenance(req.params.id);
    res.json({ message: "Maintenance deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportMaintenances = async (req, res) => {
  try {
    const maintenances = await maintenanceService.getMaintenances(); // Ya incluye el device
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Mantenimientos");

    worksheet.columns = [
      { header: "ID Manto", key: "id", width: 10 },
      { header: "Equipo Etiqueta", key: "etiqueta", width: 20 },
      { header: "Descripción", key: "descripcion", width: 40 },
      { header: "Estado", key: "estado", width: 15 },
      { header: "Fecha Programada", key: "fecha_programada", width: 20 },
      { header: "Fecha Realización", key: "fecha_realizacion", width: 20 },
    ];

    maintenances.forEach((m) => {
      worksheet.addRow({
        id: m.id,
        etiqueta: m.device?.etiqueta || "N/A",
        descripcion: m.descripcion || "",
        estado: m.estado,
        fecha_programada: m.fecha_programada ? new Date(m.fecha_programada).toLocaleDateString() : "N/A",
        fecha_realizacion: m.fecha_realizacion ? new Date(m.fecha_realizacion).toLocaleDateString() : "N/A",
      });
    });
    
    worksheet.getRow(1).font = { bold: true };
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mantenimientos.xlsx"
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al exportar mantenimientos" });
  }
};