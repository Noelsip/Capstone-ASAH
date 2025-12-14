import express from 'express';
import predictionController from '../controllers/predictionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - memerlukan autentikasi
router.post('/analize', authMiddleware.authenticate, predictionController.analyzeMaintenance)
router.get('/', authMiddleware.authenticate, predictionController.getPredictions);
router.get('/latest', authMiddleware.authenticate, predictionController.getLatestPrediction);
export default router;