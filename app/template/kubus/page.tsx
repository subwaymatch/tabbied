import { TabbiedPattern } from 'tabbied/react';
import {
  cove, fenestrate, housing, lintel, loophole, mullion, notchblock, twohalf,
} from 'tabbied/patterns';
import s from './kubus.module.css';

export const metadata = {
  title: 'Kubus: Kunsthalle',
  description:
    'A kunsthalle with no collection: four exhibitions a year in one twelve-metre room, black and white throughout, admission free on Thursdays.',
};

/* No accent colour anywhere on this page. A kunsthalle that shows other
   people's work has no business having a house colour, so the contrast is
   the design: paper, ink, and one grey between them. */
const WHITE = '#fafaf8';
const GREY = '#8a8a86';
const MID = '#1c1c1c';

const SHOWS = [
  {
    n: '01',
    title: 'Nothing to Scale',
    who: 'Marta Reinholdt',
    when: '12 Sep - 22 Nov 2026',
    what: 'Nine plaster volumes, none of them the size the drawings say',
    room: 'Halle',
  },
  {
    n: '02',
    title: 'A Room Lit From Below',
    who: 'Osei Ampofo',
    when: '05 Dec 2026 - 14 Feb 2027',
    what: 'One light source, moved twice a day by a gallery attendant',
    room: 'Halle',
  },
  {
    n: '03',
    title: 'Two Hundred Grey',
    who: 'Group show, eleven artists',
    when: '27 Feb - 09 May 2027',
    what: 'Everything in the show is the same value and nothing is the same colour',
    room: 'Halle + Kabinett',
  },
  {
    n: '04',
    title: 'The Building',
    who: 'Kubus',
    when: '22 May - 29 Aug 2027',
    what: 'The kunsthalle exhibits itself: plans, arguments, and the wall we removed',
    room: 'Halle',
  },
];

const ROOMS = [
  ['Halle', '12.4 × 22.0 m', '7.8 m high', '620 lx max', 'Daylit, north'],
  ['Kabinett', '6.2 × 8.1 m', '3.4 m high', '180 lx max', 'No daylight'],
  ['Treppe', '4.0 × 4.0 m', '11.2 m high', 'Daylight only', 'Stairwell, hangable'],
  ['Keller', '9.0 × 14.5 m', '2.6 m high', '90 lx max', 'Damp, monitored'],
  ['Hof', '18 × 24 m', 'Open to the sky', ' - ', 'Outdoor, summer only'],
];

const PRINCIPLES = [
  {
    art: twohalf,
    n: 'I',
    t: 'No collection',
    d: 'Kubus owns no art and never will. A collection turns a kunsthalle into a museum, and a museum has to keep saying yes to what it already said yes to.',
  },
  {
    art: housing,
    n: 'II',
    t: 'One room at a time',
    d: 'Four exhibitions a year in one twelve-metre room. An artist gets the whole building or none of it, and the answer arrives within six weeks.',
  },
  {
    art: fenestrate,
    n: 'III',
    t: 'Nothing on the wall labels',
    d: 'Title, artist, year, materials. No interpretation on the wall. The interpretation is a free sheet at the door, written by somebody who signs it.',
  },
];

const PROGRAMME = [
  ['Th 17.09', 'Opening talk', 'Marta Reinholdt with the curator', '19:00', 'Free'],
  ['Sa 26.09', 'Guided tour', 'In German', '15:00', 'Free'],
  ['Th 01.10', 'Late opening', 'Until 22:00, bar in the Hof', '18:00', 'Free'],
  ['Sa 10.10', 'Guided tour', 'In English', '15:00', 'Free'],
  ['We 21.10', 'Reading', 'Three writers on scale', '19:30', '€ 6'],
  ['Th 05.11', 'Late opening', 'Until 22:00', '18:00', 'Free'],
  ['Sa 14.11', 'Workshop', 'Plaster, for anybody over 12', '11:00', '€ 12'],
  ['Su 22.11', 'Finissage', 'The artist takes questions for an hour', '16:00', 'Free'],
  ['Th 10.12', 'Opening talk', 'Osei Ampofo in conversation', '19:00', 'Free'],
  ['Sa 19.12', 'Guided tour', 'In German', '15:00', 'Free'],
];

