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

## React

```tsx
import { TabbiedArtwork, type TabbiedArtworkHandle } from 'tabbied/react';
import { useRef } from 'react';

export function Example() {
  const ref = useRef<TabbiedArtworkHandle>(null);

  return (
    <>
      <TabbiedArtwork
        ref={ref}
        artwork="radius"
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

The component is a client component (it registers a browser custom element on
import), so in the Next.js App Router render it from a client boundary or rely
on its built-in measurable placeholder until it mounts.

### Common props

| Prop      | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `artwork` | Preset slug (e.g. `"radius"`) or a full `ArtworkDefinition` object.          |
| `seed`    | Pattern seed. Omit for a random seed per mount; reseed via the handle.       |
| `palette` | Active colors, background (`color0`) first. Defaults to the preset palette.  |
| `options` | Option values keyed by option id; unset options use authored defaults.       |
| `fit`     | `grid` (default), `stretch`, `cover`, `contain`, or `fixed`.                 |

See the inline JSDoc on `TabbiedArtworkProps` for the full list.

## Core (framework-agnostic)

```ts
import { createArtwork, artworks } from 'tabbied';

const el = document.querySelector('#stage')!;
const controller = createArtwork(el, { artwork: 'radius', seed: 'k9Pz' });

controller.redraw();        // re-randomize the seed
await controller.exportImage();
controller.destroy();

console.log(Object.keys(artworks)); // every available design slug
```

## License

MIT © Sy Hong and Ye Joo Park
