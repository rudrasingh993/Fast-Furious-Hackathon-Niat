import { Router } from 'express';
import {
  getConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
} from '../controllers/conversation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversation);
router.patch('/:id', updateConversation);
router.delete('/:id', deleteConversation);

export default router;
