import { TabbiedPattern } from 'tabbied/react';
import { bauhaus, mixtape, tetro } from 'tabbied/patterns';
import s from './werkstatt-neun.module.css';

export const metadata = {
  title: 'Werkstatt Neun: Design school summer workshop, Dessau',
  description:
    'Werkstatt Neun is a four-week summer school in a 1929 hall in Dessau. Typography, weaving, metal and colour theory, twenty-four places each, taught by people who make things for a living.',
};

/* The three primaries and the ink. Every field takes `transparent` in the
   background slot so the forms sit in the paper, the way a print does. */
const INK = '#141414';
const RED = '#D7263D';
const BLUE = '#1F5FBF';
const YELLOW = '#F2C230';
/* Tiles pin their doodle to a whole multiple of the cell (9 x 72px) and let
   the plate clip it, so every grid track is a whole pixel. */
const TILE_BOX = 648;

const NAV = [
  ['1', 'Workshops', '#workshops'],
  ['2', 'Week', '#timetable'],
  ['3', 'Tutors', '#tutors'],
  ['4', 'Apply', '#apply'],
  ['5', 'Hall', '#building'],
  ['6', 'Stay', '#stay'],
];

type Workshop = {
  no: string;
  title: string;
  block: string;
  dates: string;
  tutor: string;
  fee: string;
  places: string;
  body: string;
};

const WORKSHOPS: Workshop[] = [
  {
    no: '01',
    title: 'Typography',
    block: 'Block A',
    dates: '5 to 17 July 2027',
    tutor: 'Hanne Vieth',
    fee: '780 EUR',
    places: '24',
    body: 'Two weeks of letterpress and a week of it on screen. You set a poster in wood type on day one and print it badly, then spend the fortnight finding out why.',
  },
  {
    no: '02',
    title: 'Weaving',
    block: 'Block B',
    dates: '19 to 31 July 2027',
    tutor: 'Ruth Amsel',
    fee: '780 EUR',
    places: '24',
    body: 'Twelve floor looms, warped before you arrive. Plain weave, twill, a double cloth by the end, and one wall hanging that goes in the closing show.',
  },
  {
    no: '03',
    title: 'Metal',
    block: 'Block A',
    dates: '5 to 17 July 2027',
    tutor: 'Jakob Steinhauer',
    fee: '840 EUR',
    places: '24',
    body: 'Sheet, tube and rod, with the hall lathe and two spinning chucks. Everyone leaves with a lamp that works and a teapot that mostly does.',
  },
  {
    no: '04',
    title: 'Colour theory',
    block: 'Block B',
    dates: '19 to 31 July 2027',
    tutor: 'Ilka Brandt',
    fee: '720 EUR',
    places: '24',
    body: 'Gouache, cut paper and a great deal of looking. Contrast of hue, of light and dark, of warm and cold, of quantity, one a day, and then all of them at once.',
  },
];

