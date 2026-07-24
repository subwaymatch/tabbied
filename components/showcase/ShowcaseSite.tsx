import type { CSSProperties, ComponentType, ReactNode } from 'react';
import { TabbiedArtwork } from 'tabbied/react';
import type { ArtworkDefinition } from 'tabbied';
import {
  Sunrise, Leaf, Waves, HeartHandshake, Presentation, FlaskConical, Users, Ticket,
  Database, GraduationCap, Globe, Flame, Utensils, Flower2, Mail, Truck, ShieldCheck,
  Recycle, Mountain, Sparkles, Clock, Baby, Gem, PenTool, Droplet, Music,
} from 'lucide-react';
import type { ShowcaseSite as Site } from './showcaseData';
import { SHOWCASE_CONTENT } from './showcaseContent';
import { SHOWCASE_SECTIONS, type Kit, type SectionKey } from './showcaseSections';
import ImageCard from './ImageCard';
import s from './ShowcaseSite.module.css';

// ---- color helpers --------------------------------------------------------
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

function renderTitle(title: string): ReactNode {
  const m = title.match(/^(.*?)\{em\}(.*?)\{\/em\}(.*)$/);
  if (!m) return title;
  return (<>{m[1]}<em className={s.em}>{m[2]}</em>{m[3]}</>);
}

const ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Sunrise, Leaf, Waves, HeartHandshake, Presentation, FlaskConical, Users, Ticket,
  Database, GraduationCap, Globe, Flame, Utensils, Flower2, Mail, Truck, ShieldCheck,
  Recycle, Mountain, Sparkles, Clock, Baby, Gem, PenTool, Droplet, Music,
};

const KIT_CLASS: Record<Kit, string> = {
  soft: s.kitSoft,
  editorial: s.kitEditorial,
  brutal: s.kitBrutal,
  bordered: s.kitBordered,
  minimal: s.kitMinimal,
};

type ArtMap = Record<string, ArtworkDefinition>;
type Props = { site: Site; artworks: ArtMap };

function artAt(site: Site, artworks: ArtMap, i: number): ArtworkDefinition {
  const slugs = site.artworks;
  return artworks[slugs[((i % slugs.length) + slugs.length) % slugs.length]];
}

// Decorative accent: cover fit (no stretch), re-seeds over time.
function Decor({ def, palette, density = 1 }: { def: ArtworkDefinition; palette: string[]; density?: 0 | 1 | 2 | 3 | 4 }) {
  return <TabbiedArtwork artwork={def} palette={palette} fit="cover" density={density} redrawInterval={4200} className={s.doodle} />;
}

// ---- main -----------------------------------------------------------------
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
    '--onC1': onColor(c1),
    '--card': dark ? mix(bg, '#ffffff', 0.07) : mix(bg, '#ffffff', 0.6),
    '--soft': dark ? mix(bg, '#ffffff', 0.04) : mix(bg, '#ffffff', 0.45),
    '--line': dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)',
    '--display': site.fonts.display,
    '--body': site.fonts.body,
  };

  const content = SHOWCASE_CONTENT[site.slug];
  const sec = SHOWCASE_SECTIONS[site.slug];
  const kitClass = sec ? KIT_CLASS[sec.kit] : s.kitSoft;

  const ctx = { site, artworks, content, sec };
  const order: SectionKey[] = sec?.sections ?? ['about', 'items', 'features', 'testimonials', 'band', 'newsletter'];

  return (
    <div className={`${s.site} ${kitClass}`} style={vars as CSSProperties}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={site.fonts.href} precedence="default" />

      {site.layout === 'split' && <SplitHero site={site} artworks={artworks} />}
      {site.layout === 'spotlight' && <SpotlightHero site={site} artworks={artworks} />}
      {site.layout === 'editorial' && <EditorialHero site={site} artworks={artworks} />}
      {site.layout === 'boutique' && <BoutiqueHero site={site} artworks={artworks} />}

      {order.map((key, i) => (
        <Section key={`${key}-${i}`} k={key} {...ctx} />
      ))}

      <Footer site={site} />
    </div>
  );
}

type Ctx = { site: Site; artworks: ArtMap; content?: (typeof SHOWCASE_CONTENT)[string]; sec?: (typeof SHOWCASE_SECTIONS)[string] };

function Section({ k, site, artworks, content, sec }: Ctx & { k: SectionKey }) {
  switch (k) {
    case 'stats': return site.stats ? <Stats site={site} /> : null;
    case 'statBand': return site.stats ? <StatBand site={site} /> : null;
    case 'about': return content ? <About site={site} artworks={artworks} content={content} /> : null;
    case 'manifesto': return sec?.manifesto ? <Manifesto site={site} artworks={artworks} data={sec.manifesto} /> : null;
    case 'altRows': return sec?.altRows ? <AltRows site={site} rows={sec.altRows} /> : null;
    case 'iconFeatures': return sec?.iconFeatures ? <IconFeatures data={sec.iconFeatures} /> : null;
    case 'items': return <Items site={site} content={content} />;
    case 'gallery': return sec?.gallery ? <Gallery site={site} prompts={sec.gallery} /> : null;
    case 'features': return content ? <Features data={content.features} /> : null;
    case 'testimonials': return content ? <Testimonials data={content.testimonials} /> : null;
    case 'bigQuote': return sec?.bigQuote ? <BigQuote site={site} artworks={artworks} data={sec.bigQuote} /> : null;
    case 'faq': return sec?.faq ? <Faq data={sec.faq} /> : null;
    case 'logos': return sec?.logos ? <Logos data={sec.logos} /> : null;
    case 'band': return <Band site={site} artworks={artworks} index={site.layout === 'editorial' ? 3 : 1} />;
    case 'newsletter': return content ? <Newsletter data={content.newsletter} /> : null;
    default: return null;
  }
}

