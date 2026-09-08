import { TabbiedPattern } from 'tabbied/react';
import {
  beamspread, dimmer, falloff, radiance, spraydown, sunray,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './lichtfeld.module.css';

export const metadata = {
  title: 'Lichtfeld: Lichtplanung, München',
  description:
    'Lichtfeld plans light for buildings and public space. Mock-ups before drawings, measured lux, and a strict position on what should stay dark.',
};

/* Near-black ground, white type, one warm yellow that is the light itself.
   Every field takes `transparent` in the background slot. */
const WHITE = '#FAFAF5';
const WARM = '#F5E663';
const GREY = '#6A6A64';
const PANEL = '#151515';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PANEL;


const WORK = [
  { code: 'L-118', name: 'Pinakothek, west stair', kind: 'Interior, public', year: '2026', lux: '80 lx' },
  { code: 'L-112', name: 'Hofgarten colonnade', kind: 'Exterior, listed', year: '2025', lux: '12 lx' },
  { code: 'L-104', name: 'Werkhalle 3, Riem', kind: 'Industrial', year: '2025', lux: '500 lx' },
  { code: 'L-097', name: 'Sankt Bonifaz, nave', kind: 'Sacred', year: '2024', lux: '50 lx' },
  { code: 'L-089', name: 'Isar footbridge', kind: 'Exterior, public', year: '2023', lux: '5 lx' },
];

const POSITIONS = [
  { n: '01', t: 'Mock up before you draw', d: 'We build the condition full size, on site, at night, and look at it. Every scheme we have regretted was one that went to drawings first.' },
  { n: '02', t: 'Dark is a material', d: 'The brief usually asks how bright. The useful question is what should stay unlit, and it is almost always more than the client expects.' },
  { n: '03', t: 'One colour temperature', d: 'A single CCT per space, held across every fixture and every replacement lamp for the life of the building. Written into the O&M manual.' },
  { n: '04', t: 'Measure, then argue', d: 'We bring a meter to every handover. An opinion about a lighting scheme is worth having; a reading is worth acting on.' },
];

const NUMBERS = [
  ['118', 'Schemes since 2006'],
  ['2 700 K', 'House warm white'],
  ['5 lx', 'Lowest scheme'],
  ['0', 'Uplighters specified'],
];

export default function LichtfeldPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--dark': '#0a0a0a',
        '--white': '#fafaf5',
        '--warm': '#f5e663',
        '--grey': '#6a6a64',
        '--panel': '#151515',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="dark,white,warm,grey,panel"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Lichtfeld
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.work" data-edit-max="28" href="#work">Work</a>
          <a data-edit="bar.positions" data-edit-max="28" href="#positions">Positions</a>
          <a data-edit="bar.method" data-edit-max="28" href="#method">Method</a>
          <a data-edit="bar.studio" data-edit-max="28" href="#studio">Studio</a>
        </nav>
        <span data-edit="bar.tag" data-edit-max="60" className={s.tag}>Lichtplanung / München</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={falloff}
              palette={['transparent', WARM, GREY]}
              fit="grid"
              cellSize={168}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Lichtplanung / seit 2006</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              The question is
              <br />
              never how bright.
              <br />
              <span>It is what stays dark.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Light for buildings, streets and one footbridge. We mock up on
              site before we draw, and we bring a meter to the handover.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.lichtfeld-stair"
            slug="lichtfeld-stair"
            alt="A concrete stair at night lit only by a continuous recessed line of warm light"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>L-118, west stair. 80 lx on the tread, nothing on the wall.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ----------------------------------------------------------- WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <h2 data-edit="work.h2" data-edit-max="60" className={s.h2} id="work-h">
            Recent schemes
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span data-edit="work.text" data-edit-max="60">Job</span>
              <span data-edit="work.text2" data-edit-max="60">Scheme</span>
              <span data-edit="work.text3" data-edit-max="60">Type</span>
              <span data-edit="work.text4" data-edit-max="60">Design level</span>
              <span data-edit="work.text5" data-edit-max="60">Year</span>
            </li>
            {WORK.map((w, i) => (
              <li key={w.code}>
                <span data-edit={`work.code.${i}`} data-edit-max="60" className={s.code}>{w.code}</span>
                <span data-edit={`work.name.${i}`} data-edit-max="60" className={s.name}>{w.name}</span>
                <span data-edit={`work.kind.${i}`} data-edit-max="60" className={s.kind}>{w.kind}</span>
                <span data-edit={`work.lux.${i}`} data-edit-max="60" className={s.lux}>{w.lux}</span>
                <span data-edit={`work.year.${i}`} data-edit-max="60" className={s.year}>{w.year}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------- GLOW BAND */}
        <section className={s.glowBand} aria-hidden="true">
          <div data-edit-pattern="glowBand.field" data-edit-roles="transparent,2,1,3" className={s.glowField}>
            <TabbiedPattern
              pattern={radiance}
              palette={['transparent', WARM, WHITE, GREY]}
              fit="grid"
              cellSize={136}
              redrawInterval={3400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------ POSITIONS */}
        <section id="positions" className={s.positions} aria-labelledby="positions-h">
          <div data-edit-pattern="positions.field" data-edit-roles="transparent,3,2" className={s.posField} aria-hidden="true">
            <TabbiedPattern
              pattern={sunray}
              palette={['transparent', GREY, WARM]}
              fit="grid"
              cellSize={140}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.posInner}>
            <h2 data-edit="positions.h2" data-edit-max="60" className={s.h2} id="positions-h">
              Four positions
            </h2>
            <ol className={s.posList}>
              {POSITIONS.map((p, i) => (
                <li key={p.n}>
                  <span data-edit={`positions.pN.${i}`} data-edit-max="60" className={s.pN}>{p.n}</span>
                  <h3 data-edit={`positions.title.${i}`} data-edit-max="40">{p.t}</h3>
                  <p data-edit={`positions.body.${i}`} data-edit-max="240" data-edit-multiline>{p.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.lichtfeld-mockup"
                  slug="lichtfeld-mockup"
                  alt="A lighting mock-up room with several fixtures aimed at a sample wall"
                />
                <figcaption data-edit="positions.caption" data-edit-max="120" data-edit-multiline>Mock-up, L-112. Four options, one night, one decision.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.lichtfeld-fixture"
                  slug="lichtfeld-fixture"
                  alt="A single machined luminaire on a plain workbench lit from the side"
                />
                <figcaption data-edit="positions.caption2" data-edit-max="120" data-edit-multiline>Bespoke, 2,700 K, machined in Augsburg.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <h2 data-edit="method.h2" data-edit-max="60" className={s.h2} id="method-h">
            How a scheme happens
          </h2>
          <div className={s.methodGrid}>
            <p data-edit="method.big" data-edit-max="240" data-edit-multiline className={s.big}>
              Walk the site after dark. Build the mock-up. Look at it with the
              people who will use the building, not only the ones paying for it.
              Then draw.
            </p>
            <div className={s.methodCol}>
              <p data-edit="method.body" data-edit-max="240" data-edit-multiline>
                We do not issue a lighting layout until a full-size condition has
                been seen at night by somebody with the authority to change their
                mind. It costs a fortnight and saves a year.
              </p>
              <p data-edit="method.body2" data-edit-max="240" data-edit-multiline>
                Commissioning is part of the fee, not an extra. We aim every
                fixture ourselves, at night, and we come back once in the first
                winter to do it again.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure editId="photo.lichtfeld-facade"
              slug="lichtfeld-facade"
              alt="A building facade at dusk washed with warm light from below"
            />
            <figcaption data-edit="method.caption" data-edit-max="120" data-edit-multiline>L-112, colonnade. 12 lx, and the sky still legible above it.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div data-edit-pattern="studio.field" data-edit-roles="transparent,2,3" className={s.studioField} aria-hidden="true">
            <TabbiedPattern
              pattern={dimmer}
              palette={['transparent', WARM, GREY]}
              fit="grid"
              cellSize={86}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.studioInner}>
            <h2 data-edit="studio.h2" data-edit-max="60" className={s.h2} id="studio-h">
              Studio
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="studio.term" data-edit-max="28">Office</dt>
                <dd data-edit="studio.body3" data-edit-max="200" data-edit-multiline>
                  Baaderstrasse 18, Rgb.
                  <br />
                  80469 München
                </dd>
              </div>
              <div>
                <dt data-edit="studio.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="studio.link" data-edit-max="28" href="mailto:licht@lichtfeld.example">licht@lichtfeld.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="studio.term3" data-edit-max="28">Appointments</dt>
                <dd data-edit="studio.body" data-edit-max="200" data-edit-multiline>After dark, on site, by preference</dd>
              </div>
              <div>
                <dt data-edit="studio.term4" data-edit-max="28">Fees</dt>
                <dd data-edit="studio.body2" data-edit-max="200" data-edit-multiline>Percentage or lump sum. Commissioning always included.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three things we will not specify</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Not taste. Each of these causes a specific, measurable problem we have been called back to fix.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dimmer}
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
                  <Figure editId="photo.lichtfeld-tile-uplighter-cutout" slug="lichtfeld-tile-uplighter-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Uplighters</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>They light the sky, the underside of leaves and the inside of your eye, in that order. Nothing that matters is above the fixture.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={falloff}
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
                  <Figure editId="photo.lichtfeld-tile-bollard-cutout" slug="lichtfeld-tile-bollard-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Cool white outdoors</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Four thousand kelvin outdoors reads as institutional at any level, disturbs insects far more than warm white, and never flatters a facade.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={spraydown}
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
                  <Figure editId="photo.lichtfeld-tile-lamp-cutout" slug="lichtfeld-tile-lamp-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Above 3 000 K near a bed</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>It is not about atmosphere. It is about the hour before sleep, and it is the one thing clients thank us for two years later.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">What we hand over</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>At practical completion, on paper and as files. The O&M is written to be read by a caretaker, not a lawyer.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Document</span>
                <span data-edit="index.text2" data-edit-max="60">Format</span>
                <span data-edit="index.text3" data-edit-max="60">For</span>
                <span data-edit="index.text4" data-edit-max="60">Note</span>
            </li>
              <li key="Lighting layout">
                <span data-edit="index.text5" data-edit-max="60">Lighting layout</span>
                <span data-edit="index.text6" data-edit-max="60">PDF, DWG</span>
                <span data-edit="index.text7" data-edit-max="60">Installer</span>
                <span data-edit="index.text8" data-edit-max="60">Aiming angles marked</span>
              </li>
              <li key="Schedule">
                <span data-edit="index.text9" data-edit-max="60">Schedule</span>
                <span data-edit="index.text10" data-edit-max="60">PDF, XLSX</span>
                <span data-edit="index.text11" data-edit-max="60">Client</span>
                <span data-edit="index.text12" data-edit-max="60">With replacement lamps</span>
              </li>
              <li key="Control strategy">
                <span data-edit="index.text13" data-edit-max="60">Control strategy</span>
                <span data-edit="index.text14" data-edit-max="60">PDF</span>
                <span data-edit="index.text15" data-edit-max="60">Facilities</span>
                <span data-edit="index.text16" data-edit-max="60">Scenes, times, overrides</span>
              </li>
              <li key="Commissioning record">
                <span data-edit="index.text17" data-edit-max="60">Commissioning record</span>
                <span data-edit="index.text18" data-edit-max="60">PDF</span>
                <span data-edit="index.text19" data-edit-max="60">Client</span>
                <span data-edit="index.text20" data-edit-max="60">Measured, not designed, levels</span>
              </li>
              <li key="O&M">
                <span data-edit="index.text21" data-edit-max="60">O&M</span>
                <span data-edit="index.text22" data-edit-max="60">PDF, paper</span>
                <span data-edit="index.text23" data-edit-max="60">Caretaker</span>
                <span data-edit="index.text24" data-edit-max="60">Twelve pages, plain language</span>
              </li>
              <li key="Spares list">
                <span data-edit="index.text25" data-edit-max="60">Spares list</span>
                <span data-edit="index.text26" data-edit-max="60">PDF</span>
                <span data-edit="index.text27" data-edit-max="60">Facilities</span>
                <span data-edit="index.text28" data-edit-max="60">Ten years of availability</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Questions from clients</h2>
          <dl className={s.faqList}>
              <div key="Why do you insist on a m">
                <dt data-edit="faq.term" data-edit-max="28">Why do you insist on a mock-up?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Because everybody, including us, is wrong about light on paper. A fortnight of mock-up has saved every project we have run it on.</dd>
              </div>
              <div key="Is LED still improving?">
                <dt data-edit="faq.term2" data-edit-max="28">Is LED still improving?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>The chips, marginally. The drivers and the optics, considerably. We specify for the driver being replaceable, which most fittings still do not allow.</dd>
              </div>
              <div key="Can you work with our el">
                <dt data-edit="faq.term3" data-edit-max="28">Can you work with our electrical engineer?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Always. We do the design intent and the aiming; they do the distribution and the compliance. It only goes wrong when nobody says which is which.</dd>
              </div>
              <div key="What does it cost?">
                <dt data-edit="faq.term4" data-edit-max="28">What does it cost?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Percentage or lump sum, and commissioning is always inside it. A scheme we do not commission is a scheme we did not design.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,1,3" className={s.codaField}>
            <TabbiedPattern
              pattern={beamspread}
              palette={['transparent', WHITE, GREY]}
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
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Lichtfeld</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Lichtplanung, Baaderstrasse 18, München, seit 2006.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Work</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.work" data-edit-max="28" href="#work">Recent schemes</a>
              </li>
              <li>
                <a data-edit="footer.positions" data-edit-max="28" href="#positions">Four positions</a>
              </li>
              <li>
                <a data-edit="footer.method" data-edit-max="28" href="#method">How a scheme happens</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Studio</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.studio" data-edit-max="28" href="#studio">Baaderstrasse 18</a>
              </li>
              <li>
                <a data-edit="footer.studio2" data-edit-max="28" href="#studio">Fees</a>
              </li>
              <li>
                <a data-edit="footer.studio3" data-edit-max="28" href="#studio">Appointments after dark</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Baaderstrasse 18, Rgb.
              <br />
              80469 München
              <br />
              licht@lichtfeld.example
              <br />
              House warm white, 2 700 K
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional lighting practice. Prices and times are invented.</p>
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