const SLOTS = [
  { time: '08.00', label: 'Breakfast', cells: ['Hall', 'Hall', 'Hall', 'Hall', 'Hall', 'Hall'] },
  { time: '09.00', label: 'Workshop', cells: ['Studio', 'Studio', 'Studio', 'Studio', 'Studio', 'Studio'] },
  { time: '12.00', label: 'Lunch', cells: ['Canteen', 'Canteen', 'Canteen', 'Canteen', 'Canteen', 'Free'] },
  { time: '13.30', label: 'Workshop', cells: ['Studio', 'Studio', 'Studio', 'Studio', 'Studio', 'Free'] },
  { time: '17.00', label: 'Vorkurs', cells: ['Form', 'Material', 'Form', 'Material', 'Crit', 'Free'] },
  { time: '19.30', label: 'Evening', cells: ['Lecture', 'Open studio', 'Film', 'Crit', 'Excursion', 'Free'] },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Tutor = {
  no: string;
  name: string;
  role: string;
  bio: string;
};

const TUTORS: Tutor[] = [
  { no: '1', name: 'Hanne Vieth', role: 'Typography', bio: 'Ran the composing room of a Leipzig type foundry for nine years and still sets her own letterhead.' },
  { no: '2', name: 'Ruth Amsel', role: 'Weaving', bio: 'Textile designer in Halle; weaves upholstery cloth for two furniture makers and nothing else.' },
  { no: '3', name: 'Jakob Steinhauer', role: 'Metal', bio: 'Trained as a silversmith, makes lamps in an old dairy outside Wittenberg, repairs the hall lathe himself.' },
  { no: '4', name: 'Ilka Brandt', role: 'Colour theory', bio: 'Painter. Taught colour at a school in Halle for eleven years and has never used a projector.' },
  { no: '5', name: 'Moritz Kahn', role: 'Director, Vorkurs', bio: 'Furniture designer; runs the daily hour of basic form and the closing show, and answers the post.' },
  { no: '6', name: 'Petra Lange', role: 'Workshop master', bio: 'Keeps twelve looms, a lathe, two presses and forty people from harming each other. Ask her first.' },
];

type ApplyStep = {
  no: string;
  date: string;
  title: string;
  body: string;
};

const APPLY: ApplyStep[] = [
  { no: '1', date: '1 Dec 2026', title: 'Applications open', body: 'One workshop per person. A ten-page PDF of your own work, any medium, and three hundred words on why this one.' },
  { no: '2', date: '28 Feb 2027', title: 'Applications close', body: 'Midnight, Dessau time. Nothing is read before this date, so there is no advantage in being early and none in being late.' },
  { no: '3', date: '31 Mar 2027', title: 'Answers', body: 'Every applicant hears by post. Twenty-four places per workshop, four held for people under twenty-one.' },
  { no: '4', date: '15 Apr 2027', title: 'Deposit', body: 'Two hundred euros holds the place. The balance is due 1 June, and a place given up before then is refunded in full.' },
];

const BUILDING = [
  ['Built', '1929, as the testing hall of a lamp works'],
  ['Structure', 'Concrete frame, sawtooth roof, glass wall to the north'],
  ['Floor', '1 400 square metres on one level, no steps'],
  ['Restored', '2019, with the original window frames kept'],
  ['Studios', 'Four, one per workshop, each 22 by 12 metres'],
  ['Named', 'Halle Neun, after the number over the door'],
];

const STAY = [
  ['Single room', '32 EUR a night, breakfast in the hall'],
  ['Shared room, two', '19 EUR a night each'],
  ['Where', 'Am Wasserturm 3, eight minutes on foot'],
  ['Rooms', 'Forty, held for participants until 1 June'],
  ['Bicycles', 'Free, first come, from the hall yard'],
  ['Kitchen', 'One per floor; the canteen does lunch only'],
];

export default function WerkstattNeunPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f2efe6',
        '--ink': '#141414',
        '--red': '#d7263d',
        '--blue': '#1f5fbf',
        '--yellow': '#f2c230',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,red,blue,yellow"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Jost:wght@300..700&display=swap"
      />

      <header className={s.bar}>
        <div className={s.brand}>
          <span className={s.markSquare} aria-hidden="true" />
          <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Werkstatt Neun</a>
        </div>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([no, label, href], i) => (
            <a key={href} href={href}>
              <span data-edit={`bar.text.${i}`} data-edit-max="60">{no}</span>
              {label}
            </a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Dessau, Halle Neun</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            Type in one column, forms in the other. The field runs behind
            the right half only, so the headline stands on flat paper. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,3,4,1" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={bauhaus}
              palette={['transparent', RED, BLUE, YELLOW, INK]}
              fit="grid"
              cellSize={144}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <div className={s.heroText}>
              <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Summer school, 5 to 31 July 2027</p>
              <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle} id="hero-h">
                Four weeks.
                <br />
                Four workshops.
                <br />
                <em>One hall.</em>
              </h1>
              <div className={s.heroBars} aria-hidden="true">
                <span className={s.barRed} />
                <span className={s.barBlue} />
                <span className={s.barYellow} />
              </div>
              <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
                Typography, weaving, metal and colour theory, taught by people
                who make things for a living, in a hall built in 1929 for
                testing lamps. Twenty-four places each. No lectures before
                seven in the evening.
              </p>
              <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#apply">Apply from 1 December</a>
            </div>
            <div className={s.heroShapes} aria-hidden="true">
              <span className={s.shapeCircle} />
              <span className={s.shapeSquare} />
              <span className={s.shapeTriangle} />
              <span className={s.shapeHalf} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- WORKSHOPS */}
        <section id="workshops" className={s.workshops} aria-labelledby="workshops-h">
          <div className={s.secHead}>
            <span data-edit="workshops.secNo" data-edit-max="60" className={s.secNo}>1</span>
            <h2 data-edit="workshops.title" data-edit-max="60" id="workshops-h">The four workshops</h2>
            <p data-edit="workshops.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Two run in each fortnight. Choose one; the Vorkurs hour at five
              is where the four groups meet.
            </p>
          </div>
          <div className={s.wsGrid}>
            {WORKSHOPS.map((w, i) => (
              <article key={w.no} className={s.ws}>
                <div data-edit-pattern={`ws.field.${i}`} data-edit-roles="transparent,2,3,4" className={s.tile} aria-hidden="true">
                  <TabbiedPattern
                    pattern={mixtape}
                    palette={['transparent', RED, BLUE, YELLOW]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5400 + i * 300}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <span data-edit={`ws.wsNo.${i}`} data-edit-max="60" className={s.wsNo}>{w.no}</span>
                <h3 data-edit={`ws.title.${i}`} data-edit-max="40">{w.title}</h3>
                <dl className={s.wsFacts}>
                  <div>
                    <dt data-edit={`ws.term.${i}`} data-edit-max="28">Dates</dt>
                    <dd data-edit={`ws.body.${i}`} data-edit-max="200" data-edit-multiline>{w.dates}</dd>
                  </div>
                  <div>
                    <dt data-edit={`ws.term2.${i}`} data-edit-max="28">Block</dt>
                    <dd data-edit={`ws.body2.${i}`} data-edit-max="200" data-edit-multiline>{w.block}</dd>
                  </div>
                  <div>
                    <dt data-edit={`ws.term3.${i}`} data-edit-max="28">Tutor</dt>
                    <dd data-edit={`ws.body3.${i}`} data-edit-max="200" data-edit-multiline>{w.tutor}</dd>
                  </div>
                  <div>
                    <dt data-edit={`ws.term4.${i}`} data-edit-max="28">Fee</dt>
                    <dd data-edit={`ws.body4.${i}`} data-edit-max="200" data-edit-multiline>{w.fee}</dd>
                  </div>
                  <div>
                    <dt data-edit={`ws.term5.${i}`} data-edit-max="28">Places</dt>
                    <dd data-edit={`ws.body5.${i}`} data-edit-max="200" data-edit-multiline>{w.places}</dd>
                  </div>
                </dl>
                <p data-edit={`ws.wsBody.${i}`} data-edit-max="240" data-edit-multiline className={s.wsBody}>{w.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div className={s.band} aria-hidden="true">
          <div data-edit-pattern="top.field" data-edit-roles="transparent,3,2,4,1" className={s.bandField}>
            <TabbiedPattern
              pattern={tetro}
              palette={['transparent', BLUE, RED, YELLOW, INK]}
              fit="grid"
              cellSize={120}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </div>

        {/* ------------------------------------------------------- TIMETABLE */}
        <section id="timetable" className={s.timetable} aria-labelledby="timetable-h">
          <div className={s.secHead}>
            <span data-edit="timetable.secNo" data-edit-max="60" className={s.secNo}>2</span>
            <h2 data-edit="timetable.title" data-edit-max="60" id="timetable-h">A week in the hall</h2>
            <p data-edit="timetable.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              The same six days, four times. Sunday is yours, and the hall is
              locked so that it stays yours.
            </p>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th data-edit="timetable.heading" scope="col">Time</th>
                  <th data-edit="timetable.heading2" scope="col">Slot</th>
                  {DAYS.map((d, i) => (
                    <th data-edit={`timetable.heading3.${i}`} key={d} scope="col">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map((row, i) => (
                  <tr key={row.time}>
                    <th data-edit={`timetable.heading4.${i}`} scope="row">{row.time}</th>
                    <td data-edit={`timetable.slotLabel.${i}`} className={s.slotLabel}>{row.label}</td>
                    {row.cells.map((cell, j) => (
                      <td data-edit={`timetable.free.${i}.${j}`} key={`${row.time}-${j}`} className={cell === 'Free' ? s.free : undefined}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p data-edit="timetable.tableNote" data-edit-max="240" data-edit-multiline className={s.tableNote}>
            Vorkurs is one hour of basic form and material for everyone,
            every day, in the middle of the hall. The evening lecture is by
            whoever is visiting that week.
          </p>
        </section>

        {/* ---------------------------------------------------------- TUTORS */}
        <section id="tutors" className={s.tutors} aria-labelledby="tutors-h">
          <div className={s.secHead}>
            <span data-edit="tutors.secNo" data-edit-max="60" className={s.secNo}>3</span>
            <h2 data-edit="tutors.title" data-edit-max="60" id="tutors-h">Six people</h2>
            <p data-edit="tutors.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Four tutors, one director and the person who actually runs the
              building. All of them are in the hall all day.
            </p>
          </div>
          <ol className={s.tutorList}>
            {TUTORS.map((t, i) => (
              <li key={t.no}>
                <span data-edit={`tutors.tutorNo.${i}`} data-edit-max="60" className={s.tutorNo}>{t.no}</span>
                <h3 data-edit={`tutors.title2.${i}`} data-edit-max="40">{t.name}</h3>
                <span data-edit={`tutors.tutorRole.${i}`} data-edit-max="60" className={s.tutorRole}>{t.role}</span>
                <p data-edit={`tutors.body.${i}`} data-edit-max="240" data-edit-multiline>{t.bio}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- APPLY */}
        <section id="apply" className={s.apply} aria-labelledby="apply-h">
          <div className={s.secHead}>
            <span data-edit="apply.secNo" data-edit-max="60" className={s.secNo}>4</span>
            <h2 data-edit="apply.title" data-edit-max="60" id="apply-h">How to apply</h2>
            <p data-edit="apply.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Four dates. There is no interview, no fee to apply, and no
              requirement to have studied anything before.
            </p>
          </div>
          <ol className={s.applySteps}>
            {APPLY.map((a, i) => (
              <li key={a.no}>
                <span data-edit={`apply.applyNo.${i}`} data-edit-max="60" className={s.applyNo}>{a.no}</span>
                <time data-edit={`apply.applyDate.${i}`} className={s.applyDate}>{a.date}</time>
                <h3 data-edit={`apply.title2.${i}`} data-edit-max="40">{a.title}</h3>
                <p data-edit={`apply.body.${i}`} data-edit-max="240" data-edit-multiline>{a.body}</p>
              </li>
            ))}
          </ol>
          <p data-edit="apply.applyFoot" data-edit-max="240" data-edit-multiline className={s.applyFoot}>
            Send everything to the address at the foot of the page, as one
            PDF, with your name in the file name. We read on paper, so keep
            the pages A4.
          </p>
        </section>

        {/* -------------------------------------------------------- BUILDING */}
        <section id="building" className={s.building} aria-labelledby="building-h">
          <div className={s.buildingInner}>
            <div>
              <div className={s.secHead}>
                <span data-edit="building.secNo" data-edit-max="60" className={s.secNo}>5</span>
                <h2 data-edit="building.title" data-edit-max="60" id="building-h">Halle Neun, 1929</h2>
              </div>
              <p data-edit="building.buildingLead" data-edit-max="240" data-edit-multiline className={s.buildingLead}>
                A concrete frame with a sawtooth roof and a glass wall
                twenty-two metres long facing north, built to test lamps and
                never used for anything louder than a lathe since. The light
                is even from eight in the morning to eight at night, which is
                why the timetable is the shape it is.
              </p>
              <dl className={s.buildingFacts}>
                {BUILDING.map(([k, v], i) => (
                  <div key={k}>
                    <dt data-edit={`building.term.${i}`} data-edit-max="28">{k}</dt>
                    <dd data-edit={`building.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={s.buildingShapes} aria-hidden="true">
              <span className={s.bsQuarter} />
              <span className={s.bsBar} />
              <span className={s.bsDisc} />
              <span className={s.bsBlock} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ STAY */}
        <section id="stay" className={s.stay} aria-labelledby="stay-h">
          <div className={s.secHead}>
            <span data-edit="stay.secNo" data-edit-max="60" className={s.secNo}>6</span>
            <h2 data-edit="stay.title" data-edit-max="60" id="stay-h">Where to sleep</h2>
            <p data-edit="stay.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              A hostel of our own, eight minutes from the hall. Not
              compulsory, but nearly everyone does, and the breakfast is in
              the hall either way.
            </p>
          </div>
          <dl className={s.stayList}>
            {STAY.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`stay.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`stay.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div className={s.contactInner}>
            <div className={s.secHead}>
              <span data-edit="contact.secNo" data-edit-max="60" className={s.secNo}>7</span>
              <h2 data-edit="contact.title" data-edit-max="60" id="contact-h">Write to the hall</h2>
            </div>
            <dl className={s.contactList}>
              <div>
                <dt data-edit="contact.term" data-edit-max="28">Post</dt>
                <dd data-edit="contact.body3" data-edit-max="200" data-edit-multiline>
                  Werkstatt Neun e.V.
                  <br />
                  Ziegeleiweg 9
                  <br />
                  06846 Dessau-Rosslau
                </dd>
              </div>
              <div>
                <dt data-edit="contact.term2" data-edit-max="28">Mail</dt>
                <dd>
                  <a data-edit="contact.link" data-edit-max="28" href="mailto:post@werkstattneun.example">post@werkstattneun.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="contact.term3" data-edit-max="28">Telephone</dt>
                <dd data-edit="contact.body" data-edit-max="200" data-edit-multiline>+49 340 000 000, Tuesday to Thursday, 10 to 16</dd>
              </div>
              <div>
                <dt data-edit="contact.term4" data-edit-max="28">Visits</dt>
                <dd data-edit="contact.body2" data-edit-max="200" data-edit-multiline>The hall is open on the first Saturday of the month, 11 to 15, all year</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Werkstatt Neun</p>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Programme</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.workshops" data-edit-max="28" href="#workshops">Four workshops</a></li>
              <li><a data-edit="footer.timetable" data-edit-max="28" href="#timetable">A week in the hall</a></li>
              <li><a data-edit="footer.tutors" data-edit-max="28" href="#tutors">Six people</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Coming</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.apply" data-edit-max="28" href="#apply">How to apply</a></li>
              <li><a data-edit="footer.stay" data-edit-max="28" href="#stay">Where to sleep</a></li>
              <li><a data-edit="footer.building" data-edit-max="28" href="#building">The hall</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Address</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Ziegeleiweg 9
              <br />
              06846 Dessau-Rosslau
              <br />
              post@werkstattneun.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional summer school. Dates, fees and people are invented.</p>
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
