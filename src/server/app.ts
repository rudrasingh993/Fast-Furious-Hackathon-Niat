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
          origin.includes('multi-mind-ai') ||
          origin.includes('.vercel.app') ||
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

  // Serve compiled frontend files if dist exists
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));

  // SPA fallback for all web page requests (e.g. OAuth redirects with #access_token)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        // Fallback for dev mode where Vite might be on port 5173
        res.send(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Multi Mind AI - Connecting</title></head>
<body style="background:#070b12;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
  <p>Connecting to Multi Mind AI...</p>
  <script>
    window.location.replace('${config.frontendUrl}' + window.location.pathname + window.location.search + window.location.hash);
  </script>
</body>
</html>`);
      }
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
