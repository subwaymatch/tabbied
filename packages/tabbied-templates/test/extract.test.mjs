// Reading a spec back out of exported markup.
//
// The scanner is the part most likely to be quietly wrong - HTML has several
// shapes that defeat a regex, and the failure mode is a slot that silently
// isn't there. These fixtures are the shapes the real export actually
// contains: a headline with an accent span, a figure wrapping an image, a
// pattern placeholder inside a positioned box, and a page full of scripts and
// comments around all of it.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  extractFromHtml,
  scanElements,
  parseAttributes,
  labelFromId,
  parsePaletteRoles,
  parseBrandColors,
  htmlToTextValue,
  stripCacheBuster,
} from '../dist/index.js';

const designOptions = (slug) =>
  slug === 'lobe'
    ? [
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
      ]
    : undefined;

const page = `<!DOCTYPE html>
<html><head><title>Solstice</title>
<style>.x { content: "<div data-edit='fake'>" }</style>
</head>
<body>
<div class="site" data-edit-root="templateSite" data-edit-flat style="--brand-0:#F5F1E8">
  <!-- a comment with <div data-edit="commented"> inside it -->
  <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="60">
    Mornings that <em class="TemplateSite-module__aB3x__em">start slow</em>.
  </h1>
  <p data-edit="hero.lede" data-edit-multiline>A studio for slow mornings &amp; long walks.</p>
  <figure data-edit-image="hero.photo" data-image-prompt="A sunlit studio at dawn">
    <img src="/images/template/react__solstice__hero-0.webp?v=ab12cd34"
         alt="A sunlit studio" width="1600" height="1067" />
  </figure>
  <div data-edit-pattern="hero.field" data-edit-roles="transparent,1,3">
    <div data-pattern="lobe" data-palette="transparent, #2E2A25, #A9713C"
         data-options="grid: 4x6; frequency: 0.6" data-seed="sol-1"
         data-fit="cover" data-density="1"></div>
  </div>
  <img data-edit-image="logo" src="/images/logo.svg" alt="Solstice" />
</div>
<script>var x = '<div data-edit="in-a-script">';</script>
</body></html>`;

test('extracts every slot kind from a real-shaped page', () => {
  const { slots, root, problems } = extractFromHtml(page, { designOptions });

  assert.deepEqual(problems, []);
  assert.deepEqual(root, {
    derivation: 'templateSite',
    flatSections: true,
    colors: ['#F5F1E8'],
  });
  assert.deepEqual(
    slots.map((slot) => slot.id),
    ['hero.title', 'hero.lede', 'hero.photo', 'hero.field', 'logo']
  );
});

test('scripts, styles, and comments cannot contribute slots', () => {
  const { slots } = extractFromHtml(page, { designOptions });
  const ids = slots.map((slot) => slot.id);

  assert.ok(!ids.includes('fake'));
  assert.ok(!ids.includes('commented'));
  assert.ok(!ids.includes('in-a-script'));
});

test('an accent survives into the value, with its hashed class captured', () => {
  const [title] = extractFromHtml(page, { designOptions }).slots;

  assert.equal(title.kind, 'text');
  assert.equal(title.format, 'emphasis');
  assert.equal(title.value, 'Mornings that {em}start slow{/em}.');
  assert.equal(title.emphasisClass, 'TemplateSite-module__aB3x__em');
  assert.equal(title.maxChars, 60);
});

test('a plain slot decodes entities and records multiline', () => {
  const lede = extractFromHtml(page, { designOptions }).slots[1];

  assert.equal(lede.value, 'A studio for slow mornings & long walks.');
  assert.equal(lede.multiline, true);
  assert.equal(lede.emphasisClass, undefined);
});

test('an image slot reads the wrapped img and drops the cache-buster', () => {
  const photo = extractFromHtml(page, { designOptions }).slots[2];

  assert.equal(photo.kind, 'image');
  assert.equal(photo.src, '/images/template/react__solstice__hero-0.webp');
  assert.equal(photo.alt, 'A sunlit studio');
  assert.equal(photo.width, 1600);
  assert.equal(photo.height, 1067);
  assert.equal(photo.prompt, 'A sunlit studio at dawn');
});

test('an image slot may be the img itself', () => {
  const logo = extractFromHtml(page, { designOptions }).slots[4];

  assert.equal(logo.kind, 'image');
  assert.equal(logo.src, '/images/logo.svg');
});

