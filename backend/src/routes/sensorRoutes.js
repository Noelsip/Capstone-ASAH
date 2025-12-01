import express from 'express';
import { getLatestSensor } from '../controllers/sensorController.js';

const router = express.Router();

router.get("/latest", getLatestSensor);

export default router;