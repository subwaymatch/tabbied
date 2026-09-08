#!/usr/bin/env node
// A local OpenAI-shaped server, for driving the Studio endpoints without a
// paid API. Point AI_BASE_URL at http://localhost:8788/v1 in .dev.vars.
//
// It speaks the Responses API, and honours `text.format` the way a compliant
// upstream does - the slug enum is read back out of the schema, so the answer
// is always one the validator can accept. It also stores responses and honours
// `previous_response_id`, which is what lets the chained repair turn be
// exercised locally rather than only against OpenAI.
//
// Pass --bad to return a shape that fails validation on the *first* turn only;
// the repair turn then succeeds, which is the path the retry exists for. Pass
// --bad --hopeless to fail both, which is how the matcher fallback is reached.
import { createServer } from 'node:http';

const bad = process.argv.includes('--bad');
const hopeless = process.argv.includes('--hopeless');
const PORT = Number(process.env.PORT ?? 8788);

const read = (req) =>
  new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
  });

// A 1x1 transparent WebP, so the image path returns something real.
const PIXEL_WEBP =
  'UklGRlYAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==';

/** Response id -> the slug enum that turn was asked for, so a chained turn can answer. */
const stored = new Map();

const directionsFor = (slugs) =>
  JSON.stringify({
    recommended: 1,
    directions: slugs.slice(0, 3).map((slug, i) => ({
      slug,
      stance: ['Quiet Ground', 'Open Field', 'Warm Signal'][i],
      why: `A ${['calm', 'direct', 'warm'][i]} direction built on ${slug}.`,
      // Deliberately legible: the palette validator is exercised separately in
      // the unit tests, not by every smoke run.
      palette: ['#faf7f0', '#1c1c1c', '#b0521f'],
      copy: {
        brandName: `Studio ${i + 1}`,
        headline: 'A headline written for this business.',
        tagline: 'A tagline that fits inside the budget.',
      },
    })),
  });

createServer(async (req, res) => {
  const body = await read(req);
  const json = (payload) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(payload));
  };

  if (req.url.endsWith('/responses')) {
    const chained = typeof body?.previous_response_id === 'string';

    // A real upstream resolves the schema from this turn; a chained turn still
    // sends `text.format`, so the enum is read the same way either way, with
    // the stored turn as the fallback a stateful server would use.
    const slugs =
      body?.text?.format?.schema?.properties?.directions?.items?.properties?.slug
        ?.enum ??
      stored.get(body?.previous_response_id) ??
      [];

    const failThisTurn = bad && (hopeless || !chained);

    const id = `resp_stub_${Math.random().toString(36).slice(2, 10)}`;
    stored.set(id, slugs);

    const text = failThisTurn
      ? JSON.stringify({ recommended: 0, directions: [] })
      : directionsFor(slugs);

    return json({
      id,
      object: 'response',
      status: 'completed',
      model: 'stub-responses',
      output: [
        // The reasoning item a reasoning model emits first - present so the
        // walker in ai/client.ts is exercised rather than assumed.
        { type: 'reasoning', id: `rs_${id}`, summary: [] },
        {
          type: 'message',
          id: `msg_${id}`,
          status: 'completed',
          role: 'assistant',
          content: [{ type: 'output_text', text, annotations: [] }],
        },
      ],
      usage: {
        input_tokens: chained ? 2468 : 1234,
        input_tokens_details: { cached_tokens: chained ? 1234 : 0 },
        output_tokens: 321,
        output_tokens_details: { reasoning_tokens: 64 },
        total_tokens: chained ? 2789 : 1555,
      },
    });
  }

  if (req.url.endsWith('/images/generations')) {
    return json({ model: 'stub-image', data: [{ b64_json: PIXEL_WEBP }] });
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'stub: no such endpoint' }));
}).listen(PORT, () => {
  console.log(
    `stub upstream on http://localhost:${PORT}/v1 ` +
      `${bad ? (hopeless ? '(bad mode, hopeless)' : '(bad mode, repairs on retry)') : ''}`
  );
});
