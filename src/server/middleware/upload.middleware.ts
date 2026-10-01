import multer from 'multer';
import type { Request } from 'express';
import { config } from '../config/env.js';

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Audio
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
  'audio/x-m4a',
  'audio/m4a',
  'audio/aac',
  // Video
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const mime = file.mimetype.toLowerCase();
  const ext = file.originalname.split('.').pop()?.toLowerCase() || '';

  // Check MIME or extension
  const isAllowedExt = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'gif',
    'svg',
    'mp3',
    'wav',
    'webm',
    'ogg',
    'm4a',
    'aac',
    'mp4',
    'mov',
    'avi',
    'pdf',
    'doc',
    'docx',
    'txt',
    'md',
    'csv',
    'json',
  ].includes(ext);

  if (allowedMimeTypes.includes(mime) || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype} (.${ext})`));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: config.limits.maxVideoSizeMb * 1024 * 1024, // max limit covers video (250MB)
  },
  fileFilter,
});
