import prisma from '@/configs/prisma.config';

export interface CreateRefreshTokenData {
  id: string;
  user_id: string;
  token_hash: string;
  ip_address?: string;
  user_agent?: string;
  device?: string;
  expires_at: Date;
}

export class RefreshTokenRepository {
  async findById(id: string) {
    return prisma.refresh_token.findUnique({
      where: { id },
    });
  }

  async findByTokenHash(tokenHash: string) {
    return prisma.refresh_token.findUnique({
      where: { token_hash: tokenHash },
    });
  }

  async findActiveByUserId(userId: string) {
    return prisma.refresh_token.findMany({
      where: {
        user_id: userId,
        is_active: true,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(data: CreateRefreshTokenData) {
    return prisma.refresh_token.create({
      data: {
        id: data.id,
        user_id: data.user_id,
        token_hash: data.token_hash,
        ip_address: data.ip_address || null,
        user_agent: data.user_agent || null,
        device: data.device || null,
        expires_at: data.expires_at,
        last_used: new Date(),
        is_active: true,
      },
    });
  }

  async updateLastUsed(id: string) {
    return prisma.refresh_token.update({
      where: { id },
      data: {
        last_used: new Date(),
      },
    });
  }

  async revoke(id: string) {
    return prisma.refresh_token.update({
      where: { id },
      data: {
        is_active: false,
        revoked_at: new Date(),
      },
    });
  }

  async revokeAllByUserId(userId: string) {
    return prisma.refresh_token.updateMany({
      where: {
        user_id: userId,
        is_active: true,
      },
      data: {
        is_active: false,
        revoked_at: new Date(),
      },
    });
  }

  async revokeAllExceptCurrent(userId: string, currentTokenId: string) {
    return prisma.refresh_token.updateMany({
      where: {
        user_id: userId,
        is_active: true,
        id: { not: currentTokenId },
      },
      data: {
        is_active: false,
        revoked_at: new Date(),
      },
    });
  }

  async deleteExpired() {
    return prisma.refresh_token.deleteMany({
      where: {
        OR: [{ expires_at: { lt: new Date() } }, { is_active: false }],
      },
    });
  }

  async countActiveByUserId(userId: string) {
    return prisma.refresh_token.count({
      where: {
        user_id: userId,
        is_active: true,
        expires_at: { gt: new Date() },
      },
    });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
export default refreshTokenRepository;
