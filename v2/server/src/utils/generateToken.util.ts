import jwt from 'jsonwebtoken';
import prisma from '@/configs/prisma.config';
import { hashRefreshToken } from '@/utils/tokenHashing.util';
import { v4 as uuidv4 } from 'uuid';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  VerificationTokenPayload,
} from '@/types/token.types';
import '@/configs/dotenv.config';

export const generateAccessToken = (tokenPayload: AccessTokenPayload): string => {
  const SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!SECRET) {
    throw new Error('JWT Access Token Secret is not defined.');
  }

  const { user_id, email, role } = tokenPayload;

  if (!user_id || !email || !role) {
    throw new Error('Invalid token payload for access token generation.');
  }

  return jwt.sign({ user_id, email, role }, SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_TTL || '3h',
  } as jwt.SignOptions);
};

export const generateRefreshToken = async (
  user_id: string,
  ip: string,
  user_agent: string
): Promise<string> => {
  const SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!SECRET) {
    throw new Error('JWT refresh secret not defined');
  }

  const token_id = uuidv4();
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const token = jwt.sign({ token_id, user_id } as RefreshTokenPayload, SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_TTL || '7d',
  } as jwt.SignOptions);

  const hashedToken = await hashRefreshToken(token);

  await prisma.refresh_token.create({
    data: {
      id: token_id,
      user_id,
      token_hash: hashedToken,
      ip_address: ip,
      user_agent: user_agent || 'Unknown Device',
      device: user_agent || 'Unknown Device',
      expires_at,
      last_used: new Date(),
    },
  });

  return token;
};

export const generateVerificationToken = (
  user_id: string,
  email: string,
  purpose: 'email_verification' | 'auth_verification',
  expiresIn = '24h'
): string => {
  const SECRET = process.env.JWT_VERIFICATION_SECRET || process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!SECRET) {
    throw new Error('JWT verification secret not defined');
  }

  const payload: VerificationTokenPayload = {
    user_id,
    email,
    purpose,
  };

  return jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!SECRET) {
    throw new Error('JWT Access Token Secret is not defined.');
  }

  return jwt.verify(token, SECRET) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!SECRET) {
    throw new Error('JWT Refresh Token Secret is not defined.');
  }

  return jwt.verify(token, SECRET) as RefreshTokenPayload;
};

export const verifyVerificationToken = (token: string): VerificationTokenPayload => {
  const SECRET = process.env.JWT_VERIFICATION_SECRET || process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!SECRET) {
    throw new Error('JWT Verification Secret is not defined.');
  }

  return jwt.verify(token, SECRET) as VerificationTokenPayload;
};

export const generateAuthCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
