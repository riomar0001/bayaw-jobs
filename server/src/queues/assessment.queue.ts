import { env } from 'cloudflare:workers';
import logger from '@/configs/logger.config';
import { assessmentJobRepository } from '@/repositories/assessment.repository';
import type { assessment_job_type } from '@/generated/prisma/client';

/** Body of a Cloudflare Queues message: the job itself lives in the assessment_jobs table. */
export interface AssessmentQueueMessage {
  jobId: string;
}

/**
 * Records a job and sends it to the assessment queue (RUN_CHECK, INTERPRET, REMEDIATE).
 * AGENT_SCAN jobs are recorded only: the scanner agent pulls them over HTTP.
 */
export async function addAssessmentJob(data: {
  type: assessment_job_type;
  ref_id: string;
  payload?: Record<string, unknown> | undefined;
  created_by?: string | undefined;
}) {
  const job = await assessmentJobRepository.create(data);
  if (data.type !== 'AGENT_SCAN') {
    await env.ASSESSMENT_QUEUE.send({ jobId: job.id } satisfies AssessmentQueueMessage);
  }
  logger.info('Assessment job created', { jobId: job.id, type: data.type, ref: data.ref_id });
  return job;
}

export function isAssessmentQueueMessage(body: unknown): body is AssessmentQueueMessage {
  return typeof body === 'object' && body !== null && typeof (body as { jobId?: unknown }).jobId === 'string';
}
