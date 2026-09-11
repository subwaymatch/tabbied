import { TabbiedPattern } from 'tabbied/react';
import { fustian, larmier, mirrorblack } from 'tabbied/patterns';
import s from './xerox-riot.module.css';

export const metadata = {
  title: 'Xerox Riot: Zine fair, Glasgow',
  description:
    'Xerox Riot is a one-day zine fair in a former print works in the east end of Glasgow. Eighty-four tables, three talks, a workshop, a readings hour, free entry, no sponsors.',
};

/* Black ink on off-white paper, one red, two greys. Every field takes
   `transparent` in the background slot so the pattern sits in the page
   colour like toner on a photocopy, not a picture pasted over it. */
const INK = '#0A0A0A';
const RED = '#FF1E1E';
const GREY = '#6B6B6B';
const PALE = '#CFCFC8';
/* The programme tiles pin their doodle to a whole multiple of the cell
   (9 x 72px) and let the plate clip it. A fluid box gives fractional grid
   tracks and a hairline seam at every cell edge. */
const TILE_BOX = 648;

const NAV = [
  ['Exhibitors', '#exhibitors'],
  ['Programme', '#programme'],
  ['Tables', '#tables'],
  ['Rules', '#rules'],
  ['Venue', '#venue'],
  ['Past', '#past'],
];

const STAMPS = ['Free entry', 'All ages', 'No sponsors', 'Cash or card'];

type Exhibitor = {
  name: string;
  city: string;
};

const EXHIBITORS: Exhibitor[] = [
  { name: 'Bad Photocopy Press', city: 'Glasgow' },
  { name: 'Wee Grim Books', city: 'Dundee' },
  { name: 'Staple Gun Collective', city: 'Edinburgh' },
  { name: 'Hazel Mochrie', city: 'Paisley' },
  { name: 'Toner Low', city: 'Leeds' },
  { name: 'Riso Riot Belfast', city: 'Belfast' },
  { name: 'Coatbridge Comix', city: 'Coatbridge' },
  { name: 'Salt Marsh Zines', city: 'Aberdeen' },
  { name: 'Niamh Docherty', city: 'Glasgow' },
  { name: 'Ninety Pence Press', city: 'Liverpool' },
  { name: 'Ferry Road Distro', city: 'Edinburgh' },
  { name: 'Ochre and Dirt', city: 'Stirling' },
  { name: 'Dead Format', city: 'Manchester' },
  { name: 'Kelvin Cut Ups', city: 'Glasgow' },
  { name: 'Ruaridh Baird', city: 'Inverness' },
  { name: 'Fold Here Books', city: 'Newcastle' },
  { name: 'Bin Day', city: 'Govan' },
  { name: 'Clyde Built Comics', city: 'Glasgow' },
  { name: 'Margins Zine Library', city: 'Dublin' },
  { name: 'Sorcha Quinn', city: 'Derry' },
];

type Slot = {
  time: string;
  title: string;
  who: string;
};

type Strand = {
  n: string;
  name: string;
  where: string;
  body: string;
  slots: Slot[];
};

const PROGRAMME: Strand[] = [
  {
    n: '01',
    name: 'Talks',
    where: 'The mezzanine, 40 seats',
    body: 'Three, forty minutes each, no slides unless they are photocopies. Questions from the floor are the point.',
    slots: [
      { time: '11.30', title: 'Riso, and why it is not a photocopier', who: 'Toner Low' },
      { time: '13.30', title: 'Distribution without a warehouse', who: 'Ferry Road Distro' },
      { time: '15.30', title: 'Twenty years of Glasgow zines, badly remembered', who: 'A panel of four' },
    ],
  },
  {
    n: '02',
    name: 'Workshop',
    where: 'The old guillotine room',
    body: 'Fold, staple, photocopy. An eight-page zine from one sheet of A4 in two hours, with the copier running the whole time.',
    slots: [
      { time: '12.00', title: 'Make a zine, take it home', who: 'Staple Gun Collective' },
      { time: '14.00', title: 'The same again, second sitting', who: 'Staple Gun Collective' },
      { time: '4 pounds', title: 'Materials, paid at the door, 12 places each', who: 'Sign up at the desk' },
    ],
  },
  {
    n: '03',
    name: 'Readings hour',
    where: 'The loading bay',
    body: 'Open mic, five minutes each, from anything you are selling. A kitchen timer decides when you are done.',
    slots: [
      { time: '16.00', title: 'Sign-up sheet goes up at the desk', who: 'First come, first read' },
      { time: '16.15', title: 'Readings, twelve slots', who: 'Whoever signed up' },
      { time: '17.15', title: 'Last orders on the mic', who: 'Then the after-party' },
    ],
  },
];

