import { user_status } from '@/generated/prisma/client';
import { userRepository } from '@/repositories/user.repository';
import { refreshTokenRepository } from '@/repositories/refreshToken.repository';
import { authCodeRepository } from '@/repositories/authCode.repository';
import { emailService } from '@/services/email.service';
import { hashPassword, verifyPassword, verifyHashedRefreshToken } from '@/utils/tokenHashing.util';
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generateAuthCode,
  verifyVerificationToken,
  verifyRefreshToken,
} from '@/utils/generateToken.util';
import { truncateIp } from '@/utils/truncateIp.util';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  BadRequestError,
} from '@/utils/errors.util';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { Config } from '@/constants/config.constant';
import {
  RegisterInput,
  LoginInput,
  UserData,
  AuthResponse,
  LoginResponse,
} from '@/types/auth.types';
import { Request } from 'express';

export class AuthService {
  async register(data: RegisterInput): Promise<{ user: UserData; verificationToken: string }> {    
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError(ErrorMessages.AUTH.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await userRepository.create({
      email: data.email,
      password: hashedPassword,
      first_name: data.first_name,
      last_name: data.last_name,
    });

    // Generate verification token
    const verificationToken = generateVerificationToken(user.id, user.email, 'email_verification');

    // Send verification email
    await emailService.sendVerificationEmail({
      to: user.email,
      firstName: user.first_name,
      verificationLink: emailService.getVerificationLink(verificationToken),
    });

    const userData: UserData = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
      done_onboarding: user.done_onboarding,
      created_at: user.created_at,
    };

    return { user: userData, verificationToken };
  }

  async verifyEmail(token: string, req: Request): Promise<AuthResponse> {
    // Verify token
    const decoded = verifyVerificationToken(token);

    if (decoded.purpose !== 'email_verification') {
      throw new BadRequestError(ErrorMessages.AUTH.TOKEN_INVALID);
    }

    // Find user
    const user = await userRepository.findById(decoded.user_id);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (user.email_verified) {
      throw new BadRequestError(ErrorMessages.AUTH.EMAIL_ALREADY_VERIFIED);
    }

    // Verify email
    const updatedUser = await userRepository.verifyEmail(user.id);

    // Get client info
    const clientIp = req.ip ?? '0.0.0.0';
    const ip = truncateIp(clientIp);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Generate tokens
    const accessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken(user.id, ip, userAgent);

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        role: updatedUser.role,
        status: updatedUser.status,
        email_verified: updatedUser.email_verified,
        done_onboarding: updatedUser.done_onboarding,
        created_at: updatedUser.created_at,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginInput, _req: Request): Promise<LoginResponse> {
    // Find user
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new AuthenticationError(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    // Check account status
    this.checkAccountStatus(user);

    // Check if account is locked
    if (user.locked_until && user.locked_until > new Date()) {
      throw new AuthenticationError(ErrorMessages.AUTH.ACCOUNT_LOCKED);
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, user.password);
    if (!isValidPassword) {
      await this.handleFailedLogin(user.id, user.failed_login_attempts);
      throw new AuthenticationError(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new AuthenticationError(ErrorMessages.AUTH.EMAIL_NOT_VERIFIED);
    }

    // Generate auth code
    const code = generateAuthCode();
    const expiresAt = new Date(
      Date.now() + Config.AUTH.VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000
    );

    await authCodeRepository.create({
      user_id: user.id,
      code,
      expires_at: expiresAt,
    });

    // Send auth code email
    await emailService.sendAuthCodeEmail({
      to: user.email,
      firstName: user.first_name,
      code,
    });

    // Generate temporary token for step 2
    const tempToken = generateVerificationToken(user.id, user.email, 'auth_verification', '10m');

    return {
      message: 'Verification code sent to your email',
      tempToken,
      // Note: In production, don't return the code. This is for development/testing only.
      // The code should be sent via email queue
      _code: process.env.NODE_ENV === 'development' ? code : undefined,
    } as LoginResponse & { _code?: string };
  }

  async verifyAuth(userId: string, code: string, req: Request): Promise<AuthResponse> {
    // Find user
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Verify code
    const authCode = await authCodeRepository.findValidCode(userId, code);
    if (!authCode) {
      throw new AuthenticationError(ErrorMessages.AUTH.INVALID_VERIFICATION_CODE);
    }

    // Mark code as used
    await authCodeRepository.markAsUsed(authCode.id);

    // Get client info
    const clientIp = req.ip ?? '0.0.0.0';
    const ip = truncateIp(clientIp);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Generate tokens
    const accessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken(user.id, ip, userAgent);

    // Update last login
    await userRepository.updateLastLogin(user.id);

    const userData: UserData = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
      done_onboarding: user.done_onboarding,
      created_at: user.created_at,
    };

    return {
      user: userData,
      accessToken,
      refreshToken,
    } as AuthResponse;
  }

  async refreshToken(
    token: string,
    req: Request
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify token
    const decoded = verifyRefreshToken(token);

    // Find token in database
    const storedToken = await refreshTokenRepository.findById(decoded.token_id);
    if (!storedToken || !storedToken.is_active) {
      throw new AuthenticationError(ErrorMessages.AUTH.REFRESH_TOKEN_INVALID);
    }

    // Verify token hash
    const isValid = await verifyHashedRefreshToken(token, storedToken.token_hash);
    if (!isValid) {
      throw new AuthenticationError(ErrorMessages.AUTH.REFRESH_TOKEN_INVALID);
    }

    // Check expiry
    if (storedToken.expires_at < new Date()) {
      await refreshTokenRepository.revoke(storedToken.id);
      throw new AuthenticationError(ErrorMessages.AUTH.REFRESH_TOKEN_INVALID);
    }

    // Find user
    const user = await userRepository.findById(decoded.user_id);
    if (!user) {
      await refreshTokenRepository.revoke(storedToken.id);
      throw new NotFoundError('User');
    }

    // Revoke old token
    await refreshTokenRepository.revoke(storedToken.id);

    // Get client info
    const clientIp = req.ip ?? '0.0.0.0';
    const ip = truncateIp(clientIp);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = await generateRefreshToken(user.id, ip, userAgent);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string): Promise<void> {
    try {
      const decoded = verifyRefreshToken(token);
      await refreshTokenRepository.revoke(decoded.token_id);
    } catch {
      // Token might be invalid or already revoked, just continue
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await refreshTokenRepository.revokeAllByUserId(userId);
  }

  private checkAccountStatus(user: { status: user_status }): void {
    switch (user.status) {
      case user_status.SUSPENDED:
        throw new AuthenticationError(ErrorMessages.AUTH.ACCOUNT_SUSPENDED);
      case user_status.DELETED:
        throw new AuthenticationError(ErrorMessages.AUTH.ACCOUNT_DELETED);
      case user_status.INACTIVE:
        throw new AuthenticationError('Your account is inactive');
      default:
        break;
    }
  }

  private async handleFailedLogin(userId: string, currentAttempts: number): Promise<void> {
    await userRepository.incrementFailedAttempts(userId);

    if (currentAttempts + 1 >= Config.AUTH.MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + Config.AUTH.LOCK_DURATION_MINUTES * 60 * 1000);
      await userRepository.lockAccount(userId, lockUntil);
    }
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
      done_onboarding: user.done_onboarding,
      created_at: user.created_at,
    };
  }
}

export const authService = new AuthService();
export default authService;
