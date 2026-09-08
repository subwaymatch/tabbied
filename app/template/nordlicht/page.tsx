import { TabbiedPattern } from 'tabbied/react';
import {
  dipole, epicentre, glazing, gyre, maze, northstar, protractor, stipplefade, terrain,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './nordlicht.module.css';

export const metadata = {
  title: 'Nordlicht: Kartografie und Vermessung',
  description:
    'Nordlicht is a cartography and survey office in Tromsø. Terrain models, coastal charts, and field survey above 69° north since 1998.',
};

/* Four inks and the paper. Pattern fields take the background slot as
   `transparent`, so every field is drawn *in* the page, not on it. */
const INK = '#0E1116';
const BLUE = '#1B4DFF';
const STEEL = '#8A9098';
const PALE = '#C3CBD4';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = PALE;


const NAV = ['Survey', 'Charts', 'Terrain', 'Field', 'Office'];

const SHEETS = [
  { id: 'N-114', name: 'Kvaløya, north coast', scale: '1:25 000', proj: 'ETRS89 / UTM 34N', issue: '4th', year: '2026' },
  { id: 'N-108', name: 'Lyngen, glacier margins', scale: '1:15 000', proj: 'ETRS89 / UTM 34N', issue: '2nd', year: '2025' },
  { id: 'N-097', name: 'Tromsøysundet approaches', scale: '1:10 000', proj: 'ETRS89 / UTM 33N', issue: '7th', year: '2025' },
  { id: 'N-091', name: 'Senja, western fjords', scale: '1:50 000', proj: 'ETRS89 / UTM 33N', issue: '3rd', year: '2024' },
  { id: 'N-083', name: 'Balsfjord, valley floor', scale: '1:25 000', proj: 'ETRS89 / UTM 34N', issue: '5th', year: '2024' },
  { id: 'N-076', name: 'Ringvassøya interior', scale: '1:50 000', proj: 'ETRS89 / UTM 34N', issue: '2nd', year: '2023' },
];

const SERVICES = [
  {
    k: 'A',
    title: 'Control and levelling',
    body: 'Primary and secondary control networks, precise levelling, deformation monitoring on dams and quays. Adjusted in-house, reported with the residuals attached.',
    unit: '±2 mm / km',
  },
  {
    k: 'B',
    title: 'Airborne and terrestrial lidar',
    body: 'Point clouds at 40 to 400 points per square metre, classified and delivered as LAZ with a terrain model on top. We fly our own missions between March and October.',
    unit: '400 pt/m²',
  },
  {
    k: 'C',
    title: 'Hydrographic survey',
    body: 'Multibeam bathymetry to IHO Special Order in sheltered water, Order 1a offshore. Tide-reduced against our own gauges, not the nearest port.',
    unit: 'IHO S-44',
  },
  {
    k: 'D',
    title: 'Cartographic production',
    body: 'Everything above turned into a sheet somebody can fold in a wind. Colour, hierarchy and generalisation are decided by a cartographer, not a default style.',
    unit: '6 colours',
  },
];

const FIELD = [
  ['69°40′ N', '18°57′ E', 'Tromsø, office and store'],
  ['69°47′ N', '18°38′ E', 'Kvaløya, control pillar KV-2'],
  ['69°35′ N', '20°12′ E', 'Lyngen, glacier stakes'],
  ['69°22′ N', '17°25′ E', 'Senja, tide gauge SE-1'],
  ['70°04′ N', '19°02′ E', 'Ringvassøya, GNSS base'],
];

export default function NordlichtPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#fcfcfa',
        '--ink': '#0e1116',
        '--blue': '#1b4dff',
        '--steel': '#8a9098',
        '--pale': '#c3cbd4',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,blue,steel,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.top}>
        <a data-edit="top.text" data-edit-format="emphasis" data-edit-max="40" className={s.brand} href="#top">
          Nordlicht
          <span>Kartografi &amp; Oppmåling</span>
        </a>
        <nav aria-label="Sections">
          {NAV.map((n, i) => (
            <a data-edit={`top.link.${i}`} data-edit-max="28" key={n} href={`#${n.toLowerCase()}`}>
              {n}
            </a>
          ))}
        </nav>
      </header>

      {/* The page is ruled like a sheet: a fixed graticule of hairlines runs
          the full height behind everything, and every section lands on it. */}
      <div className={s.graticule} aria-hidden="true" />

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,4,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={terrain}
              palette={['transparent', STEEL, PALE, BLUE]}
              fit="grid"
              cellSize={220}
              redrawInterval={6500}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.coords" data-edit-max="240" data-edit-multiline className={s.coords}>69°38′55″ N &nbsp; 18°57′10″ E &nbsp; / &nbsp; est. 1998</p>
          <h1 data-edit="hero.title" data-edit-max="70">
            We measure the coast
            <br />
            and draw what is
            <br />
            actually there.
          </h1>
          <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
            A survey and cartography office in Tromsø. Six people, two boats,
            one plotter that has never once jammed on a Friday.
          </p>
          <ul className={s.ticker}>
            <li data-edit="hero.item" data-edit-format="emphasis" data-edit-max="80">
              <b>114</b> sheets published
            </li>
            <li data-edit="hero.item2" data-edit-format="emphasis" data-edit-max="80">
              <b>28</b> years above the Arctic Circle
            </li>
            <li data-edit="hero.item3" data-edit-format="emphasis" data-edit-max="80">
              <b>6</b> cartographers and surveyors
            </li>
            <li data-edit="hero.item4" data-edit-format="emphasis" data-edit-max="80">
              <b>2</b> survey vessels
            </li>
          </ul>
        </section>

        <figure className={s.wide}>
          <Figure editId="photo.nordlicht-coast"
            slug="nordlicht-coast"
            alt="An aerial view of an Arctic coastline, pale water and dark rock under flat light"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Kvaløya, north coast. Flown 04.06.2025, 1,200 m AGL.</figcaption>
        </figure>

        {/* -------------------------------------------------------- SURVEY */}
        <section id="survey" className={s.survey} aria-labelledby="survey-h">
          <div className={s.secHead}>
            <span data-edit="survey.secNo" data-edit-max="60" className={s.secNo}>01</span>
            <h2 data-edit="survey.title" data-edit-max="60" id="survey-h">What we do, in four parts</h2>
          </div>
          <div className={s.services}>
            {SERVICES.map((x, i) => (
              <article key={x.k}>
                <p data-edit={`survey.sKey.${i}`} data-edit-max="240" data-edit-multiline className={s.sKey}>{x.k}</p>
                <h3 data-edit={`survey.title2.${i}`} data-edit-max="40">{x.title}</h3>
                <p data-edit={`survey.sBody.${i}`} data-edit-max="240" data-edit-multiline className={s.sBody}>{x.body}</p>
                <p data-edit={`survey.sUnit.${i}`} data-edit-max="240" data-edit-multiline className={s.sUnit}>{x.unit}</p>
              </article>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- BAND / CHARTS */}
        <section className={s.rule} aria-hidden="true">
          <div data-edit-pattern="rule.field" data-edit-roles="transparent,2,1,3" className={s.ruleField}>
            <TabbiedPattern
              pattern={epicentre}
              palette={['transparent', BLUE, INK, STEEL]}
              fit="grid"
              cellSize={104}
              redrawInterval={3800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        <section id="charts" className={s.charts} aria-labelledby="charts-h">
          <div className={s.secHead}>
            <span data-edit="charts.secNo" data-edit-max="60" className={s.secNo}>02</span>
            <h2 data-edit="charts.title" data-edit-max="60" id="charts-h">Published sheets</h2>
          </div>
          <p data-edit="charts.note" data-edit-max="240" data-edit-multiline className={s.note}>
            Sold at the office and by six chandlers along the coast. Every sheet
            carries its survey date on the reverse; we do not reprint without
            resurveying.
          </p>
          <table className={s.sheets}>
            <thead>
              <tr>
                <th data-edit="charts.heading">Sheet</th>
                <th data-edit="charts.heading2">Area</th>
                <th data-edit="charts.heading3">Scale</th>
                <th data-edit="charts.heading4">Projection</th>
                <th data-edit="charts.heading5">Ed.</th>
                <th data-edit="charts.heading6">Year</th>
              </tr>
            </thead>
            <tbody>
              {SHEETS.map((x, i) => (
                <tr key={x.id}>
                  <td data-edit={`charts.mono.${i}`} className={s.mono}>{x.id}</td>
                  <td data-edit={`charts.sheetName.${i}`} className={s.sheetName}>{x.name}</td>
                  <td data-edit={`charts.mono2.${i}`} className={s.mono}>{x.scale}</td>
                  <td data-edit={`charts.cell.${i}`}>{x.proj}</td>
                  <td data-edit={`charts.mono3.${i}`} className={s.mono}>{x.issue}</td>
                  <td data-edit={`charts.mono4.${i}`} className={s.mono}>{x.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ------------------------------------------------------- TERRAIN */}
        <section id="terrain" className={s.terrain} aria-labelledby="terrain-h">
          <div data-edit-pattern="terrain.field" data-edit-roles="transparent,4,3" className={s.terrainField} aria-hidden="true">
            <TabbiedPattern
              pattern={northstar}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={90}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.terrainInner}>
            <div className={s.secHead}>
              <span data-edit="terrain.secNo" data-edit-max="60" className={s.secNo}>03</span>
              <h2 data-edit="terrain.title" data-edit-max="60" id="terrain-h">Terrain, honestly generalised</h2>
            </div>
            <div className={s.terrainGrid}>
              <p data-edit="terrain.big" data-edit-max="240" data-edit-multiline className={s.big}>
                A contour is an opinion about where a slope stops being one
                slope. We publish ours at three generalisation levels and say
                which one you are looking at.
              </p>
              <div className={s.terrainCol}>
                <p data-edit="terrain.body" data-edit-max="240" data-edit-multiline>
                  Our terrain models come out of lidar we flew ourselves, so we
                  know what the vegetation was doing that week and how much of
                  the ground we actually saw through it.
                </p>
                <p data-edit="terrain.body2" data-edit-max="240" data-edit-multiline>
                  Where the point cloud is thin, the sheet says so. There is a
                  small grey tint on the reverse index for every square
                  kilometre we would not stake a boat on.
                </p>
              </div>
            </div>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.nordlicht-plotter"
                  slug="nordlicht-plotter"
                  alt="A wide-format plotter drawing a contour map in a survey office"
                />
                <figcaption data-edit="terrain.caption" data-edit-max="120" data-edit-multiline>Sheet N-114 coming off the plotter, third proof.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.nordlicht-model"
                  slug="nordlicht-model"
                  alt="A milled physical relief model of a fjord landscape on a table"
                />
                <figcaption data-edit="terrain.caption2" data-edit-max="120" data-edit-multiline>Milled relief model, Lyngen, 1:60 000.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- FIELD */}
        <section id="field" className={s.field} aria-labelledby="field-h">
          <div className={s.secHead}>
            <span data-edit="field.secNo" data-edit-max="60" className={s.secNo}>04</span>
            <h2 data-edit="field.title" data-edit-max="60" id="field-h">Where the instruments are</h2>
          </div>
          <div className={s.fieldGrid}>
            <ol className={s.stations}>
              {FIELD.map(([lat, lon, what], i) => (
                <li key={what}>
                  <span data-edit={`field.mono.${i}`} data-edit-max="60" className={s.mono}>{lat}</span>
                  <span data-edit={`field.mono2.${i}`} data-edit-max="60" className={s.mono}>{lon}</span>
                  <span data-edit={`field.text.${i}`} data-edit-max="60">{what}</span>
                </li>
              ))}
            </ol>
            <figure className={s.tall}>
              <Figure editId="photo.nordlicht-field"
                slug="nordlicht-field"
                alt="A survey tripod and total station set up on bare rock above a fjord"
              />
              <figcaption data-edit="field.caption" data-edit-max="120" data-edit-multiline>Control pillar KV-2, occupied 11 hours.</figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <div data-edit-pattern="office.field" data-edit-roles="transparent,2,3,4" className={s.officeField} aria-hidden="true">
            <TabbiedPattern
              pattern={maze}
              palette={['transparent', BLUE, STEEL, PALE]}
              fit="grid"
              cellSize={62}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.officeInner}>
            <div className={s.secHead}>
              <span data-edit="office.secNo" data-edit-max="60" className={s.secNo}>05</span>
              <h2 data-edit="office.title" data-edit-max="60" id="office-h">Storgata 62, Tromsø</h2>
            </div>
            <dl className={s.contact}>
              <div>
                <dt data-edit="office.term" data-edit-max="28">Office</dt>
                <dd data-edit="office.body" data-edit-max="200" data-edit-multiline>
                  Storgata 62, 9008 Tromsø
                  <br />
                  Mon to Fri, 08.00 to 16.00
                </dd>
              </div>
              <div>
                <dt data-edit="office.term2" data-edit-max="28">Enquiries</dt>
                <dd>
                  <a data-edit="office.link" data-edit-max="28" href="mailto:post@nordlicht.example">post@nordlicht.example</a>
                  <br />
                  +47 00 00 00 00
                </dd>
              </div>
              <div>
                <dt data-edit="office.term3" data-edit-max="28">Sheets</dt>
                <dd data-edit="office.body2" data-edit-max="200" data-edit-multiline>
                  Over the counter, or by post anywhere in Norway.
                  <br />
                  NOK 180 flat, folded or rolled.
                </dd>
              </div>
              <div>
                <dt data-edit="office.term4" data-edit-max="28">Field season</dt>
                <dd data-edit="office.body3" data-edit-max="200" data-edit-multiline>
                  Airborne work March to October.
                  <br />
                  Hydrographic work all year, weather allowing.
                </dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">How a sheet is coloured</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Three tints, printed in that order. Every sheet in the catalogue uses the same three and nothing else.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={glazing}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5400}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.nordlicht-tile-chart-cutout" slug="nordlicht-tile-chart-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Water and depth</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Flat tint under everything. Two steps only: charted depth and the rest. A third step would imply a survey we have not done.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={protractor}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={6200}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.nordlicht-tile-theodolite-cutout" slug="nordlicht-tile-theodolite-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Relief and slope</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Hillshade from our own lidar, never from a public model. Where the cloud is thin the tint stops and the sheet says so.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={stipplefade}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={4800}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.nordlicht-tile-compass-cutout" slug="nordlicht-tile-compass-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Culture and route</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>The only layer allowed the accent blue. Roads, tracks, cairns, and the two ferries that still run in winter.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Instruments on the shelf</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Everything is owned, calibrated annually, and taken to the field by the person who booked it.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Instrument</span>
                <span data-edit="index.text2" data-edit-max="60">Make</span>
                <span data-edit="index.text3" data-edit-max="60">Use</span>
                <span data-edit="index.text4" data-edit-max="60">Calibrated</span>
            </li>
              <li key="Total station">
                <span data-edit="index.text5" data-edit-max="60">Total station</span>
                <span data-edit="index.text6" data-edit-max="60">Leica TS16</span>
                <span data-edit="index.text7" data-edit-max="60">Control and detail</span>
                <span data-edit="index.text8" data-edit-max="60">Feb 2026</span>
              </li>
              <li key="GNSS pair">
                <span data-edit="index.text9" data-edit-max="60">GNSS pair</span>
                <span data-edit="index.text10" data-edit-max="60">Trimble R12i</span>
                <span data-edit="index.text11" data-edit-max="60">Static and RTK</span>
                <span data-edit="index.text12" data-edit-max="60">Jan 2026</span>
              </li>
              <li key="Digital level">
                <span data-edit="index.text13" data-edit-max="60">Digital level</span>
                <span data-edit="index.text14" data-edit-max="60">Leica LS15</span>
                <span data-edit="index.text15" data-edit-max="60">Precise levelling</span>
                <span data-edit="index.text16" data-edit-max="60">Feb 2026</span>
              </li>
              <li key="Lidar, airborne">
                <span data-edit="index.text17" data-edit-max="60">Lidar, airborne</span>
                <span data-edit="index.text18" data-edit-max="60">Riegl VUX-1</span>
                <span data-edit="index.text19" data-edit-max="60">Terrain capture</span>
                <span data-edit="index.text20" data-edit-max="60">Mar 2026</span>
              </li>
              <li key="Multibeam">
                <span data-edit="index.text21" data-edit-max="60">Multibeam</span>
                <span data-edit="index.text22" data-edit-max="60">Kongsberg EM 2040</span>
                <span data-edit="index.text23" data-edit-max="60">Bathymetry</span>
                <span data-edit="index.text24" data-edit-max="60">Nov 2025</span>
              </li>
              <li key="Tide gauges">
                <span data-edit="index.text25" data-edit-max="60">Tide gauges</span>
                <span data-edit="index.text26" data-edit-max="60">Own build, 4 off</span>
                <span data-edit="index.text27" data-edit-max="60">Reduction</span>
                <span data-edit="index.text28" data-edit-max="60">Continuous</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Asked at the counter</h2>
          <dl className={s.faqList}>
              <div key="Why is my house not on t">
                <dt data-edit="faq.term" data-edit-max="28">Why is my house not on the sheet?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Buildings under twelve square metres are omitted at 1:25 000 and everything is omitted at 1:50 000. It is on the survey; it is not on the print.</dd>
              </div>
              <div key="Can I have the data inst">
                <dt data-edit="faq.term2" data-edit-max="28">Can I have the data instead of the sheet?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Yes, as LAZ or GeoPackage, at the same price. We will ask what you intend to do with it, not to refuse you but because the answer changes which product is right.</dd>
              </div>
              <div key="Do you correct errors?">
                <dt data-edit="faq.term3" data-edit-max="28">Do you correct errors?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Every reported error is checked within a fortnight and the sheet is reissued at the next printing. The errata list is on the counter, on paper, going back to 1998.</dd>
              </div>
              <div key="Why no digital hillshade">
                <dt data-edit="faq.term4" data-edit-max="28">Why no digital hillshade on the 1:50 000?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Because at that scale it hides the contours, which are the thing you actually navigate by.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={gyre}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={116}
              redrawInterval={5012}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Nordlicht</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Survey and cartography from Storgata 62, Tromsø, since 1998.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Survey</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.survey" data-edit-max="28" href="#survey">What we do</a>
              </li>
              <li>
                <a data-edit="footer.terrain" data-edit-max="28" href="#terrain">Terrain models</a>
              </li>
              <li>
                <a data-edit="footer.field" data-edit-max="28" href="#field">Field stations</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Sheets</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.charts" data-edit-max="28" href="#charts">Published sheets</a>
              </li>
              <li>
                <a data-edit="footer.office" data-edit-max="28" href="#office">Buy over the counter</a>
              </li>
              <li>
                <a data-edit="footer.office2" data-edit-max="28" href="#office">By post</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Storgata 62
              <br />
              9008 Tromsø
              <br />
              post@nordlicht.example
              <br />
              +47 00 00 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional survey office. Prices and times are invented.</p>
          <p>
            Patterns by{' '}
            <a data-edit="footer.link" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground and redrawn on a timer.
          </p>
        </div>
      </footer>
    </div>
  );
}
