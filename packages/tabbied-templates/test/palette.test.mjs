// Palette derivation.
//
// These values used to live in components/template/TemplateSite.tsx and are
// now shared with applyEdits, so the thing worth pinning is that the shared
// implementation still produces what that component produced - a re-colour and
// a first render must agree, or a downloaded page differs from the one it was
// downloaded from.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  derivePaletteProperties,
  propertiesForPalette,
  resolvePaletteRoles,
  contrastRatio,
  luminance,
  mix,
  onColor,
} from '../dist/index.js';

test('direct derivation writes only the brand roles', () => {
  assert.deepEqual(derivePaletteProperties(['#ffffff', '#000000'], 'direct'), {
    '--brand-0': '#ffffff',
    '--brand-1': '#000000',
  });
});

test('templateSite derivation adds the variables the component works in', () => {
  const light = derivePaletteProperties(
    ['#F5F1E8', '#A9713C', '#2E2A25'],
    'templateSite'
  );

  assert.equal(light['--bg'], '#F5F1E8');
  assert.equal(light['--c1'], '#A9713C');
  // A light ground takes the darkest palette entry as ink when it is dark
  // enough to carry body copy.
  assert.equal(light['--ink'], '#2E2A25');
  assert.equal(light['--band'], undefined);
});

test('a dark ground takes a page-tinted near-white ink, not a fixed cream', () => {
  const dark = derivePaletteProperties(['#0B2545', '#13A8A8'], 'templateSite');

  assert.equal(dark['--ink'], mix('#0B2545', '#ffffff', 0.93));
  assert.notEqual(dark['--ink'], '#f5f3ef');
  assert.ok(contrastRatio(dark['--bg'], '#ffffff') > 4.5);
});

test('a flat-sections site loses the alternating band tone', () => {
  const properties = propertiesForPalette({
    colors: ['#F5F1E8', '#2E2A25'],
    derivation: 'templateSite',
    flatSections: true,
  });

  assert.equal(properties['--band'], '#F5F1E8');
});

test('propertiesForPalette can derive from a replacement palette', () => {
  const properties = propertiesForPalette(
    { colors: ['#F5F1E8', '#2E2A25'], derivation: 'templateSite' },
    ['#0B2545', '#13A8A8']
  );

  assert.equal(properties['--brand-0'], '#0B2545');
  assert.equal(properties['--bg'], '#0B2545');
});

test('roles resolve against the brand palette, literals pass through', () => {
  assert.deepEqual(
    resolvePaletteRoles(['transparent', 1, 2], ['#000', '#111', '#222']),
    ['transparent', '#111', '#222']
  );
});

test('a role past the end of a short palette wraps rather than blanking', () => {
  assert.deepEqual(resolvePaletteRoles([0, 1, 2, 3], ['#000', '#111']), [
    '#000',
    '#111',
    '#000',
    '#111',
  ]);
});

test('the colour helpers agree with the component they came from', () => {
  assert.ok(luminance('#ffffff') > 0.99);
  assert.ok(luminance('#000000') < 0.01);
  assert.equal(mix('#000000', '#ffffff', 0.5), 'rgb(128, 128, 128)');
  assert.equal(onColor('#0B2545'), '#ffffff');
  assert.equal(onColor('#F5F1E8'), '#151515');
  assert.equal(Math.round(contrastRatio('#000000', '#ffffff')), 21);
});
