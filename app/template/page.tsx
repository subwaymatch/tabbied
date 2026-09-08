import type { Metadata } from 'next';
import { NEW_TEMPLATE_SITES } from 'lib/templateSites';
import LazyTile from './LazyTile';
import s from './template.module.css';

// The site list (palettes, patterns, seeds) lives in lib/templateSites so the
// /templates gallery and this index stay in lockstep.
const SITES = NEW_TEMPLATE_SITES;

// Counts are read off the list rather than written out, so adding a site can
// never leave a stale number in the copy.
const N = SITES.length;

export const metadata: Metadata = {
  title: `Template: ${N} sites built on Tabbied patterns`,
  description: `${N} fictional brand sites (a concert hall, a watch manufacture, an observatory, a railway) each designed around a different Tabbied generative pattern.`,
};

export default function TemplateIndexPage() {
  return (
    <main className={s.page}>
      <header className={s.head}>
        <p className={s.kicker}>Template</p>
        <h1>
          {N} sites, {N} patterns, {N} design worlds.
        </h1>
        <p>
          Each of these fictional brand sites is designed around a different{' '}
          <a href="/patterns">Tabbied generative pattern</a>, used for hero
          backdrops, section bands, and surfaces for cut-out imagery - and, in
          the newest ten, as the only image on the page. Every tile below is
          the live pattern, drawn in the site's own palette.
        </p>
      </header>
      <div className={s.grid}>
        {SITES.map((site, i) => (
          <a key={site.slug} className={s.card} href={`/template/${site.slug}/`}>
            <div className={s.thumb}>
              <LazyTile
                pattern={site.pattern}
                palette={site.palette}
                seed={site.seed}
              />
            </div>
            <div className={s.body}>
              <div>
                <h2>{site.name}</h2>
                <p>{site.topic}</p>
              </div>
              <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
            </div>
          </a>
        ))}
      </div>
      <p className={s.foot}>
        Patterns by <a href="https://tabbied.com">Tabbied</a> · imagery, where
        a site uses any, generated with GPT Image 2.
      </p>
    </main>
  );
}
