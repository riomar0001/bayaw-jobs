# BayawSec: run it on your machine

This guide sets up the API (with BayawSec) and the frontend locally from the `feat/bayawsec-dev` branch.
It takes about 15 minutes the first time.

## 1. Prerequisites

| Tool | Version | Needed for |
|---|---|---|
| Git | any | cloning the repo |
| Node.js | 20.6 or newer (22 LTS recommended) | server, client, scanner agent |
| npm | comes with Node | installing packages |
| OpenAI API key | from the team's account | the two AI features (optional for everything else) |
| Nmap | 7.9+ | only if you produce Nmap reports (security tester role) |
| Docker | any recent | only for OWASP ZAP baseline scans (security tester role) |

You do **not** need a Cloudflare account to run locally. `wrangler dev` simulates D1, R2 and Queues on your machine.

## 2. Get the branch

```bash
git clone https://github.com/riomar0001/bayaw-jobs.git
cd bayaw-jobs
git fetch origin
git checkout feat/bayawsec-dev
git pull
```

Already cloned? Just run the last three commands.

## 3. Server setup (`server/`)

```bash
cd server
npm install
```

### 3.1 Create `server/.dev.vars`

`wrangler dev` reads local settings and secrets from `server/.dev.vars`. This file is gitignored, so it never gets committed. Copy the template:

```bash
cp .dev.vars.example .dev.vars
```

On Windows PowerShell: `Copy-Item .dev.vars.example .dev.vars`

Then fill it in:

| Variable | Required | Local value | What it does |
|---|---|---|---|
| `NODE_ENV` | yes | `development` | Lets cookies work on `http://localhost` |
| `JWT_ACCESS_TOKEN_SECRET` | yes | any long random string | Signs access tokens |
| `JWT_REFRESH_TOKEN_SECRET` | yes | a different long random string | Signs refresh tokens |
| `JWT_VERIFICATION_SECRET` | yes | a different long random string | Signs email/OTP verification tokens |
| `CORS_ORIGIN` | yes | `http://localhost:3000` | The one origin the API accepts (your local frontend) |
| `BAYAWSEC_ENABLED` | yes | `true` | Turns the BayawSec module on (off = its routes return 404) |
| `AI_PROVIDER` | no | `openai` | `openai` (default) or `ollama` (local fallback) |
| `OPENAI_API_KEY` | for AI | `sk-...` | OpenAI key. Without it, AI endpoints return 503 and everything else still works |
| `OPENAI_MODEL` | no | `gpt-4.1-mini` | Which OpenAI model to call |
| `OLLAMA_URL` / `OLLAMA_MODEL` | no | `http://localhost:11434` / `llama3.1:8b` | Only used when `AI_PROVIDER=ollama` |
| `AI_DAILY_LIMIT` | no | `20` | AI calls each assessor can make per day (protects credits) |
| `ASSESSMENT_ALLOWED_HOSTS` | yes | `bayawjobs.riomar.dev,bayawjobs-api.riomar.dev,localhost,127.0.0.1` | Hard allowlist. BayawSec can't touch any host outside it |
| `SCANNER_AGENT_ENABLED` | no | `false` | Turns the optional scanner agent API on |
| `SCANNER_AGENT_TOKEN` | if agent on | 32+ random characters | Shared secret between the API and the agent |

Generate random secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> **Never commit `.dev.vars`, and never paste the OpenAI key into chat, docs or screenshots.**
> If you have an old `server/.env` from the previous Postgres version, `wrangler dev` will load it when
> `.dev.vars` is missing. Create `.dev.vars` so it is used instead.

### 3.2 Database

```bash
npm run db:generate        # generates the Prisma client into src/generated/prisma
npm run db:migrate:local   # creates the local D1 tables, including BayawSec's (0002_bayawsec.sql)
npm run db:seed:local      # loads the demo data (users, companies, jobs, team admin accounts)
```

`db:seed:local` only touches your local database. It never deletes BayawSec data.

### 3.3 Run the API

```bash
npm run dev
```

- API: <http://localhost:8787/api> (health check: <http://localhost:8787/api/health>)
- API docs (Scalar): <http://localhost:8787/api/docs>. BayawSec endpoints are under the **BayawSec** tag.

The first `npm run dev` also creates `src/services/assessment/ai/prompts.ts` from `prompts.example.ts`, if it's missing.

## 4. Frontend setup (`client/`)

In a second terminal:

```bash
cd client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8787/api
```

Then run:

```bash
npm run dev
```

