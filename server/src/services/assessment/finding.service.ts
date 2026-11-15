import { randomUUID } from 'node:crypto';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { validateImageContent } from '@/middlewares/fileUpload.middleware';
import { addAssessmentJob } from '@/queues/assessment.queue';
import {
  aiAnalysisRepository,
  FindingFilters,
  findingRepository,
  scanRepository,
  targetRepository,
} from '@/repositories/assessment.repository';
import { securityEventService } from '@/services/securityEvent.service';
import { storageService } from '@/services/storage.service';
import { BadRequestError, NotFoundError, ValidationError } from '@/utils/errors.util';
import {
  finding_category,
  finding_status,
  security_event_type,
  severity_level,
} from '@/generated/prisma/client';
import { assertAiConfigured } from './ai/provider';
import type { RemediationResult } from './ai/schemas';
import type { Actor } from './target.service';

export type VerifyStatus = Extract<finding_status, 'CONFIRMED' | 'REJECTED' | 'FALSE_POSITIVE' | 'FIXED'>;

export class FindingService {
  list(filters: FindingFilters) {
    return findingRepository.findMany(filters);
  }

  async get(id: string) {
    const finding = await findingRepository.findById(id);
    if (!finding) throw new NotFoundError(ErrorMessages.BAYAWSEC.FINDING_NOT_FOUND);
    return finding;
  }

  /** Manual finding from a hand test (e.g. an IDOR check). Starts PENDING like AI findings. */
  async createManual(
    input: {
      target_id: string;
      scan_id?: string | undefined;
      title: string;
      category: finding_category;
      description: string;
      affected_asset: string;
      owasp_top10?: string | undefined;
      wstg_id?: string | undefined;
    },
    actor: Actor
  ) {
    const target = await targetRepository.findById(input.target_id);
    if (!target) throw new NotFoundError(ErrorMessages.BAYAWSEC.TARGET_NOT_FOUND);
    if (input.scan_id) {
      const scan = await scanRepository.findById(input.scan_id);
      if (!scan || scan.target_id !== input.target_id) throw new NotFoundError(ErrorMessages.BAYAWSEC.SCAN_NOT_FOUND);
    }
    const finding = await findingRepository.create({ ...input, source: 'MANUAL' });
    await this.audit(actor, 'bayawsec_finding_created', { finding_id: finding.id, target_id: input.target_id });
    return finding;
  }

  /**
   * The ONLY way a finding becomes CONFIRMED / REJECTED / FALSE_POSITIVE / FIXED.
   * D1 has no transactions, so the audit row is written before the status change.
   */
  async verify(
    id: string,
    input: {
      status: VerifyStatus;
      notes: string;
      final_severity?: severity_level | undefined;
      cvss_score?: number | undefined;
      cvss_vector?: string | undefined;
      owasp_top10?: string | undefined;
      wstg_id?: string | undefined;
    },
    actor: Actor
  ) {
    const finding = await this.get(id);

    if (input.status === 'CONFIRMED' && (input.final_severity === undefined || input.cvss_score === undefined)) {
      throw new BadRequestError(ErrorMessages.BAYAWSEC.CONFIRM_NEEDS_SEVERITY);
    }
    if (input.status === 'FIXED' && finding.status !== 'CONFIRMED') {
      throw new BadRequestError(ErrorMessages.BAYAWSEC.FIXED_NEEDS_CONFIRMED);
    }

    await findingRepository.addVerificationLog({
      finding_id: id,
      assessor_id: actor.user_id,
      assessor_email: actor.email,
      old_status: finding.status,
      new_status: input.status,
      notes: input.notes,
    });

    const updated = await findingRepository.update(id, {
      status: input.status,
      ...(input.final_severity !== undefined && { final_severity: input.final_severity }),
      ...(input.cvss_score !== undefined && { cvss_score: input.cvss_score }),
      ...(input.cvss_vector !== undefined && { cvss_vector: input.cvss_vector }),
      ...(input.owasp_top10 !== undefined && { owasp_top10: input.owasp_top10 }),
      ...(input.wstg_id !== undefined && { wstg_id: input.wstg_id }),
    });

    await this.audit(actor, 'bayawsec_finding_verified', {
      finding_id: id,
      from: finding.status,
      to: input.status,
      final_severity: input.final_severity,
    });
    return updated;
  }

