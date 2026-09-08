// The server as a client actually meets it: real JSON-RPC over the SDK's
// stateless HTTP handler, in both protocol eras.
//
// The protocol itself is `@modelcontextprotocol/server`'s job now, so this does
// not re-test the SDK. What it pins is the seam - that our tools are registered
// with schemas the SDK accepts, that a `tools/call` reaches the right handler,
// that argument validation actually engages, and that both eras see the same
// toolset. Those are the things a change on our side can break.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import fs from 'node:fs';
import { createRequire } from 'node:module';

import { createMcpHandler } from '@modelcontextprotocol/server';

import { buildServer } from '../dist/server.js';
import { catalogTools } from '../dist/tools.js';
import { INSTRUCTIONS, VERSION } from '../dist/info.js';

const require = createRequire(import.meta.url);
const catalog = JSON.parse(
  fs.readFileSync(require.resolve('tabbied/catalog.json'), 'utf-8')
);

const tools = catalogTools({
  catalog,
  fetchPreview: async () => ({ data: 'ZmFrZQ==', mimeType: 'image/webp' }),
  fetchDocs: async () => 'THE REFERENCE',
});

const handler = createMcpHandler(() => buildServer(tools), {
  legacy: 'stateless',
});

const MODERN = '2026-07-28';

// The modern era carries version, identity, and capabilities on every request
// instead of negotiating them once - all three are required, and the SDK
// rejects an incomplete envelope.
const modernMeta = {
  'io.modelcontextprotocol/protocolVersion': MODERN,
  'io.modelcontextprotocol/clientInfo': { name: 'test', version: '0' },
  'io.modelcontextprotocol/clientCapabilities': {},
};

async function rpc(body, headers = {}) {
  const response = await handler.fetch(
    new Request('https://tabbied.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        ...headers,
      },
      body: JSON.stringify(body),
    })
  );

  const text = await response.text();
  // `responseMode: 'auto'` answers legacy exchanges as a one-event SSE stream
  // and modern ones as plain JSON; unwrap either into the JSON-RPC message.
  const payload = text.startsWith('event:')
    ? text
        .split('\n')
        .find((line) => line.startsWith('data:'))
        ?.slice(5)
        .trim()
    : text;

  return { status: response.status, body: payload ? JSON.parse(payload) : null };
}

const legacy = (id, method, params) =>
  rpc({ jsonrpc: '2.0', id, method, ...(params ? { params } : {}) });

const modern = (id, method, params = {}) =>
  rpc(
    { jsonrpc: '2.0', id, method, params: { ...params, _meta: modernMeta } },
    {
      'MCP-Protocol-Version': MODERN,
      'Mcp-Method': method,
      ...(params.name ? { 'Mcp-Name': params.name } : {}),
    }
  );

// ---- both eras -------------------------------------------------------------

test('a legacy client still gets its initialize handshake', async () => {
  const { status, body } = await legacy(1, 'initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '0' },
  });

  assert.equal(status, 200);
  assert.equal(body.result.protocolVersion, '2025-06-18');
  assert.equal(body.result.serverInfo.version, VERSION);
  assert.ok(body.result.capabilities.tools);
});

test('a modern client discovers the server without a handshake', async () => {
  const { status, body } = await modern(1, 'server/discover');

  assert.equal(status, 200);
  assert.ok(body.result.supportedVersions.includes(MODERN));
  assert.equal(body.result.resultType, 'complete');
  assert.equal(
    body.result._meta['io.modelcontextprotocol/serverInfo'].version,
    VERSION
  );
});

test('both eras list the same four tools', async () => {
  const fromLegacy = (await legacy(1, 'tools/list')).body.result.tools;
  const fromModern = (await modern(2, 'tools/list')).body.result.tools;

  assert.deepEqual(
    fromLegacy.map((tool) => tool.name),
    ['search_designs', 'get_design', 'preview_design', 'get_docs']
  );
  assert.deepEqual(
    fromModern.map((tool) => tool.name),
    fromLegacy.map((tool) => tool.name)
  );
});

test('instructions reach the client', async () => {
  const { body } = await legacy(1, 'initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '0' },
  });
  assert.equal(body.result.instructions, INSTRUCTIONS);
});

// ---- the seam between our tools and the SDK --------------------------------

test('tool schemas survive registration with their catalog-derived enums', async () => {
  const { body } = await legacy(1, 'tools/list');
  const search = body.result.tools.find((tool) => tool.name === 'search_designs');

  const tags = search.inputSchema.properties.tags.items.enum;
  assert.deepEqual(
    new Set(tags),
    new Set(catalog.designs.flatMap((design) => design.tags))
  );
  assert.deepEqual(
    new Set(search.inputSchema.properties.density.enum),
    new Set(catalog.designs.map((design) => design.density))
  );
});

test('tools/call reaches the handler and returns its content', async () => {
  const { status, body } = await legacy(1, 'tools/call', {
    name: 'search_designs',
    arguments: { tags: ['dots'], limit: 2 },
  });

  assert.equal(status, 200);
  const result = JSON.parse(body.result.content[0].text);
  assert.equal(result.returned, 2);
  assert.ok(result.designs.every((design) => design.tags.includes('dots')));
});

test('the SDK validates arguments against our schema before we see them', async () => {
  // Nothing in tools.ts checks this - registering the JSON Schema is what buys
  // it, and an out-of-vocabulary tag is exactly the mistake an agent makes.
  const { body } = await legacy(1, 'tools/call', {
    name: 'search_designs',
    arguments: { tags: ['definitely-not-a-tag'] },
  });

  assert.equal(body.result.isError, true);
  assert.match(body.result.content[0].text, /valid|allowed|Invalid/i);
});

test('image content survives the round trip', async () => {
  const slug = catalog.designs[0].slug;
  const { body } = await legacy(1, 'tools/call', {
    name: 'preview_design',
    arguments: { slugs: [slug] },
  });

  const image = body.result.content.find((block) => block.type === 'image');
  assert.equal(image.mimeType, 'image/webp');
  assert.equal(image.data, 'ZmFrZQ==');
});

test('a bad slug comes back as a tool error, not a protocol error', async () => {
  const { status, body } = await legacy(1, 'tools/call', {
    name: 'get_design',
    arguments: { slug: 'definitelynotadesign' },
  });

  assert.equal(status, 200);
  assert.equal(body.error, undefined);
  assert.equal(body.result.isError, true);
  assert.match(body.result.content[0].text, /search_designs/);
});

test('an unknown tool is a protocol error', async () => {
  const { body } = await legacy(1, 'tools/call', { name: 'no_such_tool' });
  assert.ok(body.error || body.result.isError, 'must not look like a success');
});

// ---- transport posture -----------------------------------------------------

test('GET is refused - v2 has no standalone stream to open', async () => {
  const response = await handler.fetch(
    new Request('https://tabbied.com/mcp', { method: 'GET' })
  );
  assert.equal(response.status, 405);
});

test('the render tool is absent from the remote toolset', async () => {
  // It needs a browser; a Worker has none. If this ever passes, the Worker is
  // advertising something it cannot do.
  const { body } = await legacy(1, 'tools/list');
  assert.ok(!body.result.tools.some((tool) => tool.name === 'render_design'));
});
