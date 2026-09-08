import { Fragment } from 'react';
import type { CSSProperties, ComponentType, ReactNode } from 'react';
import { TabbiedPattern } from 'tabbied/react';
import type { PatternDefinition } from 'tabbied';
import { derivePaletteProperties, parseEmphasis } from 'tabbied-templates';
import {
  Sunrise, Leaf, Waves, HeartHandshake, Presentation, FlaskConical, Users, Ticket,
  Database, GraduationCap, Globe, Flame, Utensils, Flower2, Mail, Truck, ShieldCheck,
  Recycle, Mountain, Sparkles, Clock, Baby, Gem, PenTool, Droplet, Music,
} from 'lucide-react';
import type { TemplateSite as Site } from './templateData';
import { TEMPLATE_CONTENT } from './templateContent';
import { TEMPLATE_SECTIONS, type Kit, type SectionKey } from './templateSections';
import ImageCard from './ImageCard';
import s from './TemplateSite.module.css';

// Stable id for one image slot, shared with the batch pipeline: it is the
// custom_id sent to the API and the filename that comes back, so a finished
// image finds its way home without a lookup table. Keep it in step with
// scripts/images/extract-prompts.mjs if the slot naming ever changes.
const imageId = (
  site: Site,
  slot: 'hero' | 'about' | 'card' | 'alt' | 'gallery' | 'team',
  i: number
) =>
  `react__${site.slug}__${slot}-${i}`;

// ---- editable slots -------------------------------------------------------
// The `data-edit*` attributes below are the editable-section contract: they
// name the parts of this page a person or an agent may change, and they are
// read back out of the static export to generate the template's spec (see
// docs/editable-templates.md). Five sites share this component, so annotating
// it once annotates all five.
//
// The palette roles a pattern field follows. A field drawn on the page's own
// ground takes the whole palette; one drawn *over* something keeps
// `transparent` in colour0 - that literal is what leaves real negative space
// for the photograph underneath, so it must never be re-coloured.
const fullRoles = (site: Site) => site.colors.map((_, i) => i).join(',');
const overlayRoles = (site: Site) =>
  ['transparent', ...site.colors.slice(1).map((_, i) => i + 1)].join(',');

