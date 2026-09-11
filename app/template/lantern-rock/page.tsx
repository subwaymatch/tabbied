import { TabbiedPattern } from 'tabbied/react';
import { bobbinet, bowsprit, mercerising } from 'tabbied/patterns';
import s from './lantern-rock.module.css';

export const metadata = {
  title: 'Lantern Rock: Lighthouse keepers\' inn, Pembrokeshire',
  description:
    'Lantern Rock is a four-room inn in the keepers\' cottages of a working lighthouse on the north Pembrokeshire coast. Breakfast, the light, the coast path from the door, and a tide table on the wall.',
};

/* Navy ink on off-white paper, one red, a grey and a pale blue. Every field
   takes `transparent` in the background slot: on the paper the pattern reads
   as a chart's hatching, and on a navy panel it reads as the same hatching
   cut in the other direction. */
const INK = '#0F2440';
const RED = '#C8102E';
const GREY = '#7B8794';
const PALE = '#D9DFE5';

const NAV = [
  ['Rooms', '#rooms'],
  ['The light', '#light'],
  ['Breakfast', '#breakfast'],
  ['Walks', '#walks'],
  ['Tides', '#tides'],
  ['Book', '#book'],
  ['Getting here', '#here'],
];

const STRIP = [
  ['Wind', 'SW 4, backing S by evening'],
  ['Air', '14 degrees, showers clearing'],
  ['High water', '06.42 and 19.08'],
  ['Low water', '12.55'],
  ['Sea', '15 degrees, moderate swell'],
  ['Sunset', '20.14'],
];

type Room = {
  name: string;
  keeper: string;
  view: string;
  bed: string;
  rate: string;
  note: string;
};

const ROOMS: Room[] = [
  {
    name: 'Trevethan',
    keeper: 'Josiah Trevethan, principal keeper 1861 to 1879',
    view: 'The tower and the open sea, west',
    bed: 'Six foot bed, bath and shower',
    rate: '185',
    note: 'The old principal keeper\'s parlour. The lamp turns across the ceiling all night, and most people ask for it twice.',
  },
  {
    name: 'Rowe',
    keeper: 'Ellen Rowe, keeper 1917 to 1921',
    view: 'The cove and the headland, south',
    bed: 'Five foot bed, shower',
    rate: '150',
    note: 'The only keeper the Board appointed during the war, and the smallest room, with the best-sheltered window.',
  },
  {
    name: 'Penhallow',
    keeper: 'Matthew Penhallow, assistant keeper 1930 to 1952',
    view: 'The garden wall and Ramsey Island',
    bed: 'Twin, joinable, shower',
    rate: '140',
    note: 'Ground floor, step-free from the yard. Dogs welcome here and in Gwyther, at 12 a night.',
  },
  {
    name: 'Gwyther',
    keeper: 'Idris Gwyther, last keeper, left 1988',
    view: 'The lane, the fields and the sunrise',
    bed: 'Six foot bed, bath and shower',
    rate: '165',
    note: 'Under the roof, with the loudest weather. Idris still lives in Trefin and comes for breakfast on Thursdays.',
  },
];

type Event = {
  year: string;
  what: string;
};

const TIMELINE: Event[] = [
  { year: '1861', what: 'Tower first lit, 14 June, with a fixed white light visible for 17 miles. Josiah Trevethan appointed principal keeper at 65 pounds a year.' },
  { year: '1874', what: 'Fog bell hung on the seaward gallery after the loss of the schooner Mary Ellis on the Bitches, with all hands but one.' },
  { year: '1902', what: 'Paraffin vapour burner replaces the oil lamps. The light becomes occulting, one long eclipse every fifteen seconds, which it still is.' },
  { year: '1922', what: 'Keepers\' cottages rebuilt in the present form, two dwellings under one roof, with the garden wall raised to eight feet after the winter of 1920.' },
  { year: '1941', what: 'The light is shown only on Admiralty request. The keepers spend the war painting the tower grey and, later, white again.' },
  { year: '1963', what: 'Electrified from the mains, with a diesel set in the engine room. The fog bell is replaced by a horn that can be heard in Trefin.' },
  { year: '1988', what: 'Automated. Idris Gwyther locks the tower door on 30 September and walks up the lane, and the cottages stand empty for a decade.' },
  { year: '1998', what: 'The cottages are sold and opened as an inn with three rooms. The tower stays with the lighthouse authority, and the light stays lit.' },
  { year: '2019', what: 'The lamp room opened to guests, one evening a week, by arrangement with the authority. Fourth room added under the roof.' },
];

