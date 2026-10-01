import { z } from 'zod';

export const webSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(500),
  conversation_id: z.string().uuid().optional(),
});
