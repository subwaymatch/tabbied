import { TabbiedPattern } from 'tabbied/react';
import {
  halfmast, parity, raking, reedpen, seamband, stepramp, subside, thirdstop,
} from 'tabbied/patterns';
import s from './zwoelfton.module.css';

export const metadata = {
  title: 'Zwölfton: New-music ensemble, Vienna',
  description:
    'Zwölfton plays music written in the last five years, twelve players, no conductor. Season, commissions, recordings and the whole back catalogue.',
};

/* Night ground, bone type, one acid yellow. Fields take `transparent` in the
   background slot so the black of the page is the black of the pattern. */
const BONE = '#efeee7';
const ACID = '#e8ff00';
const GREY = '#6d6d66';
const DEEP = '#22222a';

/* The row itself, used as a design element in three places. */
const ROW = ['0', '11', '3', '4', '8', '7', '9', '5', '6', '1', '2', '10'];
const PITCHES = ['C', 'B', 'D\u266F', 'E', 'G\u266F', 'G', 'A', 'F', 'F\u266F', 'C\u266F', 'D', 'A\u266F'];

const CONCERTS = [
  {
    date: '18.09',
    year: '2026',
    title: 'Erste Reihe',
    works: 'Saariaho / Czernowin / Haas',
    room: 'Konzerthaus, Berio-Saal',
    tag: 'Season opening',
  },
  {
    date: '23.10',
    year: '2026',
    title: 'Nichts wiederholt sich',
    works: 'Two premieres, one of them ours',
    room: 'Wien Modern, Halle E',
    tag: 'Festival',
  },
  {
    date: '04.12',
    year: '2026',
    title: 'Kammer',
    works: 'Feldman, all of it, in one sitting',
    room: 'Alte Schmiede',
    tag: 'Late',
  },
  {
    date: '29.01',
    year: '2027',
    title: 'Zwölf Antworten',
    works: 'Twelve one-minute commissions',
    room: 'Konzerthaus, Schubert-Saal',
    tag: 'Premieres',
  },
  {
    date: '12.03',
    year: '2027',
    title: 'Grundton',
    works: 'Scelsi / Radigue / Lucier',
    room: 'Sargfabrik',
    tag: '',
  },
  {
    date: '07.05',
    year: '2027',
    title: 'Letzte Reihe',
    works: 'Everything commissioned this season, again',
    room: 'Konzerthaus, Berio-Saal',
    tag: 'Season close',
  },
];

const PLAYERS = [
  ['Flute', 'Ines Haberl'],
  ['Oboe', 'Tomás Ruiz'],
  ['Clarinet', 'Nora Pichler'],
  ['Bassoon', 'Jan Kovač'],
  ['Horn', 'Mia Steinbach'],
  ['Trumpet', 'Elias Fuchs'],
  ['Percussion', 'Ruth Almási'],
  ['Piano', 'Vera Lindqvist'],
  ['Violin I', 'Aleks Nowak'],
  ['Violin II', 'Hanna Berger'],
  ['Viola', 'Paul Winter'],
  ['Cello', 'Sofia Marek'],
];

const COMMISSIONS = [
  ['2027', 'Ana Lucía Ferrer', 'Untitled (in progress)', '12 players', 'Premiere 07.05'],
  ['2026', 'Kenji Ohara', 'Second Room', '8 players', 'Premiere 23.10'],
  ['2026', 'Mirjam Beck', 'Zwölf Antworten I-XII', '12 × 1′', 'Premiere 29.01'],
  ['2025', 'Idris Salah', 'Anemometer', '6 players + tape', '4 performances'],
  ['2025', 'Léa Fontaine', 'Sans mesure', '12 players', '7 performances'],
  ['2024', 'Petra Hoxha', 'Kante / Rand', 'Solo percussion', '11 performances'],
  ['2024', 'Nils Ødegaard', 'Der lange Ton', '12 players', '5 performances'],
  ['2023', 'Yuki Tanabe', 'Sieve', 'String quartet', '9 performances'],
  ['2023', 'Amara Diallo', 'Weather Report', '8 players', '6 performances'],
  ['2022', 'Rob Feenstra', 'Nothing Doing', '12 players', '3 performances'],
  ['2022', 'Selin Aksoy', 'Halbton', 'Piano + electronics', '14 performances'],
  ['2021', 'Ensemble', 'Erste Bestellung', '12 players', 'Retired'],
];

