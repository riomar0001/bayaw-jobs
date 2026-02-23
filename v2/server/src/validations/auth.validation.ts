import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    first_name: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    last_name: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyAuthSchema = z.object({
  body: z.object({
    code: z.string().length(6, 'Verification code must be 6 digits'),
  }),
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const logoutSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>['query'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type VerifyAuthInput = z.infer<typeof verifyAuthSchema>['body'];
