import { SELF, env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';

// The site tier end to end, minus the model: with no AI_API_KEY the directions
// call answers from the matcher and the make call writes the three-string
// floor, which exercises every row this tier writes and reads - the site, its
// first revision, the pin, the listing - through the real routes, the real
// D1, and the real packaged assets served by the assets binding.
//
// The session is a real one: sign up, read the verification link out of the
// dev mailbox (DEV=1 writes it to D1 rather than sending it), follow it, keep
// the cookie. That is the same path the e2e flow reads a link back through.

const ORIGIN = 'https://tabbied.com';
const json = { 'content-type': 'application/json', origin: ORIGIN };

async function signIn(email: string): Promise<string> {
  const signUp = await SELF.fetch(`${ORIGIN}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ email, password: 'correct horse battery staple', name: 'Test' }),
  });
  expect(signUp.status, await signUp.text()).toBe(200);

  const mail = await env.DB.prepare('SELECT url FROM dev_mail WHERE email = ?')
    .bind(email)
    .first<{ url: string }>();
  expect(mail?.url).toBeTruthy();

  const verify = await SELF.fetch(mail!.url, { redirect: 'manual' });
  const cookies = verify.headers.getSetCookie().map((cookie) => cookie.split(';')[0]);
  expect(cookies.length, 'verification should sign the person in').toBeGreaterThan(0);

  return cookies.join('; ');
}

async function generate(cookie: string): Promise<string> {
  const response = await SELF.fetch(`${ORIGIN}/api/studio/directions`, {
    method: 'POST',
    headers: { ...json, cookie },
    body: JSON.stringify({ description: 'A realtor in Champaign, Illinois: homes, commercial, property management.' }),
  });
  expect(response.status, await response.clone().text()).toBe(200);

  const body = (await response.json()) as { id: string; source: string };
  expect(body.source).toBe('matched-fallback');

  return body.id;
}

describe('sites need a session', () => {
  it('refuses an anonymous make', async () => {
    const response = await SELF.fetch(`${ORIGIN}/api/studio/sites`, {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ generationId: 'whatever0', index: 0 }),
    });
    expect(response.status).toBe(401);
  });

  it('refuses an anonymous listing', async () => {
    const response = await SELF.fetch(`${ORIGIN}/api/studio/sites`);
    expect(response.status).toBe(401);
  });

  it('404s a site that does not exist', async () => {
    const response = await SELF.fetch(`${ORIGIN}/api/studio/sites/nope`);
    expect(response.status).toBe(404);
  });

  it('refuses an anonymous revise', async () => {
    const response = await SELF.fetch(`${ORIGIN}/api/studio/sites/nope/revise`, {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ instruction: 'Make the headline warmer.' }),
    });
    expect(response.status).toBe(401);
  });

  it('refuses anonymous imagery on a site', async () => {
    const response = await SELF.fetch(`${ORIGIN}/api/studio/sites/nope/images`, {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ slot: 'hero.photo' }),
    });
    expect(response.status).toBe(401);
  });
});

describe('one prompt, one site', () => {
  it('refuses an anonymous make', async () => {
    const response = await SELF.fetch(`${ORIGIN}/api/studio/make`, {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ description: 'A bakery in a small coastal town, sourdough and coffee.' }),
    });
    expect(response.status).toBe(401);
  });

  it('makes the recommended direction without a template being chosen', async () => {
    const cookie = await signIn('oneshot@example.com');

    const response = await SELF.fetch(`${ORIGIN}/api/studio/make`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ description: 'A bakery in a small coastal town, sourdough and coffee.' }),
    });
    expect(response.status, await response.clone().text()).toBe(200);

    const body = (await response.json()) as { siteId: string; generationId: string; index: number; source: string };
    expect(body.source).toBe('fallback');
    expect(body.index).toBeGreaterThanOrEqual(0);

    const site = (await SELF.fetch(`${ORIGIN}/api/studio/sites/${body.siteId}`).then((r) => r.json())) as {
      generationId: string;
      directionIndex: number;
      revisions: number;
    };
    expect(site.generationId).toBe(body.generationId);
    expect(site.directionIndex).toBe(body.index);
    expect(site.revisions).toBe(1);

    // Both ledgers were written: the caps that apply to two clicks apply to one.
    const list = (await SELF.fetch(`${ORIGIN}/api/studio/sites`, { headers: { cookie } }).then((r) => r.json())) as { sites: unknown[] };
    expect(list.sites).toHaveLength(1);
  });
});

describe('making a site', () => {
  let cookie: string;
  let generationId: string;

  beforeAll(async () => {
    cookie = await signIn('maker@example.com');
    generationId = await generate(cookie);
  });

  it('rejects a bad request and a missing generation', async () => {
    const bad = await SELF.fetch(`${ORIGIN}/api/studio/sites`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ generationId, index: 7 }),
    });
    expect(bad.status).toBe(400);

    const missing = await SELF.fetch(`${ORIGIN}/api/studio/sites`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ generationId: 'doesnotexist', index: 0 }),
    });
    expect(missing.status).toBe(404);
  });

  it('writes the site and its first revision, pinned to the template', async () => {
    const made = await SELF.fetch(`${ORIGIN}/api/studio/sites`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ generationId, index: 0 }),
    });
    expect(made.status, await made.clone().text()).toBe(200);

    const { id, source } = (await made.json()) as { id: string; source: string };
    expect(source).toBe('fallback');

    const read = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}`);
    expect(read.status).toBe(200);

    const site = (await read.json()) as {
      id: string;
      slug: string;
      title: string;
      revisions: number;
      specVersion: number;
      templateChanged: boolean;
      latest: { n: number; source: string; edits: { slug: string; edits: { palette?: string[] } } };
    };
    expect(site.id).toBe(id);
    expect(site.revisions).toBe(1);
    expect(site.latest.n).toBe(1);
    expect(site.latest.source).toBe('fallback');
    expect(site.latest.edits.slug).toBe(site.slug);
    // The floor carries the direction's palette even when there is no copy.
    expect(site.latest.edits.edits.palette?.length).toBeGreaterThan(1);
    // Freshly made against the packaged template that is being served.
    expect(site.templateChanged).toBe(false);
    expect(site.specVersion).toBeGreaterThan(0);
  });

  it('places imagery only in a slot the template has, and only with an upstream', async () => {
    const made = await SELF.fetch(`${ORIGIN}/api/studio/sites`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ generationId, index: 1 }),
    });
    const { id } = (await made.json()) as { id: string };

    const noSlot = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/images`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ slot: 'not.a.slot' }),
    });
    expect(noSlot.status).toBe(404);

    // A real slot, no AI key: the route says the feature is off rather than
    // pretending, and nothing is written.
    const read = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}`);
    const { slug } = (await read.json()) as { slug: string };
    const spec = (await SELF.fetch(`${ORIGIN}/editable/${slug}.json`).then((r) => r.json())) as {
      slots: { id: string; kind: string }[];
    };
    const imageSlot = spec.slots.find((slot) => slot.kind === 'image');

    if (imageSlot) {
      const off = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/images`, {
        method: 'POST',
        headers: { ...json, cookie },
        body: JSON.stringify({ slot: imageSlot.id }),
      });
      expect(off.status).toBe(503);
    }

    const after = (await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}`).then((r) => r.json())) as {
      revisions: number;
    };
    expect(after.revisions).toBe(1);

    // A request with no upstream says so; nothing is written.
    const off = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/revise`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ instruction: 'Make the headline warmer.' }),
    });
    expect(off.status).toBe(503);

    const tooShort = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/revise`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ instruction: 'x' }),
    });
    expect(tooShort.status).toBe(400);

    // Not yours: another person's session cannot add to it.
    const other = await signIn('intruder@example.com');
    const forbidden = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/images`, {
      method: 'POST',
      headers: { ...json, cookie: other },
      body: JSON.stringify({ slot: 'hero.photo' }),
    });
    expect(forbidden.status).toBe(403);
  });

  it('saves a manual revision, refuses one the engine would reject, and reads history', async () => {
    const list = await SELF.fetch(`${ORIGIN}/api/studio/sites`, { headers: { cookie } });
    const { sites } = (await list.json()) as { sites: { id: string; slug: string }[] };
    const { id, slug } = sites[0];

    const read = (await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}`).then((r) => r.json())) as {
      latest: { edits: { specVersion: number; slug: string; edits: Record<string, unknown> } };
    };
    const spec = (await SELF.fetch(`${ORIGIN}/editable/${slug}.json`).then((r) => r.json())) as {
      slots: { id: string; kind: string }[];
    };
    const textSlot = spec.slots.find((slot) => slot.kind === 'text')!;

    const saved = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/revisions`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({
        edits: {
          ...read.latest.edits,
          edits: { ...read.latest.edits.edits, text: { [textSlot.id]: 'Hand-written' } },
        },
      }),
    });
    expect(saved.status, await saved.clone().text()).toBe(200);
    expect(((await saved.json()) as { revision: number }).revision).toBe(2);

    const rejected = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/revisions`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({
        edits: { ...read.latest.edits, edits: { text: { 'no.such.slot': 'x' } } },
      }),
    });
    expect(rejected.status).toBe(422);
    expect(((await rejected.json()) as { problems: unknown[] }).problems.length).toBeGreaterThan(0);

    const wrongTemplate = await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/revisions`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ edits: { ...read.latest.edits, slug: 'not-this-one' } }),
    });
    expect(wrongTemplate.status).toBe(400);

    const history = (await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/revisions`).then((r) =>
      r.json()
    )) as { revisions: { n: number; source: string }[] };
    expect(history.revisions.map((r) => r.n)).toEqual([2, 1]);
    expect(history.revisions[0].source).toBe('manual');

    const first = (await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}/revisions/1`).then((r) =>
      r.json()
    )) as { n: number; source: string };
    expect(first.n).toBe(1);
    expect(first.source).toBe('fallback');

    const latest = (await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}`).then((r) => r.json())) as {
      revisions: number;
      latest: { n: number; edits: { edits: { text: Record<string, string> } } };
    };
    expect(latest.revisions).toBe(2);
    expect(latest.latest.edits.edits.text[textSlot.id]).toBe('Hand-written');
  });

  it('is idempotent per direction, and lists under the person who made it', async () => {
    const again = await SELF.fetch(`${ORIGIN}/api/studio/sites`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ generationId, index: 0 }),
    });
    const { source } = (await again.json()) as { id: string; source: string };
    expect(source).toBe('existing');

    const list = await SELF.fetch(`${ORIGIN}/api/studio/sites`, { headers: { cookie } });
    expect(list.status).toBe(200);
    const { sites } = (await list.json()) as { sites: { id: string; revisions: number }[] };
    expect(sites).toHaveLength(2);
    expect(sites.map((site) => site.revisions).sort()).toEqual([1, 2]);

    // Someone else sees nothing - the listing is by session, never by id.
    const other = await signIn('other@example.com');
    const theirs = await SELF.fetch(`${ORIGIN}/api/studio/sites`, { headers: { cookie: other } });
    expect(((await theirs.json()) as { sites: unknown[] }).sites).toHaveLength(0);
  });
});
