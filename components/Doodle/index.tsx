'use client';

import { useEffect, type RefObject } from 'react';
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
  // css-doodle >= 0.5 no longer re-reads the element's text content on a bare
  // update(), so pass the current source explicitly whenever the rules,
  // palette, or seed change to make sure the grid is regenerated.
  useEffect(() => {
    doodleRef.current?.update?.(doodleCode);
  }, [doodleRef, doodleCode, styleCode, seed]);

  return (
    <div>
      <style>{`css-doodle#${name} { ${styleCode} }`}</style>

      <css-doodle id={name} seed={seed} use="var(--rule)" ref={doodleRef}>
        {doodleCode}
      </css-doodle>
    </div>
  );
}
