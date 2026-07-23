import type { CSSProperties, ReactNode } from 'react';
import { TabbiedArtwork } from 'tabbied/react';
import type { ArtworkDefinition } from 'tabbied';
import type { ShowcaseSite as Site } from './showcaseData';
import { SHOWCASE_CONTENT } from './showcaseContent';
import ImageCard from './ImageCard';
import s from './ShowcaseSite.module.css';

// Color helpers (derive readable text/surfaces from the palette).
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

// Split a hero title's single {em}...{/em} span into the accent color.
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

// The i-th artwork the site declares (cycling), resolved to its definition.
function artAt(site: Site, artworks: ArtMap, i: number): ArtworkDefinition {
  const slugs = site.artworks;
  return artworks[slugs[((i % slugs.length) + slugs.length) % slugs.length]];
}

// A decorative artwork accent: cover fit (whole cells, no stretch) and, being
// decorative, it re-seeds itself on an interval so the drawing shuffles over
// time (paused off-screen and under prefers-reduced-motion by the component).
function Decor({
  def,
  palette,
  density = 1,
}: {
  def: ArtworkDefinition;
  palette: string[];
  density?: 0 | 1 | 2 | 3 | 4;
}) {
  return (
    <TabbiedArtwork
      artwork={def}
      palette={palette}
      fit="cover"
      density={density}
      redrawInterval={4200}
      className={s.doodle}
    />
  );
}

export default function ShowcaseSite({ site, artworks }: Props) {
  const { colors } = site;
  const bg = colors[0];
  const c1 = colors[1] ?? bg;
  const dark = luminance(bg) < 0.5;

  const darkest = [...colors].sort((a, b) => luminance(a) - luminance(b))[0];
  const ink = dark ? '#f5f3ef' : luminance(darkest) < 0.4 ? darkest : '#1c1e24';

  const vars: Record<string, string> = {
    '--bg': bg,
    '--c1': c1,
    '--ink': ink,
    '--onDark': '#f5f3ef',
    '--onC1': onColor(c1),
    '--card': dark ? mix(bg, '#ffffff', 0.07) : mix(bg, '#ffffff', 0.6),
    '--soft': dark ? mix(bg, '#ffffff', 0.04) : mix(bg, '#ffffff', 0.45),
    '--line': dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)',
    '--display': site.fonts.display,
    '--body': site.fonts.body,
  };

  const content = SHOWCASE_CONTENT[site.slug];

  return (
    <div className={s.site} style={vars as CSSProperties}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={site.fonts.href} precedence="default" />

      {site.layout === 'split' && <SplitHero site={site} artworks={artworks} />}
      {site.layout === 'spotlight' && <SpotlightHero site={site} artworks={artworks} />}
      {site.layout === 'editorial' && <EditorialHero site={site} artworks={artworks} />}
      {site.layout === 'boutique' && <BoutiqueHero site={site} artworks={artworks} />}

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

      {content && <About site={site} artworks={artworks} content={content} />}

      <Items site={site} artworks={artworks} content={content} />

      {content && <Features content={content} />}

      {content && <Testimonials content={content} />}

      <Band site={site} artworks={artworks} index={site.layout === 'editorial' ? 3 : 1} />

      {content && <Newsletter content={content} />}

      <Footer site={site} />
    </div>
  );
}

// ---- Shared pieces --------------------------------------------------------
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

function CtaRow({ site }: { site: Site }) {
  return (
    <div className={s.ctaRow}>
      <a className={`${s.btn} ${s.btnSolid}`} href="#">{site.primaryCta}</a>
      <a className={`${s.btn} ${s.btnGhost}`} href="#">{site.secondaryCta}</a>
    </div>
  );
}

type ContentProps = { content: NonNullable<ReturnType<typeof pickContent>> };
function pickContent(slug: string) {
  return SHOWCASE_CONTENT[slug];
}

