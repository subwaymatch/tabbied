# tabbied-mcp

## 0.2.0

### Minor Changes

- [#60](https://github.com/tabbied-design/tabbied/pull/60) [`dc49bfb`](https://github.com/tabbied-design/tabbied/commit/dc49bfbfbd137a42773117cae2f631f71bdf4bd9) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add `tabbied-mcp`, an MCP server over the Tabbied design catalog.

  The same tools serve two transports: `https://tabbied.com/mcp` (nothing to
  install) and a `tabbied-mcp` stdio bin. Tools are `search_designs`,
  `get_design`, `preview_design` - which returns the rendered preview images, so
  an assistant can look at candidates rather than guess from opaque slugs - and
  `get_docs`. The local server adds `render_design` for real SVG/PNG output,
  which the remote one cannot offer because rendering a css-doodle pattern needs
  a browser.

  Built on `@modelcontextprotocol/server` v2, so it speaks the stateless
  `2026-07-28` revision - no `initialize` handshake, no session id, one server
  built per request - while still serving 2025-era clients. Tool schemas are
  plain JSON Schema with enums derived from the catalog being served, which the
  SDK also enforces on incoming arguments.

### Patch Changes

- Updated dependencies [[`f526357`](https://github.com/tabbied-design/tabbied/commit/f5263578e5b1993b6eaae2a29651e987888a6db5), [`772d747`](https://github.com/tabbied-design/tabbied/commit/772d74752534f8e1defa66f629e0f40fe0e0a620), [`772d747`](https://github.com/tabbied-design/tabbied/commit/772d74752534f8e1defa66f629e0f40fe0e0a620), [`f526357`](https://github.com/tabbied-design/tabbied/commit/f5263578e5b1993b6eaae2a29651e987888a6db5)]:
  - tabbied@0.5.0
