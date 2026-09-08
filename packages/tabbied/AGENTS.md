# tabbied - notes for AI agents

You are probably here to put a generative pattern on a page, export one as an
asset, or animate one. Everything you need is in two files that ship with
this package:

- **`llms.txt`** (this directory) - the complete reference: entry points,
  React and vanilla APIs, sizing gotchas that compile but render wrong,
  integration recipes (hero background, video frames, static HTML), the
  share-link URL scheme, and a one-line entry for every design.
- **`catalog.json`** (this directory, also `import from 'tabbied/catalog.json'`)
  is every design as data: description, closed-vocabulary `tags` / `mood` /
  `density` / `goodFor` for filtering, palette, options, SVG-export support,
  and a stable `preview` image URL.

**If your harness speaks MCP, connect to the server instead of reading any of
this**: `https://tabbied.com/mcp` (nothing to install) or `npx -y tabbied-mcp`
(local, and adds a `render_design` tool). It wraps the same catalog in
`search_designs` / `preview_design` / `get_design` / `get_docs`, and
`preview_design` returns the actual images - which is the difference between
choosing a design and guessing one.

Three things worth knowing before writing any code:

1. **Designs are picked by slug, and slugs are opaque** (`cleat`, `karst`).
   Query the catalog on its enum fields, then - if you can read images -
   look at `https://tabbied.com/previews/<slug>.webp` for your shortlist
   before committing. The preview is ground truth.
2. **A pattern has no intrinsic size.** It fills its parent; in a parent that
   sizes to content it collapses to nothing. Pass `height` or `aspectRatio`
   when in doubt. This is the number-one integration mistake.
3. **You can render without an app**: `npx tabbied render <slug> --out out.svg`
   (or `.png`, or `--frames N` for a video-ready PNG sequence). `npx tabbied
   list --tag dots` queries the catalog from the shell.

The same docs are served at https://tabbied.com/llms.txt (index) and
https://tabbied.com/llms-full.txt (full reference).
