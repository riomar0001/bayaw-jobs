import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: PaginationMeta
): void => {
  const response: ApiResponse<T> = {
    success: true,
    ...(message !== undefined && { message }),
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  res.status(statusCode).json(response);
};

export const createdResponse = <T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): void => {
  successResponse(res, data, message, 201);
};

export const noContentResponse = (res: Response): void => {
  res.status(204).send();
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]>,
  code?: string
): void => {
  const response: ApiResponse & { code?: string } = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (code) {
    response.code = code;
  }

  res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): void => {
  const totalPages = Math.ceil(total / limit);

  successResponse(res, data, message, 200, {
    page,
    limit,
    total,
    totalPages,
  });
};

export const redirectResponse = (res: Response, url: string): void => {
  res.redirect(url);
};
