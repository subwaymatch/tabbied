// Unit tests for the pure computed-value parsers behind the native SVG
// export. Run with `npm test --workspace tabbied` (node --test). The DOM
// walker itself is covered by the Playwright parity suite
// (e2e/svg-export.spec.ts), which diffs rendered exports pixel-by-pixel.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { _internals } from '../dist/core/svgExport.js';
import { supportsSvgExport } from '../dist/core/types.js';

const {
  splitTopLevel,
  parseRgbColor,
  resolveLength,
  angleToDeg,
  parseTransformMatrix,
  roundedRectPath,
  sectorPath,
  parseConicSectors,
  parseBoxShadows,
  originBox,
  pseudoBoxFor,
} = _internals;

const rgb = (r, g, b, a = 1) => ({ r, g, b, a });
const normalize = (raw) => {
  const parsed = parseRgbColor(raw);
  assert.ok(parsed, `expected an rgb() color, got: ${raw}`);
  return parsed;
};

test('supportsSvgExport defaults to true and honors the flag', () => {
  assert.equal(supportsSvgExport({}), true);
  assert.equal(supportsSvgExport({ svgExport: true }), true);
  assert.equal(supportsSvgExport({ svgExport: false }), false);
});

test('splitTopLevel splits at top-level commas only', () => {
  assert.deepEqual(
    splitTopLevel('linear-gradient(rgb(1, 2, 3), red), none'),
    ['linear-gradient(rgb(1, 2, 3), red)', 'none']
  );
  assert.deepEqual(splitTopLevel('url("a,b"), c'), ['url("a,b")', 'c']);
});

test('parseRgbColor handles computed serializations', () => {
  assert.deepEqual(parseRgbColor('rgb(62, 139, 255)'), rgb(62, 139, 255));
  assert.deepEqual(parseRgbColor('rgba(0, 0, 0, 0.25)'), rgb(0, 0, 0, 0.25));
  assert.deepEqual(parseRgbColor('transparent'), rgb(0, 0, 0, 0));
  assert.equal(parseRgbColor('oklch(0.7 0.1 200)'), null);
});

test('resolveLength resolves percentages against the reference', () => {
  assert.equal(resolveLength('25%', 200), 50);
  assert.equal(resolveLength('12.5px', 999), 12.5);
});

test('resolveLength handles the patterns anti-aliasing calc() ramps', () => {
  // curl-style ramp: calc(42% - 0.5px)
  assert.equal(resolveLength('calc(42% - 0.5px)', 100), 41.5);
  assert.equal(resolveLength('calc(42% + 0.5px)', 100), 42.5);
  assert.equal(resolveLength('calc(10px + 25%)', 200), 60);
  assert.throws(
    () => _internals.resolveCalc('calc(100% / 3)', 100),
    /calc\(\) expression/
  );
});

test('angleToDeg converts every CSS angle unit', () => {
  assert.equal(angleToDeg('90deg'), 90);
  assert.equal(angleToDeg('0.25turn'), 90);
  assert.equal(angleToDeg('100grad'), 90);
  assert.ok(Math.abs(angleToDeg(`${Math.PI / 2}rad`) - 90) < 1e-9);
});

test('parseTransformMatrix accepts 2D matrices and flat matrix3d', () => {
  assert.equal(parseTransformMatrix('none'), null);
  assert.deepEqual(
    parseTransformMatrix('matrix(0, 1, -1, 0, 10, 20)'),
    [0, 1, -1, 0, 10, 20]
  );
  assert.deepEqual(
    parseTransformMatrix(
      'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1)'
    ),
    [1, 0, 0, 1, 5, 6]
  );
  assert.throws(
    () =>
      parseTransformMatrix(
        'matrix3d(1, 0, 0, 0, 0, 0.7, 0.7, 0, 0, -0.7, 0.7, 0, 0, 0, 0, 1)'
      ),
    /3D transform/
  );
});

