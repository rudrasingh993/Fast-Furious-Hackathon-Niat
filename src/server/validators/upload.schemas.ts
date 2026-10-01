import { z } from 'zod';

export const uploadQuerySchema = z.object({
  conversation_id: z.string().uuid().optional(),
  media_type: z.enum(['image', 'audio', 'video', 'document', 'other']).optional(),
});
