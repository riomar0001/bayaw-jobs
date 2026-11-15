import { toolFetch, ToolResult, truncate } from './types';

// Maps the target's entry points (WSTG-INFO-06) from its published OpenAPI spec.
// The endpoint list feeds the manual access-control tests (WSTG-ATHZ-02/03/04).

const METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;
const MAX_ENDPOINTS = 500;

interface OpenApiOperation {
  summary?: string;
  tags?: string[];
  security?: Array<Record<string, unknown>>;
}

export async function runOpenApiImport(specUrl: string): Promise<ToolResult[]> {
  const res = await toolFetch(specUrl, { method: 'GET', headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`OpenAPI spec request returned HTTP ${res.status}`);

  const spec = (await res.json()) as {
    security?: unknown[];
    paths?: Record<string, Record<string, OpenApiOperation>>;
  };
  const globalAuth = Array.isArray(spec.security) && spec.security.length > 0;
  const results: ToolResult[] = [];

  for (const [path, operations] of Object.entries(spec.paths ?? {})) {
    for (const method of METHODS) {
      const op = operations[method];
      if (!op) continue;
      const requiresAuth = op.security !== undefined ? op.security.length > 0 : globalAuth;
      results.push({
        type: 'ENDPOINT',
        data: {
          method: method.toUpperCase(),
          path,
          summary: truncate(op.summary, 200) ?? null,
          tags: op.tags ?? [],
          requires_auth: requiresAuth,
          admin_route: path.startsWith('/admin'),
        },
      });
      if (results.length >= MAX_ENDPOINTS) return results;
    }
  }

  return results;
}
