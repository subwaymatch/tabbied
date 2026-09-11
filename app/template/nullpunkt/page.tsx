import { TabbiedPattern } from 'tabbied/react';
import {
  dipole, gimbal, nutation, ortho, protractor, ring,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './nullpunkt.module.css';

export const metadata = {
  title: 'Nullpunkt: Institut für Messtechnik',
  description:
    'Nullpunkt is a national calibration laboratory in Braunschweig. Length, mass, temperature and time, traceable to the SI and stated with an uncertainty.',
};

/* White, black, one red used exactly four times on the page. Pattern fields
   take `transparent` in the background slot; nothing here is tinted. */
const INK = '#0A0A0A';
const RED = '#E10600';
const GREY = '#9EA2A6';
const PALE = '#DBDBD9';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const SERVICES = [
  { q: 'Length', range: '0.5 mm to 1 000 mm', unc: '± (0.05 + L/2000) µm', kit: 'Gauge blocks, CMM, interferometer' },
  { q: 'Mass', range: '1 mg to 50 kg', unc: '± 0.15 mg at 1 kg', kit: 'E1 weights, comparator' },
  { q: 'Temperature', range: '−80 °C to 660 °C', unc: '± 4 mK at fixed points', kit: 'SPRT, fixed-point cells' },
  { q: 'Time and frequency', range: '10 MHz to 10 GHz', unc: '± 2 × 10⁻¹³ / day', kit: 'Caesium standard, GNSS link' },
  { q: 'Pressure', range: '1 Pa to 100 MPa', unc: '± 12 ppm', kit: 'Piston gauges, two ranges' },
  { q: 'Electrical', range: '1 µV to 1 kV', unc: '± 0.6 ppm at 10 V', kit: 'Josephson standard' },
];

const PRINCIPLES = [
  { n: '1', t: 'A number without an uncertainty is not a measurement', d: 'Every certificate we issue states the uncertainty, the coverage factor and the confidence level. There is no house style that omits them.' },
  { n: '2', t: 'The chain is only as good as its weakest link', d: 'We publish our own traceability chain, upward to the national standard and downward to the instrument on your bench.' },
  { n: '3', t: 'Repeat before you believe', d: 'Every calibration is run at least three times, at least once by a second metrologist, on a different day.' },
  { n: '4', t: 'Report the failures too', d: 'If your instrument is out of tolerance, the certificate says so on the first line and not in an annexe.' },
];

const TURNAROUND = [
  ['Standard', '15 working days', 'Included'],
  ['Priority', '5 working days', '+ 60 %'],
  ['Same week', '3 working days', '+ 140 %'],
  ['On site', 'By arrangement', 'Quoted'],
];

export default function NullpunktPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--white': '#ffffff',
        '--ink': '#0a0a0a',
        '--red': '#e10600',
        '--grey': '#9ea2a6',
        '--pale': '#dbdbd9',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="white,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.link" data-edit-format="emphasis" data-edit-max="28" className={s.mark} href="#top">
          <span className={s.dot} aria-hidden="true" />
          Nullpunkt
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.scope" data-edit-max="28" href="#scope">Scope</a>
          <a data-edit="bar.principles" data-edit-max="28" href="#principles">Principles</a>
          <a data-edit="bar.turnaround" data-edit-max="28" href="#turnaround">Turnaround</a>
          <a data-edit="bar.lab" data-edit-max="28" href="#lab">Laboratory</a>
        </nav>
        <span data-edit="bar.accred" data-edit-max="60" className={s.accred}>Akkreditiert · D-K-00000-00-00</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={ortho}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={160}
              redrawInterval={7000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Institut für Messtechnik / Braunschweig</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              Zero is a
              <br />
              <span>decision</span>, and
              <br />
              somebody has to
              <br />
              make it.
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              We calibrate the instruments that other laboratories calibrate
              against. Six quantities, one uncertainty budget each, published in
              full.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.nullpunkt-gauges"
            slug="nullpunkt-gauges"
            alt="A fitted case of precision steel gauge blocks opened on a white laboratory bench"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Set 04, grade K. Wrung, measured, and put back the same afternoon.</figcaption>
        </figure>

        {/* --------------------------------------------------------- SCOPE */}
        <section id="scope" className={s.scope} aria-labelledby="scope-h">
          <h2 data-edit="scope.h2" data-edit-max="60" className={s.h2} id="scope-h">
            Scope of accreditation
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span data-edit="scope.text" data-edit-max="60">Quantity</span>
              <span data-edit="scope.text2" data-edit-max="60">Range</span>
              <span data-edit="scope.text3" data-edit-max="60">Best uncertainty</span>
              <span data-edit="scope.text4" data-edit-max="60">Reference</span>
            </li>
            {SERVICES.map((x, i) => (
              <li key={x.q}>
                <span data-edit={`scope.q.${i}`} data-edit-max="60" className={s.q}>{x.q}</span>
                <span data-edit={`scope.num.${i}`} data-edit-max="60" className={s.num}>{x.range}</span>
                <span data-edit={`scope.unc.${i}`} data-edit-max="60" className={s.unc}>{x.unc}</span>
                <span data-edit={`scope.kit.${i}`} data-edit-max="60" className={s.kit}>{x.kit}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------- ZERO BAND */}
        <section className={s.zeroBand} aria-hidden="true">
          <div data-edit-pattern="zeroBand.field" data-edit-roles="transparent,1,2,3" className={s.zeroField}>
            <TabbiedPattern
              pattern={ring}
              palette={['transparent', INK, RED, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={4000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------- PRINCIPLES */}
        <section id="principles" className={s.principles} aria-labelledby="principles-h">
          <div data-edit-pattern="principles.field" data-edit-roles="transparent,3,4" className={s.prField} aria-hidden="true">
            <TabbiedPattern
              pattern={gimbal}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={106}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.prInner}>
            <h2 data-edit="principles.h2" data-edit-max="60" className={s.h2} id="principles-h">
              Four things we will not negotiate
            </h2>
            <ol className={s.prList}>
              {PRINCIPLES.map((p, i) => (
                <li key={p.n}>
                  <span data-edit={`principles.prN.${i}`} data-edit-max="60" className={s.prN}>{p.n}</span>
                  <div>
                    <h3 data-edit={`principles.title.${i}`} data-edit-max="40">{p.t}</h3>
                    <p data-edit={`principles.body.${i}`} data-edit-max="240" data-edit-multiline>{p.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------- LAB PAIR */}
        <div className={s.pair}>
          <figure>
            <Figure editId="photo.nullpunkt-cmm"
              slug="nullpunkt-cmm"
              alt="A coordinate measuring machine with a probe over a metal part in a clean laboratory"
            />
            <figcaption data-edit="top.caption2" data-edit-max="120" data-edit-multiline>CMM 2, granite table, 20.0 °C ± 0.1.</figcaption>
          </figure>
          <figure>
            <Figure editId="photo.nullpunkt-artefact"
              slug="nullpunkt-artefact"
              alt="A polished metal cylinder standing under a glass bell jar on a black granite table"
            />
            <figcaption data-edit="top.caption3" data-edit-max="120" data-edit-multiline>Transfer artefact, checked every ninety days.</figcaption>
          </figure>
        </div>

        {/* ---------------------------------------------------- TURNAROUND */}
        <section id="turnaround" className={s.turn} aria-labelledby="turn-h">
          <h2 data-edit="turnaround.h2" data-edit-max="60" className={s.h2} id="turn-h">
            Turnaround
          </h2>
          <ol className={s.turnList}>
            {TURNAROUND.map(([tier, days, cost], i) => (
              <li key={tier}>
                <span data-edit={`turnaround.tTier.${i}`} data-edit-max="60" className={s.tTier}>{tier}</span>
                <span data-edit={`turnaround.tDays.${i}`} data-edit-max="60" className={s.tDays}>{days}</span>
                <span data-edit={`turnaround.tCost.${i}`} data-edit-max="60" className={s.tCost}>{cost}</span>
              </li>
            ))}
          </ol>
          <p data-edit="turnaround.turnNote" data-edit-max="240" data-edit-multiline className={s.turnNote}>
            The clock starts when the instrument reaches the laboratory and has
            reached room temperature, which for a steel artefact from a cold van
            is not the same morning.
          </p>
        </section>

        {/* ----------------------------------------------------------- LAB */}
        <section id="lab" className={s.lab} aria-labelledby="lab-h">
          <div data-edit-pattern="lab.field" data-edit-roles="transparent,2,3" className={s.labField} aria-hidden="true">
            <TabbiedPattern
              pattern={dipole}
              palette={['transparent', RED, GREY]}
              fit="grid"
              cellSize={124}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.labInner}>
            <h2 data-edit="lab.h2" data-edit-max="60" className={s.h2} id="lab-h">
              Bundesallee 100
            </h2>
            <div className={s.labGrid}>
              <p data-edit="lab.big" data-edit-max="240" data-edit-multiline className={s.big}>
                Four measurement rooms held at 20.0 °C, two of them to a tenth.
                Deliveries to the rear, and please do not open the case in the
                corridor.
              </p>
              <dl>
                <div>
                  <dt data-edit="lab.term" data-edit-max="28">Laboratory</dt>
                  <dd data-edit="lab.body3" data-edit-max="200" data-edit-multiline>
                    Bundesallee 100
                    <br />
                    38116 Braunschweig
                  </dd>
                </div>
                <div>
                  <dt data-edit="lab.term2" data-edit-max="28">Submissions</dt>
                  <dd>
                    <a data-edit="lab.link" data-edit-max="28" href="mailto:kalibrierung@nullpunkt.example">
                      kalibrierung@nullpunkt.example
                    </a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="lab.term3" data-edit-max="28">Goods in</dt>
                  <dd data-edit="lab.body" data-edit-max="200" data-edit-multiline>Mon to Thu, 07.30 to 15.00</dd>
                </div>
                <div>
                  <dt data-edit="lab.term4" data-edit-max="28">Certificates</dt>
                  <dd data-edit="lab.body2" data-edit-max="200" data-edit-multiline>Signed PDF, and paper on request, at no charge</dd>
                </div>
              </dl>
            </div>
            <figure className={s.wide}>
              <Figure editId="photo.nullpunkt-lab"
                slug="nullpunkt-lab"
                alt="An empty temperature-controlled measurement laboratory with white surfaces"
              />
              <figcaption data-edit="lab.caption" data-edit-max="120" data-edit-multiline>Room 2, empty and at temperature. This is what good looks like.</figcaption>
            </figure>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three sources of uncertainty</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Every certificate states these. The budget is published in full with each result.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={ring}
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
                  <Figure editId="photo.nullpunkt-tile-mass-cutout" slug="nullpunkt-tile-mass-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">The reference</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>How well the standard itself is known, and how long since it was compared upward. This is usually the smallest term and the hardest to improve.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={gimbal}
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
                  <Figure editId="photo.nullpunkt-tile-logger-cutout" slug="nullpunkt-tile-logger-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">The environment</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Temperature, and then temperature again. Twenty degrees is a definition, not a room, and holding it to a tenth costs more than the instrument.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={protractor}
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
                  <Figure editId="photo.nullpunkt-tile-tweezers-cutout" slug="nullpunkt-tile-tweezers-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">The operator</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Repeatability across three runs and two people. If the operator term dominates, the method is wrong, not the person.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Reference standards held</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>What sits at the top of our chain, and when each was last compared upward.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Standard</span>
                <span data-edit="index.text2" data-edit-max="60">Quantity</span>
                <span data-edit="index.text3" data-edit-max="60">Traceable to</span>
                <span data-edit="index.text4" data-edit-max="60">Last compared</span>
            </li>
              <li key="Gauge block set, grade K">
                <span data-edit="index.text5" data-edit-max="60">Gauge block set, grade K</span>
                <span data-edit="index.text6" data-edit-max="60">Length</span>
                <span data-edit="index.text7" data-edit-max="60">PTB</span>
                <span data-edit="index.text8" data-edit-max="60">Sep 2025</span>
              </li>
              <li key="E1 mass set, 1 mg to 20 kg">
                <span data-edit="index.text9" data-edit-max="60">E1 mass set, 1 mg to 20 kg</span>
                <span data-edit="index.text10" data-edit-max="60">Mass</span>
                <span data-edit="index.text11" data-edit-max="60">PTB</span>
                <span data-edit="index.text12" data-edit-max="60">Jun 2025</span>
              </li>
              <li key="SPRT with fixed points">
                <span data-edit="index.text13" data-edit-max="60">SPRT with fixed points</span>
                <span data-edit="index.text14" data-edit-max="60">Temperature</span>
                <span data-edit="index.text15" data-edit-max="60">PTB</span>
                <span data-edit="index.text16" data-edit-max="60">Mar 2025</span>
              </li>
              <li key="Caesium standard">
                <span data-edit="index.text17" data-edit-max="60">Caesium standard</span>
                <span data-edit="index.text18" data-edit-max="60">Frequency</span>
                <span data-edit="index.text19" data-edit-max="60">PTB via GNSS</span>
                <span data-edit="index.text20" data-edit-max="60">Continuous</span>
              </li>
              <li key="Piston gauge, two ranges">
                <span data-edit="index.text21" data-edit-max="60">Piston gauge, two ranges</span>
                <span data-edit="index.text22" data-edit-max="60">Pressure</span>
                <span data-edit="index.text23" data-edit-max="60">PTB</span>
                <span data-edit="index.text24" data-edit-max="60">Nov 2025</span>
              </li>
              <li key="Josephson array">
                <span data-edit="index.text25" data-edit-max="60">Josephson array</span>
                <span data-edit="index.text26" data-edit-max="60">Voltage</span>
                <span data-edit="index.text27" data-edit-max="60">PTB</span>
                <span data-edit="index.text28" data-edit-max="60">Apr 2025</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Before you send an instrument</h2>
          <dl className={s.faqList}>
              <div key="How should it be packed?">
                <dt data-edit="faq.term" data-edit-max="28">How should it be packed?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>In its own case, in a box, with the case not touching the box. Most damage we see happens in transit and none of it is dramatic.</dd>
              </div>
              <div key="Will you adjust it as we">
                <dt data-edit="faq.term2" data-edit-max="28">Will you adjust it as well as calibrate it?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Only if you ask in writing. Calibration and adjustment are different jobs, and an adjusted instrument has no history.</dd>
              </div>
              <div key="What if it is out of tol">
                <dt data-edit="faq.term3" data-edit-max="28">What if it is out of tolerance?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>The certificate says so on the first line and we telephone you the same day, because the interesting question is what you measured with it last month.</dd>
              </div>
              <div key="Can I watch?">
                <dt data-edit="faq.term4" data-edit-max="28">Can I watch?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Yes. Ask when you book. Most people stay twenty minutes and leave with a better feel for why it takes fifteen days.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={nutation}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={106}
              redrawInterval={4942}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Nullpunkt</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Institut für Messtechnik, Bundesallee 100, Braunschweig.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Calibration</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.scope" data-edit-max="28" href="#scope">Scope of accreditation</a>
              </li>
              <li>
                <a data-edit="footer.turnaround" data-edit-max="28" href="#turnaround">Turnaround</a>
              </li>
              <li>
                <a data-edit="footer.principles" data-edit-max="28" href="#principles">Principles</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Laboratory</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.lab" data-edit-max="28" href="#lab">Bundesallee 100</a>
              </li>
              <li>
                <a data-edit="footer.lab2" data-edit-max="28" href="#lab">Goods in</a>
              </li>
              <li>
                <a data-edit="footer.lab3" data-edit-max="28" href="#lab">Certificates</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Bundesallee 100
              <br />
              38116 Braunschweig
              <br />
              kalibrierung@nullpunkt.example
              <br />
              D-K-00000-00-00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional calibration laboratory. Prices and times are invented.</p>
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
