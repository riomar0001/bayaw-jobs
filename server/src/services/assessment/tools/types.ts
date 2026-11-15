import type { ScanResultInput } from '@/repositories/assessment.repository';
import { Config } from '@/constants/config.constant';

export type ToolResult = ScanResultInput;

/** Hosts an imported report mentions, so the importer can scope-check every one. */
export interface ParsedReport {
  hosts: Array<{ host: string; port?: number | undefined }>;
  results: ToolResult[];
}

export const UA = 'BayawSec/1.0 (CS24 authorized assessment)';

/** fetch with a timeout and our user agent. Never follows redirects automatically. */
export function toolFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('user-agent', UA);
  return fetch(url, {
    ...init,
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(Config.BAYAWSEC.TOOL_TIMEOUT_MS),
  });
}

export function truncate(value: unknown, max = 300): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value);
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}
