// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import * as auditService from "../services/audit.service.js"; // 👈 IMPORTAR SERVICIO

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
    // No hay token, retornamos 401
    return res.status(401).json({ error: "No autorizado: Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// ✅ Verifica si el rol tiene permisos (CON AUDITORÍA DE SEGURIDAD)
export const verifyRole = (roles) => {
  return async (req, res, next) => { // 👈 Ahora es async para poder guardar el log
    if (!roles.includes(req.user.rol)) {
      
      // 📝 REGISTRAR INTENTO DE ACCESO NO AUTORIZADO
      try {
          // Intentamos registrar, pero usamos try/catch para que un error en el log
          // no tire el servidor, aunque el bloqueo de seguridad (403) se mantiene.
          await auditService.logActivity({
              action: 'UNAUTHORIZED_ACCESS',
              entity: 'Security',
              entityId: 0, // ID genérico para eventos de seguridad
              user: req.user,
              details: `Acceso denegado. Intentó acceder a: ${req.method} ${req.originalUrl}. Roles requeridos: [${roles.join(', ')}]. Rol del usuario: ${req.user.rol}`
          });
      } catch (logError) {
          console.error("Error al registrar auditoría de seguridad:", logError);
      }

      return res.status(403).json({ error: "No tienes permisos para esta acción" });
    }
    next();
  };
};