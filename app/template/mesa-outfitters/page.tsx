import { TabbiedPattern } from 'tabbied/react';
import { bench, fractal, jerkinhead } from 'tabbied/patterns';
import s from './mesa-outfitters.module.css';

export const metadata = {
  title: 'Mesa Outfitters: Desert trail guides, Moab',
  description:
    'Mesa Outfitters guides day hikes, overnights, canyoneering and a three-day traverse out of Moab, Utah. Five guides, small groups, water carried for you.',
};

/* Sand, brown, terracotta and sky. Every pattern field takes `transparent`
   in the background slot, so it draws straight onto the sand of the page. */
const INK = '#2B1F16';
const TERRACOTTA = '#C75B2A';
const SKY = '#3B8EA5';
const GREY = '#8C7E6E';
const PALE = '#E4D5BE';
/* Tiles pin their doodle to a whole multiple of the cell (6 x 72px) and let
   the plate clip it, so every grid track lands on a whole pixel. */
const TILE_BOX = 432;

const NAV = [
  ['Trips', '#trips'],
  ['Seasons', '#seasons'],
  ['Gear', '#gear'],
  ['Guides', '#guides'],
  ['Safety', '#safety'],
  ['Book', '#book'],
  ['Shop', '#shop'],
];

const FACTS = [
  ['5', 'Guides'],
  ['6', 'People per trip, at most'],
  ['31 mi', 'The long one'],
  ['2009', 'First season'],
];

type Trip = {
  name: string;
  kind: string;
  distance: string;
  climb: string;
  difficulty: string;
  time: string;
  price: string;
  body: string;
};

const TRIPS: Trip[] = [
  {
    name: 'Slickrock and Sand',
    kind: 'Half-day hike',
    distance: '4.2 mi',
    climb: '600 ft',
    difficulty: 'Easy',
    time: '4 hours',
    price: '$95',
    body: 'Fins, potholes and one arch nobody photographs. Leaves the shop at 07:00 in summer and 09:00 the rest of the year. Good with children over eight.',
  },
  {
    name: 'Rim to River',
    kind: 'Day hike',
    distance: '9.6 mi',
    climb: '1,400 ft',
    difficulty: 'Moderate',
    time: '7 hours',
    price: '$145',
    body: 'Down a side canyon to the Colorado, lunch on a sandbar, and back up a route the cattle used. Four litres of water each, carried by us.',
  },
  {
    name: 'Dry Fork Overnight',
    kind: 'Overnight',
    distance: '14 mi',
    climb: '2,100 ft',
    difficulty: 'Moderate',
    time: '2 days',
    price: '$395',
    body: 'Camp under the north wall where the sun leaves at four. Tents, pads, dinner and breakfast are ours; your sleeping bag is yours or rented.',
  },
  {
    name: 'Sandstone Slot',
    kind: 'Canyoneering',
    distance: '3.8 mi',
    climb: '3 rappels, longest 90 ft',
    difficulty: 'Technical',
    time: '6 hours',
    price: '$225',
    body: 'Three rappels, two swims in spring, and a section you walk with your back on one wall and your feet on the other. No experience needed, some nerve is.',
  },
  {
    name: 'The Mesa Traverse',
    kind: 'Three-day traverse',
    distance: '31 mi',
    climb: '4,800 ft',
    difficulty: 'Strenuous',
    time: '3 days',
    price: '$895',
    body: 'Mesa top to river, twice, with a water cache we placed the week before. Two nights out, one of them somewhere with no name on the map.',
  },
];

type Season = {
  name: string;
  months: string;
  temps: string;
  runs: string;
  span: string;
};

