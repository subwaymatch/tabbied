import { TabbiedPattern } from 'tabbied/react';
import { arriccio, capstan, ziggurat } from 'tabbied/patterns';
import s from './hotel-meridien.module.css';

export const metadata = {
  title: 'Hotel Meridien: Grand hotel since 1927, Nice',
  description:
    'The Hotel Meridien has stood on the Promenade des Anglais since 1927. Ninety-two rooms, a restaurant with one tasting menu, a bar with a piano, and the sea across the road.',
};

/* Cream, gold, a grey for the small print and the pale green of the panels.
   Every field takes `transparent` in the background slot so the beads and
   steps sit in the deep green of the page, the way gilding sits on lacquer. */
const INK = '#F3EBD9';
const GOLD = '#C9A24B';
const GREY = '#7E8A82';
const PALE = '#1B2F2A';

const NAV = [
  ['Rooms', '#rooms'],
  ['Restaurant', '#restaurant'],
  ['Bar', '#bar'],
  ['History', '#history'],
  ['Reservations', '#reservations'],
  ['Location', '#location'],
];

type Room = {
  name: string;
  size: string;
  view: string;
  rate: string;
  note: string;
};

const ROOMS: Room[] = [
  { name: 'Chambre Classique', size: '26 m2', view: 'Courtyard', rate: '290 EUR', note: 'The original 1927 room, restored to its proportions. Marble bath, a writing desk, and quiet.' },
  { name: 'Chambre Promenade', size: '30 m2', view: 'Sea, with balcony', rate: '410 EUR', note: 'Third to sixth floor, facing the Baie des Anges. The balcony is wide enough for breakfast.' },
  { name: 'Junior Suite', size: '44 m2', view: 'Sea', rate: '620 EUR', note: 'A sitting room joined to the bedroom by a pair of walnut doors. Two balconies on the upper floors.' },
  { name: 'Suite Meridien', size: '68 m2', view: 'Sea, corner', rate: '980 EUR', note: 'The corner of the building, with windows on two sides and the original stepped ceiling.' },
  { name: 'Appartement Baie des Anges', size: '112 m2', view: 'Sea, top floor', rate: '1 850 EUR', note: 'Two bedrooms, a dining room for eight and a terrace along the whole front. One of it.' },
];

type Course = {
  no: string;
  name: string;
  detail: string;
};

const MENU: Course[] = [
  { no: 'I', name: 'Amuse-bouche', detail: 'Chickpea socca, anchovy, lemon' },
  { no: 'II', name: 'Rouget', detail: 'Red mullet, fennel, saffron broth' },
  { no: 'III', name: 'Artichaut', detail: 'Violet artichoke, black olive, aged parmesan' },
  { no: 'IV', name: 'Loup', detail: 'Sea bass, courgette flower, verjuice' },
  { no: 'V', name: 'Agneau', detail: 'Sisteron lamb, wild thyme, its own jus' },
  { no: 'VI', name: 'Fromages', detail: 'From the trolley, with chestnut honey' },
  { no: 'VII', name: 'Citron de Menton', detail: 'Lemon, meringue, olive oil ice cream' },
];

type Drink = {
  name: string;
  detail: string;
  price: string;
};

const COCKTAILS: Drink[] = [
  { name: 'Meridien 1927', detail: 'Cognac, sweet vermouth, orange bitters, stirred', price: '24 EUR' },
  { name: 'Promenade Fizz', detail: 'Gin, lemon, egg white, soda, a violet', price: '21 EUR' },
  { name: 'Baie des Anges', detail: 'Gin, rosemary, grapefruit, dry vermouth', price: '22 EUR' },
  { name: 'Sidecar', detail: 'Cognac, orange liqueur, lemon, sugared rim', price: '22 EUR' },
  { name: 'Negroni', detail: 'Gin, bitter, sweet vermouth, orange', price: '19 EUR' },
  { name: 'Champagne Cocktail', detail: 'Sugar, bitters, cognac, champagne', price: '26 EUR' },
  { name: 'Jardin', detail: 'Verbena, cucumber, tonic, no alcohol', price: '14 EUR' },
  { name: 'Colline', detail: 'Peach, thyme, lemon, soda, no alcohol', price: '14 EUR' },
];

type Decade = {
  year: string;
  title: string;
  body: string;
};

