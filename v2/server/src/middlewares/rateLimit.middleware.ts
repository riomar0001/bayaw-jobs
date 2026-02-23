import rateLimit from 'express-rate-limit';
import { Config } from '@/constants/config.constant';
import { TooManyRequestsError } from '@/utils/errors.util';

export const generalRateLimiter = rateLimit({
  windowMs: Config.RATE_LIMIT.WINDOW_MS,
  max: Config.RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many requests, please try again later'));
  },
});

export const authRateLimiter = rateLimit({
  windowMs: Config.RATE_LIMIT.AUTH_WINDOW_MS,
  max: Config.RATE_LIMIT.AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many authentication attempts, please try again later'));
  },
});

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Rate limit exceeded, please try again later'));
  },
});

export default generalRateLimiter;
