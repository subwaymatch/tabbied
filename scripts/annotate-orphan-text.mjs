// Second codemod: give the bespoke templates' orphaned text a slot.
//
// annotate-templates.mjs only made a slot of an element whose whole content is
// one text run (`isSimpleText`). Anything with mixed inline content was passed
// over and only its annotatable *descendants* got slots, which left the
// container's own text with no id on it - unreachable by an edits document,
// forever. Cobalt Works' headline is the shape:
//
//     <h1>
//       Colour is a <br />
//       <span data-edit="hero.text">material</span> before <br />
//       it is an effect.
//     </h1>
//
// Rewriting hero.text replaced "material" and left the rest of the sentence
// standing, so a generated site read "Colour is a Find your place. before it is
// an effect." - the template's words with the model's spliced in.
//
// Two shapes are fixed, matching what the five shared TemplateSite pages
// already do by hand:
//
//   text-only    the container becomes a plain slot with a new id
//   one accent   the container takes over the accent's *existing* id and gains
//                data-edit-format="emphasis", and the accent's own annotation
//                is removed
//
// Taking over the id rather than minting one is what keeps stored revisions
// working: a document that says `hero.text` still resolves, and now writes the
// whole headline instead of one word inside it.
//
// Anything else - two accents, an expression, a link mid-sentence - is left
// alone and reported. Those need a person, and generate-editable.mjs fails the
// build while any of them remain.
//
//   node scripts/annotate-orphan-text.mjs            every annotated page
//   node scripts/annotate-orphan-text.mjs cobalt-works
//   node scripts/annotate-orphan-text.mjs --dry-run  report, write nothing

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';

const templateDir = path.join(process.cwd(), 'app', 'template');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const only = args.filter((arg) => !arg.startsWith('-'));

// The same closed list annotate-templates.mjs uses: tags whose text is page
// copy. A layout <div> is not a slot even when it holds a stray word.
const CONTENT_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'li', 'dt', 'dd',
  'cite', 'blockquote', 'figcaption', 'summary', 'strong', 'small', 'time',
  'label', 'button', 'th', 'td', 'caption', 'legend',
]);

// Inline tags a page may accent with. Kept in step with ACCENT_TAGS in
// packages/tabbied-templates/src/text.ts, which reads the same markup back.
const ACCENT_TAGS = new Set(['em', 'span', 'i', 'b', 'strong', 'mark']);

const MAX_CHARS = {
  h1: 70, h2: 60, h3: 40, h4: 36, h5: 32, h6: 32,
  p: 240, blockquote: 240, dd: 200, li: 80, a: 28, button: 24,
  span: 60, dt: 28, cite: 48, figcaption: 120, summary: 80,
};

const MULTILINE_TAGS = new Set(['p', 'blockquote', 'dd', 'figcaption']);

const TAG_WORDS = {
  a: 'link', p: 'body', span: 'text', li: 'item', dt: 'term', dd: 'body',
  h1: 'title', h2: 'title', h3: 'title', h4: 'title', h5: 'title', h6: 'title',
  blockquote: 'quote', cite: 'attribution', figcaption: 'caption',
  summary: 'summary', strong: 'text', small: 'note', time: 'date',
  label: 'label', button: 'action', th: 'heading', td: 'cell',
  caption: 'caption', legend: 'legend',
};

const SECTION_TAGS = new Set([
  'section', 'header', 'footer', 'main', 'article', 'aside',
]);

function parsePage(code) {
  return parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
}

function tagNameOf(element) {
  const name = element.openingElement?.name;
  return name?.type === 'JSXIdentifier' ? name.name : null;
}

function attributeNamed(element, name) {
  for (const attribute of element.openingElement?.attributes ?? []) {
    if (attribute.type === 'JSXAttribute' && attribute.name?.name === name) {
      return attribute;
    }
  }
  return null;
}

/** Every JSX element in the file, each with a `parent` pointer. */
function collectElements(ast) {
  const elements = [];
  const walk = (node, parent) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXElement') {
      node.parent = parent;
      elements.push(node);
      parent = node;
    }
    for (const key of Object.keys(node)) {
      if (key === 'parent') continue;
      const value = node[key];
      if (Array.isArray(value)) {
        for (const child of value) walk(child, parent);
      } else if (value && typeof value.type === 'string') {
        walk(value, parent);
      }
    }
  };
  walk(ast, null);
  return elements;
}

