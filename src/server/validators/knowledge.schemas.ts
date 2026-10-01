import { z } from 'zod';

export const extractKnowledgeSchema = z.object({
  source_type: z.enum(['conversation', 'attachment', 'text']).default('text'),
  source_id: z.string().optional(),
  text_content: z.string().optional(),
  content: z.string().optional(),
  title: z.string().optional(),
  conversation_id: z.string().uuid().optional(),
});

export const updateKnowledgeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  knowledge_type: z.string().min(1).max(100).optional(),
  content: z.record(z.any()).optional(),
  confidence: z.number().min(0).max(1).optional(),
});
