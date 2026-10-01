import { Router } from 'express';
import { saveMessage, unsaveMessage, listSaved } from '../controllers/saved.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/messages/:id/save', requireAuth, saveMessage);
router.delete('/messages/:id/save', requireAuth, unsaveMessage);
router.get('/saved', requireAuth, listSaved);

export default router;
