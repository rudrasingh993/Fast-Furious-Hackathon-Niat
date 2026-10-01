import { Router } from 'express';
import { getProfile, updateProfile, getPreferences, updatePreferences } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/preferences', getPreferences);
router.patch('/preferences', updatePreferences);

export default router;
