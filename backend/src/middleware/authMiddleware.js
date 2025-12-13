import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Middleware untuk autentikasi JWT
 * Memverifikasi token dan mengambil data user dari database
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak ditemukan'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.uSERS.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'User tidak ditemukan atau tidak aktif'
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.user_email,
      role: user.role.role_name,
      roleId: user.role_id
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token telah kadaluarsa'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
};

/**
 * Middleware untuk otorisasi berdasarkan role
 * @param {...string} allowedRoles - Daftar role yang diizinkan
 * @example authorize('Admin', 'Supervisor')
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User tidak terautentikasi'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Role Anda tidak memiliki izin untuk endpoint ini',
        required_roles: allowedRoles,
        your_role: req.user.role
      });
    }

    next();
  };
};

/**
 * Alias untuk authorize (backward compatibility)
 */
export const requireRole = (...roles) => authorize(...roles);

// Default export untuk backward compatibility
export default {
  authenticate,
  authorize,
  requireRole
};