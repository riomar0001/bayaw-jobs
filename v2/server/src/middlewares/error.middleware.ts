import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@/generated/prisma/client';
import { AppError, ValidationError } from '@/utils/errors.util';
import { errorResponse } from '@/utils/apiResponse.util';
import { ErrorMessages } from '@/constants/errorMessages.constant';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle ValidationError
  if (err instanceof ValidationError) {
    errorResponse(res, err.statusCode, err.message, err.errors, err.code);
    return;
  }

  // Handle AppError
  if (err instanceof AppError) {
    errorResponse(res, err.statusCode, err.message, undefined, err.code);
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[]) || ['field'];
        errorResponse(
          res,
          409,
          `A record with this ${target.join(', ')} already exists`,
          undefined,
          'UNIQUE_CONSTRAINT'
        );
        return;
      }
      case 'P2025':
        errorResponse(res, 404, ErrorMessages.GENERAL.NOT_FOUND, undefined, 'NOT_FOUND');
        return;
      case 'P2003':
        errorResponse(
          res,
          400,
          'Invalid reference: related record not found',
          undefined,
          'FOREIGN_KEY_CONSTRAINT'
        );
        return;
      default:
        errorResponse(res, 500, ErrorMessages.GENERAL.INTERNAL_ERROR, undefined, 'DATABASE_ERROR');
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    errorResponse(res, 400, 'Invalid data provided', undefined, 'VALIDATION_ERROR');
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse(res, 401, ErrorMessages.AUTH.TOKEN_INVALID, undefined, 'INVALID_TOKEN');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse(res, 401, ErrorMessages.AUTH.TOKEN_EXPIRED, undefined, 'TOKEN_EXPIRED');
    return;
  }

  // Default error response
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? ErrorMessages.GENERAL.INTERNAL_ERROR
      : err.message || ErrorMessages.GENERAL.INTERNAL_ERROR;

  errorResponse(res, statusCode, message, undefined, 'INTERNAL_ERROR');
};

export const notFoundMiddleware = (_req: Request, res: Response): void => {
  errorResponse(res, 404, 'Route not found', undefined, 'ROUTE_NOT_FOUND');
};

export default errorMiddleware;
