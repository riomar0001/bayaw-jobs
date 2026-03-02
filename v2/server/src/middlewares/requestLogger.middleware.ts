import { Request, Response, NextFunction } from 'express';
import logger, { requestFileLogger, responseFileLogger } from '@/configs/logger.config';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // ── Log incoming request ───────────────────────────────────────────────────
  const requestEntry = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    body: req.body ?? {},
  };

  requestFileLogger.info('Incoming request', requestEntry);

  // ── Capture response body via res.json interception ───────────────────────
  const originalJson = res.json.bind(res);
  let responseBody: unknown;

  res.json = (body: unknown) => {
    responseBody = body;
    return originalJson(body);
  };

  // ── Log response on finish ─────────────────────────────────────────────────
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    const responseEntry = {
      method,
      url: originalUrl,
      ip,
      status: statusCode,
      duration_ms: duration,
      body: responseBody ?? null,
    };

    responseFileLogger.info('Outgoing response', responseEntry);

    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    logger[level](`${method} ${originalUrl} ${statusCode} - ${duration}ms`, {
      method,
      url: originalUrl,
      status: statusCode,
      duration,
      ip,
    });
  });

  next();
};
