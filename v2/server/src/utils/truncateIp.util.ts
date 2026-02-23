import ipaddr from 'ipaddr.js';

export function truncateIp(ip: string): string {
  try {
    const parsedIp = ipaddr.parse(ip);

    if (parsedIp.kind() === 'ipv4') {
      const ipv4 = parsedIp as ipaddr.IPv4;
      const octets = ipv4.octets;
      return `${octets[0]}.${octets[1]}.${octets[2]}.0`;
    }

    if (parsedIp.kind() === 'ipv6') {
      const ipv6 = parsedIp as ipaddr.IPv6;
      const segments = ipv6.parts;
      const truncatedSegments = segments.slice(0, 4).concat(new Array(4).fill(0));
      return ipaddr
        .fromByteArray(truncatedSegments.flatMap((seg) => [seg >> 8, seg & 0xff]))
        .toString();
    }

    return ip;
  } catch {
    return ip;
  }
}

export function getClientIp(req: {
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
}): string {
  const forwardedFor = req.headers?.['x-forwarded-for'];
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    if (ips) {
      const firstIp = ips.split(',')[0];
      if (firstIp) return firstIp.trim();
    }
  }

  const realIp = req.headers?.['x-real-ip'];
  if (realIp) {
    const ip = Array.isArray(realIp) ? realIp[0] : realIp;
    if (ip) return ip;
  }

  return req.ip || '0.0.0.0';
}

export default truncateIp;
