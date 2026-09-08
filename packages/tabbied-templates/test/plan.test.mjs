// The edit engine's decisions, with no DOM in sight.
//
// planEdits is where every judgement lives - what validates, what a palette
// change implies for a pattern field, which attributes get written. Pinning it
// here is what lets apply.ts stay a dull executor and be covered by one e2e
// case rather than a matrix of them.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  planEdits,
  validateEdits,
  validateSpec,
  hasErrors,
  SPEC_VERSION,
} from '../dist/index.js';

const spec = {
  specVersion: SPEC_VERSION,
  site: { slug: 'solstice', name: 'Solstice', topic: 'Wellness studio' },
  palette: {
    colors: ['#F5F1E8', '#2E2A25', '#A9713C'],
    derivation: 'templateSite',
  },
  slots: [
    {
      id: 'hero.title',
      kind: 'text',
      value: 'Mornings that {em}start slow{/em}.',
      format: 'emphasis',
      maxChars: 60,
      emphasisClass: 'em',
    },
    { id: 'hero.lede', kind: 'text', value: 'A studio for slow mornings.', format: 'plain' },
    {
      id: 'hero.photo',
      kind: 'image',
      src: '/images/template/react__solstice__hero-0.webp',
      alt: 'A sunlit studio',
    },
    {
      id: 'hero.field',
      kind: 'pattern',
      config: { slug: 'lobe', palette: ['transparent', '#2E2A25'], seed: 'sol-1' },
      paletteRoles: ['transparent', 1],
      options: [
        {
          id: 'grid',
          label: 'Columns and rows',
          type: 'ButtonSelectGroup',
          default: '6x9',
          values: ['2x3', '4x6', '6x9'],
        },
        {
          id: 'frequency',
          label: 'Frequency',
          type: 'Slider',
          default: 1,
          min: 0.2,
          max: 1,
          step: 0.1,
        },
      ],
    },
    {
      id: 'band.field',
      kind: 'pattern',
      config: { slug: 'blossom', palette: ['#F5F1E8', '#A9713C'] },
      // No paletteRoles: a literal field a re-colour must leave alone.
    },
  ],
};

const document = (edits) => ({
  specVersion: SPEC_VERSION,
  slug: 'solstice',
  edits,
});

const operationFor = (plan, type, id) =>
  plan.operations.find((op) => op.type === type && (id == null || op.id === id));

test('an empty document plans nothing', () => {
  const plan = planEdits(spec, document({}));

  assert.deepEqual(plan.operations, []);
  assert.deepEqual(plan.problems, []);
});

test('a text edit plans one operation carrying the slot format', () => {
  const plan = planEdits(
    spec,
    document({ text: { 'hero.title': 'Evenings that {em}wind down{/em}.' } })
  );

  assert.equal(plan.problems.length, 0);
  assert.deepEqual(operationFor(plan, 'text', 'hero.title'), {
    type: 'text',
    id: 'hero.title',
    value: 'Evenings that {em}wind down{/em}.',
    format: 'emphasis',
    emphasisClass: 'em',
  });
});

test('an unknown slot id is an error, and the rest still applies', () => {
  const plan = planEdits(
    spec,
    document({ text: { 'hero.nope': 'x', 'hero.lede': 'A quieter studio.' } })
  );

  assert.ok(hasErrors(plan.problems));
  assert.match(plan.problems[0].message, /no slot "hero\.nope"/);
  assert.ok(operationFor(plan, 'text', 'hero.lede'));
});

test('editing a slot as the wrong kind is an error', () => {
  const plan = planEdits(spec, document({ text: { 'hero.photo': 'x' } }));

  assert.ok(hasErrors(plan.problems));
  assert.match(plan.problems[0].message, /is a image slot/);
});

test('overrunning maxChars warns but still applies', () => {
  const plan = planEdits(
    spec,
    document({ text: { 'hero.title': 'x'.repeat(120) } })
  );

  assert.equal(plan.problems.length, 1);
  assert.equal(plan.problems[0].level, 'warning');
  assert.ok(operationFor(plan, 'text', 'hero.title'));
});