type Dish = {
  name: string;
  body: string;
};

const BREAKFAST: Dish[] = [
  { name: 'Porridge', body: 'Made with milk, salted, with Pembrokeshire honey and a spoon of cream. Ask for it with water and salt if you are from further north.' },
  { name: 'Laverbread and cockles', body: 'On toast, with bacon, the way it is done in Penclawdd. The laverbread comes from Swansea market on a Tuesday.' },
  { name: 'Kippers', body: 'Milford Haven smoked, grilled, with brown bread and butter. The kitchen window is opened first.' },
  { name: 'The full Welsh', body: 'Bacon and sausage from Trefin, eggs from the Gwyther farm, laverbread, tomato, mushroom, and fried bread if you ask.' },
  { name: 'Eggs, any way', body: 'On sourdough from the bakery in Solva. Poached, scrambled, or boiled with soldiers and no comment.' },
  { name: 'The table', body: 'Toast, marmalade made in the tower kitchen in January, tea in a pot, coffee from a cafetiere. Included in every room.' },
];

type Walk = {
  name: string;
  miles: string;
  time: string;
  grade: string;
  body: string;
};

const WALKS: Walk[] = [
  { name: 'Round the headland', miles: '1.8', time: '50 min', grade: 'Easy', body: 'Out along the wall, round the point and back by the lane. The evening walk, and the one to do before breakfast.' },
  { name: 'Down to the cove', miles: '0.4', time: '15 min', grade: 'Steep', body: 'By the keepers\' steps to the shingle. Only at low water, and only after reading the table by the door.' },
  { name: 'Abereiddy and the Blue Lagoon', miles: '4.5', time: '2 h 15', grade: 'Moderate', body: 'West on the coast path past the quarry ruins to the flooded slate pit. Swim if you dare; the bus back runs in summer.' },
  { name: 'Porthgain', miles: '6.2', time: '3 h', grade: 'Moderate', body: 'East along the cliffs to the old brickworks harbour. The Sloop is at the end of it and does lunch until three.' },
  { name: 'Whitesands by St Davids Head', miles: '9', time: 'All day', grade: 'Hard', body: 'The long one. Pack lunch from the kitchen, and we will collect you from the beach car park at five if you ring.' },
];

const TIDES = [
  ['Mon', '05.58', '18.24', '6.1 m'],
  ['Tue', '06.42', '19.08', '6.4 m'],
  ['Wed', '07.25', '19.51', '6.6 m'],
  ['Thu', '08.07', '20.33', '6.7 m'],
  ['Fri', '08.49', '21.15', '6.6 m'],
  ['Sat', '09.32', '21.58', '6.3 m'],
  ['Sun', '10.17', '22.44', '5.9 m'],
];

const NOTES = [
  'Springs here run to seven metres; the cove is gone within forty minutes of the turn.',
  'A south-westerly over force 6 closes the steps and puts spray on the Trevethan window.',
  'Fog comes in from the south in June and July, and the horn sounds every thirty seconds until it lifts.',
  'The forecast on the wall is the Met Office inshore waters, St Davids Head to Great Orme, read out at 07.00.',
];

const TERMS = [
  ['Booking', 'By telephone or e-mail. We confirm the same day and take a deposit of 30 percent by card.'],
  ['Balance', 'On arrival, by card or cash. Breakfast is included; dinner is not, and the Sloop and the Ship both book up.'],
  ['Minimum', 'Two nights at weekends, three in August, one in the week from November to March.'],
  ['Cancelling', 'Full refund to 14 days before. Inside that, the deposit is kept unless we can let the room, and we usually can.'],
  ['Arriving', 'Between 15.00 and 20.00. Later by arrangement, because the lane is not lit and the gate is.'],
  ['Leaving', 'By 10.30, after breakfast, which is why breakfast finishes at 9.30.'],
  ['Children', 'From eight years old. The cliff is unfenced on the seaward side and we would rather say so here.'],
  ['Dogs', 'In Penhallow and Gwyther, 12 a night, and not on the beds. Towels for them are by the back door.'],
];

