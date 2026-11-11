import { env } from 'cloudflare:workers';
import prisma from '@/configs/prisma.config';
import { Config } from '@/constants/config.constant';
import logger from '@/configs/logger.config';

export interface EmailJobData {
  type: 'verification' | 'auth_code' | 'certificate';
  to: string;
  subject: string;
  html: string;
}

/** Body of a Cloudflare Queues message: the email itself lives in the email_jobs table. */
export interface EmailQueueMessage {
  jobId: string;
}

export const addEmailJob = async (data: EmailJobData) => {
  const job = await prisma.email_job.create({
    data: {
      queue: Config.EMAIL_QUEUE.NAME,
      type: data.type,
      to: data.to,
      subject: data.subject,
      html: data.html,
      max_attempts: Config.EMAIL_QUEUE.MAX_ATTEMPTS,
    },
    select: { id: true },
  });

  await enqueueEmailJob(job.id);
  logger.info('Email job queued', { jobId: job.id, type: data.type });
  return job;
};

export const enqueueEmailJob = async (jobId: string) => {
  const message: EmailQueueMessage = { jobId };
  await env.EMAIL_QUEUE.send(message);
};

const SEND_BATCH_LIMIT = 100; // Cloudflare Queues sendBatch maximum

export const enqueueEmailJobs = async (jobIds: string[]) => {
  for (let i = 0; i < jobIds.length; i += SEND_BATCH_LIMIT) {
    const chunk = jobIds.slice(i, i + SEND_BATCH_LIMIT);
    await env.EMAIL_QUEUE.sendBatch(chunk.map((jobId) => ({ body: { jobId } satisfies EmailQueueMessage })));
  }
};

export default addEmailJob;
