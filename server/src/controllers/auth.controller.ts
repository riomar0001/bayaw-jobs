import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/auth.service';
import { successResponse, createdResponse } from '@/utils/apiResponse.util';
import { Config } from '@/constants/config.constant';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, verificationToken } = await authService.register(req.body);

      const responseData = {
        user,
        message: 'Registration successful. Please check your email to verify your account.',
        ...(process.env.NODE_ENV === 'development' && { verificationToken }),
      };

      createdResponse(res, responseData, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.query as { token: string };
      const result = await authService.verifyEmail(token, req);

      res.cookie(Config.COOKIES.REFRESH_TOKEN_NAME, result.refreshToken, {
        httpOnly: Config.COOKIES.HTTP_ONLY,
        secure: Config.COOKIES.SECURE,
        sameSite: Config.COOKIES.SAME_SITE,
        maxAge: Config.COOKIES.REFRESH_TOKEN_MAX_AGE,
      });

      res.cookie(Config.COOKIES.ACCESS_TOKEN_NAME, result.accessToken, {
        httpOnly: Config.COOKIES.HTTP_ONLY,
        secure: Config.COOKIES.SECURE,
        sameSite: Config.COOKIES.SAME_SITE,
        maxAge: Config.COOKIES.ACCESS_TOKEN_MAX_AGE,
      });

      // Old JSON response (kept for reference):
      // successResponse(
      //   res,
      //   { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
      //   'Email verified successfully'
      // );

      // Redirect to frontend login page with a verified flag
      res.redirect(`${Config.FRONTEND_URL}/login?verified=true`);
    } catch (error) {
      // Redirect to frontend with an error flag instead of returning a JSON error
      res.redirect(`${Config.FRONTEND_URL}/login?error=verification_failed`);
      void next(error); // prevent double-calling next after redirect
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body, req);

      if (!result.otpRequired) {
        // OTP disabled — set refresh cookie and return access token directly
        res.cookie(Config.COOKIES.REFRESH_TOKEN_NAME, result.refreshToken, {
          httpOnly: Config.COOKIES.HTTP_ONLY,
          secure: Config.COOKIES.SECURE,
          sameSite: Config.COOKIES.SAME_SITE,
          maxAge: Config.COOKIES.REFRESH_TOKEN_MAX_AGE,
        });
        successResponse(res, { otpRequired: false, accessToken: result.accessToken }, 'Login successful');
        return;
      }

      successResponse(res, result, 'Verification code sent to your email');
    } catch (error) {
      next(error);
    }
  }

  async verifyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.body;
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }
      const result = (await authService.verifyAuth(userId, code, req)) as {
        user: unknown;
        accessToken: string;
        refreshToken: string;
      };

      // Set refresh token in HTTP-only cookie
      res.cookie(Config.COOKIES.REFRESH_TOKEN_NAME, result.refreshToken, {
        httpOnly: Config.COOKIES.HTTP_ONLY,
        secure: Config.COOKIES.SECURE,
        sameSite: Config.COOKIES.SAME_SITE,
        maxAge: Config.COOKIES.REFRESH_TOKEN_MAX_AGE,
      });

      res.cookie(Config.COOKIES.ACCESS_TOKEN_NAME, result.accessToken, {
        httpOnly: Config.COOKIES.HTTP_ONLY,
        secure: Config.COOKIES.SECURE,
        sameSite: Config.COOKIES.SAME_SITE,
        maxAge: Config.COOKIES.ACCESS_TOKEN_MAX_AGE,
      });

      successResponse(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        'Login successful'
      );
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies[Config.COOKIES.REFRESH_TOKEN_NAME];

      const result = await authService.refreshToken(refreshToken, req);

      // Set new refresh token in cookie
      res.cookie(Config.COOKIES.REFRESH_TOKEN_NAME, result.refreshToken, {
        httpOnly: Config.COOKIES.HTTP_ONLY,
        secure: Config.COOKIES.SECURE,
        sameSite: Config.COOKIES.SAME_SITE,
        maxAge: Config.COOKIES.REFRESH_TOKEN_MAX_AGE,
      });

      successResponse(
        res,
        { accessToken: result.accessToken, user: result.user },
        'Token refreshed successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies[Config.COOKIES.REFRESH_TOKEN_NAME];

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear cookie
      res.clearCookie(Config.COOKIES.REFRESH_TOKEN_NAME, {
        httpOnly: Config.COOKIES.HTTP_ONLY,
        secure: Config.COOKIES.SECURE,
        sameSite: Config.COOKIES.SAME_SITE,
      });

      successResponse(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.forgotPassword(req.body);
      successResponse(
        res,
        result,
        'If an account with that email exists, a password reset link has been sent.'
      );
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reset_password_token } = req.params;
      if (!reset_password_token || typeof reset_password_token !== 'string') {
        throw new Error('Reset password token is required');
      }
      await authService.resetPassword(reset_password_token, req.body);
      successResponse(res, null, 'Password reset successfully. Please log in again.');
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      await authService.updatePassword(userId, req.body);

      successResponse(res, null, 'Password updated successfully. Please log in again.');
    } catch (error) {
      next(error);
    }
  }

  async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        throw new Error('User ID missing in request');
      }

      await authService.logoutAll(userId);

      // Clear cookie
      res.clearCookie(Config.COOKIES.REFRESH_TOKEN_NAME, {
        httpOnly: Config.COOKIES.HTTP_ONLY,
        secure: Config.COOKIES.SECURE,
        sameSite: Config.COOKIES.SAME_SITE,
      });

      successResponse(res, null, 'Logged out from all devices');
    } catch (error) {
      next(error);
    }
  }

  async getLoginHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const parsedPage = parseInt(req.query.page as string, 10);
      const page = Math.max(Number.isNaN(parsedPage) ? 1 : parsedPage, 1);

      const parsedLimit = parseInt(req.query.limit as string, 10);
      const limit = Math.min(Math.max(Number.isNaN(parsedLimit) ? 10 : parsedLimit, 1), 50);

      const result = await authService.getLoginHistory(userId, page, limit);
      successResponse(res, result, 'Login history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAccountInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const result = await authService.getAccountInfo(userId);
      successResponse(res, result, 'Account info retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAccountInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const result = await authService.updateAccountInfo(userId, req.body);
      successResponse(res, result, 'Account info updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateOtpSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');
      const { enabled } = req.body as { enabled: boolean };
      await authService.updateOtpSetting(userId, enabled);
      successResponse(res, { otp_enabled: enabled }, 'OTP setting updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
export default authController;
