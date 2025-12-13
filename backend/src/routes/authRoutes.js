import express from 'express';
import auth from '../controllers/auth.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes - apply auth rate limiter untuk prevent brute force
router.post('/login', authRateLimiter, auth.login);

// Protected routes
router.get('/profile', authenticate, auth.getProfile);

export default router;