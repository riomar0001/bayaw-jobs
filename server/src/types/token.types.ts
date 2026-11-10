export interface AccessTokenPayload {
  user_id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  applicant_profile_id?: string;
  company_id?: string;
  status?: string;
  ban_reason?: string | null;
  ban_expires_at?: string | null;
}

export interface RefreshTokenPayload {
  token_id: string;
  user_id: string;
}

export interface VerificationTokenPayload {
  user_id: string;
  email: string;
  purpose: 'email_verification' | 'auth_verification' | 'password_reset';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  iat: number;
  exp: number;
}

export type DecodedAccessToken = AccessTokenPayload & DecodedToken;
export type DecodedRefreshToken = RefreshTokenPayload & DecodedToken;
export type DecodedVerificationToken = VerificationTokenPayload & DecodedToken;
