import { TabbiedPattern } from 'tabbied/react';
import { baste, cascade, lunette } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './caldera-rail.module.css';

export const metadata = {
  title: 'Caldera · Scenic Railway Journeys Since 1927',
  description:
    'The Caldera Railway Company operates three slow, scenic routes across the caldera country: the Coast Cantata, the Alpine Ascent and the Vineyard Arc. Timetables, fares and the dining car await.',
};

// Site palette - parchment first, then inks.
const PARCHMENT = '#F0EAD6';
const NAVY = '#264653';
const TEAL = '#2A9D8F';
const GOLD = '#E9C46A';
const APRICOT = '#F4A261';
const EMBER = '#E76F51';

const FULL = [PARCHMENT, NAVY, TEAL, GOLD, APRICOT, EMBER];

const routes = [
  {
    no: 'No. 1',
    name: 'The Coast Cantata',
    img: 'caldera-coast',
    alt: 'Gouache illustration of a teal train tracing a cliffside coastal line above a turquoise sea',
    path: 'Terra Alta to Port Lumen',
    days: 'Daily',
    duration: '5 h 40 m',
    distance: '148 km',
    fare: 'from €64',
    note: 'Cliff running from Sienna Gorge to the Lighthouse Curve. Sit seaward, left side going down, and keep your window latch loose for the salt air.',
  },
  {
    no: 'No. 2',
    name: 'The Alpine Ascent',
    img: 'caldera-alpine',
    alt: 'Gouache illustration of a train climbing a snowy mountain pass between pines',
    path: 'Terra Alta to Vespergate',
    days: 'Tue · Thu · Sat',
    duration: '7 h 05 m',
    distance: '172 km',
    fare: 'from €78',
    note: 'Up and over the Col du Miroir on a one-in-forty grade. Blankets in every parlour car from October; the summit halt serves chocolate at 1,940 metres.',
  },
  {
    no: 'No. 3',
    name: 'The Vineyard Arc',
    img: 'caldera-vineyard',
    alt: 'Gouache illustration of terraced vineyards in autumn colour with a train curving between them',
    path: 'Casteldoro to Miradora',
    days: 'Fri to Sun',
    duration: '4 h 25 m',
    distance: '96 km',
    fare: 'from €52',
    note: 'A gentle arc through the terraces, timed for the low afternoon light. Autumn services include a tasting tray from the Casteldoro co-operative.',
  },
];

const stops = [
  {
    time: '08:12',
    station: 'Terra Alta Central',
    detail: 'Departure: platform 2, under the great clock. Elevation 612 m.',
  },
  {
    time: '09:05',
    station: 'Sienna Gorge Viaduct',
    detail: 'Slow crossing at walking pace. Photographs from the open gallery.',
  },
  {
    time: '10:20',
    station: 'Miradora',
    detail: 'Twenty-minute halt. Coffee and almond pastry on platform 1.',
  },
  {
    time: '11:48',
    station: 'The Salt Tunnels',
    detail: 'Eleven bores cut in 1907. Lamps dimmed by tradition.',
  },
  {
    time: '12:30',
    station: 'Casteldoro',
    detail: 'First seating in the dining car is called on departure.',
  },
  {
    time: '13:55',
    station: 'Lighthouse Curve',
    detail: 'The sea appears all at once. The driver sounds one long note.',
  },
  {
    time: '14:52',
    station: 'Port Lumen Harbour',
    detail: 'Arrival at sea level, alongside the evening fishing fleet.',
  },
];

const cabins = [
  {
    name: 'Parlour Seat',
    fare: 'included',
    desc: 'Wide armchairs in pairs, fold-down writing tables, windows that open to the elbow.',
  },
  {
    name: 'Observation Gallery',
    fare: '+ €18',
    desc: 'The glazed rear car. Unreserved benches, a brass rail, and nothing between you and the view.',
  },
  {
    name: 'Sleeper Berth',
    fare: '+ €46',
    desc: 'For the Night Vespers service only. Two berths, wool blankets, a basin, and dawn over the pass.',
  },
];

