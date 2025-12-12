import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token tidak ditemukan'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token sudah expired'
            })
        }

        return res.status(401).json({
            error: 'Token tidak valid'
        })
    }
};

// Middleware untuk memeriksa role
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized'
            })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Akses ditolak'
            })
        }

        next();
    };
};

export default {
    verifyToken,
    requireRole
}