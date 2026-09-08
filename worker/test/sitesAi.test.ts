import { SELF, env } from 'cloudflare:test';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import app from '../index';
import type { Env } from '../env';

// The sites route's model branch, which the stub upstream cannot reach: it
// answers every /responses call with a *directions* payload, so a local run
// of "Make this one" always lands on the fallback and the branch that writes
// a full document had only ever run in production. Here the upstream is faked
// at the fetch boundary with an answer shaped by the schema the route sent,
// which is what a compliant upstream does.

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
  const verify = await SELF.fetch(mail!.url, { redirect: 'manual' });

  return verify.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0])
    .join('; ');
}

type SiteSchema = { properties: { text: { required: string[] } } };

/**
 * A fake upstream that reads the slot ids out of the strict schema it was
 * sent and writes one line per slot, the way a compliant Responses API does.
 * `mode` selects the first turn's behaviour: `good` answers the contract,
 * `repair` answers wrongly once and correctly when chained, `hopeless` never
 * answers correctly.
 */
function fakeUpstream(mode: 'good' | 'repair' | 'hopeless') {
  const calls: { body: Record<string, unknown> }[] = [];

  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;
    calls.push({ body });

    if (!url.endsWith('/responses')) {
      return new Response('{"error":"fake: no such endpoint"}', { status: 404 });
    }

    const format = (body.text as { format: { schema: SiteSchema } }).format;
    const ids = format.schema.properties.text.required;
    const chained = typeof body.previous_response_id === 'string';
    const wrong = mode === 'hopeless' || (mode === 'repair' && !chained);
    const text = wrong
      ? JSON.stringify({ text: { 'not.a.slot': 'x' } })
      : JSON.stringify({ text: Object.fromEntries(ids.map((id) => [id, `Written for ${id}`])) });

    return new Response(
      JSON.stringify({
        id: `resp_fake_${calls.length}`,
        status: 'completed',
        model: 'fake-model',
        output: [
          { type: 'reasoning', summary: [] },
          { type: 'message', role: 'assistant', content: [{ type: 'output_text', text }] },
        ],
        usage: { input_tokens: 5000, output_tokens: 2500 },
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  });

  return calls;
}

/** The route with an upstream configured; nothing else about the bindings changes. */
const withUpstream = (): Env => ({ ...(env as unknown as Env), AI_API_KEY: 'test-key' });

async function generate(cookie: string): Promise<string> {
  const response = await SELF.fetch(`${ORIGIN}/api/studio/directions`, {
    method: 'POST',
    headers: { ...json, cookie },
    body: JSON.stringify({ description: 'A pigment maker in Sheffield: dry colour, sold by the jar.' }),
  });
  expect(response.status, await response.clone().text()).toBe(200);

  return ((await response.json()) as { id: string }).id;
}

describe('making a site with a model behind the route', () => {
  let cookie: string;
  let generationId: string;

  beforeAll(async () => {
    cookie = await signIn('modelled@example.com');
    generationId = await generate(cookie);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('writes every text slot the template has, from one turn', async () => {
    const calls = fakeUpstream('good');

    const made = await app.request(
      '/api/studio/sites',
      { method: 'POST', headers: { ...json, cookie }, body: JSON.stringify({ generationId, index: 0 }) },
      withUpstream()
    );
    expect(made.status, await made.clone().text()).toBe(200);

    const { id, source } = (await made.json()) as { id: string; source: string };
    expect(source).toBe('ai');
    expect(calls).toHaveLength(1);

    // The schema the upstream was sent is strict: every slot required, nothing else admitted.
    const sent = calls[0].body as { text: { format: { strict: boolean; schema: SiteSchema & { additionalProperties: boolean } } }; max_output_tokens: number };
    expect(sent.text.format.strict).toBe(true);
    expect(sent.text.format.schema.additionalProperties).toBe(false);
    expect(sent.max_output_tokens).toBeGreaterThan(6_000);

    const site = (await SELF.fetch(`${ORIGIN}/api/studio/sites/${id}`).then((r) => r.json())) as {
      slug: string;
      latest: { source: string; model: string; edits: { edits: { text: Record<string, string>; palette?: string[] } } };
    };
    expect(site.latest.source).toBe('ai');
    expect(site.latest.model).toBe('fake-model');

    const spec = (await SELF.fetch(`${ORIGIN}/editable/${site.slug}.json`).then((r) => r.json())) as {
      slots: { id: string; kind: string }[];
    };
    const textSlots = spec.slots.filter((slot) => slot.kind === 'text').map((slot) => slot.id);
    expect(Object.keys(site.latest.edits.edits.text).sort()).toEqual(textSlots.sort());
    expect(site.latest.edits.edits.palette?.length).toBeGreaterThan(1);

    // The ledger charged one call against the site cap.
    const usage = await env.DB.prepare(
      "SELECT count(*) AS n, sum(prompt_tokens) AS p FROM ai_usage WHERE endpoint = 'site'"
    ).first<{ n: number; p: number }>();
    expect(usage?.n).toBe(1);
    expect(usage?.p).toBe(5000);
  });

  it('repairs a rejected answer on a chained turn', async () => {
    const calls = fakeUpstream('repair');

    const made = await app.request(
      '/api/studio/sites',
      { method: 'POST', headers: { ...json, cookie }, body: JSON.stringify({ generationId, index: 1 }) },
      withUpstream()
    );
    expect(made.status, await made.clone().text()).toBe(200);
    expect(((await made.json()) as { source: string }).source).toBe('ai');

    expect(calls).toHaveLength(2);
    expect(calls[1].body.previous_response_id).toBe('resp_fake_1');
    // The repair turn carries the correction alone against the stored context.
    const repair = calls[1].body.input as { content: string }[];
    expect(repair[0].content).toMatch(/^Your previous answer was rejected/);
  });

  it('falls back to the three-string floor when the model never answers the contract', async () => {
    const calls = fakeUpstream('hopeless');

    const made = await app.request(
      '/api/studio/sites',
      { method: 'POST', headers: { ...json, cookie }, body: JSON.stringify({ generationId, index: 2 }) },
      withUpstream()
    );
    expect(made.status, await made.clone().text()).toBe(200);
    expect(((await made.json()) as { source: string }).source).toBe('fallback');
    expect(calls).toHaveLength(2);
  });
});
