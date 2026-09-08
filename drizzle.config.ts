import type { Config } from 'drizzle-kit';

// Emits worker/migrations/ from worker/db/schema.ts (`npm run db:generate`).
// There is no `dbCredentials` here on purpose: nothing in this repo talks to a
// remote D1 from a developer machine. Migrations are applied by
// `wrangler d1 migrations apply` - `--local` for the dev database and the test
// harness, `--remote` as a deploy step.
export default {
  schema: './worker/db/schema.ts',
  out: './worker/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
} satisfies Config;
