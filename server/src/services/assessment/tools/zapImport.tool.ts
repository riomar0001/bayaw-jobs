import { asArray, ParsedReport, truncate } from './types';

// Parses an OWASP ZAP "Traditional JSON" report (zap-baseline.py -J report.json,
// or Report > Generate Report > Traditional JSON) into ALERT results.

interface ZapInstance {
  uri?: string;
  method?: string;
  param?: string;
  attack?: string;
  evidence?: string;
}

interface ZapAlert {
  pluginid?: string;
  alertRef?: string;
  alert?: string;
  name?: string;
  riskcode?: string;
  confidence?: string;
  riskdesc?: string;
  desc?: string;
  solution?: string;
  reference?: string;
  cweid?: string;
  wascid?: string;
  count?: string;
  instances?: ZapInstance[];
}

interface ZapSite {
  '@name'?: string;
  '@host'?: string;
  '@port'?: string;
  alerts?: ZapAlert[];
}

const RISK = ['Informational', 'Low', 'Medium', 'High'];
const MAX_INSTANCES = 5;

const stripHtml = (value: string | undefined) => value?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export function parseZapJson(text: string): ParsedReport {
  let doc: { site?: ZapSite | ZapSite[] };
  try {
    doc = JSON.parse(text) as { site?: ZapSite | ZapSite[] };
  } catch {
    throw new Error('Not valid JSON');
  }
  const sites = asArray(doc.site);
  if (sites.length === 0) throw new Error('Not a ZAP Traditional JSON report (missing "site")');

  const report: ParsedReport = { hosts: [], results: [] };

  for (const site of sites) {
    const host = site['@host'] ?? (site['@name'] ? new URL(site['@name']).hostname : undefined);
    if (!host) continue;
    const port = site['@port'] ? Number(site['@port']) : undefined;
    report.hosts.push({ host, port });

    for (const alert of site.alerts ?? []) {
      const instances = (alert.instances ?? []).slice(0, MAX_INSTANCES).map((i) => ({
        uri: truncate(i.uri, 300),
        method: i.method,
        param: truncate(i.param, 100),
        evidence: truncate(i.evidence, 200),
      }));
      // Every instance URI must be scope-checked too, not just the site host.
      for (const instance of alert.instances ?? []) {
        if (!instance.uri) continue;
        try {
          const u = new URL(instance.uri);
          report.hosts.push({ host: u.hostname, port: u.port ? Number(u.port) : u.protocol === 'https:' ? 443 : 80 });
        } catch {
          /* ignore malformed URIs */
        }
      }

      report.results.push({
        type: 'ALERT',
        data: {
          host,
          plugin_id: alert.pluginid ?? alert.alertRef ?? null,
          name: alert.alert ?? alert.name ?? 'Unnamed alert',
          risk: RISK[Number(alert.riskcode)] ?? alert.riskdesc ?? 'Unknown',
          confidence: alert.confidence ?? null,
          description: truncate(stripHtml(alert.desc), 500) ?? null,
          solution: truncate(stripHtml(alert.solution), 500) ?? null,
          cwe_id: alert.cweid ?? null,
          wasc_id: alert.wascid ?? null,
          count: alert.count ? Number(alert.count) : instances.length,
          instances,
        },
      });
    }
  }

  return report;
}
