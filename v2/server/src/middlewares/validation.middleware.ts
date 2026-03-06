import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '@/utils/errors.util';

export const validate =
  (schema: z.ZodObject<z.ZodRawShape>) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
    } catch (error) {
      if (!(error instanceof z.ZodError)) {
        return next(error);
      }

      const errors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return next(new ValidationError(errors));
    }

    next();
  };

export default validate;
