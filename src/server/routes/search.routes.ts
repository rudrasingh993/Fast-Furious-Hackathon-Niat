import { Router } from 'express';
import { searchWeb, getSearch, searchAll } from '../controllers/search.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);
router.use(apiLimiter);

router.post('/web', searchWeb);
router.get('/unified', searchAll);
router.get('/:id', getSearch);

export default router;