type Table = {
  kind: string;
  size: string;
  price: string;
  note: string;
};

const TABLES: Table[] = [
  { kind: 'Half table', size: '90 x 60 cm', price: '15', note: 'One chair, one pass. The most common table in the hall.' },
  { kind: 'Full table', size: '180 x 60 cm', price: '28', note: 'Two chairs, two passes. Power on request, bring your own extension.' },
  { kind: 'Double', size: '360 x 60 cm', price: '50', note: 'Two full tables end to end, four passes. Eight of these, on the back wall.' },
  { kind: 'Collective', size: 'Full table, four or more of you', price: '60', note: 'Four passes and a fifth if you ask nicely. One name on the map.' },
  { kind: 'Distro or shop', size: 'Full table', price: '40', note: 'For selling other people\'s work. Two passes, and you get the corner spots.' },
];

const TABLE_TERMS = [
  ['Applications', 'Open 1 September, close 10 October. Answers by 20 October, everyone gets one.'],
  ['Concession', 'Five pounds off any table if you are a student, unwaged, or under 18. No proof asked.'],
  ['Payment', 'On acceptance, by bank transfer or at the desk on the day if you tell us in advance.'],
  ['Refunds', 'In full up to 1 November. After that we try to fill the table and refund if we do.'],
  ['Set-up', 'From 09.00 on the day. Doors at 11.00. Nothing packed away before 18.00, or we notice.'],
];

const RULES = [
  'No corporate publishers, no sponsors, no brands. If a company\'s logo is on your table, you are the company\'s table.',
  'Sell what you made, or what your pals made. Distros are welcome; drop-shippers are not.',
  'Price at least one thing on your table so a teenager can buy it. A pound is fine.',
  'Nothing generated by a machine that writes or draws for you. Draw it badly instead, we like that better.',
  'No hate on the tables, in the hall, or at the mic. We will ask once.',
  'Trade with each other. The best haul at any zine fair is the one behind the tables.',
  'Leave the hall as you found it, which was a mess, but our mess.',
  'Be sound. That is genuinely all of it.',
];

const VENUE = [
  ['Doors', '11.00 to 18.00, Saturday 14 November 2026'],
  ['Set-up', 'From 09.00, through the loading bay on Camlachie Street'],
  ['After', 'From 19.00 at the Bell, 200 metres up the road, until they throw us out'],
  ['Access', 'Step-free through the loading bay; lift to the mezzanine; two gender-neutral toilets; a quiet room by the office'],
  ['Getting there', 'Bellgrove station, 8 minutes on foot. Buses 2, 60, 61 to Gallowgate. Bike racks inside the bay'],
  ['Food', 'A veggie stall in the yard from noon; two cafes and a chippy within three minutes'],
];

type Edition = {
  year: string;
  where: string;
  tables: string;
  note: string;
};

const PAST: Edition[] = [
  { year: '2019', where: 'A church hall, Dennistoun', tables: '31', note: 'The first one. The photocopier was borrowed from the minister and returned with a jam.' },
  { year: '2020', where: 'Nowhere', tables: '0', note: 'Cancelled. Four hundred envelopes of zines went out by post instead, at cost, with a badge.' },
  { year: '2021', where: 'Outdoors, the Barras', tables: '42', note: 'It rained from one o\'clock. Every zine that survived is worth more now.' },
  { year: '2022', where: 'The Old Kelvin Press', tables: '60', note: 'First year in the print works. The guillotine room was still full of a guillotine.' },
  { year: '2023', where: 'The Old Kelvin Press', tables: '72', note: 'Nineteen hundred through the door. First workshop, and it sold out in nine minutes.' },
  { year: '2024', where: 'The Old Kelvin Press', tables: '80', note: 'The fire alarm at 14.10, forty minutes in the yard, and the best readings we have had.' },
  { year: '2025', where: 'The Old Kelvin Press', tables: '84', note: 'Twenty-four hundred visitors, the first readings hour proper, and the hall at capacity.' },
];

