import { Fragment } from 'react';
import { TabbiedPattern } from 'tabbied/react';
/* Four presets, one job each, all drawn from the same six site hexes:
   gravure opens and closes the page, taper is the weight scale,
   diminuendo backs the reel, subdivide sits in the specimen grid. */
import { gravure, taper, diminuendo, subdivide } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './bogen-papier.module.css';

export const metadata = {
  title: 'Bogen Papier: Paper Merchant, Winterthur',
  description:
    'Bogen Papier holds eleven shades in five weights, cut to size on Wednesdays and delivered across Switzerland. Stock list, mill notes, sample service and delivery zones.',
};

/* Palette. Ground first, as the pattern expects it. */
const PAPER = '#FAFAF7';
const INK = '#14150F';
const GREEN = '#2E7D4F';
const WARM = '#C9C4B4';
const PALE = '#E7E5DC';
const UMBER = '#6B6656';

const NAV = [
  { label: 'Range', href: '#range' },
  { label: 'Mill', href: '#mill' },
  { label: 'Specimens', href: '#specimens' },
  { label: 'Ordering', href: '#ordering' },
  { label: 'Delivery', href: '#delivery' },
];

const HERO_FACTS: [string, string][] = [
  ['Trading since', '1954'],
  ['Held in stock', '11 shades, 5 weights'],
  ['Cutting days', 'Wednesday, from 07:00'],
  ['Zurich delivery', 'Next working day'],
];

type Swatch = {
  ref: string; name: string; tone: string; gloss: string;
  surface: string; weights: string; price: string;
};

/* Eleven stocked shades. Prices are Swiss francs per 100 sheets at 700 x 1000. */
const W5 = '90 · 120 · 170 · 250 · 350';
const W4L = '90 · 120 · 170 · 250';
const W4H = '120 · 170 · 250 · 350';
const W3 = '170 · 250 · 350';

const RANGE: Swatch[] = [
  { ref: 'B.01', name: 'Natur', tone: 't1', surface: 'Matt', weights: W5,
    price: '74.00', gloss: 'Unbleached, no optical brighteners' },
  { ref: 'B.02', name: 'Kreide', tone: 't2', surface: 'Smooth', weights: W4L,
    price: '78.00', gloss: 'A cold white that holds fine rules' },
  { ref: 'B.03', name: 'Hafer', tone: 't3', surface: 'Vellum', weights: W4H,
    price: '82.00', gloss: 'Oat, faint fleck, our steadiest seller' },
  { ref: 'B.04', name: 'Leinen', tone: 't4', surface: 'Laid',
    weights: '120 · 170 · 250', price: '96.00',
    gloss: 'Laid lines at 24 mm, visible against the light' },
  { ref: 'B.05', name: 'Lehm', tone: 't5', surface: 'Vellum', weights: W4H,
    price: '88.00', gloss: 'Clay, warm under tungsten' },
  { ref: 'B.06', name: 'Umbra', tone: 't6', surface: 'Matt', weights: W3,
    price: '104.00', gloss: 'Dyed through, edges match the face' },
  { ref: 'B.07', name: 'Basalt', tone: 't7', surface: 'Matt', weights: W3,
    price: '108.00', gloss: 'Neutral dark, takes white foil cleanly' },
  { ref: 'B.08', name: 'Kohle', tone: 't8', surface: 'Smooth', weights: W3,
    price: '112.00', gloss: 'The darkest we hold, dyed through' },
  { ref: 'B.09', name: 'Nebel', tone: 't9', surface: 'Smooth', weights: W4L,
    price: '80.00', gloss: 'Cool grey, sized for offset' },
  { ref: 'B.10', name: 'Farn', tone: 't10', surface: 'Matt',
    weights: '170 · 250', price: '118.00', gloss: 'The one colour in the range' },
  { ref: 'B.11', name: 'Torf', tone: 't11', surface: 'Laid', weights: W3,
    price: '116.00', gloss: 'Peat, ordered mostly for boxes' },
];

/* The weight ramp. Taper draws it as growing squares; labels sit beneath. */
const WEIGHTS = [
  { gsm: '90', caliper: '0.11 mm', use: 'Letterheads, inners, throw-outs' },
  { gsm: '120', caliper: '0.15 mm', use: 'Text pages, folded leaflets' },
  { gsm: '170', caliper: '0.21 mm', use: 'Covers, posters, wrappers' },
  { gsm: '250', caliper: '0.31 mm', use: 'Cards, tags, menu boards' },
  { gsm: '350', caliper: '0.44 mm', use: 'Boxes, invitations, plates' },
];