const NUMBERS = [
  ['4', 'Exhibitions a year'],
  ['1', 'Rooms in the main hall'],
  ['0', 'Works in a collection'],
  ['272', 'Square metres, the Halle'],
];

const VISIT = [
  ['Open', 'Wednesday to Sunday, 11:00 - 18:00. Thursday until 22:00.'],
  ['Admission', '€ 9, concessions € 5, free on Thursdays and free under 18 always.'],
  ['Access', 'Step-free throughout except the Treppe, which is the stairwell.'],
  ['Photography', 'Yes, unless a wall label says otherwise, which is rare.'],
  ['Cloakroom', 'Free and unattended. Nobody has lost anything since 2019.'],
  ['Getting here', 'Trams 3 and 11 to Kunsthalle. There is no car park and there will not be.'],
];

const SUPPORT = [
  ['Funding', 'Two thirds from the city, one third from a foundation and the door.'],
  ['Fees', 'Every exhibiting artist is paid a fee. It is published in the annual report.'],
  ['Board', 'Nine people, five of them artists, terms of four years and no renewals.'],
  ['Report', 'Published every March, with the budget, in full, as one PDF.'],
];

/* Day, hours, and whether the desk is shut - the third slot is
   omitted on the days it is open. */
const HOURS: [string, string, boolean?][] = [
  ['Monday', 'Shut', true],
  ['Tuesday', '11 - 18'],
  ['Wednesday', '11 - 18'],
  ['Thursday', '11 - 21'],
  ['Friday', '11 - 18'],
  ['Saturday', '10 - 18'],
  ['Sunday', '10 - 18'],
];

