import cron from 'node-cron';
import prisma from '@/configs/prisma.config';
import logger from '@/configs/logger.config';

// Runs every 12 hours at minute 0
cron.schedule('0 */12 * * *', async () => {
  logger.info('Running expired token cleanup...');

  try {
    const revokeTokens = await prisma.refresh_token.updateMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
      data: {
        is_active: false,
        revoked_at: new Date(),
      },
    });

    logger.info(`Cleaned up ${revokeTokens.count} expired tokens.`);
  } catch (error) {
    logger.error('Error during expired token cleanup', { error });
  }
});

export default {};
