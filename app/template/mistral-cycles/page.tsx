import { TabbiedPattern } from 'tabbied/react';
import { gasket, isometry } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './mistral-cycles.module.css';

export const metadata = {
  title: 'Mistral Cycles, Handbuilt Steel Frames',
  description:
    'Lugged and fillet-brazed steel bicycle frames, drawn, mitred and brazed to order in Providence, Rhode Island. Frame is the drawing; the drawing is yours.',
};

const NAVY = '#0D1B2A';
const AZURE = '#1B98E0';
const ICE = '#E0FBFC';
const ORANGE = '#FF7B00';
const YELLOW = '#FFD23F';
const GREY = '#EAEAEA';

const FULL_PALETTE = [NAVY, AZURE, ICE, ORANGE, YELLOW, GREY];
const BLUEPRINT_PALETTE = [NAVY, '#14385C', AZURE, '#0F2A45', ICE];
const EMBER_PALETTE = ['#081220', ORANGE, YELLOW, '#14385C', AZURE];

const BUILDS = [
  {
    code: 'BUILD 01',
    name: 'Tramontane',
    kind: 'All-road randonneur',
    price: 'Framesets from $3,400 · complete builds from $7,900',
    copy: 'Low-trail geometry drawn for a handlebar bag and a long day. Triple-butted 9/6/9 chromoly, thin-wall fork blades raked to 65 mm, and clearance for 42 mm tyres with fenders. It disappears under you at hour nine, which is the whole point.',
    specs: ['650B or 700C', 'Trail 38 mm', 'Rack + dynamo bosses', 'Paint: storm navy / signal orange'],
    featured: true,
  },
  {
    code: 'BUILD 02',
    name: 'Levant',
    kind: 'Road, quick and not twitchy',
    price: 'Framesets from $3,150',
    copy: 'A road frame with manners: 72.5° head angle, 415 mm stays, and a fork we braze on Tuesdays because Tuesdays are calm. Stiff where you stand, forgiving where you sit.',
    specs: ['700C × 32 max', 'Trail 55 mm', 'Fillet-brazed, unfiled on request', 'Mechanical or Di-free electronic'],
    featured: false,
  },
  {
    code: 'BUILD 03',
    name: 'Sirocco',
    kind: 'City porteur',
    price: 'Framesets from $2,850',
    copy: 'Forty pounds of groceries on the front rack and it steers like nothing changed. Oversized down tube, kickstand plate, double top tube on the largest sizes because we like how it looks.',
    specs: ['650B × 47', 'Integrated front rack', '8-speed internal hub ready', 'Powder coat, any RAL'],
    featured: false,
  },
];

const GEO_COLS = ['SIZE', 'REACH', 'STACK', 'HT∠', 'ST∠', 'CS', 'TRAIL', 'WB'];
const GEO_ROWS = [
  ['51', '371', '545', '71.5°', '73.5°', '430', '58', '1002'],
  ['53', '378', '560', '72.0°', '73.5°', '430', '56', '1008'],
  ['55', '385', '575', '72.5°', '73.0°', '432', '55', '1016'],
  ['57', '392', '592', '72.5°', '73.0°', '435', '55', '1026'],
  ['59', '399', '610', '73.0°', '72.5°', '437', '53', '1034'],
  ['61', '406', '628', '73.0°', '72.5°', '440', '53', '1044'],
];

const PROCESS = [
  {
    n: '01',
    title: 'Consultation',
    time: '45 MIN',
    copy: 'A call or a visit. Bring your current bike, your complaints about it, and honesty about how you actually ride. We take notes in pencil.',
  },
  {
    n: '02',
    title: 'Fit & drawing',
    time: '2 WKS',
    copy: 'A fit session on the jig, then a full-scale frame drawing. You sign the drawing. We build to the drawing. Nothing changes after the signature without another one.',
  },
  {
    n: '03',
    title: 'Deposit & queue',
    time: '≈5 MO',
    copy: 'A $900 deposit holds your slot. The queue moves at the speed of two people who refuse to hurry a mitre. We email monthly; you may reply or not.',
  },
  {
    n: '04',
    title: 'The build',
    time: '3 WKS',
    copy: 'Tubes mitred to the half millimetre, pinned, brazed, and left to normalize overnight before alignment. Your frame is checked on the plate twice: hot and cold.',
  },
  {
    n: '05',
    title: 'Paint & delivery',
    time: '4 WKS',
    copy: 'Wet paint in the booth next door, decals under clear, threads chased, faces faced. Crated, insured, and tracked, or collected with coffee.',
  },
];

