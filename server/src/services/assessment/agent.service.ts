import { Config } from '@/constants/config.constant';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { assessmentJobRepository, scanRepository } from '@/repositories/assessment.repository';
import { BadRequestError, NotFoundError } from '@/utils/errors.util';
import { scanService } from './scan.service';

interface AgentPayload {
  tool: 'NMAP' | 'ZAP';
  host?: string;
  url?: string;
  ports?: string;
}

const MAX_CLAIM_TRIES = 3;

/** Server side of the optional scanner agent (see /scanner-agent). */
export class AgentService {
  /** What the agent may touch. The agent re-checks every job against this list. */
  config() {
    return { allowed_hosts: Config.BAYAWSEC.ALLOWED_HOSTS };
  }

  /** Claims the oldest waiting AGENT_SCAN job, or returns null when there is none. */
  async claimNext() {
    for (let attempt = 0; attempt < MAX_CLAIM_TRIES; attempt++) {
      const job = await assessmentJobRepository.findNextWaiting('AGENT_SCAN');
      if (!job) return null;
      // Another agent may have claimed it first; D1 has no transactions, so retry.
      if (!(await assessmentJobRepository.claim(job.id))) continue;
      const scan = await scanRepository.findById(job.ref_id);
      if (!scan) {
        await assessmentJobRepository.markStatus(job.id, 'FAILED', 'Scan no longer exists');
        continue;
      }
      await scanRepository.markRunning(scan.id);
      return { job_id: job.id, scan_id: scan.id, target_id: scan.target_id, ...(job.payload as unknown as AgentPayload) };
    }
    return null;
  }

  async submitResult(
    jobId: string,
    input: { file?: { buffer: Buffer; originalname: string } | undefined; error?: string | undefined }
  ) {
    const job = await assessmentJobRepository.findById(jobId);
    if (!job || job.type !== 'AGENT_SCAN') throw new NotFoundError(ErrorMessages.BAYAWSEC.JOB_NOT_FOUND);
    if (job.status !== 'ACTIVE') throw new BadRequestError('This job is not claimed or is already finished');

    const scan = await scanRepository.findById(job.ref_id);
    if (!scan) throw new NotFoundError(ErrorMessages.BAYAWSEC.SCAN_NOT_FOUND);

    if (input.error || !input.file) {
      const reason = input.error ?? ErrorMessages.BAYAWSEC.IMPORT_FILE_REQUIRED;
      await scanRepository.markFailed(scan.id, reason);
      await assessmentJobRepository.markStatus(job.id, 'FAILED', reason);
      return { status: 'FAILED' };
    }

    try {
      const tool = scan.tool === 'NMAP' ? 'NMAP' : 'ZAP';
      const result = await scanService.importReport(
        scan.target_id,
        tool,
        input.file,
        { user_id: scan.started_by ?? undefined },
        scan.id
      );
      await assessmentJobRepository.markStatus(job.id, 'COMPLETED', null);
      return { status: 'COMPLETED', results: result.results };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      await scanRepository.markFailed(scan.id, reason);
      await assessmentJobRepository.markStatus(job.id, 'FAILED', reason);
      throw error;
    }
  }
}

export const agentService = new AgentService();
