import { afterEach, describe, expect, it, vi } from 'vitest';
import { respondJson, UpstreamError } from '../ai/client';
import type { Env } from '../env';

// The Responses API's answer is an *item in an array*, not a field, and two of
// its failure modes look like an empty answer unless they are named. These
// tests pin the walker and both of those, at the fetch boundary - nothing here
// reaches a paid API.

const env = (extra: Partial<Env> = {}) =>
  ({
    AI_BASE_URL: 'https://upstream.test/v1',
    AI_MODEL: 'test-model',
    AI_IMAGE_MODEL: 'test-image-model',
    AI_API_KEY: 'test-key',
    ...extra,
  }) as Env;

/** Captures the outgoing request and answers with `payload`. */
function stub(payload: unknown, status = 200) {
  const calls: { url: string; body: Record<string, unknown> }[] = [];

  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({
      url: String(input),
      body: JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>,
    });

    return new Response(JSON.stringify(payload), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  });

  return calls;
}

const message = (text: string) => ({
  type: 'message',
  role: 'assistant',
  content: [{ type: 'output_text', text }],
});

const ask = (e: Env = env(), previousResponseId?: string) =>
  respondJson(e, {
    instructions: 'be brief',
    input: 'a business',
    schemaName: 'studio_directions',
    schema: { type: 'object' },
    previousResponseId,
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('respondJson', () => {
  it('reads the message past the reasoning item, and reports the turn id', async () => {
    const calls = stub({
      id: 'resp_1',
      status: 'completed',
      model: 'test-model-2026',
      // A reasoning model emits this first, and it carries no content to read.
      output: [{ type: 'reasoning', summary: [] }, message('{"ok":true}')],
      usage: {
        input_tokens: 1200,
        input_tokens_details: { cached_tokens: 900 },
        output_tokens: 400,
        output_tokens_details: { reasoning_tokens: 250 },
      },
    });

    const result = await ask();

    expect(calls[0].url).toBe('https://upstream.test/v1/responses');
    expect(result.content).toBe('{"ok":true}');
    expect(result.model).toBe('test-model-2026');
    expect(result.responseId).toBe('resp_1');
    expect(result.usage).toEqual({
      promptTokens: 1200,
      completionTokens: 400,
      reasoningTokens: 250,
      cachedTokens: 900,
    });
  });

  it('sends the schema as text.format and stores the turn', async () => {
    const calls = stub({ id: 'resp_1', status: 'completed', output: [message('{}')] });

    await ask();

    const format = (calls[0].body.text as { format: Record<string, unknown> }).format;

    expect(format.type).toBe('json_schema');
    expect(format.name).toBe('studio_directions');
    expect(format.strict).toBe(true);
    // Storing is what makes previous_response_id resolvable at all.
    expect(calls[0].body.store).toBe(true);
    expect(calls[0].body.previous_response_id).toBeUndefined();
  });

  it('chains a turn when given a previous response id', async () => {
    const calls = stub({ id: 'resp_2', status: 'completed', output: [message('{}')] });

    await ask(env(), 'resp_1');

    expect(calls[0].body.previous_response_id).toBe('resp_1');
    // Instructions are re-sent every turn: the Responses API does not carry
    // them forward, so a chained turn would otherwise lose the contract.
    expect(calls[0].body.instructions).toBe('be brief');
  });

  it('omits reasoning unless an effort is configured', async () => {
    const bare = stub({ id: 'r', status: 'completed', output: [message('{}')] });
    await ask();
    expect(bare[0].body.reasoning).toBeUndefined();

    vi.unstubAllGlobals();

    const configured = stub({ id: 'r', status: 'completed', output: [message('{}')] });
    await ask(env({ AI_REASONING_EFFORT: 'low' }));
    expect(configured[0].body.reasoning).toEqual({ effort: 'low' });
  });

  it('names an exhausted reasoning budget rather than reporting empty output', async () => {
    // The regression this exists for: on a reasoning model the cap is spent on
    // thinking before any message is emitted, so the answer is a `reasoning`
    // item and nothing else. Indistinguishable from a broken upstream unless
    // `incomplete_details` is read.
    stub({
      id: 'resp_1',
      status: 'incomplete',
      incomplete_details: { reason: 'max_output_tokens' },
      output: [{ type: 'reasoning', summary: [] }],
      usage: { input_tokens: 1200, output_tokens: 6000 },
    });

    await expect(ask()).rejects.toThrow(/incomplete \(max_output_tokens\)/);
  });

  it('surfaces a refusal as a refusal', async () => {
    stub({
      id: 'resp_1',
      status: 'completed',
      output: [
        { type: 'message', role: 'assistant', content: [{ type: 'refusal', refusal: 'no' }] },
      ],
    });

    await expect(ask()).rejects.toThrow(/model refused: no/);
  });

  it('reports a failed response with the upstream message', async () => {
    stub({ id: 'resp_1', status: 'failed', error: { message: 'server had a moment' } });

    await expect(ask()).rejects.toThrow(/server had a moment/);
  });

  it('does not retry a 400', async () => {
    const calls = stub({ error: { message: 'bad schema' } }, 400);

    await expect(ask()).rejects.toBeInstanceOf(UpstreamError);
    // A 4xx is a real answer, not a transient condition.
    expect(calls).toHaveLength(1);
  });
});
