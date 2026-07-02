# tabbied

Generative artworks as data: a framework-agnostic core plus a React component,
powered by [css-doodle](https://css-doodle.com/). Render any of Tabbied's
preset designs (or your own definition) at any size, reseed them, and export
them to PNG.

Try the designs at [tabbied.com](https://tabbied.com).

## Install

```bash
npm install tabbied
```

React is an **optional** peer dependency — you only need it for the `tabbied/react`
entry point. The core works in any framework (or none).

## Entry points

| Import             | What it provides                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- |
| `tabbied`          | The framework-agnostic core: `createArtwork`, sizing/seed helpers, and the type definitions. |
| `tabbied/react`    | The `TabbiedArtwork` React component (and its handle/prop types).                       |
| `tabbied/artworks` | The preset `ArtworkDefinition`s (import individually) plus the full `artworks` record.  |

## React

```tsx
import { TabbiedArtwork, type TabbiedArtworkHandle } from 'tabbied/react';
import { radius } from 'tabbied/artworks';
import { useRef } from 'react';

export function Example() {
  const ref = useRef<TabbiedArtworkHandle>(null);

  return (
    <>
      <TabbiedArtwork
        ref={ref}
        artwork={radius}
        seed="k9Pz"
        fit="cover"
        style={{ width: '100%', height: 320 }}
      />
      <button onClick={() => ref.current?.redraw()}>Redraw</button>
      <button onClick={() => ref.current?.exportImage()}>Export PNG</button>
    </>
  );
}
```

### Importing presets (tree-shaking)

`artwork` takes an `ArtworkDefinition` object. Import only the presets you
actually render from `tabbied/artworks` and your bundler ships just those —
not the entire catalog:

```tsx
import { radius, symmetry } from 'tabbied/artworks';
```

Each preset is a side-effect-free named export, so unused ones are dropped at
build time. Need the whole set (e.g. to build a gallery)? Import the `artworks`
record — `import { artworks } from 'tabbied/artworks'` — and accept that it
pulls in every design.

The component is a client component (it registers a browser custom element on
import), so in the Next.js App Router render it from a client boundary or rely
on its built-in measurable placeholder until it mounts.

### Common props

| Prop      | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `artwork` | An `ArtworkDefinition` — import a preset from `tabbied/artworks` or pass your own. |
| `seed`    | Pattern seed. Omit for a random seed per mount; reseed via the handle.       |
| `palette` | Active colors, background (`color0`) first. Defaults to the preset palette.  |
| `options` | Option values keyed by option id; unset options use authored defaults.       |
| `fit`     | `grid` (default), `stretch`, `cover`, `contain`, or `fixed`.                 |

See the inline JSDoc on `TabbiedArtworkProps` for the full list.

### Fit modes

- `grid` (default) — adapts the cell grid to the measured container: whole,
  near-square cells edge to edge at any box shape.
- `cover` — draws a fixed-resolution render and scales it into the box
  (preserving the proportions of fixed-px strokes and shadows). For
  grid-driven artworks the render follows the box's aspect ratio and re-derives
  its grid, so the pattern is never cut off mid-cell; special layouts (e.g.
  Symmetry's centered composition) scale-and-crop instead.
- `contain` — letterboxes the fixed-resolution render at its authored ratio.
- `stretch` — keeps the authored grid and stretches it to fill; cells distort
  with the box, so prefer `grid` unless you specifically want that.
- `fixed` — renders at explicit `width`/`height` props.

## Core (framework-agnostic)

```ts
import { createArtwork } from 'tabbied';
import { radius } from 'tabbied/artworks';

const el = document.querySelector('#stage')!;
const controller = createArtwork(el, {
  artwork: radius,
  seed: 'k9Pz',
  // Measured fits (grid/cover/contain) mount asynchronously, after the first
  // ResizeObserver tick delivers the host's size — drive the controller from
  // onReady rather than immediately after createArtwork().
  onReady: async () => {
    controller.redraw(); // re-randomize the seed
    await controller.exportImage();
  },
});

// later: controller.destroy();
```

## License

MIT © Sy Hong and Ye Joo Park