const MILL_FACTS: [string, string][] = [
  ['Mill', 'Papierfabrik Ottenbach, Reuss valley'],
  ['Making paper since', '1878'],
  ['Machines', 'Two, both cylinder mould'],
  ['Water', 'Drawn from the Reuss, returned within 1.4 °C'],
  ['Fibre', '68% recycled, 32% certified virgin'],
  ['Shortest run', '2 tonnes, roughly 34 000 sheets'],
];

const SPECIMENS = [
  { no: '01', year: '2025', title: 'Kunsthalle Winterthur, winter programme',
    stock: 'B.03 Hafer, 250 gsm',
    detail: 'Two colours, letterpress, 3 000 copies' },
  { no: '02', year: '2024', title: 'Ottenbach mill, centenary account',
    stock: 'B.01 Natur, 120 gsm and B.06 Umbra, 350 gsm',
    detail: 'Sewn section, uncoated cover, 800 copies' },
  { no: '03', year: '2026', title: 'Zentralbibliothek, reading room signage',
    stock: 'B.08 Kohle, 350 gsm',
    detail: 'White foil, guillotined square, 46 panels' },
];

const FIGURES = [
  { value: '68', unit: '%', label: 'Recycled fibre across the range',
    note: 'Weighted by tonnage delivered in 2025.' },
  { value: '1.4', unit: '°C', label: 'Ceiling on returned water temperature',
    note: 'Measured at the mill outfall, hourly.' },
  { value: '0', unit: 'g', label: 'Optical brighteners in the Natur line',
    note: 'Verified by the mill on every make.' },
  { value: '92', unit: '%', label: 'Deliveries by rail or electric van',
    note: 'Remainder is diesel, mostly Zone 5.' },
];

const ORDER_STEPS = [
  { no: '01', title: 'Ask for the sample box',
    body: 'Eleven shades, five weights, cut to A6 and bound with a screw post. CHF 24, credited against a first order over CHF 300.' },
  { no: '02', title: 'Send a quantity, not a guess',
    body: 'Give us the finished size and the run length. We will work out the sheet plan and tell you what the offcut costs.' },
  { no: '03', title: 'We cut on Wednesday',
    body: 'Cutting is a single pass, once a week. Orders confirmed by 16:00 on Tuesday go on that pass. Everything else waits seven days.' },
  { no: '04', title: 'Collect or have it driven',
    body: 'The trade counter is open Saturday mornings. Otherwise the van runs Thursday and Friday across Zones 1 to 3.' },
];

const TEAM = [
  ['Urs Brander', 'Merchant, since 1998'],
  ['Marek Novotny', 'Cutting floor and reels'],
  ['Sara Achermann', 'Orders and sample service'],
  ['Tobias Frei', 'Delivery, Zones 1 to 3'],
];

const ZONE_COLUMNS = ['Zone', 'Area covered', 'Cut-off', 'Arrival', 'Charge'];

const ZONES = [
  { zone: 'Z1', area: 'Winterthur, Töss, Wülflingen, Seen', cutoff: '15:00',
    arrival: 'Same day, by 18:00', charge: 'Free over CHF 150' },
  { zone: 'Z2', area: 'Zurich, Uster, Bülach, Baden', cutoff: '14:00',
    arrival: 'Next working day', charge: 'CHF 18' },
  { zone: 'Z3', area: 'St. Gallen, Aarau, Zug, Lucerne', cutoff: '12:00',
    arrival: 'Next working day', charge: 'CHF 28' },
  { zone: 'Z4', area: 'Rest of Switzerland', cutoff: '12:00',
    arrival: 'Two working days', charge: 'CHF 34' },
  { zone: 'Z5', area: 'Vorarlberg, Baden-Württemberg', cutoff: '11:00',
    arrival: 'Three working days', charge: 'From CHF 62' },
];

const HOURS: [string, string][] = [
  ['Monday to Thursday', '07:00 - 17:30'],
  ['Friday', '07:00 - 16:00'],
  ['Saturday', 'Trade counter, 08:00 - 12:00'],
  ['Sunday and holidays', 'Closed'],
];

/* The pattern cell is dealt into the swatch grid after the sixth shade. */
const PATTERN_CELL_INDEX = 6;

