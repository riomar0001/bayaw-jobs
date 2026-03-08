import prisma from '@/configs/prisma.config';

export interface CreateAuthCodeData {
  user_id: string;
  code: string;
  expires_at: Date;
}

export class AuthCodeRepository {
  async create(data: CreateAuthCodeData) {
    // Invalidate any existing unused codes for this user
    await prisma.auth_code.updateMany({
      where: {
        user_id: data.user_id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    return prisma.auth_code.create({
      data: {
        user_id: data.user_id,
        code: data.code,
        expires_at: data.expires_at,
      },
    });
  }

  async findValidCode(userId: string, code: string) {
    return prisma.auth_code.findFirst({
      where: {
        user_id: userId,
        code,
        used: false,
        expires_at: { gt: new Date() },
      },
    });
  }

  async markAsUsed(id: string) {
    return prisma.auth_code.update({
      where: { id },
      data: { used: true },
    });
  }

  async deleteExpired() {
    return prisma.auth_code.deleteMany({
      where: {
        OR: [{ expires_at: { lt: new Date() } }, { used: true }],
      },
    });
  }

  async invalidateAllForUser(userId: string) {
    return prisma.auth_code.updateMany({
      where: {
        user_id: userId,
        used: false,
      },
      data: {
        used: true,
      },
    });
  }
}

export const authCodeRepository = new AuthCodeRepository();
export default authCodeRepository;
