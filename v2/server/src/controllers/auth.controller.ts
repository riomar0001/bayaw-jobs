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

      successResponse(
        res,
        { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
        'Email verified successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body, req);

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

      successResponse(res, { accessToken: result.accessToken }, 'Token refreshed successfully');
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
}

export const authController = new AuthController();
export default authController;