export default function KubusPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--black': '#080808',
        '--white': '#fafaf8',
        '--grey': '#8a8a86',
        '--mid': '#1c1c1c',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="black,white,grey,mid"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Kubus</a>
        <nav aria-label="Sections">
          <a data-edit="bar.shows" data-edit-max="28" href="#shows">Exhibitions</a>
          <a data-edit="bar.rooms" data-edit-max="28" href="#rooms">Rooms</a>
          <a data-edit="bar.programme" data-edit-max="28" href="#programme">Programme</a>
          <a data-edit="bar.visit" data-edit-max="28" href="#visit">Visit</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Kunsthalle</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            One word, one room, no colour. The pattern is the architecture:
            lintel draws an opening in every cell. */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={lintel}
              palette={['transparent', MID, GREY]}
              fit="grid"
              cellSize={166}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Kunsthalle / no collection / since 1978</p>
          <h1 data-edit="hero.heroType" data-edit-max="70" className={s.heroType}>Kubus</h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              One room, twelve metres by twenty-two, four times a year. We own
              nothing and we show everything in it.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#shows">
              What is on
            </a>
          </div>
        </section>

        {/* ----------------------------------------------------------- SHOWS
            Four rows, each one the full width of the page and as tall as the
            title needs. The whole year, in the order it happens. */}
        <section id="shows" className={s.shows} aria-labelledby="shows-h">
          <div className={s.secHead}>
            <h2 data-edit="shows.title" data-edit-max="60" id="shows-h">Four this year</h2>
            <p data-edit="shows.body" data-edit-max="240" data-edit-multiline>Each one has the whole building. The fourth is the building itself.</p>
          </div>
          <ol className={s.showList}>
            {SHOWS.map((x, i) => (
              <li key={x.n}>
                <span data-edit={`shows.sN.${i}`} data-edit-max="60" className={s.sN}>{x.n}</span>
                <h3 data-edit={`shows.sTitle.${i}`} data-edit-max="40" className={s.sTitle}>{x.title}</h3>
                <span data-edit={`shows.sWho.${i}`} data-edit-max="60" className={s.sWho}>{x.who}</span>
                <span data-edit={`shows.sWhat.${i}`} data-edit-max="60" className={s.sWhat}>{x.what}</span>
                <span data-edit={`shows.sWhen.${i}`} data-edit-max="60" className={s.sWhen}>{x.when}</span>
                <span data-edit={`shows.sRoom.${i}`} data-edit-max="60" className={s.sRoom}>{x.room}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            A kunsthalle with a collection eventually programmes its store room.
            We have no store room. Every wall in this building is empty four
            times a year and it is the most expensive decision we make.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Kubus opened in 1978 in a former tram depot. The hall is the depot
              floor, the roof lights are the original ones, and the wall between
              the hall and the yard was removed in 2011 and never replaced.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              Eleven people work here. Every exhibiting artist is paid a fee,
              which is set once a year by the board and printed in the annual
              report next to everybody's salary band.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------- NUMBERS */}
        <section className={s.numbers} aria-label="The kunsthalle in numbers">
          <div data-edit-pattern="numbers.field" data-edit-roles="transparent,2,3" className={s.numbersField} aria-hidden="true">
            <TabbiedPattern
              pattern={housing}
              palette={['transparent', GREY, MID]}
              fit="grid"
              cellSize={94}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <p data-edit={`numbers.nVal.${i}`} data-edit-max="240" data-edit-multiline className={s.nVal}>{v}</p>
              <p data-edit={`numbers.nKey.${i}`} data-edit-max="240" data-edit-multiline className={s.nKey}>{k}</p>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------------ PRINCIPLES */}
        <section className={s.principles} aria-labelledby="pr-h">
          <div className={s.secHead}>
            <h2 data-edit="pr.title" data-edit-max="60" id="pr-h">Three refusals</h2>
            <p data-edit="pr.body" data-edit-max="240" data-edit-multiline>Written into the constitution in 1978 and never amended.</p>
          </div>
          <div className={s.pGrid}>
            {PRINCIPLES.map((p, i) => (
              <article key={p.n}>
                <div data-edit-pattern={`pr.field.${i}`} data-edit-roles="transparent,2,1" className={s.pPlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={p.art}
                    palette={['transparent', GREY, WHITE]}
                    fit="grid"
                    cellSize={64}
                    redrawInterval={5400}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p data-edit={`pr.pN.${i}`} data-edit-max="240" data-edit-multiline className={s.pN}>{p.n}</p>
                <h3 data-edit={`pr.title2.${i}`} data-edit-max="40">{p.t}</h3>
                <p data-edit={`pr.pBody.${i}`} data-edit-max="240" data-edit-multiline className={s.pBody}>{p.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,1,2" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={mullion}
            palette={['transparent', WHITE, GREY]}
            fit="grid"
            cellSize={122}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ----------------------------------------------------------- ROOMS */}
        <section id="rooms" className={s.listing} aria-labelledby="rooms-h">
          <div className={s.secHead}>
            <h2 data-edit="rooms.title" data-edit-max="60" id="rooms-h">Five rooms</h2>
            <p data-edit="rooms.body" data-edit-max="240" data-edit-multiline>Published so an artist can plan a show before visiting. Lux figures are measured at the wall.</p>
          </div>
          <ol className={s.table}>
            {ROOMS.map((r, i) => (
              <li key={r[0]}>
                <span data-edit={`rooms.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[0]}</span>
                <span data-edit={`rooms.tDim.${i}`} data-edit-max="60" className={s.tDim}>{r[1]}</span>
                <span data-edit={`rooms.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`rooms.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`rooms.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,3,2" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={loophole}
              palette={['transparent', MID, GREY]}
              fit="grid"
              cellSize={118}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>An empty room is not a problem to be solved. It is the offer.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Hanne Ravn, director</cite>
          </blockquote>
        </section>

        {/* ------------------------------------------------------- PROGRAMME */}
        <section id="programme" className={s.listing} aria-labelledby="prog-h">
          <div className={s.secHead}>
            <h2 data-edit="programme.title" data-edit-max="60" id="prog-h">Autumn programme</h2>
            <p data-edit="programme.body" data-edit-max="240" data-edit-multiline>Talks, tours and two late openings. Everything free unless it says otherwise.</p>
          </div>
          <ol className={s.table}>
            {PROGRAMME.map((r, i) => (
              <li key={i}>
                <span data-edit={`programme.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`programme.tDim.${i}`} data-edit-max="60" className={s.tDim}>{r[0]}</span>
                <span data-edit={`programme.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`programme.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`programme.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------------- SUPPORT */}
        <section id="support" className={s.support} aria-labelledby="support-h">
          <div data-edit-pattern="support.field" data-edit-roles="transparent,2,3" className={s.supportField} aria-hidden="true">
            <TabbiedPattern
              pattern={notchblock}
              palette={['transparent', GREY, MID]}
              fit="grid"
              cellSize={104}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.supportInner}>
            <h2 data-edit="support.title" data-edit-max="60" id="support-h">How it is paid for</h2>
            <dl className={s.supportList}>
              {SUPPORT.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`support.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`support.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ----------------------------------------------------------- VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">Coming in</h2>
          <dl className={s.visitList}>
            {VISIT.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`visit.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`visit.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div>
            <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>The desk, and when it is there</p>
            <a data-edit="contact.deskTel" data-edit-max="28" id="contact-h" className={s.deskTel} href="tel:+41610000400">
              +41&nbsp;61&nbsp;000&nbsp;04&nbsp;00
            </a>
            <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
              Depotstrasse 4. Proposals are read twice a year, in March and in
              September, and answered inside six weeks either way - the desk
              cannot tell you anything the letter will not.
            </p>
          </div>
          <div>
            <dl className={s.hours}>
              {HOURS.map(([d, h, shut], i) => (
                <div key={d} className={shut ? s.hoursShut : undefined}>
                  <dt data-edit={`contact.term.${i}`} data-edit-max="28">{d}</dt>
                  <dd data-edit={`contact.body.${i}`} data-edit-max="200" data-edit-multiline>{h}</dd>
                </div>
              ))}
            </dl>
            <p data-edit="contact.hoursNote" data-edit-max="240" data-edit-multiline className={s.hoursNote}>
              Thursday evenings are free after 18, and the building is emptier
              at 20 than at any other hour of the week.
            </p>
          </div>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,3,2" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={cove}
          palette={['transparent', MID, GREY]}
          fit="grid"
          cellSize={112}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <nav className={s.footIndex} aria-label="Sections">
          <a data-edit="footer.shows" data-edit-max="28" href="#shows">Exhibitions</a>
          <a data-edit="footer.rooms" data-edit-max="28" href="#rooms">The rooms</a>
          <a data-edit="footer.support" data-edit-max="28" href="#support">Funding</a>
          <a data-edit="footer.visit" data-edit-max="28" href="#visit">Hours</a>
        </nav>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">The building</h2>
            <p>
              A goods depot of 1908, four rooms, no wall moved
              <br />
              Nine metres to the trusses in the long room
              <br />
              Daylight only, north-facing, no blinds
            </p>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Kunsthalle</h2>
            <ul>
              <li><a data-edit="footer.support2" data-edit-max="28" href="#support">Funding</a></li>
              <li><a data-edit="footer.visit2" data-edit-max="28" href="#visit">Opening hours</a></li>
              <li><a data-edit="footer.visit3" data-edit-max="28" href="#visit">Access</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Depotstrasse 4
              <br />
              Wednesday to Sunday
              <br />
              halle@kubus.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional kunsthalle. Artists, exhibitions and dimensions are invented.</p>
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