// ---- shared pieces --------------------------------------------------------
function Nav({ site }: { site: Site }) {
  return (
    <nav className={s.nav}>
      <a className={s.logo} href="#">{site.brand}</a>
      <ul className={s.navLinks}>{site.nav.map((n) => <li key={n}><a href="#">{n}</a></li>)}</ul>
      <a className={s.navCta} href="#">{site.primaryCta}</a>
    </nav>
  );
}

function CtaRow({ site, center }: { site: Site; center?: boolean }) {
  return (
    <div className={`${s.ctaRow}${center ? ` ${s.ctaCenter}` : ''}`}>
      <a className={`${s.btn} ${s.btnSolid}`} href="#">{site.primaryCta}</a>
      <a className={`${s.btn} ${s.btnGhost}`} href="#">{site.secondaryCta}</a>
    </div>
  );
}

function Stats({ site }: { site: Site }) {
  return (
    <div className={s.statStrip}>
      {site.stats!.map((st) => (
        <div key={st.l}><div className={s.statN}>{st.n}</div><div className={s.statL}>{st.l}</div></div>
      ))}
    </div>
  );
}

function StatBand({ site }: { site: Site }) {
  return (
    <section className={s.statBand}>
      {site.stats!.map((st) => (
        <div key={st.l}><div className={s.statBandN}>{st.n}</div><div className={s.statBandL}>{st.l}</div></div>
      ))}
    </section>
  );
}