function About({
  site,
  artworks,
  content,
}: Props & { content: ContentProps['content'] }) {
  return (
    <section className={s.about}>
      <div className={s.aboutCopy}>
        <div className={s.eyebrow}>{content.about.eyebrow}</div>
        <h2>{content.about.title}</h2>
        {content.about.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <ul className={s.points}>
          {content.about.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
      </div>
      <div className={s.aboutArt}>
        <Decor def={artAt(site, artworks, 2)} palette={site.colors} density={1} />
      </div>
    </section>
  );
}

function Items({
  site,
  content,
}: Props & { content?: ContentProps['content'] }) {
  const promptFor = (seed: string) => content?.images[seed] ?? '';
  return (
    <section className={s.section} id="items">
      <div className={s.sectionHead}>
        <h2>{site.sectionTitle}</h2>
        <p>{site.sectionSub}</p>
      </div>
      <div className={s.grid}>
        {site.items.map((it) => (
          <article className={s.card} key={it.seed}>
            <div className={s.cardMedia}>
              <ImageCard prompt={promptFor(it.seed)} colors={site.colors} />
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

function Features({ content }: ContentProps) {
  return (
    <section className={s.features}>
      <div className={s.featGrid}>
        {content.features.map((f, i) => (
          <div className={s.feat} key={f.title}>
            <div className={s.featNum}>{String(i + 1).padStart(2, '0')}</div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ content }: ContentProps) {
  return (
    <section className={s.section}>
      <div className={s.quoteGrid}>
        {content.testimonials.map((t) => (
          <figure className={s.quote} key={t.name}>
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>
              <span className={s.qName}>{t.name}</span>
              <span className={s.qRole}>{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Newsletter({ content }: ContentProps) {
  return (
    <section className={s.newsletter}>
      <div className={s.newsletterInner}>
        <h2>{content.newsletter.title}</h2>
        <p>{content.newsletter.body}</p>
        <form className={s.newsForm} action="#">
          <input type="email" placeholder={content.newsletter.placeholder} aria-label="Email" />
          <button type="submit" className={`${s.btn} ${s.btnSolid}`}>
            {content.newsletter.cta}
          </button>
        </form>
      </div>
    </section>
  );
}

function Band({ site, artworks, index = 0 }: Props & { index?: number }) {
  return (
    <section className={s.band}>
      <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }}>
        <Decor def={artAt(site, artworks, index)} palette={site.colors} density={1} />
      </div>
      <div className={s.bandScrim} />
      <div className={s.bandInner}>
        <h2>{site.bandTitle}</h2>
        <a className={`${s.btn} ${s.btnSolid}`} href="#">{site.bandCta}</a>
      </div>
    </section>
  );
}

function Footer({ site }: { site: Site }) {
  return (
    <footer className={s.footer}>
      <div className={s.footTop}>
        <span className={s.logo}>{site.brand}</span>
        <nav className={s.footNav}>
          {site.nav.map((n) => (
            <a key={n} href="#">{n}</a>
          ))}
        </nav>
      </div>
      <div className={s.footBottom}>
        <span>© 2026 {site.brand}. All rights reserved.</span>
        <span>
          {site.artworks.length} Tabbied artworks ({site.artworks.join(' · ')}) via
          the React component, {site.paletteName} palette.
        </span>
      </div>
    </footer>
  );
}

// ---- Heroes (layout-specific) ---------------------------------------------
function SplitHero({ site, artworks }: Props) {
  return (
    <>
      <Nav site={site} />
      <header className={`${s.splitHero}${site.reverse ? ` ${s.reverse}` : ''}`}>
        <div className={s.splitCopy}>
          <div className={s.eyebrow}>{site.eyebrow}</div>
          <h1>{renderTitle(site.title)}</h1>
          <p className={s.lede}>{site.lede}</p>
          <CtaRow site={site} />
        </div>
        <div className={s.splitArt}>
          <Decor def={artAt(site, artworks, 0)} palette={site.colors} density={1} />
        </div>
      </header>
    </>
  );
}

function SpotlightHero({ site, artworks }: Props) {
  return (
    <>
      <Nav site={site} />
      <header className={s.spotHero}>
        <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }}>
          <Decor def={artAt(site, artworks, 0)} palette={site.colors} density={1} />
        </div>
        <div className={s.spotScrim} />
        <div className={s.spotInner}>
          <div className={s.eyebrow}>{site.eyebrow}</div>
          <h1>{renderTitle(site.title)}</h1>
          <p className={s.lede}>{site.lede}</p>
          <div className={`${s.ctaRow} ${s.ctaCenter}`}>
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
    </>
  );
}

function EditorialHero({ site, artworks }: Props) {
  const lead = site.items[0];
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
        <Decor def={artAt(site, artworks, 0)} palette={site.colors} density={1} />
        <div className={s.edCoverCaption}>
          <div className={s.k}>{lead.eyebrow}</div>
          <h2>{lead.title}</h2>
        </div>
      </div>
    </>
  );
}

function BoutiqueHero({ site, artworks }: Props) {
  return (
    <>
      <Nav site={site} />
      <header className={s.boutHero}>
        <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }}>
          <Decor def={artAt(site, artworks, 0)} palette={site.colors} density={1} />
        </div>
        <div className={s.boutScrim} />
        <div className={s.boutInner}>
          <div className={s.eyebrow}>{site.eyebrow}</div>
          <h1>{renderTitle(site.title)}</h1>
          <p className={s.lede}>{site.lede}</p>
          <a className={s.boutBtn} href="#">{site.primaryCta}</a>
        </div>
      </header>
    </>
  );
}