export default function XeroxRiotPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f4f4f0',
        '--ink': '#0a0a0a',
        '--red': '#ff1e1e',
        '--grey': '#6b6b6b',
        '--pale': '#cfcfc8',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Anton&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Xerox Riot</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <span data-edit="bar.barDate" data-edit-max="60" className={s.barDate}>Sat 14 Nov 2026</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            Mirrorblack's fans in grey and red at full bleed, the loud field,
            with the title cut out of three different papers on top. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={mirrorblack}
              palette={['transparent', PALE, GREY, RED]}
              fit="grid"
              cellSize={104}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.tilt" data-edit-max="240" data-edit-multiline className={s.tilt}>Zine fair, Glasgow, seventh edition</p>
            <h1 id="hero-h" className={s.ransom}>
              <span data-edit="hero.r1" data-edit-max="60" className={s.r1}>Xerox</span>
              <span data-edit="hero.r2" data-edit-max="60" className={s.r2}>Riot</span>
              <span data-edit="hero.r3" data-edit-max="60" className={s.r3}>2026</span>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              One day, eighty-four tables, three talks, a workshop, an hour of
              readings and a photocopier that never stops. In the old Kelvin
              Press on Camlachie Street, doors at eleven, in for nothing.
            </p>
            <ul className={s.stamps}>
              {STAMPS.map((st, i) => (
                <li data-edit={`hero.item.${i}`} data-edit-max="80" key={st}>{st}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------ EXHIBITORS */}
        <section id="exhibitors" className={s.exhibitors} aria-labelledby="exhibitors-h">
          <div className={s.secHead}>
            <h2 data-edit="exhibitors.barHead" data-edit-max="60" id="exhibitors-h" className={s.barHead}>Who has a table</h2>
            <p data-edit="exhibitors.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Twenty of the eighty-four, drawn out of a hat. The full list and
              the hall map go up on the door at ten to eleven, photocopied,
              take one.
            </p>
          </div>
          <ol className={s.exList}>
            {EXHIBITORS.map((e, i) => (
              <li key={e.name}>
                <span className={s.exNo}>{String(i + 1).padStart(2, '0')}</span>
                <span data-edit={`exhibitors.exName.${i}`} data-edit-max="60" className={s.exName}>{e.name}</span>
                <span data-edit={`exhibitors.exCity.${i}`} data-edit-max="60" className={s.exCity}>{e.city}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- PROGRAMME
            Three strands, each with a larmier tile standing in for the
            photograph a nicer fair would have taken. */}
        <section id="programme" className={s.programme} aria-labelledby="programme-h">
          <div className={s.secHead}>
            <h2 data-edit="programme.barHead" data-edit-max="60" id="programme-h" className={s.barHead}>The programme</h2>
            <p data-edit="programme.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Everything is free apart from the workshop materials. Nothing is
              ticketed; if the room is full it is full, and the talks are
              recorded on a dictaphone for the zine of the fair.
            </p>
          </div>
          <div className={s.strands}>
            {PROGRAMME.map((st, i) => (
              <article key={st.n} className={s.strand}>
                <div data-edit-pattern={`strand.field.${i}`} data-edit-roles="transparent,1,3,4" className={s.tile} aria-hidden="true">
                  <TabbiedPattern
                    pattern={larmier}
                    palette={['transparent', INK, GREY, PALE]}
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
                </div>
                <p data-edit={`strand.strandNo.${i}`} data-edit-max="240" data-edit-multiline className={s.strandNo}>{st.n}</p>
                <h3 data-edit={`strand.title.${i}`} data-edit-max="40">{st.name}</h3>
                <p data-edit={`strand.strandWhere.${i}`} data-edit-max="240" data-edit-multiline className={s.strandWhere}>{st.where}</p>
                <p data-edit={`strand.strandBody.${i}`} data-edit-max="240" data-edit-multiline className={s.strandBody}>{st.body}</p>
                <ol className={s.slots}>
                  {st.slots.map((sl, j) => (
                    <li key={`${i}-${j}`}>
                      <span data-edit={`strand.slotTime.${i}.${j}`} data-edit-max="60" className={s.slotTime}>{sl.time}</span>
                      <span data-edit={`strand.slotTitle.${i}.${j}`} data-edit-max="60" className={s.slotTitle}>{sl.title}</span>
                      <span data-edit={`strand.slotWho.${i}.${j}`} data-edit-max="60" className={s.slotWho}>{sl.who}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND
            Fustian's rib, more ink than ground, edge to edge and pinned to
            whole cells so no track lands on a half pixel. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,1,2,3" className={s.bandField}>
            <TabbiedPattern
              pattern={fustian}
              palette={['transparent', INK, RED, GREY]}
              fit="grid"
              cellSize={96}
              redrawInterval={3900}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- TABLES */}
        <section id="tables" className={s.tables} aria-labelledby="tables-h">
          <div className={s.tablesGrid}>
            <div>
              <h2 data-edit="tables.barHead" data-edit-max="60" id="tables-h" className={s.barHead}>Get a table</h2>
              <p data-edit="tables.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                Eighty-four tables in the hall, priced so the table pays for
                the hall and nothing else. Prices in pounds, for the day, and
                every table comes with the passes it says.
              </p>
              <dl className={s.tableTerms}>
                {TABLE_TERMS.map(([k, v], i) => (
                  <div key={k}>
                    <dt data-edit={`tables.term.${i}`} data-edit-max="28">{k}</dt>
                    <dd data-edit={`tables.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ol className={s.priceList}>
              {TABLES.map((t, i) => (
                <li key={t.kind}>
                  <h3 data-edit={`tables.priceKind.${i}`} data-edit-max="40" className={s.priceKind}>{t.kind}</h3>
                  <span data-edit={`tables.priceSize.${i}`} data-edit-max="60" className={s.priceSize}>{t.size}</span>
                  <span data-edit={`tables.priceAmt.${i}`} data-edit-max="60" className={s.priceAmt}>{t.price}</span>
                  <p data-edit={`tables.priceNote.${i}`} data-edit-max="240" data-edit-multiline className={s.priceNote}>{t.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------------------------------------------- RULES */}
        <section id="rules" className={s.rules} aria-labelledby="rules-h">
          <div className={s.rulesInner}>
            <h2 data-edit="rules.barHeadRed" data-edit-max="60" id="rules-h" className={s.barHeadRed}>Eight rules</h2>
            <ol className={s.ruleList}>
              {RULES.map((r, i) => (
                <li key={r}>
                  <span className={s.ruleNo}>{String(i + 1)}</span>
                  <p data-edit={`rules.body.${i}`} data-edit-max="240" data-edit-multiline>{r}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------------------------------------------- VENUE */}
        <section id="venue" className={s.venue} aria-labelledby="venue-h">
          <div className={s.venueGrid}>
            <div className={s.venueIntro}>
              <h2 data-edit="venue.barHead" data-edit-max="60" id="venue-h" className={s.barHead}>The Old Kelvin Press</h2>
              <p data-edit="venue.venueAddr" data-edit-max="240" data-edit-multiline className={s.venueAddr}>44 Camlachie Street, Glasgow G31 4AA</p>
              <p data-edit="venue.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                A print works from 1911 that ran until 2008 and still smells
                of it. Two floors, a mezzanine, a loading bay and the
                guillotine room, which now has no guillotine but kept the
                name.
              </p>
              <p data-edit="venue.tiltSmall" data-edit-max="240" data-edit-multiline className={s.tiltSmall}>Ask for the desk by the copier</p>
            </div>
            <dl className={s.venueList}>
              {VENUE.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`venue.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`venue.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------------------ PAST */}
        <section id="past" className={s.past} aria-labelledby="past-h">
          <div className={s.secHead}>
            <h2 data-edit="past.barHead" data-edit-max="60" id="past-h" className={s.barHead}>Six editions, one cancelled</h2>
            <p data-edit="past.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Started by four people with one photocopier and a church hall.
              Same four people, more tables, same copier.
            </p>
          </div>
          <ol className={s.editions}>
            {PAST.map((e, i) => (
              <li key={e.year}>
                <span data-edit={`past.edYear.${i}`} data-edit-max="60" className={s.edYear}>{e.year}</span>
                <span data-edit={`past.edWhere.${i}`} data-edit-max="60" className={s.edWhere}>{e.where}</span>
                <span data-edit={`past.edTables.${i}`} data-edit-max="60" className={s.edTables}>{e.tables}</span>
                <p data-edit={`past.edNote.${i}`} data-edit-max="240" data-edit-multiline className={s.edNote}>{e.note}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* A coda: the same fans as the hero, cut smaller and quieter, the last
          thing before the footer with nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,3,4" className={s.codaField}>
          <TabbiedPattern
            pattern={mirrorblack}
            palette={['transparent', GREY, PALE]}
            fit="grid"
            cellSize={88}
            redrawInterval={6000}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Xerox Riot</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              A zine fair in the east end of Glasgow, once a year, since 2019.
              Run by four people and a photocopier. Not a company.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>The day</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.exhibitors" data-edit-max="28" href="#exhibitors">Exhibitors</a></li>
              <li><a data-edit="footer.programme" data-edit-max="28" href="#programme">Programme</a></li>
              <li><a data-edit="footer.venue" data-edit-max="28" href="#venue">Venue and access</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Tabling</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.tables" data-edit-max="28" href="#tables">Table prices</a></li>
              <li><a data-edit="footer.rules" data-edit-max="28" href="#rules">The rules</a></li>
              <li><a data-edit="footer.past" data-edit-max="28" href="#past">Past editions</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Write</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              The Old Kelvin Press
              <br />
              44 Camlachie Street, G31 4AA
              <br />
              desk@xeroxriot.example
              <br />
              No phone. Really.
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>
            A fictional zine fair. The exhibitors, venue, prices and history
            are invented; the photocopier is a composite.
          </p>
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