test('roundedRectPath emits plain rects and clamped rounded corners', () => {
  const box = { x: 0, y: 0, w: 10, h: 10 };
  assert.equal(roundedRectPath(box, null, 3), 'M0 0H10V10H0Z');
  const radii = {
    tl: [5, 5],
    tr: [5, 5],
    br: [5, 5],
    bl: [5, 5],
  };
  const d = roundedRectPath(box, radii, 3);
  assert.match(d, /A5 5 0 0 1/);
});

test('sectorPath covers the expected quadrant', () => {
  // CSS bearing 0..90deg (up -> right, clockwise) is the top-right quadrant.
  const d = sectorPath(0, 0, 10, 0, 90, 3);
  assert.equal(d, 'M0 0L0 -10A10 10 0 0 1 10 0Z');
  // >180deg spans set the large-arc flag.
  assert.match(sectorPath(0, 0, 10, 0, 270, 3), /A10 10 0 1 1/);
});

test('parseConicSectors decomposes hard-stop conics (computed form)', () => {
  // glyph's quadrants, as serialized by getComputedStyle.
  const { sectors } = parseConicSectors(
    splitTopLevel(
      'rgb(62, 139, 255) 0deg, rgb(62, 139, 255) 90deg, rgb(62, 139, 255) 90deg, rgb(62, 139, 255) 180deg, rgb(255, 61, 139) 180deg, rgb(255, 61, 139) 270deg, rgb(62, 139, 255) 270deg, rgb(62, 139, 255) 360deg'
    ),
    normalize
  );
  assert.deepEqual(
    sectors.map((s) => [s.from, s.to, s.color.r]),
    [
      [0, 90, 62],
      [90, 180, 62],
      [180, 270, 255],
      [270, 360, 62],
    ]
  );
});

test('parseConicSectors handles from/at prefixes (mask sectors)', () => {
  const { cx, cy, sectors } = parseConicSectors(
    splitTopLevel(
      'from 312deg at 50% 100%, rgb(0, 0, 0) 0deg, rgb(0, 0, 0) 96deg, rgba(0, 0, 0, 0) 96deg, rgba(0, 0, 0, 0) 360deg'
    ),
    normalize
  );
  assert.equal(cx, '50%');
  assert.equal(cy, '100%');
  assert.deepEqual(
    sectors.map((s) => [s.from, s.to, s.color.a]),
    [
      [312, 408, 1],
      [408, 672, 0],
    ]
  );
});

test('parseConicSectors rejects smooth sweeps', () => {
  // wedge's independently-rolled stop positions leave a 70deg->180deg blend.
  assert.throws(
    () =>
      parseConicSectors(
        splitTopLevel(
          'from 135deg, rgb(0, 0, 0) 0deg, rgb(0, 0, 0) 70deg, rgba(0, 0, 0, 0) 180deg, rgba(0, 0, 0, 0) 360deg'
        ),
        normalize
      ),
    /smooth color sweep/
  );
  // coil/spectrum-style positionless color runs.
  assert.throws(
    () =>
      parseConicSectors(
        splitTopLevel('rgb(1, 2, 3), rgb(4, 5, 6), rgb(7, 8, 9)'),
        normalize
      ),
    /smooth color sweep/
  );
});

test('parseBoxShadows reads the computed serialization', () => {
  const shadows = parseBoxShadows(
    'rgb(62, 139, 255) 0px 0px 8.88889px 0px, rgba(0, 0, 0, 0.2) 1px 2px 40px 3px',
    normalize
  );
  assert.equal(shadows.length, 2);
  assert.deepEqual(shadows[0], {
    color: rgb(62, 139, 255),
    dx: 0,
    dy: 0,
    blur: 8.88889,
    spread: 0,
    inset: false,
  });
  assert.equal(shadows[1].spread, 3);
  assert.equal(shadows[1].color.a, 0.2);
  assert.equal(parseBoxShadows('none', normalize).length, 0);
  assert.equal(
    parseBoxShadows('rgb(0, 0, 0) 0px 0px 4px 0px inset', normalize)[0].inset,
    true
  );
});

