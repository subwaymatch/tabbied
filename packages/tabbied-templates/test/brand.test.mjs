// Placing three brand strings onto a template nobody knew the slot ids of.
//
// The mapping is small; what it has to get right is the *absences*. A template
// that declares no headline, a model that returned no tagline, and a palette
// that would fail validation all reach this code, and none of them may produce
// an edits document that `planEdits` then rejects - the caller's alternative to
// a partial rebrand is no rebrand at all, which is worse.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  COPY_ROLES,
  copySlots,
  declaredCopyRoles,
  directionToEdits,
  parseCopyRole,
  supportsBrandCopy,
  planEdits,
  hasErrors,
} from '../dist/index.js';

const textSlot = (id, role, extra = {}) => ({
  id,
  kind: 'text',
  value: `current ${id}`,
  format: 'plain',
  ...(role ? { role } : {}),
  ...extra,
});

const spec = (slots, palette = ['#101010', '#f5f5f5', '#c04000']) => ({
  specVersion: 1,
  site: { slug: 'verdant', name: 'Verdant' },
  palette: { colors: palette, derivation: 'direct' },
  slots,
});

const fullSpec = () =>
  spec([
    textSlot('brand.name', 'brandName'),
    textSlot('hero.title', 'headline'),
    textSlot('hero.lede', 'tagline'),
    textSlot('about.body'),
  ]);

const copy = {
  brandName: 'Ye Joo Park',
  headline: 'Real estate, thoughtfully handled.',
  tagline: 'Residential, commercial, and property management in Champaign.',
};

test('parseCopyRole admits the roles and nothing else', () => {
  for (const role of COPY_ROLES) assert.equal(parseCopyRole(role), role);

  assert.equal(parseCopyRole('body'), undefined);
  assert.equal(parseCopyRole(''), undefined);
  assert.equal(parseCopyRole(undefined), undefined);
});

test('collects the slots carrying each role, ignoring the rest', () => {
  const found = copySlots(fullSpec());

  assert.deepEqual(
    found.brandName.map((slot) => slot.id),
    ['brand.name']
  );
  assert.deepEqual(
    found.headline.map((slot) => slot.id),
    ['hero.title']
  );
  assert.equal(found.body, undefined);
});

test('one role on several slots reaches all of them', () => {
  const document = directionToEdits(
    spec([
      textSlot('bar.mark', 'brandName'),
      textSlot('colophon.mark', 'brandName'),
    ]),
    { copy }
  );

  assert.deepEqual(document.edits.text, {
    'bar.mark': 'Ye Joo Park',
    'colophon.mark': 'Ye Joo Park',
  });
});

test('drops a role the template does not declare', () => {
  const document = directionToEdits(
    spec([textSlot('bar.mark', 'brandName')]),
    { copy }
  );

  assert.deepEqual(document.edits.text, { 'bar.mark': 'Ye Joo Park' });
  assert.deepEqual(declaredCopyRoles(spec([textSlot('bar.mark', 'brandName')])), [
    'brandName',
  ]);
});

test('skips a string the caller did not supply, and blank ones', () => {
  const document = directionToEdits(fullSpec(), {
    copy: { brandName: 'Ye Joo Park', headline: '   ' },
  });

  assert.deepEqual(document.edits.text, { 'brand.name': 'Ye Joo Park' });
});

test('carries a usable palette and drops one that is not', () => {
  const good = directionToEdits(fullSpec(), {
    copy,
    palette: ['#0B1B2B', '#EFEAE0', '#00B37A'],
  });
  assert.deepEqual(good.edits.palette, ['#0B1B2B', '#EFEAE0', '#00B37A']);

  // One colour is a ground with no ink; `planEdits` rejects it, so it must not
  // reach the document at all.
  assert.equal(directionToEdits(fullSpec(), { copy, palette: ['#0B1B2B'] }).edits.palette, undefined);
  assert.equal(directionToEdits(fullSpec(), { copy, palette: ['red', 'white'] }).edits.palette, undefined);
  assert.equal(directionToEdits(fullSpec(), { copy, palette: null }).edits.palette, undefined);
});

test('an empty direction is a valid, empty document', () => {
  const document = directionToEdits(fullSpec(), { copy: null });

  assert.deepEqual(document, { specVersion: 1, slug: 'verdant', edits: {} });
});

test('what it produces always survives planEdits', () => {
  const specs = [
    fullSpec(),
    spec([textSlot('bar.mark', 'brandName')]),
    spec([textSlot('about.body')]),
  ];

  for (const candidate of specs) {
    const plan = planEdits(
      candidate,
      directionToEdits(candidate, { copy, palette: ['#0B1B2B', '#EFEAE0'] })
    );

    assert.equal(hasErrors(plan.problems), false, JSON.stringify(plan.problems));
  }
});

test('supportsBrandCopy is about the name, not the other two', () => {
  assert.equal(supportsBrandCopy(spec([textSlot('bar.mark', 'brandName')])), true);
  assert.equal(supportsBrandCopy(spec([textSlot('hero.title', 'headline')])), false);
  assert.equal(supportsBrandCopy(spec([textSlot('about.body')])), false);
});