const PROVISIONS = [
  {
    slug: 'mistral-saddle-cutout',
    alt: 'Honey-brown leather touring saddle with copper rivets',
    name: 'Touring saddle, leather',
    note: 'Breaks in around 800 km',
    price: '$190',
  },
  {
    slug: 'mistral-helmet-cutout',
    alt: 'Matte navy cycling helmet with a small visor',
    name: 'Road helmet, navy',
    note: 'The one we wear',
    price: '$240',
  },
  {
    slug: 'mistral-toolroll-cutout',
    alt: 'Waxed canvas tool roll, partly unrolled to show tools',
    name: 'Waxed canvas tool roll',
    note: 'Sewn two blocks away',
    price: '$85',
  },
];

const FAQS = [
  {
    q: 'Why steel, in this decade?',
    a: 'Because it can be repaired, repainted, and re-loved for fifty years. Because tubing walls under a torch respond to a builder in a way moulds never will. And because a good steel frame rides like a conversation, not a lecture.',
  },
  {
    q: 'How long is the wait, really?',
    a: 'About five months to the torch, three weeks on the bench, four in paint. Call it seven months door to door. We will not compress the queue for money; we have been offered, and it was awkward for everyone.',
  },
  {
    q: 'Can you copy the geometry of my old frame?',
    a: 'We can measure it, learn from it, and keep everything you love. We will also quietly fix its front-centre if it has been clipping your toes for a decade. That part is not optional.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes: crated framesets to most countries, complete bikes to the EU, UK, Japan and Australia. Duties are yours; the crate is engineered so the courier would have to try very hard.',
  },
  {
    q: 'What if I crash it?',
    a: 'Send photographs first. Most bent steel can be cold-set, re-mitred or re-tubed; a front triangle replacement costs a fraction of a new frame. Steel forgives. That is the romance and also the engineering.',
  },
];

