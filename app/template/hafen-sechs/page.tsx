import { TabbiedPattern } from 'tabbied/react';
import {
  bothways, dotmatrix, gravure, hurdle, isocube, staple,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './hafen-sechs.module.css';

export const metadata = {
  title: 'Hafen Sechs: Container Terminal, Bremerhaven',
  description:
    'Terminal 6, Bremerhaven. Six berths, fourteen gantries, 2.1 million TEU a year. Berth windows, tariffs and gate hours.',
};

/* Dark ground, bone type, signal yellow. Pattern fields take `transparent`
   in the background slot so the night colour of the page shows through. */
const BONE = '#F0EFEA';
const YELLOW = '#FFD400';
const STEEL = '#6E747C';
const DEEP = '#1C2026';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = BONE;
const TILE_B = STEEL;


const BERTHS = [
  { no: '61', length: '400 m', depth: '−16.5 m', cranes: '4 × STS', max: '24,000 TEU', status: 'Occupied' },
  { no: '62', length: '400 m', depth: '−16.5 m', cranes: '4 × STS', max: '24,000 TEU', status: 'Free' },
  { no: '63', length: '350 m', depth: '−15.0 m', cranes: '3 × STS', max: '18,000 TEU', status: 'Occupied' },
  { no: '64', length: '350 m', depth: '−15.0 m', cranes: '3 × STS', max: '18,000 TEU', status: 'Free' },
  { no: '65', length: '240 m', depth: '−12.5 m', cranes: '2 × MHC', max: 'Feeder', status: 'Occupied' },
  { no: '66', length: '240 m', depth: '−12.5 m', cranes: '2 × MHC', max: 'Feeder', status: 'Maintenance' },
];

const MOVES = [
  ['2.14 M', 'TEU handled, 2025'],
  ['14', 'Ship-to-shore gantries'],
  ['38.4', 'Moves per crane hour'],
  ['6', 'Berths, 1,980 m of quay'],
];

const SCHEDULE = [
  { vessel: 'Nordkap Express', service: 'NE-3 / Far East', eta: '02.08 04:10', etd: '03.08 19:40', berth: '61' },
  { vessel: 'Mare Frisia', service: 'BAL-1 / Baltic feeder', eta: '02.08 11:25', etd: '02.08 23:00', berth: '65' },
  { vessel: 'Sirius Hanse', service: 'NE-3 / Far East', eta: '03.08 06:00', etd: '04.08 20:15', berth: '63' },
  { vessel: 'Cap Ortegal', service: 'MED-2 / Western Med', eta: '03.08 15:50', etd: '04.08 12:30', berth: '62' },
  { vessel: 'Weserstrom', service: 'BAL-1 / Baltic feeder', eta: '04.08 05:15', etd: '04.08 17:00', berth: '66' },
];

const GATE = [
  ['Road gate', 'Mon to Sat, 05.00 to 23.00', 'Closed Sundays and public holidays'],
  ['Rail head', 'Continuous, 7 days', 'Six tracks, 750 m usable length'],
  ['Barge quay', '06.00 to 22.00', 'Two positions, 110 m each'],
  ['Reefer plugs', 'Continuous', '1,840 positions, monitored at 15 min intervals'],
];

export default function HafenSechsPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--dark': '#101215',
        '--bone': '#f0efea',
        '--yellow': '#ffd400',
        '--steel': '#6e747c',
        '--deep': '#1c2026',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="dark,bone,yellow,steel,deep"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <div className={s.brand}>
          <span data-edit="bar.brandNo" data-edit-max="60" className={s.brandNo}>06</span>
          <span data-edit="bar.text" data-edit-format="emphasis" data-edit-max="60">
            Hafen Sechs
            <i>Containerterminal Bremerhaven</i>
          </span>
        </div>
        <nav aria-label="Sections">
          <a data-edit="bar.berths" data-edit-max="28" href="#berths">Berths</a>
          <a data-edit="bar.schedule" data-edit-max="28" href="#schedule">Schedule</a>
          <a data-edit="bar.gate" data-edit-max="28" href="#gate">Gate</a>
          <a data-edit="bar.contact" data-edit-max="28" href="#contact">Contact</a>
        </nav>
        <p data-edit="bar.body" data-edit-format="emphasis" data-edit-max="240" data-edit-multiline className={s.live}>
          <span aria-hidden="true" />
          Operating normally
        </p>
      </header>

      <main>
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={bothways}
              palette={['transparent', STEEL, YELLOW]}
              fit="grid"
              cellSize={112}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>53°32′ N &nbsp;8°34′ E &nbsp;/&nbsp; Terminal 6</p>
          <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
            Six berths.
            <br />
            Nineteen hundred
            <br />
            <span>and eighty metres.</span>
          </h1>
          <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
            The deepwater terminal at the mouth of the Weser. Two point one
            million TEU last year, every one of them counted twice.
          </p>
          <dl className={s.moves}>
            {MOVES.map(([v, k], i) => (
              <div key={k}>
                <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* A full-height plate: the terminal at night, run edge to edge and
            tall enough to be a page of its own. */}
        <figure className={s.bleedTall}>
          <Figure editId="photo.hafen-stacks"
            slug="hafen-stacks"
            alt="Stacked shipping containers at a port at dusk under floodlights"
            priority
          />
          <figcaption data-edit="main.caption" data-edit-max="120" data-edit-multiline>Block 4C, 21.40. Discharge running two hours ahead.</figcaption>
        </figure>

        {/* -------------------------------------------------------- BERTHS */}
        <section id="berths" className={s.berths} aria-labelledby="berths-h">
          <div className={s.secHead}>
            <span data-edit="berths.text" data-edit-max="60">01</span>
            <h2 data-edit="berths.title" data-edit-max="60" id="berths-h">Berth register</h2>
          </div>
          <ol className={s.berthList}>
            <li className={s.berthHead} aria-hidden="true">
              <span data-edit="berths.text2" data-edit-max="60">Berth</span>
              <span data-edit="berths.text3" data-edit-max="60">Quay</span>
              <span data-edit="berths.text4" data-edit-max="60">Depth</span>
              <span data-edit="berths.text5" data-edit-max="60">Cranes</span>
              <span data-edit="berths.text6" data-edit-max="60">Max call</span>
              <span data-edit="berths.text7" data-edit-max="60">Now</span>
            </li>
            {BERTHS.map((b, i) => (
              <li key={b.no}>
                <span data-edit={`berths.bNo.${i}`} data-edit-max="60" className={s.bNo}>{b.no}</span>
                <span data-edit={`berths.text8.${i}`} data-edit-max="60">{b.length}</span>
                <span data-edit={`berths.text9.${i}`} data-edit-max="60">{b.depth}</span>
                <span data-edit={`berths.text10.${i}`} data-edit-max="60">{b.cranes}</span>
                <span data-edit={`berths.text11.${i}`} data-edit-max="60">{b.max}</span>
                <span data-edit={`berths.free.${i}`} data-edit-max="60"
                  className={
                    b.status === 'Free'
                      ? s.free
                      : b.status === 'Maintenance'
                        ? s.maint
                        : s.busy
                  }
                >
                  {b.status}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------- CRANE BAND */}
        <section className={s.craneBand} aria-hidden="true">
          <div data-edit-pattern="craneBand.field" data-edit-roles="transparent,2,1,3" className={s.craneField}>
            <TabbiedPattern
              pattern={staple}
              palette={['transparent', YELLOW, BONE, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={3400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------ SCHEDULE */}
        <section id="schedule" className={s.schedule} aria-labelledby="schedule-h">
          <div data-edit-pattern="schedule.field" data-edit-roles="transparent,3,4" className={s.scheduleField} aria-hidden="true">
            <TabbiedPattern
              pattern={hurdle}
              palette={['transparent', STEEL, DEEP]}
              fit="grid"
              cellSize={130}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.scheduleInner}>
            <div className={s.secHead}>
              <span data-edit="schedule.text" data-edit-max="60">02</span>
              <h2 data-edit="schedule.title" data-edit-max="60" id="schedule-h">Expected this week</h2>
            </div>
            <p data-edit="schedule.note" data-edit-max="240" data-edit-multiline className={s.note}>
              Times are local, updated at 06.00 and 18.00. A vessel inside its
              window keeps its berth; a vessel outside it takes the next free one.
            </p>
            <ol className={s.calls}>
              {SCHEDULE.map((c, i) => (
                <li key={c.vessel}>
                  <span data-edit={`schedule.vessel.${i}`} data-edit-max="60" className={s.vessel}>{c.vessel}</span>
                  <span data-edit={`schedule.service.${i}`} data-edit-max="60" className={s.service}>{c.service}</span>
                  <span className={s.time}>
                    <i>ETA</i>
                    {c.eta}
                  </span>
                  <span className={s.time}>
                    <i>ETD</i>
                    {c.etd}
                  </span>
                  <span data-edit={`schedule.berthTag.${i}`} data-edit-max="60" className={s.berthTag}>{c.berth}</span>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.hafen-crane"
                  slug="hafen-crane"
                  alt="A tall yellow gantry crane against a dark evening sky"
                />
                <figcaption data-edit="schedule.caption" data-edit-max="120" data-edit-multiline>Gantry 09, boom raised between calls.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.hafen-control"
                  slug="hafen-control"
                  alt="A dim port control room at night with monitors and a wide window"
                />
                <figcaption data-edit="schedule.caption2" data-edit-max="120" data-edit-multiline>Tower, night shift. Six screens, one kettle.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- GATE */}
        <section id="gate" className={s.gate} aria-labelledby="gate-h">
          <div className={s.secHead}>
            <span data-edit="gate.text" data-edit-max="60">03</span>
            <h2 data-edit="gate.title" data-edit-max="60" id="gate-h">Gate and hinterland</h2>
          </div>
          <ul className={s.gateList}>
            {GATE.map(([what, when, note], i) => (
              <li key={what}>
                <span data-edit={`gate.gWhat.${i}`} data-edit-max="60" className={s.gWhat}>{what}</span>
                <span data-edit={`gate.gWhen.${i}`} data-edit-max="60" className={s.gWhen}>{when}</span>
                <span data-edit={`gate.gNote.${i}`} data-edit-max="60" className={s.gNote}>{note}</span>
              </li>
            ))}
          </ul>
          <figure className={s.wide}>
            <Figure editId="photo.hafen-bollard"
              slug="hafen-bollard"
              alt="A heavy mooring rope over a steel bollard on a wet concrete quay"
            />
            <figcaption data-edit="gate.caption" data-edit-max="120" data-edit-multiline>Bollard 61-04. Rated 200 tonnes, inspected quarterly.</figcaption>
          </figure>
        </section>

        {/* ------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div data-edit-pattern="contact.field" data-edit-roles="transparent,2,3" className={s.contactField} aria-hidden="true">
            <TabbiedPattern
              pattern={dotmatrix}
              palette={['transparent', YELLOW, STEEL]}
              fit="grid"
              cellSize={40}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.contactInner}>
            <h2 data-edit="contact.title" data-edit-max="60" id="contact-h">Terminal office</h2>
            <dl>
              <div>
                <dt data-edit="contact.term" data-edit-max="28">Operations, 24 h</dt>
                <dd data-edit="contact.body" data-edit-max="200" data-edit-multiline>+49 471 000 000</dd>
              </div>
              <div>
                <dt data-edit="contact.term2" data-edit-max="28">Berth booking</dt>
                <dd>
                  <a data-edit="contact.link" data-edit-max="28" href="mailto:berth@hafen-sechs.example">berth@hafen-sechs.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="contact.term3" data-edit-max="28">Address</dt>
                <dd data-edit="contact.body3" data-edit-max="200" data-edit-multiline>
                  Senator-Borttscheller-Str. 6
                  <br />
                  27568 Bremerhaven
                </dd>
              </div>
              <div>
                <dt data-edit="contact.term4" data-edit-max="28">VHF</dt>
                <dd data-edit="contact.body2" data-edit-max="200" data-edit-multiline>Channel 14, call sign HAFEN SECHS</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three things that stop a ship</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Everything else is scheduling. These three are the reasons a berth window is actually lost.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,1,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dotmatrix}
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
                  <Figure editId="photo.hafen-sechs-tile-container-cutout" slug="hafen-sechs-tile-container-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Wind on the boxes</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Above 20 m/s across the stack, gantries stop. A fully-laden 24,000 TEU vessel presents about the same sail area as a small hill.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,1,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={hurdle}
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
                  <Figure editId="photo.hafen-sechs-tile-cleat-cutout" slug="hafen-sechs-tile-cleat-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Draught and tide</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Sixteen and a half metres at the berth, but the approach channel decides. Deep-laden arrivals take the tide, and the tide does not negotiate.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,1,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={staple}
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
                  <Figure editId="photo.hafen-sechs-tile-clipboard-cutout" slug="hafen-sechs-tile-clipboard-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Documentation</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>More calls are delayed by a customs hold than by weather. The paperwork is a berth-critical system and we staff it like one.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Equipment on the terminal</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Owned, maintained in the workshop at the rail head, and listed here because operators ask.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Equipment</span>
                <span data-edit="index.text2" data-edit-max="60">Count</span>
                <span data-edit="index.text3" data-edit-max="60">Capacity</span>
                <span data-edit="index.text4" data-edit-max="60">Reach</span>
            </li>
              <li key="Ship-to-shore gantry">
                <span data-edit="index.text5" data-edit-max="60">Ship-to-shore gantry</span>
                <span data-edit="index.text6" data-edit-max="60">14</span>
                <span data-edit="index.text7" data-edit-max="60">65 t under spreader</span>
                <span data-edit="index.text8" data-edit-max="60">24 rows</span>
              </li>
              <li key="Rail-mounted gantry">
                <span data-edit="index.text9" data-edit-max="60">Rail-mounted gantry</span>
                <span data-edit="index.text10" data-edit-max="60">36</span>
                <span data-edit="index.text11" data-edit-max="60">40 t</span>
                <span data-edit="index.text12" data-edit-max="60">9 wide, 1 over 5</span>
              </li>
              <li key="Mobile harbour crane">
                <span data-edit="index.text13" data-edit-max="60">Mobile harbour crane</span>
                <span data-edit="index.text14" data-edit-max="60">4</span>
                <span data-edit="index.text15" data-edit-max="60">124 t</span>
                <span data-edit="index.text16" data-edit-max="60">51 m</span>
              </li>
              <li key="Terminal tractor">
                <span data-edit="index.text17" data-edit-max="60">Terminal tractor</span>
                <span data-edit="index.text18" data-edit-max="60">92</span>
                <span data-edit="index.text19" data-edit-max="60">60 t drawbar</span>
                <span data-edit="index.text20" data-edit-max="60">n/a</span>
              </li>
              <li key="Reach stacker">
                <span data-edit="index.text21" data-edit-max="60">Reach stacker</span>
                <span data-edit="index.text22" data-edit-max="60">11</span>
                <span data-edit="index.text23" data-edit-max="60">45 t</span>
                <span data-edit="index.text24" data-edit-max="60">4 high</span>
              </li>
              <li key="Empty handler">
                <span data-edit="index.text25" data-edit-max="60">Empty handler</span>
                <span data-edit="index.text26" data-edit-max="60">6</span>
                <span data-edit="index.text27" data-edit-max="60">9 t</span>
                <span data-edit="index.text28" data-edit-max="60">8 high</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Operator questions</h2>
          <dl className={s.faqList}>
              <div key="How is berthing priority">
                <dt data-edit="faq.term" data-edit-max="28">How is berthing priority decided?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>A vessel inside its window keeps its berth. A vessel outside it takes the next free one, regardless of line, size or how long it has been waiting.</dd>
              </div>
              <div key="Do you handle reefers?">
                <dt data-edit="faq.term2" data-edit-max="28">Do you handle reefers?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Yes, 1,840 plugs, monitored at fifteen-minute intervals with an alarm to the tower. Set-point deviations are logged and sent with the discharge report.</dd>
              </div>
              <div key="What about dangerous goo">
                <dt data-edit="faq.term3" data-edit-max="28">What about dangerous goods?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>IMDG classes 2 to 9 except class 1 and class 7. Segregation is planned before arrival and we will decline a stow we cannot segregate.</dd>
              </div>
              <div key="Can we run a barge inste">
                <dt data-edit="faq.term4" data-edit-max="28">Can we run a barge instead of rail?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Two positions, 110 m each, 06.00 to 22.00. Slower and cheaper, and in a rail strike it is the only thing that moves.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,1,3" className={s.codaField}>
            <TabbiedPattern
              pattern={isocube}
              palette={['transparent', BONE, STEEL]}
              fit="grid"
              cellSize={108}
              redrawInterval={4956}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Hafen Sechs</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Container Terminal 6, Bremerhaven. Six berths, 1,980 m of quay.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Operations</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.berths" data-edit-max="28" href="#berths">Berth register</a>
              </li>
              <li>
                <a data-edit="footer.schedule" data-edit-max="28" href="#schedule">Expected this week</a>
              </li>
              <li>
                <a data-edit="footer.gate" data-edit-max="28" href="#gate">Gate and hinterland</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Shipping</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.contact" data-edit-max="28" href="#contact">Berth booking</a>
              </li>
              <li>
                <a data-edit="footer.gate2" data-edit-max="28" href="#gate">Rail and barge</a>
              </li>
              <li>
                <a data-edit="footer.gate3" data-edit-max="28" href="#gate">Reefer plugs</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Senator-Borttscheller-Str. 6
              <br />
              27568 Bremerhaven
              <br />
              berth@hafen-sechs.example
              <br />
              +49 471 000 000, 24 h
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional container terminal. Prices and times are invented.</p>
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
