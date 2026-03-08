import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '@/utils/errors.util';

/**
 * Converts a Zod issue into a human-readable message.
 * Prefers any custom message set on the schema over Zod's default messages.
 */
function formatIssue(issue: z.ZodIssue): string {
  // For type mismatch errors, Zod v4 generates messages like
  // "Invalid input: expected string, received number".
  // If the schema author did not set a custom message we produce a
  // friendlier field-specific one. Custom messages (set via the `error`
  // param or .min()/.refine() etc.) are already surfaced on issue.message.
  if (issue.code === 'invalid_type') {
    const isZodDefault = issue.message.startsWith('Invalid input') || issue.message === 'Required';

    if (!isZodDefault) return issue.message;

    // Build a friendly fallback using the last segment of the field path.
    const field = issue.path.at(-1);
    const fieldLabel = field !== undefined ? `"${String(field)}"` : 'Field';

    return `${fieldLabel} is required or has an invalid type`;
  }

  return issue.message;
}

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
      error.issues.forEach((issue) => {
        const path = issue.path.map(String).join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(formatIssue(issue));
      });

      return next(new ValidationError(errors));
    }

    next();
  };

export default validate;
