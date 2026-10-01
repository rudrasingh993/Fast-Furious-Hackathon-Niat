import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { webSearchService } from '../services/webSearch.service.js';
import { db } from '../db/database.js';
import { webSearchSchema } from '../validators/search.schemas.js';

export async function searchWeb(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { query, conversation_id } = webSearchSchema.parse(req.body);
  const userId = req.user!.id;

  const result = await webSearchService.searchWeb(query);

  const webSearchRecord = await db.createWebSearch({
    user_id: userId,
    conversation_id: conversation_id || null,
    message_id: null,
    query,
    search_queries: result.queriesUsed,
    sources: result.sources,
  });

  res.status(200).json({
    success: true,
    data: {
      ...result,
      searchId: webSearchRecord.id,
    },
  });
}

export async function getSearch(req: AuthenticatedRequest, res: Response): Promise<void> {
  const record = await db.getWebSearchById(req.params.id, req.user!.id);
  if (!record) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Search record not found' } });
    return;
  }
  res.status(200).json({ success: true, data: record });
}

// Unified search for /app/search (web + conversations + knowledge)
export async function searchAll(req: AuthenticatedRequest, res: Response): Promise<void> {
  const query = (req.query.q as string) || '';
  const userId = req.user!.id;

  if (!query) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Query parameter q required' } });
    return;
  }

  // Search user's conversations
  const conversations = await db.getConversations(userId);
  const matchedConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  // Search user's knowledge items
  const knowledge = await db.getKnowledgeItems(userId);
  const matchedKnowledge = knowledge.filter(
    (k) =>
      k.title.toLowerCase().includes(query.toLowerCase()) ||
      JSON.stringify(k.content).toLowerCase().includes(query.toLowerCase())
  );

  // Web search
  const webResult = await webSearchService.searchWeb(query);

  res.status(200).json({
    success: true,
    data: {
      query,
      web: webResult,
      conversations: matchedConversations,
      knowledge: matchedKnowledge,
    },
  });
}