const HERE = [
  ['By road', 'A487 to Croesgoch, then the lane signed Trefin and the lighthouse. The last half mile is single track with two passing places; the gate is at the end. SA62 5XX finds the lane end, not the inn.'],
  ['By train', 'Haverfordwest, 24 miles. A taxi is about 45 minutes and 48 pounds; book Nolan\'s on the day before, because there is one.'],
  ['By bus', 'The Strumble Shuttle stops at the lane end from May to September, three times a day. We will meet it with the car if you ring from Fishguard.'],
  ['By sea', 'No. The cove has no landing, and the Bitches have had enough of everyone.'],
];

export default function LanternRockPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f5f3ec',
        '--ink': '#0f2440',
        '--red': '#c8102e',
        '--grey': '#7b8794',
        '--pale': '#d9dfe5',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Lantern Rock</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Trefin, Pembrokeshire</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            Bowsprit's spars over the paper, the loud field, with the compass
            badge drawn in CSS beside the headline. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,1" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={bowsprit}
              palette={['transparent', PALE, GREY, INK]}
              fit="grid"
              cellSize={128}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <div className={s.heroCopy}>
              <p data-edit="hero.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Lighthouse keepers&apos; inn, lit 1861</p>
              <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
                Four rooms
                <br />
                at the end of
                <br />
                <em>the last road.</em>
              </h1>
              <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
                The keepers&apos; cottages of a working lighthouse on the north
                coast of Pembrokeshire. The light still turns, the horn still
                sounds in fog, and breakfast is at half past seven for anyone
                who was up to see the sunrise.
              </p>
              <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#book">Check a date</a>
            </div>
            <div className={s.compass} aria-hidden="true">
              <i className={s.compassEW} />
              <b className={s.needle} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- WEATHER AND TIDE
            The strip by the door, in navy: what the sea is doing today. */}
        <section className={s.strip} aria-label="Today at the rock">
          <dl className={s.stripList}>
            {STRIP.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`strip.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`strip.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ----------------------------------------------------------- ROOMS */}
        <section id="rooms" className={s.rooms} aria-labelledby="rooms-h">
          <div className={s.secHead}>
            <p data-edit="rooms.label" data-edit-max="240" data-edit-multiline className={s.label}>The rooms</p>
            <h2 data-edit="rooms.title" data-edit-max="60" id="rooms-h">Four rooms, four keepers</h2>
            <p data-edit="rooms.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Each is named for someone who kept the light from it. Rates are
              per night for two, with breakfast, and the same in every month;
              what changes is the weather.
            </p>
          </div>
          <ul className={s.roomGrid}>
            {ROOMS.map((r, i) => (
              <li key={r.name} className={s.room}>
                <div className={s.roomHead}>
                  <h3 data-edit={`rooms.title2.${i}`} data-edit-max="40">{r.name}</h3>
                  <span data-edit={`rooms.rate.${i}`} data-edit-max="60" className={s.rate}>{r.rate}</span>
                </div>
                <p data-edit={`rooms.keeper.${i}`} data-edit-max="240" data-edit-multiline className={s.keeper}>{r.keeper}</p>
                <dl className={s.roomFacts}>
                  <div>
                    <dt data-edit={`rooms.term.${i}`} data-edit-max="28">Looks at</dt>
                    <dd data-edit={`rooms.body.${i}`} data-edit-max="200" data-edit-multiline>{r.view}</dd>
                  </div>
                  <div>
                    <dt data-edit={`rooms.term2.${i}`} data-edit-max="28">Bed</dt>
                    <dd data-edit={`rooms.body2.${i}`} data-edit-max="200" data-edit-multiline>{r.bed}</dd>
                  </div>
                </dl>
                <p data-edit={`rooms.roomNote.${i}`} data-edit-max="240" data-edit-multiline className={s.roomNote}>{r.note}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------- THE LIGHT */}
        <section id="light" className={s.light} aria-labelledby="light-h">
          <div className={s.lightGrid}>
            <div className={s.lightIntro}>
              <p data-edit="light.label" data-edit-max="240" data-edit-multiline className={s.label}>The light</p>
              <h2 data-edit="light.title" data-edit-max="60" id="light-h">Lit every night since 1861</h2>
              <p data-edit="light.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                Occulting white, one eclipse every fifteen seconds, 17 miles.
                The tower belongs to the lighthouse authority and is not ours
                to show, except on Wednesdays, when it is.
              </p>
              <p data-edit="light.lightAside" data-edit-max="240" data-edit-multiline className={s.lightAside}>
                The lamp room is opened to guests at dusk on Wednesday evenings
                between April and October, six at a time, by arrangement with
                the authority. Ask when you book.
              </p>
            </div>
            <ol className={s.timeline}>
              {TIMELINE.map((e, i) => (
                <li key={e.year}>
                  <span data-edit={`light.year.${i}`} data-edit-max="60" className={s.year}>{e.year}</span>
                  <p data-edit={`light.body.${i}`} data-edit-max="240" data-edit-multiline>{e.what}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND
            The same spars on a navy panel, in pale and red, at full width.
            Pinned to whole cells so no track lands on a half pixel. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,4,2,3" className={s.bandField}>
            <TabbiedPattern
              pattern={bowsprit}
              palette={['transparent', PALE, RED, GREY]}
              fit="grid"
              cellSize={96}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- BREAKFAST */}
        <section id="breakfast" className={s.breakfast} aria-labelledby="breakfast-h">
          <div className={s.secHead}>
            <p data-edit="breakfast.label" data-edit-max="240" data-edit-multiline className={s.label}>Breakfast</p>
            <h2 data-edit="breakfast.title" data-edit-max="60" id="breakfast-h">Half past seven until half past nine</h2>
            <p data-edit="breakfast.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              In the old watch room, at one long table, facing the sea. Nothing
              is ordered the night before; the kitchen has it all and cooks
              what you ask for when you appear.
            </p>
          </div>
          <dl className={s.menu}>
            {BREAKFAST.map((d, i) => (
              <div key={d.name}>
                <dt data-edit={`breakfast.term.${i}`} data-edit-max="28">{d.name}</dt>
                <dd data-edit={`breakfast.body.${i}`} data-edit-max="200" data-edit-multiline>{d.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ----------------------------------------------------------- WALKS
            Bobbinet's eyelets at low opacity behind the walks, washed with
            paper where the list sits, so the chart reads under the copy. */}
        <section id="walks" className={s.walks} aria-labelledby="walks-h">
          <div data-edit-pattern="walks.field" data-edit-roles="transparent,3,4" className={s.walksField} aria-hidden="true">
            <TabbiedPattern
              pattern={bobbinet}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={72}
              redrawInterval={6600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.walksInner}>
            <div className={s.secHead}>
              <p data-edit="walks.label" data-edit-max="240" data-edit-multiline className={s.label}>From the door</p>
              <h2 data-edit="walks.title" data-edit-max="60" id="walks-h">Five walks, none of them needing the car</h2>
              <p data-edit="walks.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                The coast path passes the garden gate in both directions.
                Distances are one way unless the walk is a loop; times are
                ours, on a dry day, with a stop to look.
              </p>
            </div>
            <ol className={s.walkList}>
              {WALKS.map((w, i) => (
                <li key={w.name}>
                  <h3 data-edit={`walks.walkName.${i}`} data-edit-max="40" className={s.walkName}>{w.name}</h3>
                  <span data-edit={`walks.walkMiles.${i}`} data-edit-max="60" className={s.walkMiles}>{w.miles}</span>
                  <span data-edit={`walks.walkTime.${i}`} data-edit-max="60" className={s.walkTime}>{w.time}</span>
                  <span data-edit={`walks.walkGrade.${i}`} data-edit-max="60" className={s.walkGrade}>{w.grade}</span>
                  <p data-edit={`walks.walkBody.${i}`} data-edit-max="240" data-edit-multiline className={s.walkBody}>{w.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------------------------------------------- TIDES */}
        <section id="tides" className={s.tides} aria-labelledby="tides-h">
          <div className={s.tidesGrid}>
            <div>
              <p data-edit="tides.label" data-edit-max="240" data-edit-multiline className={s.label}>Tides and weather</p>
              <h2 data-edit="tides.title" data-edit-max="60" id="tides-h">High water this week</h2>
              <p data-edit="tides.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                Milford Haven times, corrected for the rock by minus eleven
                minutes. The table on the wall by the door is the one that
                counts, and it is updated on Sunday night.
              </p>
              <ul className={s.notes}>
                {NOTES.map((n, i) => (
                  <li data-edit={`tides.item.${i}`} data-edit-max="80" key={n}>{n}</li>
                ))}
              </ul>
            </div>
            <ol className={s.tideTable}>
              <li className={s.tideHead} aria-hidden="true">
                <span data-edit="tides.text" data-edit-max="60">Day</span>
                <span data-edit="tides.text2" data-edit-max="60">Morning</span>
                <span data-edit="tides.text3" data-edit-max="60">Evening</span>
                <span data-edit="tides.text4" data-edit-max="60">Range</span>
              </li>
              {TIDES.map(([d, am, pm, range], i) => (
                <li key={d}>
                  <span data-edit={`tides.tideDay.${i}`} data-edit-max="60" className={s.tideDay}>{d}</span>
                  <span data-edit={`tides.tideTime.${i}`} data-edit-max="60" className={s.tideTime}>{am}</span>
                  <span data-edit={`tides.tideTime2.${i}`} data-edit-max="60" className={s.tideTime}>{pm}</span>
                  <span data-edit={`tides.tideRange.${i}`} data-edit-max="60" className={s.tideRange}>{range}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------ BOOK
            A navy panel with cream type: the terms, plainly. */}
        <section id="book" className={s.book} aria-labelledby="book-h">
          <div className={s.bookInner}>
            <div className={s.bookIntro}>
              <p data-edit="book.label" data-edit-max="240" data-edit-multiline className={s.label}>Booking</p>
              <h2 data-edit="book.title" data-edit-max="60" id="book-h">How to book, and the small print</h2>
              <p data-edit="book.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                We are two people and a telephone. Ring between nine and six,
                or write, and you will get one of us rather than a form.
              </p>
              <a data-edit="book.bookTel" data-edit-max="28" className={s.bookTel} href="tel:+441348000000">01348 000 000</a>
              <a data-edit="book.bookMail" data-edit-max="28" className={s.bookMail} href="mailto:stay@lanternrock.example">stay@lanternrock.example</a>
            </div>
            <dl className={s.terms}>
              {TERMS.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`book.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`book.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------- GETTING HERE */}
        <section id="here" className={s.here} aria-labelledby="here-h">
          <div className={s.secHead}>
            <p data-edit="here.label" data-edit-max="240" data-edit-multiline className={s.label}>Getting here</p>
            <h2 data-edit="here.title" data-edit-max="60" id="here-h">Trefin, then keep going</h2>
            <p data-edit="here.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Lantern Rock, Trefin, Haverfordwest SA62 5XX. The satnav gives
              up at the lane end, which is the point at which you can see the
              tower.
            </p>
          </div>
          <dl className={s.hereList}>
            {HERE.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`here.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`here.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* A coda: mercerising's dots with a lustre band on the bias, the last
          thing before the footer, with nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,1,2,4" className={s.codaField}>
          <TabbiedPattern
            pattern={mercerising}
            palette={['transparent', INK, RED, PALE]}
            fit="grid"
            cellSize={80}
            redrawInterval={5000}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Lantern Rock</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              Four rooms in the keepers&apos; cottages of a working lighthouse,
              Trefin, Pembrokeshire. Lit 1861, an inn since 1998.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Stay</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.rooms" data-edit-max="28" href="#rooms">The four rooms</a></li>
              <li><a data-edit="footer.breakfast" data-edit-max="28" href="#breakfast">Breakfast</a></li>
              <li><a data-edit="footer.book" data-edit-max="28" href="#book">Booking and terms</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Outside</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.walks" data-edit-max="28" href="#walks">Walks from the door</a></li>
              <li><a data-edit="footer.tides" data-edit-max="28" href="#tides">Tides this week</a></li>
              <li><a data-edit="footer.light" data-edit-max="28" href="#light">The light since 1861</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Write</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Lantern Rock, Trefin
              <br />
              Haverfordwest SA62 5XX
              <br />
              stay@lanternrock.example
              <br />
              01348 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>
            A fictional inn on an invented headland. The keepers, tides, rates
            and walks are made up; the coast is real and deserves respect.
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
