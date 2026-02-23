import { Request, Response, NextFunction } from 'express';
import { AuthorizationError, AuthenticationError } from '@/utils/errors.util';
import { ErrorMessages } from '@/constants/errorMessages.constant';

export const requireRole =
  (...allowedRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthenticationError(ErrorMessages.AUTH.TOKEN_REQUIRED));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AuthorizationError(ErrorMessages.AUTH.UNAUTHORIZED));
      return;
    }

    next();
  };

export const requireAdmin = requireRole('ADMIN');
export const requireUser = requireRole('USER', 'ADMIN');

export default requireRole;
