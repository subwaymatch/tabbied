import type { Env } from '../env';

// The upstream, reached as a wire format rather than a vendor: text is
// `${AI_BASE_URL}/responses`, images are `${AI_BASE_URL}/images/generations`,
// both with a bearer key - OpenAI, an aggregator, a self-hosted server, or
// Cloudflare AI Gateway in front of any of them are one environment variable
// apart.
//
// The text half speaks the **Responses API**, which OpenAI recommends for new
// work and which is the only one of the two that can carry a turn forward: a
// response has an id, and quoting it as `previous_response_id` continues that
// context server-side. Studio uses it twice - for the repair retry here, and
// by storing the id on the generation row so a later revision can chain from
// the answer a user actually kept.
//
// Two consequences of that choice are load-bearing and easy to lose:
//
//   - **Reasoning tokens are output tokens.** On a reasoning model the budget
//     in `max_output_tokens` is spent on thinking *before* any message is
//     emitted, so a cap sized for the old `max_completion_tokens` returns
//     `status: "incomplete"` and no content at all. That is a distinct failure
//     from a refusal or a malformed answer and is reported as one.
//   - **There is no `choices[0].message.content`.** The answer is an item in
//     an `output` array that also carries reasoning items, so it is walked
//     rather than indexed.
//
// There is deliberately no general `chat()` export beyond this file: every
// caller is a task endpoint that assembles its own prompt server-side. A
// pass-through would hand prompt construction to the client and turn the site
// into a free faucet.

export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = 'UpstreamError';
  }
}

export const hasUpstream = (env: Env) => Boolean(env.AI_API_KEY);

/** Transient upstream conditions; anything else is a real answer, including 4xx. */
const RETRY_STATUS = new Set([408, 429, 500, 502, 503, 504]);

