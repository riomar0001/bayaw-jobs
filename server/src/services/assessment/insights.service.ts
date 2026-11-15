import { ErrorMessages } from '@/constants/errorMessages.constant';
import {
  aiAnalysisRepository,
  assessmentJobRepository,
  findingRepository,
  scanRepository,
  targetRepository,
} from '@/repositories/assessment.repository';
import { NotFoundError } from '@/utils/errors.util';

type CountRow = { _count: { _all: number } } & Record<string, unknown>;

function toCounts(rows: CountRow[], key: string): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [String(row[key] ?? 'UNSET'), row._count._all]));
}

/** Dashboard numbers, report data and job status for the BayawSec frontend. */
export class InsightsService {
  async dashboard(targetId?: string) {
    if (targetId && !(await targetRepository.findById(targetId))) {
      throw new NotFoundError(ErrorMessages.BAYAWSEC.TARGET_NOT_FOUND);
    }
    const [byStatus, byCategory, bySource, confirmedBySeverity, pendingByAiSeverity, scansByStatus] =
      await findingRepository.groupCounts(targetId);

    return {
      target_id: targetId ?? null,
      findings: {
        by_status: toCounts(byStatus as unknown as CountRow[], 'status'),
        by_category: toCounts(byCategory as unknown as CountRow[], 'category'),
        by_source: toCounts(bySource as unknown as CountRow[], 'source'),
        // Only verified findings count toward real severity.
        confirmed_by_severity: toCounts(confirmedBySeverity as unknown as CountRow[], 'final_severity'),
        pending_by_ai_severity: toCounts(pendingByAiSeverity as unknown as CountRow[], 'ai_severity'),
      },
      scans: { by_status: toCounts(scansByStatus as unknown as CountRow[], 'status') },
    };
  }

  /** Report data: confirmed (and fixed) findings only, with evidence and the latest decision. */
  async report(targetId: string) {
    const target = await targetRepository.findById(targetId);
    if (!target) throw new NotFoundError(ErrorMessages.BAYAWSEC.TARGET_NOT_FOUND);

    const [findings, scans, dashboard] = await Promise.all([
      findingRepository.findConfirmedForReport(targetId),
      scanRepository.findByTarget(targetId),
      this.dashboard(targetId),
    ]);

    return {
      generated_at: new Date().toISOString(),
      target: {
        id: target.id,
        name: target.name,
        base_url: target.base_url,
        description: target.description,
        authorization_note: target.authorization_note,
        test_window_start: target.test_window_start,
        test_window_end: target.test_window_end,
      },
      scope: target.scope_rules.map((r) => ({
        asset_type: r.asset_type,
        value: r.value,
        in_scope: r.in_scope,
        notes: r.notes,
      })),
      methodology: {
        frameworks: ['NIST SP 800-115', 'OWASP WSTG v4.2', 'OWASP Top 10:2021', 'CVSS v3.1', 'OWASP ASVS 4.0.3'],
        tools: [...new Set(scans.map((s) => s.tool))],
      },
      scans: scans.map((s) => ({
        id: s.id,
        tool: s.tool,
        source: s.source,
        status: s.status,
        finished_at: s.finished_at,
        results: s._count.results,
      })),
      summary: dashboard.findings,
      findings: findings.map((f) => ({
        id: f.id,
        title: f.title,
        category: f.category,
        status: f.status,
        severity: f.final_severity,
        cvss_score: f.cvss_score,
        cvss_vector: f.cvss_vector,
        owasp_top10: f.owasp_top10,
        wstg_id: f.wstg_id,
        source: f.source,
        affected_asset: f.affected_asset,
        description: f.description,
        remediation: f.remediation,
        verified: f.verification_logs[0]
          ? {
              by: f.verification_logs[0].assessor_email,
              at: f.verification_logs[0].created_at,
              notes: f.verification_logs[0].notes,
            }
          : null,
        evidence: f.evidence.map((e) => ({
          id: e.id,
          type: e.type,
          has_file: Boolean(e.r2_key),
          content: e.content ?? (e.scan_result ? JSON.stringify(e.scan_result.data) : null),
        })),
      })),
    };
  }

  async scanAnalyses(scanId: string) {
    if (!(await scanRepository.findById(scanId))) throw new NotFoundError(ErrorMessages.BAYAWSEC.SCAN_NOT_FOUND);
    return aiAnalysisRepository.findByScan(scanId);
  }

  async job(jobId: string) {
    const job = await assessmentJobRepository.findById(jobId);
    if (!job) throw new NotFoundError(ErrorMessages.BAYAWSEC.JOB_NOT_FOUND);
    return job;
  }
}

export const insightsService = new InsightsService();
