import express from 'express';
import chatBotController from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - memerlukan autentikasi
router.post('/message', authMiddleware.authenticate, chatBotController.sendMessage);
router.get('/conversations', authMiddleware.authenticate, chatBotController.getUserConversations);
router.post('/conversations', authMiddleware.authenticate, chatBotController.createConversation);
router.get('/conversations/:id/messages', authMiddleware.authenticate, chatBotController.getConversationMessages);

export default router;