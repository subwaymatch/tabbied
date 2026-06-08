import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * `<css-doodle>` is a browser custom element registered at runtime by the
 * `css-doodle` package. Declare it so it can be used in JSX/TSX. The element
 * also exposes imperative `update()` / `export()` methods at runtime, which we
 * reach through an `any`-typed ref where needed.
 */
type CssDoodleProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  use?: string;
  seed?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'css-doodle': CssDoodleProps;
    }
  }
}
