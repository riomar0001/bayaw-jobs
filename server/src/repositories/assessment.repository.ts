import prisma from '@/configs/prisma.config';
import {
  Prisma,
  ai_task,
  assessment_job_status,
  assessment_job_type,
  finding_category,
  finding_source,
  finding_status,
  scan_result_type,
  scan_source,
  scan_status,
  scan_tool,
  scope_asset_type,
  severity_level,
} from '@/generated/prisma/client';

// D1 allows at most 100 bound parameters per statement, so bulk inserts go in small chunks.
const INSERT_CHUNK = 15;

const json = (value: unknown) => value as Prisma.InputJsonValue;

// ─── Targets & scope ──────────────────────────────────────────────────────────

export interface CreateTargetInput {
  name: string;
  base_url: string;
  description?: string | undefined;
  authorization_note?: string | undefined;
  test_window_start?: Date | undefined;
  test_window_end?: Date | undefined;
  created_by?: string | undefined;
  created_by_email?: string | undefined;
}

export class TargetRepository {
  create(data: CreateTargetInput) {
    return prisma.assessment_target.create({
      data: {
        name: data.name,
        base_url: data.base_url,
        description: data.description ?? null,
        authorization_note: data.authorization_note ?? null,
        test_window_start: data.test_window_start ?? null,
        test_window_end: data.test_window_end ?? null,
        created_by: data.created_by ?? null,
        created_by_email: data.created_by_email ?? null,
      },
    });
  }

  findMany() {
    return prisma.assessment_target.findMany({
      orderBy: { created_at: 'desc' },
      include: { _count: { select: { scans: true, findings: true, scope_rules: true } } },
    });
  }

  findById(id: string) {
    return prisma.assessment_target.findUnique({
      where: { id },
      include: { scope_rules: { orderBy: { created_at: 'asc' } } },
    });
  }

  update(id: string, data: Prisma.assessment_targetUpdateInput) {
    return prisma.assessment_target.update({ where: { id }, data });
  }

  addScopeRule(data: {
    target_id: string;
    asset_type: scope_asset_type;
    value: string;
    in_scope: boolean;
    notes?: string | undefined;
  }) {
    return prisma.scope_rule.create({ data: { ...data, notes: data.notes ?? null } });
  }

  deleteScopeRule(targetId: string, ruleId: string) {
    return prisma.scope_rule.deleteMany({ where: { id: ruleId, target_id: targetId } });
  }
}

// ─── Scans & results ──────────────────────────────────────────────────────────

export interface ScanResultInput {
  type: scan_result_type;
  data: Record<string, unknown>;
}

export class ScanRepository {
  create(data: {
    target_id: string;
    tool: scan_tool;
    source: scan_source;
    status?: scan_status;
    params?: Record<string, unknown> | undefined;
    started_by?: string | undefined;
  }) {
    return prisma.scan.create({
      data: {
        target_id: data.target_id,
        tool: data.tool,
        source: data.source,
        status: data.status ?? 'QUEUED',
        params: data.params ? json(data.params) : Prisma.DbNull,
        started_by: data.started_by ?? null,
      },
    });
  }

  findById(id: string) {
    return prisma.scan.findUnique({ where: { id }, include: { target: true } });
  }

  findByIdWithResults(id: string) {
    return prisma.scan.findUnique({
      where: { id },
      include: { results: { orderBy: { created_at: 'asc' } }, target: true },
    });
  }

  findByTarget(targetId: string) {
    return prisma.scan.findMany({
      where: { target_id: targetId },
      orderBy: { created_at: 'desc' },
      include: { _count: { select: { results: true, findings: true } } },
    });
  }

  markRunning(id: string) {
    return prisma.scan.update({ where: { id }, data: { status: 'RUNNING', started_at: new Date(), error: null } });
  }

  markDone(id: string, rawOutputKey?: string) {
    return prisma.scan.update({
      where: { id },
      data: { status: 'DONE', finished_at: new Date(), ...(rawOutputKey && { raw_output_key: rawOutputKey }) },
    });
  }

  markFailed(id: string, error: string) {
    return prisma.scan.update({
      where: { id },
      data: { status: 'FAILED', finished_at: new Date(), error: error.slice(0, 1000) },
    });
  }

