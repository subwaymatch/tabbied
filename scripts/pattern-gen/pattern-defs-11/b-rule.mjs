// B. Rule - stripe fields. Pitch, duty, angle, phase.
//
// A repeating-linear-gradient used as a mask is the cheapest real drawing in
// CSS and one of the most exact things the SVG converter does: the whole run
// becomes one gradient with spreadMethod="repeat", so a hundred stripes cost
// what two cost and land on the sub-pixel positions the browser used.
//
// The variables are few and the results are not: how wide the rule is, how
// much of the period it fills, which way it runs, where in the period it
// starts, and whether a second field is laid over the first at another phase.
import { section, A, B, F, TR, ink, slot1, R2 } from './shared.mjs';

const { add, all } = section('B. Rule');

// A striped cell: one ink, cut into rules.
const ruled = (c, angle, on, period) =>
  `background: ${ink(c)}; ${slot1(angle, on, period)}`;

add(
  'Corduroy',
  'Wide ribs with a narrow channel between them - nearly solid, but not quite.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '22%', '28%')} }${TR}` }),
  { pal: 19 }
);

add(
  'Ribline',
  'The rules turn a quarter from cell to cell, so the sheet reads as woven rather than lined.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '14%', '28%')} }${TR}` }),
  { pal: 41 }
);

add(
  'Blindfold',
  'Half the cells rule across and half rule down, and nothing says which is which.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '10%', '20%')} }${TR}` }),
  { pal: 15 }
);

export const sectionB = { title: 'B. Rule', all };
