import * as departmentService from "../services/department.service.js";

export const getDepartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Si limit no se pide (o es inválido), se asume que se pide la lista completa para un selector (formularios)
    if (isNaN(limit) || limit === 0 || req.query.limit === undefined || req.query.limit === '0') {
        const departments = await departmentService.getAllDepartments();
        return res.json(departments);
    }
    
    // Paginación para la tabla de AdminSettings
    const { departments, totalCount } = await departmentService.getDepartments({ skip, take: limit });

    res.json({
      data: departments,
      totalCount: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const oldDept = await departmentService.getDepartmentById(req.params.id);
    if (!oldDept) return res.status(404).json({ message: "Department not found" });
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const oldDept = await departmentService.getDepartmentById(req.params.id);
    if (!oldDept) return res.status(404).json({ message: "Department not found" });
    await departmentService.deleteDepartment(req.params.id);
    res.json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};