import { ErrorMessages } from '@/constants/errorMessages.constant';
import { aiAnalysisRepository, findingRepository } from '@/repositories/assessment.repository';
import { NotFoundError } from '@/utils/errors.util';
import { REMEDIATE_SYSTEM_PROMPT, STACK_CONTEXT } from './prompts';
import { askJson } from './provider';
import { RemediationJsonSchema, RemediationSchema } from './schemas';

// Feature 2: Suggesting vulnerability remediation. The result is a DRAFT stored in
// ai_analysis; the assessor accepts or edits it via PATCH findings/:id/remediation.

const MAX_EVIDENCE_ITEMS = 8;

export class RemediateService {
  async run(findingId: string, createdBy?: string) {
    const finding = await findingRepository.findById(findingId);
    if (!finding) throw new NotFoundError(ErrorMessages.BAYAWSEC.FINDING_NOT_FOUND);

    const evidence = finding.evidence.slice(0, MAX_EVIDENCE_ITEMS).map((e, index) => {
      const data = e.scan_result ? JSON.stringify(e.scan_result.data) : (e.content ?? '');
      return `e${index + 1} ${e.type} ${data.slice(0, 800)}`;
    });

    const untrusted = [
      `Finding: ${finding.title}`,
      `Category: ${finding.category}`,
      `Status: ${finding.status}`,
      `Affected asset: ${finding.affected_asset}`,
      `OWASP Top 10: ${finding.owasp_top10 ?? 'N/A'} | WSTG: ${finding.wstg_id ?? 'N/A'}`,
      `Description: ${finding.description}`,
      'Evidence:',
      ...(evidence.length > 0 ? evidence : ['(no evidence attached)']),
    ].join('\n');

    const ai = await askJson({
      task: 'remediate',
      system: REMEDIATE_SYSTEM_PROMPT,
      context: STACK_CONTEXT,
      untrusted,
      schema: RemediationSchema,
      jsonSchema: RemediationJsonSchema,
    });

    const analysis = await aiAnalysisRepository.create({
      finding_id: finding.id,
      task: 'REMEDIATE',
      provider: ai.provider,
      model: ai.model,
      input_hash: ai.inputHash,
      output: ai.result,
      tokens_in: ai.tokensIn,
      tokens_out: ai.tokensOut,
      created_by: createdBy,
    });

    return { analysis_id: analysis.id, draft: ai.result };
  }
}

export const remediateService = new RemediateService();
