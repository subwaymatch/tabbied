import { TabbiedPattern } from 'tabbied/react';
import { guernsey, shatter, ziggy } from 'tabbied/patterns';
import s from './bonbon-club.module.css';

export const metadata = {
  title: 'Bonbon Club: After-school club, Brighton',
  description:
    'Bonbon Club is an after-school club in a church hall in Brighton. Six clubs, a snack, three till six every school day, for children aged five to eleven.',
};

/* Five flat inks. Every field draws on `transparent`, so the pattern sits
   in the cream of the page rather than on a plate of its own. */
const INK = '#1B1B1F';
const PINK = '#FF4F7B';
const MINT = '#2FC4B2';
const YELLOW = '#FFC53D';
const VIOLET = '#6C5CE7';
/* The tiles pin their doodle to a whole multiple of the cell (8 x 72px)
   and let the frame clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 576;

type Tone = 'pink' | 'mint' | 'yellow' | 'violet';

const TONE: Record<Tone, string> = {
  pink: s.tonePink,
  mint: s.toneMint,
  yellow: s.toneYellow,
  violet: s.toneViolet,
};

const NAV = [
  ['Clubs', '#clubs'],
  ['The week', '#week'],
  ['Snacks', '#snacks'],
  ['Staff', '#staff'],
  ['Prices', '#prices'],
  ['Venue', '#venue'],
];

type Club = {
  name: string;
  tone: Tone;
  ages: string;
  days: string;
  blurb: string;
  leader: string;
};

const CLUBS: Club[] = [
  { name: 'Art Club', tone: 'pink', ages: 'Ages 5 to 11', days: 'Mon and Thu', blurb: 'Paint, clay, printing and the occasional papier-mache volcano. Aprons provided, washing machines advised.', leader: 'With Priya' },
  { name: 'Coding Club', tone: 'violet', ages: 'Ages 7 to 11', days: 'Tue and Fri', blurb: 'Scratch first, then micro:bit, then whatever they ask for. Nobody has to touch a keyboard on day one.', leader: 'With Dev' },
  { name: 'Drama Club', tone: 'yellow', ages: 'Ages 5 to 11', days: 'Wednesday', blurb: 'Games, improvisation and a show every term that parents are firmly encouraged to attend.', leader: 'With Sam' },
  { name: 'Cooking Club', tone: 'mint', ages: 'Ages 6 to 11', days: 'Mon and Wed', blurb: 'Real knives, real ovens, real washing up. Everything made is eaten on the spot or taken home in a tub.', leader: 'With Priya' },
  { name: 'Football', tone: 'mint', ages: 'Ages 5 to 11', days: 'Tue and Thu', blurb: 'Five-a-side in the hall in winter and on the green in summer. Everybody plays, nobody is picked last.', leader: 'With Sam' },
  { name: 'Chess Club', tone: 'violet', ages: 'Ages 6 to 11', days: 'Friday', blurb: 'Boards out at half past three. Beginners get the rules in ten minutes and a game in fifteen.', leader: 'With Dev' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

type Cell = {
  text: string;
  tone: Tone;
};

type Row = {
  time: string;
  cells: Cell[];
};

/* The first and last rows are the same every day, which is the point of
   them, so they are written once. */
const everyDay = (text: string, tone: Tone): Cell[] =>
  DAYS.map(() => ({ text, tone }));

const WEEK: Row[] = [
  { time: '3:00', cells: everyDay('Arrive and snack', 'yellow') },
  {
    time: '3:30',
    cells: [
      { text: 'Art Club', tone: 'pink' },
      { text: 'Coding Club', tone: 'violet' },
      { text: 'Drama Club', tone: 'yellow' },
      { text: 'Art Club', tone: 'pink' },
      { text: 'Coding Club', tone: 'violet' },
    ],
  },
  {
    time: '4:30',
    cells: [
      { text: 'Cooking Club', tone: 'mint' },
      { text: 'Football', tone: 'mint' },
      { text: 'Cooking Club', tone: 'mint' },
      { text: 'Football', tone: 'mint' },
      { text: 'Chess Club', tone: 'violet' },
    ],
  },
  { time: '5:30', cells: everyDay('Free play, pick-up', 'yellow') },
];

