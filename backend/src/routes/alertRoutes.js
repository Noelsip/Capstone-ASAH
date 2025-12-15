import express from "express";
import { authenticate } from '../middleware/authMiddleware.js';
import alertController from "../controllers/alertController.js";

const router = express.Router();

router.post('/:id/acknowledge', authenticate, alertController.acknowledgeAlert);
router.get('/:id', authenticate, alertController.getAlertDetail);
export default router;