async function call(
  env: Env,
  path: string,
  body: unknown,
  { retries = 2, timeoutMs = 90_000 }: { retries?: number; timeoutMs?: number } = {}
): Promise<Response> {
  const url = `${env.AI_BASE_URL.replace(/\/$/, '')}${path}`;

  for (let attempt = 0; ; attempt++) {
    // A hung upstream would otherwise hold the request open until the platform
    // kills it, which loses the chance to record the attempt.
    const abort = AbortSignal.timeout(timeoutMs);

    let response: Response | undefined;
    let networkError: unknown;

    try {
      // A FormData body is sent as-is: fetch writes the multipart boundary into
      // the content-type itself, and setting one by hand breaks the upload.
      const multipart = body instanceof FormData;

      response = await fetch(url, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.AI_API_KEY}`,
          ...(multipart ? {} : { 'content-type': 'application/json' }),
        },
        body: multipart ? body : JSON.stringify(body),
        signal: abort,
      });
    } catch (error) {
      networkError = error;
    }

    if (response?.ok) {
      return response;
    }

    const transient =
      networkError !== undefined || (response && RETRY_STATUS.has(response.status));

    if (!transient || attempt >= retries) {
      const detail = response ? await response.text().catch(() => '') : String(networkError);
      throw new UpstreamError(
        `${path} failed: ${response?.status ?? 'network'} ${detail.slice(0, 300)}`,
        response?.status
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(8_000, 500 * 2 ** attempt))
    );
  }
}

export type ChatUsage = {
  promptTokens: number;
  completionTokens: number;
  /** Billed inside `completionTokens`; carried separately for diagnosis. */
  reasoningTokens: number;
  /** Billed inside `promptTokens` at the cached rate; diagnosis only. */
  cachedTokens: number;
};

export type ChatResult = {
  content: string;
  usage: ChatUsage;
  model: string;
  /**
   * The id to quote as `previous_response_id` to continue this turn. Absent
   * when the upstream did not store the response - every caller therefore
   * treats chaining as an optimisation and keeps a full-context path.
   */
  responseId?: string;
};

/** The subset of the Responses payload this file reads. */
type ResponsePayload = {
  id?: string;
  model?: string;
  status?: string;
  error?: { message?: string } | null;
  incomplete_details?: { reason?: string } | null;
  output?: {
    type?: string;
    content?: { type?: string; text?: string; refusal?: string }[];
  }[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    input_tokens_details?: { cached_tokens?: number };
    output_tokens_details?: { reasoning_tokens?: number };
  };
};

/**
 * The assistant text out of an `output` array.
 *
 * A reasoning model emits at least two items - a `reasoning` item with no
 * content this code may read, then the `message` - and a model that declines
 * emits a `refusal` part in place of `output_text`. Both are distinguished
 * here so the caller's error is attributable rather than "no content".
 */
function readOutputText(payload: ResponsePayload): string {
  const parts: string[] = [];
  const refusals: string[] = [];

  for (const item of payload.output ?? []) {
    if (item.type !== 'message') {
      continue;
    }

    for (const part of item.content ?? []) {
      if (part.type === 'output_text' && typeof part.text === 'string') {
        parts.push(part.text);
      } else if (part.type === 'refusal' && typeof part.refusal === 'string') {
        refusals.push(part.refusal);
      }
    }
  }

  if (parts.length === 0 && refusals.length > 0) {
    throw new UpstreamError(`model refused: ${refusals.join(' ').slice(0, 200)}`);
  }

  return parts.join('');
}

/**
 * One structured-output turn.
 *
 * `schema` is sent as `text.format` (the Responses spelling of what chat
 * completions called `response_format`) and the caller validates the parsed
 * answer against the same zod schema - an upstream that ignores strict
 * formatting therefore fails at the validate step with an attributable error
 * rather than leaking a half-shape into the UI.
 *
 * Pass `previousResponseId` to continue a stored turn: `input` is then the new
 * message only, and the upstream reassembles the rest. `instructions` are sent
 * every time regardless - the Responses API does not carry them forward.
 */
export async function respondJson(
  env: Env,
  options: {
    instructions: string;
    input: string;
    schemaName: string;
    schema: unknown;
    maxOutputTokens?: number;
    previousResponseId?: string;
  }
): Promise<ChatResult> {
  const response = await call(env, '/responses', {
    model: env.AI_MODEL,
    instructions: options.instructions,
    input: [{ role: 'user', content: options.input }],
    text: {
      format: {
        type: 'json_schema',
        name: options.schemaName,
        strict: true,
        schema: options.schema,
      },
    },
    // Sized for reasoning + the document, not the document alone.
    max_output_tokens: options.maxOutputTokens ?? 6_000,
    // Storing is what makes `previous_response_id` resolvable, which is the
    // whole reason this endpoint was chosen over chat completions. It also
    // means prompts and answers are retained upstream - see §4 of
    // agent-outputs/20260827-studio-ai-plan.md.
    store: true,
    ...(options.previousResponseId
      ? { previous_response_id: options.previousResponseId }
      : {}),
    // Omitted unless configured: a non-reasoning model, and some compatible
    // servers, reject the field outright.
    ...(env.AI_REASONING_EFFORT ? { reasoning: { effort: env.AI_REASONING_EFFORT } } : {}),
  });

  const payload = (await response.json()) as ResponsePayload;

  if (payload.status === 'failed') {
    throw new UpstreamError(payload.error?.message ?? 'upstream reported a failed response');
  }

  const content = readOutputText(payload);

  if (content.length === 0) {
    // The reasoning-budget case, named explicitly: it looks like an empty
    // answer and is really a cap that needs raising.
    if (payload.status === 'incomplete') {
      throw new UpstreamError(
        `response incomplete (${payload.incomplete_details?.reason ?? 'unknown reason'})`
      );
    }

    throw new UpstreamError('upstream returned no output text');
  }

  return {
    content,
    model: payload.model ?? env.AI_MODEL,
    responseId: payload.id,
    // An upstream that omits `usage` is not licence to record zero: the caller
    // substitutes a conservative estimate, so the ledger over-counts rather
    // than silently letting a budget run free.
    usage: {
      promptTokens: payload.usage?.input_tokens ?? 0,
      completionTokens: payload.usage?.output_tokens ?? 0,
      reasoningTokens: payload.usage?.output_tokens_details?.reasoning_tokens ?? 0,
      cachedTokens: payload.usage?.input_tokens_details?.cached_tokens ?? 0,
    },
  };
}

export type ImageResult = { bytes: ArrayBuffer; contentType: string; model: string };

/**
 * One image, as WebP. Transparency is a *parameter* - never a request in the
 * prose, which paints a fake checkerboard into the pixels - and gpt-image-2
 * honours it natively, which is why this reaches one vendor and not two (see
 * docs/image-pipeline.md).
 *
 * This stays on the images endpoint rather than moving to the Responses API's
 * `image_generation` tool. That tool puts a reasoning model in front of every
 * image whose job would be to rewrite a prompt this repo tunes deliberately,
 * and it bills the rewrite; here the prompt reaches the image model as
 * written, for one metered call with one failure mode.
 */
export type ReferenceImage = { bytes: ArrayBuffer; contentType: string };

export async function generateImage(
  env: Env,
  options: {
    prompt: string;
    size?: string;
    transparent?: boolean;
    /**
     * Pictures to draw from - a product, a place, a look. With any given the
     * call goes to `/images/edits`, which is the endpoint that takes reference
     * images and is multipart rather than JSON; without, `/images/generations`
     * as before. The rest of the request is the same on both.
     */
    references?: ReferenceImage[];
  }
): Promise<ImageResult> {
  const fields: Record<string, string> = {
    model: env.AI_IMAGE_MODEL,
    prompt: options.prompt,
    size: options.size ?? '1536x1024',
    quality: 'low',
    n: '1',
    output_format: 'webp',
    ...(options.transparent ? { background: 'transparent' } : {}),
  };

  let response: Response;

  if (options.references && options.references.length > 0) {
    const form = new FormData();

    for (const [key, value] of Object.entries(fields)) form.append(key, value);
    options.references.forEach((reference, index) => {
      form.append(
        'image[]',
        new Blob([reference.bytes], { type: reference.contentType }),
        `reference-${index}.${reference.contentType.split('/')[1] ?? 'png'}`
      );
    });

    response = await call(env, '/images/edits', form, { timeoutMs: 120_000, retries: 1 });
  } else {
    response = await call(
      env,
      '/images/generations',
      { ...fields, n: 1 },
      { timeoutMs: 120_000, retries: 1 }
    );
  }

  const payload = (await response.json()) as {
    model?: string;
    data?: { b64_json?: string }[];
  };
  const b64 = payload.data?.[0]?.b64_json;

  if (!b64) {
    throw new UpstreamError('image response contained no b64_json');
  }

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return {
    bytes: bytes.buffer,
    contentType: 'image/webp',
    model: payload.model ?? env.AI_IMAGE_MODEL,
  };
}
