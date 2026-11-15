import { Config } from '@/constants/config.constant';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { securityEventService } from '@/services/securityEvent.service';
import { AuthorizationError, BadRequestError } from '@/utils/errors.util';
import { security_event_type, scope_rule } from '@/generated/prisma/client';

/** Minimal target shape the scope checks need. */
export interface ScopedTarget {
  id: string;
  base_url: string;
  scope_rules: scope_rule[];
}

export interface ScopeRequest {
  url?: string | undefined;
  host?: string | undefined;
  port?: number | undefined;
}

export interface ScopeActor {
  user_id?: string | undefined;
  ip_address?: string | undefined;
}

export function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
}

/** Parses an http(s) URL or throws. Credentials in the URL are rejected. */
export function parseHttpUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new BadRequestError(ErrorMessages.BAYAWSEC.INVALID_URL);
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new BadRequestError(ErrorMessages.BAYAWSEC.INVALID_URL);
  }
  return url;
}

export function defaultPort(url: URL): number {
  if (url.port) return Number(url.port);
  return url.protocol === 'https:' ? 443 : 80;
}

/** Hard allowlist from ASSESSMENT_ALLOWED_HOSTS. Exact host match only. */
export function isHostAllowed(host: string): boolean {
  return Config.BAYAWSEC.ALLOWED_HOSTS.includes(normalizeHost(host));
}

export function assertHostAllowed(host: string): void {
  if (!isHostAllowed(host)) throw new BadRequestError(ErrorMessages.BAYAWSEC.HOST_NOT_ALLOWED);
}

/** "80,443" or "8000-8100" or "80, 443, 3000-3001". */
function portInRange(port: number, spec: string): boolean {
  return spec.split(',').some((part) => {
    const [startRaw, endRaw] = part.trim().split('-');
    const start = Number(startRaw);
    const end = endRaw === undefined ? start : Number(endRaw);
    return Number.isInteger(start) && Number.isInteger(end) && port >= start && port <= end;
  });
}

function urlHasPrefix(url: string, prefix: string): boolean {
  try {
    const a = new URL(url);
    const b = new URL(prefix);
    return a.origin === b.origin && a.pathname.startsWith(b.pathname);
  } catch {
    return false;
  }
}

/**
 * Decides whether a host/URL/port is inside the authorized scope of a target:
 *  1. the host must be on the hard env allowlist (stops SSRF to anything else),
 *  2. no out-of-scope rule may match,
 *  3. the host must be the target's own host or an in-scope HOST rule,
 *  4. if in-scope PORT_RANGE rules exist, the port must be inside one of them,
 *  5. if in-scope URL rules exist and a URL is given, it must sit under one of them.
 */
export function checkScope(target: ScopedTarget, request: ScopeRequest): { ok: boolean; reason?: string } {
  let host = request.host ? normalizeHost(request.host) : undefined;
  let port = request.port;
  if (request.url) {
    const url = parseHttpUrl(request.url);
    host = normalizeHost(url.hostname);
    port = port ?? defaultPort(url);
  }
  if (!host) return { ok: false, reason: 'no host given' };
  if (!isHostAllowed(host)) return { ok: false, reason: `host ${host} is not on the allowlist` };

  const rules = target.scope_rules;
  const inScope = rules.filter((r) => r.in_scope);
  const outOfScope = rules.filter((r) => !r.in_scope);

  for (const rule of outOfScope) {
    if (rule.asset_type === 'HOST' && normalizeHost(rule.value) === host) {
      return { ok: false, reason: `host ${host} is marked out of scope` };
    }
    if (rule.asset_type === 'PORT_RANGE' && port !== undefined && portInRange(port, rule.value)) {
      return { ok: false, reason: `port ${port} is marked out of scope` };
    }
    if (rule.asset_type === 'URL' && request.url && urlHasPrefix(request.url, rule.value)) {
      return { ok: false, reason: `URL is under out-of-scope prefix ${rule.value}` };
    }
  }

  const targetHost = normalizeHost(parseHttpUrl(target.base_url).hostname);
  const hostRules = inScope.filter((r) => r.asset_type === 'HOST').map((r) => normalizeHost(r.value));
  const urlRules = inScope.filter((r) => r.asset_type === 'URL');
  const urlRuleHosts = urlRules
    .map((r) => {
      try {
        return normalizeHost(new URL(r.value).hostname);
      } catch {
        return undefined;
      }
    })
    .filter((h): h is string => Boolean(h));

  if (host !== targetHost && !hostRules.includes(host) && !urlRuleHosts.includes(host)) {
    return { ok: false, reason: `host ${host} is not in scope for this target` };
  }

  const portRules = inScope.filter((r) => r.asset_type === 'PORT_RANGE');
  if (port !== undefined && portRules.length > 0 && !portRules.some((r) => portInRange(port, r.value))) {
    return { ok: false, reason: `port ${port} is not in an in-scope port range` };
  }

  if (request.url && urlRules.length > 0) {
    const sameHostUrlRules = urlRules.filter((r) => {
      try {
        return normalizeHost(new URL(r.value).hostname) === host;
      } catch {
        return false;
      }
    });
    if (sameHostUrlRules.length > 0 && !sameHostUrlRules.some((r) => urlHasPrefix(request.url as string, r.value))) {
      return { ok: false, reason: 'URL is not under an in-scope URL rule' };
    }
  }

  return { ok: true };
}

/** Throws (and records a security event) when the request is out of scope. */
export async function assertInScope(target: ScopedTarget, request: ScopeRequest, actor: ScopeActor = {}): Promise<void> {
  const result = checkScope(target, request);
  if (result.ok) return;

  await securityEventService.log(security_event_type.ADMIN_ACTION, {
    user_id: actor.user_id,
    ip_address: actor.ip_address,
    metadata: {
      action: 'bayawsec_out_of_scope_blocked',
      target_id: target.id,
      request,
      reason: result.reason,
    },
  });
  throw new AuthorizationError(`${ErrorMessages.BAYAWSEC.OUT_OF_SCOPE}: ${result.reason}`);
}
