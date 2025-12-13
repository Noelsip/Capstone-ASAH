import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startWith('Bearer ')) {
            return res.status(401).json({
                message: 'Token tidak ditemukan'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.uSERS.findUnique({
            where: { id: decoded.userId },
            include: {role: true}
        });

        if (!user) {
            return res.status(401).json({
                message: 'User tidak ditemukan'
            });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token tidak valid'
            });
        }

        if (error.name == 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token telah kadaluarsa'
            });
        }

        return res.status(500).json({
            message: 'Terjadi kesalahan pada server'
        });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'User tidak terautentikasi'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Akses ditolak'
            });
        }

        next();
    };
};

export { authenticate, authorize };