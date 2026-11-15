// BayawSec (AI-assisted security assessment) endpoints.
// Admin routes need a non-shared ADMIN account and BAYAWSEC_ENABLED=true.

type Schema = Record<string, unknown>;

const TAG = 'BayawSec';
const AGENT_TAG = 'BayawSec Agent';
const security = [{ bearerAuth: [] }];

const okResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: { success: { type: 'boolean', example: true }, message: { type: 'string' }, data: {} },
      },
    },
  },
});

const errors = {
  401: { description: 'Missing or invalid access token' },
  403: { description: 'Not an admin, a shared demo account, or the request is out of scope' },
  404: { description: 'Not found, or BayawSec is disabled' },
};

const idParam = (name: string, description: string) => ({
  name,
  in: 'path',
  required: true,
  schema: { type: 'string', format: 'uuid' },
  description,
});

const jsonBody = (schema: Schema) => ({ required: true, content: { 'application/json': { schema } } });

const op = (summary: string, extra: Schema = {}, ok = 'Success') => ({
  tags: [TAG],
  summary,
  security,
  responses: { 200: okResponse(ok), ...errors },
  ...extra,
});

const enumOf = (values: string[]) => ({ type: 'string', enum: values });
const SEVERITY = enumOf(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']);
const CATEGORY = enumOf(['AUTHENTICATION', 'ACCESS_CONTROL', 'SECURITY_CONFIG']);
const BASE = '/admin/assessments';

export const assessmentDocs = {
  [`${BASE}/targets`]: {
    get: op('List assessment targets'),
    post: op('Register an assessment target', {
      description: 'The base_url host must be on ASSESSMENT_ALLOWED_HOSTS.',
      requestBody: jsonBody({
        type: 'object',
        required: ['name', 'base_url'],
        properties: {
          name: { type: 'string', example: 'Bayaw Jobs (staging)' },
          base_url: { type: 'string', example: 'https://bayawjobs.riomar.dev' },
          description: { type: 'string' },
          authorization_note: { type: 'string', example: 'Approved by the instructor on 2026-11-12' },
          test_window_start: { type: 'string', format: 'date-time' },
          test_window_end: { type: 'string', format: 'date-time' },
        },
      }),
    }),
  },
  [`${BASE}/targets/{id}`]: {
    get: op('Get a target with its scope rules', { parameters: [idParam('id', 'Target ID')] }),
    patch: op('Update a target', {
      parameters: [idParam('id', 'Target ID')],
      requestBody: jsonBody({
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          authorization_note: { type: 'string' },
          test_window_start: { type: 'string', format: 'date-time' },
          test_window_end: { type: 'string', format: 'date-time' },
        },
      }),
    }),
  },
  [`${BASE}/targets/{id}/scope`]: {
    post: op('Add a scope rule', {
      description: 'In-scope HOST/URL rules can never widen scope past ASSESSMENT_ALLOWED_HOSTS.',
      parameters: [idParam('id', 'Target ID')],
      requestBody: jsonBody({
        type: 'object',
        required: ['asset_type', 'value'],
        properties: {
          asset_type: enumOf(['HOST', 'URL', 'PORT_RANGE']),
          value: { type: 'string', example: '80,443' },
          in_scope: { type: 'boolean', default: true },
          notes: { type: 'string' },
        },
      }),
    }),
  },
  [`${BASE}/targets/{id}/scope/{ruleId}`]: {
    delete: op('Remove a scope rule', { parameters: [idParam('id', 'Target ID'), idParam('ruleId', 'Scope rule ID')] }),
  },
  [`${BASE}/targets/{id}/scans`]: {
    get: op('List scans for a target', { parameters: [idParam('id', 'Target ID')] }),
    post: op(
      'Queue a scan',
      {
        description:
          'HTTP_CHECK, DNS and OPENAPI run inside the Worker. AGENT_NMAP / AGENT_ZAP are picked up by the optional scanner agent (requires SCANNER_AGENT_ENABLED). Every request is scope-checked.',
        parameters: [idParam('id', 'Target ID')],
        requestBody: jsonBody({
          type: 'object',
          required: ['tool'],
          properties: {
            tool: enumOf(['HTTP_CHECK', 'DNS', 'OPENAPI', 'AGENT_NMAP', 'AGENT_ZAP']),
            url: { type: 'string', description: 'Defaults to the target base_url (OPENAPI: /api/docs/openapi.json)' },
            host: { type: 'string', description: 'DNS / AGENT_NMAP host; defaults to the target host' },
            ports: { type: 'string', example: '80,443', description: 'AGENT_NMAP only' },
          },
        }),
        responses: { 202: okResponse('Scan and job created'), ...errors },
      },
      'Scan queued'
    ),
  },
  [`${BASE}/targets/{id}/imports/{tool}`]: {
    post: op('Import an Nmap XML or ZAP JSON report', {
      description:
        'Upload `nmap -sV -oX report.xml` output (tool=nmap) or a ZAP Traditional JSON report (tool=zap). Every host in the report must be in scope, or nothing is stored.',
      parameters: [
        idParam('id', 'Target ID'),
        { name: 'tool', in: 'path', required: true, schema: enumOf(['nmap', 'zap']) },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' } } },
          },
        },
      },
    }),
  },
  [`${BASE}/scans/{id}`]: { get: op('Get a scan with its results', { parameters: [idParam('id', 'Scan ID')] }) },
  [`${BASE}/scans/{id}/raw`]: {
    get: op('Download the raw imported report', { parameters: [idParam('id', 'Scan ID')] }),
  },
  [`${BASE}/scans/{id}/interpret`]: {
    post: op('AI feature 1: interpret scan results', {
      description:
        'Queues an AI job that turns the scan results into PENDING findings with linked evidence. Counts toward the daily AI cap (AI_DAILY_LIMIT). Poll GET jobs/{id}.',
      parameters: [idParam('id', 'Scan ID')],
      responses: { 202: okResponse('Job queued'), 429: { description: 'Daily AI cap reached' }, ...errors },
    }),
  },
  [`${BASE}/scans/{id}/ai`]: {
    get: op('List AI analyses for a scan', { parameters: [idParam('id', 'Scan ID')] }),
  },
  [`${BASE}/jobs/{id}`]: { get: op('Get an assessment job status', { parameters: [idParam('id', 'Job ID')] }) },
  [`${BASE}/findings`]: {
    get: op('List findings', {
      parameters: [
        { name: 'target_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
        { name: 'status', in: 'query', schema: enumOf(['PENDING', 'CONFIRMED', 'REJECTED', 'FALSE_POSITIVE', 'FIXED']) },
        { name: 'category', in: 'query', schema: CATEGORY },
        { name: 'source', in: 'query', schema: enumOf(['TOOL', 'AI', 'MANUAL']) },
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
    }),
    post: op('Create a manual finding (starts PENDING)', {
      requestBody: jsonBody({
        type: 'object',
        required: ['target_id', 'title', 'category', 'description', 'affected_asset'],
        properties: {
          target_id: { type: 'string', format: 'uuid' },
          scan_id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          category: CATEGORY,
          description: { type: 'string' },
          affected_asset: { type: 'string', example: 'GET /api/applicants/{id}' },
          owasp_top10: { type: 'string', example: 'A01:2021 Broken Access Control' },
          wstg_id: { type: 'string', example: 'WSTG-ATHZ-04' },
        },
      }),
    }),
  },
  [`${BASE}/findings/{id}`]: {
    get: op('Get a finding with evidence and verification history', { parameters: [idParam('id', 'Finding ID')] }),
  },
  [`${BASE}/findings/{id}/verify`]: {
    patch: op('Verify a finding (human decision)', {
      description:
        'The only way a finding becomes CONFIRMED, REJECTED, FALSE_POSITIVE or FIXED. CONFIRMED requires final_severity and cvss_score. FIXED requires a CONFIRMED finding. Writes a verification log row.',
      parameters: [idParam('id', 'Finding ID')],
      requestBody: jsonBody({
        type: 'object',
        required: ['status', 'notes'],
        properties: {
          status: enumOf(['CONFIRMED', 'REJECTED', 'FALSE_POSITIVE', 'FIXED']),
          notes: { type: 'string', example: 'Reproduced with curl -I; no Content-Security-Policy header.' },
          final_severity: SEVERITY,
          cvss_score: { type: 'number', example: 4.3 },
          cvss_vector: { type: 'string', example: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N' },
          owasp_top10: { type: 'string' },
          wstg_id: { type: 'string' },
        },
      }),
    }),
  },
  [`${BASE}/findings/{id}/remediation`]: {
    post: op('AI feature 2: suggest remediation', {
      description: 'Queues an AI job that drafts a fix. The draft is NOT applied; accept it with PATCH. Counts toward the daily AI cap.',
      parameters: [idParam('id', 'Finding ID')],
      responses: { 202: okResponse('Job queued'), 429: { description: 'Daily AI cap reached' }, ...errors },
    }),
    patch: op('Save remediation text (hand-written or from an AI draft)', {
      parameters: [idParam('id', 'Finding ID')],
      requestBody: jsonBody({
        type: 'object',
        properties: {
          remediation: { type: 'string' },
          analysis_id: { type: 'string', format: 'uuid', description: 'Accept this REMEDIATE analysis as the remediation' },
        },
      }),
    }),
  },
  [`${BASE}/findings/{id}/ai`]: {
    get: op('List AI analyses (remediation drafts) for a finding', { parameters: [idParam('id', 'Finding ID')] }),
  },
  [`${BASE}/findings/{id}/evidence`]: {
    post: op('Attach evidence', {
      description: 'SCREENSHOT needs a PNG/JPEG file; HTTP_EXCHANGE / TOOL_OUTPUT need content or scan_result_id.',
      parameters: [idParam('id', 'Finding ID')],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['type'],
              properties: {
                type: enumOf(['SCREENSHOT', 'HTTP_EXCHANGE', 'TOOL_OUTPUT']),
                content: { type: 'string' },
                scan_result_id: { type: 'string', format: 'uuid' },
                file: { type: 'string', format: 'binary' },
              },
            },
          },
          'application/json': {
            schema: {
              type: 'object',
              required: ['type'],
              properties: {
                type: enumOf(['HTTP_EXCHANGE', 'TOOL_OUTPUT']),
                content: { type: 'string' },
                scan_result_id: { type: 'string', format: 'uuid' },
              },
            },
          },
        },
      },
    }),
  },
  [`${BASE}/evidence/{id}/file`]: {
    get: op('Download an evidence file (screenshot)', { parameters: [idParam('id', 'Evidence ID')] }),
  },
  [`${BASE}/dashboard`]: {
    get: op('Dashboard counts', {
      description: 'Finding counts by status, category and source; confirmed findings by final severity; pending by AI severity; scans by status.',
      parameters: [{ name: 'target_id', in: 'query', schema: { type: 'string', format: 'uuid' } }],
    }),
  },
  [`${BASE}/targets/{id}/report`]: {
    get: op('Report data (confirmed findings only)', {
      description: 'JSON for the final security report: target, scope, methodology, scans, summary and CONFIRMED/FIXED findings with evidence.',
      parameters: [idParam('id', 'Target ID')],
    }),
  },

  // ── Scanner agent (bearer = SCANNER_AGENT_TOKEN; 404 unless enabled) ────────
  '/assessments/agent/config': {
    get: { ...op('Agent: allowed hosts'), tags: [AGENT_TAG] },
  },
  '/assessments/agent/jobs/claim': {
    post: { ...op('Agent: claim the next waiting scan job (data is null when none)'), tags: [AGENT_TAG] },
  },
  '/assessments/agent/jobs/{id}/result': {
    post: {
      ...op('Agent: upload a scan report or an error', {
        parameters: [idParam('id', 'Job ID')],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: { file: { type: 'string', format: 'binary' }, error: { type: 'string' } },
              },
            },
          },
        },
      }),
      tags: [AGENT_TAG],
    },
  },
};
