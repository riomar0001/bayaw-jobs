export interface AccessTokenPayload {
  user_id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  done_onboarding: boolean;
}

export interface RefreshTokenPayload {
  token_id: string;
  user_id: string;
}

export interface VerificationTokenPayload {
  user_id: string;
  email: string;
  purpose: 'email_verification' | 'auth_verification';
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
