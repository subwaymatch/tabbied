import { TabbiedPattern } from 'tabbied/react';
import { bracket, casing, gorge } from 'tabbied/patterns';
import s from './betonpark.module.css';

export const metadata = {
  title: 'Betonpark: Indoor skatepark, Rotterdam',
  description:
    'Betonpark is an indoor skatepark in a former warehouse on the Maashaven, Rotterdam. Mini ramp, vert wall, street plaza and a bowl, open seven days, day passes from nine euros.',
};

/* Site colours. Every field takes `transparent` in the background slot so the
   pattern is drawn straight onto the chalk of the page rather than onto a
   plate of its own. The green is the one accent and it is a safety green:
   the colour of the tape on the coping. */
const INK = '#0B0B0B';
const GREEN = '#2BD32B';
const GREY = '#7A7A76';
const PALE = '#D2D2CC';

const NAV = [
  ['Hours', '#hours'],
  ['Park', '#park'],
  ['Sessions', '#sessions'],
  ['Prices', '#prices'],
  ['Rules', '#rules'],
  ['FAQ', '#faq'],
  ['Find us', '#findus'],
];

const FACTS = [
  ['2 400', 'm² of floor'],
  ['4', 'zones'],
  ['7', 'days a week'],
  ['1', 'former warehouse'],
];

type Day = {
  day: string;
  short: string;
  open: string;
  close: string;
  note: string;
};

const HOURS: Day[] = [
  { day: 'Monday', short: 'MON', open: '14:00', close: '22:00', note: '' },
  { day: 'Tuesday', short: 'TUE', open: '14:00', close: '22:00', note: 'WNB night from 19:00' },
  { day: 'Wednesday', short: 'WED', open: '12:00', close: '22:00', note: 'Wheels until 15:00' },
  { day: 'Thursday', short: 'THU', open: '14:00', close: '22:00', note: 'Over 30s from 20:00' },
  { day: 'Friday', short: 'FRI', open: '14:00', close: '23:00', note: 'Late session' },
  { day: 'Saturday', short: 'SAT', open: '10:00', close: '23:00', note: 'Beginners 10 to 12' },
  { day: 'Sunday', short: 'SUN', open: '10:00', close: '20:00', note: 'Under 12s 10 to 12' },
];

type Ramp = {
  no: string;
  name: string;
  size: string;
  surface: string;
  body: string;
};

const RAMPS: Ramp[] = [
  {
    no: '01',
    name: 'Mini ramp',
    size: '1.4 m high, 6 m wide, 2.4 m radius',
    surface: 'Skatelite over birch ply, steel coping',
    body: 'The first thing you see and the last thing you leave. Two decks, one extension to 1.8 m on the far side, and a spine into the second mini for anyone who wants to try it.',
  },
  {
    no: '02',
    name: 'Vert wall',
    size: '3.6 m to coping, 0.6 m of vert, 12 m wide',
    surface: 'Skatelite, pool coping on the left third',
    body: 'Built from the drawings of a ramp in Malmö and then argued about for a month. The transition is 2.9 m. It is the only vert inside the ring road and it stays that way.',
  },
  {
    no: '03',
    name: 'Street plaza',
    size: '900 m², ledges at 350 and 450 mm, 8 stair, 6 m flat rail',
    surface: 'Polished concrete, granite ledges',
    body: 'A hubba on the stair, two manual pads, an A-frame and a euro gap of 1.6 m. Everything is real stone and real steel, waxed by us and not by you.',
  },
  {
    no: '04',
    name: 'Bowl',
    size: 'Kidney, 1.6 m shallow to 2.7 m deep, 14 m long',
    surface: 'Shotcrete, hand finished, pool coping and tile',
    body: 'Poured in place over three weeks in the winter of 2021 by a crew of five who had built two before. There is a hip into the deep end and a love seat on the corner.',
  },
];

type Session = {
  name: string;
  when: string;
  who: string;
  body: string;
};

const SESSIONS: Session[] = [
  {
    name: 'Beginners',
    when: 'Saturday 10:00 to 12:00',
    who: 'Any age, any board',
    body: 'Two coaches, boards and pads to borrow, and the mini ramp closed to everyone else. Book a place; twelve per session.',
  },
  {
    name: 'Women and non-binary night',
    when: 'Tuesday 19:00 to 22:00',
    who: 'The whole park',
    body: 'Half price on the door, a coach on the plaza until 20:30, and the music chosen by whoever turns up first.',
  },
  {
    name: 'Over 30s',
    when: 'Thursday 20:00 to 22:00',
    who: 'Bring ID, we will check',
    body: 'The lights go down a notch, nobody films, and the mini ramp has a queue that respects the fact that you have work tomorrow.',
  },
  {
    name: 'Under 12s',
    when: 'Sunday 10:00 to 12:00',
    who: 'With an adult in the building',
    body: 'Helmets on, no exceptions, and the vert wall is closed. Parents are welcome on the deck and not on the ramp.',
  },
  {
    name: 'Wheels',
    when: 'Wednesday 12:00 to 15:00',
    who: 'BMX, scooters, quads',
    body: 'The only session with bikes in the building. Pegs come off for the coping and the bowl stays skate only.',
  },
];

