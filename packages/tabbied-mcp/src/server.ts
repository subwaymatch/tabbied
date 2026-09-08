// Turns the runtime-agnostic toolset into an SDK `McpServer`.
//
// This is the only place the two transports meet the protocol: the Worker hands
// the factory to `createMcpHandler`, the bin hands it to `serveStdio`, and both
// get the same tools, the same instructions, and the same era handling.
//
// A *factory*, not an instance, because MCP v2 is stateless - the SDK builds
// one server per request (per connection, on stdio) rather than keeping a
// session alive. Nothing here may capture per-request state.
import { McpServer, fromJsonSchema } from '@modelcontextprotocol/server';

import { INSTRUCTIONS, SERVER_NAME, VERSION } from './info.js';
import type { Tool } from './types.js';

/**
 * Register a toolset onto a fresh `McpServer`.
 *
 * Tool schemas stay plain JSON Schema - `fromJsonSchema` adapts them to the
 * standard-schema interface `registerTool` wants. That matters more than it
 * looks: `search_designs`'s enums are *derived from the catalog being served*
 * (see tools.ts), so they cannot be authored as static Zod and cannot drift
 * from what is actually queryable. Handing the SDK the schema also buys
 * argument validation for free - a bad enum value now comes back as a tool
 * error naming the allowed values instead of silently matching nothing.
 */
export function buildServer(tools: Tool[]): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: VERSION },
    { capabilities: { tools: {} }, instructions: INSTRUCTIONS }
  );

  for (const tool of tools) {
    server.registerTool(
      tool.definition.name,
      {
        title: tool.definition.title,
        description: tool.definition.description,
        inputSchema: fromJsonSchema<Record<string, unknown>>(
          tool.definition.inputSchema
        ),
      },
      async (args) => (await tool.run(args ?? {})) as never
    );
  }

  return server;
}
