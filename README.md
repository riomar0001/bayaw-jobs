# Bayaw Jobs

> **Demo project.** Data resets to the dummy data set every day at 12:00 AM (Asia/Manila), emails are queued but never delivered, and each account has daily activity limits.

A job portal: a Next.js frontend and an Express API, both running on Cloudflare Workers.

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

### Demo limits (per user, per day)

10 job applications · 5 job posts · 10 file uploads · 100 other changes · 5 sign-ups per IP

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@bayaw.com | Admin@1234 |
| Company owner | owner@techcorp.com (and the other seeded companies) | Test@1234 |
| Applicant | kathleen.reyes@gmail.com (and the other seeded applicants) | Test@1234 |

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

The D1 database, R2 bucket and queues are named in `server/wrangler.jsonc`.

### Frontend

```sh
cd client
NEXT_PUBLIC_API_URL=https://<api-worker-host>/api npm run deploy
```

`NEXT_PUBLIC_API_URL` is inlined at build time, so redeploy the frontend after changing it.

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

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Authors

- @riomar0001 - Mario Jr Inguito
- @mismaresenka - Albert Pueso 
- @ranielART - Raniel Art Montebon 
- @TeaGainz - Sgt.Oddball 
- @ykylejan - John Kyle Dellatan
