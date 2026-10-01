import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { db } from '../db/database.js';
import { createConversationSchema, updateConversationSchema } from '../validators/conversation.schemas.js';

export async function getConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
  const conversations = await db.getConversations(req.user!.id);
  res.status(200).json({ success: true, data: conversations });
}

export async function createConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { title, category } = createConversationSchema.parse(req.body);
  const conv = await db.createConversation({
    user_id: req.user!.id,
    title,
    category,
  });
  res.status(201).json({ success: true, data: conv });
}

export async function getConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  const conv = await db.getConversationById(req.params.id, req.user!.id);
  if (!conv) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Conversation not found' },
    });
    return;
  }
  res.status(200).json({ success: true, data: conv });
}

export async function updateConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  const updates = updateConversationSchema.parse(req.body);
  const updated = await db.updateConversation(req.params.id, req.user!.id, updates);
  if (!updated) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Conversation not found' },
    });
    return;
  }
  res.status(200).json({ success: true, data: updated });
}

export async function deleteConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  const success = await db.deleteConversation(req.params.id, req.user!.id);
  if (!success) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Conversation not found' },
    });
    return;
  }
  res.status(200).json({ success: true, data: { message: 'Conversation deleted successfully' } });
}
