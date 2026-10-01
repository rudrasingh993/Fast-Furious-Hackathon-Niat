import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  appUrl: process.env.APP_URL || 'https://multi-mind-ai-phi.vercel.app',
  apiUrl: process.env.API_URL || 'https://multi-mind-ai-phi.vercel.app',
  frontendUrl: process.env.FRONTEND_URL || 'https://multi-mind-ai-phi.vercel.app',

  jwt: {
    secret: process.env.JWT_SECRET || 'mosaic_ai_jwt_super_secret_dev_key_2026_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'mosaic_ai_jwt_refresh_super_secret_dev_key_2026',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    fallbackModels: (process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash,gemini-2.0-flash,gemini-2.0-flash-lite,gemini-1.5-flash,gemini-1.5-flash-8b,gemini-1.5-pro')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean),
  },

  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '',
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'user-files',
    jwksUrl: process.env.SUPABASE_JWKS_URL || '',
    jwksKeys: process.env.SUPABASE_JWKS_KEYS || '',
  },

  limits: {
    maxImageSizeMb: parseInt(process.env.MAX_IMAGE_SIZE_MB || '15', 10),
    maxAudioSizeMb: parseInt(process.env.MAX_AUDIO_SIZE_MB || '50', 10),
    maxVideoSizeMb: parseInt(process.env.MAX_VIDEO_SIZE_MB || '250', 10),
    maxDocumentSizeMb: parseInt(process.env.MAX_DOCUMENT_SIZE_MB || '50', 10),
  },

  research: {
    maxRounds: parseInt(process.env.MAX_RESEARCH_ROUNDS || '4', 10),
    maxQueriesPerRound: parseInt(process.env.MAX_SEARCH_QUERIES_PER_ROUND || '5', 10),
    maxSources: parseInt(process.env.MAX_RESEARCH_SOURCES || '20', 10),
    maxSynthesisSources: 12,
  },

  rateLimits: {
    aiPerMinute: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '20', 10),
    searchPerMinute: parseInt(process.env.SEARCH_RATE_LIMIT_PER_MINUTE || '10', 10),
    researchPerHour: parseInt(process.env.RESEARCH_RATE_LIMIT_PER_HOUR || '5', 10),
  },
};
