// K. Overlap - two shapes crossing, and what the crossing does.
//
// A pair of shapes, and the interest is in the third region they make: the
// part where both of them are, which reads as its own colour because the upper
// one is let down rather than opaque.
//
// opacity is the property doing the work, and it exports exactly - it becomes
// a group attribute. What is deliberately *not* here is mix-blend-mode: it
// exports as an SVG blend style, the least portable thing the converter emits,
// and it carries a caveat in the catalogue.
import { section, A, B, F, TR, ink, rot, R4, c1 } from './shared.mjs';

const { add, all } = section('K. Overlap');

add(
  'Fanned',
  'Two long shapes fanned from a common corner.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 12%; right: 46%; top: 8%; bottom: 8%; background: ${c1}; ${rot('-22deg')}`)} ${A(`left: 46%; right: 12%; top: 8%; bottom: 8%; background: ${ink(c, 2)}; ${rot('22deg')} opacity: 0.78;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 24 }
);

export const sectionK = { title: 'K. Overlap', all };
