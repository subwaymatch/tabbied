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

  // css-doodle renders the element's text content on mount and re-renders by
  // itself when the observed `seed` attribute changes, so an explicit update()
  // is only needed when the source (rules or palette) changes afterwards —
  // anything more would regenerate every grid twice. css-doodle >= 0.5 no
  // longer re-reads the text content on a bare update(), so pass the current
  // source explicitly.
  useEffect(() => {
    const source = `${styleCode}\u0000${doodleCode}`;

    if (renderedSource.current !== null && renderedSource.current !== source) {
      doodleRef.current?.update?.(doodleCode);
    }

    renderedSource.current = source;
  }, [doodleRef, doodleCode, styleCode]);

  return (
    <div>
      <style>{`css-doodle#${name} { ${styleCode} }`}</style>

      <css-doodle id={name} seed={seed} use="var(--rule)" ref={doodleRef}>
        {doodleCode}
      </css-doodle>
    </div>
  );
}