test('a palette edit writes brand roles and the derived variables', () => {
  const plan = planEdits(
    spec,
    document({ palette: ['#0B2545', '#EEF4ED', '#13A8A8'] })
  );

  const properties = operationFor(plan, 'properties').properties;

  assert.equal(properties['--brand-0'], '#0B2545');
  assert.equal(properties['--brand-2'], '#13A8A8');
  // templateSite derivation: a dark ground takes a page-tinted near-white ink.
  assert.equal(properties['--bg'], '#0B2545');
  assert.match(properties['--ink'], /^rgb\(/);
});

test('a re-colour moves pattern fields that follow the brand palette', () => {
  const plan = planEdits(
    spec,
    document({ palette: ['#0B2545', '#EEF4ED', '#13A8A8'] })
  );

  // hero.field declares roles, so it re-colours; its literal `transparent`
  // survives, which is what keeps the field readable over a photograph.
  assert.deepEqual(operationFor(plan, 'pattern', 'hero.field').attributes, {
    'data-palette': 'transparent, #EEF4ED',
  });

  // band.field declares none, so nothing is planned for it at all.
  assert.equal(operationFor(plan, 'pattern', 'band.field'), undefined);
});

test('an explicit field palette wins over the brand palette', () => {
  const plan = planEdits(
    spec,
    document({
      palette: ['#0B2545', '#EEF4ED', '#13A8A8'],
      patterns: { 'hero.field': { palette: ['#000000', '#FFFFFF'] } },
    })
  );

  assert.deepEqual(operationFor(plan, 'pattern', 'hero.field').attributes, {
    'data-palette': '#000000, #FFFFFF',
  });
});

test('a short or non-hex palette is rejected', () => {
  assert.ok(hasErrors(validateEdits(spec, document({ palette: ['#000000'] }))));
  assert.ok(
    hasErrors(validateEdits(spec, document({ palette: ['#000000', 'navy'] })))
  );
});

test('option values are checked against the catalog ranges', () => {
  const ok = planEdits(
    spec,
    document({ patterns: { 'hero.field': { options: { grid: '4x6' } } } })
  );

  assert.equal(ok.problems.length, 0);
  assert.deepEqual(operationFor(ok, 'pattern', 'hero.field').attributes, {
    'data-options': 'grid: 4x6',
  });

  const badChoice = validateEdits(
    spec,
    document({ patterns: { 'hero.field': { options: { grid: '99x99' } } } })
  );
  assert.ok(hasErrors(badChoice));
  assert.match(badChoice[0].message, /must be one of/);

  const outOfRange = validateEdits(
    spec,
    document({ patterns: { 'hero.field': { options: { frequency: 4 } } } })
  );
  assert.ok(hasErrors(outOfRange));
  assert.match(outOfRange[0].message, /above its maximum/);

  const unknown = validateEdits(
    spec,
    document({ patterns: { 'hero.field': { options: { nope: 1 } } } })
  );
  assert.ok(hasErrors(unknown));
  assert.match(unknown[0].message, /has no option "nope"/);
});

test('a rejected option value plans no attribute at all', () => {
  const plan = planEdits(
    spec,
    document({ patterns: { 'hero.field': { options: { grid: '99x99' } } } })
  );

  assert.equal(operationFor(plan, 'pattern', 'hero.field'), undefined);
});

test('swapping the design clears the old options and warns about new ones', () => {
  const swap = planEdits(
    spec,
    document({ patterns: { 'hero.field': { slug: 'frond' } } })
  );

  assert.deepEqual(operationFor(swap, 'pattern', 'hero.field').attributes, {
    'data-pattern': 'frond',
    'data-options': null,
  });

  const withOptions = planEdits(
    spec,
    document({
      patterns: { 'hero.field': { slug: 'frond', options: { scale: 3 } } },
    })
  );

  assert.equal(withOptions.problems[0].level, 'warning');
  assert.match(withOptions.problems[0].message, /were not validated/);
  assert.equal(
    withOptions.operations.find((op) => op.type === 'pattern').attributes[
      'data-options'
    ],
    'scale: 3'
  );
});

test('a seed edit is planned on its own', () => {
  const plan = planEdits(
    spec,
    document({ patterns: { 'hero.field': { seed: 'sol-9' } } })
  );

  assert.deepEqual(operationFor(plan, 'pattern', 'hero.field').attributes, {
    'data-seed': 'sol-9',
  });
});

test('an image edit keeps the existing alt when none is given', () => {
  const plan = planEdits(
    spec,
    document({ images: { 'hero.photo': { src: '/uploads/a.webp' } } })
  );

  assert.deepEqual(operationFor(plan, 'image', 'hero.photo'), {
    type: 'image',
    id: 'hero.photo',
    src: '/uploads/a.webp',
    alt: 'A sunlit studio',
  });
});

test('a mismatched slug or spec version stops everything', () => {
  const wrongSlug = planEdits(spec, {
    specVersion: SPEC_VERSION,
    slug: 'facet',
    edits: { text: { 'hero.lede': 'x' } },
  });

  assert.ok(hasErrors(wrongSlug.problems));
  assert.deepEqual(wrongSlug.operations, []);

  const wrongVersion = planEdits(spec, {
    specVersion: SPEC_VERSION + 1,
    slug: 'solstice',
    edits: { text: { 'hero.lede': 'x' } },
  });

  assert.ok(hasErrors(wrongVersion.problems));
  assert.deepEqual(wrongVersion.operations, []);
});

test('validateSpec catches the failures that would rot silently', () => {
  assert.deepEqual(validateSpec(spec), []);

  const duplicated = {
    ...spec,
    slots: [...spec.slots, { id: 'hero.lede', kind: 'text', value: 'x', format: 'plain' }],
  };

  assert.ok(hasErrors(validateSpec(duplicated)));
  assert.match(validateSpec(duplicated)[0].message, /duplicate slot id/);

  const badRole = {
    ...spec,
    slots: [
      {
        id: 'x',
        kind: 'pattern',
        config: { slug: 'lobe' },
        paletteRoles: [-1],
      },
    ],
  };

  assert.ok(hasErrors(validateSpec(badRole)));
});
