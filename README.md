<p align="center">
  <img src="https://user-images.githubusercontent.com/1064036/102738324-5c79f900-430f-11eb-8403-c4c8aa786dc9.png" alt="Tabbied Logo" width="80" />
</p>
<h1 align="center">Tabbied</h1>
<p align="center">
  <a href="https://deepscan.io/dashboard#view=project&tid=10181&pid=14972&bid=290677"><img src="https://deepscan.io/api/teams/10181/projects/14972/branches/290677/badge/grade.svg" alt="DeepScan grade"></a>
  <a href="https://www.codacy.com/gh/tabbied-design/tabbied/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tabbied-design/tabbied&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/40c0ce7aab95429aa5660d0db16fe353"/></a>
</p>

**Note:** The Tabbied project is undergoing modernization and redesign. The API may change over the next few months.

Tabbied lets you easily create timeless and beautifully generated patterns or pattern to use for wall art, websites, print materials and more. Under the hood, Tabbied uses <a href="https://css-doodle.com/">&lt;css-doodle /&gt;</a> to generate the patterns.

Try it at **[tabbied.com](https://tabbied.com)**.

![tabbied_patterns_screenshot](https://user-images.githubusercontent.com/1064036/102739688-6e5d9b00-4313-11eb-88b9-c3ddb11c04b3.jpg)

## What's in this repo

Tabbied is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo with three parts:

- **The website** (repo root) - the [Next.js](https://nextjs.org/) app behind [tabbied.com](https://tabbied.com), where you browse, customize, reseed, and export the designs. It ships as a static export served by [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/).
- **The [`tabbied`](./packages/tabbied) package** - the generative engine as a published, framework-agnostic library with an optional React component. The site renders every design through this package, so it doubles as the package's integration test.
- **The [`tabbied-mcp`](./packages/tabbied-mcp) package** - an [MCP](https://modelcontextprotocol.io) server over the design catalog. The same code serves the site's `/mcp` endpoint and a local `tabbied-mcp` bin.

## Using the `tabbied` package

Render any of the generative designs in your own app:

```bash
npm install tabbied
```

```tsx
import { TabbiedPattern } from 'tabbied/react';
import { radius } from 'tabbied/patterns';

export function Example() {
  return (
    <TabbiedPattern pattern={radius} fit="cover" style={{ width: '100%', height: 320 }} />
  );
}
```

Presets are imported individually, so your bundle only includes the designs you actually use. See the **[package README](./packages/tabbied/README.md)** for the full API, the framework-agnostic core, and exporting to PNG.

### Using Tabbied with an AI coding assistant

The hard part for an assistant isn't the API - it's picking one of the 295
designs, since the slugs (`cleat`, `gnomonwedge`, `karst`) say nothing about
what they draw.

**The best answer is the MCP server**, because it lets the assistant *look* at
the designs before choosing rather than guessing from a name. Nothing to
install:

```bash
claude mcp add --transport http tabbied https://tabbied.com/mcp
```

It exposes `search_designs` (filter by motif, mood, density, intended use),
`preview_design` (the rendered image for up to six candidates), `get_design`,
and `get_docs`. Running it locally with `npx -y tabbied-mcp` adds
`render_design`, which writes real SVG and PNG files. See
[`docs/mcp-server.md`](./docs/mcp-server.md) and the
[package README](./packages/tabbied-mcp/README.md).

For assistants without MCP, the same catalog is three static files:

| File | For |
| --- | --- |
| [`/llms.txt`](https://tabbied.com/llms.txt) | The [llms.txt](https://llmstxt.org/) index - a short pointer to everything below. |
| [`/llms-full.txt`](https://tabbied.com/llms-full.txt) | The full API contract and a one-line entry for all 295 designs (~55 KB). |
| [`/catalog.json`](https://tabbied.com/catalog.json) | Structured per-design data: palette, options and accepted values, default fit, SVG-export support. Also shipped in the package as `tabbied/catalog.json`. |

All three are generated at build time from the same `patterns/*.json` the
package is built from ([`scripts/generate-llms.mjs`](./scripts/generate-llms.mjs)),
so they can't drift from what's published - and the MCP server reads those same
files rather than a copy of its own.

## Developing locally

To develop locally, clone the repository, run `npm install`, and start the dev server with `npm run dev`:

```bash
# Clone repository
git clone https://github.com/tabbied-design/tabbied.git

# CD into tabbied
cd tabbied

# Install dependencies
npm install

# Run development server (builds the workspace package first, then starts Next.js)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The designs live as JSON in [`packages/tabbied/patterns/`](./packages/tabbied/patterns) - the package's codegen turns them into a typed module that both the site and the published package consume, so adding a new design is just a new JSON file.

## Testing

End-to-end smoke tests run with [Playwright](https://playwright.dev/) against a
production build:

```bash
# Install the browser once
npx playwright install chromium

# Build and run the e2e tests
npm run build
npm run test:e2e
```

Unit tests for the two packages run under `node --test`:

```bash
npm test --workspace tabbied
npm test --workspace tabbied-mcp
```

## Deploying

The site is a static export hosted on
[Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/),
configured in [`wrangler.jsonc`](./wrangler.jsonc). Everything in `out/` is
served straight off Cloudflare's network; [`worker/index.ts`](./worker/index.ts)
runs only for `/mcp` and `/health`.

```bash
# Run the real Worker over a build, including the MCP endpoint
npm run build
npm run preview

# Build and ship
npm run deploy
```

On Workers Builds, set the build command to `npm run build` and leave the
deploy command as `npx wrangler deploy`. Response headers live in
[`public/_headers`](./public/_headers) - a static export has no server to
attach them to, so `headers()` in `next.config.mjs` would be inert.

## Built by

Designed by <a href="https://www.syunghong.com/">Syung Hong</a>, developed by <a href="https://park.is">Ye Joo Park</a>.


## Thanks to

Thanks to <a href="https://yuanchuan.dev/">Yuan Chaun</a>, the developer of <a href="https://css-doodle.com/">&lt;css-doodle /&gt;</a>.
