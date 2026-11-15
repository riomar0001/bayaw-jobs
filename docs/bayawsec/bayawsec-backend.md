# BayawSec backend

BayawSec is the AI-assisted security assessment module added to Bayaw Jobs for the CS24 final project.
This page covers the backend: setup, how the pieces connect, and the API flow the frontend calls.
Full request/response details are in the Scalar docs at `/api/docs` (tags **BayawSec** and **BayawSec Agent**).

## Setup (local)

```sh
cd server
cp .dev.vars.example .dev.vars        # fill in the JWT secrets and OPENAI_API_KEY
npm run db:generate
npm run db:migrate:local              # applies 0002_bayawsec.sql
npm run dev                           # http://localhost:8787/api
```

- Add `localhost` to `ASSESSMENT_ALLOWED_HOSTS` in `.dev.vars` to test against `wrangler dev`.
- BayawSec needs a **personal admin account**. The shared demo admin (`admin@bayaw.com`) gets 403 on purpose.
  Promote a test user with `PATCH /api/admin/users/:id/promote`.
- Production secrets: `npx wrangler secret put OPENAI_API_KEY` (and `SCANNER_AGENT_TOKEN` if you use the agent).
  Create the queues once: `npx wrangler queues create bayaw-jobs-assessment` and `npx wrangler queues create bayaw-jobs-assessment-dlq`.

## How it fits together

| Piece | Where |
|---|---|
| Data model (9 tables) | `server/prisma/schema.prisma`, migration `prisma/migrations-d1/0002_bayawsec.sql` |
| Routes | `src/routes/assessment.routes.ts` (`/api/admin/assessments`), `src/routes/assessmentAgent.routes.ts` (`/api/assessments/agent`) |
| Access gate | `src/middlewares/bayawsec.middleware.ts`: off unless `BAYAWSEC_ENABLED=true`, blocks shared demo accounts |
| Scope enforcement | `src/services/assessment/scope.service.ts`: env allowlist + target scope rules, checked before every request, import and agent job |
| Tools | `src/services/assessment/tools/`: HTTP/cookie/CORS/redirect checks, DNS-over-HTTPS, OpenAPI endpoint import, Nmap XML and ZAP JSON parsers |
| AI | `src/services/assessment/ai/`: OpenAI (default) or Ollama (dev), redaction, Structured Outputs + Zod, the two features |
| Background jobs | Cloudflare Queue `bayaw-jobs-assessment`, mirrored in the `assessment_jobs` table (`src/queues/assessment.*`) |
| Files | R2 under `assessments/` (raw reports, screenshots). The nightly demo reset does **not** delete these or the BayawSec tables |
| Optional agent | `/scanner-agent`: runs real Nmap/ZAP locally (off by default) |

## AI prompts

- `src/services/assessment/ai/prompts.example.ts` is committed. It explains, in `TODO(AI integration)` comments, what each prompt must cover.
  `npm run dev`, `type-check` and `deploy` create it from the example if it's missing.
- The reply format is fixed in `ai/schemas.ts`. Change the prompt wording freely; don't change the fields.

## API flow for the frontend

All routes below are under `/api/admin/assessments` with the usual `Authorization: Bearer <accessToken>`.

1. **Target and scope:** `POST /targets`, then `POST /targets/:id/scope` (HOST, URL or PORT_RANGE; `in_scope` true/false).
2. **Worker checks:** `POST /targets/:id/scans` with `{ "tool": "HTTP_CHECK" | "DNS" | "OPENAPI" }`. The response is `202` with `{ scan, job }`.
   Poll `GET /jobs/:jobId` until `COMPLETED`/`FAILED`, then `GET /scans/:scanId` for the results.
3. **Imports:** `POST /targets/:id/imports/nmap` or `/imports/zap` (multipart, field `file`). These finish synchronously.
4. **AI feature 1:** `POST /scans/:id/interpret` returns `202 { job }`. When the job completes, new **PENDING** findings appear in
   `GET /findings?target_id=...`, and the raw AI output is in `GET /scans/:id/ai`.
5. **Verification (human):** `PATCH /findings/:id/verify` with `status` (CONFIRMED, REJECTED, FALSE_POSITIVE, FIXED) and `notes`.
   CONFIRMED also needs `final_severity` and `cvss_score`. Show AI findings with an "AI suggestion, not verified" badge until this is done.
6. **AI feature 2:** `POST /findings/:id/remediation` returns `202 { job }`, and the draft shows up in `GET /findings/:id/ai`.
   Accept it with `PATCH /findings/:id/remediation { "analysis_id": "..." }`, or save your own text with `{ "remediation": "..." }`.
7. **Evidence:** `POST /findings/:id/evidence`: JSON for HTTP_EXCHANGE/TOOL_OUTPUT, multipart with `file` for SCREENSHOT.
8. **Dashboard:** `GET /dashboard?target_id=...`. **Report data:** `GET /targets/:id/report` (confirmed and fixed findings only). The frontend builds the PDF from this.

Status codes worth handling: `403` (out of scope / shared account), `429` (daily AI cap, `AI_DAILY_LIMIT`), `503` (AI not configured).
