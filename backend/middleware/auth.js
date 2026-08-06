// backend/middleware/auth.js - VERSIÓN CORREGIDA
const jwt = require('jsonwebtoken');
const { Session } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      if (process.env.NODE_ENV !== 'production') console.log('❌ No hay header de autorización');
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado: Token no proporcionado' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      if (process.env.NODE_ENV !== 'production') console.log('❌ No hay token en el header');
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado: Token inválido' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      if (process.env.NODE_ENV !== 'production') console.log('❌ Token inválido o sin id');
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado: Token inválido' 
      });
    }

    // Verificar contra sesión activa
    const session = await Session.findOne({ where: { token, isActive: true } });
    if (!session) {
      return res.status(401).json({ success: false, message: 'Sesión revocada o inactiva' });
    }

    // Asignar usuario a req
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      assignedLevel: decoded.assignedLevel
    };
    
    if (process.env.NODE_ENV !== 'production') console.log('✅ Usuario autenticado:', req.user.id);
    next();
    
  } catch (error) {
    console.error('❌ Error en authMiddleware:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Error en autenticación' 
    });
  }
};

// Middleware para verificar si es admin
const adminMiddleware = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado: Se requiere rol de administrador' 
    });
  }
  next();
};

// Middleware para verificar si es teacher
const teacherMiddleware = async (req, res, next) => {
  if (!req.user || (req.user.role !== 'teacher' && req.user.role !== 'admin')) {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado: Se requiere rol de profesor o administrador' 
    });
  }
  next();
};

module.exports = { 
  authMiddleware, 
  adminMiddleware, 
  teacherMiddleware 
};