const RECORDS = [
  ['ZT 08', 'Der lange Ton', 'Ødegaard', '2025', 'LP + digital'],
  ['ZT 07', 'Sieve / Kante', 'Tanabe, Hoxha', '2024', 'Digital only'],
  ['ZT 06', 'Sans mesure', 'Fontaine', '2024', 'LP + digital'],
  ['ZT 05', 'Halbton', 'Aksoy', '2023', 'Digital only'],
  ['ZT 04', 'Nothing Doing', 'Feenstra', '2022', 'LP, out of print'],
  ['ZT 03', 'Grundton', 'Scelsi, Radigue', '2022', 'LP + digital'],
  ['ZT 02', 'Kammer', 'Feldman', '2021', '3 × LP'],
  ['ZT 01', 'Erste Bestellung', 'Ensemble', '2020', 'Digital only'],
];

const RULES = [
  {
    art: thirdstop,
    n: '01',
    t: 'No conductor',
    d: 'Twelve players who can hear each other. Anything that needs a thirteenth person standing up to hold it together is a piece we have not rehearsed enough.',
  },
  {
    art: halfmast,
    n: '02',
    t: 'Nothing older than five years',
    d: 'With four exceptions a season, chosen by the players, argued about in March and announced without justification.',
  },
  {
    art: stepramp,
    n: '03',
    t: 'The composer is in the room',
    d: 'Every commission includes three rehearsals with the composer present and one where they are asked to leave, so we can find out what the score actually says.',
  },
];

const VISIT = [
  ['Where', 'Most nights at the Konzerthaus. Some in a former coffin factory.'],
  ['Tickets', '€ 9 - 34. Standing is € 9 and there is always standing.'],
  ['Length', 'Between forty minutes and four hours. It says which on the ticket.'],
  ['Applause', 'Whenever you like. We have stopped minding.'],
];

