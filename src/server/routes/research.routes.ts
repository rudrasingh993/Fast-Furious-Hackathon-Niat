import { Router } from 'express';
import {
  createResearch,
  listResearch,
  getResearch,
  runResearch,
  deleteResearch,
} from '../controllers/research.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);
router.use(apiLimiter);

router.post('/', createResearch);
router.get('/', listResearch);
router.get('/:id', getResearch);
router.post('/:id/run', runResearch);
router.delete('/:id', deleteResearch);

export default router;
