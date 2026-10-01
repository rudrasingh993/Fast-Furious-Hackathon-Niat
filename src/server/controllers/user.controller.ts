import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { db } from '../db/database.js';
import { updateProfileSchema, updatePreferencesSchema } from '../validators/user.schemas.js';

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await db.getUserById(req.user!.id);
  res.status(200).json({ success: true, data: user });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const updates = updateProfileSchema.parse(req.body);
    const updated = await db.updateUser(req.user!.id, updates);
    res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
}

export async function getPreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
  const prefs = await db.getPreferences(req.user!.id);
  const user = await db.getUserById(req.user!.id);
  res.status(200).json({
    success: true,
    data: {
      ...prefs,
      preferences: prefs,
      user_preferences: {
        response_style: user?.response_style,
        response_length: user?.response_length,
        preferred_language: user?.preferred_language,
      },
    },
  });
}

export async function updatePreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const body = req.body || {};
    const userId = req.user!.id;

    // Support key-value preferences
    if (body.preference_key) {
      await db.setPreference(userId, body.preference_key, body.preference_value || {});
    }

    // Support direct response preferences
    const profileUpdates: any = {};
    if (body.response_style || body.responseStyle) {
      profileUpdates.response_style = body.response_style || body.responseStyle;
    }
    if (body.response_length || body.responseLength) {
      profileUpdates.response_length = body.response_length || body.responseLength;
    }
    if (body.preferred_language || body.preferredLanguage) {
      profileUpdates.preferred_language = body.preferred_language || body.preferredLanguage;
    }

    let updatedUser = null;
    if (Object.keys(profileUpdates).length > 0) {
      updatedUser = await db.updateUser(userId, profileUpdates);
    }

    const prefs = await db.getPreferences(userId);
    res.status(200).json({
      success: true,
      data: {
        ...prefs,
        preferences: prefs,
        user: updatedUser || (await db.getUserById(userId)),
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
}
