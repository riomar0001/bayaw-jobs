import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '@/utils/errors.util';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { activityLimitService, ActivityAction } from '@/services/activityLimit.service';

/** Per-route daily cap. Must run after `authenticate`. */
export const limitActivity =
  (action: ActivityAction) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.user_id;
    if (!userId) {
      next(new AuthenticationError(ErrorMessages.AUTH.TOKEN_REQUIRED));
      return;
    }

    try {
      await activityLimitService.consume(userId, action);
      next();
    } catch (error) {
      next(error);
    }
  };

/** Signups have no user yet, so they are capped per client IP instead. */
export const limitSignupsByIp = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  // Fail closed: without a client IP every anonymous caller would share one bucket anyway.
  const ip = req.ip ?? 'unknown';
  try {
    await activityLimitService.consume(`ip:${ip}`, 'SIGNUP');
    next();
  } catch (error) {
    next(error);
  }
};
