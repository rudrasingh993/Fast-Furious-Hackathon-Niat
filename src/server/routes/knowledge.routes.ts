import { Router } from 'express';
import {
  extractKnowledge,
  listKnowledge,
  getKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from '../controllers/knowledge.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);
router.use(apiLimiter);

router.post('/extract', extractKnowledge);
router.get('/', listKnowledge);
router.get('/:id', getKnowledge);
router.patch('/:id', updateKnowledge);
router.delete('/:id', deleteKnowledge);

export default router;