test('originBox insets the background positioning area by the border', () => {
  const border = {
    borderLeftWidth: '7px',
    borderTopWidth: '7px',
    borderRightWidth: '7px',
    borderBottomWidth: '7px',
    paddingLeft: '4px',
    paddingTop: '4px',
    paddingRight: '4px',
    paddingBottom: '4px',
  };
  const box = { x: 0, y: 0, w: 60, h: 60 };

  // padding-box is the CSS default: percentage stops and sizes resolve
  // against the box inside the border, not the border box itself.
  assert.deepEqual(originBox(box, border, 'padding-box'), {
    x: 7,
    y: 7,
    w: 46,
    h: 46,
  });
  assert.deepEqual(originBox(box, border, 'content-box'), {
    x: 11,
    y: 11,
    w: 38,
    h: 38,
  });
  assert.deepEqual(originBox(box, border, 'border-box'), box);

  // A borderless box - every pattern that predates batch 11's frames - is
  // returned untouched, so nothing about those exports moves.
  const plain = {
    borderLeftWidth: '0px',
    borderTopWidth: '0px',
    borderRightWidth: '0px',
    borderBottomWidth: '0px',
    paddingLeft: '0px',
    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
  };
  assert.equal(originBox(box, plain, 'padding-box'), box);
});

// A host with a 7px border round a 60x60 cell, no padding: the padding box is
// the 46x46 square inside the border.
const BORDERED_HOST = {
  borderLeftWidth: '7px',
  borderTopWidth: '7px',
  borderRightWidth: '7px',
  borderBottomWidth: '7px',
  paddingLeft: '0px',
  paddingTop: '0px',
  paddingRight: '0px',
  paddingBottom: '0px',
};
const PLAIN_HOST = {
  borderLeftWidth: '0px',
  borderTopWidth: '0px',
  borderRightWidth: '0px',
  borderBottomWidth: '0px',
  paddingLeft: '0px',
  paddingTop: '0px',
  paddingRight: '0px',
  paddingBottom: '0px',
};
const CELL = { x: 0, y: 0, w: 60, h: 60 };
const absolute = (over) => ({
  position: 'absolute',
  left: 'auto',
  right: 'auto',
  top: 'auto',
  bottom: 'auto',
  width: 'auto',
  height: 'auto',
  marginLeft: '0px',
  marginTop: '0px',
  ...over,
});

test('pseudoBoxFor positions an absolute pseudo against the padding box', () => {
  // `inset: 26%` on a bordered host: the browser resolves 26% against the
  // 46px padding box (11.96px), so the pseudo starts 7 + 11.96 in from the
  // cell edge. Measuring from the border box instead shifts it by the border.
  assert.deepEqual(
    pseudoBoxFor(CELL, BORDERED_HOST, absolute({ left: '11.96px', top: '11.96px', right: '11.96px', bottom: '11.96px' })),
    { x: 18.96, y: 18.96, w: 22.08, h: 22.08 }
  );
  // Anchored from the far side, and centred with neither side set.
  assert.deepEqual(
    pseudoBoxFor(CELL, BORDERED_HOST, absolute({ right: '4px', bottom: '4px', width: '10px', height: '10px' })),
    { x: 39, y: 39, w: 10, h: 10 }
  );
  assert.deepEqual(
    pseudoBoxFor(CELL, BORDERED_HOST, absolute({ width: '20px', height: '20px' })),
    { x: 20, y: 20, w: 20, h: 20 }
  );
});

test('pseudoBoxFor centres a static pseudo in the content box', () => {
  const staticPseudo = { position: 'static', width: '20px', height: '10px' };
  assert.deepEqual(pseudoBoxFor(CELL, BORDERED_HOST, staticPseudo), {
    x: 20,
    y: 25,
    w: 20,
    h: 10,
  });
  assert.deepEqual(
    pseudoBoxFor(CELL, { ...BORDERED_HOST, paddingLeft: '10px' }, staticPseudo),
    { x: 25, y: 25, w: 20, h: 10 }
  );
  // Nothing to paint.
  assert.equal(
    pseudoBoxFor(CELL, PLAIN_HOST, { position: 'static', width: 'auto', height: 'auto' }),
    null
  );
});