The site opens on <http://localhost:3000>. `NEXT_PUBLIC_API_URL` must match the API, and the API's `CORS_ORIGIN` must match this URL.

## 5. Log in with an account that can use BayawSec

BayawSec only opens for **admin accounts that are not shared demo accounts**. The public demo admin (`admin@bayaw.com`) gets
`403` on purpose, because its password is public.

After `db:seed:local`, each team member has a personal admin account: their school email, listed in `ADMINS` in
`server/src/demo/seed.ts`. The password is the demo admin password from the main `README.md`. Use that account locally.

Other options:
- Register a new account, then promote it from the admin panel (Users → Promote) while logged in as any admin.
- Get a token for API testing: `POST /api/auth/login` with `{ "email": "...", "password": "..." }`, then send
  `Authorization: Bearer <accessToken>`. In demo mode there is no OTP step.

## 6. Try the whole flow (about 5 minutes)

Use Scalar at `/api/docs` (click **Authenticate**, paste your access token) or any API client. All paths are under `/api/admin/assessments`.

1. `POST /targets` with `{ "name": "Bayaw Jobs (local)", "base_url": "http://localhost:8787" }`
2. `POST /targets/{id}/scope` with `{ "asset_type": "HOST", "value": "localhost" }` and `{ "asset_type": "PORT_RANGE", "value": "8787" }`
3. `POST /targets/{id}/scans` with `{ "tool": "HTTP_CHECK", "url": "http://localhost:8787/api/health" }`. Poll `GET /jobs/{jobId}` until `COMPLETED`, then `GET /scans/{scanId}`.
4. `POST /targets/{id}/scans` with `{ "tool": "OPENAPI" }` to list every API endpoint.
5. With an OpenAI key: `POST /scans/{scanId}/interpret`. When the job finishes, `GET /findings?target_id={id}` shows **PENDING** findings.
6. `PATCH /findings/{findingId}/verify` with `{ "status": "CONFIRMED", "notes": "Reproduced with curl -I", "final_severity": "MEDIUM", "cvss_score": 4.3 }`
7. `GET /dashboard?target_id={id}` and `GET /targets/{id}/report`

## 7. Producing Nmap and ZAP reports (security tester role)

Workers can't run Nmap or ZAP, so you run them on your machine and upload the report.
**Only scan hosts that are in the approved scope.**

```bash
# Nmap: service detection at normal speed, XML output
nmap -sV -T3 -Pn -p 80,443 -oX nmap-report.xml bayawjobs-api.riomar.dev

# OWASP ZAP baseline (passive) scan with Docker, JSON report in the current folder
docker run --rm -v "$(pwd):/zap/wrk:rw" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://bayawjobs.riomar.dev -J zap-report.json -I
```

Upload with `POST /targets/{id}/imports/nmap` or `/imports/zap` (multipart form, field name `file`).
Every host in the report must be in scope, or the whole import is rejected.

### Optional: scanner agent

`scanner-agent/` runs these tools automatically for scans queued as `AGENT_NMAP` / `AGENT_ZAP`. It's off by default.
See [scanner-agent/README.md](../../scanner-agent/README.md).

## 8. Before you push

```bash
cd server
npm run type-check
npm run lint
```

There's no test runner in this repo. Also check your change by running the app.

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `403 BayawSec is not available to shared demo accounts` | You're logged in as `admin@bayaw.com`. Use your team admin account (step 5). |
| BayawSec routes return `404` | `BAYAWSEC_ENABLED=true` is missing from `.dev.vars`. Restart `npm run dev`. |
| `This host is not on the BayawSec allowlist` | Add the host to `ASSESSMENT_ALLOWED_HOSTS` in `.dev.vars`, but only if it's in the approved scope. |
| `Request is outside the authorized scope` | Add a scope rule for that host, port or URL on the target, or check you didn't mark it out of scope. |
| AI endpoints return `503` | `OPENAI_API_KEY` is missing. Ask whoever manages the team key. |
| AI endpoints return `429` | Daily AI cap reached (`AI_DAILY_LIMIT`). It resets at midnight (PHT). |
| Frontend shows CORS errors | `CORS_ORIGIN` in `.dev.vars` must equal the frontend origin exactly (`http://localhost:3000`). |
| `Cannot find module '@/generated/prisma/client'` | Run `npm run db:generate`. |
| `no such table: assessment_targets` | Run `npm run db:migrate:local`. |
| Import fails with `not a valid report` | Nmap must be `-oX` XML. ZAP must be the **Traditional JSON** report (`-J`). |