  /** Queues Feature 2 (AI remediation draft) for a finding. */
  async requestRemediation(id: string, actor: Actor) {
    assertAiConfigured();
    await this.get(id);
    return addAssessmentJob({ type: 'REMEDIATE', ref_id: id, created_by: actor.user_id });
  }

  /** Sets the finding's remediation text, either written by hand or accepted from an AI draft. */
  async setRemediation(id: string, input: { remediation?: string | undefined; analysis_id?: string | undefined }) {
    await this.get(id);
    let text = input.remediation;
    if (!text && input.analysis_id) {
      const analysis = await aiAnalysisRepository.findById(input.analysis_id);
      if (!analysis || analysis.finding_id !== id || analysis.task !== 'REMEDIATE') {
        throw new NotFoundError(ErrorMessages.BAYAWSEC.ANALYSIS_NOT_FOUND);
      }
      const draft = analysis.output as unknown as RemediationResult;
      text = [
        draft.summary,
        '',
        ...draft.steps.map((step, i) => `${i + 1}. ${step}`),
        ...(draft.code_example ? ['', draft.code_example] : []),
        ...(draft.references.length > 0 ? ['', 'References:', ...draft.references.map((r) => `- ${r}`)] : []),
      ].join('\n');
    }
    if (!text) throw new ValidationError({ remediation: ['Provide remediation text or an analysis_id'] });
    return findingRepository.update(id, { remediation: text });
  }

  async aiAnalyses(id: string) {
    await this.get(id);
    return aiAnalysisRepository.findByFinding(id);
  }

  async addEvidence(
    id: string,
    input: {
      type: 'HTTP_EXCHANGE' | 'TOOL_OUTPUT' | 'SCREENSHOT';
      content?: string | undefined;
      scan_result_id?: string | undefined;
      file?: { buffer: Buffer; mimetype: string } | undefined;
    },
    actor: Actor
  ) {
    const finding = await this.get(id);
    let r2Key: string | undefined;

    if (input.type === 'SCREENSHOT') {
      if (!input.file) throw new BadRequestError('A screenshot file (PNG or JPEG) is required');
      const check = validateImageContent(input.file.buffer);
      if (!check.isValid || !check.detectedType) throw new BadRequestError('Screenshot must be a PNG or JPEG image');
      const extension = check.detectedType === 'image/png' ? 'png' : 'jpg';
      r2Key = await storageService.uploadAssessmentFile(
        `${finding.target_id}/evidence/${id}/${randomUUID()}.${extension}`,
        new Uint8Array(input.file.buffer),
        check.detectedType
      );
    } else if (!input.content && !input.scan_result_id) {
      throw new ValidationError({ content: ['Provide content or a scan_result_id'] });
    }

    return findingRepository.addEvidence({
      finding_id: id,
      type: input.type,
      scan_result_id: input.scan_result_id,
      r2_key: r2Key,
      content: input.content,
      created_by: actor.user_id,
    });
  }

  async downloadEvidence(evidenceId: string) {
    const evidence = await findingRepository.findEvidence(evidenceId);
    if (!evidence?.r2_key) throw new NotFoundError(ErrorMessages.BAYAWSEC.EVIDENCE_NOT_FOUND);
    return storageService.downloadAssessmentFile(evidence.r2_key);
  }

  private audit(actor: Actor, action: string, metadata: Record<string, unknown>) {
    return securityEventService.log(security_event_type.ADMIN_ACTION, {
      user_id: actor.user_id,
      ip_address: actor.ip_address,
      metadata: { action, ...metadata },
    });
  }
}

export const findingService = new FindingService();
