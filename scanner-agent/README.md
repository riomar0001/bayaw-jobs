# BayawSec scanner agent (optional)

Cloudflare Workers can't run Nmap or OWASP ZAP, so the API does HTTP/DNS/OpenAPI checks itself
and accepts uploaded reports. This agent automates the uploads: it runs the real tools on your
machine for scans queued in BayawSec (`AGENT_NMAP`, `AGENT_ZAP`) and posts the results back.

**It's off by default.** Nothing happens unless the server has `SCANNER_AGENT_ENABLED=true` and
a `SCANNER_AGENT_TOKEN`, and someone starts this script.

## Requirements

- Node.js 20.6+
- [Nmap](https://nmap.org/download) on your `PATH` (for `AGENT_NMAP`)
- Docker (for `AGENT_ZAP`, uses the `ghcr.io/zaproxy/zaproxy:stable` image)

## Setup

1. On the server (`server/.dev.vars`, or `wrangler secret put` in production):
   ```
   SCANNER_AGENT_ENABLED=true
   SCANNER_AGENT_TOKEN=<32+ random characters>
   ```
2. Here: `cp .env.example .env` and set the same `SCANNER_AGENT_TOKEN` and the API URL.
3. Queue a scan from BayawSec: `POST /api/admin/assessments/targets/:id/scans` with
   `{ "tool": "AGENT_NMAP", "ports": "80,443" }` or `{ "tool": "AGENT_ZAP" }`.
4. Run `npm start` (keeps polling) or `npm run once` (one job, then exit).

## What it runs

| Tool | Command | Notes |
|------|---------|-------|
| Nmap | `nmap -sV -T3 -Pn -p <ports> -oX - <host>` | Service detection at normal speed. No scripts, no aggressive timing. |
| ZAP  | `docker run ... zap-baseline.py -t <url> -J report.json -I` | Baseline = spider + passive rules only. No active attacks. |

## Safety rules

- The agent only runs jobs the API hands out. The API checks scope when a scan is queued, and
  again when results come back.
- The agent re-checks every host against the API's allowlist (`ASSESSMENT_ALLOWED_HOSTS`) before running.
- Tools run with `execFile` and argument arrays, never through a shell.
- Only scan systems your group owns and the instructor approved. No public sites, no university networks.
