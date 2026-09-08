import { applyD1Migrations, env } from 'cloudflare:test';
import { beforeAll } from 'vitest';

// The committed migrations are the schema under test - the tests run against
// exactly the SQL a deploy would apply, not a hand-maintained copy of it. The
// bindings themselves are typed in ./env.d.ts.
beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});
