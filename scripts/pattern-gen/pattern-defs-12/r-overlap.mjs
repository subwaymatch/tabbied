// R. Overlap - two shapes crossing, and what the crossing does.
//
// A pair of shapes, and the interest is in the third region they make: the
// part where both of them are, which reads as its own colour because the upper
// one is let down rather than opaque.
//
// `opacity` is the property doing the work, and it exports exactly - it becomes
// a group attribute. What is deliberately *not* here is mix-blend-mode: it
// exports as an SVG blend style, the least portable thing the converter emits,
// and it carries a caveat in the catalogue.
import { section, A, B, F, TR, ink, rot, R4, c1 } from './shared.mjs';

const { add, all } = section('R. Overlap');

/** Two shapes, the second let down so the crossing reads as a third colour. */
const pair = (first, second, turns = R4, alpha = '0.72') =>
  `--rot: ${turns}; ${F} { ${B(first)} ${A(`${second} opacity: ${alpha};`)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Overbar',
  'Two long bars fanned from a common corner, the upper one let down over it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 10%; right: 44%; top: 10%; bottom: 10%; background: ${c1}; ${rot('-18deg')}`)} ${A(`left: 44%; right: 10%; top: 10%; bottom: 10%; background: ${ink(c, 2)}; ${rot('18deg')} opacity: 0.74;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71 }
);

export const sectionR = { title: 'R. Overlap', all };
