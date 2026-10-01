import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  preferred_language: z.string().min(2).max(10).optional(),
  response_style: z.enum(['concise', 'balanced', 'detailed']).optional(),
  response_length: z.enum(['short', 'medium', 'long']).optional(),
  onboarding_completed: z.boolean().optional(),
});

export const updatePreferencesSchema = z.object({
  preference_key: z.string().min(1).max(100),
  preference_value: z.record(z.any()),
});
