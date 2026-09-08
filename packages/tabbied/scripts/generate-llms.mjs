// Builds the agent-facing docs from catalog.json (itself written by
// codegen.mjs). Owned by the package so the published tarball can't ship
// without them: `npm run build` (and therefore prepublishOnly) writes
// packages/tabbied/llms.txt, and the site's scripts/generate-llms.mjs imports
// the same builder to write public/llms.txt, public/llms-full.txt and
// public/catalog.json - one template, two consumers, no drift.
//
// Two texts, in increasing depth, so a tool can stop as soon as it has enough:
//
//   llms      the llms.txt convention (llmstxt.org): a short index that
//             links to everything else. Served at tabbied.com/llms.txt.
//   llmsFull  the whole API contract, the recipes, and a one-line entry for
//             every design - enough to pick a design and wire it up from a
//             single fetch. Served at tabbied.com/llms-full.txt and shipped
//             in the npm tarball as llms.txt (in node_modules, depth beats
//             brevity - it's the only file an agent will find).
//
// The point of all this is design discovery. The API is small enough to
// memorize, but the ~300 slugs are opaque ("cleat", "gnomonwedge", "karst"),
// so an assistant with no catalog either guesses a slug that doesn't exist or
// imports the whole record and loses tree-shaking. The authored descriptions,
// the closed-vocabulary tags, and the preview images are what make the set
// searchable - see scripts/catalog-vocabulary.mjs.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TAGS, MOODS, DENSITIES, GOOD_FOR } from './catalog-vocabulary.mjs';

const SITE = 'https://tabbied.com';
const REPO = 'https://github.com/tabbied-design/tabbied';