const SEASONS: Season[] = [
  {
    name: 'Spring',
    months: 'March to May',
    temps: '55 to 85 F',
    runs: 'Everything runs. The slot has water in it until mid-April, which is the reason to go and the reason to bring a change of clothes.',
    span: 'spanSpring',
  },
  {
    name: 'Summer',
    months: 'June to August',
    temps: '90 to 108 F',
    runs: 'Half-day hikes at dawn and the slot canyon only. No day hikes, no overnights, no traverse. We turn people away in July and mean it kindly.',
    span: 'spanSummer',
  },
  {
    name: 'Autumn',
    months: 'September to November',
    temps: '45 to 85 F',
    runs: 'Everything runs, and the traverse runs best. The light is low, the river is clear, and the shop is quieter by the week.',
    span: 'spanAutumn',
  },
  {
    name: 'Winter',
    months: 'December to February',
    temps: '20 to 50 F',
    runs: 'Rim walks and the half-day hike, with microspikes on the shady side. The slot is closed. The shop is open five days.',
    span: 'spanWinter',
  },
];

const GEAR_OURS = [
  'Water, four litres a person a day, carried by the guide',
  'Lunch, and dinner and breakfast on overnights',
  'Tents, sleeping pads and a stove',
  'Harness, helmet and ropes on the slot canyon',
  'A satellite messenger on every trip',
  'Trekking poles, if you want them',
  'Microspikes in winter',
];

const GEAR_YOURS = [
  'Boots you have walked in before, with ankle support',
  'A sun hat with a brim, not a cap',
  'Long sleeves in a light colour',
  'A daypack of 20 to 30 litres',
  'A sleeping bag rated to 30 F on overnights, or rent ours for $15',
  'Your own snacks, if you are particular',
  'A change of clothes for the slot in spring',
];

type Guide = {
  name: string;
  role: string;
  certs: string;
  seasons: string;
  body: string;
};

const GUIDES: Guide[] = [
  {
    name: 'Ruth Calloway',
    role: 'Owner, lead guide',
    certs: 'Wilderness First Responder, AMGA Single Pitch Instructor',
    seasons: '17 seasons',
    body: 'Grew up on a ranch outside Monticello and has walked the traverse forty-one times. Carries the heaviest pack and says nothing about it.',
  },
  {
    name: 'Diego Marquez',
    role: 'Canyon lead',
    certs: 'ACA Canyon Guide Level 2, Wilderness First Responder',
    seasons: '9 seasons',
    body: 'Rigs every rappel on the slot canyon and checks every harness twice, including his own. Formerly a lift mechanic in Colorado.',
  },
  {
    name: 'Lupe Herrera',
    role: 'Guide, overnights',
    certs: 'Wilderness First Responder, Leave No Trace Master Educator',
    seasons: '6 seasons',
    body: 'Runs the Dry Fork overnight and cooks the dinner everyone writes to us about. Knows where the water is in October.',
  },
];

const SAFETY = [
  'Every trip carries a satellite messenger and a first-aid kit sized for the group, and every guide holds a current Wilderness First Responder.',
  'Above 100 F forecast at noon, day hikes are cancelled the evening before and you are refunded in full or moved to a dawn half-day.',
  'The slot canyon does not run if there is a flash-flood watch on any of the three drainages above it. That call is ours and it is final.',
  'Groups are six at most, and we will split a party of seven rather than take one guide out with seven people.',
  'We walk at the pace of the slowest person and we are honest about that pace at booking. A moderate hike is moderate for a person who walks.',
];

const CANCELLATION = [
  ['14 days or more', 'Full refund, no questions'],
  ['7 to 13 days', 'Half refund, or a full credit for twelve months'],
  ['Under 7 days', 'No refund, unless we can fill your place'],
  ['Weather calls by us', 'Full refund or a new date, your choice'],
  ['You are unwell on the day', 'A credit for twelve months, with a note from you, not a doctor'],
];

const BOOKING = [
  {
    n: '1',
    title: 'Pick a trip and a week',
    body: 'Trips run on set days: half-days daily, day hikes Tuesday to Saturday, the overnight from Friday, the traverse from the first Monday of the month.',
  },
  {
    n: '2',
    title: 'Call or write',
    body: 'We book by phone or email, not by a form, because we want to hear who is coming. Deposits are a third, by card, and the balance is due on the day.',
  },
  {
    n: '3',
    title: 'Meet at the shop',
    body: 'Half an hour before departure, with your boots on. We weigh your pack, fill your bottles, and tell you what the day actually looks like.',
  },
];

