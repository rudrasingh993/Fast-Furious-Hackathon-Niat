import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { researchService } from '../services/research.service.js';
import { db } from '../db/database.js';
import { createResearchSchema } from '../validators/research.schemas.js';

export async function createResearch(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { objective, conversation_id, title } = createResearchSchema.parse(req.body);
  const userId = req.user!.id;

  const session = await db.createResearchSession({
    user_id: userId,
    conversation_id: conversation_id || null,
    title: title || `Research: ${objective.slice(0, 50)}...`,
    objective,
    research_plan: null,
    queries: [],
    sources: [],
    findings: [],
    contradictions: [],
    synthesis: null,
    citations: [],
    status: 'created',
  });

  // Run asynchronously or start process
  researchService.runDeepResearch({
    sessionId: session.id,
    userId,
    objective,
  }).catch((err) => {
    console.error('Deep research async execution error:', err);
    db.updateResearchSession(session.id, userId, { status: 'failed' });
  });

  res.status(201).json({ success: true, data: session });
}

export async function listResearch(req: AuthenticatedRequest, res: Response): Promise<void> {
  const sessions = await db.getResearchSessions(req.user!.id);
  res.status(200).json({ success: true, data: sessions });
}

export async function getResearch(req: AuthenticatedRequest, res: Response): Promise<void> {
  const session = await db.getResearchSessionById(req.params.id, req.user!.id);
  if (!session) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Research session not found' } });
    return;
  }
  res.status(200).json({ success: true, data: session });
}

export async function runResearch(req: AuthenticatedRequest, res: Response): Promise<void> {
  const session = await db.getResearchSessionById(req.params.id, req.user!.id);
  if (!session) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Research session not found' } });
    return;
  }

  const result = await researchService.runDeepResearch({
    sessionId: session.id,
    userId: req.user!.id,
    objective: session.objective,
  });

  res.status(200).json({ success: true, data: result });
}

export async function deleteResearch(req: AuthenticatedRequest, res: Response): Promise<void> {
  const success = await db.deleteResearchSession(req.params.id, req.user!.id);
  if (!success) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Research session not found' } });
    return;
  }
  res.status(200).json({ success: true, data: { message: 'Research session deleted' } });
}