test('pseudoBoxFor leaves a borderless host untouched', () => {
  // Every pattern that predates batch 11's frames goes through this path, so
  // the padding-box fix must be a no-op for it.
  assert.deepEqual(
    pseudoBoxFor(CELL, PLAIN_HOST, absolute({ left: '0px', top: '0px', right: '0px', bottom: '0px' })),
    { x: 0, y: 0, w: 60, h: 60 }
  );
  assert.deepEqual(
    pseudoBoxFor(CELL, PLAIN_HOST, absolute({ left: '6px', top: '6px', width: '12px', height: '12px' })),
    { x: 6, y: 6, w: 12, h: 12 }
  );
});

// ── SVG-export tiers ───────────────────────────────────────────────────────
// The tier metadata drives real behaviour: `svgExport: false` disables the
// download, `svgExportNote` puts a warning dialog in front of it. It is also
// easy to lose - the batch generators rewrite every pattern file they own, so
// a tier that exists only in the generated JSON disappears the next time
// anyone regenerates that batch. That is not a loud failure: the pattern keeps
// working, the export just quietly becomes wrong. (It happened to `wedge`.)
//
// Pinning the three tiers here makes any such loss fail `npm test` instead.
// Changing a design's tier is a deliberate act - update this list with it, and
// update docs/svg-export.md, which these numbers are quoted in.
const PATTERNS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'patterns'
);
const catalogue = fs
  .readdirSync(PATTERNS_DIR)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(fs.readFileSync(path.join(PATTERNS_DIR, file), 'utf8')));

const slugsWhere = (predicate) => catalogue.filter(predicate).map((a) => a.slug).sort();

test('tier 1 - the designs SVG cannot represent still opt out', () => {
  assert.deepEqual(slugsWhere((a) => a.svgExport === false), [
    'coil',
    'pinwheel',
    'spectrum',
    'wedge',
  ]);
});

test('tier 2 - the designs that export with a caveat still carry their note', () => {
  assert.deepEqual(slugsWhere((a) => Boolean(a.svgExportNote)), [
    'bokeh',
    'drypoint',
    'fractal',
    'glyph',
    'lantern',
    'matryoshka',
    'misprint',
    'neon',
    'subdivide',
    'terrain',
    'windowpane',
  ]);
});

test('tier 3 - no design makes its export tier conditional on an option', () => {
  // The Shadow toggle on bloks, cupola, foliage, mixtape, odessa, quarterfall
  // and radius was the only member of this tier, and it was removed rather
  // than left as a switch that quietly costs you a clean SVG. The mechanism
  // still works - this pins that nothing is using it, so a design that grows
  // an option-level note has to come here and say so deliberately.
  assert.deepEqual(
    slugsWhere((a) => a.options.some((option) => option.svgExportNote)),
    []
  );
});

test('no pattern paints a box-shadow through an option', () => {
  // What the removed toggle actually injected. A design wanting a shadow now
  // has to bake it in and take a definition-level note (as neon, lantern and
  // terrain do), which is visible in the catalogue instead of hidden behind
  // a switch that defaults differently per design.
  for (const pattern of catalogue) {
    for (const option of pattern.options) {
      assert.ok(
        !/box-shadow/.test(option.code ?? ''),
        `${pattern.slug}.${option.id} injects a box-shadow`
      );
    }
  }
});

test('a tier-1 design never also carries a note', () => {
  // The editor disables the download outright for these, so a note would
  // never be shown - carrying one means the tier was set by mistake.
  for (const pattern of catalogue) {
    if (pattern.svgExport === false) {
      assert.equal(supportsSvgExport(pattern), false);
      assert.equal(pattern.svgExportNote, undefined, pattern.slug);
    }
  }
});