const quotes = [
  {
    text: 'Five hours and forty minutes, and I begrudged the journey not one of them. The Cantata is the rare timetable that reads like a poem.',
    source: 'The Meridian Traveller',
    year: '1962',
  },
  {
    text: 'Other railways get you somewhere. Caldera returns you to yourself, somewhat saltier, entirely on schedule.',
    source: 'Slow Roads Quarterly',
    year: '2019',
  },
  {
    text: 'My grandfather proposed on the Lighthouse Curve. My father was a fireman on the Vesper. I simply buy a ticket every June.',
    source: 'A passenger, Miradora',
    year: '2024',
  },
];

const timetable = [
  {
    service: '101',
    route: 'Coast Cantata',
    dir: 'Terra Alta \u2192 Port Lumen',
    days: 'Daily',
    dep: '08:12',
    arr: '14:52',
    fare: '€64',
  },
  {
    service: '102',
    route: 'Coast Cantata',
    dir: 'Port Lumen \u2192 Terra Alta',
    days: 'Daily',
    dep: '15:40',
    arr: '22:18',
    fare: '€64',
  },
  {
    service: '201',
    route: 'Alpine Ascent',
    dir: 'Terra Alta \u2192 Vespergate',
    days: 'Tue · Thu · Sat',
    dep: '07:35',
    arr: '14:40',
    fare: '€78',
  },
  {
    service: '202',
    route: 'Alpine Ascent',
    dir: 'Vespergate \u2192 Terra Alta',
    days: 'Wed · Fri · Sun',
    dep: '09:10',
    arr: '16:15',
    fare: '€78',
  },
  {
    service: '301',
    route: 'Vineyard Arc',
    dir: 'Casteldoro \u2192 Miradora',
    days: 'Fri to Sun',
    dep: '13:05',
    arr: '17:30',
    fare: '€52',
  },
  {
    service: '901',
    route: 'Night Vespers',
    dir: 'Terra Alta \u2192 Vespergate',
    days: 'Fri only',
    dep: '21:50',
    arr: '06:05',
    fare: '€96',
  },
];

