import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z.string().optional().nullable(),
  prompt: z.string().optional().nullable(),
  attachment_ids: z.array(z.string().uuid()).optional(),
  enable_web_search: z.boolean().optional(),
  enable_deep_research: z.boolean().optional(),
  mode: z.enum(['normal', 'search', 'research', 'analyze', 'generate', 'extract']).optional(),
}).transform((data) => ({
  ...data,
  content: data.content || data.prompt || '',
})).refine((data) => (data.content && data.content.trim().length > 0) || (data.attachment_ids && data.attachment_ids.length > 0), {
  message: 'Message must contain either text content or at least one attachment',
});

export const regenerateMessageSchema = z.object({
  enable_web_search: z.boolean().optional(),
  enable_deep_research: z.boolean().optional(),
});
