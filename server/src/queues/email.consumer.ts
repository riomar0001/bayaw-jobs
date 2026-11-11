import prisma from '@/configs/prisma.config';
import { Config } from '@/constants/config.constant';
import logger from '@/configs/logger.config';
import type { EmailQueueMessage } from './email.queue';

const PAUSED_RETRY_DELAY_SECONDS = 60;

function isEmailQueueMessage(body: unknown): body is EmailQueueMessage {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as { jobId?: unknown }).jobId === 'string'
  );
}

async function isPaused(): Promise<boolean> {
  const setting = await prisma.queue_setting.findUnique({
    where: { name: Config.EMAIL_QUEUE.NAME },
  });
  return setting?.is_paused ?? false;
}

/**
 * Demo delivery: the email is recorded as sent but never leaves Cloudflare.
 * shortcut: no real delivery, swap in an Email Sending binding to send for real.
 */
async function deliver(jobId: string): Promise<void> {
  logger.info('Demo mode: email marked as sent without delivery', { jobId });
}

export async function handleEmailBatch(batch: MessageBatch<unknown>): Promise<void> {
  const paused = await isPaused();

  for (const message of batch.messages) {
    if (!isEmailQueueMessage(message.body)) {
      logger.error('Dropping malformed email queue message', { id: message.id });
      message.ack();
      continue;
    }

    if (paused) {
      message.retry({ delaySeconds: PAUSED_RETRY_DELAY_SECONDS });
      continue;
    }

    const { jobId } = message.body;
    const job = await prisma.email_job.findUnique({ where: { id: jobId } });

    // Removed or drained from the admin page, or wiped by the nightly reset.
    if (!job || job.status === 'COMPLETED') {
      message.ack();
      continue;
    }

    await prisma.email_job.update({
      where: { id: jobId },
      data: { status: 'ACTIVE', attempts_made: { increment: 1 }, processed_at: new Date() },
    });

    try {
      await deliver(jobId);
      await prisma.email_job.update({
        where: { id: jobId },
        data: { status: 'COMPLETED', finished_at: new Date(), failed_reason: null },
      });
      message.ack();
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      logger.error('Email job attempt failed', { jobId, reason });
      await prisma.email_job.update({
        where: { id: jobId },
        data: { status: 'WAITING', failed_reason: reason },
      });
      message.retry();
    }
  }
}

/** Messages land here after exhausting max_retries on the main queue. */
export async function handleEmailDeadLetters(batch: MessageBatch<unknown>): Promise<void> {
  for (const message of batch.messages) {
    if (isEmailQueueMessage(message.body)) {
      await prisma.email_job.updateMany({
        where: { id: message.body.jobId },
        data: { status: 'FAILED', finished_at: new Date() },
      });
    }
    message.ack();
  }
}
