'use client';

import 'css-doodle';

// The Tabbied logo as a live css-doodle: a 3x3 grid of quarter-circle tiles
// reproducing public/images/logo_tabbied_v3.svg. Cells are numbered row by
// row, and @pn (pick-by-turn) hands each cell its entry from the two lists
// below, so tile N's color and rounded corner stay paired. To make the logo
// dynamic later, randomize these lists (e.g. swap @pn for @p) or vary them per
// seed — the grid itself never needs to change.
//
//   tile:   1 pink      2 green     3 (empty)
//           4 charcoal  5 blue      6 pink
//           7 (empty)   8 navy      9 cyan
const LOGO_DOODLE = `
  :doodle {
    @grid: 3x3 / 100%;
  }
  background: @pn(
    #FF3D8B, #3FFFB2, transparent,
    #232529, #3E8BFF, #FF3D8B,
    transparent, #275AA6, #3EECFF
  );
  border-radius: @pn(
    0 100% 0 0, 100% 0 0 0, 0,
    0 0 0 100%, 0 0 100% 0, 100% 0 0 0,
    0, 0 100% 0 0, 0 0 100% 0
  );
`;

export default function LogoDoodleInner() {
  return <css-doodle aria-hidden="true">{LOGO_DOODLE}</css-doodle>;
}
