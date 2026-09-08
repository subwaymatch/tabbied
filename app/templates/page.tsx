import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { TabbiedPattern } from 'tabbied/react';
import type { PatternDefinition } from 'tabbied';
import {
  lobe, windowpane, prisma, foliage, veil, blossom, spark, frond, chamfer,
  fluting, merlon, diadem, vitrail, ivy, bokeh, lunette, neon, bauhaus, tetro,
} from 'tabbied/patterns';
import LazyPattern from './LazyPattern';
import { TEMPLATE_SITES } from 'components/template/templateData';
import { NEW_TEMPLATE_SITES } from 'lib/templateSites';
import s from './templates.module.css';

// Derived, never written out: adding a site can't leave a stale number behind.
const TOTAL = TEMPLATE_SITES.length + NEW_TEMPLATE_SITES.length;

export const metadata: Metadata = {
  title: `Made with Tabbied, ${TOTAL} Template Websites`,
  description: `${TOTAL} sample websites using Tabbied generative patterns as design accents, each built with the TabbiedPattern React component.`,
};

const ART: Record<string, PatternDefinition> = {
  lobe, windowpane, prisma, foliage, veil, blossom, spark, frond, chamfer,
  fluting, merlon, diadem, vitrail, ivy, bokeh, lunette,
  // The second collection's patterns, keyed by preset slug.
  ...Object.fromEntries(NEW_TEMPLATE_SITES.map((x) => [x.patternSlug, x.pattern])),
};

type CardData = {
  slug: string;
  href: string;
  n: number;
  name: string;
  topic: string;
  pattern: string;
  paletteName: string;
  colors: string[];
  seed: string;
};

/**
 * A card in the mosaic. The pattern is the content, so it takes the whole top of
 * the card and the metadata sits underneath in one quiet line. Each card carries
 * its palette as a custom property, which tints its hover state: mousing across
 * the grid previews each site's accent before you open it.
 */
function Card({ c }: { c: CardData }) {
  const vars = { '--accent': c.colors[1] ?? c.colors[0] } as CSSProperties;
  return (
    // A <div>, not the <a> it used to be: the download links are anchors of
    // their own and an anchor cannot nest inside another. The card link still
    // covers everything above the download row.
    <div className={s.card} style={vars}>
      <a className={s.cardLink} href={c.href}>
        <div className={s.thumb}>
          <LazyPattern pattern={ART[c.pattern]} palette={c.colors} seed={c.seed} />
          <span className={s.num}>{String(c.n).padStart(2, '0')}</span>
        </div>
        <div className={s.cbody}>
          <div className={s.cmain}>
            <h3>{c.name}</h3>
            <p>{c.topic}</p>
          </div>
          <div className={s.foot}>
            <div className={s.sw} aria-hidden="true">
              {c.colors.map((col, i) => (
                <span key={i} style={{ background: col }} />
              ))}
            </div>
            <div className={s.pn}>
              {c.paletteName} <i>/</i> {c.pattern}
            </div>
          </div>
        </div>
      </a>
      {/* Both formats are built by `npm run templates` into out/downloads/,
          so these are plain static files served next to the site. `download`
          saves the zip rather than navigating to it. */}
      <div className={s.dl}>
        <span className={s.dlLabel}>Download</span>
        <a
          className={s.dlBtn}
          href={`/downloads/${c.slug}-html.zip`}
          download
        >
          HTML
        </a>
        <a
          className={s.dlBtn}
          href={`/downloads/${c.slug}-react.zip`}
          download
        >
          React
        </a>
      </div>
    </div>
  );
}

// The hero backdrop is a contact sheet rather than one enlarged pattern: four
// different patterns on four different palettes, which states the premise of the
// page before a word is read.
const HERO_TILES: { art: PatternDefinition; palette: string[]; seed: string }[] = [
  { art: neon, palette: ['#0d0d12', '#3fffb2', '#3eecff', '#ff3d8b'], seed: 'H1' },
  { art: bauhaus, palette: ['#0d0d12', '#ff3d8b', '#ffd23e', '#3eecff'], seed: 'H2' },
  { art: tetro, palette: ['#0d0d12', '#7048e8', '#3eecff', '#3fffb2'], seed: 'H3' },
  { art: prisma, palette: ['#0d0d12', '#ffd23e', '#3fffb2', '#7048e8'], seed: 'H4' },
];

function GroupHead({
  kicker,
  title,
  body,
  count,
  unit = 'sites',
}: {
  kicker: string;
  title: string;
  body: ReactNode;
  count: number;
  unit?: string;
}) {
  return (
    <header className={s.group}>
      <div>
        <span className={s.kicker}>{kicker}</span>
        <h2>{title}</h2>
      </div>
      <div className={s.groupMeta}>
        <p>{body}</p>
        <span className={s.count}>
          {count} {unit}
        </span>
      </div>
    </header>
  );
}

export default function TemplatesGallery() {
  // One list, numbered straight through: the gallery shows a single grid
  // rather than splitting the collections into separate batches.
  const allCards: CardData[] = [
    ...TEMPLATE_SITES.map((x, i) => ({
      slug: x.slug,
      href: `/template/${x.slug}/`,
      name: x.brand,
      topic: x.topic,
      pattern: x.pattern,
      paletteName: x.paletteName,
      colors: x.colors,
      seed: `RCT${i}`,
    })),
    ...NEW_TEMPLATE_SITES.map((x) => ({
      slug: x.slug,
      href: `/template/${x.slug}/`,
      name: x.name,
      topic: x.topic,
      pattern: x.patternSlug,
      paletteName: x.paletteName,
      colors: x.palette,
      seed: x.seed,
    })),
  ].map((c, i) => ({ ...c, n: i + 1 }));

  return (
    <main className={s.page}>
      <header className={s.hero}>
        <div className={s.heroArt} aria-hidden="true">
          {HERO_TILES.map((t) => (
            <div key={t.seed}>
              <TabbiedPattern
                pattern={t.art}
                palette={t.palette}
                seed={t.seed}
                fit="cover"
                density={1}
              />
            </div>
          ))}
        </div>
        <div className={s.heroScrim} />
        <div className={s.heroInner}>
          <div className={s.pre}>Made with Tabbied</div>
          <h1>
            {TOTAL} sites,<br />
            <span>one pattern engine</span>
          </h1>
          <p>
            Every site below uses a <strong>Tabbied</strong> generative pattern as its
            main design accent, themed end to end with a single palette.
            Same component, {TOTAL} completely different moods.
          </p>
          <dl className={s.facts}>
            <div><dt>{TOTAL}</dt><dd>sample sites</dd></div>
            <div><dt>{TOTAL}</dt><dd>palettes</dd></div>
            <div><dt>{TOTAL}</dt><dd>patterns</dd></div>
            <div><dt>1</dt><dd>component</dd></div>
          </dl>
        </div>
      </header>

      <div className={s.wrap}>
        <section>
          <GroupHead
            kicker="01"
            title="Every site, one component"
            body={
              <>
                Live Next.js pages, each rendered by the same{' '}
                <code>TabbiedPattern</code> component on its own palette and
                presets - some with AI-generated imagery composited over the
                patterns, the newest ten with the patterns carrying the page
                on their own.
              </>
            }
            count={allCards.length}
          />
          <div className={s.mosaic}>
            {allCards.map((c) => (
              <Card key={c.href} c={c} />
            ))}
          </div>
        </section>

      </div>

      <footer className={s.footer}>
        <p>
          Built with <a href="https://tabbied.com">Tabbied</a>, generative patterns
          powered by css-doodle. Open any card to view the full site.
        </p>
      </footer>
    </main>
  );
}
