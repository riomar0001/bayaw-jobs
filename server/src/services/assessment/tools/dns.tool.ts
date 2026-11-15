import { Config } from '@/constants/config.constant';
import { ToolResult, UA } from './types';

// DNS reconnaissance over DNS-over-HTTPS (Workers have no raw UDP for dig/nslookup).
const DOH_ENDPOINT = 'https://cloudflare-dns.com/dns-query';
const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'CAA'] as const;

interface DohAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export async function runDnsLookup(host: string): Promise<ToolResult[]> {
  const results: ToolResult[] = [];

  for (const type of RECORD_TYPES) {
    const url = `${DOH_ENDPOINT}?name=${encodeURIComponent(host)}&type=${type}`;
    const res = await fetch(url, {
      headers: { accept: 'application/dns-json', 'user-agent': UA },
      signal: AbortSignal.timeout(Config.BAYAWSEC.TOOL_TIMEOUT_MS),
    });
    if (!res.ok) {
      results.push({ type: 'DNS_RECORD', data: { host, record_type: type, error: `DoH HTTP ${res.status}` } });
      continue;
    }
    const body = (await res.json()) as { Status: number; Answer?: DohAnswer[] };
    for (const answer of body.Answer ?? []) {
      results.push({
        type: 'DNS_RECORD',
        data: { host, record_type: type, name: answer.name, ttl: answer.TTL, value: answer.data },
      });
    }
  }

  return results;
}
