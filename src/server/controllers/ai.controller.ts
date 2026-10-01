import type { Response } from 'express';
import fs from 'fs';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { geminiService } from '../services/gemini.service.js';
import { db } from '../db/database.js';
import { storageService } from '../services/storage.service.js';

export async function analyze(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { attachment_id, prompt } = req.body;
  if (!attachment_id) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'attachment_id is required' } });
    return;
  }

  const att = await db.getAttachmentById(attachment_id, req.user!.id);
  if (!att) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Attachment not found' } });
    return;
  }

  let buffer: Buffer = Buffer.alloc(0);
  const localPath = storageService.getLocalFilePath(att.storage_path);
  if (localPath && fs.existsSync(localPath)) {
    buffer = fs.readFileSync(localPath);
  }

  let result: any = null;
  if (att.media_type === 'image') {
    result = await geminiService.analyzeImage(buffer, att.mime_type, prompt);
  } else if (att.media_type === 'audio') {
    result = await geminiService.analyzeAudio(buffer, att.mime_type, prompt);
  } else if (att.media_type === 'video') {
    result = await geminiService.analyzeVideo(buffer, att.mime_type, prompt);
  } else if (att.media_type === 'document') {
    result = await geminiService.analyzeDocument(att.extracted_text || '', att.original_filename);
  } else {
    result = { summary: `Analyzed ${att.original_filename}` };
  }

  res.status(200).json({ success: true, data: result });
}

export async function analyzeImage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const file = req.file;
  const prompt = req.body.prompt;
  if (!file) {
    res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'Image file required' } });
    return;
  }
  const result = await geminiService.analyzeImage(file.buffer, file.mimetype, prompt);
  res.status(200).json({ success: true, data: result });
}

export async function analyzeAudio(req: AuthenticatedRequest, res: Response): Promise<void> {
  const file = req.file;
  const prompt = req.body.prompt;
  if (!file) {
    res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'Audio file required' } });
    return;
  }
  const result = await geminiService.analyzeAudio(file.buffer, file.mimetype, prompt);
  res.status(200).json({ success: true, data: result });
}

export async function analyzeVideo(req: AuthenticatedRequest, res: Response): Promise<void> {
  const file = req.file;
  const prompt = req.body.prompt;
  if (!file) {
    res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'Video file required' } });
    return;
  }
  const result = await geminiService.analyzeVideo(file.buffer, file.mimetype, prompt);
  res.status(200).json({ success: true, data: result });
}

export async function analyzeDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { text, title } = req.body;
  if (!text) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Document text required' } });
    return;
  }
  const result = await geminiService.analyzeDocument(text, title || 'Document');
  res.status(200).json({ success: true, data: result });
}
