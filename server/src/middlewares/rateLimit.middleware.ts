import { env } from 'cloudflare:workers';
import { Request, Response, NextFunction } from 'express';
import { TooManyRequestsError } from '@/utils/errors.util';
import { securityEventService } from '@/services/securityEvent.service';
import { security_event_type } from '@/generated/prisma/client';
import logger from '@/configs/logger.config';

// Limits live in wrangler.jsonc ("ratelimits"). The binding only supports
// 10s or 60s windows and counts per Cloudflare location, not globally.
const PUBLIC_GET_SKIP_PATHS = ['/api/jobs', '/api/companies'];

type LimiterName = 'general' | 'auth' | 'strict';

function binding(name: LimiterName): RateLimit {
  switch (name) {
    case 'general':
      return env.GENERAL_RATE_LIMITER;
    case 'auth':
      return env.AUTH_RATE_LIMITER;
    case 'strict':
      return env.STRICT_RATE_LIMITER;
    default: {
      const unknown: never = name;
      throw new Error(`Unknown rate limiter ${String(unknown)}`);
    }
  }
}

function createLimiter(name: LimiterName, message: string, skip?: (req: Request) => boolean) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (skip?.(req)) {
      next();
      return;
    }

    const ip = req.ip ?? 'unknown';
    let success: boolean;
    try {
      ({ success } = await binding(name).limit({ key: `${name}:${ip}` }));
    } catch (error) {
      // Fail closed: if the limiter can't answer, treat the request as over the limit.
      logger.error('Rate limiter unavailable', { limiter: name, error });
      success = false;
    }

    if (success) {
      next();
      return;
    }

    const ua = req.headers['user-agent'];
    void securityEventService.log(security_event_type.RATE_LIMITED, {
      ip_address: ip,
      ...(ua && { user_agent: ua }),
      metadata: { path: req.path, limiter: name },
    });
    next(new TooManyRequestsError(message));
  };
}

export const generalRateLimiter = createLimiter(
  'general',
  'Too many requests, please try again later',
  (req) => req.method === 'GET' && PUBLIC_GET_SKIP_PATHS.some((path) => req.path.startsWith(path))
);

export const authRateLimiter = createLimiter(
  'auth',
  'Too many authentication attempts, please try again later'
);

export const strictRateLimiter = createLimiter('strict', 'Rate limit exceeded, please try again later');

export default generalRateLimiter;
