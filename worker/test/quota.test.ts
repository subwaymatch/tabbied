import { env } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/d1';
import { beforeEach, describe, expect, it } from 'vitest';
import { matchDirections } from '../../lib/studioMatch';
import * as schema from '../db/schema';
import { aiUsage, user } from '../db/schema';
import { checkQuota, recordUsage } from '../lib/quota';

// The ledger is the exact ceiling - the KV burst limiter in front of it is
// explicitly approximate - so these run against a real D1 rather than a stub.

const db = drizzle(env.DB, { schema });

const USER = 'quota-test-user';

beforeEach(async () => {
  await db.delete(aiUsage);
  await db.delete(user);
  await db.insert(user).values({
    id: USER,
    name: 'Quota',
    email: `${USER}@example.com`,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

describe('the usage ledger', () => {
  it('starts a user with room', async () => {
    const verdict = await checkQuota(db, USER, 'directions');

    expect(verdict.ok).toBe(true);
    expect(verdict.used).toBe(0);
  });

  it('counts a call against the cap', async () => {
    await recordUsage(db, {
      userId: USER,
      endpoint: 'directions',
      model: 'test',
      promptTokens: 100,
      completionTokens: 20,
    });

    const verdict = await checkQuota(db, USER, 'directions');

    expect(verdict.used).toBe(1);
    expect(verdict.ok).toBe(true);
  });

  it('caps text and images separately, because they cost differently', async () => {
    for (let i = 0; i < 12; i++) {
      await recordUsage(db, {
        userId: USER,
        endpoint: 'direction-image',
        model: 'test',
        imageCount: 1,
      });
    }

    const images = await checkQuota(db, USER, 'direction-image');
    const text = await checkQuota(db, USER, 'directions');

    expect(images.ok).toBe(false);
    // Exhausting the image budget must not close the cheap path.
    expect(text.ok).toBe(true);
  });

  it('explains itself when the cap is reached', async () => {
    for (let i = 0; i < 40; i++) {
      await recordUsage(db, { userId: USER, endpoint: 'directions', model: 't' });
    }

    const verdict = await checkQuota(db, USER, 'directions');

    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      // The route hands this straight to the person, so it has to read.
      expect(verdict.message).toMatch(/limit/i);
      expect(verdict.message).toMatch(/UTC/);
    }
  });

  it("does not count another user's spend", async () => {
    await db.insert(user).values({
      id: 'someone-else',
      name: 'Other',
      email: 'other@example.com',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (let i = 0; i < 40; i++) {
      await recordUsage(db, {
        userId: 'someone-else',
        endpoint: 'directions',
        model: 't',
      });
    }

    await expect(checkQuota(db, USER, 'directions')).resolves.toMatchObject({
      ok: true,
      used: 0,
    });
  });

  it('counts yesterday against yesterday', async () => {
    const yesterday = new Date(Date.now() - 26 * 60 * 60 * 1000);

    for (let i = 0; i < 40; i++) {
      await db.insert(aiUsage).values({
        id: `old-${i}`,
        userId: USER,
        endpoint: 'directions',
        model: 't',
        createdAt: yesterday,
      });
    }

    await expect(checkQuota(db, USER, 'directions')).resolves.toMatchObject({
      ok: true,
    });
  });
});

describe('candidate assembly', () => {
  // The Worker scores with the same function the browser does. What the model
  // is given must be stable for one description, or a repair retry would be
  // choosing from a different shortlist than the attempt it is repairing.
  const entries = [
    'bakery in a coastal town',
    'structural engineering consultancy',
    'children bookshop with bright colours',
  ].map((topic, i) => ({
    slug: `site-${i}`,
    name: `Site ${i}`,
    topic,
    patternSlug: 'radius',
    patternName: 'Radius',
    paletteName: 'Test',
    palette: ['#ffffff', '#111111'],
    descriptors: ['Calm'],
    topicTerms: topic.split(' '),
    moods: ['calm'],
    tags: ['grid'],
    density: 'medium',
    hues: [],
    neutral: true,
  }));

  it('is deterministic for one description', () => {
    const a = matchDirections(entries, 'a coastal bakery', 2);
    const b = matchDirections(entries, 'a coastal bakery', 2);

    expect(a.map((x) => x.slug)).toEqual(b.map((x) => x.slug));
  });

  it('puts the topic match first', () => {
    const [top] = matchDirections(entries, 'we run a bakery', 3);

    expect(top.topic).toContain('bakery');
  });

  it('still returns a full shortlist for a description it cannot match', () => {
    // The model always gets something to choose from; an empty shortlist would
    // make the slug enum empty and the schema unsatisfiable.
    const result = matchDirections(entries, 'zzzz qqqq', 3);

    expect(result).toHaveLength(3);
  });
});
