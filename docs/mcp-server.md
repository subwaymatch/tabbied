# The Tabbied MCP server

Tabbied ships a [Model Context Protocol](https://modelcontextprotocol.io)
server so an assistant can browse the design catalog, *look* at candidates, and
render assets without the site or the package in its context.

It exists in two forms that share one implementation:

| | Remote | Local |
| --- | --- | --- |
| Where | `https://tabbied.com/mcp` | `npx -y tabbied-mcp` |
| Transport | Streamable HTTP | stdio |
| Install | nothing | `tabbied-mcp` (+ Playwright for rendering) |
| Tools | `search_designs`, `get_design`, `preview_design`, `get_docs`, `list_templates`, `get_template` | those six **plus `render_design`** |

## Adding it to a client

Remote - nothing to install:

```jsonc
{
  "mcpServers": {
    "tabbied": { "url": "https://tabbied.com/mcp" }
  }
}
```

Local, when you want to render actual files:

```jsonc
{
  "mcpServers": {
    "tabbied": { "command": "npx", "args": ["-y", "tabbied-mcp"] }
  }
}
```

Or, in Claude Code:

```bash
claude mcp add --transport http tabbied https://tabbied.com/mcp
claude mcp add tabbied -- npx -y tabbied-mcp
```

## The tools

Slugs are opaque (`cleat`, `karst`, `radius`) and there are 295 of them, so the
toolset is built around a single flow: **narrow on metadata, then look.**

- **`search_designs`** filters on a closed vocabulary - `tags` (visible
  motifs), `mood`, `density`, `goodFor` - plus free text and SVG-export
  support. The enum values in the input schema are derived from the catalog
  being served, so they cannot drift from what is actually queryable. Filters
  combine with AND, including *within* a field: two tags means both.

  Because AND narrows fast, an empty result is the interesting case. Rather
  than returning `[]`, the tool reports how each filter would have done on its
  own, so the caller can tell an out-of-vocabulary guess (0 matches) from a
  merely narrow one and fix the next call without another round trip.

- **`get_design`** returns the full record - palette, every option with its
  range and default, SVG-export support - plus slug-substituted React, core,
  and CLI snippets, and a reminder that a pattern has no intrinsic size.

- **`preview_design`** returns the rendered preview image for up to six slugs
  as MCP image content. This is the step that makes a choice reliable; metadata
  narrows the field but these are pictures. The previews are the committed @2x
  renders the gallery shows, so the agent and a human see the same image.

- **`get_docs`** returns `llms-full.txt`, the complete API contract and recipes.

- **`list_templates`** and **`get_template`** answer a different question from
  the four above: not "which pattern?" but "which *site*, and what may I change
  about it?". A template site is a whole page somebody designed, and the useful
  move is to swap the brand out of it rather than regenerate it. `get_template`
  returns the editable-section spec - every text, image, and pattern slot with
  its id and current value, the brand palette, the fonts, both download URLs -
  plus usage notes, because the two formats are edited in opposite ways and
  nothing about the spec implies which.

  The slot ids are the contract: they exist in the downloaded markup as
  `data-edit*` attributes, so an id from a tool response is directly greppable
  in the files the agent then downloads. See `editable-templates.md`.

  Both work remotely - neither needs a browser. Only annotated sites appear;
  coverage is incremental, so the list grows as pages are annotated.

- **`render_design`** (local only) renders any slug to SVG or PNG at any size,
  seed, palette, and option set, either inline or to a path you name. It shells
  out to the `tabbied` CLI rather than reimplementing anything: the only
  faithful renderer for a css-doodle pattern is css-doodle in a real browser
  (see `svg-export.md`). That is also why it cannot be remote - a Worker has no
  browser.

## Protocol: MCP v2, and why there is no Durable Object here

Revision `2026-07-28` ("MCP v2") made the protocol **stateless**. It dropped
the `initialize` / `initialized` handshake and the `Mcp-Session-Id` header;
every request now carries its protocol version, client identity, and
capabilities in `params._meta`, and `server/discover` replaces `initialize` as
the optional way to ask what a server supports.

That is the whole reason this endpoint is a plain Worker route. Cloudflare
previously recommended hosting MCP servers on Durable Objects to hold the
session open, and deprecated that guidance with v2 - the protocol no longer
needs one to be spoken. `createMcpHandler` builds one server per request, which
is why `buildServer` is passed as a *factory* and must never capture
per-request state.

We do not implement any of this ourselves. `@modelcontextprotocol/server` (SDK
v2, replatformed onto Web Standards so it runs on workerd) owns the wire in
both transports:

| | Built with |
| --- | --- |
| `https://tabbied.com/mcp` | `createMcpHandler(() => buildServer(tools), { legacy: 'stateless' })` |
| `tabbied-mcp` bin | `serveStdio(() => buildServer(tools))` |

**`createMcpHandler` is taken from the SDK, not from `agents/mcp/server`.**
Cloudflare's Agents SDK re-exports the same function - it originated there and
graduated upstream - but importing it from `agents` pulls partyserver,
partysocket, esbuild, and babel into a Worker that uses none of them. The SDK's
own dependencies are `zod` and `@modelcontextprotocol/core`, and the deployed
bundle is ~122 KB gzipped.

### Backward compatibility

`legacy: 'stateless'` (the default, spelled out at the call site because it is
load-bearing) keeps 2025-era clients working: they still open with
`initialize`, each request is answered by a fresh instance, and GET/DELETE -
the 2025 session operations - return `405`. Every shipping client still speaks
that era today, so this is not hypothetical. Setting `'reject'` would strand
them.

One consequence worth knowing when reading raw responses: with the default
`responseMode: 'auto'`, legacy exchanges come back as a one-event SSE stream
(`text/event-stream`) while modern ones are plain JSON. Both are spec-legal and
every client handles both; `test/server.test.mjs` unwraps either.

### What the SDK gives us that hand-rolling did not

- **Argument validation.** Tool schemas are registered with the server, so an
  out-of-vocabulary tag is rejected - with the allowed values named - before
  any handler runs.
- **The full modern envelope.** `_meta` must carry protocol version, client
  info, *and* client capabilities; an incomplete one is refused with a precise
  error rather than quietly accepted.
- **MRTR, caching hints, task and subscription plumbing** - none of which this
  server uses today, but none of which it now has to grow by hand.

Errors still follow the spec's split: a malformed request or an unknown tool is
a JSON-RPC error, while a bad slug or a failed render comes back as a tool
result with `isError: true`, so the model sees it and can correct itself.

## Where the data comes from

The remote server reads `/catalog.json`, `/previews/*.webp`,
`/llms-full.txt`, `/editable-catalog.json`, and `/editable/<slug>.json`
**through its own assets binding** rather than bundling them. The tools
therefore describe exactly the bytes that deployment serves, and a 384 KB
catalog stays out of the Worker. Reads are memoised per isolate, and a failed
read is not cached - except the template specs, which are many and each read
rarely, so they are fetched per call.

The template artefacts are *site* artefacts, generated from the static export
(see `editable-templates.md`), which is why the local server fetches those two
over the network with no local fallback: the `tabbied` package does not contain
them, so there is nothing local to prefer. A host that cannot resolve them
simply does not advertise the two tools - the same rule the preview and docs
tools already follow, since a listed tool that always fails is worse than a
missing one.

The local server reads the catalog from the installed `tabbied` package, so it
describes the version you are about to `npm install` - an agent told about a
design that only exists on the site would write an import that does not
resolve. It falls back to `https://tabbied.com/catalog.json` and says so on
stderr.

## Working on it

```bash
npm run build:packages          # tabbied, then tabbied-mcp
npm test --workspace tabbied-mcp
npm run preview                 # the real Worker over out/, including /mcp
```

Driving it by hand is often faster than a client:

```bash
# local, over stdio
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  | node packages/tabbied-mcp/dist/stdio.js

# remote, against `npm run preview`
curl -s -X POST http://127.0.0.1:8787/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_designs","arguments":{"tags":["waves"],"limit":3}}}'
```

Adding a tool means adding it in `src/tools.ts` (if both transports can serve
it) or in the host that can (`src/stdio.ts` for anything needing node or a
browser). Two rules hold:

- Anything reachable from `src/index.ts` must stay free of node imports - that
  entry point is what the Worker bundles.
- Tool input schemas stay plain JSON Schema and are adapted by
  `fromJsonSchema` in `src/server.ts`. Not Zod: `search_designs`'s enums come
  from the catalog being served, so a static schema would drift from what is
  actually queryable.