export default function CalderaRailPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--parchment': '#f0ead6',
        '--parchment-lift': '#fbf7ea',
        '--parchment-dim': '#e7dfc6',
        '--navy': '#264653',
        '--teal': '#2a9d8f',
        '--gold': '#e9c46a',
        '--apricot': '#f4a261',
        '--ember': '#e76f51',
        '--ember-ink': '#c14e31',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="parchment,parchment-lift,parchment-dim,navy,teal,gold,apricot,ember,ember-ink"
      className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Jost:ital,wght@0,300..700;1,300..700&display=swap"
      />

      <header className={styles.masthead}>
        <p data-edit="masthead.mastheadRule" data-edit-max="240" data-edit-multiline className={styles.mastheadRule}>
          Est. 1927 · The Caldera Railway Company · Terra Alta · Port Lumen ·
          Vespergate
        </p>
        <p className={styles.mastheadMark} aria-hidden="true">
          &#x2726;
        </p>
        <p data-edit="masthead.brand" data-edit-max="240" data-edit-multiline className={styles.brand}>Caldera</p>
        <p data-edit="masthead.tagline" data-edit-max="240" data-edit-multiline className={styles.tagline}>Scenic railway journeys, kept slow on purpose</p>
        <nav className={styles.nav} aria-label="Sections">
          <a data-edit="masthead.routes" data-edit-max="28" href="#routes">The Routes</a>
          <a data-edit="masthead.line" data-edit-max="28" href="#line">The Line</a>
          <a data-edit="masthead.aboard" data-edit-max="28" href="#aboard">Aboard</a>
          <a data-edit="masthead.fleet" data-edit-max="28" href="#fleet">The Fleet</a>
          <a data-edit="masthead.journal" data-edit-max="28" href="#journal">Journal</a>
          <a data-edit="masthead.timetable" data-edit-max="28" href="#timetable">Timetable</a>
        </nav>
      </header>

      <main>
        {/* ----- Hero ----- */}
        <section className={styles.hero} aria-labelledby="hero-heading">
          {/* Full-bleed arcade of arches behind the whole hero - the viaduct
              motif the railway is built on, scrimmed back where type sits. */}
          <div data-edit-pattern="hero.field" data-edit-roles="0,3,4,5,6,7" className={styles.heroPattern} aria-hidden="true">
            <TabbiedPattern
              pattern={lunette}
              palette={FULL}
              seed="caldera-arcade-1927"
              fit="cover"
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>

          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p data-edit="hero.kicker" data-edit-max="240" data-edit-multiline className={styles.kicker}>Summer service · 12 May to 28 Sept</p>
              <h1 data-edit="hero.heroTitle" data-edit-max="70" id="hero-heading" className={styles.heroTitle}>
                Take the slow way round.
              </h1>
              <p data-edit="hero.heroLead" data-edit-max="240" data-edit-multiline className={styles.heroLead}>
                Three routes cross the caldera country: along the cliffs, over
                the pass, and through the terraces. Each one runs to the minute
                and never faster than the view deserves.
              </p>
              <div className={styles.heroActions}>
                <a data-edit="hero.btnSolid" data-edit-max="28" className={styles.btnSolid} href="#timetable">
                  Consult the timetable
                </a>
                <a data-edit="hero.btnGhost" data-edit-max="28" className={styles.btnGhost} href="#routes">
                  The three routes
                </a>
              </div>
              <dl className={styles.heroFacts}>
                <div>
                  <dt data-edit="hero.term" data-edit-max="28">Routes</dt>
                  <dd data-edit="hero.body" data-edit-max="200" data-edit-multiline>3 + night car</dd>
                </div>
                <div>
                  <dt data-edit="hero.term2" data-edit-max="28">Viaducts</dt>
                  <dd data-edit="hero.body2" data-edit-max="200" data-edit-multiline>17 crossed</dd>
                </div>
                <div>
                  <dt data-edit="hero.term3" data-edit-max="28">Punctuality</dt>
                  <dd data-edit="hero.body3" data-edit-max="200" data-edit-multiline>98.4% (1927-)</dd>
                </div>
              </dl>
            </div>

            <div className={styles.posterStack}>
              <figure className={styles.posterFrame}>
                <div className={styles.posterImage}>
                  <Figure editId="photo.caldera-hero"
                    slug="caldera-hero"
                    alt="Gouache travel-poster illustration of a teal locomotive crossing a tall stone viaduct at golden hour"
                    priority
                  />
                </div>
                <figcaption data-edit="hero.posterCaption" data-edit-max="120" data-edit-multiline className={styles.posterCaption}>
                  The Viaduct at Sienna Gorge, morning service
                </figcaption>
              </figure>
              <p className={styles.stamp} aria-hidden="true">
                <span data-edit="hero.text" data-edit-max="60">Caldera Rly Co · Est 1927 ·</span>
              </p>
            </div>
          </div>
        </section>

        <div data-edit-pattern="main.field" data-edit-roles="0,4,5,7" className={styles.dividerBand} aria-hidden="true">
          <TabbiedPattern
            pattern={cascade}
            palette={[PARCHMENT, TEAL, GOLD, EMBER]}
            seed="caldera-band-a"
            fit="grid"
            cellSize={28}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ----- Routes ----- */}
        <section
          id="routes"
          className={styles.section}
          aria-labelledby="routes-heading"
        >
          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionNo" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>Section I</p>
            <h2 data-edit="sectionHead.title" data-edit-max="60" id="routes-heading">The Three Routes</h2>
            <p data-edit="sectionHead.sectionLead" data-edit-max="240" data-edit-multiline className={styles.sectionLead}>
              Every ticket is printed on board, punched at the gorge, and, by
              a habit no one remembers starting, kept forever.
            </p>
          </header>

          <div className={styles.ticketRow}>
            {routes.map((route, i) => (
              <article className={styles.ticket} key={route.no}>
                <div className={styles.ticketHead}>
                  <span data-edit={`ticket.ticketNo.${i}`} data-edit-max="60" className={styles.ticketNo}>{route.no}</span>
                  <span data-edit={`ticket.ticketDays.${i}`} data-edit-max="60" className={styles.ticketDays}>{route.days}</span>
                </div>
                <h3 data-edit={`ticket.ticketName.${i}`} data-edit-max="40" className={styles.ticketName}>{route.name}</h3>
                <p data-edit={`ticket.ticketPath.${i}`} data-edit-max="240" data-edit-multiline className={styles.ticketPath}>{route.path}</p>
                <div className={styles.ticketImage}>
                  <Figure editId={`ticket.photo.${i}`} slug={route.img} alt={route.alt} />
                </div>
                <div className={styles.perforation} aria-hidden="true" />
                <div className={styles.ticketStub}>
                  <dl className={styles.ticketFacts}>
                    <div>
                      <dt data-edit={`ticket.term.${i}`} data-edit-max="28">Duration</dt>
                      <dd data-edit={`ticket.body.${i}`} data-edit-max="200" data-edit-multiline>{route.duration}</dd>
                    </div>
                    <div>
                      <dt data-edit={`ticket.term2.${i}`} data-edit-max="28">Distance</dt>
                      <dd data-edit={`ticket.body2.${i}`} data-edit-max="200" data-edit-multiline>{route.distance}</dd>
                    </div>
                    <div>
                      <dt data-edit={`ticket.term3.${i}`} data-edit-max="28">Fare</dt>
                      <dd data-edit={`ticket.fare.${i}`} data-edit-max="200" data-edit-multiline className={styles.fare}>{route.fare}</dd>
                    </div>
                  </dl>
                  <p data-edit={`ticket.ticketNote.${i}`} data-edit-max="240" data-edit-multiline className={styles.ticketNote}>{route.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ----- Route timeline ----- */}
        <section
          id="line"
          className={`${styles.sectionAlt} ${styles.lineSection}`}
          aria-labelledby="line-heading"
        >
          {/* Sleeper-dashes running the length of the section, quiet enough
              to sit under the called stops. */}
          <div data-edit-pattern="line.field" data-edit-roles="0,3,4,5,7" className={styles.linePattern} aria-hidden="true">
            <TabbiedPattern
              pattern={baste}
              palette={[PARCHMENT, NAVY, TEAL, GOLD, EMBER]}
              seed="caldera-sleepers-101"
              fit="grid"
              cellSize={96}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>

          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionNo2" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>Section II</p>
            <h2 data-edit="sectionHead.title2" data-edit-max="60" id="line-heading">Down the Line: Service 101</h2>
            <p data-edit="sectionHead.sectionLead2" data-edit-max="240" data-edit-multiline className={styles.sectionLead}>
              The Coast Cantata, called stop by stop. Times are kept; views are
              guaranteed by geography.
            </p>
          </header>

          <ol className={styles.timeline}>
            {stops.map((stop, i) => (
              <li className={styles.stop} key={stop.time}>
                <span data-edit={`line.stopTime.${i}`} data-edit-max="60" className={styles.stopTime}>{stop.time}</span>
                <span className={styles.stopDot} aria-hidden="true" />
                <span className={styles.stopBody}>
                  <span data-edit={`line.stopStation.${i}`} data-edit-max="60" className={styles.stopStation}>{stop.station}</span>
                  <span data-edit={`line.stopDetail.${i}`} data-edit-max="60" className={styles.stopDetail}>{stop.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----- Aboard ----- */}
        <section
          id="aboard"
          className={styles.section}
          aria-labelledby="aboard-heading"
        >
          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionNo3" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>Section III</p>
            <h2 data-edit="sectionHead.title3" data-edit-max="60" id="aboard-heading">Aboard</h2>
            <p data-edit="sectionHead.sectionLead3" data-edit-max="240" data-edit-multiline className={styles.sectionLead}>
              The train is the destination's first act. Everything on board is
              original, restored, or made by the same hands that restore.
            </p>
          </header>

          <div className={styles.aboardGrid}>
            <figure className={styles.diningFigure}>
              <Figure editId="photo.caldera-dining"
                slug="caldera-dining"
                alt="Interior of a restored railway dining car with walnut panelling, brass lamps and white tablecloths"
              />
              <figcaption data-edit="aboard.caption" data-edit-max="120" data-edit-multiline>
                The Meridian Car: walnut, brass, and three seatings a day
              </figcaption>
            </figure>
            <div className={styles.aboardCopy}>
              <h3 data-edit="aboard.title" data-edit-max="40">The dining car</h3>
              <p data-edit="aboard.body" data-edit-max="240" data-edit-multiline>
                Lunch is cooked in a galley the width of a corridor and tastes
                like it took the whole valley to make, because it did. Bread
                from Miradora, trout from the gorge, wine from the Arc. First
                seating is called at Casteldoro; the last coffee is poured on
                the Lighthouse Curve, timed to the minute.
              </p>
              <h3 data-edit="aboard.title2" data-edit-max="40">Cabins &amp; seating</h3>
              <ul className={styles.cabinList}>
                {cabins.map((cabin, i) => (
                  <li key={cabin.name}>
                    <span className={styles.cabinName}>
                      {cabin.name}
                      <span data-edit={`aboard.cabinFare.${i}`} data-edit-max="60" className={styles.cabinFare}>{cabin.fare}</span>
                    </span>
                    <span data-edit={`aboard.cabinDesc.${i}`} data-edit-max="60" className={styles.cabinDesc}>{cabin.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.vignettes}>
            <figure className={styles.vignette}>
              <div data-edit-pattern="aboard.field" data-edit-roles="5,3,7,4" className={styles.vignettePattern}>
                <TabbiedPattern
                  pattern={cascade}
                  palette={[GOLD, NAVY, EMBER, TEAL]}
                  seed="caldera-luggage-3"
                  fit="grid"
                  cellSize={44}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <Figure editId="photo.caldera-suitcase-cutout"
                  slug="caldera-suitcase-cutout"
                  cutout
                  alt="Vintage leather suitcase with travel labels"
                  className={styles.vignetteCutout}
                />
              </div>
              <figcaption data-edit="aboard.caption2" data-edit-max="120" data-edit-multiline>
                Left luggage, kept lovingly. Porters at every staffed halt.
              </figcaption>
            </figure>
            <figure className={styles.vignette}>
              <div data-edit-pattern="aboard.field2" data-edit-roles="4,3,5,0" className={styles.vignettePattern}>
                <TabbiedPattern
                  pattern={cascade}
                  palette={[TEAL, NAVY, GOLD, PARCHMENT]}
                  seed="caldera-watch-9"
                  fit="grid"
                  cellSize={44}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <Figure editId="photo.caldera-watch-cutout"
                  slug="caldera-watch-cutout"
                  cutout
                  alt="Brass pocket watch, open, showing ten past eight"
                  className={styles.vignetteCutout}
                />
              </div>
              <figcaption data-edit="aboard.caption3" data-edit-max="120" data-edit-multiline>
                Company time. Every guard's watch is set against the great
                clock at Terra Alta.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ----- Fleet ----- */}
        <section
          id="fleet"
          className={styles.fleet}
          aria-labelledby="fleet-heading"
        >
          <div data-edit-pattern="fleet.field" data-edit-roles="3,4,5,6,7" className={styles.fleetPattern} aria-hidden="true">
            <TabbiedPattern
              pattern={cascade}
              palette={[NAVY, TEAL, GOLD, APRICOT, EMBER]}
              seed="caldera-fleet-7"
              fit="cover"
              density={2}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.fleetInner}>
            <header className={styles.fleetHead}>
              <p data-edit="fleetHead.sectionNoLight" data-edit-max="240" data-edit-multiline className={styles.sectionNoLight}>Section IV</p>
              <h2 data-edit="fleetHead.title" data-edit-max="60" id="fleet-heading">The Fleet</h2>
            </header>
            <div className={styles.fleetLoco}>
              <Figure editId="photo.caldera-locomotive-cutout"
                slug="caldera-locomotive-cutout"
                cutout
                alt="Side profile of a teal steam locomotive with gold lining, number 7"
                className={styles.locoCutout}
              />
            </div>
            <div className={styles.fleetCard}>
              <h3>
                No. 7 · <em>Vesper</em>
              </h3>
              <p data-edit="fleet.body" data-edit-max="240" data-edit-multiline>
                Built 1931 at the Harlow &amp; Finch works; oil-fired since
                1974; returned to steam after a nut-and-bolt restoration in
                2019. She takes the Cantata six days a week and the Night
                Vespers on the seventh, which the crews consider a holiday.
              </p>
              <dl className={styles.fleetSpecs}>
                <div>
                  <dt data-edit="fleet.term" data-edit-max="28">Arrangement</dt>
                  <dd data-edit="fleet.body2" data-edit-max="200" data-edit-multiline>4-6-2 "Pacific"</dd>
                </div>
                <div>
                  <dt data-edit="fleet.term2" data-edit-max="28">Line speed</dt>
                  <dd data-edit="fleet.body3" data-edit-max="200" data-edit-multiline>96 km/h, rarely used</dd>
                </div>
                <div>
                  <dt data-edit="fleet.term3" data-edit-max="28">Livery</dt>
                  <dd data-edit="fleet.body4" data-edit-max="200" data-edit-multiline>Caldera teal, gold lining</dd>
                </div>
                <div>
                  <dt data-edit="fleet.term4" data-edit-max="28">Whistle</dt>
                  <dd data-edit="fleet.body5" data-edit-max="200" data-edit-multiline>One long note, at the Curve</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ----- Journal ----- */}
        <section
          id="journal"
          className={styles.section}
          aria-labelledby="journal-heading"
        >
          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionNo4" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>Section V</p>
            <h2 data-edit="sectionHead.title4" data-edit-max="60" id="journal-heading">From the Journal</h2>
            <p data-edit="sectionHead.sectionLead4" data-edit-max="240" data-edit-multiline className={styles.sectionLead}>
              Ninety-eight years of margin notes, press clippings and letters
              to the stationmaster.
            </p>
          </header>
          <div className={styles.quoteRow}>
            {quotes.map((quote, i) => (
              <blockquote className={styles.quote} key={quote.source}>
                <p data-edit={`journal.body.${i}`} data-edit-max="240" data-edit-multiline>{quote.text}</p>
                <footer>
                  {quote.source}, {quote.year}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ----- Timetable & booking ----- */}
        <section
          id="timetable"
          className={styles.sectionAlt}
          aria-labelledby="timetable-heading"
        >
          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionNo5" data-edit-max="240" data-edit-multiline className={styles.sectionNo}>Section VI</p>
            <h2 data-edit="sectionHead.title5" data-edit-max="60" id="timetable-heading">Timetable &amp; Booking</h2>
            <p data-edit="sectionHead.sectionLead5" data-edit-max="240" data-edit-multiline className={styles.sectionLead}>
              Summer working timetable, 12 May to 28 September. Winter services
              are published on the feast of St. Alban.
            </p>
          </header>

          <div className={styles.tableScroll} tabIndex={0}>
            <table className={styles.table}>
              <caption data-edit="timetable.tableCaption" className={styles.tableCaption}>
                All services convey the dining car unless marked. Children
                under 12 travel at half fare; dogs and bicycles at a quarter.
              </caption>
              <thead>
                <tr>
                  <th data-edit="timetable.heading" scope="col">Service</th>
                  <th data-edit="timetable.heading2" scope="col">Route</th>
                  <th data-edit="timetable.heading3" scope="col">Direction</th>
                  <th data-edit="timetable.heading4" scope="col">Days</th>
                  <th data-edit="timetable.heading5" scope="col">Dep.</th>
                  <th data-edit="timetable.heading6" scope="col">Arr.</th>
                  <th data-edit="timetable.heading7" scope="col">Fare</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((row, i) => (
                  <tr key={row.service}>
                    <td data-edit={`timetable.mono.${i}`} className={styles.mono}>{row.service}</td>
                    <td data-edit={`timetable.cell.${i}`}>{row.route}</td>
                    <td data-edit={`timetable.cell2.${i}`}>{row.dir}</td>
                    <td data-edit={`timetable.cell3.${i}`}>{row.days}</td>
                    <td data-edit={`timetable.mono2.${i}`} className={styles.mono}>{row.dep}</td>
                    <td data-edit={`timetable.mono3.${i}`} className={styles.mono}>{row.arr}</td>
                    <td data-edit={`timetable.mono4.${i}`} className={styles.mono}>{row.fare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.bookingRow}>
            <div className={styles.bookingCard}>
              <h3 data-edit="timetable.title" data-edit-max="40">The Booking Hall</h3>
              <p data-edit="timetable.body" data-edit-max="240" data-edit-multiline>
                Terra Alta Central, 2 Viaduct Approach. Open 07:00 to 19:00
                daily; the brass grille closes for lunch between 12:30 and
                13:15, as it has since 1927.
              </p>
            </div>
            <div className={styles.bookingCard}>
              <h3 data-edit="timetable.title2" data-edit-max="40">By wire or telephone</h3>
              <p data-edit="timetable.body2" data-edit-max="240" data-edit-multiline>
                Telephone (0)55 214 88, or write to reservations@caldera.rail.
                Reserved fares hold for seven days; the seat map is drawn by
                hand and honoured absolutely.
              </p>
            </div>
            <div className={styles.bookingCard}>
              <h3 data-edit="timetable.title3" data-edit-max="40">Fair-weather promise</h3>
              <p data-edit="timetable.body3" data-edit-max="240" data-edit-multiline>
                If cloud sits below the Col du Miroir for your whole Ascent,
                your next mountain ticket is half price. The guard's word is
                final and generously given.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ----- Footer ----- */}
      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="3,4,5,7" className={styles.footerBand} aria-hidden="true">
          <TabbiedPattern
            pattern={cascade}
            palette={[NAVY, TEAL, GOLD, EMBER]}
            seed="caldera-footer-12"
            fit="grid"
            cellSize={26}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.footerInner}>
          <div className={styles.footerCols}>
            <div>
              <p data-edit="footer.footerBrand" data-edit-max="240" data-edit-multiline className={styles.footerBrand}>Caldera</p>
              <p data-edit="footer.footerSmall" data-edit-max="240" data-edit-multiline className={styles.footerSmall}>
                The Caldera Railway Company, incorporated 1927. Three routes,
                one timetable, no hurry.
              </p>
            </div>
            <div>
              <h3 data-edit="footer.footerHead" data-edit-max="40" className={styles.footerHead}>Principal stations</h3>
              <ul className={styles.footerList}>
                <li data-edit="footer.item" data-edit-max="80">Terra Alta Central</li>
                <li data-edit="footer.item2" data-edit-max="80">Miradora</li>
                <li data-edit="footer.item3" data-edit-max="80">Casteldoro</li>
                <li data-edit="footer.item4" data-edit-max="80">Vespergate</li>
                <li data-edit="footer.item5" data-edit-max="80">Port Lumen Harbour</li>
              </ul>
            </div>
            <div>
              <h3 data-edit="footer.footerHead2" data-edit-max="40" className={styles.footerHead}>Correspondence</h3>
              <ul className={styles.footerList}>
                <li data-edit="footer.item6" data-edit-max="80">2 Viaduct Approach, Terra Alta</li>
                <li data-edit="footer.item7" data-edit-max="80">Telephone (0)55 214 88</li>
                <li data-edit="footer.item8" data-edit-max="80">reservations@caldera.rail</li>
              </ul>
            </div>
          </div>
          <div className={styles.footerRule}>
            <p>
              A fictional railway, set entirely in gouache. ·{' '}
              <a data-edit="footer.credit" data-edit-max="28"
                className={styles.credit}
                href="https://tabbied.com"
                target="_blank"
                rel="noreferrer"
              >
                Patterns by Tabbied
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
