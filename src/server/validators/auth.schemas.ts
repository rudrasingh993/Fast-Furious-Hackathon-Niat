import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .refine((val) => /\S/.test(val), 'Password cannot consist solely of whitespace'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const sendOtpSchema = z.object({
  type: z.enum(['email', 'phone']),
  target: z.string().min(3, 'Email or phone number is required'),
});

export const verifyOtpSchema = z.object({
  type: z.enum(['email', 'phone']),
  target: z.string().min(3, 'Email or phone number is required'),
  code: z.string().min(4, 'Verification code is required').max(10),
  name: z.string().optional(),
});

export const googleAuthSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().optional(),
  credential: z.string().optional(),
});
