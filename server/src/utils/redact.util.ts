// Strips secrets and personal data from text before it is sent to an AI provider.
// Pattern-based, so it can miss unusual formats: never put real user data into BayawSec.

const PATTERNS: Array<[RegExp, string]> = [
  // JSON Web Tokens
  [/eyJ[\w-]+\.[\w-]+\.[\w-]+/g, '[JWT]'],
  // Credential-bearing HTTP headers (whole header value)
  [/\b(authorization|proxy-authorization|cookie|set-cookie|x-api-key)(\s*[:=]\s*)[^\n\r]+/gi, '$1$2[REDACTED]'],
  // Bearer / Basic tokens anywhere else
  [/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/g, '$1 [REDACTED]'],
  // key=value or "key": "value" for sensitive keys
  [
    /(["']?)\b(password|passwd|pwd|secret|token|refresh_?token|access_?token|api[_-]?key|access[_-]?key|private[_-]?key|session(?:id)?|otp)\1(\s*[:=]\s*)(["']?)[^\s"',&;}]+\4/gi,
    '$1$2$1$3$4[REDACTED]$4',
  ],
  // OpenAI-style keys and long hex secrets
  [/\bsk-[A-Za-z0-9_-]{16,}\b/g, '[API_KEY]'],
  [/\b[a-f0-9]{40,}\b/gi, '[HEX_SECRET]'],
  // Email addresses
  [/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '[EMAIL]'],
  // Philippine mobile numbers (+63 9xx / 09xx)
  [/(?:\+?63[\s-]?9\d{2}|\b09\d{2})[\s-]?\d{3}[\s-]?\d{4}\b/g, '[PHONE]'],
];

export function redact(text: string): string {
  return PATTERNS.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);
}

export default redact;
