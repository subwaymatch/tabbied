// A. Shore - land held against an edge, and the water that shapes it.
//
// Every design starts from a slab of ground pushed up against one side of the
// cell and asks what the sea does to it: bites a bay out of its seaward edge,
// parts around an islet, leaves a bar lying offshore, or faces a second shore
// across open water. Everything is a hard-stop radial or linear layer used as
// a mask over one ink, so the water is a real hole - set the background slot
// to transparent and the sheet shows through every inlet.
//
// `farthest-side` radials are what keep the geometry honest at the edge: a
// stop at 100% means "one cell side" wherever the centre sits, where the
// default `farthest-corner` would quietly rescale as the centre moved.
import {
  section,
  F,
  TR,
  rot,
  faded,
  both,
  discL,
  bandFS,
  boreFS,
  bandLin,
  slabLin,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('A. Shore');

/** One ink cut by the layers, turned a quarter at a time. */
const turned = (decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Bight',
  'A slab of shore with one round bay bitten out of its seaward edge.',
  (c) => ({
    rule: turned(both(c, slabLin('180deg', '62%'), boreFS('28%', '50% 62%'))),
  }),
  { pal: 7 }
);

add(
  'Eyot',
  'A river islet held between two straight banks.',
  (c) => ({
    rule: turned(
      faded(c, slabLin('90deg', '18%'), slabLin('270deg', '18%'), discL('20%')),
      R2
    ),
  }),
  { pal: 58 }
);

add(
  'Strand',
  'The beach as a slab against one edge, with a sandbar lying offshore of it.',
  (c) => ({
    rule: turned(faded(c, slabLin('180deg', '30%'), bandLin('180deg', '46%', '58%'))),
  }),
  { pal: 23 }
);

add(
  'Sound',
  'Two facing shores and the wide water held between them.',
  (c) => ({
    rule: turned(faded(c, slabLin('90deg', '24%'), slabLin('270deg', '24%')), R2),
  }),
  { pal: 62 }
);

add(
  'Spit',
  'A bar of land curving out from the shore across the water.',
  (c) => ({
    rule: turned(faded(c, slabLin('90deg', '20%'), bandFS('58%', '80%', '0% 100%'))),
  }),
  { pal: 76 }
);

export const sectionA = { title: 'A. Shore', all };