type Moment = {
  time: string;
  title: string;
  body: string;
};

const AFTERNOON: Moment[] = [
  {
    time: '3:00',
    title: 'The walk over',
    body: 'We collect from Elm Grove Primary and St Mark\'s in two walking lines. Everyone is registered at the door and the snack is already out.',
  },
  {
    time: '3:30',
    title: 'Two clubs, one each',
    body: 'A first club at half past three and a second at half past four. A child can do the same one all term or swap every week.',
  },
  {
    time: '5:30',
    title: 'The last half hour',
    body: 'Board games, the book corner, or the yard if it is dry. Pick-up is any time before six, and we have a word at the door about the day.',
  },
];

const MENU = [
  ['Every day', 'Fruit, toast, water or milk'],
  ['Monday', 'Cheese and crackers'],
  ['Tuesday', 'Houmous and carrot sticks'],
  ['Wednesday', 'Whatever Cooking Club made'],
  ['Thursday', 'Crumpets'],
  ['Friday', 'Popcorn, plain'],
];

type Person = {
  name: string;
  role: string;
  initials: string;
  tone: Tone;
};

const STAFF: Person[] = [
  { name: 'Jo Bassett', role: 'Manager, Level 3 Playwork', initials: 'JB', tone: 'pink' },
  { name: 'Priya Nair', role: 'Art and cooking', initials: 'PN', tone: 'yellow' },
  { name: 'Dev Okafor', role: 'Coding and chess', initials: 'DO', tone: 'violet' },
  { name: 'Sam Whitlock', role: 'Drama and football', initials: 'SW', tone: 'mint' },
  { name: 'Hana Kowalski', role: 'Playworker, first aider', initials: 'HK', tone: 'pink' },
];

type Price = {
  name: string;
  price: string;
  note: string;
  tone: Tone;
};

const PRICES: Price[] = [
  { name: 'A session', price: '£14', note: 'Three till six, snack included. Book by the Thursday before.', tone: 'yellow' },
  { name: 'A week', price: '£60', note: 'Five sessions for one child, any week in term time.', tone: 'pink' },
  { name: 'A term', price: '£600', note: 'Twelve weeks, every school day, paid monthly by direct debit.', tone: 'mint' },
];

type Step = {
  n: string;
  title: string;
  body: string;
};

const SIGNUP: Step[] = [
  { n: '1', title: 'Fill in the form', body: 'Name, school, year group, allergies, and who is allowed to collect. Ten minutes, on a phone is fine.' },
  { n: '2', title: 'We ring you', body: 'Jo calls within two working days to talk through the week you want and anything we should know.' },
  { n: '3', title: 'A free afternoon', body: 'The first session is on us. If it is not the right place for your child, no harm done and nothing to pay.' },
  { n: '4', title: 'Book and pay', body: 'Sessions, weeks or a term. Childcare vouchers and tax-free childcare both accepted.' },
];

