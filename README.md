# Bayaw Jobs

> **Demo project.** Data resets to the dummy data set every day at 12:00 AM (Asia/Manila), emails are queued but never delivered, and each account has daily activity limits.

A job portal: a Next.js frontend and an Express API, both running on Cloudflare Workers.

- **Live site:** https://bayawjobs.riomar.dev
- **API:** https://bayawjobs-api.riomar.dev/api (interactive docs at `/api/docs`)

## Features

| Role | What they can do |
| --- | --- |
| Visitor | Browse and search jobs and companies, send a message through the contact form |
| Applicant | Build a profile (education, experience, skills, languages, résumé, photo), apply to jobs, track applications, manage password, login history and two-step login |
| Company | Set up a company profile, post, edit, close and delete jobs, move applicants through hiring stages (status emails are queued), invite team members and edit their permissions |
| Admin | Overview of users, companies, applicants and jobs, ban/unban users, promote users to admin, security event log, email queue management, change own password |

## Architecture

| Part | Runs on |
| --- | --- |
| Frontend (`client/`) | Next.js on Workers via OpenNext |
| API (`server/`) | Express on Workers (`nodejs_compat` + `httpServerHandler`) |
| Database | Cloudflare D1 through Prisma (`@prisma/adapter-d1`) |
| File storage | Cloudflare R2 (resumes, profile pictures, logos) |
| Email queue | Cloudflare Queues + dead-letter queue, mirrored in the `email_jobs` table for the admin Queues page |
| Rate limiting | Workers Rate Limiting bindings, plus per-user daily caps stored in D1 |
| Nightly reset | Cron trigger `0 16 * * *` (12:00 AM UTC+8) wipes D1 and R2 and reloads the demo data |

### Demo mode

`DEMO_MODE=true` (set in `server/wrangler.jsonc`) turns on:

- **No real email.** Emails are queued and shown on the admin Queues page but never delivered. New sign-ups are verified immediately and email OTP is skipped at login.
- **Locked shared accounts.** The password and email of the three accounts below can't be changed, so one visitor can't lock everyone else out.
- **Daily limits per user:** 10 job applications · 5 job posts · 10 file uploads · 100 other changes. Per IP: 5 sign-ups and 5 contact messages. All limits reset at 12:00 AM (PHT).

### Demo accounts

These are also one-click buttons on the login page.

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@bayaw.com | Admin@1234 |
| Company owner | owner@techcorp.com (and the other seeded companies) | Test@1234 |
| Applicant | kathleen.reyes@gmail.com (and the other seeded applicants) | Test@1234 |

The team's own admin accounts are seeded too (see `ADMINS` in `server/src/demo/seed.ts`) and are restored with the demo admin password every night.

### Search engines

Public pages have their own titles, descriptions, canonical URLs and share images. `robots.txt` keeps crawlers out of signed-in areas, and `sitemap.xml` lists every job and company. Seeded jobs and companies keep fixed IDs, so their URLs survive the nightly reset.

## Local development

Prerequisites: Node.js 20+ and a Cloudflare account (`npx wrangler login`).

### API

```sh
cd server
npm install
cp .dev.vars.example .dev.vars   # then fill in random JWT secrets
npm run db:generate
npm run db:migrate:local
npm run db:seed:local
npm run dev                      # http://localhost:8787/api
```

### Frontend

```sh
cd client
npm install
NEXT_PUBLIC_API_URL=http://localhost:8787/api npm run dev
```

## Deploying

### API

```sh
cd server
npx wrangler secret put JWT_ACCESS_TOKEN_SECRET
npx wrangler secret put JWT_REFRESH_TOKEN_SECRET
npx wrangler secret put JWT_VERIFICATION_SECRET
npm run db:migrate:remote
npm run deploy
npm run db:seed:remote           # first deploy only; afterwards the nightly cron reseeds
```

The D1 database, R2 bucket, queues, cron schedule and the `bayawjobs-api.riomar.dev` custom domain are set in `server/wrangler.jsonc`. Optional variables there: `SUPPORT_EMAIL` (where contact messages go) and `DEMO_MODE`.

`npm run db:seed:remote` replaces all data in the remote database with the demo set. Use it to reset by hand at any time.

### Frontend

```sh
cd client
NEXT_PUBLIC_API_URL=https://bayawjobs-api.riomar.dev/api npm run deploy
```

`NEXT_PUBLIC_API_URL` is inlined at build time, so redeploy the frontend after changing it. The frontend is served only on `bayawjobs.riomar.dev`, because the API allows CORS from that origin alone.

## Troubleshooting

**"Network error" on login, with a 403 that has no body.** Cloudflare's security on the `riomar.dev` zone blocked the request before it reached the API. It has happened with Chrome over HTTP/3 (QUIC). Look up the request's Ray ID under **Analytics → Events** for the zone, then turn off the feature that fired, or add a WAF **Skip** rule for `http.host eq "bayawjobs-api.riomar.dev"`. Turning off **HTTP/3** under **Speed → Settings → Protocol Optimization** also works around it.

### Schema changes

Edit `server/prisma/schema.prisma`, then diff it against the last committed schema to write the next SQL migration:

```sh
cd server
git show HEAD:server/prisma/schema.prisma > .wrangler/previous.prisma
npx prisma migrate diff --from-schema .wrangler/previous.prisma --to-schema prisma/schema.prisma --script -o prisma/migrations-d1/000N_name.sql
npm run db:migrate:local
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/) and [OpenNext](https://opennext.js.org/cloudflare)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Cloudflare Workers, D1, R2 and Queues](https://developers.cloudflare.com/workers/)

## Authors

- @riomar0001 - Mario Jr Inguito
- @mismaresenka - Albert Pueso 
- @ranielART - Raniel Art Montebon 
- @TeaGainz - Sgt.Oddball 
- @ykylejan - John Kyle Dellatan