function About({ site, artworks, content }: Ctx & { content: NonNullable<Ctx['content']> }) {
  return (
    <section className={s.about}>
      <div className={s.aboutCopy}>
        <div className={s.eyebrow}>{content.about.eyebrow}</div>
        <h2>{content.about.title}</h2>
        {content.about.body.map((p, i) => <p key={i}>{p}</p>)}
        <ul className={s.points}>{content.about.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
      </div>
      <div className={s.aboutArt}><Decor def={artAt(site, artworks, 2)} palette={site.colors} density={1} /></div>
    </section>
  );
}

function Manifesto({ site, artworks, data }: Ctx & { data: NonNullable<NonNullable<Ctx['sec']>['manifesto']> }) {
  return (
    <section className={s.manifesto}>
      <div className={s.abs} style={{ opacity: 0.16 }}><Decor def={artAt(site, artworks, 2)} palette={site.colors} density={1} /></div>
      <div className={s.manifestoInner}>
        <div className={s.eyebrow}>{data.kicker}</div>
        <p>{data.text}</p>
      </div>
    </section>
  );
}

function AltRows({ site, rows }: { site: Site; rows: NonNullable<NonNullable<Ctx['sec']>['altRows']> }) {
  return (
    <section className={s.altRows}>
      {rows.map((r, i) => (
        <div className={`${s.altRow}${i % 2 ? ` ${s.altRowRev}` : ''}`} key={r.title}>
          <div className={s.altCopy}>
            <div className={s.eyebrow}>{r.eyebrow}</div>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
          </div>
          <div className={s.altMedia}><ImageCard prompt={r.image} colors={site.colors} /></div>
        </div>
      ))}
    </section>
  );
}

function IconFeatures({ data }: { data: NonNullable<NonNullable<Ctx['sec']>['iconFeatures']> }) {
  return (
    <section className={s.iconFeat}>
      <div className={s.iconGrid}>
        {data.map((f) => {
          const Ico = ICONS[f.icon] ?? Sparkles;
          return (
            <div className={s.iconItem} key={f.title}>
              <span className={s.iconWrap}><Ico size={24} strokeWidth={1.75} /></span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Items({ site, content }: { site: Site; content?: Ctx['content'] }) {
  const promptFor = (seed: string) => content?.images[seed] ?? '';
  return (
    <section className={s.section} id="items">
      <div className={s.sectionHead}><h2>{site.sectionTitle}</h2><p>{site.sectionSub}</p></div>
      <div className={s.grid}>
        {site.items.map((it) => (
          <article className={s.card} key={it.seed}>
            <div className={s.cardMedia}><ImageCard prompt={promptFor(it.seed)} colors={site.colors} /></div>
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

function Gallery({ site, prompts }: { site: Site; prompts: string[] }) {
  return (
    <section className={s.gallery}>
      <div className={s.galleryGrid}>
        {prompts.map((p, i) => (
          <div className={s.galleryCell} key={i}><ImageCard prompt={p} colors={site.colors} /></div>
        ))}
      </div>
    </section>
  );
}

function Features({ data }: { data: NonNullable<Ctx['content']>['features'] }) {
  return (
    <section className={s.features}>
      <div className={s.featGrid}>
        {data.map((f, i) => (
          <div className={s.feat} key={f.title}>
            <div className={s.featNum}>{String(i + 1).padStart(2, '0')}</div>
            <h3>{f.title}</h3><p>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: NonNullable<Ctx['content']>['testimonials'] }) {
  return (
    <section className={s.section}>
      <div className={s.quoteGrid}>
        {data.map((t) => (
          <figure className={s.quote} key={t.name}>
            <blockquote>“{t.quote}”</blockquote>
            <figcaption><span className={s.qName}>{t.name}</span><span className={s.qRole}>{t.role}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function BigQuote({ site, artworks, data }: Ctx & { data: NonNullable<NonNullable<Ctx['sec']>['bigQuote']> }) {
  return (
    <section className={s.bigQuote}>
      <div className={s.abs} style={{ opacity: 0.18 }}><Decor def={artAt(site, artworks, 3)} palette={site.colors} density={1} /></div>
      <div className={s.bigQuoteScrim} />
      <figure className={s.bigQuoteInner}>
        <blockquote>“{data.quote}”</blockquote>
        <figcaption>{data.name}, <span>{data.role}</span></figcaption>
      </figure>
    </section>
  );
}

function Faq({ data }: { data: NonNullable<NonNullable<Ctx['sec']>['faq']> }) {
  return (
    <section className={s.section}>
      <div className={s.faqHead}><h2>Questions</h2></div>
      <div className={s.faqList}>
        {data.map((f) => (
          <details className={s.faqItem} key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Logos({ data }: { data: string[] }) {
  return (
    <section className={s.logos}>
      <span className={s.logosLabel}>As seen in</span>
      <div className={s.logosRow}>{data.map((n) => <span key={n}>{n}</span>)}</div>
    </section>
  );
}

function Newsletter({ data }: { data: NonNullable<Ctx['content']>['newsletter'] }) {
  return (
    <section className={s.newsletter}>
      <div className={s.newsletterInner}>
        <h2>{data.title}</h2>
        <p>{data.body}</p>
        <form className={s.newsForm} action="#">
          <input type="email" placeholder={data.placeholder} aria-label="Email" />
          <button type="submit" className={`${s.btn} ${s.btnSolid}`}>{data.cta}</button>
        </form>
      </div>
    </section>
  );
}

function Band({ site, artworks, index = 0 }: Ctx & { index?: number }) {
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
        <nav className={s.footNav}>{site.nav.map((n) => <a key={n} href="#">{n}</a>)}</nav>
      </div>
      <div className={s.footBottom}>
        <span>© 2026 {site.brand}. All rights reserved.</span>
        <span>{site.artworks.length} Tabbied artworks ({site.artworks.join(' · ')}) via the React component, {site.paletteName} palette.</span>
      </div>
    </footer>
  );
}

// ---- heroes ---------------------------------------------------------------
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
        <div className={s.splitArt}><Decor def={artAt(site, artworks, 0)} palette={site.colors} density={1} /></div>
      </header>
    </>
  );
}

function SpotlightHero({ site, artworks }: Props) {
  return (
    <>
      <Nav site={site} />
      <header className={s.spotHero}>
        <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }}><Decor def={artAt(site, artworks, 0)} palette={site.colors} density={1} /></div>
        <div className={s.spotScrim} />
        <div className={s.spotInner}>
          <div className={s.eyebrow}>{site.eyebrow}</div>
          <h1>{renderTitle(site.title)}</h1>
          <p className={s.lede}>{site.lede}</p>
          <CtaRow site={site} center />
        </div>
      </header>
      {site.ticker && (
        <div className={s.marquee}>
          <span>{[...site.ticker, ...site.ticker].map((t, i) => <span key={i}>{t} <i>✦</i> </span>)}</span>
        </div>
      )}
    </>
  );
}

function EditorialHero({ site, artworks }: Props) {
  const lead = site.items[0];
  return (
    <>
      <div className={s.edMast}><span>Vol. IV · No. 12</span><a className={s.navCta} href="#">{site.primaryCta}</a></div>
      <div className={s.edTitleRow}><h1>{site.brand}</h1><p className={s.lede}>{site.lede}</p></div>
      <nav className={s.edNav}>{site.nav.map((n) => <a key={n} href="#">{n}</a>)}</nav>
      <div className={s.edCover}>
        <Decor def={artAt(site, artworks, 0)} palette={site.colors} density={1} />
        <div className={s.edCoverCaption}><div className={s.k}>{lead.eyebrow}</div><h2>{lead.title}</h2></div>
      </div>
    </>
  );
}

function BoutiqueHero({ site, artworks }: Props) {
  return (
    <>
      <Nav site={site} />
      <header className={s.boutHero}>
        <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }}><Decor def={artAt(site, artworks, 0)} palette={site.colors} density={1} /></div>
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