function renderTitle(title: string): ReactNode {
  const segments = parseEmphasis(title);

  if (!segments.some((segment) => segment.emphasis)) return title;

  return (
    <>
      {segments.map((segment, i) =>
        segment.emphasis ? (
          <em key={i} className={s.em}>{segment.text}</em>
        ) : (
          // A keyed Fragment renders no element, so the markup is exactly what
          // the single-accent regex this replaced produced: text, <em>, text.
          <Fragment key={i}>{segment.text}</Fragment>
        )
      )}
    </>
  );
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

type ArtMap = Record<string, PatternDefinition>;
type Props = { site: Site; patterns: ArtMap };
type HeroProps = Props & { heroImage?: string; overlay?: string };

function artAt(site: Site, patterns: ArtMap, i: number): PatternDefinition {
  const slugs = site.patterns;
  return patterns[slugs[((i % slugs.length) + slugs.length) % slugs.length]];
}

// Decorative accent: cover fit (no stretch), re-seeds over time.
function Decor({ def, palette, density = 1 }: { def: PatternDefinition; palette: string[]; density?: 0 | 1 | 2 | 3 | 4 }) {
  return <TabbiedPattern pattern={def} palette={palette} fit="cover" density={density} redrawInterval={4200} className={s.doodle} />;
}

// ---- main -----------------------------------------------------------------
export default function TemplateSite({ site, patterns }: Props) {
  const { colors } = site;

  // Colour enters the page exactly once, here, as custom properties. The
  // derivation moved into `tabbied-templates` because applyEdits has to
  // recompute these same variables when somebody re-colours a downloaded copy:
  // `--ink` and the card tints are functions of the palette rather than
  // members of it, and a second implementation of that maths is how a
  // re-coloured page ends up with body copy nobody can read.
  const vars: Record<string, string> = {
    ...derivePaletteProperties(colors, 'templateSite', {
      // A flat-section site drops the alternating band tone entirely: every
      // section sits on the page colour, and rhythm comes from spacing alone.
      flatSections: site.flatSections,
    }),
    '--display': site.fonts.display,
    '--body': site.fonts.body,
    ...(site.tracking ? { '--tracking': site.tracking } : {}),
  };

  const content = TEMPLATE_CONTENT[site.slug];
  const sec = TEMPLATE_SECTIONS[site.slug];
  const kitClass = sec ? KIT_CLASS[sec.kit] : s.kitSoft;

  const ctx = { site, patterns, content, sec };
  const heroProps: HeroProps = {
    site,
    patterns,
    heroImage: sec?.heroImage,
    overlay: sec?.heroOverlayPattern,
  };
  const order: SectionKey[] = sec?.sections ?? ['about', 'items', 'features', 'testimonials', 'band', 'newsletter'];

  return (
    <div
      className={`${s.site} ${kitClass}`}
      style={vars as CSSProperties}
      // Names the palette derivation, so a page is self-describing: re-colouring
      // a packaged copy needs the markup and the new colours, nothing else.
      data-edit-root="templateSite"
      {...(site.flatSections ? { 'data-edit-flat': '' } : {})}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={site.fonts.href} precedence="default" />

      {site.layout === 'split' && <SplitHero {...heroProps} />}
      {site.layout === 'spotlight' && <SpotlightHero {...heroProps} />}
      {site.layout === 'editorial' && <EditorialHero {...heroProps} />}
      {site.layout === 'boutique' && <BoutiqueHero {...heroProps} />}

      {order.map((key, i) => (
        <Section key={`${key}-${i}`} k={key} {...ctx} />
      ))}

      <Footer site={site} />
    </div>
  );
}

type Ctx = { site: Site; patterns: ArtMap; content?: (typeof TEMPLATE_CONTENT)[string]; sec?: (typeof TEMPLATE_SECTIONS)[string] };

function Section({ k, site, patterns, content, sec }: Ctx & { k: SectionKey }) {
  switch (k) {
    case 'stats': return site.stats ? <Stats site={site} /> : null;
    case 'statBand': return site.stats ? <StatBand site={site} /> : null;
    case 'about': return content ? <About site={site} patterns={patterns} content={content} /> : null;
    case 'manifesto': return sec?.manifesto ? <Manifesto site={site} patterns={patterns} data={sec.manifesto} /> : null;
    case 'altRows': return sec?.altRows ? <AltRows site={site} rows={sec.altRows} /> : null;
    case 'iconFeatures': return sec?.iconFeatures ? <IconFeatures data={sec.iconFeatures} /> : null;
    case 'items': return <Items site={site} content={content} />;
    case 'process': return sec?.process ? <Process data={sec.process} /> : null;
    case 'pricing': return sec?.pricing ? <Pricing data={sec.pricing} /> : null;
    case 'specs': return sec?.specs ? <Specs data={sec.specs} /> : null;
    case 'team': return sec?.team ? <Team site={site} patterns={patterns} data={sec.team} /> : null;
    case 'gallery': return sec?.gallery ? <Gallery site={site} prompts={sec.gallery} /> : null;
    case 'features': return content ? <Features data={content.features} /> : null;
    case 'testimonials': return content ? <Testimonials data={content.testimonials} /> : null;
    case 'bigQuote': return sec?.bigQuote ? <BigQuote site={site} patterns={patterns} data={sec.bigQuote} /> : null;
    case 'faq': return sec?.faq ? <Faq data={sec.faq} /> : null;
    case 'logos': return sec?.logos ? <Logos data={sec.logos} /> : null;
    case 'band': return <Band site={site} patterns={patterns} index={site.layout === 'editorial' ? 3 : 1} />;
    case 'newsletter': return content ? <Newsletter data={content.newsletter} /> : null;
    default: return null;
  }
}

// ---- shared pieces --------------------------------------------------------
function Nav({ site }: { site: Site }) {
  return (
    <nav className={s.nav}>
      <a className={s.logo} href="#" data-edit="brand.name" data-edit-copy="brandName" data-edit-max="24">{site.brand}</a>
      <ul className={s.navLinks}>
        {site.nav.map((n, i) => (
          <li key={n}><a href="#" data-edit={`nav.${i}`} data-edit-max="18">{n}</a></li>
        ))}
      </ul>
      <a className={s.navCta} href="#" data-edit="cta.primary" data-edit-max="20">{site.primaryCta}</a>
    </nav>
  );
}

function CtaRow({ site, center }: { site: Site; center?: boolean }) {
  return (
    <div className={`${s.ctaRow}${center ? ` ${s.ctaCenter}` : ''}`}>
      <a className={`${s.btn} ${s.btnSolid}`} href="#" data-edit="cta.primary" data-edit-max="20">{site.primaryCta}</a>
      <a className={`${s.btn} ${s.btnGhost}`} href="#" data-edit="cta.secondary" data-edit-max="20">{site.secondaryCta}</a>
    </div>
  );
}

function Stats({ site }: { site: Site }) {
  return (
    <div className={s.statStrip}>
      {site.stats!.map((st, i) => (
        <div key={st.l}><div className={s.statN} data-edit={`stats.${i}.n`} data-edit-max="8">{st.n}</div><div className={s.statL} data-edit={`stats.${i}.l`} data-edit-max="32">{st.l}</div></div>
      ))}
    </div>
  );
}

function StatBand({ site }: { site: Site }) {
  return (
    <section className={s.statBand}>
      {site.stats!.map((st, i) => (
        <div key={st.l}><div className={s.statBandN} data-edit={`stats.${i}.n`} data-edit-max="8">{st.n}</div><div className={s.statBandL} data-edit={`stats.${i}.l`} data-edit-max="32">{st.l}</div></div>
      ))}
    </section>
  );
}

function About({ site, patterns, content }: Ctx & { content: NonNullable<Ctx['content']> }) {
  return (
    <section className={s.about}>
      <div className={s.aboutCopy}>
        <div className={s.eyebrow} data-edit="about.eyebrow" data-edit-max="28">{content.about.eyebrow}</div>
        <h2 data-edit="about.title" data-edit-max="70">{content.about.title}</h2>
        {content.about.body.map((p, i) => (
          <p key={i} data-edit={`about.body.${i}`} data-edit-multiline data-edit-max="320">{p}</p>
        ))}
        <ul className={s.points}>
          {content.about.points.map((pt, i) => (
            <li key={pt} data-edit={`about.points.${i}`} data-edit-max="60">{pt}</li>
          ))}
        </ul>
      </div>
      <div
        className={s.aboutArt}
        {...(content.aboutImage
          ? {}
          : { 'data-edit-pattern': 'about.field', 'data-edit-roles': fullRoles(site) })}
      >
        {content.aboutImage ? (
          <ImageCard editId="about.photo" id={imageId(site, 'about', 0)} prompt={content.aboutImage} colors={site.colors} />
        ) : (
          <Decor def={artAt(site, patterns, 2)} palette={site.colors} density={1} />
        )}
      </div>
    </section>
  );
}

function Manifesto({ site, patterns, data }: Ctx & { data: NonNullable<NonNullable<Ctx['sec']>['manifesto']> }) {
  return (
    <section className={s.manifesto}>
      <div className={s.abs} style={{ opacity: 0.16 }} data-edit-pattern="manifesto.field" data-edit-roles={fullRoles(site)}><Decor def={artAt(site, patterns, 2)} palette={site.colors} density={1} /></div>
      <div className={s.manifestoInner}>
        <div className={s.eyebrow} data-edit="manifesto.kicker" data-edit-max="28">{data.kicker}</div>
        <p data-edit="manifesto.text" data-edit-multiline data-edit-max="280">{data.text}</p>
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
            <div className={s.eyebrow} data-edit={`altRows.${i}.eyebrow`} data-edit-max="28">{r.eyebrow}</div>
            <h3 data-edit={`altRows.${i}.title`} data-edit-max="60">{r.title}</h3>
            <p data-edit={`altRows.${i}.body`} data-edit-multiline data-edit-max="240">{r.body}</p>
          </div>
          <div className={s.altMedia}>
            <ImageCard editId={`altRows.${i}.photo`} id={imageId(site, 'alt', i)} prompt={r.image} colors={site.colors} />
          </div>
        </div>
      ))}
    </section>
  );
}

