import { toolFetch, ToolResult, truncate } from './types';

// The curl-style checks from the AI guide, done with fetch inside the Worker.
// Covers WSTG-CONF-07 (HSTS), WSTG-SESS-02 (cookie attributes), CORS, HTTPS redirect,
// and the security headers checked against the OWASP Secure Headers Project.

const SECURITY_HEADERS = [
  'content-security-policy',
  'strict-transport-security',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
] as const;

// Headers that reveal software versions (information disclosure).
const DISCLOSURE_HEADERS = ['server', 'x-powered-by', 'x-aspnet-version', 'via'] as const;

const CORS_PROBE_ORIGIN = 'https://bayawsec-cors-probe.invalid';

function parseCookie(raw: string) {
  const [pair = '', ...attrs] = raw.split(';').map((s) => s.trim());
  const name = pair.split('=')[0] ?? '';
  const lower = attrs.map((a) => a.toLowerCase());
  const sameSite = lower.find((a) => a.startsWith('samesite='))?.split('=')[1];
  return {
    name, // value intentionally not stored
    secure: lower.includes('secure'),
    http_only: lower.includes('httponly'),
    same_site: sameSite ?? null,
    has_expiry: lower.some((a) => a.startsWith('expires=') || a.startsWith('max-age=')),
    path: lower.find((a) => a.startsWith('path='))?.split('=')[1] ?? null,
  };
}

export async function runHttpCheck(url: string): Promise<ToolResult[]> {
  const results: ToolResult[] = [];

  // 1. Plain request: status, security headers, disclosure headers, cookies.
  const res = await toolFetch(url, { method: 'GET' });
  results.push({
    type: 'HEADER',
    data: { check: 'response', url, status: res.status, location: res.headers.get('location') },
  });

  for (const header of SECURITY_HEADERS) {
    const value = res.headers.get(header);
    results.push({
      type: 'HEADER',
      data: { check: 'security_header', url, header, present: value !== null, value: truncate(value, 400) ?? null },
    });
  }

  for (const header of DISCLOSURE_HEADERS) {
    const value = res.headers.get(header);
    if (value) results.push({ type: 'HEADER', data: { check: 'disclosure_header', url, header, value: truncate(value) } });
  }

  for (const raw of res.headers.getSetCookie()) {
    results.push({ type: 'COOKIE', data: { url, ...parseCookie(raw) } });
  }

  // 2. CORS probe with a foreign origin.
  const cors = await toolFetch(url, { method: 'GET', headers: { origin: CORS_PROBE_ORIGIN } });
  const allowOrigin = cors.headers.get('access-control-allow-origin');
  const allowCredentials = cors.headers.get('access-control-allow-credentials');
  results.push({
    type: 'CORS',
    data: {
      url,
      probe_origin: CORS_PROBE_ORIGIN,
      allow_origin: allowOrigin,
      allow_credentials: allowCredentials,
      reflects_foreign_origin: allowOrigin === CORS_PROBE_ORIGIN,
      wildcard: allowOrigin === '*',
    },
  });

  // 3. Does plain HTTP redirect to HTTPS?
  const parsed = new URL(url);
  if (parsed.protocol === 'https:') {
    const httpUrl = `http://${parsed.host}${parsed.pathname}${parsed.search}`;
    try {
      const plain = await toolFetch(httpUrl, { method: 'GET' });
      const location = plain.headers.get('location');
      results.push({
        type: 'REDIRECT',
        data: {
          from: httpUrl,
          status: plain.status,
          location,
          redirects_to_https: [301, 302, 307, 308].includes(plain.status) && Boolean(location?.startsWith('https://')),
        },
      });
    } catch (error) {
      results.push({
        type: 'REDIRECT',
        data: { from: httpUrl, error: error instanceof Error ? error.message : String(error), redirects_to_https: null },
      });
    }
  }

  return results;
}
