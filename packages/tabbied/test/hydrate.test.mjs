// The data-* config contract between a server render and a framework-free
// re-mount. patternConfigToAttributes() is what the React component puts on
// its placeholder; patternConfigFromElement() is what a plain HTML template
// reads back. If they drift, a packaged template silently loses its palette,
// its options, or its motion - so the round trip is pinned here.
//
// Parsing only needs getAttribute(), so these run against a stub rather than
// a DOM. hydratePatterns() itself (which mounts) is covered by
// e2e/package.spec.ts.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  patternConfigFromElement,
  patternConfigToAttributes,
} from '../dist/core/hydrate.js';
import { patterns } from '../dist/patterns.generated.js';

const elementFor = (attributes) => ({
  getAttribute: (name) => (name in attributes ? attributes[name] : null),
});

// A design with all three option control types in play: radius carries a
// "colsxrows" ButtonSelectGroup and a Slider.
const radius = patterns.radius;

const roundTrip = (config) =>
  patternConfigFromElement(
    elementFor(patternConfigToAttributes(config)),
    patterns
  );

test('a bare config serializes to just the slug', () => {
  const attributes = patternConfigToAttributes({ pattern: radius });

  assert.deepEqual(attributes, { 'data-pattern': 'radius' });
});

test('round trips every serializable field', () => {
  const config = {
    pattern: radius,
    seed: 'k9Pz',
    palette: ['#0B1020', '#3E8BFF', '#3FFFB2'],
    fit: 'cover',
    cellSize: 48,
    density: 2,
    width: 360,
    height: 540,
    coverRender: { width: 800, height: 1200 },
    redrawInterval: 5200,
    paused: true,
  };

  const parsed = roundTrip(config);

  assert.equal(parsed.pattern.slug, 'radius');
  assert.equal(parsed.seed, 'k9Pz');
  assert.deepEqual(parsed.palette, config.palette);
  assert.equal(parsed.fit, 'cover');
  assert.equal(parsed.cellSize, 48);
  assert.equal(parsed.density, 2);
  assert.equal(parsed.width, 360);
  assert.equal(parsed.height, 540);
  assert.deepEqual(parsed.coverRender, { width: 800, height: 1200 });
  assert.equal(parsed.redrawInterval, 5200);
  assert.equal(parsed.paused, true);
});

test('option values keep the type their control declares', () => {
  const grid = radius.options.find((option) => option.id === 'grid');
  const slider = radius.options.find((option) => option.type === 'Slider');

  assert.ok(grid, 'radius should declare a grid option');
  assert.ok(slider, 'radius should declare a slider option');

  const parsed = roundTrip({
    pattern: radius,
    options: { [grid.id]: '8x12', [slider.id]: 0.6 },
  });

  // A ButtonSelectGroup value stays the string css-doodle substitutes, even
  // when it looks like something else; a Slider comes back a number.
  assert.equal(parsed.options[grid.id], '8x12');
  assert.equal(typeof parsed.options[grid.id], 'string');
  assert.equal(parsed.options[slider.id], 0.6);
  assert.equal(typeof parsed.options[slider.id], 'number');
});

test('toggle options round trip as booleans', () => {
  const toggling = Object.values(patterns).find((pattern) =>
    pattern.options.some((option) => option.type === 'ToggleSwitch')
  );
  const toggle = toggling.options.find(
    (option) => option.type === 'ToggleSwitch'
  );

  const on = roundTrip({ pattern: toggling, options: { [toggle.id]: true } });
  const off = roundTrip({ pattern: toggling, options: { [toggle.id]: false } });

  assert.equal(on.options[toggle.id], true);
  assert.equal(off.options[toggle.id], false);
});

test('a palette splits on top-level commas only', () => {
  // Authored palettes are hex or keywords, but the config takes any CSS
  // color - and a functional one carries its own commas.
  const parsed = patternConfigFromElement(
    elementFor({
      'data-pattern': 'radius',
      'data-palette': 'transparent, rgb(11, 16, 32), #3E8BFF',
    }),
    patterns
  );

  assert.deepEqual(parsed.palette, [
    'transparent',
    'rgb(11, 16, 32)',
    '#3E8BFF',
  ]);
});

test('an unknown slug yields null rather than throwing', () => {
  assert.equal(
    patternConfigFromElement(
      elementFor({ 'data-pattern': 'notadesign' }),
      patterns
    ),
    null
  );
  assert.equal(patternConfigFromElement(elementFor({}), patterns), null);
});

test('unparseable attributes fall back to the authored defaults', () => {
  // A hand-edited template should degrade to the design's own defaults, not
  // to a blank box - so a bad value is dropped, not fatal.
  const parsed = patternConfigFromElement(
    elementFor({
      'data-pattern': 'radius',
      'data-fit': 'stretch', // not a fit mode
      'data-cell-size': 'wide',
      'data-cover-render': '800',
      'data-options': 'nosuchoption: 4',
    }),
    patterns
  );

  assert.equal(parsed.pattern.slug, 'radius');
  assert.equal(parsed.fit, undefined);
  assert.equal(parsed.cellSize, undefined);
  assert.equal(parsed.coverRender, undefined);
  assert.equal(parsed.options, undefined);
});

test('data-paused is a valueless boolean attribute', () => {
  const flag = patternConfigFromElement(
    elementFor({ 'data-pattern': 'radius', 'data-paused': '' }),
    patterns
  );
  const explicit = patternConfigFromElement(
    elementFor({ 'data-pattern': 'radius', 'data-paused': 'false' }),
    patterns
  );

  assert.equal(flag.paused, true);
  assert.equal(explicit.paused, undefined);
});

test('accepts an array of definitions, not just the record', () => {
  const parsed = patternConfigFromElement(
    elementFor({ 'data-pattern': 'radius' }),
    [patterns.radius, patterns.windowpane]
  );

  assert.equal(parsed.pattern.slug, 'radius');
});
