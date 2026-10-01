import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { db } from '../db/database.js';

export async function saveMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const messageId = req.params.id;
  await db.saveResponse(req.user!.id, messageId);
  res.status(200).json({ success: true, data: { message: 'Response saved' } });
}

export async function unsaveMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const messageId = req.params.id;
  await db.removeSavedResponse(req.user!.id, messageId);
  res.status(200).json({ success: true, data: { message: 'Response removed from saved' } });
}

export async function listSaved(req: AuthenticatedRequest, res: Response): Promise<void> {
  const saved = await db.getSavedResponses(req.user!.id);
  res.status(200).json({ success: true, data: saved });
}