export default function ZwoelftonPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--night': '#0b0b0f',
        '--bone': '#efeee7',
        '--acid': '#e8ff00',
        '--grey': '#6d6d66',
        '--deep': '#22222a',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="night,bone,acid,grey,deep"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Zwölfton</a>
        <nav aria-label="Sections">
          <a data-edit="bar.season" data-edit-max="28" href="#season">Season</a>
          <a data-edit="bar.players" data-edit-max="28" href="#players">Players</a>
          <a data-edit="bar.commissions" data-edit-max="28" href="#commissions">Commissions</a>
          <a data-edit="bar.records" data-edit-max="28" href="#records">Records</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Wien / 26-27</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={raking}
              palette={['transparent', DEEP, GREY, ACID]}
              fit="grid"
              cellSize={150}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Ensemble for new music / Vienna / twelve players</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Zwölf</span>
            <span data-edit="hero.acid" data-edit-max="60" className={s.acid}>ton</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Music written in the last five years, played by twelve people who
              can hear each other, with nobody standing at the front.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#season">
              Season 26 / 27
            </a>
          </div>
        </section>

        {/* -------------------------------------------------------- TONE ROW
            Twelve cells, each one a different reading of the same pattern.
            It is the ensemble's row, and it is also the page's grid. */}
        <section className={s.row} aria-label="The house tone row">
          {ROW.map((n, i) => (
            <div key={n} className={s.rowCell}>
              <div data-edit-pattern={`row.field.${i}`} className={s.rowField} aria-hidden="true">
                <TabbiedPattern
                  pattern={reedpen}
                  palette={['transparent', i % 4 === 0 ? ACID : GREY, DEEP]}
                  fit="grid"
                  cellSize={30 + i * 4}
                  redrawInterval={4000 + i * 260}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
              <span data-edit={`row.rowPc.${i}`} data-edit-max="60" className={s.rowPc}>{n}</span>
              <span data-edit={`row.rowPitch.${i}`} data-edit-max="60" className={s.rowPitch}>{PITCHES[i]}</span>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            A row is only an order. It tells you what comes next and nothing at
            all about how loud, how long, or whether anybody should enjoy it.
            We have taken that as a working method rather than a style.
          </p>
        </section>

        {/* ---------------------------------------------------------- SEASON
            The date is the display type and the title is the small print -
            an inversion, on purpose: a concert is a night before it is a name. */}
        <section id="season" className={s.season} aria-labelledby="season-h">
          <div className={s.secHead}>
            <h2 data-edit="season.title" data-edit-max="60" id="season-h">Six nights</h2>
            <p data-edit="season.body" data-edit-max="240" data-edit-multiline>Season 26 / 27. Two of them are somewhere other than the Konzerthaus.</p>
          </div>
          <ol className={s.nights}>
            {CONCERTS.map((c, i) => (
              <li key={c.date}>
                <p className={s.nDate}>
                  {c.date}
                  <span data-edit={`season.text.${i}`} data-edit-max="60">{c.year}</span>
                </p>
                <div className={s.nBody}>
                  <h3 data-edit={`season.title2.${i}`} data-edit-max="40">{c.title}</h3>
                  <p data-edit={`season.nWorks.${i}`} data-edit-max="240" data-edit-multiline className={s.nWorks}>{c.works}</p>
                  <p data-edit={`season.nRoom.${i}`} data-edit-max="240" data-edit-multiline className={s.nRoom}>{c.room}</p>
                </div>
                {c.tag ? <span data-edit={`season.nTag.${i}`} data-edit-max="60" className={s.nTag}>{c.tag}</span> : <span />}
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ RULES */}
        <section className={s.rules} aria-labelledby="rules-h">
          <div className={s.secHead}>
            <h2 data-edit="rules.title" data-edit-max="60" id="rules-h">Three rules</h2>
            <p data-edit="rules.body" data-edit-max="240" data-edit-multiline>Agreed in 2019, tested every season, still standing.</p>
          </div>
          <div className={s.rGrid}>
            {RULES.map((r, i) => (
              <article key={r.n}>
                <div data-edit-pattern={`rules.field.${i}`} data-edit-roles="transparent,4,2" className={s.rPlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={r.art}
                    palette={['transparent', DEEP, ACID]}
                    fit="grid"
                    cellSize={64}
                    redrawInterval={5200}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p data-edit={`rules.rN.${i}`} data-edit-max="240" data-edit-multiline className={s.rN}>{r.n}</p>
                <h3 data-edit={`rules.title2.${i}`} data-edit-max="40">{r.t}</h3>
                <p data-edit={`rules.rBody.${i}`} data-edit-max="240" data-edit-multiline className={s.rBody}>{r.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- PLAYERS */}
        <section id="players" className={s.players} aria-labelledby="players-h">
          <div data-edit-pattern="players.field" data-edit-roles="transparent,4,3" className={s.playersField} aria-hidden="true">
            <TabbiedPattern
              pattern={parity}
              palette={['transparent', DEEP, GREY]}
              fit="grid"
              cellSize={118}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.playersInner}>
            <div className={s.secHead}>
              <h2 data-edit="players.title" data-edit-max="60" id="players-h">Twelve</h2>
              <p data-edit="players.body" data-edit-max="240" data-edit-multiline>Fixed personnel. Substitutes are named on the night, on the door, in the same size type.</p>
            </div>
            <ol className={s.playerList}>
              {PLAYERS.map(([inst, name], i) => (
                <li key={inst}>
                  <span className={s.pIdx}>{String(i + 1).padStart(2, '0')}</span>
                  <span data-edit={`players.pName.${i}`} data-edit-max="60" className={s.pName}>{name}</span>
                  <span data-edit={`players.pInst.${i}`} data-edit-max="60" className={s.pInst}>{inst}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={subside}
              palette={['transparent', ACID, GREY]}
              fit="grid"
              cellSize={126}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>Twelve people is the largest group that can still argue properly.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Vera Lindqvist, piano, on why the ensemble never grew</cite>
          </blockquote>
        </section>

        {/* ------------------------------------------------------ COMMISSIONS */}
        <section id="commissions" className={s.listing} aria-labelledby="comm-h">
          <div className={s.secHead}>
            <h2 data-edit="commissions.title" data-edit-max="60" id="comm-h">Everything we asked for</h2>
            <p data-edit="commissions.body" data-edit-max="240" data-edit-multiline>Every commission since the first season, including the ones nobody plays now.</p>
          </div>
          <ol className={s.table}>
            {COMMISSIONS.map((r, i) => (
              <li key={r[1] + r[2]}>
                <span data-edit={`commissions.tYear.${i}`} data-edit-max="60" className={s.tYear}>{r[0]}</span>
                <span data-edit={`commissions.tWho.${i}`} data-edit-max="60" className={s.tWho}>{r[1]}</span>
                <span data-edit={`commissions.tWhat.${i}`} data-edit-max="60" className={s.tWhat}>{r[2]}</span>
                <span data-edit={`commissions.tForce.${i}`} data-edit-max="60" className={s.tForce}>{r[3]}</span>
                <span data-edit={`commissions.tNote.${i}`} data-edit-max="60" className={s.tNote}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- RECORDS */}
        <section id="records" className={s.listing} aria-labelledby="rec-h">
          <div className={s.secHead}>
            <h2 data-edit="records.title" data-edit-max="60" id="rec-h">On record</h2>
            <p data-edit="records.body" data-edit-max="240" data-edit-multiline>Our own label, pressed in runs of five hundred, never repressed.</p>
          </div>
          <ol className={s.table}>
            {RECORDS.map((r, i) => (
              <li key={r[0]}>
                <span data-edit={`records.tYear.${i}`} data-edit-max="60" className={s.tYear}>{r[0]}</span>
                <span data-edit={`records.tWho.${i}`} data-edit-max="60" className={s.tWho}>{r[1]}</span>
                <span data-edit={`records.tWhat.${i}`} data-edit-max="60" className={s.tWhat}>{r[2]}</span>
                <span data-edit={`records.tForce.${i}`} data-edit-max="60" className={s.tForce}>{r[3]}</span>
                <span data-edit={`records.tNote.${i}`} data-edit-max="60" className={s.tNote}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- WORKSHOP */}
        <section id="workshop" className={s.workshop} aria-labelledby="workshop-h">
          <span className={s.sideLabel} aria-hidden="true">Probe / Werkstatt</span>
          <h2 data-edit="workshop.title" data-edit-max="60" id="workshop-h">What a rehearsal week looks like</h2>
          <div className={s.wCols}>
            <p data-edit="workshop.lead" data-edit-max="240" data-edit-multiline className={s.lead}>
              Four days on a piece nobody has heard, and the first of them is
              spent reading it out loud, badly, all the way through.
            </p>
            <div>
              <p data-edit="workshop.body" data-edit-max="240" data-edit-multiline>
                Day one is a read-through with no stopping. It is unpleasant and
                it is the only time the whole shape of a piece is audible before
                we have opinions about the bars.
              </p>
              <p data-edit="workshop.body2" data-edit-max="240" data-edit-multiline>
                Day two is sections, day three is the composer's day, and on day
                four we play it twice with a stopwatch and pick the take that was
                worse but more alive.
              </p>
              <p data-edit="workshop.body3" data-edit-max="240" data-edit-multiline>
                Anybody can call a halt. In practice it is the percussionist,
                because she is the only one who can see everyone.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <div data-edit-pattern="visit.field" data-edit-roles="transparent,3,4" className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={stepramp}
              palette={['transparent', GREY, DEEP]}
              fit="grid"
              cellSize={100}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">Coming to hear it</h2>
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
        <section className={s.contact}>
          <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Scores, invitations, complaints</p>
          <a data-edit="contact.contactMail" data-edit-max="28" className={s.contactMail} href="mailto:reihe@zwoelfton.example">
            reihe@zwoelfton.example
          </a>
          <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
            Ungargasse 14/2, 1030 Wien. We read every score that arrives and
            answer in about six weeks, which is slow and honest.
          </p>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,3,4,2" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={seamband}
          palette={['transparent', GREY, DEEP, ACID]}
          fit="grid"
          cellSize={104}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <p data-edit="footer.footMark" data-edit-max="240" data-edit-multiline className={s.footMark}>12</p>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Season</h2>
            <ul>
              <li><a data-edit="footer.season" data-edit-max="28" href="#season">Six nights</a></li>
              <li><a data-edit="footer.commissions" data-edit-max="28" href="#commissions">Commissions</a></li>
              <li><a data-edit="footer.records" data-edit-max="28" href="#records">On record</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Ensemble</h2>
            <ul>
              <li><a data-edit="footer.players" data-edit-max="28" href="#players">Twelve players</a></li>
              <li><a data-edit="footer.workshop" data-edit-max="28" href="#workshop">Rehearsal week</a></li>
              <li><a data-edit="footer.visit" data-edit-max="28" href="#visit">Tickets</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Ungargasse 14/2
              <br />
              1030 Wien
              <br />
              reihe@zwoelfton.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional ensemble. Composers, dates and catalogue numbers are invented.</p>
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
