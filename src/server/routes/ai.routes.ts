import { Router } from 'express';
import {
  analyze,
  analyzeImage,
  analyzeAudio,
  analyzeVideo,
  analyzeDocument,
} from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);
router.use(apiLimiter);

router.post('/analyze', analyze);
router.post('/analyze/image', uploadMiddleware.single('file'), analyzeImage);
router.post('/analyze/audio', uploadMiddleware.single('file'), analyzeAudio);
router.post('/analyze/video', uploadMiddleware.single('file'), analyzeVideo);
router.post('/analyze/document', analyzeDocument);

export default router;