export function buildLlmsTexts(catalog) {
  const { designs, count, version } = catalog;

  // ---- llms.txt (the short index) ------------------------------------------

  const llms = `# Tabbied

> Generative patterns as data: ${count} preset designs powered by css-doodle, shipped as the \`tabbied\` npm package (v${version}) - a framework-agnostic core plus an optional React component. Render any design at any size, reseed it, and export to PNG or true vector SVG.

Install with \`npm install tabbied\`. React is an optional peer dependency, needed only for the \`tabbied/react\` entry point.

Designs are referred to by slug and imported individually - \`import { radius } from 'tabbied/patterns'\` - so a bundler ships only what you use. Slugs are lowercase alphanumeric and are not guessable from a description: read the catalog below to choose one. Every design has a stable preview image at ${SITE}/previews/<slug>.webp - look before you pick.

## Docs

- [MCP server](${SITE}/mcp): if you speak the Model Context Protocol, connect to this endpoint instead of reading files - it is the only route that lets you *look* at a design before choosing it. Tools: \`search_designs\`, \`preview_design\`, \`get_design\`, \`get_docs\`. Run \`npx -y tabbied-mcp\` locally to also get \`render_design\`.
- [llms-full.txt](${SITE}/llms-full.txt): the complete API contract, integration recipes, and a one-line entry for every design. Start here - it is designed to be enough on its own.
- [catalog.json](${SITE}/catalog.json): every design with its description, tags, palette, options, preview URL, and SVG-export support. Use it to look up one design in detail. Also shipped in the package at \`tabbied/catalog.json\`.
- [React component reference](${SITE}/docs/react/): props, sizing, and live examples.
- [Package README](${REPO}/blob/main/packages/tabbied/README.md): entry points, the core API, and SVG export.
- [SVG export notes](${REPO}/blob/main/docs/svg-export.md): what the vector exporter supports and where it degrades.

## Optional

- [Tabbied](${SITE}): browse, customize, and export the designs in the browser.
- [Repository](${REPO})
`;

  // ---- llms-full.txt -------------------------------------------------------

  // Anything that makes generated code compile but render wrong belongs here -
  // that's what a model can't infer from the type signatures.
  const apiReference = `# Tabbied - full reference for LLMs

> Generated from tabbied v${version}. ${count} designs. Canonical index: ${SITE}/llms.txt

## Install

\`\`\`bash
npm install tabbied
\`\`\`

React is an **optional** peer dependency (>=18 <20), needed only for
\`tabbied/react\`. The core runs in any framework, or none. Node >=18.

## Entry points

| Import | Provides |
| --- | --- |
| \`tabbied\` | Framework-agnostic core: \`createPattern\`, sizing/seed helpers, types. |
| \`tabbied/react\` | The \`TabbiedPattern\` component and its handle/prop types. |
| \`tabbied/patterns\` | The presets. Import individually; the \`patterns\` record holds all ${count}. |
| \`tabbied/svg-export\` | \`doodleToSvg\`, the vector converter, for use on a doodle you manage. |
| \`tabbied/catalog.json\` | This catalog as data. |

## Choosing a design

Each design carries closed-vocabulary metadata, so the catalog is queryable -
filter \`catalog.designs\` on these instead of parsing prose:

- \`tags\` (2-6): visible motifs. One of: ${TAGS.join(', ')}.
- \`mood\` (1-3): the feel. One of: ${MOODS.join(', ')}.
- \`density\`: ${DENSITIES.join(' | ')} - how busy the surface is. Sparse and
  calm surfaces take overlaid text well; dense fine textures suit fills.
- \`goodFor\` (1-4): uses that work with no customization. One of:
  ${GOOD_FOR.join(', ')}.
- \`preview\`: a stable ${SITE}/previews/<slug>.webp render of the design at
  its authored palette and defaults. If you can read images, LOOK at your
  shortlist before choosing - the preview is ground truth, the description is
  not.

\`\`\`js
import catalog from 'tabbied/catalog.json';

const candidates = catalog.designs.filter(
  (d) => d.goodFor.includes('hero-background') && d.density === 'sparse'
);
\`\`\`

Or from a shell: \`npx tabbied list --tag dots --density dense\` (see CLI below).

**If you speak MCP, use the MCP server instead of any of the above.** It is the
only route that lets you *see* the designs while choosing:

\`\`\`bash
claude mcp add --transport http tabbied ${SITE}/mcp    # nothing to install
claude mcp add tabbied -- npx -y tabbied-mcp           # local, adds rendering
\`\`\`

Tools: \`search_designs\` (the filters above, as a query), \`preview_design\`
(returns the rendered image for up to six slugs), \`get_design\`, \`get_docs\`,
and - locally only, since it needs a browser - \`render_design\` for SVG/PNG
files. Endpoint: ${SITE}/mcp. Package: \`tabbied-mcp\`.

## React

\`\`\`tsx
import { TabbiedPattern, type TabbiedPatternHandle } from 'tabbied/react';
import { radius } from 'tabbied/patterns';
import { useRef } from 'react';

export function Example() {
  const ref = useRef<TabbiedPatternHandle>(null);

  return (
    <>
      <TabbiedPattern ref={ref} pattern={radius} seed="k9Pz" height={320} />
      <button onClick={() => ref.current?.redraw()}>Redraw</button>
      <button onClick={() => ref.current?.exportImage()}>Export PNG</button>
      <button onClick={() => ref.current?.exportSvg({ download: true })}>
        Export SVG
      </button>
    </>
  );
}
\`\`\`

### Props

| Prop | Description |
| --- | --- |
| \`pattern\` | A \`PatternDefinition\` - a preset from \`tabbied/patterns\`, or your own. Required. |
| \`seed\` | Randomization seed. Omit for a random seed per mount; reseed via the handle. |
| \`palette\` | Active colors, background (\`color0\`) first. Defaults to the preset palette. |
| \`options\` | Option values keyed by option id. Unset options use their authored default. |
| \`fit\` | \`grid\`, \`cover\`, or \`fixed\`. Optional - the same three for every design; omit it for \`grid\`. |
| \`fill\` | \`width: 100%; height: 100%\`. Defaults to \`true\`. |
| \`width\` / \`height\` | Box size. Numbers are px. Overrides \`fill\` on that axis. |
| \`maxWidth\` / \`maxHeight\` | Upper bounds on the box. |
| \`aspectRatio\` | CSS \`aspect-ratio\`, e.g. \`3 / 2\`. Derives height from width. |
| \`coverRender\` | Render resolution for the \`cover\` fit (default 800x800). |
| \`redrawInterval\` | Re-randomize the seed every N ms. Ticks drop while the tab is hidden or the box is off-screen. |
| \`paused\` | Pause \`redrawInterval\` ticks. No effect unless \`redrawInterval\` is set. |
| \`onReady\` | Fires once the pattern has been measured and first painted. |

The handle (\`TabbiedPatternHandle\`) exposes \`redraw(seed?)\`,
\`exportImage(options?)\`, \`exportSvg(options?)\`, and \`element\` - the raw
\`<css-doodle>\` node.

## Sizing

A pattern has no intrinsic size - it takes the size of the box you give it.
By default that box fills its containing block.

\`\`\`tsx
// Fill a sized parent.
<div style={{ height: 400 }}><TabbiedPattern pattern={radius} /></div>

// Cap the width and let the ratio set the height.
<TabbiedPattern pattern={radius} maxWidth={960} aspectRatio={3 / 2} />

// Full-bleed banner.
<TabbiedPattern pattern={radius} height="40vh" />
\`\`\`

**Gotchas that compile but render wrong:**

- \`height: 100%\` (which \`fill\` sets) only resolves against a parent with a
  **definite height**. In a parent that sizes to its content the pattern
  collapses - pass \`height\` or \`aspectRatio\` instead.
- The React component is a **client component** (it registers a browser custom
  element on import). In the Next.js App Router, render it from a client
  boundary or rely on its built-in placeholder until it mounts.
- Measured fits (\`grid\`, \`cover\`) mount **asynchronously**, after
  the first ResizeObserver tick. With the core API, drive the controller from
  \`onReady\`, not immediately after \`createPattern()\`.
- In a CSS grid, give tracks \`minmax(0, 1fr)\` rather than \`1fr\` so they can
  shrink when the container narrows.

### Fit modes

No fit distorts the pattern - nothing is ever scaled by a different factor
horizontally than vertically.

- \`grid\` (the default) - re-derives the cell grid from the measured box, so
  cells stay near-square at any box shape.
- \`cover\` - draws at a fixed resolution and scales it uniformly to fill the
  box, preserving the proportions of fixed-px strokes and shadows.
- \`fixed\` - renders at an explicit canvas size (default 360x540).

There is no per-design fit metadata: every design is cell-tiled and supports
all three.

## Recipes

**Hero background** - the pattern sits behind content, so it must not own the
layout. Absolutely position it and keep the copy above it:

\`\`\`tsx
<section style={{ position: 'relative' }}>
  <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
    <TabbiedPattern pattern={radius} seed="k9Pz" />
  </div>
  <h1>Copy goes here</h1>
</section>
\`\`\`

Pick a \`density: "sparse"\` design (or lower its \`frequency\` option) and a
palette whose background contrasts with the text.

**Section divider** - a short full-width band between sections:

\`\`\`tsx
<TabbiedPattern pattern={radius} height={120} aria-hidden />
\`\`\`

**Card texture** - a dense, fine design at low height variance; give the card
\`overflow: hidden\` and the pattern \`position: absolute; inset: 0\` behind the
card body, or use it as a header strip with \`height={80}\`.

**Transparent background** - pass a palette whose first color is
\`'transparent'\` (or an 8-digit hex ending \`00\`); the inks then composite
over whatever is behind the element.

**Static HTML, no build step** - see "Declarative mounting" below; the
data-* attributes plus one \`hydratePatterns()\` call are the whole
integration.

**Deterministic video frames** - render a PNG sequence and hand it to
ffmpeg/Remotion; the CLI cuts between seeds (no mid-transition blur):

\`\`\`bash
npx tabbied render radius --frames 120 --reseed-every 30 --size 1920x1080 --out frames/
ffmpeg -framerate 30 -i frames/frame-%03d.png -pix_fmt yuv420p out.mp4
\`\`\`

In Remotion, drive the same idea from \`useCurrentFrame()\`:
\`seed={'base-' + Math.floor(frame / 30)}\` re-renders the arrangement every
30 frames; keep \`redrawInterval\` unset and let the seed prop do the work.

## Share links (the Tabbied editor)

Every design has an editor page whose URL round-trips its full
configuration - hand one to a user to let them tweak your pick by hand:

\`\`\`
${SITE}/patterns/<slug>/?seed=<seed>&palette=<color0>&palette=<color1>&...&aspectRatio=2:3&<optionId>=<value>
\`\`\`

\`palette\` repeats (background first, URL-encode the \`#\`), \`aspectRatio\` is
one of 2:3 | 3:4 | 1:1 | 4:3 | 3:2, and each design option appears under its
own id (\`grid=8x12\`, \`frequency=0.6\`). Unknown or out-of-range values fall
back to defaults, so a partial link is safe.

## Reduced motion

Under \`prefers-reduced-motion: reduce\` the controller suppresses both sources
of movement with no configuration: the \`redrawInterval\` timer never starts,
and the designs' own ~400ms cell transitions are muted, so any re-render cuts
to the new arrangement instead of morphing. That second half covers passive
motion - a resize re-derives the grid, so turning a phone would otherwise
animate every cell. The preference is observed, not read once, so toggling it
mid-session takes effect immediately. Nothing needs to be passed for this.

## Palettes and options

\`palette\` is an array of CSS colors with the **background first** (\`color0\`);
the rest are the inks. Each design declares \`colors: { min, max, default }\`
bounds; the catalog lists the authored palette for every design.

\`options\` is keyed by option id, and each design declares its own. Three
control types: \`ButtonSelectGroup\` (one of \`values\`), \`Slider\` (a number
within \`min\`/\`max\`), and \`ToggleSwitch\` (a boolean).

\`\`\`tsx
<TabbiedPattern
  pattern={radius}
  palette={['#0B1020', '#3E8BFF', '#3FFFB2']}
  options={{ grid: '8x12', frequency: 0.6 }}
/>
\`\`\`

## Core (framework-agnostic)

\`\`\`ts
import { createPattern } from 'tabbied';
import { radius } from 'tabbied/patterns';

const controller = createPattern(document.querySelector('#stage'), {
  pattern: radius,
  seed: 'k9Pz',
  onReady: async () => {
    controller.redraw();
    await controller.exportImage();
    const { svg } = await controller.exportSvg();
  },
});

// later: controller.destroy();
\`\`\`

The controller takes the same config the component takes as props (minus the
box props - the host element is yours to size, or run them through
\`resolveBoxStyle()\`). That includes \`redrawInterval\` and \`paused\`: the timer
and its reduced-motion, tab-visibility and viewport gates live in the
controller, so the vanilla API animates without reimplementing them.

\`\`\`js
const controller = createPattern(host, {
  pattern: radius,
  redrawInterval: 5200,
});
controller.update({ paused: true }); // holds the phase; resume with false
\`\`\`

### Declarative mounting

\`hydratePatterns()\` reads a config off \`data-*\` attributes, so a static HTML
page needs no build step and no component:

\`\`\`html
<div data-pattern="ortho" data-palette="transparent, #C9C8C1" data-fit="grid"
     data-redraw-interval="5200" style="width:100%;height:60vh"></div>
<script type="module">
  import { hydratePatterns } from 'https://esm.sh/tabbied';
  import { patterns } from 'https://esm.sh/tabbied/patterns';
  hydratePatterns({ patterns });
</script>
\`\`\`

Attributes: \`data-pattern\` (slug, required), \`data-seed\`, \`data-palette\`
(comma separated, background first), \`data-options\` (\`id: value\` pairs
separated by \`;\`), \`data-fit\`, \`data-cell-size\`, \`data-density\`,
\`data-width\`, \`data-height\`, \`data-cover-render\` (\`800x800\`),
\`data-redraw-interval\`, \`data-paused\`. Option values are
typed by the pattern's own metadata, so a numeric-looking
\`ButtonSelectGroup\` choice stays a string.

Options: \`root\` (scope the search), \`selector\`, \`defaults\`, \`onError\`.
Returns \`{ element, controller }\` per mounted pattern, and is idempotent.
\`patternConfigToAttributes()\` is the inverse - \`TabbiedPattern\` uses it, so a
server-rendered page already carries what \`hydratePatterns\` reads. Don't use
both on the same element.

## CLI

The package ships a \`tabbied\` bin - rendering without writing an app:

\`\`\`bash
npx tabbied render radius --seed k9Pz --size 1600x900 --out hero.svg
npx tabbied render bight --palette "#0B1020,#3E8BFF" --out banner.png
npx tabbied render radius --frames 120 --reseed-every 30 --out frames/
npx tabbied list --good-for hero-background --density sparse
npx tabbied info radius
\`\`\`

Rendering runs css-doodle in a headless browser via whatever Playwright the
project already has (\`playwright\`, \`playwright-core\`, or
\`@playwright/test\`); pass \`--browser <path>\` (or set \`TABBIED_CHROMIUM\`) to
use a specific Chromium binary. \`--out\`'s extension picks SVG or PNG; the
4 \`[no SVG]\` designs below render as PNG only.

## SVG export

\`exportSvg()\` produces a **native vector SVG** (real \`<rect>\`/\`<path>\`/gradient
elements, no \`<foreignObject>\`), resolving with
\`{ svg, width, height, warnings }\`. Pass \`{ download: true }\` to save a file.
The converter (~21 KB gzipped) is loaded on demand, so apps that never export
pay nothing.

Call \`supportsSvgExport(pattern)\` before offering the option: ${
    designs.filter((design) => !design.svgExport.supported).length
  } designs paint
smooth conic sweeps that SVG cannot represent and are marked unsupported below.
Designs with partial limitations carry a note (filter-based effects that
browsers render correctly but design tools may import imperfectly); surface
those to the user before downloading. Unsupported CSS throws
\`SvgExportUnsupportedError\` rather than emitting a wrong file.

## Designs

${count} presets. Import by slug from \`tabbied/patterns\`:
\`import { <slug> } from 'tabbied/patterns'\`. Options, palettes, previews, and
per-design detail are in ${SITE}/catalog.json; preview images live at
${SITE}/previews/<slug>.webp.

Legend: \`[no SVG]\` cannot export to SVG; \`[SVG note]\` exports with a
documented limitation. The bracketed suffix is \`[density; tags]\`.
`;

  const designLine = (design) => {
    const flags = [];
    if (!design.svgExport.supported) flags.push('[no SVG]');
    else if (
      design.svgExport.note ||
      design.options.some((option) => option.svgExportNote)
    ) {
      flags.push('[SVG note]');
    }

    const description = design.description ?? `The ${design.name} design.`;
    const suffix = flags.length ? ` ${flags.join(' ')}` : '';
    const metadata = design.tags
      ? ` [${design.density}; ${design.tags.join(', ')}]`
      : '';

    return `- \`${design.slug}\` - ${design.name}. ${description}${metadata}${suffix}`;
  };

  const llmsFull = `${apiReference}
${designs.map(designLine).join('\n')}
`;

  return { llms, llmsFull };
}

// Run as a script (part of the package build): write the package's own
// llms.txt - the full text, since in node_modules it's the only file an
// agent will find, and a fetch of the site may never happen.
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const packageRoot = path.dirname(
    path.dirname(fileURLToPath(import.meta.url))
  );
  const catalog = JSON.parse(
    await readFile(path.join(packageRoot, 'catalog.json'), 'utf-8')
  );
  const { llmsFull } = buildLlmsTexts(catalog);
  await writeFile(path.join(packageRoot, 'llms.txt'), llmsFull);
  console.log(
    `generate-llms: wrote llms.txt (${Math.round(Buffer.byteLength(llmsFull) / 102.4) / 10} KB) for ${catalog.count} designs`
  );
}
