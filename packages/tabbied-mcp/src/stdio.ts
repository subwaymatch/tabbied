#!/usr/bin/env node
// The `tabbied-mcp` bin: the same server the site exposes at /mcp, over stdio.
//
// `serveStdio` owns the whole transport - framing, the era decision on the
// opening exchange, and pinning one instance for the connection - so this file
// is just "load the catalog, build the toolset, hand over the factory".
//
// The catalog is loaded once here rather than inside the factory: it is
// immutable per process, and re-reading it per connection would buy nothing.
//
// Configure it in an MCP client as:
//   { "command": "npx", "args": ["-y", "tabbied-mcp"] }
import { serveStdio } from '@modelcontextprotocol/server/stdio';

import { buildServer } from './server.js';
import { catalogTools } from './tools.js';
import {
  fetchDocs,
  fetchPreview,
  fetchTemplate,
  fetchTemplateCatalog,
  loadCatalog,
} from './node/resources.js';
import { renderTool } from './node/render.js';

async function main(): Promise<void> {
  const catalog = await loadCatalog();

  const tools = [
    ...catalogTools({
      catalog,
      fetchPreview,
      fetchDocs,
      fetchTemplateCatalog,
      fetchTemplate,
    }),
    // Only the local server can render: it has a browser to render with.
    renderTool(catalog),
  ];

  const handle = serveStdio(() => buildServer(tools));

  // The client closing stdin is the shutdown signal. Without this the process
  // lingers after the client has gone.
  process.stdin.on('close', () => {
    void handle.close();
  });
}

main().catch((error) => {
  // stdout is the protocol channel and nothing else may touch it.
  process.stderr.write(
    `tabbied-mcp: ${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exit(1);
});
