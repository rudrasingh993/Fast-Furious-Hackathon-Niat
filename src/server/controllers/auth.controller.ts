import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { authService } from '../services/auth.service.js';
import { db } from '../db/database.js';
import { signupSchema, loginSchema, refreshSchema } from '../validators/auth.schemas.js';

export async function signup(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    const result = await authService.signup(name, email, password);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    const isDuplicate = err.message?.includes('already exists');
    res.status(isDuplicate ? 409 : 400).json({
      success: false,
      error: {
        code: isDuplicate ? 'DUPLICATE_EMAIL' : 'SIGNUP_ERROR',
        message: err.message || 'Signup failed',
      },
    });
  }
}

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: err.message || 'Invalid email or password',
      },
    });
  }
}

export async function refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await authService.refresh(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: err.message || 'Invalid refresh token',
      },
    });
  }
}

export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await db.getUserById(req.user!.id);
  if (!user) {
    res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' },
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: user,
  });
}

export async function sendOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { type, target } = req.body;
    if (!type || !target) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'Both type (email/phone) and destination are required' },
      });
      return;
    }

    const result = await authService.sendOtp(type, target);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'OTP_SEND_ERROR', message: err.message || 'Failed to send OTP' },
    });
  }
}

export async function verifyOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { type, target, code, name } = req.body;
    if (!type || !target || !code) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'Type, target, and verification code are required' },
      });
      return;
    }

    const result = await authService.verifyOtp(type, target, code, name);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'OTP_VERIFY_ERROR', message: err.message || 'Failed to verify OTP' },
    });
  }
}

export async function googleAuth(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, name, avatarUrl } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'Email is required for Google Sign-In' },
      });
      return;
    }

    const result = await authService.googleAuth({ email, name, avatarUrl });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'GOOGLE_AUTH_ERROR', message: err.message || 'Google Sign-In failed' },
    });
  }
}
