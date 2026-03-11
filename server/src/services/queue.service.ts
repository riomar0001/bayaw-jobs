import { Queue, Job} from 'bullmq';
import { emailQueue } from '@/queues/email.queue';
import { NotFoundError, BadRequestError } from '@/utils/errors.util';
import logger from '@/configs/logger.config';

// Central registry of all queues
const QUEUE_REGISTRY: Record<string, Queue> = {
  email: emailQueue,
};

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

function formatJob(job: Job, state: string): JobRow {
  return {
    id: job.id ?? '',
    name: job.name,
    state,
    data: job.data,
    opts: job.opts,
    attemptsMade: job.attemptsMade,
    maxAttempts: (job.opts.attempts as number) ?? 1,
    failedReason: job.failedReason ?? null,
    stacktrace: job.stacktrace ?? [],
    processedOn: job.processedOn ?? null,
    finishedOn: job.finishedOn ?? null,
    timestamp: job.timestamp,
    delay: job.opts.delay ?? 0,
  };
}

function getQueue(name: string): Queue {
  const queue = QUEUE_REGISTRY[name];
  if (!queue) {
    throw new NotFoundError(`Queue '${name}'`);
  }
  return queue;
}

export class QueueService {
  /** List all queues with their counts */
  async getAllQueues(): Promise<QueueSummary[]> {
    const summaries = await Promise.all(
      Object.entries(QUEUE_REGISTRY).map(async ([name, queue]) => {
        const [counts, isPaused] = await Promise.all([
          queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'paused'),
          queue.isPaused(),
        ]);
        return {
          name,
          waiting: counts.waiting ?? 0,
          active: counts.active ?? 0,
          completed: counts.completed ?? 0,
          failed: counts.failed ?? 0,
          delayed: counts.delayed ?? 0,
          paused: counts.paused ?? 0,
          isPaused,
        };
      }),
    );
    return summaries;
  }

  /** Get jobs for a queue filtered by state */
  async getJobs(
    queueName: string,
    state: JobState,
    start = 0,
    end = 49,
  ): Promise<{ jobs: JobRow[]; total: number }> {
    const queue = getQueue(queueName);
    const [jobs, total] = await Promise.all([
      queue.getJobs([state], start, end),
      queue.getJobCountByTypes(state),
    ]);
    return {
      jobs: jobs.map((j) => formatJob(j, state)),
      total,
    };
  }

  /** Get failed (DLQ) jobs — those that exhausted all retries */
  async getDlqJobs(
    queueName: string,
    start = 0,
    end = 49,
  ): Promise<{ jobs: JobRow[]; total: number }> {
    const queue = getQueue(queueName);
    const [allFailed, total] = await Promise.all([
      queue.getJobs(['failed'], start, end),
      queue.getFailedCount(),
    ]);

    // DLQ = jobs where attemptsMade >= max attempts (exhausted retries)
    const dlqJobs = allFailed.filter(
      (j) => j.attemptsMade >= ((j.opts.attempts as number) ?? 1),
    );

    return {
      jobs: dlqJobs.map((j) => formatJob(j, 'failed')),
      total,
    };
  }

  /** Retry a single failed job */
  async retryJob(queueName: string, jobId: string): Promise<void> {
    const queue = getQueue(queueName);
    const job = await Job.fromId(queue, jobId);
    if (!job) throw new NotFoundError(`Job '${jobId}'`);

    const state = await job.getState();
    if (state !== 'failed') {
      throw new BadRequestError(`Job '${jobId}' is not in failed state (current: ${state})`);
    }

    await job.retry('failed');
    logger.info(`Admin retried job ${jobId} in queue ${queueName}`);
  }

  /** Remove a single job */
  async removeJob(queueName: string, jobId: string): Promise<void> {
    const queue = getQueue(queueName);
    const job = await Job.fromId(queue, jobId);
    if (!job) throw new NotFoundError(`Job '${jobId}'`);
    await job.remove();
    logger.info(`Admin removed job ${jobId} from queue ${queueName}`);
  }

  /** Retry all failed (DLQ) jobs in a queue */
  async retryAllDlq(queueName: string): Promise<{ retried: number }> {
    const queue = getQueue(queueName);
    const failedJobs = await queue.getJobs(['failed'], 0, 500);
    const dlqJobs = failedJobs.filter(
      (j) => j.attemptsMade >= ((j.opts.attempts as number) ?? 1),
    );

    let retried = 0;
    await Promise.allSettled(
      dlqJobs.map(async (j) => {
        await j.retry('failed');
        retried++;
      }),
    );

    logger.info(`Admin retried ${retried} DLQ jobs in queue ${queueName}`);
    return { retried };
  }

  /** Clear all failed (DLQ) jobs in a queue */
  async clearDlq(queueName: string): Promise<{ removed: number }> {
    const queue = getQueue(queueName);
    // clean(grace, limit, type) — grace=0 removes immediately
    const removed = await queue.clean(0, 1000, 'failed');
    logger.info(`Admin cleared ${removed.length} DLQ jobs from queue ${queueName}`);
    return { removed: removed.length };
  }

  /** Pause a queue */
  async pauseQueue(queueName: string): Promise<void> {
    const queue = getQueue(queueName);
    await queue.pause();
    logger.info(`Admin paused queue ${queueName}`);
  }

  /** Resume a paused queue */
  async resumeQueue(queueName: string): Promise<void> {
    const queue = getQueue(queueName);
    await queue.resume();
    logger.info(`Admin resumed queue ${queueName}`);
  }

  /** Drain a queue (remove all waiting/delayed jobs) */
  async drainQueue(queueName: string): Promise<void> {
    const queue = getQueue(queueName);
    await queue.drain();
    logger.info(`Admin drained queue ${queueName}`);
  }

  /** Get list of registered queue names */
  getQueueNames(): string[] {
    return Object.keys(QUEUE_REGISTRY);
  }
}

export const queueService = new QueueService();
