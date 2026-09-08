import path from 'node:path';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

// Worker tests run in workerd, against the same bindings production uses - a
// real (local) D1 with the committed migrations applied, and a real R2.
// The AI upstream is the only thing faked, and it is faked per test at the
// fetch boundary: nothing here ever reaches a paid API.
const root = path.resolve(import.meta.dirname, '..');

export default defineConfig(async () => ({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: path.join(root, 'wrangler.jsonc') },
      miniflare: {
        bindings: {
          // The tests apply exactly the SQL a deploy would apply, rather than a
          // hand-maintained copy of the schema.
          TEST_MIGRATIONS: await readD1Migrations(
            path.join(root, 'worker/migrations')
          ),
          BETTER_AUTH_SECRET: 'test-secret-not-used-for-anything-real',
          DEV: '1',
          ADMIN_EMAILS: 'root@example.com, Second@Example.com',
        },
      },
    }),
  ],
  test: {
    root,
    include: ['worker/test/**/*.test.ts'],
    setupFiles: [path.join(root, 'worker/test/setup.ts')],
  },
}));
