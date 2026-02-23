import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyVerificationToken } from '@/utils/generateToken.util';
import { AuthenticationError } from '@/utils/errors.util';
import { ErrorMessages } from '@/constants/errorMessages.constant';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError(ErrorMessages.AUTH.TOKEN_REQUIRED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError(ErrorMessages.AUTH.TOKEN_REQUIRED);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else if ((error as Error).name === 'TokenExpiredError') {
      next(new AuthenticationError(ErrorMessages.AUTH.TOKEN_EXPIRED));
    } else if ((error as Error).name === 'JsonWebTokenError') {
      next(new AuthenticationError(ErrorMessages.AUTH.TOKEN_INVALID));
    } else {
      next(new AuthenticationError(ErrorMessages.AUTH.TOKEN_INVALID));
    }
  }
};

export const authenticateOptional = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    // If token is invalid, continue without user
    next();
  }
};

export const authenticateTempToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError(ErrorMessages.AUTH.TOKEN_REQUIRED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError(ErrorMessages.AUTH.TOKEN_REQUIRED);
    }

    const decoded = verifyVerificationToken(token);

    if (decoded.purpose !== 'auth_verification') {
      throw new AuthenticationError(ErrorMessages.AUTH.TOKEN_INVALID);
    }

    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
      role: '',
    };
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else if ((error as Error).name === 'TokenExpiredError') {
      next(new AuthenticationError(ErrorMessages.AUTH.VERIFICATION_CODE_EXPIRED));
    } else {
      next(new AuthenticationError(ErrorMessages.AUTH.TOKEN_INVALID));
    }
  }
};

export default authenticate;
