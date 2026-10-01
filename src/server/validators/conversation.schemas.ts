import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
});

export const updateConversationSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  category: z.string().max(50).optional(),
  summary: z.string().optional().nullable(),
  is_archived: z.boolean().optional(),
});
