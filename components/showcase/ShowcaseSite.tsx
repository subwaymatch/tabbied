import type { CSSProperties, ReactNode } from 'react';
import { TabbiedArtwork } from 'tabbied/react';
import type { ArtworkDefinition } from 'tabbied';
import type { ShowcaseSite as Site } from './showcaseData';
import s from './ShowcaseSite.module.css';

// ── Small color helpers (derive readable text/surfaces from the palette) ────
function toRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${c(ar, br)}, ${c(ag, bg)}, ${c(ab, bb)})`;
}
const onColor = (hex: string) => (luminance(hex) < 0.55 ? '#ffffff' : '#151515');

// Split a hero title's single {em}…{/em} span into the accent color.
function renderTitle(title: string): ReactNode {
  const m = title.match(/^(.*?)\{em\}(.*?)\{\/em\}(.*)$/);
  if (!m) return title;
  return (
    <>
      {m[1]}
      <em className={s.em}>{m[2]}</em>
      {m[3]}
    </>
  );
}

type ArtMap = Record<string, ArtworkDefinition>;
type Props = { site: Site; artworks: ArtMap };

// Pick the i-th artwork the site declares (cycling), resolved to its imported
// definition. Each section/card uses a different index so a single site shows
// several distinct Tabbied patterns, all sharing the one palette.
function artAt(site: Site, artworks: ArtMap, i: number): ArtworkDefinition {
  const slugs = site.artworks;
  return artworks[slugs[((i % slugs.length) + slugs.length) % slugs.length]];
}

// One reusable artwork accent. `cover` fits fill their box edge-to-edge; the
// density knob keeps hero cells bold and card cells finer.
function Art({
  artwork,
  palette,
  seed,
  density = 2,
}: {
  artwork: ArtworkDefinition;
  palette: string[];
  seed: string;
  density?: 0 | 1 | 2 | 3 | 4;
}) {
  return (
    <TabbiedArtwork
      artwork={artwork}
      palette={palette}
      seed={seed}
      fit="cover"
      density={density}
      className={s.doodle}
    />
  );
}

export default function ShowcaseSite({ site, artworks }: Props) {
  const { colors } = site;
  const bg = colors[0];
  const c1 = colors[1] ?? bg;
  const dark = luminance(bg) < 0.5;

  // Darkest palette color for ink on light themes; light tint on dark themes.
  const darkest = [...colors].sort((a, b) => luminance(a) - luminance(b))[0];
  const ink = dark ? '#f5f3ef' : luminance(darkest) < 0.4 ? darkest : '#1c1e24';

  const vars: Record<string, string> = {
    '--bg': bg,
    '--c1': c1,
    '--ink': ink,
    '--onDark': '#f5f3ef',
    '--onC1': onColor(c1),
    '--card': dark ? mix(bg, '#ffffff', 0.07) : mix(bg, '#ffffff', 0.6),
    '--line': dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)',
    '--display': site.fonts.display,
    '--body': site.fonts.body,
  };

  return (
    <div className={s.site} style={vars as CSSProperties}>
      {/* Web fonts loaded at the document level (React hoists <link> to head). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={site.fonts.href} precedence="default" />

      {site.layout === 'split' && <SplitLayout site={site} artworks={artworks} />}
      {site.layout === 'spotlight' && <SpotlightLayout site={site} artworks={artworks} />}
      {site.layout === 'editorial' && <EditorialLayout site={site} artworks={artworks} />}
      {site.layout === 'boutique' && <BoutiqueLayout site={site} artworks={artworks} />}
    </div>
  );
}

// ── Shared pieces ───────────────────────────────────────────────────────────
function Nav({ site }: { site: Site }) {
  return (
    <nav className={s.nav}>
      <a className={s.logo} href="#">{site.brand}</a>
      <ul className={s.navLinks}>
        {site.nav.map((n) => (
          <li key={n}><a href="#">{n}</a></li>
        ))}
      </ul>
      <a className={s.navCta} href="#">{site.primaryCta}</a>
    </nav>
  );
}

function Footer({ site }: { site: Site }) {
  return (
    <footer className={s.footer}>
      <span className={s.logo}>{site.brand}</span>
      <span>
        © 2026 {site.brand} · {site.artworks.length} Tabbied artworks (
        {site.artworks.join(' · ')}) via the React component — {site.paletteName}{' '}
        palette
      </span>
    </footer>
  );
}

function Band({ site, artworks, index = 0 }: Props & { index?: number }) {
  return (
    <section className={s.band}>
      <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }}>
        <Art artwork={artAt(site, artworks, index)} palette={site.colors} seed={site.bandSeed} density={1} />
      </div>
      <div className={s.bandScrim} />
      <div className={s.bandInner}>
        <h2>{site.bandTitle}</h2>
        <a className={`${s.btn} ${s.btnSolid}`} href="#">{site.bandCta}</a>
      </div>
    </section>
  );
}

// Each card uses the next artwork in the site's set, so a single grid shows
// several distinct patterns in the shared palette.
function ItemGrid({ site, artworks }: Props) {
  return (
    <section className={s.section}>
      <div className={s.sectionHead}>
        <h2>{site.sectionTitle}</h2>
        <p>{site.sectionSub}</p>
      </div>
      <div className={s.grid}>
        {site.items.map((it, i) => (
          <article className={s.card} key={it.seed}>
            <div className={s.cardMedia}>
              <Art artwork={artAt(site, artworks, i + 1)} palette={site.colors} seed={it.seed} density={2} />
            </div>
            <div className={s.cardBody}>
              <div className={s.cardEyebrow}>{it.eyebrow}</div>
              <h3>{it.title}</h3>
              <div className={s.cardMeta}>{it.meta}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ── Layouts ─────────────────────────────────────────────────────────────────
function SplitLayout({ site, artworks }: Props) {
  return (
    <>
      <Nav site={site} />
      <header className={`${s.splitHero}${site.reverse ? ` ${s.reverse}` : ''}`}>
        <div className={s.splitCopy}>
          <div className={s.eyebrow}>{site.eyebrow}</div>
          <h1>{renderTitle(site.title)}</h1>
          <p className={s.lede}>{site.lede}</p>
          <div className={s.ctaRow}>
            <a className={`${s.btn} ${s.btnSolid}`} href="#">{site.primaryCta}</a>
            <a className={`${s.btn} ${s.btnGhost}`} href="#">{site.secondaryCta}</a>
          </div>
        </div>
        <div className={s.splitArt}>
          <Art artwork={artAt(site, artworks, 0)} palette={site.colors} seed={site.heroSeed} density={1} />
        </div>
      </header>
      {site.stats && (
        <div className={s.statStrip}>
          {site.stats.map((st) => (
            <div key={st.l}>
              <div className={s.statN}>{st.n}</div>
              <div className={s.statL}>{st.l}</div>
            </div>
          ))}
        </div>
      )}
      <ItemGrid site={site} artworks={artworks} />
      <Band site={site} artworks={artworks} index={0} />
      <Footer site={site} />
    </>
  );
}

function SpotlightLayout({ site, artworks }: Props) {
  return (
    <>
      <Nav site={site} />
      <header className={s.spotHero}>
        <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }}>
          <Art artwork={artAt(site, artworks, 0)} palette={site.colors} seed={site.heroSeed} density={1} />
        </div>
        <div className={s.spotScrim} />
        <div className={s.spotInner}>
          <div className={s.eyebrow}>{site.eyebrow}</div>
          <h1>{renderTitle(site.title)}</h1>
          <p className={s.lede}>{site.lede}</p>
          <div className={s.ctaRow}>
            <a className={`${s.btn} ${s.btnSolid}`} href="#">{site.primaryCta}</a>
            <a className={`${s.btn} ${s.btnGhost}`} href="#">{site.secondaryCta}</a>
          </div>
        </div>
      </header>
      {site.ticker && (
        <div className={s.marquee}>
          <span>
            {[...site.ticker, ...site.ticker].map((t, i) => (
              <span key={i}>{t} <i>✦</i> </span>
            ))}
          </span>
        </div>
      )}
      <ItemGrid site={site} artworks={artworks} />
      <Band site={site} artworks={artworks} index={0} />
      <Footer site={site} />
    </>
  );
}

function EditorialLayout({ site, artworks }: Props) {
  const [lead, ...rest] = site.items;
  return (
    <>
      <div className={s.edMast}>
        <span>Vol. IV · No. 12</span>
        <a className={s.navCta} href="#">{site.primaryCta}</a>
      </div>
      <div className={s.edTitleRow}>
        <h1>{site.brand}</h1>
        <p className={s.lede}>{site.lede}</p>
      </div>
      <nav className={s.edNav}>
        {site.nav.map((n) => (
          <a key={n} href="#">{n}</a>
        ))}
      </nav>
      <div className={s.edCover}>
        <Art artwork={artAt(site, artworks, 0)} palette={site.colors} seed={site.heroSeed} density={1} />
        <div className={s.edCoverCaption}>
          <div className={s.k}>{lead.eyebrow}</div>
          <h2>{lead.title}</h2>
        </div>
      </div>
      <div className={s.edStrip}>
        {rest.concat(rest.length ? [] : [lead]).map((it, i) => (
          <article key={it.seed}>
            <div className={s.edArt}>
              <Art artwork={artAt(site, artworks, i + 1)} palette={site.colors} seed={it.seed} density={2} />
            </div>
            <div className={s.k}>{it.eyebrow}</div>
            <h3>{it.title}</h3>
            <p>{it.meta}</p>
          </article>
        ))}
      </div>
      <Band site={site} artworks={artworks} index={3} />
      <Footer site={site} />
    </>
  );
}

function BoutiqueLayout({ site, artworks }: Props) {
  return (
    <>
      <Nav site={site} />
      <header className={s.boutHero}>
        <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }}>
          <Art artwork={artAt(site, artworks, 0)} palette={site.colors} seed={site.heroSeed} density={1} />
        </div>
        <div className={s.boutScrim} />
        <div className={s.boutInner}>
          <div className={s.eyebrow}>{site.eyebrow}</div>
          <h1>{renderTitle(site.title)}</h1>
          <p className={s.lede}>{site.lede}</p>
          <a className={s.boutBtn} href="#">{site.primaryCta}</a>
        </div>
      </header>
      <section className={s.collection}>
        <div className={s.collectionHead}>
          <div className={s.eyebrow}>{site.sectionSub}</div>
          <h2>{site.sectionTitle}</h2>
        </div>
        <div className={s.scents}>
          {site.items.map((it, i) => (
            <article className={s.scent} key={it.seed}>
              <div className={s.scentArt}>
                <Art artwork={artAt(site, artworks, i + 1)} palette={site.colors} seed={it.seed} density={2} />
              </div>
              <div className={s.scentBody}>
                <div className={s.n}>{it.eyebrow}</div>
                <h3>{it.title}</h3>
                <div className={s.meta}>{it.meta}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Band site={site} artworks={artworks} index={0} />
      <Footer site={site} />
    </>
  );
}
