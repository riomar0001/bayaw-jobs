import { ErrorMessages } from '@/constants/errorMessages.constant';
import {
  aiAnalysisRepository,
  findingRepository,
  scanRepository,
} from '@/repositories/assessment.repository';
import { BadRequestError, NotFoundError } from '@/utils/errors.util';
import { INTERPRET_SYSTEM_PROMPT } from './prompts';
import { askJson } from './provider';
import { InterpretJsonSchema, InterpretSchema } from './schemas';

// Feature 1: Interpreting scan results. Output becomes PENDING findings only.

const MAX_RESULTS_IN_PROMPT = 150;
const MAX_LINE_CHARS = 600;

export class InterpretService {
  async run(scanId: string, createdBy?: string) {
    const scan = await scanRepository.findByIdWithResults(scanId);
    if (!scan) throw new NotFoundError(ErrorMessages.BAYAWSEC.SCAN_NOT_FOUND);
    if (scan.status !== 'DONE') throw new BadRequestError(ErrorMessages.BAYAWSEC.SCAN_NOT_DONE);
    if (scan.results.length === 0) throw new BadRequestError(ErrorMessages.BAYAWSEC.SCAN_HAS_NO_RESULTS);

    // Number each result so the AI can cite evidence, and keep the map back to row ids.
    const refs = new Map<string, string>();
    const lines = scan.results.slice(0, MAX_RESULTS_IN_PROMPT).map((result, index) => {
      const ref = `r${index + 1}`;
      refs.set(ref, result.id);
      return `${ref} ${result.type} ${JSON.stringify(result.data).slice(0, MAX_LINE_CHARS)}`;
    });
    const header = `Tool: ${scan.tool} (source: ${scan.source})\nTarget: ${scan.target.name} ${scan.target.base_url}\nResults: ${scan.results.length}${
      scan.results.length > MAX_RESULTS_IN_PROMPT ? ` (first ${MAX_RESULTS_IN_PROMPT} shown)` : ''
    }`;

    const ai = await askJson({
      task: 'interpret',
      system: INTERPRET_SYSTEM_PROMPT,
      untrusted: `${header}\n${lines.join('\n')}`,
      schema: InterpretSchema,
      jsonSchema: InterpretJsonSchema,
    });

    const analysis = await aiAnalysisRepository.create({
      scan_id: scan.id,
      task: 'INTERPRET',
      provider: ai.provider,
      model: ai.model,
      input_hash: ai.inputHash,
      output: ai.result,
      tokens_in: ai.tokensIn,
      tokens_out: ai.tokensOut,
      created_by: createdBy,
    });

    const created: string[] = [];
    for (const item of ai.result.findings) {
      const finding = await findingRepository.create({
        target_id: scan.target_id,
        scan_id: scan.id,
        title: item.title,
        category: item.category,
        description: item.explanation,
        affected_asset: item.affected_asset,
        source: 'AI',
        ai_severity: item.suggested_severity,
        owasp_top10: item.owasp_top10,
        wstg_id: item.wstg_id,
      });
      created.push(finding.id);

      // Link the cited tool results as evidence. Unknown refs (hallucinated) are ignored.
      for (const ref of new Set(item.evidence_refs)) {
        const resultId = refs.get(ref.trim().toLowerCase());
        if (!resultId) continue;
        const result = scan.results.find((r) => r.id === resultId);
        await findingRepository.addEvidence({
          finding_id: finding.id,
          type: 'TOOL_OUTPUT',
          scan_result_id: resultId,
          content: result ? JSON.stringify(result.data).slice(0, 4000) : undefined,
          created_by: createdBy,
        });
      }
    }

    return { analysis_id: analysis.id, findings_created: created.length, finding_ids: created };
  }
}

export const interpretService = new InterpretService();
