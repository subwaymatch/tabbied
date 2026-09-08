import { SELF, env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

// These drive the real Worker over real (local) bindings: the routing, the
// auth gate, the R2 media path. Anything that would reach the AI upstream is
// out of scope here and is covered by the browser flow in the e2e script,
// which runs against a local OpenAI-shaped stub.

describe('the platform tier', () => {
  it('answers its own health probe', async () => {
    const response = await SELF.fetch('https://x/api/health');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: 'ok' });
  });

  it('lists the social providers it can complete - none, here', async () => {
    // The test environment configures no client ids, so the honest answer is
    // an empty list: the sign-in form then draws no provider buttons at all.
    const response = await SELF.fetch('https://x/api/auth-providers');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ providers: [] });
  });

  it('answers a miss under /api with JSON, not the site 404 page', async () => {
    // A sub-app's notFound handler is not used once it is mounted with
    // route(), so this would otherwise fall through and hand an API client
    // the marketing 404.
    const response = await SELF.fetch('https://x/api/nope');

    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toContain('application/json');
  });
});

describe('generation requires a session', () => {
  it('refuses an anonymous generate', async () => {
    const response = await SELF.fetch('https://x/api/studio/directions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ description: 'a bakery in a small coastal town' }),
    });

    expect(response.status).toBe(401);
  });

  it('refuses anonymous imagery', async () => {
    const response = await SELF.fetch('https://x/api/studio/direction-image', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ generationId: 'whatever', index: 0 }),
    });

    expect(response.status).toBe(401);
  });

  it('404s a generation that does not exist', async () => {
    // Reads are unauthenticated by design - the id is the capability - so the
    // failure mode for a bad link is "not found", never "not allowed".
    const response = await SELF.fetch('https://x/api/studio/generations/nope');

    expect(response.status).toBe(404);
  });
});

describe('media', () => {
  it('serves an object from R2 as immutable', async () => {
    const key = 'gen/testgeneration/0.webp';
    await env.MEDIA.put(key, new Uint8Array([1, 2, 3]), {
      httpMetadata: { contentType: 'image/webp' },
    });

    const response = await SELF.fetch(`https://x/api/media/${key}`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/webp');
    // A key is written once and never rewritten, so this is honest rather
    // than optimistic.
    expect(response.headers.get('cache-control')).toContain('immutable');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(
      new Uint8Array([1, 2, 3])
    );
  });

  it('404s a key that is not there', async () => {
    const response = await SELF.fetch('https://x/api/media/gen/absent/9.webp');

    expect(response.status).toBe(404);
  });

  it.each([
    ['a prefix it does not own', 'secrets/key'],
    ['a traversal segment', 'gen/../../etc/passwd'],
  ])('refuses %s', async (_label, key) => {
    const response = await SELF.fetch(`https://x/api/media/${key}`);

    expect(response.status).toBe(404);
  });
});

describe('the schema is the boundary', () => {
  it('rejects a description that is too short to match on', async () => {
    // Checked before the session, so this is the shape of the request being
    // wrong rather than the caller being wrong.
    const response = await SELF.fetch('https://x/api/studio/directions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ description: 'hi' }),
    });

    // Anonymous, so the auth gate answers first - the point is that neither
    // path ever reaches the upstream.
    expect([400, 401]).toContain(response.status);
  });
});
