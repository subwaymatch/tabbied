import { TabbiedPattern } from 'tabbied/react';
import {
  bilateral, cinch, drift, foldback, hourglass, pivot, sheared, skewblock,
} from 'tabbied/patterns';
import s from './salzhaus.module.css';

export const metadata = {
  title: 'Salzhaus: Contemporary dance, Basel',
  description:
    'Salzhaus is a dance company in a former salt warehouse on the Rhine. Six productions a year, made in the room they are shown in.',
};

/* Bone, ink, one scarlet. Every field takes `transparent` in the background
   slot so the paper of the page runs straight through the pattern - the
   pattern is the ground here, not a picture pasted onto it. */
const INK = '#101014';
const RED = '#ff2d00';
const GREY = '#8b8b85';
const PALE = '#dedcd4';

const SEASON = [
  {
    n: '01',
    title: 'Halle',
    sub: 'For fourteen dancers and one floor',
    when: '11 - 27 Sep 2026',
    room: 'Salzhaus, Halle A',
    min: '75',
  },
  {
    n: '02',
    title: 'Zwischenraum',
    sub: 'A duet that never touches',
    when: '06 - 15 Nov 2026',
    room: 'Salzhaus, Studio 2',
    min: '48',
  },
  {
    n: '03',
    title: 'Salz',
    sub: 'The piece the building is named after',
    when: '15 Jan - 07 Feb 2027',
    room: 'Salzhaus, Halle A',
    min: '90',
  },
  {
    n: '04',
    title: 'Der lange Gang',
    sub: 'Walked, not danced, for fifty minutes',
    when: '05 - 14 Mar 2027',
    room: 'Kaserne Basel',
    min: '50',
  },
  {
    n: '05',
    title: 'Tafel',
    sub: 'Nine performers, one table, no chairs',
    when: '09 - 25 Apr 2027',
    room: 'Salzhaus, Halle A',
    min: '65',
  },
  {
    n: '06',
    title: 'Nichts fällt',
    sub: 'Everything is caught before it lands',
    when: '04 - 19 Jun 2027',
    room: 'Salzhaus, Dach',
    min: '80',
  },
];

const FIGURES = [
  ['14', 'Dancers under contract'],
  ['6', 'New pieces a year'],
  ['1 200', 'Square metres of floor'],
  ['0', 'Pieces made anywhere else'],
];

const ENSEMBLE = [
  'Ada Vermeulen', 'Ruben Sasse', 'Ilse Wyss', 'Noa Brenner',
  'Timo Achermann', 'Céline Roth', 'Kaya Öz', 'Ferdinand Lamm',
  'Miriam Städeli', 'Jonas Brügger', 'Alina Kunz', 'Ravi Menon',
  'Hedda Falk', 'Luca Bernasconi',
];

const CALENDAR = [
  ['Fr 11.09', 'Halle', 'Halle A', '20:00', 'Premiere'],
  ['Sa 12.09', 'Halle', 'Halle A', '20:00', ''],
  ['Su 13.09', 'Halle', 'Halle A', '17:00', 'Talk after'],
  ['We 16.09', 'Halle', 'Halle A', '20:00', ''],
  ['Fr 18.09', 'Halle', 'Halle A', '20:00', 'Sold out'],
  ['Sa 19.09', 'Halle', 'Halle A', '20:00', ''],
  ['Su 20.09', 'Open studio', 'Studio 2', '14:00', 'Free'],
  ['We 23.09', 'Halle', 'Halle A', '20:00', ''],
  ['Fr 25.09', 'Halle', 'Halle A', '20:00', ''],
  ['Sa 26.09', 'Halle', 'Halle A', '20:00', ''],
  ['Su 27.09', 'Halle', 'Halle A', '17:00', 'Last'],
  ['Fr 06.11', 'Zwischenraum', 'Studio 2', '20:30', 'Premiere'],
  ['Sa 07.11', 'Zwischenraum', 'Studio 2', '20:30', ''],
  ['Su 08.11', 'Zwischenraum', 'Studio 2', '18:00', ''],
  ['Th 12.11', 'Zwischenraum', 'Studio 2', '20:30', ''],
  ['Fr 13.11', 'Zwischenraum', 'Studio 2', '20:30', 'Talk after'],
  ['Sa 14.11', 'Zwischenraum', 'Studio 2', '20:30', ''],
  ['Su 15.11', 'Zwischenraum', 'Studio 2', '18:00', 'Last'],
];

