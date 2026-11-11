import { defineConfig } from 'prisma/config';

// D1 has no connection URL: SQL migrations are generated with `prisma migrate diff`
// and applied with `wrangler d1 migrations apply` (see package.json scripts).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Placeholder only: the schema engine won't start without a datasource, but
  // `migrate diff --from-empty`/`--from-migrations` never connects to it.
  datasource: { url: 'file:./prisma/unused.db' },
});
