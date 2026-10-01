import { Router } from 'express';
import {
  uploadFile,
  getUpload,
  listUploads,
  deleteUpload,
  getSignedUrl,
  downloadFile,
} from '../controllers/upload.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', uploadMiddleware.single('file'), uploadFile);
router.get('/', listUploads);
router.get('/:id', getUpload);
router.get('/:id/signed-url', getSignedUrl);
router.get('/:id/download', downloadFile);
router.delete('/:id', deleteUpload);

export default router;
