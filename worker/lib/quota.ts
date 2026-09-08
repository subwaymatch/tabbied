import { and, eq, gte, sql } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { aiUsage } from '../db/schema';
import * as schema from '../db/schema';

// The spend ceiling, and the only one that is exact.
//
// KV counters (lib/ratelimit.ts) smooth bursts and can under-count, because KV
// has no compare-and-set. This does not: it sums the ledger in D1, which is
// written from the upstream's own usage numbers after every call. So the shape
// is deliberately "cheap approximate check, then exact check": a flood is
// stopped by the limiter before it reaches here, and the day's real total is
// what decides whether money gets spent.

export type Endpoint = 'directions' | 'direction-image' | 'site' | 'site-image';

/**
 * Per-endpoint daily caps for the unpriced tier: generous enough that ordinary
 * use never notices, finite enough that a scripted loop stops. A paid tier
 * changes these numbers and nothing else - which is why they are a table and
 * not scattered through the routes.
 */
export const DAILY_CAPS: Record<Endpoint, { calls: number; label: string }> = {
  // Each is one Responses turn over a dozen candidates - two when the answer
  // needed repairing, which the ledger sums rather than replaces.
  directions: { calls: 40, label: 'generations' },
  // Each is a real image; an order of magnitude more expensive.
  'direction-image': { calls: 12, label: 'images' },
  // A full document is a long answer - every text slot on the page - so it is
  // the dearest text call and gets the tightest cap.
  site: { calls: 10, label: 'sites' },
  'site-image': { calls: 12, label: 'site images' },
};

export type Db = DrizzleD1Database<typeof schema>;

const startOfUtcDay = () => {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

export type QuotaVerdict =
  | { ok: true; used: number; cap: number }
  | { ok: false; used: number; cap: number; message: string };

export async function checkQuota(
  db: Db,
  userId: string,
  endpoint: Endpoint
): Promise<QuotaVerdict> {
  const cap = DAILY_CAPS[endpoint];

  const [row] = await db
    .select({ used: sql<number>`count(*)` })
    .from(aiUsage)
    .where(
      and(
        eq(aiUsage.userId, userId),
        eq(aiUsage.endpoint, endpoint),
        gte(aiUsage.createdAt, startOfUtcDay())
      )
    );

  const used = Number(row?.used ?? 0);

  if (used >= cap.calls) {
    return {
      ok: false,
      used,
      cap: cap.calls,
      message: `Daily limit reached (${cap.calls} ${cap.label}). It resets at 00:00 UTC.`,
    };
  }

  return { ok: true, used, cap: cap.calls };
}

export type UsageRecord = {
  userId: string;
  endpoint: Endpoint;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  imageCount?: number;
  costEstimate?: number;
};

/**
 * Written after the call, from what the upstream reported. An "OpenAI-compatible"
 * server that omits `usage` is not an excuse to record zero - the caller passes a
 * conservative estimate instead, so the ledger can over-count but never
 * under-count. A failed row still counts: the money was spent either way.
 */
export async function recordUsage(db: Db, record: UsageRecord): Promise<void> {
  await db.insert(aiUsage).values({
    id: crypto.randomUUID(),
    userId: record.userId,
    endpoint: record.endpoint,
    model: record.model,
    promptTokens: record.promptTokens ?? 0,
    completionTokens: record.completionTokens ?? 0,
    imageCount: record.imageCount ?? 0,
    costEstimate: record.costEstimate ?? 0,
    createdAt: new Date(),
  });
}