test('a pattern slot reads the placeholder config and its roles', () => {
  const field = extractFromHtml(page, { designOptions }).slots[3];

  assert.equal(field.kind, 'pattern');
  assert.deepEqual(field.paletteRoles, ['transparent', 1, 3]);
  assert.deepEqual(field.config, {
    slug: 'lobe',
    palette: ['transparent', '#2E2A25', '#A9713C'],
    // Coerced by the catalog's declared types: a Slider comes back a number,
    // a ButtonSelectGroup stays the string css-doodle substitutes.
    options: { grid: '4x6', frequency: 0.6 },
    seed: 'sol-1',
    fit: 'cover',
    density: 1,
  });
  assert.equal(field.options.length, 2);
});

test('a pattern slot with no catalog carries no ranges but still extracts', () => {
  const field = extractFromHtml(page).slots[3];

  assert.equal(field.config.slug, 'lobe');
  assert.equal(field.options, undefined);
  // Without types the value cannot be coerced, so it stays as written.
  assert.equal(field.config.options.frequency, '0.6');
});

test('an annotation that resolves to nothing is reported, not skipped', () => {
  const broken = `<div data-edit-image="ghost"></div>
    <div data-edit-pattern="empty"></div>
    <p data-edit="">x</p>`;
  const { problems, slots } = extractFromHtml(broken);

  assert.equal(slots.length, 0);
  assert.equal(problems.length, 3);
  assert.match(problems.join('\n'), /contains no <img>/);
  assert.match(problems.join('\n'), /contains no \[data-pattern\] host/);
  assert.match(problems.join('\n'), /empty id/);
});

test('a repeated id collapses to one slot when the elements agree', () => {
  // The real case: a brand name in the masthead and again in the footer.
  const { slots, problems } = extractFromHtml(
    `<a data-edit="brand.name">Solstice</a><span data-edit="brand.name">Solstice</span>`
  );

  assert.deepEqual(problems, []);
  assert.equal(slots.length, 1);
  assert.equal(slots[0].value, 'Solstice');
});

test('a repeated id whose elements disagree is an authoring bug', () => {
  const { problems } = extractFromHtml(
    `<p data-edit="a">one</p><p data-edit="a">two</p>`
  );

  assert.match(problems.join('\n'), /repeats with different content/);
});

test('one id used for two kinds is reported', () => {
  const { problems } = extractFromHtml(
    `<p data-edit="a">one</p><img data-edit-image="a" src="/x.webp" alt="" />`
  );

  assert.match(problems.join('\n'), /both a text and a image/);
});

test('a > inside an attribute value does not end the tag', () => {
  const [found] = scanElements(
    `<p title="a > b" data-edit="x">hello</p>`,
    ['data-edit']
  );

  assert.equal(found.value, 'x');
  assert.equal(found.innerHtml, 'hello');
  assert.equal(found.attributes.title, 'a > b');
});

test('nesting is tracked so a slot keeps its own markup', () => {
  const [found] = scanElements(
    `<div data-edit="x"><span><b>a</b></span> tail</div>`,
    ['data-edit']
  );

  assert.equal(found.innerHtml, '<span><b>a</b></span> tail');
});

test('one unclosed tag does not lose the slots after it', () => {
  const [found] = scanElements(
    `<div><span class="oops"><p data-edit="after">kept</p>`,
    ['data-edit']
  );

  assert.equal(found?.value, 'after');
  assert.equal(found?.innerHtml, 'kept');
});

test('the small helpers behave', () => {
  assert.deepEqual(parseAttributes(' a="1" b c=\'2\''), {
    a: '1',
    b: '',
    c: '2',
  });
  assert.deepEqual(parsePaletteRoles('transparent, 1, 3'), [
    'transparent',
    1,
    3,
  ]);
  assert.equal(labelFromId('hero.title'), 'Hero title');
  assert.equal(labelFromId('band.ctaLabel'), 'Band cta Label');
  assert.equal(stripCacheBuster('/a.webp?v=abc123'), '/a.webp');
  assert.equal(htmlToTextValue('a <em>b</em> c'), 'a {em}b{/em} c');
});

test('the brand palette is read back off the root inline style', () => {
  assert.deepEqual(
    parseBrandColors('--brand-0:#F5F1E8;--brand-1: #2E2A25 ;--brand-2:#A9713C'),
    ['#F5F1E8', '#2E2A25', '#A9713C']
  );
});

test('a gap in the brand roles stops the palette rather than compacting it', () => {
  // Compacting would silently renumber the inks, so role 2 in a saved edits
  // document would land on a different colour than the page it was made from.
  assert.deepEqual(parseBrandColors('--brand-0:#fff;--brand-2:#000'), ['#fff']);
});
