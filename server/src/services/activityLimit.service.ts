import prisma from '@/configs/prisma.config';
import { Config } from '@/constants/config.constant';
import { TooManyRequestsError } from '@/utils/errors.util';

export type ActivityAction = keyof typeof Config.ACTIVITY_LIMITS;

const ACTION_LABELS: Record<ActivityAction, string> = {
  APPLY: 'job applications',
  SIGNUP: 'sign-ups from this network',
  CONTACT: 'contact messages from this network',
  POST_JOB: 'job posts',
  UPLOAD: 'file uploads',
  WRITE: 'changes',
};

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

/** Calendar day in Asia/Manila, matching the midnight reset. */
export function demoDay(now = new Date()): string {
  return new Date(now.getTime() + MANILA_OFFSET_MS).toISOString().slice(0, 10);
}

export class ActivityLimitService {
  /**
   * Counts one action for the user and rejects it once today's cap is passed.
   * The increment is a single upsert, so concurrent requests can't both slip under the cap.
   */
  async consume(userId: string, action: ActivityAction): Promise<void> {
    if (!userId) throw new TooManyRequestsError('Activity limit check failed: no user');

    const limit = Config.ACTIVITY_LIMITS[action];
    const day = demoDay();

    const { count } = await prisma.user_activity.upsert({
      where: { user_id_action_day: { user_id: userId, action, day } },
      create: { user_id: userId, action, day, count: 1 },
      update: { count: { increment: 1 } },
      select: { count: true },
    });

    if (count > limit) {
      throw new TooManyRequestsError(
        `Demo limit reached: ${limit} ${ACTION_LABELS[action]} per day. Limits reset at 12:00 AM (PHT).`
      );
    }
  }
}

export const activityLimitService = new ActivityLimitService();
