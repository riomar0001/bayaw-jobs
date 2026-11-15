#!/usr/bin/env node
// BayawSec scanner agent (optional). Runs Nmap / OWASP ZAP on this machine for scans
// queued in BayawSec, then uploads the reports. Cloudflare Workers can't run these tools.
//
// Safety:
//   - Only does work the API hands out, and re-checks every host against the API's allowlist.
//   - Runs tools with execFile + argument arrays (no shell), so job data can't inject commands.
//   - Off on the server unless SCANNER_AGENT_ENABLED=true and SCANNER_AGENT_TOKEN is set.

import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

const API = (process.env.BAYAWSEC_API_URL ?? 'http://localhost:8787/api').replace(/\/$/, '');
const TOKEN = process.env.SCANNER_AGENT_TOKEN ?? '';
const POLL_MS = Number(process.env.POLL_INTERVAL_MS ?? 15000);
const NMAP_BIN = process.env.NMAP_BIN ?? 'nmap';
const DOCKER_BIN = process.env.DOCKER_BIN ?? 'docker';
const ZAP_IMAGE = process.env.ZAP_DOCKER_IMAGE ?? 'ghcr.io/zaproxy/zaproxy:stable';
const ONCE = process.argv.includes('--once');
const TOOL_TIMEOUT_MS = 15 * 60 * 1000;

const HOST_RE = /^[a-z0-9.-]{1,253}$/i;
const PORTS_RE = /^\d{1,5}(-\d{1,5})?(,\d{1,5}(-\d{1,5})?)*$/;

if (TOKEN.length < 32) {
  console.error('SCANNER_AGENT_TOKEN must be set (32+ characters, same value as the server).');
  process.exit(1);
}

async function api(path, init = {}) {
  const res = await fetch(`${API}/assessments/agent${path}`, {
    ...init,
    headers: { authorization: `Bearer ${TOKEN}`, ...(init.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${body.message ?? ''}`);
  return body.data;
}

function assertAllowed(host, allowed) {
  const h = String(host ?? '').toLowerCase();
  if (!HOST_RE.test(h) || !allowed.includes(h)) throw new Error(`Host "${host}" is not on the allowlist`);
}

async function runNmap(job, allowed) {
  assertAllowed(job.host, allowed);
  const ports = String(job.ports ?? '80,443').replace(/\s+/g, '');
  if (!PORTS_RE.test(ports)) throw new Error(`Invalid ports "${job.ports}"`);
  // -T3: normal timing (no aggressive flooding). -Pn: Cloudflare-fronted hosts drop ping.
  const { stdout } = await run(NMAP_BIN, ['-sV', '-T3', '-Pn', '-p', ports, '-oX', '-', job.host], {
    timeout: TOOL_TIMEOUT_MS,
    maxBuffer: 20 * 1024 * 1024,
  });
  return { name: 'nmap-report.xml', type: 'application/xml', content: stdout };
}

async function runZap(job, allowed) {
  const url = new URL(job.url);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('ZAP target must be http(s)');
  assertAllowed(url.hostname, allowed);

  const workdir = await mkdtemp(join(tmpdir(), 'bayawsec-zap-'));
  try {
    // Baseline scan = passive only (spider + passive rules), no attacks.
    // -I: don't fail on warnings. Exit codes 1/2 just mean alerts were found.
    await run(
      DOCKER_BIN,
      ['run', '--rm', '-v', `${workdir}:/zap/wrk:rw`, ZAP_IMAGE, 'zap-baseline.py', '-t', url.toString(), '-J', 'report.json', '-I'],
      { timeout: TOOL_TIMEOUT_MS, maxBuffer: 20 * 1024 * 1024 }
    ).catch((error) => {
      if (![1, 2].includes(error.code)) throw error;
    });
    const content = await readFile(join(workdir, 'report.json'), 'utf8');
    return { name: 'zap-report.json', type: 'application/json', content };
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
}

async function submit(jobId, report, error) {
  const form = new FormData();
  if (report) form.append('file', new Blob([report.content], { type: report.type }), report.name);
  if (error) form.append('error', String(error).slice(0, 1000));
  return api(`/jobs/${jobId}/result`, { method: 'POST', body: form });
}

async function tick() {
  const { allowed_hosts: allowed } = await api('/config');
  const job = await api('/jobs/claim', { method: 'POST' });
  if (!job) return false;

  console.log(`[agent] job ${job.job_id}: ${job.tool} ${job.host ?? job.url}`);
  try {
    const report = job.tool === 'NMAP' ? await runNmap(job, allowed) : await runZap(job, allowed);
    const result = await submit(job.job_id, report);
    console.log(`[agent] job ${job.job_id}: uploaded (${result?.results ?? 0} results)`);
  } catch (error) {
    console.error(`[agent] job ${job.job_id} failed: ${error.message}`);
    await submit(job.job_id, undefined, error.message).catch((e) => console.error(`[agent] could not report failure: ${e.message}`));
  }
  return true;
}

async function main() {
  console.log(`[agent] polling ${API} every ${POLL_MS / 1000}s${ONCE ? ' (once)' : ''}`);
  for (;;) {
    let worked = false;
    try {
      worked = await tick();
    } catch (error) {
      console.error(`[agent] ${error.message}`);
    }
    if (ONCE) return;
    if (!worked) await new Promise((r) => setTimeout(r, POLL_MS));
  }
}

main();
