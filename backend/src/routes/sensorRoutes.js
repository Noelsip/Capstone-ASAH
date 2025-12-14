import express from 'express';
import sensorController from '../controllers/sensorController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { sensorRateLimiter } from '../middleware/rateLimiter.js';
import { validateSensorData, validateBatchSensorData } from '../middleware/sensorValidation.js';

const router = express.Router();

// Create sensor data (POST /sensor-data)
router.post('/', 
  validateSensorData,
  authenticate, 
  sensorRateLimiter, 
  sensorController.createSensorData
);

// Create batch sensor data (POST /sensor-data/batch)
router.post('/batch', 
  validateBatchSensorData,
  authenticate, 
  sensorRateLimiter, 
  sensorController.createBatchSensorData
);

// Get latest sensor reading (GET /sensor-data/latest?machine_serial=M001-A)
router.get('/latest', 
  authenticate, 
  sensorController.getLatestSensor
);

// Get aggregated data for charting (GET /sensor-data/aggregated)
router.get('/aggregated', 
  authenticate, 
  sensorController.getAggregatedSensorData
);

// Get sensor statistics (GET /sensor-data/stats)
router.get('/stats', 
  authenticate, 
  sensorController.getSensorStats
);

// Get sensor history (GET /sensor-data?machine_serial=M001-A)
router.get('/', 
  authenticate, 
  sensorController.getSensorHistory
);

export default router;