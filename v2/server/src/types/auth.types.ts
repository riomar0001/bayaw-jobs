import { user_status } from '@/generated/prisma/client';

export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyAuthInput {
  code: string;
  tempToken: string;
}

export interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  status: user_status;
  email_verified: boolean;
  done_onboarding: boolean;
  created_at: Date;
}

export interface AuthResponse {
  user: UserData;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  message: string;
  tempToken: string;
  _code?: string | undefined;
}

export interface RefreshTokenData {
  id: string;
  user_id: string;
  token_hash: string;
  ip_address: string | null;
  user_agent: string | null;
  device: string | null;
  is_active: boolean;
  expires_at: Date;
  last_used: Date | null;
}
