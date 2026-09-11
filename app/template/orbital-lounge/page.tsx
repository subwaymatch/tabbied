import { TabbiedPattern } from 'tabbied/react';
import { bloks, disque, odessa } from 'tabbied/patterns';
import s from './orbital-lounge.module.css';

export const metadata = {
  title: 'Orbital: Listening bar, Lisbon',
  description:
    'Orbital is a listening bar in Cais do Sodre, Lisbon. Forty-eight seats, no standing, horn speakers built in Porto, a selector every night and a short menu.',
};

/* Cream, indigo, one orange and one teal. Every field takes `transparent` in
   the background slot so the pattern is drawn straight onto the cream of the
   page: the record, not the sleeve. */
const INK = '#1D1B2B';
const ORANGE = '#FF6B2C';
const TEAL = '#0FA3B1';
const GREY = '#8B8478';
/* The tiles pin their doodle to a whole multiple of the cell (9 x 72px) and
   let the round plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;

const NAV = [
  ['Room', '#room'],
  ['Sound', '#sound'],
  ['Programme', '#programme'],
  ['Menu', '#menu'],
  ['Membership', '#membership'],
  ['Hours', '#hours'],
];

const BADGES = [
  ['48', 'seats'],
  ['0', 'standing'],
  ['84', 'm² of room'],
  ['3', 'rings of chairs'],
];

type Ring = {
  name: string;
  seats: string;
  where: string;
  body: string;
};

const RINGS: Ring[] = [
  {
    name: 'The counter',
    seats: '12 seats',
    where: 'At the console',
    body: 'Stools with backs, the selector at arm\'s length, and a rule about talking that is enforced by everyone else at the counter before we get there.',
  },
  {
    name: 'Ring one',
    seats: '20 seats',
    where: '3.2 m from the horns',
    body: 'The sweet spot. Low chairs, low tables, and the place the system was tuned from. Booked first, every night.',
  },
  {
    name: 'Ring two',
    seats: '16 seats',
    where: 'The back wall',
    body: 'Deeper chairs and a little more of the room in the sound. The right place to talk at a murmur, and the wrong place to shout for a waiter.',
  },
];

type Component = {
  part: string;
  model: string;
  note: string;
};

const SYSTEM: Component[] = [
  { part: 'Turntables', model: 'Kestrel TD-9, two, direct drive', note: 'Rebuilt in 2020 with new bearings and a felt mat from a hatter in Alfama' },
  { part: 'Cartridges', model: 'Harada MC-3, moving coil', note: 'Replaced every 800 hours; the hours are logged in a book by the console' },
  { part: 'Phono stage', model: 'Lumen PH-2, valve', note: 'Hand wired, and warmed up for twenty minutes before the door opens' },
  { part: 'Preamplifier', model: 'Vantage Line One', note: 'One input at a time, switched by hand, no remote' },
  { part: 'Power amplifiers', model: 'Corvid A30, two monoblocks', note: 'Class A, thirty watts a side, which in this room is thirty too many' },
  { part: 'Horns', model: 'Alabaster H-6, two-way, 1.2 m mouth', note: 'Built in Porto to a drawing from 1958 and painted the orange you can see from the street' },
  { part: 'Bass', model: 'Alabaster LF-15, two', note: 'Under the counter. Felt rather than heard, most nights' },
  { part: 'Crossover', model: 'Vantage X-3, active', note: 'Set by ear in 2022 and not touched since; the room has not moved' },
  { part: 'Tape', model: 'Selva R-77, reel to reel', note: 'For the sixty tapes we own and nothing else' },
];

type Night = {
  day: string;
  name: string;
  selector: string;
  from: string;
  body: string;
};

const PROGRAMME: Night[] = [
  { day: 'Tue', name: 'Slow Tuesday', selector: 'Inês Carvalho', from: 'From 19:00', body: 'Ambient, minimalism, long pieces. The record plays to the end, whatever the end is.' },
  { day: 'Wed', name: 'Jazz on wax', selector: 'Rui Matos', from: 'From 19:00', body: 'Hard bop to spiritual, original pressings, sleeves out on the counter for anyone who asks.' },
  { day: 'Thu', name: 'The Brazilian shelf', selector: 'Marta Sequeira', from: 'From 20:00', body: 'Tropicália, bossa, MPB, and whatever arrived in the post from São Paulo this month.' },
  { day: 'Fri', name: 'Long players', selector: 'A guest', from: 'From 20:00', body: 'One person, one crate, three hours. Announced on the Monday before, on the door and nowhere else.' },
  { day: 'Sat', name: 'Dub and dubplates', selector: 'Tiago Lourenço', from: 'From 21:00', body: 'The bass night. The horns come down a notch and the LF-15s do not.' },
  { day: 'Sun', name: 'Sunday hush', selector: 'The house', from: 'From 17:00', body: 'Soul, folk, whatever the staff want to hear. Closes early and everybody is glad of it.' },
];

const VIEWS = [
  ['The console', 'Two decks, one lamp, the log book'],
  ['Ring one', 'Twenty chairs at 3.2 metres'],
  ['The horns', 'Orange, from Porto, 1.2 metres across'],
];

type Item = {
  name: string;
  price: string;
  note: string;
};

const DRINKS: Item[] = [
  { name: 'Vinho verde, glass', price: '5', note: 'Minho, whatever the grocer has this week' },
  { name: 'House negroni', price: '9', note: 'Made in a batch on Tuesday and left alone' },
  { name: 'Ginjinha', price: '4', note: 'With the cherry, from a bottle with no label' },
  { name: 'Draught lager', price: '4', note: 'Cold, small, and nothing else to say about it' },
  { name: 'Whisky highball', price: '8', note: 'Tall, one ice sphere, soda from a siphon' },
  { name: 'Tonic, alone', price: '3', note: 'The most ordered thing on a Tuesday' },
  { name: 'Filter coffee', price: '2.50', note: 'Until 21:00, after that you are on your own' },
];

const PLATES: Item[] = [
  { name: 'Olives and lupini', price: '4', note: 'Salt, a bay leaf, a small bowl' },
  { name: 'Sardines with bread', price: '8', note: 'From a tin we chose carefully, on bread we did not bake' },
  { name: 'Bread with chouriço', price: '6', note: 'Warm, from the oven under the tape machine' },
  { name: 'Sheep cheese', price: '9', note: 'From the Serra, with a spoon, with quince' },
  { name: 'Salted almonds', price: '4', note: 'Roasted Wednesday, gone by Saturday' },
  { name: 'Pastel de nata', price: '2.50', note: 'From the bakery on the corner, twice a night' },
];

type Tier = {
  name: string;
  price: string;
  unit: string;
  body: string;
  perks: string[];
};

const TIERS: Tier[] = [
  {
    name: 'A seat',
    price: 'Free',
    unit: 'with a deposit',
    body: 'Book a chair up to 48 hours ahead. The six euro deposit comes off your first drink, and it is gone if you are not in the chair by half past.',
    perks: ['Any night, any ring, subject to space', 'Two seats per booking', 'No deposit on Sundays'],
  },
  {
    name: 'Órbita',
    price: '90',
    unit: 'euros a year',
    body: 'A membership for people who come more than once a fortnight, which is about two hundred of you.',
    perks: ['A seat held on two nights a week without booking', 'Ten percent off the bar', 'First call on guest nights', 'Your name on the wall by the tape machine'],
  },
];

const HOURS = [
  ['Tuesday to Thursday', '18:00 to 01:00'],
  ['Friday and Saturday', '18:00 to 02:00'],
  ['Sunday', '17:00 to 23:00'],
  ['Monday', 'Closed; the stylus is checked and the floor is done'],
];

const FIND = [
  ['Address', 'Rua da Moeda 21, Cais do Sodré, 1200-275 Lisboa'],
  ['Metro', 'Cais do Sodré, green line, four minutes on foot'],
  ['Train', 'Cascais line, same station, last train 01:30'],
  ['The door', 'The teal one with no sign. Ring once and wait'],
];

export default function OrbitalPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#fff4e3',
        '--ink': '#1d1b2b',
        '--orange': '#ff6b2c',
        '--teal': '#0fa3b1',
        '--grey': '#8b8478',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,orange,teal,grey"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Righteous&family=Outfit:wght@300..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Orbital
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a data-edit="bar.barCta" data-edit-max="28" className={s.barCta} href="#membership">
          Book a seat
        </a>
      </header>

      <main id="top">
        {/* ----------------------------------------------------------- HERO
            The disc behind everything, washed back where the headline sits
            and clear at the edges. Four round badges at the foot. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,2,1" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={disque}
              palette={['transparent', TEAL, ORANGE, INK]}
              fit="grid"
              cellSize={144}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Listening bar / Cais do Sodré / since 2021</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle} id="hero-h">
              Sit down.
              <br />
              <em>Listen.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Forty-eight chairs in three rings around a pair of horn speakers
              and two turntables. A different selector every night, a bar that
              runs at a murmur, and no standing, ever.
            </p>
            <p className={s.heroCta}>
              <a data-edit="hero.pill" data-edit-max="28" className={s.pill} href="#programme">
                This week
              </a>
              <a data-edit="hero.pillGhost" data-edit-max="28" className={s.pillGhost} href="#sound">
                The system
              </a>
            </p>
          </div>
          <dl className={s.badges}>
            {BADGES.map(([v, k], i) => (
              <div key={k}>
                <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ----------------------------------------------------------- ROOM */}
        <section id="room" className={s.panel} aria-labelledby="room-h">
          <div className={s.panelHead}>
            <p data-edit="room.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The room</p>
            <h2 data-edit="room.h2" data-edit-max="60" className={s.h2} id="room-h">Three rings, one sweet spot</h2>
            <p data-edit="room.panelNote" data-edit-max="240" data-edit-multiline className={s.panelNote}>
              Eighty-four square metres under a five-metre ceiling, with the
              chairs in arcs around the console. Capacity is forty-eight and
              there is no standing, because standing people talk.
            </p>
          </div>
          <ol className={s.rings}>
            {RINGS.map((r, i) => (
              <li key={r.name}>
                <span className={s.ringOrbit} aria-hidden="true" />
                <h3 data-edit={`room.title.${i}`} data-edit-max="40">{r.name}</h3>
                <p data-edit={`room.ringSeats.${i}`} data-edit-max="240" data-edit-multiline className={s.ringSeats}>{r.seats}</p>
                <p data-edit={`room.ringWhere.${i}`} data-edit-max="240" data-edit-multiline className={s.ringWhere}>{r.where}</p>
                <p data-edit={`room.ringBody.${i}`} data-edit-max="240" data-edit-multiline className={s.ringBody}>{r.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- SOUND */}
        <section id="sound" className={s.panelDark} aria-labelledby="sound-h">
          <div className={s.panelHead}>
            <p data-edit="sound.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The system</p>
            <h2 data-edit="sound.h2" data-edit-max="60" className={s.h2} id="sound-h">Nine parts</h2>
            <p data-edit="sound.panelNote" data-edit-max="240" data-edit-multiline className={s.panelNote}>
              Nothing here is new and nothing is for sale. The list is on the
              wall by the door in the same order.
            </p>
          </div>
          <ol className={s.system}>
            {SYSTEM.map((c, i) => (
              <li key={c.part}>
                <span data-edit={`sound.sysPart.${i}`} data-edit-max="60" className={s.sysPart}>{c.part}</span>
                <span data-edit={`sound.sysModel.${i}`} data-edit-max="60" className={s.sysModel}>{c.model}</span>
                <span data-edit={`sound.sysNote.${i}`} data-edit-max="60" className={s.sysNote}>{c.note}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ PROGRAMME */}
        <section id="programme" className={s.panel} aria-labelledby="programme-h">
          <div className={s.panelHead}>
            <p data-edit="programme.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The week</p>
            <h2 data-edit="programme.h2" data-edit-max="60" className={s.h2} id="programme-h">Six nights, six selectors</h2>
            <p data-edit="programme.panelNote" data-edit-max="240" data-edit-multiline className={s.panelNote}>
              Closed Mondays. Doors at six, music from the hour shown, last
              record at closing minus the length of the record.
            </p>
          </div>
          <ol className={s.week}>
            {PROGRAMME.map((n, i) => (
              <li key={n.day}>
                <span data-edit={`programme.dayBadge.${i}`} data-edit-max="60" className={s.dayBadge}>{n.day}</span>
                <div className={s.nightBody}>
                  <h3 data-edit={`programme.title.${i}`} data-edit-max="40">{n.name}</h3>
                  <p data-edit={`programme.nightSelector.${i}`} data-edit-max="240" data-edit-multiline className={s.nightSelector}>{n.selector}</p>
                  <p data-edit={`programme.nightFrom.${i}`} data-edit-max="240" data-edit-multiline className={s.nightFrom}>{n.from}</p>
                  <p data-edit={`programme.nightText.${i}`} data-edit-max="240" data-edit-multiline className={s.nightText}>{n.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- VIEWS
            Three round plates, patterns standing in for photographs. */}
        <section className={s.views} aria-labelledby="views-h">
          <h2 data-edit="views.srOnly" data-edit-max="60" className={s.srOnly} id="views-h">Three views of the room</h2>
          <ul className={s.viewGrid}>
            {VIEWS.map(([title, caption], i) => (
              <li key={title}>
                <div data-edit-pattern={`views.field.${i}`} data-edit-roles="transparent,3,2,1" className={s.viewPlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={bloks}
                    palette={['transparent', TEAL, ORANGE, INK]}
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
                <h3 data-edit={`views.title.${i}`} data-edit-max="40">{title}</h3>
                <p data-edit={`views.viewCaption.${i}`} data-edit-max="240" data-edit-multiline className={s.viewCaption}>{caption}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------------------------------------- MENU */}
        <section id="menu" className={s.panel} aria-labelledby="menu-h">
          <div className={s.panelHead}>
            <p data-edit="menu.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The bar</p>
            <h2 data-edit="menu.h2" data-edit-max="60" className={s.h2} id="menu-h">Short on purpose</h2>
            <p data-edit="menu.panelNote" data-edit-max="240" data-edit-multiline className={s.panelNote}>
              Prices in euros. Nothing is shaken, nothing has more than three
              things in it, and the kitchen is a toaster and an oven.
            </p>
          </div>
          <div className={s.menuGrid}>
            <div className={s.menuCol}>
              <h3 data-edit="menu.menuHead" data-edit-max="40" className={s.menuHead}>Drinks</h3>
              <ul className={s.menuList}>
                {DRINKS.map((d, i) => (
                  <li key={d.name}>
                    <span data-edit={`menu.itemName.${i}`} data-edit-max="60" className={s.itemName}>{d.name}</span>
                    <span data-edit={`menu.itemPrice.${i}`} data-edit-max="60" className={s.itemPrice}>{d.price}</span>
                    <span data-edit={`menu.itemNote.${i}`} data-edit-max="60" className={s.itemNote}>{d.note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.menuCol}>
              <h3 data-edit="menu.menuHead2" data-edit-max="40" className={s.menuHead}>Small plates</h3>
              <ul className={s.menuList}>
                {PLATES.map((p, i) => (
                  <li key={p.name}>
                    <span data-edit={`menu.itemName2.${i}`} data-edit-max="60" className={s.itemName}>{p.name}</span>
                    <span data-edit={`menu.itemPrice2.${i}`} data-edit-max="60" className={s.itemPrice}>{p.price}</span>
                    <span data-edit={`menu.itemNote2.${i}`} data-edit-max="60" className={s.itemNote}>{p.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- MEMBERSHIP */}
        <section id="membership" className={s.panel} aria-labelledby="membership-h">
          <div className={s.panelHead}>
            <p data-edit="membership.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Seats and members</p>
            <h2 data-edit="membership.h2" data-edit-max="60" className={s.h2} id="membership-h">Two ways in</h2>
          </div>
          <ul className={s.tiers}>
            {TIERS.map((t, i) => (
              <li key={t.name}>
                <h3 data-edit={`membership.title.${i}`} data-edit-max="40">{t.name}</h3>
                <p data-edit={`membership.tierPrice.${i}`} data-edit-max="240" data-edit-multiline className={s.tierPrice}>{t.price}</p>
                <p data-edit={`membership.tierUnit.${i}`} data-edit-max="240" data-edit-multiline className={s.tierUnit}>{t.unit}</p>
                <p data-edit={`membership.tierBody.${i}`} data-edit-max="240" data-edit-multiline className={s.tierBody}>{t.body}</p>
                <ul className={s.perks}>
                  {t.perks.map((perk, j) => (
                    <li data-edit={`membership.item.${i}.${j}`} data-edit-max="80" key={`${i}-${j}`}>{perk}</li>
                  ))}
                </ul>
                <p className={s.tierCta}>
                  <a data-edit={`membership.pill.${i}`} data-edit-max="28" className={s.pill} href="mailto:seats@orbital.example">
                    Write to us
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------- HOURS */}
        <section id="hours" className={s.panelDark} aria-labelledby="hours-h">
          <div className={s.panelHead}>
            <p data-edit="hours.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Hours and the door</p>
            <h2 data-edit="hours.h2" data-edit-max="60" className={s.h2} id="hours-h">Rua da Moeda 21</h2>
            <p data-edit="hours.panelNote" data-edit-max="240" data-edit-multiline className={s.panelNote}>
              A former ship chandler's, two rooms knocked into one in 2021. The
              front is a bar, the back is the room, and the horns face the
              back.
            </p>
          </div>
          <div className={s.hoursGrid}>
            <dl className={s.hoursList}>
              {HOURS.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`hours.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`hours.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
            <dl className={s.findList}>
              {FIND.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`hours.term2.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`hours.body2.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      {/* The coda band: odessa at full strength across the whole width, the
          last thing before the footer and the loudest thing on the page. */}
      <section className={s.band} aria-hidden="true">
        <div data-edit-pattern="band.field" data-edit-roles="transparent,2,3,1" className={s.bandField}>
          <TabbiedPattern
            pattern={odessa}
            palette={['transparent', ORANGE, TEAL, INK]}
            fit="grid"
            cellSize={120}
            redrawInterval={4600}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Orbital</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              A listening bar in Cais do Sodré, Lisbon. Forty-eight seats, no
              standing, since 2021.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>The room</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.room" data-edit-max="28" href="#room">Three rings</a>
              </li>
              <li>
                <a data-edit="footer.sound" data-edit-max="28" href="#sound">The system</a>
              </li>
              <li>
                <a data-edit="footer.programme" data-edit-max="28" href="#programme">This week</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Coming</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.membership" data-edit-max="28" href="#membership">Book a seat</a>
              </li>
              <li>
                <a data-edit="footer.membership2" data-edit-max="28" href="#membership">Órbita membership</a>
              </li>
              <li>
                <a data-edit="footer.hours" data-edit-max="28" href="#hours">Hours</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Here</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Rua da Moeda 21
              <br />
              1200-275 Lisboa
              <br />
              seats@orbital.example
              <br />
              +351 21 000 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional bar. Prices, hours and the equipment are invented.</p>
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
