# tabbied-mcp

An [MCP](https://modelcontextprotocol.io) server for
[Tabbied](https://tabbied.com): search 295 generative pattern designs, look at
them, and render them to SVG or PNG - from Claude Code, Claude Desktop, Cursor,
or any other MCP client.

## Use it without installing anything

The same server runs at `https://tabbied.com/mcp`:

```bash
claude mcp add --transport http tabbied https://tabbied.com/mcp
```

```jsonc
{
  "mcpServers": {
    "tabbied": { "url": "https://tabbied.com/mcp" }
  }
}
```

## Or run it locally, and render real files

```bash
claude mcp add tabbied -- npx -y tabbied-mcp
```

```jsonc
{
  "mcpServers": {
    "tabbied": { "command": "npx", "args": ["-y", "tabbied-mcp"] }
  }
}
```

The local server adds `render_design`, which the remote one cannot offer -
rendering a css-doodle pattern needs a real browser. Install a Playwright
alongside it (`npm i -D playwright`) or point `TABBIED_CHROMIUM` at a Chromium
binary.

## Tools

| Tool | What it does |
| --- | --- |
| `search_designs` | Filter by motif, mood, density, intended use, free text, or SVG-export support. |
| `get_design` | The full record for one slug, plus ready-to-paste snippets. |
| `preview_design` | The rendered preview image for up to six designs, so the model can *look*. |
| `get_docs` | The complete API reference (`llms-full.txt`). |
| `render_design` | SVG or PNG at any size, seed, palette, and option set. **Local only.** |

Slugs are opaque - `cleat`, `karst`, `radius` - so the intended flow is
`search_designs` to narrow, `preview_design` to look, then `get_design` for the
options. Choosing off tags alone is the main way this goes wrong.

## Programmatic use

The package's main entry point is runtime-agnostic (no node imports), so it can
be embedded in a Worker or any Web-standard server. It exposes the tools and an
`McpServer` factory; the transport is the MCP SDK's:

```ts
import { createMcpHandler } from '@modelcontextprotocol/server';
import { buildServer, catalogTools } from 'tabbied-mcp';

const tools = catalogTools({ catalog, fetchPreview, fetchDocs });

export default {
  fetch: createMcpHandler(() => buildServer(tools)).fetch,
};
```

Pass the *factory*, not a built server: MCP v2 is stateless and the handler
constructs one server per request.

Built on [`@modelcontextprotocol/server`](https://www.npmjs.com/package/@modelcontextprotocol/server)
v2, so it speaks the stateless `2026-07-28` revision and still serves 2025-era
clients. `docs/mcp-server.md` in the repository has the details.

## License

MIT
