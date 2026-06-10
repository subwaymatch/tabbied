'use client';

import { useEffect, useRef, type RefObject } from 'react';
import 'css-doodle';

type DoodleProps = {
  name: string;
  seed?: string;
  styleCode: string;
  doodleCode: string;
  doodleRef: RefObject<any>;
};

export default function Doodle({
  name,
  seed = '0000',
  styleCode,
  doodleCode,
  doodleRef,
}: DoodleProps) {
  const renderedSource = useRef<string | null>(null);

  // css-doodle renders the element's text content on mount; afterwards every
  // change — rules, palette or seed — is pushed through update(), which swaps
  // the generated stylesheet in place when the grid is unchanged, so cells
  // persist and the artworks' CSS transitions animate between the two states.
  // The seed rides on the unobserved `data-seed` attribute (generate() falls
  // back to it): changing the observed `seed` attribute instead would make
  // css-doodle rebuild every cell element, killing any transition. css-doodle
  // >= 0.5 no longer re-reads the text content on a bare update(), so pass
  // the current source explicitly.
  useEffect(() => {
    const source = JSON.stringify([styleCode, doodleCode, seed]);

    if (renderedSource.current !== null && renderedSource.current !== source) {
      doodleRef.current?.update?.(doodleCode);
    }

    renderedSource.current = source;
  }, [doodleRef, doodleCode, styleCode, seed]);

  return (
    <div>
      <style>{`css-doodle#${name} { ${styleCode} }`}</style>

      <css-doodle id={name} data-seed={seed} use="var(--rule)" ref={doodleRef}>
        {doodleCode}
      </css-doodle>
    </div>
  );
}