const HISTORY: Decade[] = [
  { year: '1927', title: 'The opening', body: 'Built in fourteen months for the winter season and opened in January with ninety-two rooms, a ballroom, and a lift that is still in service.' },
  { year: '1930s', title: 'The winter hotel', body: 'Full from November to April and closed all summer. The ballroom orchestra played six nights a week and the seventh was the staff dance.' },
  { year: '1940s', title: 'Requisitioned', body: 'Closed to guests for five years. The furniture was stored in the cellars and most of it came back, which is why the dining chairs are the originals.' },
  { year: '1950s', title: 'Summer arrives', body: 'The hotel opened in July for the first time, put a bar on the terrace, and discovered it had been facing the wrong season for thirty years.' },
  { year: '1960s', title: 'The east wing', body: 'Twenty-eight rooms added along the Promenade, in the style of the original and to the same ceiling height, which nobody else was doing.' },
  { year: '1980s', title: 'First restoration', body: 'The lobby marble was uncovered from under carpet, the stepped ceilings from under plasterboard, and the building was listed the following year.' },
  { year: '2010s', title: 'Second restoration', body: 'Three years with the hotel open a floor at a time. The bathrooms were rebuilt, the lift was not, and the ballroom regained its mirrors.' },
  { year: '2027', title: 'The centenary', body: 'One hundred years in January. The ballroom orchestra returns for the season, six nights a week, and the seventh is the staff dance.' },
];

const TERMS = [
  ['Best rate', 'Rooms booked directly with the hotel are always at the lowest rate we offer, with breakfast included.'],
  ['Deposit', 'One night is charged at the time of booking, and the balance on departure.'],
  ['Cancellation', 'Free of charge up to seventy-two hours before arrival. After that, the deposit is kept.'],
  ['Arrival', 'Rooms are ready from 15.00 and are yours until 12.00. Earlier and later are usually possible if you ask.'],
  ['Children', "Under twelve stay in their parents' room at no charge. A cot or a second bed is arranged on request."],
  ['Dogs', 'Welcome in every room but the restaurant, for 35 EUR a night, with a bed and a bowl waiting.'],
  ['Parking', 'Valet parking under the hotel, 45 EUR a night. The station is nine minutes by taxi and the airport is seventeen.'],
  ['City tax', 'The Nice tourist tax is added to every stay and shown separately on the bill, as the law requires.'],
];

const LOCATION = [
  ['Address', '47 Promenade des Anglais, 06000 Nice'],
  ['Airport', "Nice Cote d'Azur, 7 km, seventeen minutes"],
  ['Station', 'Nice-Ville, 2 km, nine minutes'],
  ['Beach', 'Across the road. The hotel has its own from May to September'],
  ['Old town', 'Twenty minutes on foot along the water, or five by taxi'],
];

