import { timingSafeEqual } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { Config } from '@/constants/config.constant';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { AuthenticationError, AuthorizationError, NotFoundError } from '@/utils/errors.util';

/**
 * Gate for every BayawSec admin route. Runs after `authenticate` and `requireAdmin`.
 * - 404 when BAYAWSEC_ENABLED is off, so the module looks absent.
 * - 403 for the shared demo accounts: their passwords are public, and BayawSec can
 *   spend OpenAI credits and send requests to the target.
 */
export const requireBayawSec = (req: Request, _res: Response, next: NextFunction): void => {
  if (!Config.BAYAWSEC.ENABLED) {
    next(new NotFoundError(ErrorMessages.BAYAWSEC.DISABLED));
    return;
  }

  const email = req.user?.email?.toLowerCase();
  if (!email) {
    next(new AuthenticationError(ErrorMessages.AUTH.TOKEN_REQUIRED));
    return;
  }

  if ((Config.DEMO_SHARED_ACCOUNTS as readonly string[]).includes(email)) {
    next(new AuthorizationError(ErrorMessages.BAYAWSEC.SHARED_ACCOUNT));
    return;
  }

  next();
};

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Auth for the optional scanner agent: a shared bearer token (SCANNER_AGENT_TOKEN).
 * Returns 404 unless SCANNER_AGENT_ENABLED is exactly "true" and a token of at least
 * 32 characters is configured.
 */
export const requireScannerAgent = (req: Request, _res: Response, next: NextFunction): void => {
  const expected = process.env.SCANNER_AGENT_TOKEN ?? '';
  if (!Config.BAYAWSEC.ENABLED || !Config.BAYAWSEC.SCANNER_AGENT_ENABLED || expected.length < 32) {
    next(new NotFoundError(ErrorMessages.BAYAWSEC.DISABLED));
    return;
  }

  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token || !safeEqual(token, expected)) {
    next(new AuthenticationError(ErrorMessages.AUTH.TOKEN_INVALID));
    return;
  }

  next();
};
