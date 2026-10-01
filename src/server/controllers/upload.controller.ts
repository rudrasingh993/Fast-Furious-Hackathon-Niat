import type { Response } from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { db } from '../db/database.js';
import { fileService } from '../services/file.service.js';
import { storageService } from '../services/storage.service.js';

export async function uploadFile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file provided in request' } });
    return;
  }

  const userId = req.user!.id;
  const conversationId = (req.body.conversation_id as string) || null;
  const attachmentId = uuidv4();

  const mediaType = fileService.determineMediaType(file.mimetype, file.originalname);

  // Extract text and metadata
  const { text, metadata } = await fileService.extractContent(
    file.buffer,
    file.mimetype,
    file.originalname
  );

  // Save to storage (Supabase / local)
  const { storagePath, url } = await storageService.saveFile({
    userId,
    conversationId,
    attachmentId,
    filename: file.originalname,
    buffer: file.buffer,
    mimeType: file.mimetype,
  });

  // Create attachment record
  const attachment = await db.createAttachment({
    user_id: userId,
    conversation_id: conversationId,
    message_id: null,
    original_filename: file.originalname,
    storage_path: storagePath,
    mime_type: file.mimetype,
    media_type: mediaType,
    file_size: file.size,
    checksum: null,
    processing_status: 'processed',
    extracted_text: text,
    extracted_metadata: metadata,
  });

  res.status(201).json({
    success: true,
    data: {
      ...attachment,
      url,
    },
  });
}

export async function getUpload(req: AuthenticatedRequest, res: Response): Promise<void> {
  const attachment = await db.getAttachmentById(req.params.id, req.user!.id);
  if (!attachment) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Attachment not found' } });
    return;
  }
  const url = await storageService.getSignedUrl(attachment.storage_path);
  res.status(200).json({ success: true, data: { ...attachment, url } });
}

export async function listUploads(req: AuthenticatedRequest, res: Response): Promise<void> {
  const list = await db.getAttachmentsByUser(req.user!.id);
  res.status(200).json({ success: true, data: list });
}

export async function getSignedUrl(req: AuthenticatedRequest, res: Response): Promise<void> {
  const attachment = await db.getAttachmentById(req.params.id, req.user!.id);
  if (!attachment) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Attachment not found' } });
    return;
  }
  const url = await storageService.getSignedUrl(attachment.storage_path);
  res.status(200).json({ success: true, data: { url } });
}

export async function deleteUpload(req: AuthenticatedRequest, res: Response): Promise<void> {
  const attachment = await db.getAttachmentById(req.params.id, req.user!.id);
  if (!attachment) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Attachment not found' } });
    return;
  }

  await storageService.deleteFile(attachment.storage_path);
  await db.deleteAttachment(attachment.id, req.user!.id);
  res.status(200).json({ success: true, data: { message: 'Attachment deleted successfully' } });
}

export async function downloadFile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const attachment = await db.getAttachmentById(req.params.id, req.user!.id);
  if (!attachment) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Attachment not found' } });
    return;
  }

  const localPath = storageService.getLocalFilePath(attachment.storage_path);
  if (localPath && fs.existsSync(localPath)) {
    res.setHeader('Content-Type', attachment.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="${attachment.original_filename}"`);
    fs.createReadStream(localPath).pipe(res);
  } else {
    // Redirect to signed URL if hosted on Supabase
    const url = await storageService.getSignedUrl(attachment.storage_path);
    res.redirect(url);
  }
}