export default function MistralCyclesPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--navy': '#0d1b2a',
        '--navy-2': '#0a1622',
        '--navy-3': '#122439',
        '--azure': '#1b98e0',
        '--ice': '#e0fbfc',
        '--orange': '#ff7b00',
        '--yellow': '#ffd23f',
        '--grey': '#eaeaea',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="navy,navy-2,navy-3,azure,ice,orange,yellow,grey"
      className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300..900;1,300..900&family=JetBrains+Mono:ital,wght@0,400..700;1,400&display=swap"
      />

      <header className={styles.topbar}>
        <p className={styles.brand}>
          MISTRAL<span data-edit="topbar.brandTick" data-edit-max="60" className={styles.brandTick}>▲</span>CYCLES
        </p>
        <nav className={styles.nav} aria-label="Sections">
          <a data-edit="topbar.builds" data-edit-max="28" href="#builds">Builds</a>
          <a data-edit="topbar.geometry" data-edit-max="28" href="#geometry">Geometry</a>
          <a data-edit="topbar.workshop" data-edit-max="28" href="#workshop">Workshop</a>
          <a data-edit="topbar.process" data-edit-max="28" href="#process">Ordering</a>
          <a data-edit="topbar.faq" data-edit-max="28" href="#faq">FAQ</a>
        </nav>
        <p data-edit="topbar.dwg" data-edit-max="240" data-edit-multiline className={styles.dwg}>DWG MC-26 · REV C · SCALE 1:1</p>
      </header>

      <main>
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div data-edit-pattern="hero.field" data-edit-roles="0,#14385C,3,#0F2A45,4" className={styles.heroPattern} aria-hidden="true">
            <TabbiedPattern
              pattern={gasket}
              palette={BLUEPRINT_PALETTE}
              seed="mc-hero-04"
              fit="cover"
              density={1}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.heroScrim} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={styles.eyebrow}>HANDBUILT FRAMES · PROVIDENCE, RI · EST. 2011</p>
              <h1 id="hero-title" className={styles.title}>
                The frame is a drawing <em>you can ride.</em>
              </h1>
              <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={styles.lede}>
                Every Mistral begins as a full-scale pencil drawing and ends as mitred,
                brazed chromoly, checked on the alignment plate to a half millimetre,
                twice. Two builders. Around forty frames a year. No two alike, all of
                them true.
              </p>
              <div className={styles.ctaRow}>
                <a data-edit="hero.btnPrimary" data-edit-max="28" className={styles.btnPrimary} href="#process">
                  Commission a frame
                </a>
                <a data-edit="hero.btnGhost" data-edit-max="28" className={styles.btnGhost} href="#geometry">
                  Read the geometry
                </a>
              </div>
              <ul className={styles.chipRow} aria-label="Shop numbers">
                <li>
                  <strong data-edit="hero.emphasis">612</strong> frames since 2011
                </li>
                <li>
                  <strong data-edit="hero.emphasis2">0.5 mm</strong> mitre tolerance
                </li>
                <li>
                  <strong data-edit="hero.emphasis3">≈7 mo</strong> door to door
                </li>
              </ul>
            </div>

            <div className={styles.heroPanel}>
              <div className={styles.heroPanelVeil} aria-hidden="true" />
              <div className={styles.heroFrameWrap}>
                <Figure editId="photo.mistral-frame-cutout"
                  slug="mistral-frame-cutout"
                  cutout
                  priority
                  alt="Lugged steel bicycle frameset painted storm blue, photographed in profile"
                  className={styles.heroFrame}
                />
              </div>
              <p className={`${styles.callout} ${styles.calloutA}`}>
                <span data-edit="hero.text" data-edit-max="60">72.5°</span> HEAD ANGLE
              </p>
              <p className={`${styles.callout} ${styles.calloutB}`}>
                <span data-edit="hero.text2" data-edit-max="60">385</span> REACH, MM
              </p>
              <p className={`${styles.callout} ${styles.calloutC}`}>
                <span data-edit="hero.text3" data-edit-max="60">9/6/9</span> BUTTED CRMO
              </p>
              <p data-edit="hero.panelStamp" data-edit-max="240" data-edit-multiline className={styles.panelStamp}>FIG. 1 / FRAMESET, SIZE 55</p>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className={styles.philosophy} aria-labelledby="phil-title">
          <div className={styles.sectionHead}>
            <p data-edit="phil.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>§ 01</p>
            <h2 data-edit="phil.title" data-edit-max="60" id="phil-title">Why we still light the torch</h2>
          </div>
          <div className={styles.philGrid}>
            <article>
              <p data-edit="phil.philIndex" data-edit-max="240" data-edit-multiline className={styles.philIndex}>1.1</p>
              <h3 data-edit="phil.title2" data-edit-max="40">Steel is honest</h3>
              <p data-edit="phil.body" data-edit-max="240" data-edit-multiline>
                A chromoly tube tells you what it is doing: under the torch, under
                the file, under you at 60 km/h on a bad descent. It flexes, warns,
                and forgives. We have never met a spreadsheet that does that.
              </p>
            </article>
            <article>
              <p data-edit="phil.philIndex2" data-edit-max="240" data-edit-multiline className={styles.philIndex}>1.2</p>
              <h3 data-edit="phil.title3" data-edit-max="40">Fit is geometry</h3>
              <p data-edit="phil.body2" data-edit-max="240" data-edit-multiline>
                A stem swap is a patch; geometry is the cure. We move the tubes,
                not your spine. Reach, stack, trail and front-centre are drawn
                around your body and your loads before a single mitre is cut.
              </p>
            </article>
            <article>
              <p data-edit="phil.philIndex3" data-edit-max="240" data-edit-multiline className={styles.philIndex}>1.3</p>
              <h3 data-edit="phil.title4" data-edit-max="40">Repair is a feature</h3>
              <p data-edit="phil.body3" data-edit-max="240" data-edit-multiline>
                Every joint we braze can be un-brazed. A dented top tube is an
                afternoon, not a funeral. We build objects meant to outlive their
                paint, their parts, and quite possibly us.
              </p>
            </article>
          </div>
          <p data-edit="phil.pullLine" data-edit-max="240" data-edit-multiline className={styles.pullLine}>
            "A frame should be quiet. The road has enough to say."
          </p>
        </section>

        {/* pattern rule */}
        <div data-edit-pattern="main.field" data-edit-roles="0,3,4,5,6,7" className={styles.patternRule} aria-hidden="true">
          <TabbiedPattern
            pattern={gasket}
            palette={FULL_PALETTE}
            seed="mc-rule-11"
            fit="grid"
            cellSize={44}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* BUILDS */}
        <section id="builds" className={styles.builds} aria-labelledby="builds-title">
          <div className={styles.sectionHead}>
            <p data-edit="builds.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>§ 02</p>
            <h2 data-edit="builds.title" data-edit-max="60" id="builds-title">The builds</h2>
            <p data-edit="builds.sectionSub" data-edit-max="240" data-edit-multiline className={styles.sectionSub}>
              Three starting drawings. Each one is redrawn around you.
            </p>
          </div>

          <div className={styles.buildFeature}>
            <div data-edit-pattern="builds.field" data-edit-roles="0,#14385C,3,#0F2A45,4" className={styles.buildFeatureMedia}>
              <TabbiedPattern
                pattern={isometry}
                palette={BLUEPRINT_PALETTE}
                seed="mc-build-22"
                fit="grid"
                cellSize={64}
                style={{ position: 'absolute', inset: 0 }}
              />
              <div className={styles.buildMediaVeil} aria-hidden="true" />
              <Figure editId="photo.mistral-bike-cutout"
                slug="mistral-bike-cutout"
                cutout
                alt="Complete randonneur bicycle with front rack, fenders and dynamo lighting"
                className={styles.buildBike}
              />
            </div>
            <div className={styles.buildFeatureBody}>
              <p className={styles.buildCode}>{BUILDS[0].code} / FLAGSHIP</p>
              <h3 data-edit="builds.title2" data-edit-max="40">{BUILDS[0].name}</h3>
              <p data-edit="builds.buildKind" data-edit-max="240" data-edit-multiline className={styles.buildKind}>{BUILDS[0].kind}</p>
              <p data-edit="builds.buildCopy" data-edit-max="240" data-edit-multiline className={styles.buildCopy}>{BUILDS[0].copy}</p>
              <ul className={styles.specList}>
                {BUILDS[0].specs.map((s, i) => (
                  <li data-edit={`builds.item.${i}`} data-edit-max="80" key={s}>{s}</li>
                ))}
              </ul>
              <p data-edit="builds.buildPrice" data-edit-max="240" data-edit-multiline className={styles.buildPrice}>{BUILDS[0].price}</p>
            </div>
          </div>

          <div className={styles.buildCards}>
            {BUILDS.filter((b) => !b.featured).map((b, i) => (
              <article key={b.name} className={styles.buildCard}>
                <p data-edit={`buildCard.buildCode.${i}`} data-edit-max="240" data-edit-multiline className={styles.buildCode}>{b.code}</p>
                <h3 data-edit={`buildCard.title.${i}`} data-edit-max="40">{b.name}</h3>
                <p data-edit={`buildCard.buildKind.${i}`} data-edit-max="240" data-edit-multiline className={styles.buildKind}>{b.kind}</p>
                <p data-edit={`buildCard.buildCopy.${i}`} data-edit-max="240" data-edit-multiline className={styles.buildCopy}>{b.copy}</p>
                <ul className={styles.specList}>
                  {b.specs.map((s, i2) => (
                    <li data-edit={`buildCard.item.${i}.${i2}`} data-edit-max="80" key={s}>{s}</li>
                  ))}
                </ul>
                <p data-edit={`buildCard.buildPrice.${i}`} data-edit-max="240" data-edit-multiline className={styles.buildPrice}>{b.price}</p>
              </article>
            ))}
          </div>
        </section>

        {/* GEOMETRY */}
        <section id="geometry" className={styles.geometry} aria-labelledby="geo-title">
          <div data-edit-pattern="geometry.field" data-edit-roles="0,#14385C,3,#0F2A45,4" className={styles.geoField} aria-hidden="true">
            <TabbiedPattern
              pattern={isometry}
              palette={BLUEPRINT_PALETTE}
              seed="mc-geo-31"
              fit="cover"
              density={1}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.geoScrim} aria-hidden="true" />
          <div className={styles.sectionHead}>
            <p data-edit="geometry.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>§ 03</p>
            <h2 data-edit="geometry.title" data-edit-max="60" id="geo-title">Geometry: Tramontane, stock drawings</h2>
            <p data-edit="geometry.sectionSub" data-edit-max="240" data-edit-multiline className={styles.sectionSub}>
              Millimetres unless noted. Custom drawings deviate freely; these are
              where the pencil starts.
            </p>
          </div>
          <div className={styles.tableSheet}>
            <div className={styles.tableSheetInner}>
              <div
                className={styles.tableScroll}
                tabIndex={0}
                role="region"
                aria-label="Geometry chart, scrollable"
              >
                <table className={styles.geoTable}>
                  <thead>
                    <tr>
                      {GEO_COLS.map((c, i) => (
                        <th data-edit={`geometry.heading.${i}`} key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GEO_ROWS.map((row, i2) => (
                      <tr key={row[0]}>
                        {row.map((cell, i) =>
                          i === 0 ? (
                            <th data-edit={`geometry.heading2.${i2}.${i}`} key={i} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td data-edit={`geometry.cell.${i2}.${i}`} key={i}>{cell}</td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p data-edit="geometry.tableNote" data-edit-max="240" data-edit-multiline className={styles.tableNote}>
            HT∠ head-tube angle · ST∠ seat-tube angle · CS chainstay length · WB
            wheelbase. Trail figures assume 650B × 42 at size 51-55, 700C × 35
            above.
          </p>
        </section>

        {/* WORKSHOP */}
        <section id="workshop" className={styles.workshop} aria-labelledby="ws-title">
          <div className={styles.wsBand}>
            <Figure editId="photo.mistral-hero"
              slug="mistral-hero"
              alt="Workshop wall hung with steel frames in various stages of finish"
              className={styles.wsBandImg}
            />
            <p data-edit="workshop.wsBandCaption" data-edit-max="240" data-edit-multiline className={styles.wsBandCaption}>THE WALL / EVERY FRAME HANGS HERE FOR ONE NIGHT BEFORE PAINT</p>
          </div>
          <div className={styles.wsBody}>
            <div className={styles.sectionHead}>
              <p data-edit="workshop.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>§ 04</p>
              <h2 data-edit="workshop.title" data-edit-max="60" id="ws-title">One room, two benches</h2>
            </div>
            <div className={styles.wsGrid}>
              <div className={styles.wsText}>
                <p data-edit="workshop.body" data-edit-max="240" data-edit-multiline>
                  The shop is a former die-cutting room on Anvil Street: north
                  light, a concrete floor with forty years of other people's
                  work in it, and a ventilation fan we argue with every winter.
                  One bench holds the torch, the other holds the files. Frames
                  move between them slowly.
                </p>
                <p data-edit="workshop.body2" data-edit-max="240" data-edit-multiline>
                  We braze with silver at the lugs and brass at the fillets, and
                  we let joints cool at their own pace, because hurried steel keeps a
                  grudge. Alignment happens on a cast-iron plate older than both
                  of us, and the last hour of every build is spent with a
                  half-round file and the radio off.
                </p>
                <p data-edit="workshop.body3" data-edit-max="240" data-edit-multiline>
                  Visitors are welcome on Fridays. You will be handed coffee and,
                  if you linger near the vice, possibly emery cloth.
                </p>
              </div>
              <figure className={styles.wsFig}>
                <Figure editId="photo.mistral-workshop"
                  slug="mistral-workshop"
                  alt="Builder brazing a frame joint at the bench, torch flame lit"
                  className={styles.wsFigImg}
                />
                <figcaption data-edit="workshop.caption" data-edit-max="120" data-edit-multiline>SILVER BRAZING, SEAT CLUSTER / 745 °C, GIVE OR TAKE A FEELING</figcaption>
              </figure>
              <figure className={styles.wsFigSmall}>
                <Figure editId="photo.mistral-lug"
                  slug="mistral-lug"
                  alt="Close-up of a polished lug joining two frame tubes"
                  className={styles.wsFigImg}
                />
                <figcaption data-edit="workshop.caption2" data-edit-max="120" data-edit-multiline>LUG № 3, THINNED TO 1.2 MM AT THE POINTS</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* PROVISIONS */}
        <section className={styles.provisions} aria-labelledby="prov-title">
          <div data-edit-pattern="prov.field" data-edit-roles="0,#14385C,3,#0F2A45,4" className={styles.provField} aria-hidden="true">
            <TabbiedPattern
              pattern={isometry}
              palette={BLUEPRINT_PALETTE}
              seed="mc-prov-47"
              fit="grid"
              cellSize={104}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.provScrim} aria-hidden="true" />
          <div className={styles.sectionHead}>
            <p data-edit="prov.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>§ 05</p>
            <h2 data-edit="prov.title" data-edit-max="60" id="prov-title">Outfitting</h2>
            <p data-edit="prov.sectionSub" data-edit-max="240" data-edit-multiline className={styles.sectionSub}>
              The few objects we trust enough to sell alongside the frames.
            </p>
          </div>
          <ul className={styles.provGrid}>
            {PROVISIONS.map((p, i) => (
              <li key={p.slug} className={styles.provCard}>
                <div className={styles.provMedia}>
                  <Figure editId={`prov.photo.${i}`} slug={p.slug} cutout alt={p.alt} className={styles.provImg} />
                </div>
                <div className={styles.provMeta}>
                  <h3 data-edit={`prov.title2.${i}`} data-edit-max="40">{p.name}</h3>
                  <p data-edit={`prov.provNote.${i}`} data-edit-max="240" data-edit-multiline className={styles.provNote}>{p.note}</p>
                  <p data-edit={`prov.provPrice.${i}`} data-edit-max="240" data-edit-multiline className={styles.provPrice}>{p.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* FOUNDERS */}
        <section className={styles.founders} aria-labelledby="founders-title">
          <div className={styles.sectionHead}>
            <p data-edit="founders.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>§ 06</p>
            <h2 data-edit="founders.title" data-edit-max="60" id="founders-title">The two of us</h2>
          </div>
          <div className={styles.founderGrid}>
            <article className={styles.founder}>
              <div className={styles.founderTile}>
                <Figure editId="photo.mistral-founder-1"
                  slug="mistral-founder-1"
                  alt="Portrait of Mara Voss, framebuilder, in a navy work shirt"
                  className={styles.founderImg}
                />
              </div>
              <h3 data-edit="founder.title" data-edit-max="40">Mara Voss</h3>
              <p data-edit="founder.founderRole" data-edit-max="240" data-edit-multiline className={styles.founderRole}>FRAMES · TORCH · GEOMETRY</p>
              <p data-edit="founder.body" data-edit-max="240" data-edit-multiline>
                Twenty-one years at the torch, the last fourteen on her own
                drawings. Mara apprenticed in a Bremen randonneur shop, kept the
                metric habit, and will defend low-trail geometry at any dinner
                you make the mistake of inviting her to.
              </p>
            </article>
            <article className={styles.founder}>
              <div className={styles.founderTile}>
                <Figure editId="photo.mistral-founder-2"
                  slug="mistral-founder-2"
                  alt="Portrait of Arjun Mehta, painter and fitter, in a grey shop apron"
                  className={styles.founderImg}
                />
              </div>
              <h3 data-edit="founder.title2" data-edit-max="40">Arjun Mehta</h3>
              <p data-edit="founder.founderRole2" data-edit-max="240" data-edit-multiline className={styles.founderRole}>PAINT · FIT · THE DRAWINGS</p>
              <p data-edit="founder.body2" data-edit-max="240" data-edit-multiline>
                Trained as an industrial designer, converted by a borrowed 1974
                tourer with a bent fork he fixed in a stairwell. Arjun runs the
                fit jig, mixes every paint colour in-house, and letters the
                drawing that you sign.
              </p>
            </article>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className={styles.process} aria-labelledby="process-title">
          <div className={styles.sectionHead}>
            <p data-edit="process.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>§ 07</p>
            <h2 data-edit="process.title" data-edit-max="60" id="process-title">Ordering in five operations</h2>
          </div>
          <ol className={styles.steps}>
            {PROCESS.map((s, i) => (
              <li key={s.n} className={styles.step}>
                <p data-edit={`process.stepNo.${i}`} data-edit-max="240" data-edit-multiline className={styles.stepNo}>{s.n}</p>
                <div className={styles.stepBody}>
                  <h3>
                    {s.title} <span data-edit={`process.stepTime.${i}`} data-edit-max="60" className={styles.stepTime}>{s.time}</span>
                  </h3>
                  <p data-edit={`process.body.${i}`} data-edit-max="240" data-edit-multiline>{s.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.sectionHead}>
            <p data-edit="faq.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>§ 08</p>
            <h2 data-edit="faq.title" data-edit-max="60" id="faq-title">Field notes & questions</h2>
          </div>
          <div className={styles.faqList}>
            {FAQS.map((f, i) => (
              <details key={f.q} className={styles.faqItem}>
                <summary data-edit={`faq.question.${i}`} data-edit-max="80">{f.q}</summary>
                <p data-edit={`faq.body.${i}`} data-edit-max="240" data-edit-multiline>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA BAND */}
        <section data-edit-pattern="cta.field" data-edit-roles="#081220,5,6,#14385C,3" className={styles.ctaBand} aria-labelledby="cta-title">
          <TabbiedPattern
            pattern={gasket}
            palette={EMBER_PALETTE}
            seed="mc-cta-19"
            fit="cover"
            density={2}
            style={{ position: 'absolute', inset: 0 }}
          />
          <div className={styles.ctaInner}>
            <h2 data-edit="cta.title" data-edit-max="60" id="cta-title">The queue opens on the first Monday of each month.</h2>
            <p data-edit="cta.body" data-edit-max="240" data-edit-multiline>Six slots. A drawing with your name on it.</p>
            <a data-edit="cta.btnPrimary" data-edit-max="28" className={styles.btnPrimary} href="mailto:frames@mistralcycles.example">
              Write to the workshop
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <p data-edit="footer.footerBrand" data-edit-max="240" data-edit-multiline className={styles.footerBrand}>MISTRAL▲CYCLES</p>
            <p className={styles.footerFine}>
              Handbuilt steel frames.
              <br />
              Drawn, mitred, brazed, filed, painted.
            </p>
          </div>
          <address className={styles.footerCol}>
            <p data-edit="footer.footerLabel" data-edit-max="240" data-edit-multiline className={styles.footerLabel}>WORKSHOP</p>
            <p>
              Unit 4, 118 Anvil Street
              <br />
              Providence, RI 02906
            </p>
          </address>
          <div className={styles.footerCol}>
            <p data-edit="footer.footerLabel2" data-edit-max="240" data-edit-multiline className={styles.footerLabel}>HOURS</p>
            <p>
              Tue-Fri 09:00-17:00
              <br />
              Visitors: Fridays only
            </p>
          </div>
          <div className={styles.footerCol}>
            <p data-edit="footer.footerLabel3" data-edit-max="240" data-edit-multiline className={styles.footerLabel}>WRITE</p>
            <p>
              <a data-edit="footer.link" data-edit-max="28" href="mailto:frames@mistralcycles.example">frames@mistralcycles.example</a>
              <br />
              <a data-edit="footer.link2" data-edit-max="28" href="tel:+14015550172">(401) 555-0172</a>
            </p>
          </div>
        </div>
        <div className={styles.footerRule} />
        <div className={styles.footerBase}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>© 2026 Mistral Cycles. A fictional workshop, regrettably.</p>
          <p className={styles.credit}>
            Bolt circles by{' '}
            <a data-edit="footer.link3" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
