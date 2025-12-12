import express from 'express';
import { getLatestPrediction } from '../controllers/predictionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect predictions routes - only authenticated users
router.use(authMiddleware.verifyToken);

router.get("/latest", getLatestPrediction);

export default router;