export default function BogenPapierPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#fafaf7',
        '--ink': '#14150f',
        '--green': '#2e7d4f',
        '--warm': '#c9c4b4',
        '--pale': '#e7e5dc',
        '--umber': '#6b6656',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,green,warm,pale,umber"
      className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..800&display=swap"
      />

      {/* MASTHEAD */}
      <header className={styles.masthead}>
        <div className={styles.shell}>
          <div className={styles.grid}>
            <div className={styles.mastMark}>
              <p data-edit="masthead.wordmark" data-edit-max="240" data-edit-multiline className={styles.wordmark}>Bogen Papier</p>
              <p data-edit="masthead.wordmarkSub" data-edit-max="240" data-edit-multiline className={styles.wordmarkSub}>Papiergrosshandel, Winterthur</p>
            </div>
            <nav className={styles.mastNav} aria-label="Sections">
              <ul className={styles.navList}>
                {NAV.map((item, i) => (
                  <li key={item.href}>
                    <a data-edit={`masthead.navLink.${i}`} data-edit-max="28" className={styles.navLink} href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <p className={styles.mastPhone}>
              Lagerstrasse 41
              <br />
              8400 Winterthur
              <br />
              052 214 07 90
            </p>
          </div>
        </div>
        {/* Hairline 1 of 2: a typographic device, not a card edge. */}
        <div className={styles.shell}>
          <div className={styles.hairline} aria-hidden="true" />
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <p data-edit="hero.kicker" data-edit-max="240" data-edit-multiline className={styles.kicker}>Stock list 2026, first edition</p>
              <h1 data-edit="hero.heroTitle" data-edit-max="70" className={styles.heroTitle} id="hero-title">
                Paper by the sheet, the ream and the reel, sold from a floor in
                Winterthur.
              </h1>
              <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={styles.heroLede}>
                We hold eleven shades in five weights and nothing else. The
                range is small because we would rather know a paper than list
                it. Everything on this page is in the building today, cut to
                700 x 1000 and stacked by weight.
              </p>
              <dl className={styles.heroFacts}>
                {HERO_FACTS.map(([term, value], i) => (
                  <div className={styles.factRow} key={term}>
                    <dt data-edit={`hero.factTerm.${i}`} data-edit-max="28" className={styles.factTerm}>{term}</dt>
                    <dd data-edit={`hero.factValue.${i}`} data-edit-max="200" data-edit-multiline className={styles.factValue}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* 5 / 7 split: the pattern as a flat field, the floor as a photograph */}
          <div className={styles.heroSplit}>
            <div data-edit-pattern="hero.field" data-edit-roles="0,3,4,5" className={styles.heroField}>
              <TabbiedPattern
                pattern={gravure}
                palette={[PAPER, WARM, PALE, UMBER]}
                seed="bogen-hero-01"
                fit="grid"
                cellSize={78}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div className={styles.heroPhoto}>
              <Figure editId="photo.bogen-hero"
                slug="bogen-hero"
                alt="The warehouse floor at Bogen Papier, with stacked reams under high windows."
                priority
                className={styles.cover}
              />
            </div>
          </div>
        </section>

        {/* 01 STATEMENT */}
        <section className={styles.section} aria-labelledby="statement-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p data-edit="statement.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>01</p>
                <p data-edit="statement.sectionLabel" data-edit-max="240" data-edit-multiline className={styles.sectionLabel}>The merchant</p>
              </div>
              <div className={styles.statementBody}>
                <h2 data-edit="statement.h2" data-edit-max="60" className={styles.h2} id="statement-title">
                  A merchant should be able to say why a paper is on the shelf.
                </h2>
                <p data-edit="statement.body" data-edit-max="240" data-edit-multiline className={styles.body}>
                  Bogen Papier was started in 1954 by Anton Brander, who sold
                  offcuts from a handcart outside the Ottenbach mill gate. The
                  business has moved four times and grown slowly. It has never
                  carried more than a dozen shades.
                </p>
                <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline className={styles.body}>
                  A large catalogue is a way of avoiding a decision. Our range
                  is edited once a year, in January. A shade stays if printers
                  keep asking for it and the mill can still make it to the same
                  shade. Two papers were dropped in 2025, one for fading in
                  window displays and one because the mill changed its sizing.
                </p>
                <ol className={styles.principles}>
                  <li className={styles.principle}>
                    <span data-edit="statement.principleNo" data-edit-max="60" className={styles.principleNo}>i</span>
                    <span data-edit="statement.principleText" data-edit-max="60" className={styles.principleText}>
                      Every shade is dyed through, so a cut edge matches the
                      face. We do not stock surface-coloured board.
                    </span>
                  </li>
                  <li className={styles.principle}>
                    <span data-edit="statement.principleNo2" data-edit-max="60" className={styles.principleNo}>ii</span>
                    <span data-edit="statement.principleText2" data-edit-max="60" className={styles.principleText}>
                      Prices are per 100 sheets and printed here. There is no
                      trade tier and no annual rebate to negotiate.
                    </span>
                  </li>
                  <li className={styles.principle}>
                    <span data-edit="statement.principleNo3" data-edit-max="60" className={styles.principleNo}>iii</span>
                    <span data-edit="statement.principleText3" data-edit-max="60" className={styles.principleText}>
                      If a paper is wrong for the job we will say so before we
                      cut it, which is the only moment it helps.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 02 THE RANGE: swatch grid */}
        <section
          className={`${styles.section} ${styles.sectionRange}`}
          id="range"
          aria-labelledby="range-title"
        >
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p data-edit="range.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>02</p>
                <p data-edit="range.sectionLabel" data-edit-max="240" data-edit-multiline className={styles.sectionLabel}>The range</p>
              </div>
              <div className={styles.rangeIntro}>
                <h2 data-edit="range.h2" data-edit-max="60" className={styles.h2} id="range-title">
                  Eleven shades, five weights, one sheet size.
                </h2>
                <p data-edit="range.body" data-edit-max="240" data-edit-multiline className={styles.body}>
                  Everything is held at 700 x 1000 mm and cut down on request.
                  Weights run from 90 to 350 gsm; not every shade is made in
                  every weight, and the weights that exist are listed under each
                  swatch. Colours below are printed representations. Order the
                  sample box before you commit a run.
                </p>
              </div>
            </div>
          </div>

          {/* Weight ramp: taper is literally a scale of growing squares */}
          <div className={styles.rampBand}>
            <div data-edit-pattern="range.field" data-edit-roles="4,3,0,5,1" className={styles.rampField}>
              <TabbiedPattern
                pattern={taper}
                palette={[PALE, WARM, PAPER, UMBER, INK]}
                seed="bogen-ramp-04"
                fit="grid"
                cellSize={96}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
          </div>
          <div className={styles.shell}>
            <ol className={styles.rampScale}>
              {WEIGHTS.map((w, i) => (
                <li className={styles.rampStep} key={w.gsm}>
                  <p className={styles.rampGsm}>
                    {w.gsm}
                    <span data-edit={`range.rampUnit.${i}`} data-edit-max="60" className={styles.rampUnit}>gsm</span>
                  </p>
                  <p data-edit={`range.rampCaliper.${i}`} data-edit-max="240" data-edit-multiline className={styles.rampCaliper}>{w.caliper}</p>
                  <p data-edit={`range.rampUse.${i}`} data-edit-max="240" data-edit-multiline className={styles.rampUse}>{w.use}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.shell}>
            <div className={styles.swatchLegendRow}>
              <p data-edit="range.swatchLegendLabel" data-edit-max="240" data-edit-multiline className={styles.swatchLegendLabel}>Stock list</p>
              <p data-edit="range.swatchLegend" data-edit-max="240" data-edit-multiline className={styles.swatchLegend}>
                Each entry gives the reference, the shade name, the surface, the
                weights we hold in gsm, and the price in Swiss francs per 100
                sheets at 700 x 1000 mm.
              </p>
            </div>
            <ul className={styles.swatchGrid}>
              {RANGE.map((s, i) => (
                <Fragment key={s.ref}>
                  {i === PATTERN_CELL_INDEX && (
                    <li className={styles.swatchCell}>
                      <div data-edit-pattern={`range.field2.${i}`} data-edit-roles="0,3,4,5" className={styles.patternField}>
                        <TabbiedPattern
                          pattern={taper}
                          palette={[PAPER, WARM, PALE, UMBER]}
                          seed="bogen-swatch-07"
                          fit="grid"
                          cellSize={30}
                          style={{ position: 'absolute', inset: 0 }}
                        />
                      </div>
                      <div className={styles.swatchMeta}>
                        <p data-edit={`range.swatchName.${i}`} data-edit-max="240" data-edit-multiline className={styles.swatchName}>Weight scale</p>
                        <p data-edit={`range.swatchGloss.${i}`} data-edit-max="240" data-edit-multiline className={styles.swatchGloss}>
                          Ninety through three fifty, drawn to size
                        </p>
                        <div className={styles.swatchSpecs}>
                          <span data-edit={`range.specTerm.${i}`} data-edit-max="60" className={styles.specTerm}>Surface</span>
                          <span data-edit={`range.specValue.${i}`} data-edit-max="60" className={styles.specValue}>Not stocked</span>
                          <span data-edit={`range.specTerm2.${i}`} data-edit-max="60" className={styles.specTerm}>Weights</span>
                          <span data-edit={`range.specValue2.${i}`} data-edit-max="60" className={styles.specValue}>
                            90 · 120 · 170 · 250 · 350
                          </span>
                          <span data-edit={`range.specTerm3.${i}`} data-edit-max="60" className={styles.specTerm}>Per 100</span>
                          <span data-edit={`range.specValue3.${i}`} data-edit-max="60" className={styles.specValue}>Reference</span>
                        </div>
                      </div>
                    </li>
                  )}
                  <li className={styles.swatchCell}>
                    {/* The reference is printed on the chip, as in the book. */}
                    <div className={`${styles.swatchField} ${styles[s.tone]}`}>
                      <span data-edit={`range.swatchRefInside.${i}`} data-edit-max="60" className={styles.swatchRefInside}>{s.ref}</span>
                    </div>
                    <div className={styles.swatchMeta}>
                      <h3 data-edit={`range.swatchName2.${i}`} data-edit-max="40" className={styles.swatchName}>{s.name}</h3>
                      <p data-edit={`range.swatchGloss2.${i}`} data-edit-max="240" data-edit-multiline className={styles.swatchGloss}>{s.gloss}</p>
                      <div className={styles.swatchSpecs}>
                        <span data-edit={`range.specTerm4.${i}`} data-edit-max="60" className={styles.specTerm}>Surface</span>
                        <span data-edit={`range.specValue4.${i}`} data-edit-max="60" className={styles.specValue}>{s.surface}</span>
                        <span data-edit={`range.specTerm5.${i}`} data-edit-max="60" className={styles.specTerm}>Weights</span>
                        <span data-edit={`range.specValue5.${i}`} data-edit-max="60" className={styles.specValue}>{s.weights}</span>
                        <span data-edit={`range.specTerm6.${i}`} data-edit-max="60" className={styles.specTerm}>Per 100</span>
                        <span data-edit={`range.specValue6.${i}`} data-edit-max="60" className={styles.specValue}>{s.price}</span>
                      </div>
                    </div>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>

          <div className={styles.shell}>
            <div className={styles.grid}>
              <p data-edit="range.rangeNote" data-edit-max="240" data-edit-multiline className={styles.rangeNote}>
                All prices are per 100 sheets at 700 x 1000 mm, excluding VAT,
                collected from Lagerstrasse. Cutting to a smaller format is
                CHF 12 per 100 sheets per cut. Reels are quoted separately by
                the tonne. Prices hold to 31 December 2026 unless the mill
                repasses a make.
              </p>
              <div className={styles.rangeCut}>
                <Figure editId="photo.bogen-swatches-cutout"
                  slug="bogen-swatches-cutout"
                  cutout
                  alt="A fan of paper swatches in the eleven stocked shades, spread open."
                  className={styles.cut}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 03 THE MILL */}
        <section className={styles.section} id="mill" aria-labelledby="mill-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p data-edit="mill.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>03</p>
                <p data-edit="mill.sectionLabel" data-edit-max="240" data-edit-multiline className={styles.sectionLabel}>The mill</p>
              </div>
              <div className={styles.millBody}>
                <h2 data-edit="mill.h2" data-edit-max="60" className={styles.h2} id="mill-title">
                  Everything we sell is made 38 kilometres away.
                </h2>
                <p data-edit="mill.body" data-edit-max="240" data-edit-multiline className={styles.body}>
                  The Ottenbach mill has run on the Reuss since 1878 and has
                  made our range since 1961. Two cylinder mould machines, one
                  for the light weights and one for board. We visit on the first
                  Tuesday of the month and watch the make.
                </p>
                <dl className={styles.millFacts}>
                  {MILL_FACTS.map(([term, value], i) => (
                    <div className={styles.millRow} key={term}>
                      <dt data-edit={`mill.millTerm.${i}`} data-edit-max="28" className={styles.millTerm}>{term}</dt>
                      <dd data-edit={`mill.millValue.${i}`} data-edit-max="200" data-edit-multiline className={styles.millValue}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            <div className={styles.grid}>
              <figure className={styles.millPhoto}>
                <div className={styles.millPhotoFrame}>
                  <Figure editId="photo.bogen-mill"
                    slug="bogen-mill"
                    alt="The Ottenbach paper mill beside the Reuss, seen across the water."
                    className={styles.cover}
                  />
                </div>
                <figcaption data-edit="mill.caption" data-edit-max="120" data-edit-multiline className={styles.caption}>
                  Papierfabrik Ottenbach, Reuss valley. The lower building holds
                  the board machine.
                </figcaption>
              </figure>
              <div className={styles.millCut}>
                <div data-edit-pattern="mill.field" data-edit-roles="4,3,0,5" className={styles.millCutField}>
                  <TabbiedPattern
                    pattern={diminuendo}
                    palette={[PALE, WARM, PAPER, UMBER]}
                    seed="bogen-mill-02"
                    fit="grid"
                    cellSize={46}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                  <span className={styles.veil} aria-hidden="true" />
                  <Figure editId="photo.bogen-roll-cutout"
                    slug="bogen-roll-cutout"
                    cutout
                    alt="A standing reel of uncoated paper, cut out against the pattern field."
                    className={styles.cutTall}
                  />
                </div>
                <p data-edit="mill.caption2" data-edit-max="240" data-edit-multiline className={styles.caption}>
                  Reel, 1 400 mm face. Reels are quoted by the tonne and
                  delivered from the mill direct.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 SPECIMENS */}
        <section
          className={`${styles.section} ${styles.sectionPale}`}
          id="specimens"
          aria-labelledby="specimens-title"
        >
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p data-edit="specimens.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>04</p>
                <p data-edit="specimens.sectionLabel" data-edit-max="240" data-edit-multiline className={styles.sectionLabel}>Specimens</p>
              </div>
              <div className={styles.specimenIntro}>
                <h2 data-edit="specimens.h2" data-edit-max="60" className={styles.h2} id="specimens-title">
                  Printed work, with the stock named.
                </h2>
                <p data-edit="specimens.body" data-edit-max="240" data-edit-multiline className={styles.body}>
                  Three recent jobs, kept in the sample cabinet at the counter.
                  Ask for any of them and we will pull the sheet so you can see
                  the shade under the light you are printing for.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            <div className={styles.specimenGrid}>
              <div className={styles.specimenPhoto}>
                <Figure editId="photo.bogen-sheets"
                  slug="bogen-sheets"
                  alt="Loose printed sheets fanned across a bench, showing several stocked shades."
                  className={styles.cover}
                />
              </div>
              <div data-edit-pattern="specimens.field" data-edit-roles="0,4,3,5" className={styles.specimenPattern}>
                <TabbiedPattern
                  pattern={subdivide}
                  palette={[PAPER, PALE, WARM, UMBER]}
                  seed="bogen-specimen-03"
                  fit="grid"
                  cellSize={58}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
              <ol className={styles.specimenList}>
                {SPECIMENS.map((sp, i) => (
                  <li className={styles.specimenItem} key={sp.no}>
                    <p data-edit={`specimens.specimenNo.${i}`} data-edit-max="240" data-edit-multiline className={styles.specimenNo}>{sp.no}</p>
                    <div className={styles.specimenText}>
                      <h3 data-edit={`specimens.specimenTitle.${i}`} data-edit-max="40" className={styles.specimenTitle}>{sp.title}</h3>
                      <p data-edit={`specimens.specimenStock.${i}`} data-edit-max="240" data-edit-multiline className={styles.specimenStock}>{sp.stock}</p>
                      <p data-edit={`specimens.specimenDetail.${i}`} data-edit-max="240" data-edit-multiline className={styles.specimenDetail}>{sp.detail}</p>
                    </div>
                    <p data-edit={`specimens.specimenYear.${i}`} data-edit-max="240" data-edit-multiline className={styles.specimenYear}>{sp.year}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 05 FIGURES */}
        <section className={styles.section} aria-labelledby="figures-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p data-edit="figures.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>05</p>
                <p data-edit="figures.sectionLabel" data-edit-max="240" data-edit-multiline className={styles.sectionLabel}>Figures</p>
              </div>
              <div className={styles.figuresIntro}>
                <h2 data-edit="figures.h2" data-edit-max="60" className={styles.h2} id="figures-title">
                  Four numbers we are prepared to publish.
                </h2>
                <p data-edit="figures.body" data-edit-max="240" data-edit-multiline className={styles.body}>
                  Taken from the 2025 delivery ledger and the mill's own
                  monthly returns. They are audited by nobody. They are here
                  because a merchant who will not print a number is asking you
                  to take the rest on trust.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            <ul className={styles.figureRow}>
              {FIGURES.map((f, i) => (
                <li className={styles.figureCell} key={f.label}>
                  <p className={styles.figureValue}>
                    {f.value}
                    <span data-edit={`figures.figureUnit.${i}`} data-edit-max="60" className={styles.figureUnit}>{f.unit}</span>
                  </p>
                  <p data-edit={`figures.figureLabel.${i}`} data-edit-max="240" data-edit-multiline className={styles.figureLabel}>{f.label}</p>
                  <p data-edit={`figures.figureNote.${i}`} data-edit-max="240" data-edit-multiline className={styles.figureNote}>{f.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 06 ORDERING */}
        <section
          className={`${styles.section} ${styles.sectionInk}`}
          id="ordering"
          aria-labelledby="ordering-title"
        >
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p data-edit="ordering.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>06</p>
                <p data-edit="ordering.sectionLabel" data-edit-max="240" data-edit-multiline className={styles.sectionLabel}>Ordering</p>
              </div>
              <div className={styles.orderIntro}>
                <h2 data-edit="ordering.h2" data-edit-max="60" className={styles.h2} id="ordering-title">
                  The sample box first, the order second.
                </h2>
                <p data-edit="ordering.body" data-edit-max="240" data-edit-multiline className={styles.body}>
                  Nobody should buy 8 000 sheets from a screen. The box holds
                  every shade in every weight we stock, cut to A6 and bound at
                  the corner, and it is the fastest way to settle an argument
                  about warmth.
                </p>
                <div className={styles.orderActions}>
                  <a data-edit="ordering.buttonFilled" data-edit-max="28" className={styles.buttonFilled} href="#delivery">
                    Order the sample box, CHF 24
                  </a>
                  <a data-edit="ordering.buttonPlain" data-edit-max="28" className={styles.buttonPlain} href="tel:+41522140790">
                    Or call 052 214 07 90
                  </a>
                </div>
              </div>
              <div className={styles.orderCut}>
                <div className={styles.orderCutField}>
                  <Figure editId="photo.bogen-ream-cutout"
                    slug="bogen-ream-cutout"
                    cutout
                    alt="A wrapped ream of paper with its label facing forward."
                    className={styles.cut}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            <ol className={styles.stepRow}>
              {ORDER_STEPS.map((step, i) => (
                <li className={styles.step} key={step.no}>
                  <p data-edit={`ordering.stepNo.${i}`} data-edit-max="240" data-edit-multiline className={styles.stepNo}>{step.no}</p>
                  <h3 data-edit={`ordering.stepTitle.${i}`} data-edit-max="40" className={styles.stepTitle}>{step.title}</h3>
                  <p data-edit={`ordering.stepBody.${i}`} data-edit-max="240" data-edit-multiline className={styles.stepBody}>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 07 THE COUNTER */}
        <section className={styles.section} aria-labelledby="people-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p data-edit="people.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>07</p>
                <p data-edit="people.sectionLabel" data-edit-max="240" data-edit-multiline className={styles.sectionLabel}>The counter</p>
              </div>
              <figure className={styles.portraitFrame}>
                <Figure editId="photo.bogen-merchant"
                  slug="bogen-merchant"
                  alt="Urs Brander, the merchant, standing at the cutting bench."
                  className={styles.portrait}
                />
              </figure>
              <div className={styles.peopleBody}>
                <h2 data-edit="people.h2" data-edit-max="60" className={styles.h2} id="people-title">
                  Four people, one telephone line.
                </h2>
                <blockquote className={styles.quote}>
                  <p data-edit="people.quoteText" data-edit-max="240" data-edit-multiline className={styles.quoteText}>
                    I have sold the same eleven papers for twenty-eight years.
                    What changes is the work people bring to them, and that is
                    the interesting part.
                  </p>
                  <footer className={styles.quoteAttr}>
                    Urs Brander, merchant
                  </footer>
                </blockquote>
                <dl className={styles.teamList}>
                  {TEAM.map(([name, role], i) => (
                    <div className={styles.teamRow} key={name}>
                      <dt data-edit={`people.teamName.${i}`} data-edit-max="28" className={styles.teamName}>{name}</dt>
                      <dd data-edit={`people.teamRole.${i}`} data-edit-max="200" data-edit-multiline className={styles.teamRole}>{role}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* 08 DELIVERY */}
        <section
          className={`${styles.section} ${styles.sectionPale}`}
          id="delivery"
          aria-labelledby="delivery-title"
        >
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p data-edit="delivery.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>08</p>
                <p data-edit="delivery.sectionLabel" data-edit-max="240" data-edit-multiline className={styles.sectionLabel}>Delivery</p>
              </div>
              <div className={styles.deliveryIntro}>
                <h2 data-edit="delivery.h2" data-edit-max="60" className={styles.h2} id="delivery-title">
                  Five zones, one van, no surprises on the invoice.
                </h2>
                <p data-edit="delivery.body" data-edit-max="240" data-edit-multiline className={styles.body}>
                  Cut-off is the time an order must be confirmed on the day it
                  is to be loaded. Anything over 300 kg goes by pallet carrier
                  and is quoted before it leaves.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            {/* A table by role, a grid by layout: no rules, no cell edges. */}
            <div
              className={styles.zoneTable}
              role="table"
              aria-label="Delivery zones"
            >
              <div className={styles.zoneHead} role="row">
                {ZONE_COLUMNS.map((label, i) => (
                  <p data-edit={`delivery.zoneHeadCell.${i}`} data-edit-max="240" data-edit-multiline className={styles.zoneHeadCell} role="columnheader" key={label}>
                    {label}
                  </p>
                ))}
              </div>
              {ZONES.map((z, i) => (
                <div className={styles.zoneRow} role="row" key={z.zone}>
                  <p data-edit={`delivery.zoneCode.${i}`} data-edit-max="240" data-edit-multiline className={styles.zoneCode} role="cell">
                    {z.zone}
                  </p>
                  <p data-edit={`delivery.zoneArea.${i}`} data-edit-max="240" data-edit-multiline className={styles.zoneArea} role="cell">
                    {z.area}
                  </p>
                  <p data-edit={`delivery.zoneNum.${i}`} data-edit-max="240" data-edit-multiline className={styles.zoneNum} role="cell">
                    {z.cutoff}
                  </p>
                  <p data-edit={`delivery.zoneCell.${i}`} data-edit-max="240" data-edit-multiline className={styles.zoneCell} role="cell">
                    {z.arrival}
                  </p>
                  <p data-edit={`delivery.zoneNum2.${i}`} data-edit-max="240" data-edit-multiline className={styles.zoneNum} role="cell">
                    {z.charge}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.shell}>
            <div className={styles.grid}>
              <dl className={styles.hoursList}>
                {HOURS.map(([day, time], i) => (
                  <div className={styles.hoursRow} key={day}>
                    <dt data-edit={`delivery.hoursDay.${i}`} data-edit-max="28" className={styles.hoursDay}>{day}</dt>
                    <dd data-edit={`delivery.hoursTime.${i}`} data-edit-max="200" data-edit-multiline className={styles.hoursTime}>{time}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.findUs}>
                <h3 data-edit="delivery.h3" data-edit-max="40" className={styles.h3}>Finding the warehouse</h3>
                <p data-edit="delivery.body2" data-edit-max="240" data-edit-multiline className={styles.body}>
                  Lagerstrasse 41 sits behind the goods yard. From Winterthur
                  station take bus 3 to Zelgli, four stops, then walk 200 m
                  north. Loading bay two is signed for collection. There is no
                  customer parking on the ramp.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* COLOPHON */}
      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="1,5,3" className={styles.footField} aria-hidden="true">
          <TabbiedPattern
            pattern={gravure}
            palette={[INK, UMBER, WARM]}
            seed="bogen-foot-09"
            fit="grid"
            cellSize={78}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.footInner}>
          <div className={styles.shell}>
            {/* Hairline 2 of 2 */}
            <div className={styles.hairlineFoot} aria-hidden="true" />
            <div className={styles.grid}>
              <div className={styles.footMark}>
                <p data-edit="footer.footWord" data-edit-max="240" data-edit-multiline className={styles.footWord}>Bogen Papier</p>
                <p className={styles.footSub}>
                  Papiergrosshandel
                  <br />
                  Established 1954
                </p>
              </div>
              <address className={styles.footAddress}>
                Lagerstrasse 41
                <br />
                8400 Winterthur
                <br />
                Switzerland
              </address>
              <div className={styles.footContact}>
                <p data-edit="footer.footLine" data-edit-max="240" data-edit-multiline className={styles.footLine}>052 214 07 90</p>
                <p className={styles.footLine}>
                  <a data-edit="footer.footLink" data-edit-max="28" className={styles.footLink} href="mailto:kontakt@bogenpapier.ch">
                    kontakt@bogenpapier.ch
                  </a>
                </p>
                <p data-edit="footer.footLine2" data-edit-max="240" data-edit-multiline className={styles.footLine}>VAT CHE-114.702.338</p>
              </div>
              <p data-edit="footer.colophon" data-edit-max="240" data-edit-multiline className={styles.colophon}>
                Set in Inter. Fields drawn with four Tabbied patterns in the
                house palette: Gravure at the head and the foot, Taper for the
                weight ramp, Diminuendo behind the reel, Subdivide in the
                specimen grid. Photography by Roman Keller, 2025. Prices valid
                to 31 December 2026.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