export default function HotelMeridienPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#0e1f1b',
        '--ink': '#f3ebd9',
        '--gold': '#c9a24b',
        '--grey': '#7e8a82',
        '--pale': '#1b2f2a',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,gold,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..700&family=Cormorant+Garamond:ital,wght@0,400..600;1,400..500&display=swap"
      />

      <header className={s.bar}>
        <span data-edit="bar.barSide" data-edit-max="60" className={s.barSide}>Nice, since 1927</span>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Hotel Meridien</a>
        <a data-edit="bar.barRight" data-edit-max="28" className={s.barRight} href="#reservations">Reserve</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            Symmetric: the beads of the field radiate from the centre, and the
            words sit in a stepped panel at the same centre. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,3,4" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={capstan}
              palette={['transparent', GOLD, GREY, PALE]}
              fit="grid"
              cellSize={160}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroPanel}>
            <span data-edit="hero.text" data-edit-max="60" className={s.orn} aria-hidden="true">&#x2726;</span>
            <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Promenade des Anglais</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle} id="hero-h">
              A grand hotel
              <br />
              <em>on the sea since 1927</em>
            </h1>
            <span className={s.dbl} aria-hidden="true" />
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Ninety-two rooms behind a facade that has not changed in a
              century. A restaurant with one menu, a bar with a piano, a lift
              with an attendant, and the Baie des Anges across the road.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#rooms">The rooms</a>
            <span data-edit="hero.text2" data-edit-max="60" className={s.orn} aria-hidden="true">&#x2726;</span>
          </div>
        </section>

        {/* ----------------------------------------------------------- ROOMS */}
        <section id="rooms" className={s.sec} aria-labelledby="rooms-h">
          <div className={s.secHead}>
            <span data-edit="rooms.secKicker" data-edit-max="60" className={s.secKicker}>I</span>
            <h2 data-edit="rooms.title" data-edit-max="60" id="rooms-h">The rooms</h2>
            <span className={s.dbl} aria-hidden="true" />
            <p data-edit="rooms.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Five categories, all with breakfast in the salon, all restored
              to their 1927 ceiling height. Rates are per night, for two.
            </p>
          </div>
          <ol className={s.rooms}>
            {ROOMS.map((r, i) => (
              <li key={r.name} className={s.room}>
                <h3 data-edit={`rooms.title2.${i}`} data-edit-max="40">{r.name}</h3>
                <span data-edit={`rooms.roomMeta.${i}`} data-edit-max="60" className={s.roomMeta}>{r.size}</span>
                <span data-edit={`rooms.roomView.${i}`} data-edit-max="60" className={s.roomView}>{r.view}</span>
                <span data-edit={`rooms.roomRate.${i}`} data-edit-max="60" className={s.roomRate}>{r.rate}</span>
                <p data-edit={`rooms.body.${i}`} data-edit-max="240" data-edit-multiline>{r.note}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ RESTAURANT */}
        <section id="restaurant" className={s.sec} aria-labelledby="restaurant-h">
          <div className={s.secHead}>
            <span data-edit="restaurant.secKicker" data-edit-max="60" className={s.secKicker}>II</span>
            <h2 data-edit="restaurant.title" data-edit-max="60" id="restaurant-h">Le Salon 1927</h2>
            <span className={s.dbl} aria-hidden="true" />
            <p data-edit="restaurant.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              One tasting menu of seven courses, changed with the market and
              cooked by Léonie Barral since 2019. Dinner Tuesday to Saturday
              from 19.30; lunch Friday to Sunday from 12.30.
            </p>
          </div>
          <div className={s.menuFrame}>
            <p data-edit="restaurant.menuPrice" data-edit-max="240" data-edit-multiline className={s.menuPrice}>Seven courses, 165 EUR</p>
            <p data-edit="restaurant.menuPairing" data-edit-max="240" data-edit-multiline className={s.menuPairing}>Wine pairing 95 EUR, or by the glass</p>
            <ol className={s.menu}>
              {MENU.map((c, i) => (
                <li key={c.no}>
                  <span data-edit={`restaurant.courseNo.${i}`} data-edit-max="60" className={s.courseNo}>{c.no}</span>
                  <h3 data-edit={`restaurant.title2.${i}`} data-edit-max="40">{c.name}</h3>
                  <p data-edit={`restaurant.body.${i}`} data-edit-max="240" data-edit-multiline>{c.detail}</p>
                </li>
              ))}
            </ol>
            <p data-edit="restaurant.menuFoot" data-edit-max="240" data-edit-multiline className={s.menuFoot}>
              A vegetable menu of the same length is always available, and
              allergies are asked about when you book, not when you sit down.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div className={s.band} aria-hidden="true">
          <div data-edit-pattern="top.field" data-edit-roles="transparent,2,4,3" className={s.bandField}>
            <TabbiedPattern
              pattern={arriccio}
              palette={['transparent', GOLD, PALE, GREY]}
              fit="grid"
              cellSize={144}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </div>

        {/* ------------------------------------------------------------- BAR */}
        <section id="bar" className={s.sec} aria-labelledby="bar-h">
          <div className={s.secHead}>
            <span data-edit="bar.secKicker" data-edit-max="60" className={s.secKicker}>III</span>
            <h2 data-edit="bar.title" data-edit-max="60" id="bar-h">Bar Azur</h2>
            <span className={s.dbl} aria-hidden="true" />
            <p data-edit="bar.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Open from 17.00 until one in the morning, every day. The piano
              is played from 20.00 on Thursday, Friday and Saturday.
            </p>
          </div>
          <ul className={s.drinks}>
            {COCKTAILS.map((d, i) => (
              <li key={d.name}>
                <h3 data-edit={`bar.title2.${i}`} data-edit-max="40">{d.name}</h3>
                <span data-edit={`bar.drinkPrice.${i}`} data-edit-max="60" className={s.drinkPrice}>{d.price}</span>
                <p data-edit={`bar.body.${i}`} data-edit-max="240" data-edit-multiline>{d.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------------------- HISTORY */}
        <section id="history" className={s.history} aria-labelledby="history-h">
          <div data-edit-pattern="history.field" data-edit-roles="transparent,4,3" className={s.historyField} aria-hidden="true">
            <TabbiedPattern
              pattern={capstan}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={6800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.historyInner}>
            <div className={s.secHead}>
              <span data-edit="history.secKicker" data-edit-max="60" className={s.secKicker}>IV</span>
              <h2 data-edit="history.title" data-edit-max="60" id="history-h">A century on the Promenade</h2>
              <span className={s.dbl} aria-hidden="true" />
              <p data-edit="history.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
                Eight decades that changed the building, and two that did not.
              </p>
            </div>
            <ol className={s.timeline}>
              {HISTORY.map((h, i) => (
                <li key={h.year}>
                  <time data-edit={`history.tlYear.${i}`} className={s.tlYear}>{h.year}</time>
                  <h3 data-edit={`history.title2.${i}`} data-edit-max="40">{h.title}</h3>
                  <p data-edit={`history.body.${i}`} data-edit-max="240" data-edit-multiline>{h.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------------------------------------------- RESERVATIONS */}
        <section id="reservations" className={s.sec} aria-labelledby="reservations-h">
          <div className={s.secHead}>
            <span data-edit="reservations.secKicker" data-edit-max="60" className={s.secKicker}>V</span>
            <h2 data-edit="reservations.title" data-edit-max="60" id="reservations-h">Reservations</h2>
            <span className={s.dbl} aria-hidden="true" />
            <p data-edit="reservations.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              By telephone or by letter, as in 1927, and by e-mail, which is
              answered by a person within the day.
            </p>
          </div>
          <div className={s.reserve}>
            <a data-edit="reservations.reserveTel" data-edit-max="28" className={s.reserveTel} href="tel:+33493000000">+33 4 93 00 00 00</a>
            <a data-edit="reservations.reserveMail" data-edit-max="28" className={s.reserveMail} href="mailto:reservations@hotelmeridien.example">reservations@hotelmeridien.example</a>
          </div>
          <dl className={s.terms}>
            {TERMS.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`reservations.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`reservations.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* -------------------------------------------------------- LOCATION */}
        <section id="location" className={s.sec} aria-labelledby="location-h">
          <div className={s.secHead}>
            <span data-edit="location.secKicker" data-edit-max="60" className={s.secKicker}>VI</span>
            <h2 data-edit="location.title" data-edit-max="60" id="location-h">On the Promenade</h2>
            <span className={s.dbl} aria-hidden="true" />
            <p data-edit="location.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Number 47, between the Jardin Albert and the Negresco end of
              the bay, facing due south.
            </p>
          </div>
          <dl className={s.location}>
            {LOCATION.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`location.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`location.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* A coda: stepped silhouettes, the last thing before the footer. */}
      <div className={s.coda} aria-hidden="true">
        <div data-edit-pattern="page.field" data-edit-roles="transparent,2,4,3" className={s.codaField}>
          <TabbiedPattern
            pattern={ziggurat}
            palette={['transparent', GOLD, PALE, GREY]}
            fit="grid"
            cellSize={96}
            redrawInterval={5400}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </div>

      <footer className={s.footer}>
        <div className={s.footTop}>
          <span data-edit="footer.text" data-edit-max="60" className={s.orn} aria-hidden="true">&#x2726;</span>
          <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Hotel Meridien</p>
          <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>47 Promenade des Anglais, Nice. Since 1927.</p>
        </div>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>The hotel</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.rooms" data-edit-max="28" href="#rooms">The rooms</a></li>
              <li><a data-edit="footer.restaurant" data-edit-max="28" href="#restaurant">Le Salon 1927</a></li>
              <li><a data-edit="footer.bar" data-edit-max="28" href="#bar">Bar Azur</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Your stay</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.reservations" data-edit-max="28" href="#reservations">Reservations</a></li>
              <li><a data-edit="footer.location" data-edit-max="28" href="#location">On the Promenade</a></li>
              <li><a data-edit="footer.history" data-edit-max="28" href="#history">A century</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Write</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              47 Promenade des Anglais
              <br />
              06000 Nice
              <br />
              reservations@hotelmeridien.example
              <br />
              +33 4 93 00 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional hotel. Rates, menus and dates are invented.</p>
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