const REPERTOIRE = [
  ['2025', 'Boden', 'Vermeulen / Sasse', '70′', '31 performances'],
  ['2025', 'Kalk', 'Wyss', '45′', '18 performances'],
  ['2024', 'Zwei Türen', 'Vermeulen', '95′', '44 performances'],
  ['2024', 'Rand', 'Öz / Brenner', '40′', '22 performances'],
  ['2023', 'Aufriss', 'Sasse', '65′', '29 performances'],
  ['2023', 'Weiss auf Weiss', 'Vermeulen', '55′', '26 performances'],
  ['2022', 'Fuge', 'Achermann', '80′', '35 performances'],
  ['2022', 'Kante', 'Wyss / Roth', '38′', '14 performances'],
  ['2021', 'Halbschatten', 'Vermeulen', '72′', '19 performances'],
  ['2021', 'Umzug', 'Ensemble', '60′', '11 performances'],
  ['2020', 'Ohne Publikum', 'Ensemble', '46′', 'Filmed only'],
  ['2019', 'Erstes Stück', 'Vermeulen', '52′', '9 performances'],
];

const PRINCIPLES = [
  {
    art: cinch,
    n: 'I',
    t: 'The room comes first',
    d: 'A piece is made in the room it will be shown in, at the hour it will be shown. Nothing is transposed later from a rehearsal studio with different light and a shorter wall.',
  },
  {
    art: foldback,
    n: 'II',
    t: 'Nothing is explained',
    d: 'There is no programme note telling you what a section is about. If the movement needs a paragraph to land, the movement is not finished and we go back into the room.',
  },
  {
    art: hourglass,
    n: 'III',
    t: 'Everyone is credited',
    d: 'Fourteen dancers, one lighting designer, two technicians and whoever built the object on stage. The poster carries all of them at the same size.',
  },
];

const VISIT = [
  ['Address', 'Salzhaus, Uferstrasse 90, 4057 Basel'],
  ['Doors', 'One hour before, and the bar stays open after'],
  ['Tickets', 'CHF 15 - 42, under 26 pays CHF 12 at any performance'],
  ['Access', 'Step-free to Halle A and Studio 2; the roof is by lift only'],
  ['Late', 'You will be seated. We would rather you came in late than not at all'],
  ['Photography', 'Yes, without flash, and not during Zwischenraum'],
];

/* Day, hours, and whether the desk is shut - the third slot is
   omitted on the days it is open. */
const HOURS: [string, string, boolean?][] = [
  ['Monday', 'Shut', true],
  ['Tuesday', '10 - 16'],
  ['Wednesday', '10 - 16'],
  ['Thursday', '10 - 16'],
  ['Friday', '10 - 16'],
  ['Performance days', 'Until curtain'],
  ['Sunday', 'Shut', true],
];

/* When, what, and where - the footer dateline. */
const NEXT_UP: [string, string, string][] = [
  ['12.04', 'Kessel - first night, with the full company', 'Grosse Halle'],
  ['26.04', 'Kessel - played to a live score', 'Grosse Halle'],
  ['17.05', 'Studio showing, no set and no lights', 'Probebühne 2'],
];

