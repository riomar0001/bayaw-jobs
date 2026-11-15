import { z } from 'zod';

// Each AI reply is checked twice: OpenAI Structured Outputs enforces the JSON Schema,
// then Zod re-validates it here, so a bad reply never reaches the database.

const CATEGORIES = ['AUTHENTICATION', 'ACCESS_CONTROL', 'SECURITY_CONFIG'] as const;
const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const;

// ─── Feature 1: interpreting scan results ────────────────────────────────────

export const InterpretSchema = z.object({
  findings: z
    .array(
      z.object({
        title: z.string().min(3).max(200),
        category: z.enum(CATEGORIES),
        affected_asset: z.string().min(1).max(300),
        explanation: z.string().min(10).max(2000),
        // Refs like "r3" pointing at the numbered results in the prompt.
        evidence_refs: z.array(z.string().max(20)).max(20),
        suggested_severity: z.enum(SEVERITIES),
        owasp_top10: z.string().max(80),
        wstg_id: z.string().max(40),
      })
    )
    .max(30),
});
export type InterpretResult = z.infer<typeof InterpretSchema>;

export const InterpretJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'title',
          'category',
          'affected_asset',
          'explanation',
          'evidence_refs',
          'suggested_severity',
          'owasp_top10',
          'wstg_id',
        ],
        properties: {
          title: { type: 'string' },
          category: { type: 'string', enum: [...CATEGORIES] },
          affected_asset: { type: 'string' },
          explanation: { type: 'string' },
          evidence_refs: { type: 'array', items: { type: 'string' } },
          suggested_severity: { type: 'string', enum: [...SEVERITIES] },
          owasp_top10: { type: 'string' },
          wstg_id: { type: 'string' },
        },
      },
    },
  },
} as const;

// ─── Feature 2: suggesting remediation ───────────────────────────────────────

export const RemediationSchema = z.object({
  summary: z.string().min(10).max(1000),
  steps: z.array(z.string().min(3).max(600)).min(1).max(12),
  code_example: z.string().max(4000),
  references: z.array(z.string().max(300)).max(10),
  confidence: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});
export type RemediationResult = z.infer<typeof RemediationSchema>;

export const RemediationJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'steps', 'code_example', 'references', 'confidence'],
  properties: {
    summary: { type: 'string' },
    steps: { type: 'array', items: { type: 'string' } },
    code_example: { type: 'string' },
    references: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
  },
} as const;
