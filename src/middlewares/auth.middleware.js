// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Verifica si el token es válido
export const verifyToken = (req, res, next) => {
  let token = null;

  // 1. Primero, intentar obtener el token de las cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  
  // 2. Si no está en las cookies, buscar en el Header 'Authorization'
  else if (req.headers["authorization"]) {
    const authHeader = req.headers["authorization"];
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    // No hay token, retornamos 401 sin imprimir nada en consola
    return res.status(401).json({ error: "No autorizado: Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    // Solo imprimimos el error real si algo falla en la verificación
    console.error("Error al verificar el token:", error.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// ✅ Verifica si el rol tiene permisos
export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: "No tienes permisos para esta acción" });
    }
    next();
  };
};