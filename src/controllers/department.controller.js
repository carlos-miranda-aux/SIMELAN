import * as departmentService from "../services/department.service.js";
import { logAction } from "../services/audit.service.js";

// 📌 Obtener todos los departamentos
export const getDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getDepartments();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Obtener un departamento por ID
export const getDepartment = async (req, res) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Crear un nuevo departamento
export const createDepartment = async (req, res) => {
  const userId = req.user?.id || null;// Usuario que hace la acción
  try {
    const department = await departmentService.createDepartment(req.body);

    // AUDITORÍA
    await logAction(userId, "CREATE", "Department", department.id, null, department);

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Actualizar un departamento
export const updateDepartment = async (req, res) => {
  const userId = req.user?.id || null;
  try {
    const oldDept = await departmentService.getDepartmentById(req.params.id);
    if (!oldDept) return res.status(404).json({ message: "Department not found" });

    const department = await departmentService.updateDepartment(req.params.id, req.body);

    // AUDITORÍA
    await logAction(userId, "UPDATE", "Department", req.params.id, oldDept, department);

    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Eliminar un departamento
export const deleteDepartment = async (req, res) => {
  const userId = req.user?.id || null;
  try {
    const oldDept = await departmentService.getDepartmentById(req.params.id);
    if (!oldDept) return res.status(404).json({ message: "Department not found" });

    await departmentService.deleteDepartment(req.params.id);

    // AUDITORÍA
    await logAction(userId, "DELETE", "Department", req.params.id, oldDept, null);

    res.json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
