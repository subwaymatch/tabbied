import { env } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/d1';
import { beforeEach, describe, expect, it } from 'vitest';
import * as schema from '../db/schema';
import { rateWindow } from '../db/schema';
import { consume } from '../lib/ratelimit';

// The counter that replaced the KV one. What matters is that it is exact:
// KV could not compare-and-set, so it under-counted the burst it existed to
// catch - and threw on a second write to the same key within a second, turning
// a 429 into a 500.

const db = drizzle(env.DB, { schema });

const LIMIT = { key: 'test:user', max: 3, windowSeconds: 60 };

beforeEach(async () => {
  await db.delete(rateWindow);
});

describe('consume', () => {
  it('admits up to the limit and refuses past it', async () => {
    for (let i = 1; i <= LIMIT.max; i++) {
      await expect(consume(db, LIMIT)).resolves.toMatchObject({
        ok: true,
        count: i,
      });
    }

    const over = await consume(db, LIMIT);

    expect(over.ok).toBe(false);
    if (!over.ok) {
      // The client is told what to actually wait, not the whole window.
      expect(over.retryAfter).toBeGreaterThan(0);
      expect(over.retryAfter).toBeLessThanOrEqual(LIMIT.windowSeconds);
    }
  });

  it('loses no update when requests land together', async () => {
    // The KV version could not survive this: two reads of the same value, two
    // writes of value+1, one increment silently dropped.
    const burst = await Promise.all(
      Array.from({ length: 10 }, () => consume(db, { ...LIMIT, max: 100 }))
    );

    const counts = burst.map((verdict) => (verdict.ok ? verdict.count : -1));

    expect(new Set(counts).size).toBe(10);
    expect(Math.max(...counts)).toBe(10);
  });

  it('does not throw on a second write to one key inside a second', async () => {
    // The bug this table exists to fix: KV rejects that with a 429, which the
    // route surfaced as a 500 rather than as rate limiting.
    await expect(
      Promise.all([consume(db, LIMIT), consume(db, LIMIT)])
    ).resolves.toHaveLength(2);
  });

  it('starts a new window when the old one has passed', async () => {
    await consume(db, LIMIT);
    await consume(db, LIMIT);

    // Expire it rather than waiting: the rollover is what is under test.
    await db
      .update(rateWindow)
      .set({ expiresAt: new Date(Date.now() - 1000) });

    await expect(consume(db, LIMIT)).resolves.toMatchObject({
      ok: true,
      count: 1,
    });
  });

  it('keeps one row per key however many windows pass', async () => {
    for (let i = 0; i < 5; i++) {
      await consume(db, LIMIT);
      await db
        .update(rateWindow)
        .set({ expiresAt: new Date(Date.now() - 1000) });
    }

    // A rollover updates in place, so there is nothing to garbage collect.
    await expect(db.select().from(rateWindow)).resolves.toHaveLength(1);
  });

  it('counts each key separately', async () => {
    await consume(db, { ...LIMIT, key: 'a' });
    await consume(db, { ...LIMIT, key: 'a' });

    await expect(consume(db, { ...LIMIT, key: 'b' })).resolves.toMatchObject({
      count: 1,
    });
  });
});
