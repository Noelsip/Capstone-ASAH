import express from 'express';
import { getLatestSensor } from '../controllers/sensorController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect sensor-data routes - only authenticated users
router.use(authMiddleware.verifyToken);

router.get("/latest", getLatestSensor);

export default router;