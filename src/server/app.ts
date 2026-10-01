import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // allow iframe embedding of landing scenes and media previews
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        if (
          origin === config.frontendUrl ||
          origin === config.appUrl ||
          origin.startsWith('http://localhost') ||
          origin.startsWith('http://127.0.0.1')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Request parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Mount API routes
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
