import { Queue, QueueEvents, JobsOptions, ConnectionOptions } from 'bullmq';
import { createRedisConnection } from '@/configs/bullmq.config';
import { Config } from '@/constants/config.constant';
import logger from '@/configs/logger.config';

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface EmailJobData {
  type: 'verification' | 'auth_code' | 'certificate';
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
  metadata?: Record<string, unknown>;
}

const defaultJobOptions: JobsOptions = {
  attempts: Config.EMAIL_QUEUE.MAX_ATTEMPTS,
  backoff: {
    type: Config.EMAIL_QUEUE.BACKOFF_TYPE,
    delay: Config.EMAIL_QUEUE.BACKOFF_DELAY,
  },
  removeOnComplete: {
    count: 100,
    age: 24 * 60 * 60, // 24 hours
  },
  removeOnFail: {
    count: 500,
    age: 7 * 24 * 60 * 60, // 7 days
  },
};

type EmailJobName = EmailJobData['type'];

export const emailQueue = new Queue<EmailJobData, void, EmailJobName>(Config.EMAIL_QUEUE.NAME, {
  connection: createRedisConnection() as unknown as ConnectionOptions,
  defaultJobOptions,
});

export const emailQueueEvents = new QueueEvents(Config.EMAIL_QUEUE.NAME, {
  connection: createRedisConnection() as unknown as ConnectionOptions,
});

// Queue event listeners
emailQueueEvents.on('completed', ({ jobId }) => {
  logger.info(`Email job ${jobId} completed`);
});

emailQueueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Email job ${jobId} failed`, { jobId, reason: failedReason });
});

emailQueueEvents.on('stalled', ({ jobId }) => {
  logger.warn(`Email job ${jobId} stalled`);
});

export const addEmailJob = async (data: EmailJobData, options?: JobsOptions) => {
  const priority = data.type === 'verification' || data.type === 'auth_code' ? 1 : 2;

  return emailQueue.add(data.type, data, {
    ...options,
    priority,
  });
};

export const getQueueStats = async () => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    emailQueue.getWaitingCount(),
    emailQueue.getActiveCount(),
    emailQueue.getCompletedCount(),
    emailQueue.getFailedCount(),
    emailQueue.getDelayedCount(),
  ]);

  return { waiting, active, completed, failed, delayed };
};

export default emailQueue;
