import { SELF, env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import journal from '../migrations/meta/_journal.json';

// The one deploy-time fact the Worker can report about itself: whether the
// database it was handed has this build's migrations. Production once ran a
// build whose routes read `site` against a database that had never had
// 0003 applied, and every one of those routes answered "Internal error"
// while the routes around them worked. Two things now hold: the health
// route says which migration is applied, and a schema-behind error is a 503
// that names the cause.

const ORIGIN = 'https://tabbied.com';
const latest = journal.entries.at(-1)!.tag;

describe('the schema the deployment expects', () => {
  it('is reported by /api/health, and is current under the test migrations', async () => {
    const response = await SELF.fetch(`${ORIGIN}/api/health`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      status: string;
      schema: { expected: string; applied: string | null; current: boolean };
    };
    expect(body.status).toBe('ok');
    expect(body.schema.expected).toBe(latest);
    expect(body.schema.applied).toBe(latest);
    expect(body.schema.current).toBe(true);
  });

  it('answers a genuine miss as a 404 while the schema is current', async () => {
    const response = await SELF.fetch(`${ORIGIN}/api/studio/sites/nope`);
    expect(response.status).toBe(404);
  });

  // Last in the file on purpose: the storage is per test file, so the tables
  // stay dropped for anything that runs after this.
  it('answers a missing table as a 503 that names the cause, not a bare 500', async () => {
    await env.DB.prepare('DROP TABLE revision').run();
    await env.DB.prepare('DROP TABLE site').run();

    const response = await SELF.fetch(`${ORIGIN}/api/studio/sites/nope`);
    expect(response.status).toBe(503);

    const body = (await response.json()) as { error: string };
    expect(body.error).toMatch(/schema is behind/);
  });

});
