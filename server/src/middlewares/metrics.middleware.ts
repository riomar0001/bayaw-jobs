import { Request, Response, NextFunction } from 'express';
import {
  httpRequestsTotal,
  httpRequestDurationSeconds,
  httpActiveConnections,
  httpErrorsTotal,
} from '@/configs/metrics.config';

/**
 * Normalizes dynamic route params like /api/jobs/123 → /api/jobs/:id
 * Falls back to the matched Express route pattern when available.
 */
function normalizeRoute(req: Request): string {
  if (req.route?.path) {
    // Build full path from matched router base + route pattern
    const baseUrl = req.baseUrl || '';
    return `${baseUrl}${req.route.path}`;
  }
  // Strip numeric/UUID segments to avoid high-cardinality labels
  return req.path.replace(/\/[0-9a-f-]{8,}(\/|$)/gi, '/:id$1').replace(/\/\d+(\/|$)/g, '/:id$1');
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();
  httpActiveConnections.inc();

  res.on('finish', () => {
    const durationNs = process.hrtime.bigint() - startTime;
    const durationSec = Number(durationNs) / 1e9;

    const route = normalizeRoute(req);
    const method = req.method;
    const statusCode = String(res.statusCode);

    httpRequestsTotal.inc({ method, route, status_code: statusCode });
    httpRequestDurationSeconds.observe({ method, route, status_code: statusCode }, durationSec);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({ method, route, status_code: statusCode });
    }

    httpActiveConnections.dec();
  });

  next();
}

/**
 * Bearer token auth guard for /metrics — only Prometheus scraper should access this.
 * Set METRICS_TOKEN in env; Prometheus passes it via the authorization header.
 */
export function metricsAuth(req: Request, res: Response, next: NextFunction): void {
  const metricsToken = process.env.METRICS_TOKEN;

  // If no token is configured, block access entirely in production
  if (!metricsToken) {
    if (process.env.NODE_ENV === 'production') {
      res.status(503).json({ error: 'Metrics endpoint not configured' });
      return;
    }
    // Allow unauthenticated access in development
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.slice(7);
  if (token !== metricsToken) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}
