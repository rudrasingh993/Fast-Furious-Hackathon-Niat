import { z } from 'zod';

export const createResearchSchema = z.object({
  objective: z.string().min(3, 'Objective must be at least 3 characters').max(1000),
  conversation_id: z.string().uuid().optional(),
  title: z.string().max(200).optional(),
});