/** Children that carry meaning: whitespace-only text does not. */
function realChildren(element) {
  return (element.children ?? []).filter(
    (child) => !(child.type === 'JSXText' && child.value.trim() === '')
  );
}

/**
 * The id prefix this part of the page already uses.
 *
 * Read off the page's own annotations rather than re-derived from class names:
 * these files are already annotated, so the neighbours are the definition of
 * what this section is called, and a fresh derivation could disagree with them.
 */
function sectionPrefixOf(code, element) {
  let current = element.parent;

  while (current) {
    if (SECTION_TAGS.has(tagNameOf(current))) {
      const counts = new Map();
      const source = code.slice(current.start, current.end);

      for (const match of source.matchAll(/data-edit="([a-zA-Z0-9]+)\./g)) {
        counts.set(match[1], (counts.get(match[1]) ?? 0) + 1);
      }

      let best = null;
      for (const [prefix, count] of counts) {
        if (!best || count > best[1]) best = [prefix, count];
      }

      if (best) return best[0];
    }
    current = current.parent;
  }

  return 'page';
}

/** Roughly what the container currently reads, for sizing its budget. */
function currentTextOf(element) {
  let text = '';

  const walk = (node) => {
    if (node.type === 'JSXText') text += node.value.replace(/\s+/g, ' ');
    else if (node.type === 'JSXElement') for (const child of node.children ?? []) walk(child);
  };

  for (const child of element.children ?? []) walk(child);

  return text.trim();
}

function classify(element) {
  const children = realChildren(element);
  const bare = children.filter((c) => c.type === 'JSXText' && c.value.trim());

  if (bare.length === 0) return { shape: 'none' };

  const elements = children.filter((c) => c.type === 'JSXElement');
  const nonBr = elements.filter((c) => tagNameOf(c) !== 'br');
  const expressions = children.filter((c) => c.type === 'JSXExpressionContainer');

  if (nonBr.length === 0 && expressions.length === 0) {
    return { shape: 'text' };
  }

  if (
    nonBr.length === 1 &&
    expressions.length === 0 &&
    ACCENT_TAGS.has(tagNameOf(nonBr[0]))
  ) {
    // The accent may or may not already carry an id. Cobalt Works' headline
    // does (`hero.text` on the span); its masthead does not - the <i> holding
    // "Dry pigment, Sheffield" was never annotated at all, which is why the
    // brand name was unreachable too.
    return { shape: 'accent', accent: nonBr[0] };
  }

  return { shape: 'other' };
}

function annotate(slug) {
  const pagePath = path.join(templateDir, slug, 'page.tsx');

  if (!existsSync(pagePath)) return { slug, skipped: 'no page.tsx' };

  const code = readFileSync(pagePath, 'utf8');

  if (!code.includes('data-edit-root')) {
    return { slug, skipped: 'not annotated yet - run annotate-templates first' };
  }

  const ast = parsePage(code);
  const elements = collectElements(ast);
  const used = new Set(
    [...code.matchAll(/data-edit="([^"]+)"/g)].map((match) => match[1])
  );

  const edits = [];
  const notes = [];
  let text = 0;
  let accents = 0;
  let left = 0;

  const mintId = (prefix, tag) => {
    const word = TAG_WORDS[tag] ?? tag;
    let n = 1;
    let id = `${prefix}.${word}`;

    while (used.has(id)) {
      n += 1;
      id = `${prefix}.${word}${n}`;
    }

    used.add(id);
    return id;
  };

  for (const element of elements) {
    const tag = tagNameOf(element);

    if (!tag || !CONTENT_TAGS.has(tag)) continue;
    if (attributeNamed(element, 'data-edit')) continue;
    // A pattern or image host is a different slot kind; never a text slot.
    if (attributeNamed(element, 'data-edit-pattern')) continue;
    if (attributeNamed(element, 'data-edit-image')) continue;

    const verdict = classify(element);

    if (verdict.shape === 'none') continue;

    if (verdict.shape === 'other') {
      left += 1;
      notes.push(
        `${slug}:${element.loc.start.line} <${tag}> has text beside markup this ` +
          `codemod will not guess at - needs a slot by hand`
      );
      continue;
    }

    // The tag's budget, but never less than what the design already fits: a
    // container that takes over from a child holds more than the child did, and
    // an <a> masthead inheriting the 28 of a nav link warns on the template's
    // own words. Rounded up so the number reads as a budget, not a measurement.
    const held = currentTextOf(element).length;
    const max = MAX_CHARS[tag]
      ? Math.max(MAX_CHARS[tag], Math.ceil(held / 10) * 10)
      : undefined;
    // Only the prose tags get a textarea. A <br> in a headline is not a reason
    // for one: htmlToTextValue collapses whitespace, so a newline in the value
    // comes back as a space and the editor would be promising a line break it
    // cannot keep.
    const multiline = MULTILINE_TAGS.has(tag) ? ' data-edit-multiline' : '';

    if (verdict.shape === 'text') {
      const id = mintId(sectionPrefixOf(code, element), tag);

      edits.push({
        position: element.openingElement.name.end,
        text:
          ` data-edit="${id}"` + (max ? ` data-edit-max="${max}"` : '') + multiline,
      });
      text += 1;
      continue;
    }

    // The accent shape: where the child already has an id the container takes
    // it over, so a stored document keyed by it keeps resolving and now reaches
    // the whole sentence instead of one word inside it. Where it has none there
    // is nothing to preserve, so the container mints one.
    const accent = verdict.accent;
    const idAttribute = attributeNamed(accent, 'data-edit');
    const copyAttribute = attributeNamed(accent, 'data-edit-copy');
    const idSource = idAttribute
      ? code.slice(idAttribute.start, idAttribute.end)
      : `data-edit="${mintId(sectionPrefixOf(code, element), tag)}"`;
    const copySource = copyAttribute
      ? ` ${code.slice(copyAttribute.start, copyAttribute.end)}`
      : '';

    edits.push({
      position: element.openingElement.name.end,
      text:
        ` ${idSource}${copySource} data-edit-format="emphasis"` +
        (max ? ` data-edit-max="${max}"` : '') +
        multiline,
    });

    // Strip the accent's own annotations: two slots over one run of text is
    // ambiguous, and the outer one now owns it.
    for (const attribute of accent.openingElement.attributes) {
      if (
        attribute.type !== 'JSXAttribute' ||
        typeof attribute.name?.name !== 'string' ||
        !attribute.name.name.startsWith('data-edit')
      ) {
        continue;
      }

      // Take the separating space with it so the tag does not gain a double one.
      const from = code[attribute.start - 1] === ' '
        ? attribute.start - 1
        : attribute.start;

      edits.push({ position: from, length: attribute.end - from, text: '' });
    }

    accents += 1;
  }

  let output = code;

  for (const edit of edits.sort((a, b) => b.position - a.position)) {
    output =
      output.slice(0, edit.position) +
      edit.text +
      output.slice(edit.position + (edit.length ?? 0));
  }

  if (!dryRun && edits.length > 0) writeFileSync(pagePath, output);

  return { slug, text, accents, left, notes };
}

const slugs = readdirSync(templateDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((slug) => (only.length === 0 ? true : only.includes(slug)))
  .sort();

let text = 0;
let accents = 0;
let left = 0;
const allNotes = [];

for (const slug of slugs) {
  const result = annotate(slug);

  if (result.skipped) continue;

  text += result.text;
  accents += result.accents;
  left += result.left;
  allNotes.push(...result.notes);

  if (result.text || result.accents || result.left) {
    console.log(
      `  ${slug}: ${result.text} text, ${result.accents} accent, ${result.left} left by hand`
    );
  }
}

for (const note of allNotes) console.log(`note: ${note}`);
console.log(
  `\n${dryRun ? 'would annotate' : 'annotated'} ${text} text and ${accents} ` +
    `accent containers; ${left} need a person.`
);
