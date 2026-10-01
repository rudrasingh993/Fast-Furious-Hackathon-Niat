import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { knowledgeService } from '../services/knowledge.service.js';
import { db } from '../db/database.js';
import { extractKnowledgeSchema, updateKnowledgeSchema } from '../validators/knowledge.schemas.js';

export async function extractKnowledge(req: AuthenticatedRequest, res: Response): Promise<void> {
  let parsed;
  try {
    parsed = extractKnowledgeSchema.parse(req.body);
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.errors?.[0]?.message || err.message } });
    return;
  }

  const { source_type, source_id, text_content, content, title, conversation_id } = parsed;
  const userId = req.user!.id;

  let textToExtract = text_content || content || '';
  let sourceTitle = title || 'Direct Input';
  let attachmentId: string | null = null;

  if (source_type === 'attachment' && source_id) {
    const att = await db.getAttachmentById(source_id, userId);
    if (att) {
      attachmentId = att.id;
      sourceTitle = att.original_filename;
      textToExtract = att.extracted_text || `Attachment ${att.original_filename}`;
    }
  } else if (source_type === 'conversation' && source_id) {
    const msgs = await db.getMessages(source_id, userId);
    textToExtract = msgs.map((m) => `${m.role}: ${m.content}`).join('\n\n');
    sourceTitle = 'Conversation History';
  }

  const items = await knowledgeService.extractFromText({
    userId,
    conversationId: conversation_id,
    attachmentId,
    text: textToExtract,
    sourceTitle,
  });

  res.status(201).json({ success: true, data: items });
}

export async function listKnowledge(req: AuthenticatedRequest, res: Response): Promise<void> {
  const items = await db.getKnowledgeItems(req.user!.id);
  res.status(200).json({ success: true, data: items });
}

export async function getKnowledge(req: AuthenticatedRequest, res: Response): Promise<void> {
  const item = await db.getKnowledgeItemById(req.params.id, req.user!.id);
  if (!item) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Knowledge item not found' } });
    return;
  }
  res.status(200).json({ success: true, data: item });
}

export async function updateKnowledge(req: AuthenticatedRequest, res: Response): Promise<void> {
  const updates = updateKnowledgeSchema.parse(req.body);
  const updated = await db.updateKnowledgeItem(req.params.id, req.user!.id, updates);
  if (!updated) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Knowledge item not found' } });
    return;
  }
  res.status(200).json({ success: true, data: updated });
}

export async function deleteKnowledge(req: AuthenticatedRequest, res: Response): Promise<void> {
  const success = await db.deleteKnowledgeItem(req.params.id, req.user!.id);
  if (!success) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Knowledge item not found' } });
    return;
  }
  res.status(200).json({ success: true, data: { message: 'Knowledge item deleted' } });
}
