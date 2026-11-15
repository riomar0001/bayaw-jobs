import { z } from 'zod';

const id = (label: string) => z.string().uuid(`${label} must be a valid UUID`);
const optionalDate = z.coerce.date().optional();

const CATEGORY = z.enum(['AUTHENTICATION', 'ACCESS_CONTROL', 'SECURITY_CONFIG'], {
  error: 'category must be one of: AUTHENTICATION, ACCESS_CONTROL, SECURITY_CONFIG',
});
const SEVERITY = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'], {
  error: 'severity must be one of: CRITICAL, HIGH, MEDIUM, LOW, INFO',
});
const PORT_SPEC = /^\s*\d{1,5}(\s*-\s*\d{1,5})?(\s*,\s*\d{1,5}(\s*-\s*\d{1,5})?)*\s*$/;
// CVSS v3.1 vector, e.g. CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N
const CVSS_VECTOR = /^CVSS:3\.1\/AV:[NALP]\/AC:[LH]\/PR:[NLH]\/UI:[NR]\/S:[UC]\/C:[NLH]\/I:[NLH]\/A:[NLH]$/;

// ─── Targets & scope ──────────────────────────────────────────────────────────

export const createTargetSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    base_url: z.string().trim().url('base_url must be a valid URL').max(300),
    description: z.string().max(2000).optional(),
    authorization_note: z.string().max(2000).optional(),
    test_window_start: optionalDate,
    test_window_end: optionalDate,
  }),
});

export const updateTargetSchema = z.object({
  params: z.object({ id: id('Target ID') }),
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().max(2000).optional(),
    authorization_note: z.string().max(2000).optional(),
    test_window_start: optionalDate,
    test_window_end: optionalDate,
  }),
});

export const targetIdSchema = z.object({ params: z.object({ id: id('Target ID') }) });

export const addScopeRuleSchema = z.object({
  params: z.object({ id: id('Target ID') }),
  body: z
    .object({
      asset_type: z.enum(['HOST', 'URL', 'PORT_RANGE'], { error: 'asset_type must be HOST, URL or PORT_RANGE' }),
      value: z.string().trim().min(1).max(300),
      in_scope: z.boolean().default(true),
      notes: z.string().max(500).optional(),
    })
    .refine((b) => b.asset_type !== 'PORT_RANGE' || PORT_SPEC.test(b.value), {
      message: 'PORT_RANGE value must look like "80,443" or "8000-8100"',
      path: ['value'],
    }),
});

export const scopeRuleIdSchema = z.object({
  params: z.object({ id: id('Target ID'), ruleId: id('Scope rule ID') }),
});

// ─── Scans & imports ──────────────────────────────────────────────────────────

export const startScanSchema = z.object({
  params: z.object({ id: id('Target ID') }),
  body: z.object({
    tool: z.enum(['HTTP_CHECK', 'DNS', 'OPENAPI', 'AGENT_NMAP', 'AGENT_ZAP'], {
      error: 'tool must be one of: HTTP_CHECK, DNS, OPENAPI, AGENT_NMAP, AGENT_ZAP',
    }),
    url: z.string().trim().url().max(500).optional(),
    host: z.string().trim().min(1).max(253).optional(),
    ports: z.string().regex(PORT_SPEC, 'ports must look like "80,443" or "1-1024"').optional(),
  }),
});

export const importReportSchema = z.object({
  params: z.object({ id: id('Target ID'), tool: z.enum(['nmap', 'zap'], { error: 'tool must be nmap or zap' }) }),
});

export const scanIdSchema = z.object({ params: z.object({ id: id('Scan ID') }) });

export const jobIdSchema = z.object({ params: z.object({ id: id('Job ID') }) });

// ─── Findings ─────────────────────────────────────────────────────────────────

export const listFindingsSchema = z.object({
  query: z.object({
    target_id: id('target_id').optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'FALSE_POSITIVE', 'FIXED']).optional(),
    category: CATEGORY.optional(),
    source: z.enum(['TOOL', 'AI', 'MANUAL']).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});

export const createFindingSchema = z.object({
  body: z.object({
    target_id: id('target_id'),
    scan_id: id('scan_id').optional(),
    title: z.string().trim().min(3).max(200),
    category: CATEGORY,
    description: z.string().trim().min(10).max(4000),
    affected_asset: z.string().trim().min(1).max(300),
    owasp_top10: z.string().max(80).optional(),
    wstg_id: z.string().max(40).optional(),
  }),
});

export const findingIdSchema = z.object({ params: z.object({ id: id('Finding ID') }) });

export const verifyFindingSchema = z.object({
  params: z.object({ id: id('Finding ID') }),
  body: z.object({
    status: z.enum(['CONFIRMED', 'REJECTED', 'FALSE_POSITIVE', 'FIXED'], {
      error: 'status must be one of: CONFIRMED, REJECTED, FALSE_POSITIVE, FIXED',
    }),
    notes: z.string().trim().min(5, 'notes must explain how you verified this (at least 5 characters)').max(4000),
    final_severity: SEVERITY.optional(),
    cvss_score: z.number().min(0).max(10).optional(),
    cvss_vector: z.string().regex(CVSS_VECTOR, 'cvss_vector must be a CVSS v3.1 vector').optional(),
    owasp_top10: z.string().max(80).optional(),
    wstg_id: z.string().max(40).optional(),
  }),
});

export const setRemediationSchema = z.object({
  params: z.object({ id: id('Finding ID') }),
  body: z
    .object({
      remediation: z.string().trim().min(10).max(8000).optional(),
      analysis_id: id('analysis_id').optional(),
    })
    .refine((b) => Boolean(b.remediation) !== Boolean(b.analysis_id), {
      message: 'Provide exactly one of remediation or analysis_id',
      path: ['remediation'],
    }),
});

export const addEvidenceSchema = z.object({
  params: z.object({ id: id('Finding ID') }),
  body: z.object({
    type: z.enum(['SCREENSHOT', 'HTTP_EXCHANGE', 'TOOL_OUTPUT'], {
      error: 'type must be SCREENSHOT, HTTP_EXCHANGE or TOOL_OUTPUT',
    }),
    content: z.string().max(20000).optional(),
    scan_result_id: id('scan_result_id').optional(),
  }),
});

export const evidenceIdSchema = z.object({ params: z.object({ id: id('Evidence ID') }) });

// ─── Dashboard / report ───────────────────────────────────────────────────────

export const dashboardSchema = z.object({ query: z.object({ target_id: id('target_id').optional() }) });

// ─── Scanner agent ────────────────────────────────────────────────────────────

export const agentResultSchema = z.object({
  params: z.object({ id: id('Job ID') }),
  body: z.object({ error: z.string().max(1000).optional() }),
});
