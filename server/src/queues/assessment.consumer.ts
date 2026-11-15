import logger from '@/configs/logger.config';
import { assessmentJobRepository } from '@/repositories/assessment.repository';
import { interpretService } from '@/services/assessment/ai/interpret.service';
import { remediateService } from '@/services/assessment/ai/remediate.service';
import { scanService } from '@/services/assessment/scan.service';
import { AppError } from '@/utils/errors.util';
import { isAssessmentQueueMessage } from './assessment.queue';

/** 4xx errors (bad input, out of scope, not found) won't succeed on retry. */
function isPermanent(error: unknown): boolean {
  return error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500;
}

export async function handleAssessmentBatch(batch: MessageBatch<unknown>): Promise<void> {
  for (const message of batch.messages) {
    if (!isAssessmentQueueMessage(message.body)) {
      logger.error('Dropping malformed assessment queue message', { id: message.id });
      message.ack();
      continue;
    }

    const job = await assessmentJobRepository.findById(message.body.jobId);
    if (!job || job.status === 'COMPLETED' || job.status === 'FAILED') {
      message.ack();
      continue;
    }

    await assessmentJobRepository.markActive(job.id);
    try {
      // Results are read back through GET scans/:id/ai and GET findings/:id/ai.
      if (job.type === 'RUN_CHECK') await scanService.runWorkerCheck(job.ref_id);
      else if (job.type === 'INTERPRET') await interpretService.run(job.ref_id, job.created_by ?? undefined);
      else if (job.type === 'REMEDIATE') await remediateService.run(job.ref_id, job.created_by ?? undefined);
      else throw new Error(`Job type ${job.type} is not handled by the queue`);

      await assessmentJobRepository.markStatus(job.id, 'COMPLETED', null);
      message.ack();
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      logger.error('Assessment job attempt failed', { jobId: job.id, type: job.type, reason });
      if (isPermanent(error)) {
        await assessmentJobRepository.markStatus(job.id, 'FAILED', reason);
        message.ack();
      } else {
        await assessmentJobRepository.markStatus(job.id, 'WAITING', reason);
        message.retry({ delaySeconds: 10 });
      }
    }
  }
}

/** Messages land here after exhausting max_retries on the main queue. */
export async function handleAssessmentDeadLetters(batch: MessageBatch<unknown>): Promise<void> {
  for (const message of batch.messages) {
    if (isAssessmentQueueMessage(message.body)) {
      await assessmentJobRepository.markStatus(message.body.jobId, 'FAILED');
    }
    message.ack();
  }
}