function IconFeatures({ data }: { data: NonNullable<NonNullable<Ctx['sec']>['iconFeatures']> }) {
  return (
    <section className={s.iconFeat}>
      <div className={s.iconGrid}>
        {data.map((f, i) => {
          const Ico = ICONS[f.icon] ?? Sparkles;
          return (
            <div className={s.iconItem} key={f.title}>
              <span className={s.iconWrap}><Ico size={24} strokeWidth={1.75} /></span>
              <h3 data-edit={`iconFeatures.${i}.title`} data-edit-max="40">{f.title}</h3>
              <p data-edit={`iconFeatures.${i}.body`} data-edit-multiline data-edit-max="160">{f.body}</p>
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
      <SectionHead slot="items" kicker={site.sectionKicker} title={site.sectionTitle} sub={site.sectionSub} />
      <div className={s.grid}>
        {site.items.map((it, i) => (
          <article className={s.card} key={it.seed}>
            <div className={s.cardMedia}>
              <ImageCard editId={`items.${i}.photo`} id={imageId(site, 'card', i)} prompt={promptFor(it.seed)} colors={site.colors} />
            </div>
            <div className={s.cardBody}>
              <div className={s.cardEyebrow} data-edit={`items.${i}.eyebrow`} data-edit-max="24">{it.eyebrow}</div>
              <h3 data-edit={`items.${i}.title`} data-edit-max="48">{it.title}</h3>
              <div className={s.cardMeta} data-edit={`items.${i}.meta`} data-edit-max="48">{it.meta}</div>
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
          <div className={s.galleryCell} key={i}>
            <ImageCard editId={`gallery.${i}.photo`} id={imageId(site, 'gallery', i)} prompt={p} colors={site.colors} />
          </div>
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
            <h3 data-edit={`features.${i}.title`} data-edit-max="40">{f.title}</h3>
            <p data-edit={`features.${i}.body`} data-edit-multiline data-edit-max="180">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// One header treatment for every section: kicker, title, and a supporting line
// sitting on a hairline. Consistency here is what stops the page reading as a
// pile of unrelated blocks.
function SectionHead({ kicker, title, sub, slot }: { kicker?: string; title: string; sub?: string; slot?: string }) {
  // `slot` namespaces this header's ids: several sections share this component,
  // so the prefix is what keeps "the items heading" and "the pricing heading"
  // distinct editable things.
  return (
    <div className={s.sectionHead}>
      <div>
        {kicker ? <span className={s.sectionIndex} {...(slot ? { 'data-edit': `${slot}.kicker`, 'data-edit-max': '28' } : {})}>{kicker}</span> : null}
        <h2 {...(slot ? { 'data-edit': `${slot}.title`, 'data-edit-max': '60' } : {})}>{title}</h2>
      </div>
      {sub ? <p {...(slot ? { 'data-edit': `${slot}.sub`, 'data-edit-multiline': '', 'data-edit-max': '200' } : {})}>{sub}</p> : <span />}
    </div>
  );
}

function Testimonials({ data }: { data: NonNullable<Ctx['content']>['testimonials'] }) {
  return (
    <section className={s.section}>
      <SectionHead slot="testimonials" kicker="Word of mouth" title="What people say" />
      <div className={s.quoteGrid}>
        {data.map((t, i) => (
          <figure className={s.quote} key={t.name}>
            <blockquote data-edit={`testimonials.${i}.quote`} data-edit-multiline data-edit-max="220">"{t.quote}"</blockquote>
            <figcaption><span className={s.qName} data-edit={`testimonials.${i}.name`} data-edit-max="32">{t.name}</span><span className={s.qRole} data-edit={`testimonials.${i}.role`} data-edit-max="40">{t.role}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Process({ data }: { data: NonNullable<NonNullable<Ctx['sec']>['process']> }) {
  return (
    <section className={s.panel}>
      <div className={s.process}>
      <SectionHead slot="process" kicker={data.kicker} title={data.title} sub={data.sub} />
      <div className={s.processGrid}>
        {data.steps.map((st, i) => (
          <div className={s.step} key={st.title}>
            <div className={s.stepNum}>{String(i + 1).padStart(2, '0')}</div>
            <h3 data-edit={`process.steps.${i}.title`} data-edit-max="40">{st.title}</h3>
            <p data-edit={`process.steps.${i}.body`} data-edit-multiline data-edit-max="180">{st.body}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

function Pricing({ data }: { data: NonNullable<NonNullable<Ctx['sec']>['pricing']> }) {
  return (
    <section className={s.pricing}>
      <SectionHead slot="pricing" kicker={data.kicker} title={data.title} sub={data.sub} />
      <div className={s.tierGrid}>
        {data.tiers.map((t, i) => (
          <div className={`${s.tier}${t.featured ? ` ${s.tierFeatured}` : ''}`} key={t.name}>
            <div className={s.tierName} data-edit={`pricing.tiers.${i}.name`} data-edit-max="24">{t.name}</div>
            <div className={s.tierPrice}><span data-edit={`pricing.tiers.${i}.price`} data-edit-max="12">{t.price}</span> <span data-edit={`pricing.tiers.${i}.unit`} data-edit-max="16">{t.unit}</span></div>
            <p className={s.tierBody} data-edit={`pricing.tiers.${i}.body`} data-edit-multiline data-edit-max="160">{t.body}</p>
            <ul className={s.tierList}>{t.includes.map((f, j) => <li key={f} data-edit={`pricing.tiers.${i}.includes.${j}`} data-edit-max="60">{f}</li>)}</ul>
            <a className={s.tierCta} href="#" data-edit={`pricing.tiers.${i}.cta`} data-edit-max="20">{t.cta}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Specs({ data }: { data: NonNullable<NonNullable<Ctx['sec']>['specs']> }) {
  return (
    <section className={s.panel}>
      <div className={s.specs}>
      <SectionHead slot="specs" kicker={data.kicker} title={data.title} sub={data.sub} />
      <div>
        {data.rows.map((r, i) => (
          <div className={s.specRow} key={r.k}>
            <div className={s.specK} data-edit={`specs.rows.${i}.k`} data-edit-max="32">{r.k}</div>
            <p className={s.specV} data-edit={`specs.rows.${i}.v`} data-edit-multiline data-edit-max="200">{r.v}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

// Portraits are the site's own pattern, re-seeded per person, which is the
// point of the template: the generative system carries the brand everywhere.
/**
 * The prompt for one portrait: the team's shared scene, this person's role, and
 * their authored `look`.
 *
 * The `look` is not decoration. Prompting on role and scene alone returned the
 * same face for all twenty-four people - leaving appearance unsaid does not
 * produce a varied cast, it just hands the casting to the model's default. It
 * is authored per person rather than inferred from a name, which would be
 * guessing someone's gender and ethnicity from its spelling.
 *
 * "Exactly one person" is explicit because these prompts otherwise return spare
 * bodies and extra hands.
 */
const portraitPrompt = (role: string, look: string, scene: string) =>
  `A natural, candid waist-up portrait of ${look}, working as a ${role.toLowerCase()}, ${scene}. ` +
  'Exactly one person in the frame, facing the camera with a relaxed expression, both hands visible or out of shot. ' +
  'Soft natural light, shallow depth of field, high detail, no text or logos.';

function Team({ site, data }: Ctx & { data: NonNullable<NonNullable<Ctx['sec']>['team']> }) {
  return (
    <section className={s.team}>
      <SectionHead slot="team" kicker={data.kicker} title={data.title} sub={data.sub} />
      <div className={s.teamGrid}>
        {data.people.map((p, i) => (
          <div key={p.name}>
            <div className={s.teamArt}>
              <ImageCard
                editId={`team.${i}.photo`}
                id={imageId(site, 'team', i)}
                prompt={portraitPrompt(p.role, p.look, data.portraitScene)}
                colors={site.colors}
              />
            </div>
            <h3 className={s.teamName} data-edit={`team.${i}.name`} data-edit-max="32">{p.name}</h3>
            <div className={s.teamRole} data-edit={`team.${i}.role`} data-edit-max="40">{p.role}</div>
            <p className={s.teamBio} data-edit={`team.${i}.bio`} data-edit-multiline data-edit-max="200">{p.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BigQuote({ site, patterns, data }: Ctx & { data: NonNullable<NonNullable<Ctx['sec']>['bigQuote']> }) {
  return (
    <section className={s.bigQuote}>
      <div className={s.abs} style={{ opacity: 0.18 }} data-edit-pattern="bigQuote.field" data-edit-roles={fullRoles(site)}><Decor def={artAt(site, patterns, 3)} palette={site.colors} density={1} /></div>
      <div className={s.bigQuoteScrim} />
      <figure className={s.bigQuoteInner}>
        <blockquote data-edit="bigQuote.quote" data-edit-multiline data-edit-max="260">"{data.quote}"</blockquote>
        <figcaption><span data-edit="bigQuote.name" data-edit-max="32">{data.name}</span>, <span data-edit="bigQuote.role" data-edit-max="40">{data.role}</span></figcaption>
      </figure>
    </section>
  );
}

function Faq({ data }: { data: NonNullable<NonNullable<Ctx['sec']>['faq']> }) {
  return (
    <section className={s.section}>
      <SectionHead slot="faq" kicker="Before you ask" title="Questions" />
      <div className={s.faqList}>
        {data.map((f, i) => (
          <details className={s.faqItem} key={f.q}>
            <summary data-edit={`faq.${i}.q`} data-edit-max="80">{f.q}</summary>
            <p data-edit={`faq.${i}.a`} data-edit-multiline data-edit-max="280">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Logos({ data }: { data: string[] }) {
  return (
    <section className={s.logos}>
      <span className={s.logosLabel} data-edit="logos.label" data-edit-max="24">As seen in</span>
      <div className={s.logosRow}>{data.map((n, i) => <span key={n} data-edit={`logos.${i}`} data-edit-max="24">{n}</span>)}</div>
    </section>
  );
}

function Newsletter({ data }: { data: NonNullable<Ctx['content']>['newsletter'] }) {
  return (
    <section className={s.newsletter}>
      <div className={s.newsletterInner}>
        <h2 data-edit="newsletter.title" data-edit-max="60">{data.title}</h2>
        <p data-edit="newsletter.body" data-edit-multiline data-edit-max="200">{data.body}</p>
        <form className={s.newsForm} action="#">
          <input type="email" placeholder={data.placeholder} aria-label="Email" />
          <button type="submit" className={`${s.btn} ${s.btnSolid}`} data-edit="newsletter.cta" data-edit-max="20">{data.cta}</button>
        </form>
      </div>
    </section>
  );
}

function Band({ site, patterns, index = 0 }: Ctx & { index?: number }) {
  return (
    <section className={s.band}>
      <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }} data-edit-pattern="band.field" data-edit-roles={fullRoles(site)}>
        <Decor def={artAt(site, patterns, index)} palette={site.colors} density={1} />
      </div>
      <div className={s.bandScrim} />
      <div className={s.bandInner}>
        <h2 data-edit="band.title" data-edit-max="60">{site.bandTitle}</h2>
        <a className={`${s.btn} ${s.btnSolid}`} href="#" data-edit="band.cta" data-edit-max="20">{site.bandCta}</a>
      </div>
    </section>
  );
}

function Footer({ site }: { site: Site }) {
  return (
    <footer className={s.footer}>
      <div className={s.footTop}>
        <span className={s.logo} data-edit="brand.name" data-edit-copy="brandName" data-edit-max="24">{site.brand}</span>
        <nav className={s.footNav}>{site.nav.map((n, i) => <a key={n} href="#" data-edit={`nav.${i}`} data-edit-max="18">{n}</a>)}</nav>
      </div>
      <div className={s.footBottom}>
        <span>© 2026 <span data-edit="brand.name" data-edit-copy="brandName" data-edit-max="24">{site.brand}</span>. All rights reserved.</span>
        <span>{site.patterns.length} Tabbied patterns ({site.patterns.join(' · ')}) via the React component, {site.paletteName} palette.</span>
      </div>
    </footer>
  );
}

// ---- heroes ---------------------------------------------------------------
function SplitHero({ site, patterns, heroImage, overlay }: HeroProps) {
  return (
    <>
      <Nav site={site} />
      <header className={`${s.splitHero}${site.reverse ? ` ${s.reverse}` : ''}`}>
        <div className={s.splitCopy}>
          <div className={s.eyebrow} data-edit="hero.eyebrow" data-edit-max="28">{site.eyebrow}</div>
          <h1 data-edit="hero.title" data-edit-copy="headline" data-edit-format="emphasis" data-edit-max="70">{renderTitle(site.title)}</h1>
          <p className={s.lede} data-edit="hero.lede" data-edit-copy="tagline" data-edit-multiline data-edit-max="200">{site.lede}</p>
          <CtaRow site={site} />
        </div>
        <div className={s.splitArt} data-edit-pattern="hero.field" data-edit-roles={heroImage ? overlayRoles(site) : fullRoles(site)}>
          <HeroArt site={site} patterns={patterns} heroImage={heroImage} overlay={overlay} />
        </div>
      </header>
    </>
  );
}

/**
 * Whatever fills a hero's art panel: the site's pattern on its own, or - when
 * the site supplies a `heroImage` prompt - a generated photograph with an
 * pattern drawn across it. Every layout renders this, so the photograph is a
 * per-site choice rather than something only one hero shape supports.
 *
 * The overlay is drawn at full opacity with no blend mode. What makes the
 * photograph readable underneath is `transparent` in color0, the pattern's
 * background slot: the design's own marks land opaquely and everything it would
 * otherwise fill is left as real negative space. That only works for a sparse
 * design, which is why the site names its overlay (`heroOverlayPattern`) rather
 * than taking whatever is to hand. Density is the coarsest authored level, so
 * what crosses the picture is a few large shapes rather than a texture.
 */
function HeroArt({ site, patterns, heroImage, overlay }: HeroProps) {
  if (!heroImage) {
    return <Decor def={artAt(site, patterns, 0)} palette={site.colors} density={1} />;
  }

  const def = (overlay && patterns[overlay]) ?? artAt(site, patterns, site.patterns.length - 1);

  return (
    <>
      <ImageCard editId="hero.photo" id={imageId(site, 'hero', 0)} prompt={heroImage} colors={site.colors} />
      <div className={s.heroPattern} aria-hidden="true">
        <Decor def={def} palette={['transparent', ...site.colors.slice(1)]} density={0} />
      </div>
    </>
  );
}

function SpotlightHero({ site, patterns, heroImage, overlay }: HeroProps) {
  return (
    <>
      <Nav site={site} />
      <header className={s.spotHero}>
        <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }} data-edit-pattern="hero.field" data-edit-roles={heroImage ? overlayRoles(site) : fullRoles(site)}>
          <HeroArt site={site} patterns={patterns} heroImage={heroImage} overlay={overlay} />
        </div>
        <div className={s.spotScrim} />
        <div className={s.spotInner}>
          <div className={s.eyebrow} data-edit="hero.eyebrow" data-edit-max="28">{site.eyebrow}</div>
          <h1 data-edit="hero.title" data-edit-copy="headline" data-edit-format="emphasis" data-edit-max="70">{renderTitle(site.title)}</h1>
          <p className={s.lede} data-edit="hero.lede" data-edit-copy="tagline" data-edit-multiline data-edit-max="200">{site.lede}</p>
          <CtaRow site={site} center />
        </div>
      </header>
      {site.ticker && (
        <div className={s.marquee}>
          {/* The ticker is printed twice to make the marquee loop, so its words
              are not annotated: one id cannot describe two elements that are
              deliberately the same text in different positions. */}
          <span>{[...site.ticker, ...site.ticker].map((t, i) => <span key={i}>{t} <i>&#x2726;</i> </span>)}</span>
        </div>
      )}
    </>
  );
}

function EditorialHero({ site, patterns, heroImage, overlay }: HeroProps) {
  const lead = site.items[0];
  return (
    <>
      <div className={s.edMast}><span>Vol. IV · No. 12</span><a className={s.navCta} href="#" data-edit="cta.primary" data-edit-max="20">{site.primaryCta}</a></div>
      <div className={s.edTitleRow}><h1 data-edit="brand.name" data-edit-copy="brandName" data-edit-max="24">{site.brand}</h1><p className={s.lede} data-edit="hero.lede" data-edit-copy="tagline" data-edit-multiline data-edit-max="200">{site.lede}</p></div>
      <nav className={s.edNav}>{site.nav.map((n, i) => <a key={n} href="#" data-edit={`nav.${i}`} data-edit-max="18">{n}</a>)}</nav>
      <div className={s.edCover} data-edit-pattern="hero.field" data-edit-roles={heroImage ? overlayRoles(site) : fullRoles(site)}>
        <HeroArt site={site} patterns={patterns} heroImage={heroImage} overlay={overlay} />
        {/* The cover caption mirrors the first item card, so it shares that
            card's ids rather than minting a second name for the same copy. */}
        <div className={s.edCoverCaption}><div className={s.k} data-edit="items.0.eyebrow" data-edit-max="24">{lead.eyebrow}</div><h2 data-edit="items.0.title" data-edit-max="48">{lead.title}</h2></div>
      </div>
    </>
  );
}

function BoutiqueHero({ site, patterns, heroImage, overlay }: HeroProps) {
  return (
    <>
      <Nav site={site} />
      <header className={s.boutHero}>
        <div className={s.doodleBox} style={{ position: 'absolute', inset: 0 }} data-edit-pattern="hero.field" data-edit-roles={heroImage ? overlayRoles(site) : fullRoles(site)}>
          <HeroArt site={site} patterns={patterns} heroImage={heroImage} overlay={overlay} />
        </div>
        <div className={s.boutScrim} />
        <div className={s.boutInner}>
          <div className={s.eyebrow} data-edit="hero.eyebrow" data-edit-max="28">{site.eyebrow}</div>
          <h1 data-edit="hero.title" data-edit-copy="headline" data-edit-format="emphasis" data-edit-max="70">{renderTitle(site.title)}</h1>
          <p className={s.lede} data-edit="hero.lede" data-edit-copy="tagline" data-edit-multiline data-edit-max="200">{site.lede}</p>
          <a className={s.boutBtn} href="#" data-edit="cta.primary" data-edit-max="20">{site.primaryCta}</a>
        </div>
      </header>
    </>
  );
}