type Price = {
  name: string;
  price: string;
  unit: string;
  note: string;
};

const PRICES: Price[] = [
  { name: 'Day', price: '9', unit: 'euros', note: 'In and out all day, any zone' },
  { name: 'Evening', price: '6', unit: 'euros', note: 'Entry after 19:00' },
  { name: 'Month', price: '49', unit: 'euros', note: 'Thirty days from the first visit' },
  { name: 'Year', price: '390', unit: 'euros', note: 'Twelve months, and a locker' },
];

const EXTRAS = [
  ['Board hire', '5 euros, plus a deposit we give back'],
  ['Helmet', 'Free, and compulsory under 16'],
  ['Spectators', 'Free, on the deck and off the ramps'],
  ['Locker', '1 euro coin, returned'],
  ['Coaching', '25 euros an hour, book a week ahead'],
];

const RULES = [
  'Helmets under 16. No helmet, no session, no argument.',
  'Drop in from the deck, not from the coping, and not from the extension until you can make the first one.',
  'Wax is ours. Bring your own and we will take it off you and the ledge.',
  'One rider on the vert wall at a time. Call it and then go.',
  'No bikes anywhere except Wednesday, and never in the bowl.',
  'Phones stay in your pocket on the ramp. Falling is fine. Filming while falling is not.',
  'Street grit stays outside. Wipe your wheels on the mat by the door.',
  'If in doubt, ask whoever is wearing the green.',
];

const FAQ = [
  {
    q: 'Do I need to book?',
    a: 'Not for a day pass. Beginners and Under 12s are booked because the coaches count heads; everything else is walk in.',
  },
  {
    q: 'Can I come and just watch?',
    a: 'Yes, free, from the deck or the cafe bench. The bowl is the best seat in the house and the vert wall is the loudest.',
  },
  {
    q: 'What if I have never stood on a board?',
    a: 'Saturday at ten. We have boards in three sizes, pads in every size, and coaches who remember what the first hour felt like.',
  },
  {
    q: 'Is there somewhere to leave a bag?',
    a: 'Sixty lockers by the door, a euro coin in, a euro coin out. Do not leave it on the deck; it will get skated.',
  },
  {
    q: 'How wet does the plaza get in winter?',
    a: 'It does not. The roof was redone in 2020 and the floor has heating pipes under it, which is the single most expensive thing in the building.',
  },
  {
    q: 'Can I hire the park?',
    a: 'Mornings before opening and all day on public holidays. Write to us with a date and a number of people.',
  },
];

const FIND = [
  ['Address', 'Loods 7, Maashaven Oostzijde 230, 3072 HS Rotterdam'],
  ['Tram', '2, 20 and 25 to Maashaven, then four minutes on foot along the quay'],
  ['Metro', 'Maashaven on lines D and E, exit towards the water'],
  ['Bike', 'Racks for 120 bikes under the canopy, free, lit'],
  ['Car', 'Pay parking on the quay, 2 euros an hour, cheaper than the fine'],
  ['The door', 'The green one, under the crane'],
];

