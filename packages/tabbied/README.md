# tabbied

Generative patterns as data: a framework-agnostic core plus a React component,
powered by [css-doodle](https://css-doodle.com/). Render any of Tabbied's
preset designs (or your own definition) at any size, reseed them, and export
them to PNG.

Try the designs at [tabbied.com](https://tabbied.com).

## Install

```bash
npm install tabbied
```

React is an **optional** peer dependency - you only need it for the `tabbied/react`
entry point. The core works in any framework (or none).

## Entry points

| Import             | What it provides                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- |
| `tabbied`          | The framework-agnostic core: `createPattern`, sizing/seed helpers, and the type definitions. |
| `tabbied/react`    | The `TabbiedPattern` React component (and its handle/prop types).                       |
| `tabbied/patterns` | The preset `PatternDefinition`s (import individually) plus the full `patterns` record.  |
| `tabbied/catalog.json` | Every design as data - description, palette, options, SVG-export support. See [Finding a design](#finding-a-design). |

## Finding a design

The presets are referenced by slug, and there are a lot of them - the slug
alone (`cleat`, `gnomonwedge`, `karst`) won't tell you what a design looks
like. `catalog.json` is the searchable index: one entry per design with a
description, closed-vocabulary `tags` / `mood` / `density` / `goodFor`
metadata to filter on, the authored palette, every option and its accepted
values, whether it exports to SVG, and a stable `preview` image URL
(`https://tabbied.com/previews/<slug>.webp`) so you can look before you pick.

```js
// Bundlers (Vite, webpack, Next) import JSON directly. In native Node ESM,
// add the import attribute: `with { type: 'json' }`.
import catalog from 'tabbied/catalog.json';

const heroCandidates = catalog.designs.filter(
  (design) =>
    design.goodFor.includes('hero-background') && design.density === 'sparse'
);
```

Or from a shell, without writing any code:

```bash
npx tabbied list --tag dots --density dense
npx tabbied info radius
```

The same data is served at
**[tabbied.com/catalog.json](https://tabbied.com/catalog.json)**, alongside
[llms.txt](https://tabbied.com/llms.txt) and
[llms-full.txt](https://tabbied.com/llms-full.txt) - an API contract plus a
one-line entry per design, sized to fit in one fetch. If you are pointing a
coding assistant at this package, give it that URL.

## React

```tsx
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
```

### SVG export

`exportSvg()` converts the rendered pattern to a **native vector SVG** - real
`<rect>`/`<path>`/gradient elements, no `<foreignObject>` - so the file opens
in design tools and scales to any resolution. It resolves with
`{ svg, width, height, warnings }`; pass `{ download: true }` to also save a
`.svg` file. A few designs paint smooth conic-gradient sweeps that SVG cannot
represent - they set `svgExport: false` on their definition, and
`supportsSvgExport(pattern)` tells you whether to offer the option. Effects
exported through SVG filters (blur, glow shadows, blend modes) render
correctly in browsers but may degrade when imported into design tools; such
cases are listed in `warnings`.

Designs with known export limitations describe them in
`pattern.svgExportNote` (and, for limitations introduced by a toggle option
such as a filter-based shadow, `option.svgExportNote`) - surface these to the
user before downloading, the way the Tabbied editor's confirmation dialog
does.

The converter itself (~21 KB gzipped) is **not** part of the main bundle:
`exportSvg()` loads it on demand via a dynamic import, so apps that never
export pay nothing for the feature. To call the converter directly (e.g. on a
`<css-doodle>` you manage yourself), import it from the subpath:

```ts
import { doodleToSvg } from 'tabbied/svg-export';
```

### Importing presets (tree-shaking)

`pattern` takes a `PatternDefinition` object. Import only the presets you
actually render from `tabbied/patterns` and your bundler ships just those -
not the entire catalog:

```tsx
import { radius, windowpane } from 'tabbied/patterns';
```

Each preset is a side-effect-free named export, so unused ones are dropped at
build time. Need the whole set (e.g. to build a gallery)? Import the `patterns`
record - `import { patterns } from 'tabbied/patterns'` - and accept that it
pulls in every design.

The component is a client component (it registers a browser custom element on
import), so in the Next.js App Router render it from a client boundary or rely
on its built-in measurable placeholder until it mounts.

### Common props

| Prop      | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `pattern` | A `PatternDefinition` - import a preset from `tabbied/patterns` or pass your own. |
| `seed`    | Randomization seed. Omit for a random seed per mount; reseed via the handle.       |
| `palette` | Active colors, background (`color0`) first. Defaults to the preset palette.  |
| `options` | Option values keyed by option id; unset options use authored defaults.       |
| `fit`     | How the drawing meets its box: `grid` (default), `cover`, or `fixed`. |
| box props | How big the box is: `fill`, `width`, `height`, `maxWidth`, `maxHeight`, `aspectRatio`. |

See the inline JSDoc on `TabbiedPatternProps` for the full list.

### Sizing the box

A pattern has no intrinsic size, so it takes the size of the box you give it.
By default that box **fills its containing block** - drop one into a sized
parent and you're done:

```tsx
// .panel is 100% wide and 400px tall; the pattern fills it.
<div className="panel">
  <TabbiedPattern pattern={radius} />
</div>
```

| Prop           | Type               | Default | Description                                                     |
| -------------- | ------------------ | ------- | --------------------------------------------------------------- |
| `fill`         | `boolean`          | `true`  | `width: 100%; height: 100%`. `fill={false}` leaves sizing to CSS. |
| `width`        | `number \| string` | -       | Box width. Numbers are px. Overrides `fill` on that axis.        |
| `height`       | `number \| string` | -       | Box height. Numbers are px. Overrides `fill` on that axis.       |
| `maxWidth`     | `number \| string` | -       | Upper bound on the width.                                        |
| `maxHeight`    | `number \| string` | -       | Upper bound on the height.                                       |
| `aspectRatio`  | `number \| string` | -       | CSS `aspect-ratio`, e.g. `3 / 2`. Derives the height from the width. |

```tsx
// Fill the width, cap it, and let the ratio set the height.
<TabbiedPattern pattern={radius} maxWidth={960} aspectRatio={3 / 2} />

// Full-bleed banner.
<TabbiedPattern pattern={radius} height="40vh" />

// Sized by a class name instead.
<TabbiedPattern pattern={radius} fill={false} className="hero-art" />
```

Mixing them works the way the CSS does - they *are* the CSS, resolved onto the
wrapper element (server render included, so there's no layout shift on mount).
One caveat comes with the territory: `height: 100%` only resolves against a
parent with a definite height. In a parent that sizes to its content, reach for
`height` or `aspectRatio` instead of `fill`.

With the core API the host element is yours, so size it however you like - or
run the same props through the same helper:

```js
import { resolveBoxStyle } from 'tabbied';

Object.assign(host.style, resolveBoxStyle({ maxWidth: 960, aspectRatio: 3 / 2 }));
```

### Fit modes

`fit` says how the drawing meets the box. **No fit distorts the pattern** -
nothing is ever scaled by a different factor horizontally than vertically.

- `grid` (default) - re-derives the cell grid from the measured box: whole,
  near-square cells edge to edge at any box shape.
- `cover` - draws a fixed-resolution render and scales it uniformly to fill the
  box (preserving the proportions of fixed-px strokes and shadows). The render
  follows the box's aspect ratio and re-derives its grid, so the pattern is
  never cut off mid-cell.
- `fixed` - renders at an explicit canvas size (`width`/`height` in px, default
  360 × 540). This is what the Tabbied editor uses.

Every design supports all three, so `fit` is a plain choice - omit it and you
get `grid`.

## Core (framework-agnostic)

```ts
import { createPattern } from 'tabbied';
import { radius } from 'tabbied/patterns';

const el = document.querySelector('#stage')!;
const controller = createPattern(el, {
  pattern: radius,
  seed: 'k9Pz',
  // Measured fits (grid/cover) mount asynchronously, after the first
  // ResizeObserver tick delivers the host's size - drive the controller from
  // onReady rather than immediately after createPattern().
  onReady: async () => {
    controller.redraw(); // re-randomize the seed
    await controller.exportImage();
    const { svg } = await controller.exportSvg(); // native vector SVG
  },
});

// later: controller.destroy();
```

The controller accepts the same config the React component takes as props,
minus the box props - the host element is yours to size (or run them through
`resolveBoxStyle`, above). That includes the ambient-redraw timer, so the
framework-free API animates without reimplementing it:

```js
const controller = createPattern(host, {
  pattern: radius,
  redrawInterval: 5200, // reseed every 5.2s, morphing via the authored transitions
});

// Hold the ticks without losing the redraw phase; resume with `false`.
controller.update({ paused: true });
```

`redrawInterval` drops ticks while the tab is hidden or the host is scrolled
out of view - a page of animated patterns only pays for the ones somebody is
looking at.

### Reduced motion

Under `prefers-reduced-motion: reduce` the controller suppresses **both**
sources of movement, with no configuration:

- the `redrawInterval` timer never starts, and
- the designs' own cell transitions are muted, so anything that re-renders
  cuts to the new arrangement instead of morphing into it.

The second half matters more than it sounds. Every design carries a ~400ms
`transition`, and a re-render is not always something the reader asked for: a
resize re-derives the grid, so turning a phone or dragging a window animates
every cell on the page. That is the passive motion the preference exists for.
A `redraw()` you call yourself is muted on the same terms.

Nothing is lost - the pattern renders identically, it just stops easing
between states. The preference is *observed*, not read once, so toggling it
while the page is open takes effect immediately.

### Declarative mounting (no build step)

`hydratePatterns()` reads a pattern's config off plain `data-*` attributes,
so a static HTML page can describe its patterns in the markup and bring them
all up with one call:

```html
<div data-pattern="ortho"
     data-palette="transparent, #C9C8C1, #8E8E88"
     data-fit="grid"
     data-cell-size="132"
     data-redraw-interval="5200"
     style="width: 100%; height: 60vh"></div>

<script type="module">
  import { hydratePatterns } from 'https://esm.sh/tabbied';
  import { patterns } from 'https://esm.sh/tabbied/patterns';

  hydratePatterns({ patterns });
</script>
```

The attributes are readable rather than a JSON blob - the point is that
somebody editing a page can change a colour or a slug without decoding
anything. Values are typed by the pattern's own option metadata, so a
`ButtonSelectGroup` choice that looks numeric stays a string.

| Attribute | Config field |
| --- | --- |
| `data-pattern` | The preset slug. Required - everything else is optional. |
| `data-seed` | `seed` |
| `data-palette` | `palette` - comma separated, background first. Splits at top level, so `rgb(0, 0, 0)` survives. |
| `data-options` | `options` - `id: value` pairs separated by `;` |
| `data-fit` | `fit` |
| `data-cell-size` / `data-density` | `cellSize` / `density` |
| `data-width` / `data-height` | `fixed` canvas size in px |
| `data-cover-render` | `coverRender` - `800x800` |
| `data-redraw-interval` / `data-paused` | `redrawInterval` / `paused` |

Pass `root` to scope the search to a subtree, `selector` to override
`[data-pattern]`, and `defaults` to merge a config into every match.
`hydratePatterns` returns `{ element, controller }` for each pattern it
mounted, and is idempotent - calling it twice won't double-mount.

An unknown slug is reported through `onError` (a `console.warn` by default)
and skipped, and an attribute that doesn't parse falls back to the design's
authored default: a hand-edited template degrades to the pattern's defaults
rather than to a blank box.

`patternConfigToAttributes()` is the inverse, for generating such markup.
`TabbiedPattern` uses it on its own placeholder, so a server-rendered React
page already emits everything `hydratePatterns` needs - which is what lets a
prerendered page be repackaged as a framework-free template.

> Use one or the other on a given element: `TabbiedPattern` mounts its own
> controller, so an unscoped `hydratePatterns()` on a React page would mount a
> second one on top of it. That's what `root` is for.

## CLI

The package ships a `tabbied` bin for rendering without writing an app -
generate an asset, or a video-ready frame sequence, straight from a shell:

```bash
npx tabbied render radius --seed k9Pz --size 1600x900 --out hero.svg
npx tabbied render bight --palette "#0B1020,#3E8BFF" --out banner.png
npx tabbied render radius --frames 120 --reseed-every 30 --size 1920x1080 --out frames/
npx tabbied list --good-for hero-background --density sparse
npx tabbied info radius
```

Rendering runs css-doodle in a headless browser via whatever Playwright the
project already has (`playwright`, `playwright-core`, or `@playwright/test`) -
install one of those if none is present, and pass `--browser <path>` (or set
`TABBIED_CHROMIUM`) to use a specific Chromium binary. `--out`'s extension
picks the format; frame sequences are PNG, cut deterministically between
seeds (frames within a reseed window are identical, so encoders can
deduplicate). Run `npx tabbied --help` for every flag.

## For AI agents

`AGENTS.md` and `llms.txt` ship in this package - the latter is the complete
agent-facing reference (also served at
[tabbied.com/llms-full.txt](https://tabbied.com/llms-full.txt)). Point your
coding assistant at either.

## License

MIT © Sy Hong and Ye Joo Park
