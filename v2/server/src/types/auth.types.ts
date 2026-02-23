import { UserStatus } from '@/generated/prisma/client';

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
  first_name: string;
  last_name: string;
  role: string;
  status: UserStatus;
  email_verified: boolean;
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
