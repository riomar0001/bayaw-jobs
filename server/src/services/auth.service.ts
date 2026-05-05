import { user_status } from '@/generated/prisma/client';
import { userRepository } from '@/repositories/user.repository';
import { refreshTokenRepository } from '@/repositories/refreshToken.repository';
import { applicantRepository } from '@/repositories/applicant.repository';
import { companyRepository } from '@/repositories/company.repository';
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
  RefreshTokenResponse,
} from '@/types/auth.types';
import {
  UpdatePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateAccountInfoInput,
} from '@/validations/auth.validation';
import { Request } from 'express';
import { securityEventService } from '@/services/securityEvent.service';
import { security_event_type } from '@/generated/prisma/client';

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
      firstName: user.first_name ?? '',
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
    const profileIds = await this.getProfileIds(user.id);
    const accessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      status: updatedUser.status,
      ...profileIds,
    });

    const refreshToken = await generateRefreshToken(user.id, ip, userAgent);

    void securityEventService.log(security_event_type.EMAIL_VERIFIED, {
      user_id: user.id,
      ...(ip && { ip_address: ip }),
      ...(userAgent && { user_agent: userAgent }),
    });

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        role: updatedUser.role,
        status: updatedUser.status,
        email_verified: updatedUser.email_verified,
        created_at: updatedUser.created_at,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginInput, req: Request): Promise<LoginResponse> {
    const ip = req.ip;
    const ua = req.headers['user-agent'];
    const ipOpt = ip ? { ip_address: ip } : {};
    const uaOpt = ua ? { user_agent: ua } : {};

    // Find user
    let user = await userRepository.findByEmail(data.email);
    if (!user) {
      void securityEventService.log(security_event_type.LOGIN_FAILED, {
        ...ipOpt, ...uaOpt,
        metadata: { email: data.email, reason: 'user_not_found' },
      });
      throw new AuthenticationError(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    // Auto-lift expired temporary ban before status check
    if (user.status === user_status.BANNED && user.ban_expires_at && user.ban_expires_at < new Date()) {
      await userRepository.unban(user.id);
      user = (await userRepository.findByEmail(data.email))!;
    }

    // Check account status
    this.checkAccountStatus(user);

    // Check if account is locked
    if (user.locked_until && user.locked_until > new Date()) {
      void securityEventService.log(security_event_type.ACCOUNT_LOCKED, {
        user_id: user.id, ...ipOpt, ...uaOpt,
        metadata: { locked_until: user.locked_until },
      });
      throw new AuthenticationError(ErrorMessages.AUTH.ACCOUNT_LOCKED);
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, user.password);
    if (!isValidPassword) {
      const nextAttempts = user.failed_login_attempts + 1;
      await this.handleFailedLogin(user.id, user.failed_login_attempts);
      void securityEventService.log(security_event_type.LOGIN_FAILED, {
        user_id: user.id, ...ipOpt, ...uaOpt,
        metadata: { reason: 'invalid_password', attempt: nextAttempts },
      });
      if (nextAttempts >= Config.AUTH.MAX_LOGIN_ATTEMPTS) {
        void securityEventService.log(security_event_type.ACCOUNT_LOCKED, {
          user_id: user.id, ...ipOpt, ...uaOpt,
          metadata: { triggered_by: 'max_failed_attempts', attempts: nextAttempts },
        });
      }
      throw new AuthenticationError(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new AuthenticationError(ErrorMessages.AUTH.EMAIL_NOT_VERIFIED);
    }

    // Skip OTP if user has disabled it — issue tokens directly
    if (!user.otp_enabled) {
      const clientIp = req.ip ?? '0.0.0.0';
      const ip = truncateIp(clientIp);
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const profileIds = await this.getProfileIds(user.id);
      const accessToken = generateAccessToken({
        user_id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        status: user.status,
        ...(user.ban_reason    && { ban_reason:     user.ban_reason }),
        ...(user.ban_expires_at && { ban_expires_at: user.ban_expires_at.toISOString() }),
        ...profileIds,
      });
      const refreshToken = await generateRefreshToken(user.id, ip, userAgent);
      await userRepository.updateLastLogin(user.id);
      void securityEventService.log(security_event_type.LOGIN_SUCCESS, {
        user_id: user.id,
        ...(ip && { ip_address: ip }),
        ...(userAgent && { user_agent: userAgent }),
        metadata: { otp: false },
      });
      return { otpRequired: false, accessToken, refreshToken };
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
      firstName: user.first_name ?? '',
      code,
    });

    // Generate temporary token for step 2
    const tempToken = generateVerificationToken(user.id, user.email, 'auth_verification', '10m');

    return {
      otpRequired: true,
      message: 'Verification code sent to your email',
      tempToken,
      _code: process.env.NODE_ENV === 'development' ? code : undefined,
    };
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
      const ip = req.ip;
      const ua = req.headers['user-agent'];
      void securityEventService.log(security_event_type.OTP_FAILED, {
        user_id: userId,
        ...(ip && { ip_address: ip }),
        ...(ua && { user_agent: ua }),
        metadata: { reason: 'invalid_or_expired_code' },
      });
      throw new AuthenticationError(ErrorMessages.AUTH.INVALID_VERIFICATION_CODE);
    }

    // Mark code as used
    await authCodeRepository.markAsUsed(authCode.id);

    // Get client info
    const clientIp = req.ip ?? '0.0.0.0';
    const ip = truncateIp(clientIp);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Generate tokens
    const profileIds = await this.getProfileIds(user.id);
    const accessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      status: user.status,
      ...(user.ban_reason    && { ban_reason:     user.ban_reason }),
      ...(user.ban_expires_at && { ban_expires_at: user.ban_expires_at.toISOString() }),
      ...profileIds,
    });

    const refreshToken = await generateRefreshToken(user.id, ip, userAgent);

    const priorFailures = user.failed_login_attempts;
    const wasLocked = user.locked_until !== null && user.locked_until !== undefined;

    // Update last login (resets failed_login_attempts and locked_until)
    await userRepository.updateLastLogin(user.id);

    if (wasLocked) {
      void securityEventService.log(security_event_type.ACCOUNT_UNLOCKED, {
        user_id: user.id,
        ...(ip && { ip_address: ip }),
        ...(userAgent && { user_agent: userAgent }),
        metadata: { reason: 'lock_expired_successful_login' },
      });
    }

    void securityEventService.log(security_event_type.LOGIN_SUCCESS, {
      user_id: user.id,
      ...(ip && { ip_address: ip }),
      ...(userAgent && { user_agent: userAgent }),
      ...(priorFailures > 0 && { metadata: { prior_failures: priorFailures } }),
    });

    if (priorFailures >= 3) {
      void securityEventService.log(security_event_type.SUSPICIOUS_ACTIVITY, {
        user_id: user.id,
        ...(ip && { ip_address: ip }),
        ...(userAgent && { user_agent: userAgent }),
        metadata: {
          reason: 'login_success_after_failures',
          prior_failures: priorFailures,
        },
      });
    }

    const userData: UserData = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
      created_at: user.created_at,
    };

    return {
      user: userData,
      accessToken,
      refreshToken,
    } as AuthResponse;
  }

  async refreshToken(token: string, req: Request): Promise<RefreshTokenResponse> {
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
    const profileIds = await this.getProfileIds(user.id);
    const newAccessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      ...profileIds,
    });

    const newRefreshToken = await generateRefreshToken(user.id, ip, userAgent);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        ...profileIds,
      },
    };
  }

  async logout(token: string): Promise<void> {
    try {
      const decoded = verifyRefreshToken(token);
      await refreshTokenRepository.revoke(decoded.token_id);
      void securityEventService.log(security_event_type.SESSION_REVOKED, {
        user_id: decoded.user_id,
        metadata: { reason: 'logout', sessions_revoked: 1 },
      });
    } catch {
      // Token might be invalid or already revoked, just continue
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await refreshTokenRepository.revokeAllByUserId(userId);
    void securityEventService.log(security_event_type.SESSION_REVOKED, {
      user_id: userId,
      metadata: { reason: 'logout_all' },
    });
  }

  private async getProfileIds(
    userId: string
  ): Promise<{ applicant_profile_id?: string; company_id?: string; profile_picture_url?: string }> {
    const [applicantProfile, companyAdmin] = await Promise.all([
      applicantRepository.findProfileIdByUserId(userId),
      companyRepository.findCompanyIdByAdminUserId(userId),
    ]);

    // Fallback URL if env is missing
    const baseUrl = process.env.APP_URL || 'http://localhost:4000/api';

    return {
      ...(applicantProfile ? { applicant_profile_id: applicantProfile.id } : {}),
      ...(companyAdmin ? { company_id: companyAdmin.company_id } : {}),
      ...(applicantProfile?.profile_picture
        ? { profile_picture_url: `${baseUrl}/applicants/profile/picture/${applicantProfile.id}` }
        : {}),
    };
  }

  private checkAccountStatus(user: { status: user_status; ban_expires_at?: Date | null }): void {
    switch (user.status) {
      case user_status.BANNED: {
        // If temporary ban has expired the auto-unban in login() will handle it — block for now
        if (!user.ban_expires_at || user.ban_expires_at > new Date()) {
          throw new AuthenticationError(ErrorMessages.AUTH.ACCOUNT_BANNED);
        }
        break;
      }
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

  async forgotPassword(data: ForgotPasswordInput): Promise<string | undefined> {
    const user = await userRepository.findByEmail(data.email);

    // Always return silently — never reveal whether the email exists
    if (!user || !user.email_verified) return;

    const token = generateVerificationToken(user.id, user.email, 'password_reset', '15m');

    const clientUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
    const resetLink = `${clientUrl}/reset-password?token=${token}`;

    await emailService.sendPasswordResetEmail({
      to: user.email,
      firstName: user.first_name ?? '',
      resetLink,
    });

    void securityEventService.log(security_event_type.PASSWORD_RESET_REQUESTED, {
      user_id: user.id,
      metadata: { email: user.email },
    });

    return process.env.NODE_ENV === 'development' ? token : undefined;
  }

  async resetPassword(token: string, data: ResetPasswordInput): Promise<void> {
    const decoded = verifyVerificationToken(token);

    if (decoded.purpose !== 'password_reset') {
      throw new BadRequestError(ErrorMessages.AUTH.TOKEN_INVALID);
    }

    const user = await userRepository.findById(decoded.user_id);
    if (!user) {
      throw new NotFoundError('User');
    }

    const hashedPassword = await hashPassword(data.new_password);
    await userRepository.update(user.id, {
      password: hashedPassword,
      password_changed_at: new Date(),
    });

    await refreshTokenRepository.revokeAllByUserId(user.id);

    await emailService.sendPasswordChangedEmail({
      to: user.email,
      firstName: user.first_name ?? '',
    });

    void securityEventService.log(security_event_type.PASSWORD_CHANGED, {
      user_id: user.id,
      metadata: { method: 'reset' },
    });
  }

  async updatePassword(userId: string, data: UpdatePasswordInput): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const isValid = await verifyPassword(data.current_password, user.password);
    if (!isValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(data.new_password);
    await userRepository.update(userId, {
      password: hashedPassword,
      password_changed_at: new Date(),
    });

    await refreshTokenRepository.revokeAllByUserId(userId);

    void securityEventService.log(security_event_type.PASSWORD_CHANGED, {
      user_id: userId,
      metadata: { method: 'user_initiated' },
    });
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
      created_at: user.created_at,
    };
  }

  async getLoginHistory(userId: string, page: number, limit: number) {
    return userRepository.findLoginHistory(userId, page, limit);
  }

  async getAccountInfo(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User');
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      otp_enabled: user.otp_enabled,
    };
  }

  async updateOtpSetting(userId: string, enabled: boolean) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User');
    await userRepository.update(userId, { otp_enabled: enabled });
  }

  async updateAccountInfo(userId: string, data: UpdateAccountInfoInput) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User');

    if (data.email && data.email !== user.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictError(ErrorMessages.AUTH.EMAIL_ALREADY_EXISTS);
      }
    }

    const updateData: { first_name?: string; last_name?: string; email?: string } = {};
    if (data.first_name !== undefined) updateData.first_name = data.first_name;
    if (data.last_name !== undefined) updateData.last_name = data.last_name;
    if (data.email !== undefined) updateData.email = data.email;

    const updatedUser = await userRepository.update(userId, updateData);
    return {
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
    };
  }
}

export const authService = new AuthService();
export default authService;
