// The runtime-agnostic half of the server: the tool definitions and the
// `McpServer` factory built from them. Nothing here imports node, so this entry
// point is what the Cloudflare Worker bundles.
//
// The protocol and both transports come from `@modelcontextprotocol/server` -
// the Worker wraps `buildServer` in `createMcpHandler`, the bin hands it to
// `serveStdio`. See docs/mcp-server.md.
//
// The node-only pieces - the local catalog reader and the browser-backed
// `render_design` - live behind the bin and are never reached through here.
export { buildServer } from './server.js';
export { catalogTools, createToolset, type Toolset } from './tools.js';
export { templateTools } from './templates.js';
export { INSTRUCTIONS, SERVER_NAME, VERSION } from './info.js';
export type {
  Catalog,
  CatalogDesign,
  CatalogOption,
  TemplateCatalog,
  TemplateCatalogEntry,
  TemplateSpec,
  Tool,
  ToolContent,
  ToolContext,
  ToolDefinition,
  ToolResult,
} from './types.js';