const HOURS = [
  ['March to November', '07:00 to 19:00, daily'],
  ['December to February', '09:00 to 17:00, Wednesday to Sunday'],
  ['Telephone', '+1 435 000 0000'],
  ['Email', 'trips@mesaoutfitters.example'],
];

export default function MesaOutfittersPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f7eedf',
        '--ink': '#2b1f16',
        '--terracotta': '#c75b2a',
        '--sky': '#3b8ea5',
        '--grey': '#8c7e6e',
        '--pale': '#e4d5be',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,terracotta,sky,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Rubik:ital,wght@0,300..800;1,300..800&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          <span className={s.markSun} aria-hidden="true" />
          <span data-edit="bar.text" data-edit-max="60">Mesa Outfitters</span>
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <a data-edit="bar.barCta" data-edit-max="28" className={s.barCta} href="#book">Book a trip</a>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,5,2,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={fractal}
              palette={['transparent', PALE, TERRACOTTA, SKY]}
              fit="grid"
              cellSize={132}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <div className={s.heroText}>
              <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Desert trail guides, Moab, Utah</p>
              <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
                Walk the desert with
                <br />
                <em>someone who has.</em>
              </h1>
              <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
                Five guides, groups of six, and the water carried for you.
                Half-days, day hikes, an overnight, a slot canyon, and one
                three-day traverse for people who want the whole thing.
              </p>
              <div className={s.heroActions}>
                <a data-edit="hero.btn" data-edit-max="28" className={s.btn} href="#trips">See the trips</a>
                <a data-edit="hero.btnLine" data-edit-max="28" className={s.btnLine} href="#seasons">What runs when</a>
              </div>
            </div>
            {/* Sun and mesa, in CSS: rays from a conic gradient, a terrace
                cut with clip-path. The one piece of drawn geometry on the page. */}
            <div className={s.sunMesa} aria-hidden="true">
              <span className={s.sun} />
              <span className={s.mesaBack} />
              <span className={s.mesaFront} />
            </div>
          </div>
          <dl className={s.facts}>
            {FACTS.map(([v, k], i) => (
              <div key={k}>
                <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={s.stripes} aria-hidden="true" />

        {/* ----------------------------------------------------------- TRIPS */}
        <section id="trips" className={s.trips} aria-labelledby="trips-h">
          <div className={s.secHead}>
            <h2 data-edit="trips.title" data-edit-max="60" id="trips-h">Five trips</h2>
            <p data-edit="trips.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Distances are round trip. Prices are per person, include the
              permit, and do not include a tip, which the guides would rather
              you decided on at the end.
            </p>
          </div>
          <ul className={s.tripGrid}>
            {TRIPS.map((t, i) => (
              <li key={t.name} className={s.trip}>
                <p data-edit={`trips.tripKind.${i}`} data-edit-max="240" data-edit-multiline className={s.tripKind}>{t.kind}</p>
                <h3 data-edit={`trips.title2.${i}`} data-edit-max="40">{t.name}</h3>
                <dl className={s.tripSpecs}>
                  <div>
                    <dt data-edit={`trips.term.${i}`} data-edit-max="28">Distance</dt>
                    <dd data-edit={`trips.body.${i}`} data-edit-max="200" data-edit-multiline>{t.distance}</dd>
                  </div>
                  <div>
                    <dt data-edit={`trips.term2.${i}`} data-edit-max="28">Climb</dt>
                    <dd data-edit={`trips.body2.${i}`} data-edit-max="200" data-edit-multiline>{t.climb}</dd>
                  </div>
                  <div>
                    <dt data-edit={`trips.term3.${i}`} data-edit-max="28">Grade</dt>
                    <dd data-edit={`trips.body3.${i}`} data-edit-max="200" data-edit-multiline>{t.difficulty}</dd>
                  </div>
                  <div>
                    <dt data-edit={`trips.term4.${i}`} data-edit-max="28">Time</dt>
                    <dd data-edit={`trips.body4.${i}`} data-edit-max="200" data-edit-multiline>{t.time}</dd>
                  </div>
                </dl>
                <p data-edit={`trips.tripBody.${i}`} data-edit-max="240" data-edit-multiline className={s.tripBody}>{t.body}</p>
                <p data-edit={`trips.tripPrice.${i}`} data-edit-max="240" data-edit-multiline className={s.tripPrice}>{t.price}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,2,1,3" className={s.bandField}>
            <TabbiedPattern
              pattern={jerkinhead}
              palette={['transparent', TERRACOTTA, INK, SKY]}
              fit="grid"
              cellSize={96}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- SEASONS */}
        <section id="seasons" className={s.seasons} aria-labelledby="seasons-h">
          <div className={s.secHead}>
            <h2 data-edit="seasons.title" data-edit-max="60" id="seasons-h">What runs when</h2>
            <p data-edit="seasons.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              The desert has four seasons and two of them are for walking.
              The other two are for walking early, or not at all.
            </p>
          </div>
          <div className={s.seasonBar} aria-hidden="true">
            <span className={s.spanSpring} />
            <span className={s.spanSummer} />
            <span className={s.spanAutumn} />
            <span className={s.spanWinter} />
          </div>
          <ul className={s.seasonGrid}>
            {SEASONS.map((se, i) => (
              <li key={se.name} className={`${s.season} ${s[se.span]}`}>
                <h3 data-edit={`seasons.title2.${i}`} data-edit-max="40">{se.name}</h3>
                <p data-edit={`seasons.seasonMonths.${i}`} data-edit-max="240" data-edit-multiline className={s.seasonMonths}>{se.months}</p>
                <p data-edit={`seasons.seasonTemps.${i}`} data-edit-max="240" data-edit-multiline className={s.seasonTemps}>{se.temps}</p>
                <p data-edit={`seasons.seasonRuns.${i}`} data-edit-max="240" data-edit-multiline className={s.seasonRuns}>{se.runs}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------------ GEAR */}
        <section id="gear" className={s.gear} aria-labelledby="gear-h">
          <div className={s.secHead}>
            <h2 data-edit="gear.title" data-edit-max="60" id="gear-h">Gear</h2>
            <p data-edit="gear.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Most of what a trip needs is ours and comes with the price. The
              rest fits in one bag and you probably own it.
            </p>
          </div>
          <div className={s.gearGrid}>
            <div className={s.gearCol}>
              <h3 data-edit="gear.title2" data-edit-max="40">We bring</h3>
              <ul className={s.gearList}>
                {GEAR_OURS.map((g, i) => (
                  <li data-edit={`gear.item.${i}`} data-edit-max="80" key={g}>{g}</li>
                ))}
              </ul>
            </div>
            <div className={s.gearCol}>
              <h3 data-edit="gear.title3" data-edit-max="40">You bring</h3>
              <ul className={s.gearList}>
                {GEAR_YOURS.map((g, i) => (
                  <li data-edit={`gear.item2.${i}`} data-edit-max="80" key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- GUIDES */}
        <section id="guides" className={s.guides} aria-labelledby="guides-h">
          <div className={s.secHead}>
            <h2 data-edit="guides.title" data-edit-max="60" id="guides-h">The guides</h2>
            <p data-edit="guides.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Three of the five, the ones who are here all year. The other
              two join from March and both have walked with us for a decade.
            </p>
          </div>
          <ul className={s.guideGrid}>
            {GUIDES.map((g, i) => (
              <li key={g.name} className={s.guide}>
                {/* A pattern tile stands in for the portrait. */}
                <div data-edit-pattern={`guides.field.${i}`} data-edit-roles="transparent,5,2" className={s.guideTile} aria-hidden="true">
                  <TabbiedPattern
                    pattern={bench}
                    palette={['transparent', PALE, TERRACOTTA]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5600 + i * 400}
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
                <h3 data-edit={`guides.title2.${i}`} data-edit-max="40">{g.name}</h3>
                <p data-edit={`guides.guideRole.${i}`} data-edit-max="240" data-edit-multiline className={s.guideRole}>{g.role}</p>
                <p data-edit={`guides.guideCerts.${i}`} data-edit-max="240" data-edit-multiline className={s.guideCerts}>{g.certs}</p>
                <p data-edit={`guides.guideSeasons.${i}`} data-edit-max="240" data-edit-multiline className={s.guideSeasons}>{g.seasons}</p>
                <p data-edit={`guides.guideBody.${i}`} data-edit-max="240" data-edit-multiline className={s.guideBody}>{g.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------- SAFETY */}
        <section id="safety" className={s.safety} aria-labelledby="safety-h">
          <div className={s.safetyGrid}>
            <div>
              <h2 data-edit="safety.title" data-edit-max="60" id="safety-h">Safety</h2>
              <ul className={s.safetyList}>
                {SAFETY.map((line, i) => (
                  <li data-edit={`safety.item.${i}`} data-edit-max="80" key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 data-edit="safety.h2Small" data-edit-max="60" className={s.h2Small}>Cancellation</h2>
              <dl className={s.cancelList}>
                {CANCELLATION.map(([when, what], i) => (
                  <div key={when}>
                    <dt data-edit={`safety.term.${i}`} data-edit-max="28">{when}</dt>
                    <dd data-edit={`safety.body.${i}`} data-edit-max="200" data-edit-multiline>{what}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <div className={s.terrace} aria-hidden="true" />

        {/* ------------------------------------------------------------ BOOK */}
        <section id="book" className={s.book} aria-labelledby="book-h">
          <div className={s.secHead}>
            <h2 data-edit="book.title" data-edit-max="60" id="book-h">How to book</h2>
          </div>
          <ol className={s.bookSteps}>
            {BOOKING.map((b, i) => (
              <li key={b.n}>
                <span data-edit={`book.stepNo.${i}`} data-edit-max="60" className={s.stepNo}>{b.n}</span>
                <h3 data-edit={`book.title2.${i}`} data-edit-max="40">{b.title}</h3>
                <p data-edit={`book.body.${i}`} data-edit-max="240" data-edit-multiline>{b.body}</p>
              </li>
            ))}
          </ol>
          <div className={s.bookCta}>
            <a data-edit="book.btn" data-edit-max="28" className={s.btn} href="tel:+14350000000">Call +1 435 000 0000</a>
            <a data-edit="book.btnLine" data-edit-max="28" className={s.btnLine} href="mailto:trips@mesaoutfitters.example">trips@mesaoutfitters.example</a>
          </div>
        </section>

        {/* ------------------------------------------------------------ SHOP */}
        <section id="shop" className={s.shop} aria-labelledby="shop-h">
          <div className={s.shopGrid}>
            <div>
              <h2 data-edit="shop.title" data-edit-max="60" id="shop-h">The shop</h2>
              <p data-edit="shop.shopLede" data-edit-max="240" data-edit-multiline className={s.shopLede}>
                471 North Main Street, Moab, next to the laundromat. Maps,
                boots, hats, the good sunscreen, and coffee from six in the
                summer for whoever is leaving early.
              </p>
              <p data-edit="shop.body" data-edit-max="240" data-edit-multiline className={s.shopAddr}>
                Mesa Outfitters
                <br />
                471 N Main St
                <br />
                Moab, UT 84532
              </p>
            </div>
            <dl className={s.hours}>
              {HOURS.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`shop.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`shop.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <div className={s.stripes} aria-hidden="true" />

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Mesa Outfitters</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Desert trail guides out of Moab since 2009. Permitted on BLM and Forest Service land.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Trips</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.trips" data-edit-max="28" href="#trips">Five trips</a></li>
              <li><a data-edit="footer.seasons" data-edit-max="28" href="#seasons">What runs when</a></li>
              <li><a data-edit="footer.gear" data-edit-max="28" href="#gear">Gear</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Us</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.guides" data-edit-max="28" href="#guides">The guides</a></li>
              <li><a data-edit="footer.safety" data-edit-max="28" href="#safety">Safety and cancellation</a></li>
              <li><a data-edit="footer.book" data-edit-max="28" href="#book">How to book</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Shop</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              471 N Main St
              <br />
              Moab, UT 84532
              <br />
              +1 435 000 0000
              <br />
              trips@mesaoutfitters.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional guiding company. Trips, prices, guides and hours are invented.</p>
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
