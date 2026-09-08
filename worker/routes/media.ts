import { Hono } from 'hono';
import type { Env } from '../env';

// R2 objects, served by key.
//
// Reads are unauthenticated for the same reason a generation's id is: the key
// contains 128 bits of randomness (the generation id, or a uuid for an upload)
// and holding it is the grant. Nothing here is enumerable - R2 listing is never
// exposed - and no user identity is derivable from a key.
//
// `immutable` is honest rather than optimistic: a key is written once and never
// rewritten. Regenerating imagery writes a new object under a new generation.

const MEDIA_PREFIX = /^(gen|up)\/[A-Za-z0-9._/-]+$/;

const media = new Hono<{ Bindings: Env }>();

media.get('/:key{.+}', async (c) => {
  const key = c.req.param('key');

  // Belt and braces against a traversal-shaped key reaching R2 at all.
  if (!MEDIA_PREFIX.test(key) || key.includes('..')) {
    return c.json({ error: 'Not found' }, 404);
  }

  const object = await c.env.MEDIA.get(key);

  if (!object) {
    return c.json({ error: 'Not found' }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(object.body, { headers });
});

export default media;
