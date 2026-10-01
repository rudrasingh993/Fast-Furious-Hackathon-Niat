import { Router } from 'express';
import {
  getMessages,
  createMessage,
  streamMessage,
  regenerateMessage,
  deleteMessage,
} from '../controllers/message.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/conversations/:id/messages', requireAuth, getMessages);
router.post('/conversations/:id/messages', requireAuth, apiLimiter, createMessage);
router.post('/conversations/:id/messages/stream', requireAuth, apiLimiter, streamMessage);
router.post('/messages/:id/regenerate', requireAuth, apiLimiter, regenerateMessage);
router.delete('/messages/:id', requireAuth, deleteMessage);

export default router;
