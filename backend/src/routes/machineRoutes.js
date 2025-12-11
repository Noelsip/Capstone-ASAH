import express from 'express';
import { getMachines } from '../controllers/machineController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all machine routes - only authenticated users
router.use(authMiddleware.verifyToken);

router.get("/", getMachines);

export default router;