export default function SalzhausPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f3f1ec',
        '--ink': '#101014',
        '--red': '#ff2d00',
        '--grey': '#8b8b85',
        '--pale': '#dedcd4',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Salzhaus</a>
        <nav aria-label="Sections">
          <a data-edit="bar.season" data-edit-max="28" href="#season">Season</a>
          <a data-edit="bar.work" data-edit-max="28" href="#work">Work</a>
          <a data-edit="bar.ensemble" data-edit-max="28" href="#ensemble">Ensemble</a>
          <a data-edit="bar.visit" data-edit-max="28" href="#visit">Visit</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Spielzeit 26 / 27</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            One field, edge to edge, and three words at the largest size the
            viewport will carry. No box, no rule, no container. */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={pivot}
              palette={['transparent', PALE, GREY, RED]}
              fit="grid"
              cellSize={160}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Contemporary dance / Basel / since 2019</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Bodies</span>
            <span data-edit="hero.text2" data-edit-max="60">in a</span>
            <span data-edit="hero.red" data-edit-max="60" className={s.red}>room.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Fourteen dancers in a salt warehouse on the Rhine. Six pieces a
              year, each one made in the hall it is shown in.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#season">
              Season 26/27
            </a>
          </div>
        </section>

        {/* --------------------------------------------------------- MARQUEE */}
        <div className={s.marquee} aria-hidden="true">
          <div className={s.marqueeTrack}>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                Halle <i>/</i> Zwischenraum <i>/</i> Salz <i>/</i> Der lange Gang{' '}
                <i>/</i> Tafel <i>/</i> Nichts fällt <i>/</i>{' '}
              </span>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement} aria-labelledby="statement-h">
          <h2 data-edit="statement.srOnly" data-edit-max="60" className={s.srOnly} id="statement-h">
            What the company is
          </h2>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            We do not tour a repertoire. Every piece is built where you will sit
            to watch it, out of the size of that hall, the temperature of that
            month, and the fourteen people who happen to be in the company that
            year. When any of those change, the piece is over.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Salzhaus took the lease on a disused salt store in 2019 and has
              never rehearsed anywhere else. The floor is the original one,
              sanded twice, and it is the loudest surface any of us have worked
              on.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              The company is funded by the canton, by a small foundation that
              asked not to be named on the poster, and by ticket income that
              covers a third of the year.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,1,4" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={drift}
            palette={['transparent', RED, INK, PALE]}
            fit="grid"
            cellSize={104}
            redrawInterval={3600}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ---------------------------------------------------------- SEASON */}
        <section id="season" className={s.season} aria-labelledby="season-h">
          <div className={s.secHead}>
            <h2 data-edit="season.title" data-edit-max="60" id="season-h">Six pieces</h2>
            <p data-edit="season.body" data-edit-max="240" data-edit-multiline>Spielzeit 26 / 27. Every date is in this building unless it says otherwise.</p>
          </div>
          <ol className={s.rows}>
            {SEASON.map((p, i) => (
              <li key={p.n}>
                <span data-edit={`season.rowN.${i}`} data-edit-max="60" className={s.rowN}>{p.n}</span>
                <h3 data-edit={`season.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{p.title}</h3>
                <span data-edit={`season.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{p.sub}</span>
                <span data-edit={`season.rowWhen.${i}`} data-edit-max="60" className={s.rowWhen}>{p.when}</span>
                <span data-edit={`season.rowRoom.${i}`} data-edit-max="60" className={s.rowRoom}>{p.room}</span>
                <span className={s.rowMin}>{p.min}′</span>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------------- FIGURES */}
        <section className={s.figures} aria-label="The company in numbers">
          {FIGURES.map(([v, k], i) => (
            <div key={k}>
              <p data-edit={`figures.figVal.${i}`} data-edit-max="240" data-edit-multiline className={s.figVal}>{v}</p>
              <p data-edit={`figures.figKey.${i}`} data-edit-max="240" data-edit-multiline className={s.figKey}>{k}</p>
            </div>
          ))}
          <div data-edit-pattern="figures.field" data-edit-roles="transparent,3,4" className={s.figuresField} aria-hidden="true">
            <TabbiedPattern
              pattern={hourglass}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={96}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------------ WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <div data-edit-pattern="work.field" data-edit-roles="transparent,4,3" className={s.workField} aria-hidden="true">
            <TabbiedPattern
              pattern={skewblock}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={124}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <span className={s.sideLabel} aria-hidden="true">
            Wie wir arbeiten
          </span>
          <div className={s.workInner}>
            <h2 data-edit="work.title" data-edit-max="60" id="work-h">How a piece gets made</h2>
            <div className={s.workCols}>
              <p data-edit="work.lead" data-edit-max="240" data-edit-multiline className={s.lead}>
                Eleven weeks in the hall, and the first six of them have no
                audience, no title and no lights.
              </p>
              <div>
                <p data-edit="work.body" data-edit-max="240" data-edit-multiline>
                  Week one is spent walking. The company crosses the hall in
                  every direction it can be crossed, and somebody counts. It
                  sounds like a joke until the fourth day, when the room stops
                  being neutral and starts having corners that mean something.
                </p>
                <p data-edit="work.body2" data-edit-max="240" data-edit-multiline>
                  From week seven the lighting designer is in the room for every
                  minute of rehearsal, because a piece lit afterwards is a
                  different piece. From week nine we invite ten people in, on a
                  Tuesday, and watch them rather than the stage.
                </p>
                <p data-edit="work.body3" data-edit-max="240" data-edit-multiline>
                  Nothing is filmed until the last week. A camera in the room
                  turns rehearsal into documentation and the dancers start
                  performing to it within about twenty minutes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- PRINCIPLES */}
        <section className={s.principles} aria-labelledby="principles-h">
          <div className={s.secHead}>
            <h2 data-edit="principles.title" data-edit-max="60" id="principles-h">Three things we do not negotiate</h2>
            <p data-edit="principles.body" data-edit-max="240" data-edit-multiline>Written down in 2019 and unchanged since, which surprises us as much as anybody.</p>
          </div>
          <div className={s.pGrid}>
            {PRINCIPLES.map((p, i) => (
              <article key={p.n}>
                <div data-edit-pattern={`principles.field.${i}`} data-edit-roles="transparent,3,4,2" className={s.pPlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={p.art}
                    palette={['transparent', GREY, PALE, RED]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5800}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p data-edit={`principles.pN.${i}`} data-edit-max="240" data-edit-multiline className={s.pN}>{p.n}</p>
                <h3 data-edit={`principles.title2.${i}`} data-edit-max="40">{p.t}</h3>
                <p data-edit={`principles.pBody.${i}`} data-edit-max="240" data-edit-multiline className={s.pBody}>{p.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,1,2" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={bilateral}
              palette={['transparent', INK, RED]}
              fit="grid"
              cellSize={132}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>
              A hall this size gives you two honest options. Fill it, or admit
              how small a person is in it.
            </p>
            <cite data-edit="quote.attribution" data-edit-max="48">Ada Vermeulen, artistic direction</cite>
          </blockquote>
        </section>

        {/* -------------------------------------------------------- ENSEMBLE */}
        <section id="ensemble" className={s.ensemble} aria-labelledby="ensemble-h">
          <div className={s.secHead}>
            <h2 data-edit="ensemble.title" data-edit-max="60" id="ensemble-h">The fourteen</h2>
            <p data-edit="ensemble.body" data-edit-max="240" data-edit-multiline>Contracted for the whole season, paid the same, listed alphabetically by nothing in particular.</p>
          </div>
          <ul className={s.names}>
            {ENSEMBLE.map((n, i) => (
              <li data-edit={`ensemble.item.${i}`} data-edit-max="80" key={n}>{n}</li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------- CALENDAR */}
        <section id="calendar" className={s.calendar} aria-labelledby="calendar-h">
          <div className={s.secHead}>
            <h2 data-edit="calendar.title" data-edit-max="60" id="calendar-h">Autumn dates</h2>
            <p data-edit="calendar.body" data-edit-max="240" data-edit-multiline>September and November. Winter goes on sale in October.</p>
          </div>
          <ol className={s.table}>
            {CALENDAR.map((r, i) => (
              <li key={r[0] + r[1]}>
                <span data-edit={`calendar.tDate.${i}`} data-edit-max="60" className={s.tDate}>{r[0]}</span>
                <span data-edit={`calendar.tTitle.${i}`} data-edit-max="60" className={s.tTitle}>{r[1]}</span>
                <span data-edit={`calendar.tRoom.${i}`} data-edit-max="60" className={s.tRoom}>{r[2]}</span>
                <span data-edit={`calendar.tTime.${i}`} data-edit-max="60" className={s.tTime}>{r[3]}</span>
                <span data-edit={`calendar.tNote.${i}`} data-edit-max="60" className={s.tNote}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ REPERTOIRE */}
        <section id="repertoire" className={s.repertoire} aria-labelledby="rep-h">
          <div className={s.secHead}>
            <h2 data-edit="repertoire.title" data-edit-max="60" id="rep-h">Everything, since 2019</h2>
            <p data-edit="repertoire.body" data-edit-max="240" data-edit-multiline>Retired pieces stay retired. None of these can be booked.</p>
          </div>
          <ol className={s.table}>
            {REPERTOIRE.map((r, i) => (
              <li key={r[1]}>
                <span data-edit={`repertoire.tDate.${i}`} data-edit-max="60" className={s.tDate}>{r[0]}</span>
                <span data-edit={`repertoire.tTitle.${i}`} data-edit-max="60" className={s.tTitle}>{r[1]}</span>
                <span data-edit={`repertoire.tRoom.${i}`} data-edit-max="60" className={s.tRoom}>{r[2]}</span>
                <span data-edit={`repertoire.tTime.${i}`} data-edit-max="60" className={s.tTime}>{r[3]}</span>
                <span data-edit={`repertoire.tNote.${i}`} data-edit-max="60" className={s.tNote}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <div data-edit-pattern="visit.field" data-edit-roles="transparent,3,4" className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={foldback}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={104}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">Coming to the Salzhaus</h2>
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
            <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Box office</p>
            <a data-edit="contact.deskTel" data-edit-max="28" id="contact-h" className={s.deskTel} href="tel:+41610009090">
              +41&nbsp;61&nbsp;000&nbsp;90&nbsp;90
            </a>
            <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
              Uferstrasse 90, 4057 Basel. The office answers between 10 and 16,
              and nobody answers during a technical rehearsal, which is most of
              the afternoon before a première.
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
              Returns go back on sale an hour before curtain, at the hall, for
              cash, to whoever is standing there.
            </p>
          </div>
        </section>
      </main>

      {/* A coda: the pattern at working size, nothing to read. */}
      <div data-edit-pattern="page.field" data-edit-roles="transparent,4,3,2" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={sheared}
          palette={['transparent', PALE, GREY, RED]}
          fit="grid"
          cellSize={112}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <ol className={s.footNext} aria-label="Next performances">
          {NEXT_UP.map(([when, what, tag], i) => (
            <li key={when}>
              <span data-edit={`footer.fnWhen.${i}`} data-edit-max="60" className={s.fnWhen}>{when}</span>
              <span data-edit={`footer.fnWhat.${i}`} data-edit-max="60" className={s.fnWhat}>{what}</span>
              <span data-edit={`footer.fnTag.${i}`} data-edit-max="60" className={s.fnTag}>{tag}</span>
            </li>
          ))}
        </ol>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Season</h2>
            <ul>
              <li><a data-edit="footer.season" data-edit-max="28" href="#season">Six pieces</a></li>
              <li><a data-edit="footer.calendar" data-edit-max="28" href="#calendar">Autumn dates</a></li>
              <li><a data-edit="footer.repertoire" data-edit-max="28" href="#repertoire">Archive</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Company</h2>
            <ul>
              <li><a data-edit="footer.work" data-edit-max="28" href="#work">How a piece is made</a></li>
              <li><a data-edit="footer.ensemble" data-edit-max="28" href="#ensemble">The fourteen</a></li>
              <li><a data-edit="footer.visit" data-edit-max="28" href="#visit">Access</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Uferstrasse 90
              <br />
              4057 Basel
              <br />
              halle@salzhaus.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional dance company. Dates, prices and people are invented.</p>
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
