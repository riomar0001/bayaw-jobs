import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validation.middleware';
import { authenticate, authenticateTempToken } from '@/middlewares/auth.middleware';
import { authRateLimiter } from '@/middlewares/rateLimit.middleware';
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  verifyAuthSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateAccountInfoSchema,
} from '@/validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register.bind(authController));

router.get(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail.bind(authController)
);

router.post('/login', authRateLimiter, validate(loginSchema), authController.login.bind(authController));
router.post(
  '/verify-auth',
  authRateLimiter,
  authenticateTempToken,
  validate(verifyAuthSchema),
  authController.verifyAuth.bind(authController)
);

router.patch(
  '/password',
  authenticate,
  validate(updatePasswordSchema),
  authController.updatePassword.bind(authController)
);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);
router.post(
  '/reset-password/:reset_password_token',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

router.post('/refresh', authController.refresh.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/logout-all', authenticate, authController.logoutAll.bind(authController));

router.get('/login-history', authenticate, authController.getLoginHistory.bind(authController));

router.get('/info', authenticate, authController.getAccountInfo.bind(authController));
router.patch(
  '/info',
  authenticate,
  validate(updateAccountInfoSchema),
  authController.updateAccountInfo.bind(authController)
);

router.patch('/settings/otp', authenticate, authController.updateOtpSetting.bind(authController));

export default router;
