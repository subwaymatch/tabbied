// E. Bloom - the ramp run outwards from a point instead of across the cell.
//
// A radial-gradient mask is a glow with none of the machinery of one: no
// blur, no shadow, no filter - just stops on a circle. That matters here more
// than anywhere else in the batch, because a glow is exactly the effect the
// catalogue already had four caveated designs for (`bokeh`, `neon`, `lantern`,
// `terrain` all reach for box-shadow or blur and all carry an svgExportNote).
// Written as stops it exports as a <radialGradient> and needs no note at all.
//
// The light here is thrown from a corner rather than the middle, so each cell
// catches a different part of the falloff as the quarter turn moves the source
// around.
import { section, A, F, TR, rot, faded, R4 } from './shared.mjs';

const { add, all } = section('E. Bloom');

/** One that does - anything anchored off the middle of the cell. */
const turned = (c, layer, turns = R4) =>
  `--rot: ${turns}; ${F} { ${faded(c, layer)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Radiance',
  'The light comes from one corner of the cell rather than the centre of it.',
  (c) => ({
    rule: turned(c, 'radial-gradient(circle at 0% 100%, #000 0%, transparent 82%)'),
  }),
  { pal: 45 }
);

export const sectionE = { title: 'E. Bloom', all };
