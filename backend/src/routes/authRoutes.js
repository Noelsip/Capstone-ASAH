import express from 'express';
import auth from '../controllers/auth.js';
import authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', auth.login);

// Protected routes
router.get('/profile', authMiddleware.verifyToken, auth.getProfile);

export default router;