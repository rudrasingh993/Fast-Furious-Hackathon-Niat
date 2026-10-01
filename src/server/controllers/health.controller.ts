import type { Request, Response } from 'express';

export function getHealth(req: Request, res: Response): void {
  res.status(200).json({
    ok: true,
    service: 'multimind-ai-api',
    appName: 'Multi Mind AI',
    timestamp: new Date().toISOString(),
  });
}
