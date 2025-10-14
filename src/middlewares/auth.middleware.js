import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Verifica si el token es válido
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  // 👈 Agrega estas líneas para depuración
  if (!token) {
    console.log("Error: Token no recibido.");
    return res.status(403).json({ error: "Token requerido" });
  }
  console.log("Token recibido:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario dentro del request
    console.log("Token decodificado. Usuario:", req.user);
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// ✅ Verifica si el rol tiene permisos
export const verifyRole = (roles) => {
  return (req, res, next) => {
    // 👈 Agrega esta línea para depuración
    console.log("Verificando rol. Rol del usuario:", req.user.rol, "| Roles permitidos:", roles);

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: "No tienes permisos para esta acción" });
    }
    next();
  };
};