  async addResults(scanId: string, results: ScanResultInput[]): Promise<number> {
    for (let i = 0; i < results.length; i += INSERT_CHUNK) {
      const chunk = results.slice(i, i + INSERT_CHUNK);
      await prisma.scan_result.createMany({
        data: chunk.map((r) => ({ scan_id: scanId, type: r.type, data: json(r.data) })),
      });
    }
    return results.length;
  }
}

// ─── Findings, evidence, verification ────────────────────────────────────────

export interface CreateFindingInput {
  target_id: string;
  scan_id?: string | undefined;
  title: string;
  category: finding_category;
  description: string;
  affected_asset: string;
  source: finding_source;
  ai_severity?: severity_level | undefined;
  owasp_top10?: string | undefined;
  wstg_id?: string | undefined;
}

export interface FindingFilters {
  target_id?: string | undefined;
  status?: finding_status | undefined;
  category?: finding_category | undefined;
  source?: finding_source | undefined;
  page: number;
  limit: number;
}

export class FindingRepository {
  create(data: CreateFindingInput) {
    return prisma.finding.create({
      data: {
        target_id: data.target_id,
        scan_id: data.scan_id ?? null,
        title: data.title,
        category: data.category,
        description: data.description,
        affected_asset: data.affected_asset,
        source: data.source,
        ai_severity: data.ai_severity ?? null,
        owasp_top10: data.owasp_top10 ?? null,
        wstg_id: data.wstg_id ?? null,
      },
    });
  }

  async findMany(filters: FindingFilters) {
    const where: Prisma.findingWhereInput = {
      ...(filters.target_id && { target_id: filters.target_id }),
      ...(filters.status && { status: filters.status }),
      ...(filters.category && { category: filters.category }),
      ...(filters.source && { source: filters.source }),
    };
    const [items, total] = await Promise.all([
      prisma.finding.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        include: { _count: { select: { evidence: true } } },
      }),
      prisma.finding.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: string) {
    return prisma.finding.findUnique({
      where: { id },
      include: {
        evidence: { orderBy: { created_at: 'asc' }, include: { scan_result: true } },
        verification_logs: { orderBy: { created_at: 'desc' } },
        target: { select: { id: true, name: true, base_url: true } },
      },
    });
  }

  findConfirmedForReport(targetId: string) {
    return prisma.finding.findMany({
      where: { target_id: targetId, status: { in: ['CONFIRMED', 'FIXED'] } },
      orderBy: [{ cvss_score: 'desc' }, { created_at: 'asc' }],
      include: {
        evidence: { orderBy: { created_at: 'asc' }, include: { scan_result: true } },
        verification_logs: { orderBy: { created_at: 'desc' }, take: 1 },
      },
    });
  }

  update(id: string, data: Prisma.findingUpdateInput) {
    return prisma.finding.update({ where: { id }, data });
  }

  addEvidence(data: {
    finding_id: string;
    type: 'SCREENSHOT' | 'HTTP_EXCHANGE' | 'TOOL_OUTPUT';
    scan_result_id?: string | undefined;
    r2_key?: string | undefined;
    content?: string | undefined;
    created_by?: string | undefined;
  }) {
    return prisma.evidence.create({
      data: {
        finding_id: data.finding_id,
        type: data.type,
        scan_result_id: data.scan_result_id ?? null,
        r2_key: data.r2_key ?? null,
        content: data.content ?? null,
        created_by: data.created_by ?? null,
      },
    });
  }

  findEvidence(id: string) {
    return prisma.evidence.findUnique({ where: { id } });
  }

  addVerificationLog(data: {
    finding_id: string;
    assessor_id?: string | undefined;
    assessor_email?: string | undefined;
    old_status: finding_status;
    new_status: finding_status;
    notes: string;
  }) {
    return prisma.verification_log.create({
      data: {
        finding_id: data.finding_id,
        assessor_id: data.assessor_id ?? null,
        assessor_email: data.assessor_email ?? null,
        old_status: data.old_status,
        new_status: data.new_status,
        notes: data.notes,
      },
    });
  }

