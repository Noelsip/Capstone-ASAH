import express from 'express';
import machineController from '../controllers/machineController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all machines (GET /machines)
router.get('/', authenticate, machineController.getMachines);

// Get machine detail (GET /machines/:serial)
router.get('/:serial', authenticate, machineController.getMachineDetail);

// Update machine status (PATCH /machines/:serial/status)
router.patch('/:serial/status', authenticate, machineController.updateMachineStatus);

export default router;