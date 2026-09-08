import type { Env } from '../env';

// The pool types `env` from `cloudflare:test` as `Cloudflare.Env` - the global
// interface `wrangler types` would generate from wrangler.jsonc. This repo
// keeps worker/env.ts as the source of truth instead, because it records which
// secrets are *optional* and what each one degrades to when absent, which a
// generated file cannot say. So the two are bridged here rather than one being
// replaced by the other: a binding added to worker/env.ts is immediately
// visible to every test, and a binding renamed there breaks them at compile
// time.
declare global {
  namespace Cloudflare {
    interface Env extends WorkerEnv {
      /** Injected by worker/vitest.config.mts, applied in setup.ts. */
      TEST_MIGRATIONS: D1Migration[];
    }
  }
}

type WorkerEnv = Env;

export {};