  groupCounts(targetId?: string) {
    const where = targetId ? { target_id: targetId } : {};
    return Promise.all([
      prisma.finding.groupBy({ by: ['status'], where, _count: { _all: true } }),
      prisma.finding.groupBy({ by: ['category'], where, _count: { _all: true } }),
      prisma.finding.groupBy({ by: ['source'], where, _count: { _all: true } }),
      prisma.finding.groupBy({
        by: ['final_severity'],
        where: { ...where, status: { in: ['CONFIRMED', 'FIXED'] } },
        _count: { _all: true },
      }),
      prisma.finding.groupBy({
        by: ['ai_severity'],
        where: { ...where, status: 'PENDING' },
        _count: { _all: true },
      }),
      prisma.scan.groupBy({ by: ['status'], where, _count: { _all: true } }),
    ]);
  }
}

// ─── AI analyses ──────────────────────────────────────────────────────────────

export class AiAnalysisRepository {
  create(data: {
    scan_id?: string | undefined;
    finding_id?: string | undefined;
    task: ai_task;
    provider: string;
    model: string;
    input_hash: string;
    output: unknown;
    tokens_in?: number | undefined;
    tokens_out?: number | undefined;
    created_by?: string | undefined;
  }) {
    return prisma.ai_analysis.create({
      data: {
        scan_id: data.scan_id ?? null,
        finding_id: data.finding_id ?? null,
        task: data.task,
        provider: data.provider,
        model: data.model,
        input_hash: data.input_hash,
        output: json(data.output),
        tokens_in: data.tokens_in ?? null,
        tokens_out: data.tokens_out ?? null,
        created_by: data.created_by ?? null,
      },
    });
  }

  findById(id: string) {
    return prisma.ai_analysis.findUnique({ where: { id } });
  }

  findByFinding(findingId: string) {
    return prisma.ai_analysis.findMany({ where: { finding_id: findingId }, orderBy: { created_at: 'desc' } });
  }

  findByScan(scanId: string) {
    return prisma.ai_analysis.findMany({ where: { scan_id: scanId }, orderBy: { created_at: 'desc' } });
  }
}

// ─── Assessment jobs (queue mirror) ──────────────────────────────────────────

export class AssessmentJobRepository {
  create(data: {
    type: assessment_job_type;
    ref_id: string;
    payload?: Record<string, unknown> | undefined;
    created_by?: string | undefined;
  }) {
    return prisma.assessment_job.create({
      data: {
        type: data.type,
        ref_id: data.ref_id,
        payload: data.payload ? json(data.payload) : Prisma.DbNull,
        created_by: data.created_by ?? null,
      },
    });
  }

  findById(id: string) {
    return prisma.assessment_job.findUnique({ where: { id } });
  }

  markActive(id: string) {
    return prisma.assessment_job.update({
      where: { id },
      data: { status: 'ACTIVE', attempts_made: { increment: 1 }, processed_at: new Date() },
    });
  }

  markStatus(id: string, status: assessment_job_status, failedReason?: string | null) {
    return prisma.assessment_job.update({
      where: { id },
      data: {
        status,
        ...(failedReason !== undefined && { failed_reason: failedReason?.slice(0, 1000) ?? null }),
        ...((status === 'COMPLETED' || status === 'FAILED') && { finished_at: new Date() }),
      },
    });
  }

  /** Oldest waiting agent job. Claiming is a conditional update (D1 has no transactions). */
  findNextWaiting(type: assessment_job_type) {
    return prisma.assessment_job.findFirst({ where: { type, status: 'WAITING' }, orderBy: { created_at: 'asc' } });
  }

  async claim(id: string): Promise<boolean> {
    const { count } = await prisma.assessment_job.updateMany({
      where: { id, status: 'WAITING' },
      data: { status: 'ACTIVE', attempts_made: { increment: 1 }, processed_at: new Date() },
    });
    return count === 1;
  }
}

export const targetRepository = new TargetRepository();
export const scanRepository = new ScanRepository();
export const findingRepository = new FindingRepository();
export const aiAnalysisRepository = new AiAnalysisRepository();
export const assessmentJobRepository = new AssessmentJobRepository();
