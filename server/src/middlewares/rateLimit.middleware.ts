import rateLimit from 'express-rate-limit';
import { Config } from '@/constants/config.constant';
import { TooManyRequestsError } from '@/utils/errors.util';
import { securityEventService } from '@/services/securityEvent.service';
import { security_event_type } from '@/generated/prisma/client';

const PUBLIC_GET_SKIP_PATHS = ['/api/jobs', '/api/companies'];

export const generalRateLimiter = rateLimit({
  windowMs: Config.RATE_LIMIT.WINDOW_MS,
  max: Config.RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    req.method === 'GET' && PUBLIC_GET_SKIP_PATHS.some((path) => req.path.startsWith(path)),
  handler: (req, _res, next) => {
    const ip = req.ip;
    const ua = req.headers['user-agent'];
    void securityEventService.log(security_event_type.RATE_LIMITED, {
      ...(ip && { ip_address: ip }),
      ...(ua && { user_agent: ua }),
      metadata: { path: req.path, limiter: 'general' },
    });
    next(new TooManyRequestsError('Too many requests, please try again later'));
  },
});

export const authRateLimiter = rateLimit({
  windowMs: Config.RATE_LIMIT.AUTH_WINDOW_MS,
  max: Config.RATE_LIMIT.AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, _res, next) => {
    const ip = req.ip;
    const ua = req.headers['user-agent'];
    void securityEventService.log(security_event_type.RATE_LIMITED, {
      ...(ip && { ip_address: ip }),
      ...(ua && { user_agent: ua }),
      metadata: { path: req.path, limiter: 'auth' },
    });
    next(new TooManyRequestsError('Too many authentication attempts, please try again later'));
  },
});

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, _res, next) => {
    const ip = req.ip;
    const ua = req.headers['user-agent'];
    void securityEventService.log(security_event_type.RATE_LIMITED, {
      ...(ip && { ip_address: ip }),
      ...(ua && { user_agent: ua }),
      metadata: { path: req.path, limiter: 'strict' },
    });
    next(new TooManyRequestsError('Rate limit exceeded, please try again later'));
  },
});

export default generalRateLimiter;
