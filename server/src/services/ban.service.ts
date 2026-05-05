import { userRepository } from '@/repositories/user.repository';
import { refreshTokenRepository } from '@/repositories/refreshToken.repository';
import { securityEventService } from '@/services/securityEvent.service';
import { security_event_type, user_status } from '@/generated/prisma/client';
import { NotFoundError, BadRequestError } from '@/utils/errors.util';
import prisma from '@/configs/prisma.config';

export interface BanInput {
  reason?: string;
  expires_at?: string; // ISO string, undefined = permanent
}

export class BanService {
  async banUser(targetId: string, adminId: string, input: BanInput) {
    const user = await userRepository.findById(targetId);
    if (!user) throw new NotFoundError('User');
    if (user.status === user_status.BANNED) throw new BadRequestError('User is already banned');

    const expiresAt = input.expires_at ? new Date(input.expires_at) : undefined;

    await userRepository.ban(targetId, input.reason, expiresAt);

    // Revoke all active sessions
    await refreshTokenRepository.revokeAllByUserId(targetId);

    // Unpublish all open jobs belonging to this user's companies
    await prisma.job.updateMany({
      where: { company_information: { user_id: targetId }, status: 'OPEN' },
      data: { status: 'PAUSED' },
    });

    void securityEventService.log(security_event_type.ACCOUNT_BANNED, {
      user_id: targetId,
      metadata: {
        banned_by: adminId,
        reason: input.reason ?? null,
        expires_at: expiresAt?.toISOString() ?? 'permanent',
      },
    });
  }

  async unbanUser(targetId: string, adminId: string) {
    const user = await userRepository.findById(targetId);
    if (!user) throw new NotFoundError('User');
    if (user.status !== user_status.BANNED) throw new BadRequestError('User is not banned');

    await userRepository.unban(targetId);

    // Republish jobs that were paused at ban time
    if (user.banned_at) {
      await prisma.job.updateMany({
        where: {
          company_information: { user_id: targetId },
          status: 'PAUSED',
          updated_at: { gte: user.banned_at },
        },
        data: { status: 'OPEN' },
      });
    }

    void securityEventService.log(security_event_type.ACCOUNT_UNBANNED, {
      user_id: targetId,
      metadata: { unbanned_by: adminId },
    });
  }

  // Called on login — auto-unban if temporary ban has expired
  async checkAndLiftExpiredBan(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || user.status !== user_status.BANNED) return;
    if (user.ban_expires_at && user.ban_expires_at < new Date()) {
      await userRepository.unban(userId);
    }
  }
}

export const banService = new BanService();