export default function BonbonClubPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#fff8e7',
        '--ink': '#1b1b1f',
        '--pink': '#ff4f7b',
        '--mint': '#2fc4b2',
        '--yellow': '#ffc53d',
        '--violet': '#6c5ce7',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,pink,mint,yellow,violet"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Bonbon Club
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a data-edit="bar.barCta" data-edit-max="28" className={s.barCta} href="#signup">
          Sign up
        </a>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO
            shatter is the Memphis toolkit already: quarter circles, half
            squares, discs and raked stripes. It runs at nearly full strength
            and the copy sits on a card with its own outline and shadow. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,3,4,5,1" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={shatter}
              palette={['transparent', PINK, MINT, YELLOW, VIOLET, INK]}
              fit="grid"
              cellSize={144}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroCard}>
            <p data-edit="hero.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>After-school club / Brighton / ages 5 to 11</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
              Three till six,
              <br />
              every school day,
              <br />
              <em>never boring.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Six clubs, a proper snack and a walk over from two schools. Run
              from St Aldhelm's Church Hall on Elm Grove since 2019, by five
              people who genuinely like Tuesdays.
            </p>
            <div className={s.heroActions}>
              <a data-edit="hero.buttonPink" data-edit-max="28" className={s.buttonPink} href="#signup">
                Sign up
              </a>
              <a data-edit="hero.buttonPlain" data-edit-max="28" className={s.buttonPlain} href="#week">
                See the week
              </a>
            </div>
            <span data-edit="hero.stickerHero" data-edit-max="60" className={s.stickerHero}>from &#163;14 a session</span>
          </div>
        </section>

        {/* --------------------------------------------------------- CLUBS */}
        <section id="clubs" className={s.section} aria-labelledby="clubs-h">
          <div className={s.sectionHead}>
            <h2 data-edit="clubs.title" data-edit-max="60" id="clubs-h">Six clubs</h2>
            <p data-edit="clubs.sectionLede" data-edit-max="240" data-edit-multiline className={s.sectionLede}>
              Two a day, every day. A child picks one at half past three and
              another at half past four, and can change their mind every week
              or never.
            </p>
          </div>
          <ul className={s.clubGrid}>
            {CLUBS.map((c, i) => (
              <li key={c.name} className={s.card}>
                <div className={TONE[c.tone]}>
                  <h3 data-edit={`clubs.title2.${i}`} data-edit-max="40">{c.name}</h3>
                </div>
                <div className={s.cardBody}>
                  <p data-edit={`clubs.cardMeta.${i}`} data-edit-max="240" data-edit-multiline className={s.cardMeta}>{c.ages}</p>
                  <p data-edit={`clubs.cardMeta2.${i}`} data-edit-max="240" data-edit-multiline className={s.cardMeta}>{c.days}</p>
                  <p data-edit={`clubs.cardText.${i}`} data-edit-max="240" data-edit-multiline className={s.cardText}>{c.blurb}</p>
                  <p data-edit={`clubs.cardLeader.${i}`} data-edit-max="240" data-edit-multiline className={s.cardLeader}>{c.leader}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------- WEEK */}
        <section id="week" className={s.section} aria-labelledby="week-h">
          <div className={s.sectionHead}>
            <h2 data-edit="week.title" data-edit-max="60" id="week-h">The week</h2>
            <p data-edit="week.sectionLede" data-edit-max="240" data-edit-multiline className={s.sectionLede}>
              Doors at three, home by six. The first row and the last are the
              same every day, which is the point of them.
            </p>
          </div>
          <div className={s.weekWrap}>
            <table className={s.week}>
              <thead>
                <tr>
                  <th data-edit="week.heading" scope="col">Time</th>
                  {DAYS.map((d, i) => (
                    <th data-edit={`week.heading2.${i}`} key={d} scope="col">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEK.map((row, i) => (
                  <tr key={row.time}>
                    <th data-edit={`week.heading3.${i}`} scope="row">{row.time}</th>
                    {row.cells.map((cell, j) => (
                      <td data-edit={`week.cell.${i}.${j}`} key={`${i}-${j}`} className={TONE[cell.tone]}>
                        {cell.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------------------------------------------------------- BAND
            guernsey: a sawtooth skyline in flat colour, the loudest field on
            the page, with nothing to read. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,2,4,3,5" className={s.bandField} aria-hidden="true">
            <TabbiedPattern
              pattern={guernsey}
              palette={['transparent', PINK, YELLOW, MINT, VIOLET]}
              fit="grid"
              cellSize={96}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ----------------------------------------------------- AFTERNOON
            Three tiles standing in for photographs: ziggy chevrons on the
            cream, each in a frame with the same outline and shadow as
            everything else on the page. */}
        <section id="afternoon" className={s.section} aria-labelledby="afternoon-h">
          <div className={s.sectionHead}>
            <h2 data-edit="afternoon.title" data-edit-max="60" id="afternoon-h">An afternoon here</h2>
          </div>
          <ol className={s.tiles}>
            {AFTERNOON.map((m, i) => (
              <li key={m.time}>
                <div data-edit-pattern={`afternoon.field.${i}`} data-edit-roles="transparent,1,2,3,5,4" className={s.tile} aria-hidden="true">
                  <TabbiedPattern
                    pattern={ziggy}
                    palette={['transparent', INK, PINK, MINT, VIOLET, YELLOW]}
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
                </div>
                <p data-edit={`afternoon.tileTime.${i}`} data-edit-max="240" data-edit-multiline className={s.tileTime}>{m.time}</p>
                <h3 data-edit={`afternoon.title2.${i}`} data-edit-max="40">{m.title}</h3>
                <p data-edit={`afternoon.tileBody.${i}`} data-edit-max="240" data-edit-multiline className={s.tileBody}>{m.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- SNACKS */}
        <section id="snacks" className={s.section} aria-labelledby="snacks-h">
          <div className={s.snackCard}>
            <div className={s.snackHead}>
              <h2 data-edit="snacks.title" data-edit-max="60" id="snacks-h">Snack</h2>
              <p data-edit="snacks.snackLede" data-edit-max="240" data-edit-multiline className={s.snackLede}>
                Out on the table at three, eaten sitting down, cleared by half
                past. Nobody goes hungry and nobody gets a biscuit instead of
                the fruit.
              </p>
            </div>
            <dl className={s.menu}>
              {MENU.map(([day, food], i) => (
                <div key={day}>
                  <dt data-edit={`snacks.term.${i}`} data-edit-max="28">{day}</dt>
                  <dd data-edit={`snacks.body.${i}`} data-edit-max="200" data-edit-multiline>{food}</dd>
                </div>
              ))}
            </dl>
            <span data-edit="snacks.stickerSnack" data-edit-max="60" className={s.stickerSnack}>nut free</span>
          </div>
          <p data-edit="snacks.sectionNote" data-edit-max="240" data-edit-multiline className={s.sectionNote}>
            Allergies and diets are taken at sign-up and written on the
            kitchen wall. Tell us if anything changes.
          </p>
        </section>

        {/* --------------------------------------------------------- STAFF */}
        <section id="staff" className={s.section} aria-labelledby="staff-h">
          <div className={s.sectionHead}>
            <h2 data-edit="staff.title" data-edit-max="60" id="staff-h">Five of us</h2>
            <p data-edit="staff.sectionLede" data-edit-max="240" data-edit-multiline className={s.sectionLede}>
              Everyone is on the enhanced DBS list, paediatric first aid
              trained, and re-checked every three years. Ratios are one adult
              to eight children, always.
            </p>
          </div>
          <ul className={s.staffGrid}>
            {STAFF.map((p, i) => (
              <li key={p.name} className={s.person}>
                <span data-edit={`staff.initials.${i}`} data-edit-max="60" className={TONE[p.tone] + ' ' + s.initials}>{p.initials}</span>
                <span data-edit={`staff.personName.${i}`} data-edit-max="60" className={s.personName}>{p.name}</span>
                <span data-edit={`staff.personRole.${i}`} data-edit-max="60" className={s.personRole}>{p.role}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------- PRICES */}
        <section id="prices" className={s.section} aria-labelledby="prices-h">
          <div className={s.sectionHead}>
            <h2 data-edit="prices.title" data-edit-max="60" id="prices-h">What it costs</h2>
          </div>
          <ul className={s.priceGrid}>
            {PRICES.map((p, i) => (
              <li key={p.name} className={s.card}>
                <div className={TONE[p.tone] + ' ' + s.priceTop}>
                  <h3 data-edit={`prices.title2.${i}`} data-edit-max="40">{p.name}</h3>
                  <span data-edit={`prices.stickerPrice.${i}`} data-edit-max="60" className={s.stickerPrice}>{p.price}</span>
                </div>
                <div className={s.cardBody}>
                  <p data-edit={`prices.cardText.${i}`} data-edit-max="240" data-edit-multiline className={s.cardText}>{p.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <dl className={s.smallPrint}>
            <div>
              <dt data-edit="prices.term" data-edit-max="28">Siblings</dt>
              <dd data-edit="prices.body" data-edit-max="200" data-edit-multiline>20% off the second child and every child after that, on any booking.</dd>
            </div>
            <div>
              <dt data-edit="prices.term2" data-edit-max="28">Late pick-up</dt>
              <dd data-edit="prices.body2" data-edit-max="200" data-edit-multiline>&#163;5 for each started quarter hour after ten past six. We would rather you rang.</dd>
            </div>
            <div>
              <dt data-edit="prices.term3" data-edit-max="28">Cancelling</dt>
              <dd data-edit="prices.body3" data-edit-max="200" data-edit-multiline>A session cancelled by nine that morning is credited. After that it is charged.</dd>
            </div>
          </dl>
        </section>

        {/* -------------------------------------------------------- SIGNUP */}
        <section id="signup" className={s.section} aria-labelledby="signup-h">
          <div className={s.sectionHead}>
            <h2 data-edit="signup.title" data-edit-max="60" id="signup-h">How to sign up</h2>
          </div>
          <ol className={s.steps}>
            {SIGNUP.map((step, i) => (
              <li key={step.n}>
                <span data-edit={`signup.stepN.${i}`} data-edit-max="60" className={s.stepN}>{step.n}</span>
                <h3 data-edit={`signup.title2.${i}`} data-edit-max="40">{step.title}</h3>
                <p data-edit={`signup.body.${i}`} data-edit-max="240" data-edit-multiline>{step.body}</p>
              </li>
            ))}
          </ol>
          <div className={s.signupActions}>
            <a data-edit="signup.buttonPink" data-edit-max="28" className={s.buttonPink} href="mailto:hello@bonbonclub.example">
              Ask for the form
            </a>
            <p data-edit="signup.signupNote" data-edit-max="240" data-edit-multiline className={s.signupNote}>
              Places for the autumn term are open now. Twenty-four a day, and
              Tuesdays fill first.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------- VENUE */}
        <section id="venue" className={s.section} aria-labelledby="venue-h">
          <div className={s.venueGrid}>
            <div className={s.venueCard}>
              <h2 data-edit="venue.title" data-edit-max="60" id="venue-h">St Aldhelm's Church Hall</h2>
              <p data-edit="venue.venueLede" data-edit-max="240" data-edit-multiline className={s.venueLede}>
                The big brick hall with the blue doors, two minutes from Elm
                Grove Primary and on the 22 bus. Step-free at the side door,
                an adapted toilet, and a yard with a gate that locks.
              </p>
            </div>
            <dl className={s.contact}>
              <div>
                <dt data-edit="venue.term" data-edit-max="28">Address</dt>
                <dd data-edit="venue.body3" data-edit-max="200" data-edit-multiline>
                  14 Elm Grove
                  <br />
                  Brighton BN2 3DE
                </dd>
              </div>
              <div>
                <dt data-edit="venue.term2" data-edit-max="28">Email</dt>
                <dd>
                  <a data-edit="venue.link" data-edit-max="28" href="mailto:hello@bonbonclub.example">hello@bonbonclub.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="venue.term3" data-edit-max="28">Phone</dt>
                <dd data-edit="venue.body" data-edit-max="200" data-edit-multiline>01273 000 000</dd>
              </div>
              <div>
                <dt data-edit="venue.term4" data-edit-max="28">Open</dt>
                <dd data-edit="venue.body2" data-edit-max="200" data-edit-multiline>Mon to Fri, 3:00 to 6:00, term time</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      {/* A coda: shatter again, smaller, with nothing to read. The last thing
          before the footer is the confetti itself. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,2,3,5,1" className={s.codaField} aria-hidden="true">
          <TabbiedPattern
            pattern={shatter}
            palette={['transparent', YELLOW, PINK, MINT, VIOLET, INK]}
            fit="grid"
            cellSize={96}
            redrawInterval={4800}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Bonbon Club</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              An after-school club at St Aldhelm's Church Hall, Brighton, since
              2019. Three till six, every school day.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>The club</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.clubs" data-edit-max="28" href="#clubs">Six clubs</a>
              </li>
              <li>
                <a data-edit="footer.week" data-edit-max="28" href="#week">The week</a>
              </li>
              <li>
                <a data-edit="footer.snacks" data-edit-max="28" href="#snacks">Snack</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Booking</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.prices" data-edit-max="28" href="#prices">Prices</a>
              </li>
              <li>
                <a data-edit="footer.signup" data-edit-max="28" href="#signup">How to sign up</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              14 Elm Grove
              <br />
              Brighton BN2 3DE
              <br />
              hello@bonbonclub.example
              <br />
              01273 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional after-school club. Prices, times and people are invented.</p>
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