export default function BetonparkPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#ededea',
        '--ink': '#0b0b0b',
        '--green': '#2bd32b',
        '--grey': '#7a7a76',
        '--pale': '#d2d2cc',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,green,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
      />

      {/* ------------------------------------------------------------ BAR
          A hard black strip, nothing translucent about it. */}
      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Betonpark
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Rotterdam Zuid</span>
      </header>

      <main id="top">
        {/* ----------------------------------------------------------- HERO
            The pattern at full strength behind a headline that takes the
            width of the viewport. The lede sits on a paper plate so it reads. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,1,2,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={bracket}
              palette={['transparent', INK, GREEN, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Indoor skatepark / Maashaven / since 2017</p>
          <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle} id="hero-h">
            Skate
            <br />
            <em>indoors.</em>
          </h1>
          <div className={s.heroPlate}>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Two thousand four hundred square metres of concrete, ply and
              Skatelite in a former grain warehouse on the south bank. A mini
              ramp, a vert wall, a street plaza and a bowl. Open seven days,
              heated in winter, nine euros on the door.
            </p>
            <dl className={s.facts}>
              {FACTS.map(([v, k], i) => (
                <div key={k}>
                  <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                  <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------------- HOURS
            Seven slabs in a row, one per day. */}
        <section id="hours" className={s.hours} aria-labelledby="hours-h">
          <div className={s.secHead}>
            <span data-edit="hours.secNo" data-edit-max="60" className={s.secNo}>01</span>
            <h2 data-edit="hours.title" data-edit-max="60" id="hours-h">Open seven days</h2>
            <p data-edit="hours.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Last entry an hour before close. School holidays open at 10:00
              every day. Closed on 1 January and on the day the roof leaks.
            </p>
          </div>
          <ol className={s.week}>
            {HOURS.map((d, i) => (
              <li key={d.short}>
                <span data-edit={`hours.dayShort.${i}`} data-edit-max="60" className={s.dayShort}>{d.short}</span>
                <span data-edit={`hours.dayName.${i}`} data-edit-max="60" className={s.dayName}>{d.day}</span>
                <span data-edit={`hours.dayOpen.${i}`} data-edit-max="60" className={s.dayOpen}>{d.open}</span>
                <span data-edit={`hours.dayClose.${i}`} data-edit-max="60" className={s.dayClose}>{d.close}</span>
                <span data-edit={`hours.dayNote.${i}`} data-edit-max="60" className={s.dayNote}>{d.note}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- BAND
            Pure pattern, full width, the loudest thing on the page. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,1,2,4" className={s.bandField}>
            <TabbiedPattern
              pattern={casing}
              palette={['transparent', INK, GREEN, PALE]}
              fit="grid"
              cellSize={144}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ----------------------------------------------------------- PARK */}
        <section id="park" className={s.park} aria-labelledby="park-h">
          <div className={s.secHead}>
            <span data-edit="park.secNo" data-edit-max="60" className={s.secNo}>02</span>
            <h2 data-edit="park.title" data-edit-max="60" id="park-h">Four zones</h2>
            <p data-edit="park.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Sizes are measured, not rounded. The drawings are on the wall by
              the cafe if you want to argue with them.
            </p>
          </div>
          <ol className={s.ramps}>
            {RAMPS.map((r, i) => (
              <li key={r.no}>
                <span data-edit={`park.rampNo.${i}`} data-edit-max="60" className={s.rampNo}>{r.no}</span>
                <div className={s.rampBody}>
                  <h3 data-edit={`park.title2.${i}`} data-edit-max="40">{r.name}</h3>
                  <p data-edit={`park.rampSize.${i}`} data-edit-max="240" data-edit-multiline className={s.rampSize}>{r.size}</p>
                  <p data-edit={`park.rampSurface.${i}`} data-edit-max="240" data-edit-multiline className={s.rampSurface}>{r.surface}</p>
                  <p data-edit={`park.rampText.${i}`} data-edit-max="240" data-edit-multiline className={s.rampText}>{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- SESSIONS
            A pale slab. */}
        <section id="sessions" className={s.sessions} aria-labelledby="sessions-h">
          <div className={s.secHead}>
            <span data-edit="sessions.secNo" data-edit-max="60" className={s.secNo}>03</span>
            <h2 data-edit="sessions.title" data-edit-max="60" id="sessions-h">Weekly sessions</h2>
            <p data-edit="sessions.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              The park is open to everyone outside these hours. During them,
              it is open to the people they are for.
            </p>
          </div>
          <ul className={s.sessionGrid}>
            {SESSIONS.map((x, i) => (
              <li key={x.name}>
                <p data-edit={`sessions.sessWhen.${i}`} data-edit-max="240" data-edit-multiline className={s.sessWhen}>{x.when}</p>
                <h3 data-edit={`sessions.title2.${i}`} data-edit-max="40">{x.name}</h3>
                <p data-edit={`sessions.sessWho.${i}`} data-edit-max="240" data-edit-multiline className={s.sessWho}>{x.who}</p>
                <p data-edit={`sessions.sessBody.${i}`} data-edit-max="240" data-edit-multiline className={s.sessBody}>{x.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------------------- PRICES
            The black slab: paper type, green numbers. */}
        <section id="prices" className={s.prices} aria-labelledby="prices-h">
          <div className={s.secHead}>
            <span data-edit="prices.secNo" data-edit-max="60" className={s.secNo}>04</span>
            <h2 data-edit="prices.title" data-edit-max="60" id="prices-h">Prices</h2>
            <p data-edit="prices.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              No contracts, no direct debits, no joining fee. A month is thirty
              days from the day you first come in.
            </p>
          </div>
          <ul className={s.priceGrid}>
            {PRICES.map((p, i) => (
              <li key={p.name}>
                <span data-edit={`prices.priceName.${i}`} data-edit-max="60" className={s.priceName}>{p.name}</span>
                <span data-edit={`prices.priceValue.${i}`} data-edit-max="60" className={s.priceValue}>{p.price}</span>
                <span data-edit={`prices.priceUnit.${i}`} data-edit-max="60" className={s.priceUnit}>{p.unit}</span>
                <span data-edit={`prices.priceNote.${i}`} data-edit-max="60" className={s.priceNote}>{p.note}</span>
              </li>
            ))}
          </ul>
          <dl className={s.extras}>
            {EXTRAS.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`prices.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`prices.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------------------------------------------------------- RULES
            The quiet field: gorge at low opacity under a paper wash. */}
        <section id="rules" className={s.rules} aria-labelledby="rules-h">
          <div data-edit-pattern="rules.field" data-edit-roles="transparent,3,4" className={s.rulesField} aria-hidden="true">
            <TabbiedPattern
              pattern={gorge}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={96}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.rulesInner}>
            <div className={s.secHead}>
              <span data-edit="rules.secNo" data-edit-max="60" className={s.secNo}>05</span>
              <h2 data-edit="rules.title" data-edit-max="60" id="rules-h">House rules</h2>
              <p data-edit="rules.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
                Eight of them. They are painted on the wall by the door at a
                size you cannot claim to have missed.
              </p>
            </div>
            <ol className={s.ruleList}>
              {RULES.map((r, i) => (
                <li data-edit={`rules.item.${i}`} data-edit-max="80" key={r}>{r}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <div className={s.secHead}>
            <span data-edit="faq.secNo" data-edit-max="60" className={s.secNo}>06</span>
            <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Questions</h2>
            <p data-edit="faq.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              The six we get most, answered once.
            </p>
          </div>
          <dl className={s.faqList}>
            {FAQ.map((x, i) => (
              <div key={x.q}>
                <dt data-edit={`faq.term.${i}`} data-edit-max="28">{x.q}</dt>
                <dd data-edit={`faq.body.${i}`} data-edit-max="200" data-edit-multiline>{x.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* -------------------------------------------------------- FIND US */}
        <section id="findus" className={s.find} aria-labelledby="find-h">
          <div className={s.secHead}>
            <span data-edit="findus.secNo" data-edit-max="60" className={s.secNo}>07</span>
            <h2 data-edit="findus.title" data-edit-max="60" id="find-h">Loods 7</h2>
            <p data-edit="findus.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              A grain warehouse from 1928, empty from 1994, ours since 2017.
              The crane on the quay still works and is not for climbing.
            </p>
          </div>
          <dl className={s.findList}>
            {FIND.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`findus.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`findus.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={s.findCta}>
            <a data-edit="findus.button" data-edit-max="28" className={s.button} href="mailto:desk@betonpark.example">
              Write to the desk
            </a>
          </p>
        </section>
      </main>

      {/* A coda: the pattern at working size, nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,1,2,3" className={s.codaField}>
          <TabbiedPattern
            pattern={gorge}
            palette={['transparent', INK, GREEN, GREY]}
            fit="grid"
            cellSize={112}
            redrawInterval={4800}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Betonpark</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              Indoor skatepark in Loods 7 on the Maashaven, Rotterdam. Open
              seven days since 2017.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Park</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.hours" data-edit-max="28" href="#hours">Opening hours</a>
              </li>
              <li>
                <a data-edit="footer.park" data-edit-max="28" href="#park">Four zones</a>
              </li>
              <li>
                <a data-edit="footer.sessions" data-edit-max="28" href="#sessions">Weekly sessions</a>
              </li>
              <li>
                <a data-edit="footer.rules" data-edit-max="28" href="#rules">House rules</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Desk</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.prices" data-edit-max="28" href="#prices">Prices</a>
              </li>
              <li>
                <a data-edit="footer.faq" data-edit-max="28" href="#faq">Questions</a>
              </li>
              <li>
                <a data-edit="footer.findus" data-edit-max="28" href="#findus">Hire the park</a>
              </li>
              <li>
                <a data-edit="footer.link" data-edit-max="28" href="mailto:desk@betonpark.example">desk@betonpark.example</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Here</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Loods 7
              <br />
              Maashaven Oostzijde 230
              <br />
              3072 HS Rotterdam
              <br />
              +31 10 000 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional skatepark. Prices, hours and measurements are invented.</p>
          <p>
            Patterns by{' '}
            <a data-edit="footer.link2" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground and redrawn on a timer.
          </p>
        </div>
      </footer>
    </div>
  );
}
