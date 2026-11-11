import prisma from '@/configs/prisma.config';
import { email_job, email_job_status } from '@/generated/prisma/client';
import { enqueueEmailJobs } from '@/queues/email.queue';
import { Config } from '@/constants/config.constant';
import { NotFoundError, BadRequestError } from '@/utils/errors.util';
import logger from '@/configs/logger.config';

// Cloudflare Queues can't be listed or edited from code, so the admin view is
// served from the email_jobs table that the producer and consumer keep current.
const QUEUE_NAMES = [Config.EMAIL_QUEUE.NAME] as const;
const BULK_LIMIT = 500;

export type JobState = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused';

export interface QueueSummary {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
  isPaused: boolean;
}

export interface JobRow {
  id: string;
  name: string;
  state: string;
  data: unknown;
  opts: unknown;
  attemptsMade: number;
  maxAttempts: number;
  failedReason: string | null;
  stacktrace: string[];
  processedOn: number | null;
  finishedOn: number | null;
  timestamp: number;
  delay: number;
}

function formatJob(job: email_job, state: string): JobRow {
  return {
    id: job.id,
    name: job.type,
    state,
    data: { type: job.type, to: job.to, subject: job.subject },
    opts: { attempts: job.max_attempts },
    attemptsMade: job.attempts_made,
    maxAttempts: job.max_attempts,
    failedReason: job.failed_reason,
    stacktrace: [],
    processedOn: job.processed_at?.getTime() ?? null,
    finishedOn: job.finished_at?.getTime() ?? null,
    timestamp: job.created_at.getTime(),
    delay: 0,
  };
}

function assertQueue(name: string): void {
  if (!(QUEUE_NAMES as readonly string[]).includes(name)) {
    throw new NotFoundError(`Queue '${name}'`);
  }
}

async function isQueuePaused(name: string): Promise<boolean> {
  const setting = await prisma.queue_setting.findUnique({ where: { name } });
  return setting?.is_paused ?? false;
}

async function setPaused(name: string, is_paused: boolean): Promise<void> {
  await prisma.queue_setting.upsert({
    where: { name },
    create: { name, is_paused },
    update: { is_paused },
  });
}

/** Maps a UI state onto stored statuses. Returns null for states this backend never produces. */
function statusesFor(state: JobState, paused: boolean): email_job_status[] | null {
  switch (state) {
    case 'waiting':
      return paused ? null : ['WAITING'];
    case 'paused':
      return paused ? ['WAITING'] : null;
    case 'active':
      return ['ACTIVE'];
    case 'completed':
      return ['COMPLETED'];
    case 'failed':
      return ['FAILED'];
    case 'delayed':
      return null;
    default: {
      const unknown: never = state;
      throw new BadRequestError(`Unknown job state '${String(unknown)}'`);
    }
  }
}

function clampRange(start: number, end: number): { skip: number; take: number } {
  const skip = Math.max(0, start);
  const take = Math.min(Math.max(0, end - skip + 1), BULK_LIMIT);
  return { skip, take };
}

export class QueueService {
  async getAllQueues(): Promise<QueueSummary[]> {
    return Promise.all(
      QUEUE_NAMES.map(async (name) => {
        const [grouped, isPaused] = await Promise.all([
          prisma.email_job.groupBy({ by: ['status'], where: { queue: name }, _count: { _all: true } }),
          isQueuePaused(name),
        ]);
        const count = (status: email_job_status) =>
          grouped.find((g) => g.status === status)?._count._all ?? 0;
        const waiting = count('WAITING');

        return {
          name,
          waiting: isPaused ? 0 : waiting,
          active: count('ACTIVE'),
          completed: count('COMPLETED'),
          failed: count('FAILED'),
          delayed: 0,
          paused: isPaused ? waiting : 0,
          isPaused,
        };
      })
    );
  }

  async getJobs(
    queueName: string,
    state: JobState,
    start = 0,
    end = 49
  ): Promise<{ jobs: JobRow[]; total: number }> {
    assertQueue(queueName);
    const statuses = statusesFor(state, await isQueuePaused(queueName));
    if (!statuses) return { jobs: [], total: 0 };

    const where = { queue: queueName, status: { in: statuses } };
    const [jobs, total] = await Promise.all([
      prisma.email_job.findMany({ where, orderBy: { created_at: 'desc' }, ...clampRange(start, end) }),
      prisma.email_job.count({ where }),
    ]);
    return { jobs: jobs.map((j) => formatJob(j, state)), total };
  }

  /** Every FAILED row has exhausted its retries: it only gets that status from the dead-letter queue. */
  async getDlqJobs(queueName: string, start = 0, end = 49): Promise<{ jobs: JobRow[]; total: number }> {
    return this.getJobs(queueName, 'failed', start, end);
  }

  async retryJob(queueName: string, jobId: string): Promise<void> {
    assertQueue(queueName);
    const job = await prisma.email_job.findFirst({ where: { id: jobId, queue: queueName } });
    if (!job) throw new NotFoundError(`Job '${jobId}'`);
    if (job.status !== 'FAILED') {
      throw new BadRequestError(`Job '${jobId}' is not in failed state (current: ${job.status.toLowerCase()})`);
    }

    await this.requeue([jobId]);
    logger.info('Admin retried email job', { jobId, queueName });
  }

  async removeJob(queueName: string, jobId: string): Promise<void> {
    assertQueue(queueName);
    const { count } = await prisma.email_job.deleteMany({ where: { id: jobId, queue: queueName } });
    if (count === 0) throw new NotFoundError(`Job '${jobId}'`);
    logger.info('Admin removed email job', { jobId, queueName });
  }

  async retryAllDlq(queueName: string): Promise<{ retried: number }> {
    assertQueue(queueName);
    const failed = await prisma.email_job.findMany({
      where: { queue: queueName, status: 'FAILED' },
      select: { id: true },
      take: BULK_LIMIT,
    });
    await this.requeue(failed.map((j) => j.id));
    logger.info('Admin retried DLQ email jobs', { queueName, retried: failed.length });
    return { retried: failed.length };
  }

  async clearDlq(queueName: string): Promise<{ removed: number }> {
    assertQueue(queueName);
    const { count } = await prisma.email_job.deleteMany({ where: { queue: queueName, status: 'FAILED' } });
    logger.info('Admin cleared DLQ email jobs', { queueName, removed: count });
    return { removed: count };
  }

  async pauseQueue(queueName: string): Promise<void> {
    assertQueue(queueName);
    await setPaused(queueName, true);
    logger.info('Admin paused queue', { queueName });
  }

  async resumeQueue(queueName: string): Promise<void> {
    assertQueue(queueName);
    await setPaused(queueName, false);
    logger.info('Admin resumed queue', { queueName });
  }

  /** Deleting the rows is enough: the consumer acks messages whose row is gone. */
  async drainQueue(queueName: string): Promise<void> {
    assertQueue(queueName);
    await prisma.email_job.deleteMany({ where: { queue: queueName, status: 'WAITING' } });
    logger.info('Admin drained queue', { queueName });
  }

  getQueueNames(): string[] {
    return [...QUEUE_NAMES];
  }

  private async requeue(jobIds: string[]): Promise<void> {
    if (jobIds.length === 0) return;
    await prisma.email_job.updateMany({
      where: { id: { in: jobIds } },
      data: { status: 'WAITING', attempts_made: 0, failed_reason: null, finished_at: null },
    });
    await enqueueEmailJobs(jobIds);
  }
}

export const queueService = new QueueService();
