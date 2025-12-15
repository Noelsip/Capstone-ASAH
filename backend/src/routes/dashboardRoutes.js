import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', authenticate, dashboardController.getDashboardSummary);
router.get('/trends', authenticate, dashboardController.getDashboardTrends); 

export default router;