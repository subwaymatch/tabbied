// I. Split - one cut across the cell, with an ink either side of it.
//
// Where section A softens a boundary until it stops being one, this section
// keeps it: a straight edge, and the two inks it separates. The variety is in
// where the cut lands, how far it leans, and whether the two parts meet, miss,
// or leave a third thing between them.
//
// Neither of these butts two clipped shapes edge to edge - one leaves a
// channel of ground between the halves, the other stands a single shape on
// clear ground. One anti-aliased edge instead of two abutting ones is both the
// better drawing and the better export: abutting AA edges are exactly where a
// vector renderer and a CSS painter disagree.
import { section, A, B, F, TR, cp, ink, poly, rot, R2 } from './shared.mjs';

const { add, all } = section('I. Split');

add(
  'Twohalf',
  'Two blocks with a channel of ground left open between them.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`left: 0; width: 44%; top: 0; bottom: 0; background: ${ink(c)};`)} ${A(`right: 0; width: 44%; top: 0; bottom: 0; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Sheared',
  'A parallelogram leaning across the cell, with ground either side of it.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${A(`inset: 0; background: ${ink(c)}; ${cp(poly([[6, 0], [64, 0], [94, 100], [36, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

export const sectionI = { title: 'I. Split', all };
