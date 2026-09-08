import { Hono } from 'hono';
import { and, desc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
import { upload } from '../db/schema';
import type { Env } from '../env';
import { requireUser } from '../lib/session';

// Reference pictures: a product, a place, a look the person wants the site to
// draw from. Bytes go to R2 under up/<userId>/, the row goes to D1 so the
// person's library can be listed without listing a bucket, and both are
// scoped to the session - an upload is never reachable by a guessed id
// through this route, only through the media route by its full key, which
// carries the random id.

/** What a picture may be, and how big. Alpha-capable formats and JPEG. */
const ACCEPTED = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
]);
const MAX_BYTES = 8 * 1024 * 1024;
/** A library, not a bucket: enough to reference from, not enough to host on. */
const MAX_PER_PERSON = 60;

const uploads = new Hono<{ Bindings: Env }>();

/** Sniff the container, since a content-type is whatever the client said. */
function sniff(bytes: Uint8Array): string | null {
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
}

uploads.post('/', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to add pictures.' }, 401);
  }

  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  const note = form?.get('note');

  if (!(file instanceof File)) {
    return c.json({ error: 'Attach a picture as "file".' }, 400);
  }

  if (file.size > MAX_BYTES) {
    return c.json({ error: 'Pictures are limited to 8 MB.' }, 413);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const contentType = sniff(bytes);

  if (!contentType || !ACCEPTED.has(contentType)) {
    return c.json({ error: 'PNG, JPEG or WebP only.' }, 415);
  }

  const db = drizzle(c.env.DB, { schema });

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(upload)
    .where(eq(upload.userId, userId));

  if (Number(count) >= MAX_PER_PERSON) {
    return c.json({ error: `You can keep up to ${MAX_PER_PERSON} pictures. Remove one first.` }, 429);
  }

  const id = crypto.randomUUID().replace(/-/g, '');
  const key = `up/${userId}/${id}.${ACCEPTED.get(contentType)}`;

  await c.env.MEDIA.put(key, bytes, { httpMetadata: { contentType } });
  await db.insert(upload).values({
    id,
    userId,
    key,
    contentType,
    bytes: bytes.byteLength,
    note: typeof note === 'string' && note.trim() ? note.trim().slice(0, 200) : null,
    createdAt: new Date(),
  });

  return c.json({ id, key, contentType, bytes: bytes.byteLength, src: `/api/media/${key}` });
});

uploads.get('/', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to see your pictures.' }, 401);
  }

  const db = drizzle(c.env.DB, { schema });
  const rows = await db
    .select()
    .from(upload)
    .where(eq(upload.userId, userId))
    .orderBy(desc(upload.createdAt))
    .limit(MAX_PER_PERSON);

  return c.json({
    uploads: rows.map((row) => ({
      id: row.id,
      src: `/api/media/${row.key}`,
      contentType: row.contentType,
      bytes: row.bytes,
      note: row.note,
      createdAt: row.createdAt,
    })),
  });
});

uploads.delete('/:id', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in first.' }, 401);
  }

  const db = drizzle(c.env.DB, { schema });
  const [row] = await db
    .select()
    .from(upload)
    .where(and(eq(upload.id, c.req.param('id')), eq(upload.userId, userId)))
    .limit(1);

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Row first, then bytes: a delete that fails half-way leaves an orphan in
  // R2 rather than a row pointing at nothing, and an orphan costs nothing.
  await db.delete(upload).where(eq(upload.id, row.id));
  await c.env.MEDIA.delete(row.key);

  return c.json({ ok: true });
});

export default uploads;
