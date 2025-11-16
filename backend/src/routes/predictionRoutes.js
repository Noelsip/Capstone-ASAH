import express from 'express';
import { getLatestPrediction } from '../controllers/predictionController.js';

const router = express.Router();

router.get("/latest", getLatestPrediction);

export default router;