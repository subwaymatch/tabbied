import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import * as schema from '../db/schema';
import { generation } from '../db/schema';
import type { Env } from '../env';
import type { StoredResult } from '../../lib/studioDocument';
import sites from './sites';
import studio from './studio';

// One prompt in, one site out. The person does not choose a template: the
// directions call scores and picks three and names the one it would lead
// with, and this makes that one. It is the two existing handlers run in
// sequence, in-process, with the caller's own headers - so the session, the
// burst gates and the daily caps all apply exactly as they would to the two
// clicks this replaces. Composing the handlers rather than their internals
// keeps one implementation of each.

const requestSchema = z.object({
  description: z.string().trim().min(10).max(600),
});

const make = new Hono<{ Bindings: Env }>();

make.post('/', async (c) => {
  const parsed = requestSchema.safeParse(await c.req.json().catch(() => null));

  if (!parsed.success) {
    return c.json({ error: 'Describe your business in 10-600 characters.' }, 400);
  }

  const headers = new Headers(c.req.raw.headers);
  headers.set('content-type', 'application/json');

  const directions = await studio.request(
    '/directions',
    { method: 'POST', headers, body: JSON.stringify({ description: parsed.data.description }) },
    c.env
  );

  if (!directions.ok) {
    return new Response(directions.body, { status: directions.status, headers: directions.headers });
  }

  const { id: generationId } = (await directions.json()) as { id: string; source: string };

  const db = drizzle(c.env.DB, { schema });
  const [row] = await db
    .select({ result: generation.result })
    .from(generation)
    .where(eq(generation.id, generationId))
    .limit(1);
  const recommended = row ? (JSON.parse(row.result) as StoredResult).recommended : 0;

  const made = await sites.request(
    '/',
    { method: 'POST', headers, body: JSON.stringify({ generationId, index: recommended }) },
    c.env
  );

  if (!made.ok) {
    return new Response(made.body, { status: made.status, headers: made.headers });
  }

  const { id: siteId, source } = (await made.json()) as { id: string; source: string };

  return c.json({ siteId, generationId, index: recommended, source });
});

export default make;
