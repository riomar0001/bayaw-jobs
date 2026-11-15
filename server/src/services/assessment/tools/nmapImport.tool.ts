import { XMLParser } from 'fast-xml-parser';
import { asArray, ParsedReport, truncate } from './types';

// Parses `nmap -sV -oX <file>` output into PORT and SERVICE results.
// fast-xml-parser never resolves external entities, so XXE is not possible here.

interface NmapAttrNode {
  addr?: string;
  name?: string;
  state?: string;
  protocol?: string;
  portid?: string | number;
  product?: string;
  version?: string;
  extrainfo?: string;
  reason?: string;
}

interface NmapPort {
  protocol?: string;
  portid?: string | number;
  state?: NmapAttrNode | string;
  service?: NmapAttrNode;
}

interface NmapHost {
  address?: NmapAttrNode | NmapAttrNode[];
  hostnames?: { hostname?: NmapAttrNode | NmapAttrNode[] } | string;
  ports?: { port?: NmapPort | NmapPort[] } | string;
  status?: NmapAttrNode;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  processEntities: false,
  allowBooleanAttributes: true,
});

export function parseNmapXml(xml: string): ParsedReport {
  const doc = parser.parse(xml) as { nmaprun?: { host?: NmapHost | NmapHost[]; args?: string } };
  if (!doc.nmaprun) throw new Error('Not an Nmap XML report (missing <nmaprun>)');

  const report: ParsedReport = { hosts: [], results: [] };

  for (const host of asArray(doc.nmaprun.host)) {
    const addresses = asArray(host.address).map((a) => a.addr).filter((a): a is string => Boolean(a));
    const hostnames =
      typeof host.hostnames === 'object'
        ? asArray(host.hostnames.hostname).map((h) => h.name).filter((h): h is string => Boolean(h))
        : [];
    // Prefer the hostname the scan was started with; scope rules are hostnames.
    const label = hostnames[0] ?? addresses[0] ?? 'unknown';
    const ports = typeof host.ports === 'object' ? asArray(host.ports.port) : [];

    report.hosts.push({ host: label });

    for (const port of ports) {
      const portNumber = Number(port.portid);
      const state = typeof port.state === 'object' ? port.state.state : port.state;
      report.hosts.push({ host: label, port: portNumber });
      report.results.push({
        type: 'PORT',
        data: {
          host: label,
          addresses,
          protocol: port.protocol ?? 'tcp',
          port: portNumber,
          state: state ?? 'unknown',
          reason: typeof port.state === 'object' ? (port.state.reason ?? null) : null,
        },
      });
      if (port.service && state === 'open') {
        report.results.push({
          type: 'SERVICE',
          data: {
            host: label,
            port: portNumber,
            name: port.service.name ?? null,
            product: truncate(port.service.product, 120) ?? null,
            version: truncate(port.service.version, 60) ?? null,
            extra: truncate(port.service.extrainfo, 120) ?? null,
          },
        });
      }
    }
  }

  if (report.hosts.length === 0) throw new Error('The Nmap report contains no hosts');
  return report;
}
