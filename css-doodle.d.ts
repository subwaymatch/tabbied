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
  /**
   * Seed for the pattern's PRNG. Passed as `data-seed` (which css-doodle's
   * generate() falls back to) instead of the observed `seed` attribute: a
   * `seed` attribute change makes css-doodle rebuild every cell element from
   * scratch, which kills CSS transitions. Seed changes are applied through
   * update() instead, so cells persist and transitions can animate.
   */
  'data-seed'?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'css-doodle': CssDoodleProps;
    }
  }
}
