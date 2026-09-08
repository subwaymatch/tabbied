import { TabbiedPattern } from 'tabbied/react';
import { bothways, dotmatrix, ortho, rafter } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './linie-nord.module.css';

export const metadata = {
  title: 'Linie Nord | Regional transit authority, Steinhafen',
  description:
    'Linie Nord runs six rail lines and 91 stops across the Steinhafen region. Timetables, journey times, fare zones, accessibility provision and current service updates.',
};

const CONCRETE = '#F1F1EF';
const INK = '#17181A';
const SIGNAL = '#FFD400';
const STEEL = '#7E858C';
const PALE = '#DCDEDE';
const DARK = '#2A2E33';

const NETWORK_FIGURES = [
  { value: '6', label: 'Lines in service' },
  { value: '91', label: 'Stops served' },
  { value: '214', label: 'Route kilometres' },
  { value: '41', label: 'Vehicles in the fleet' },
  { value: '18.4 m', label: 'Journeys, year to June 2026' },
  { value: '94.6 %', label: 'Punctual within 3 minutes' },
];

const LINES = [
  {
    no: 'N1',
    from: 'Steinhafen Hbf',
    to: 'Kaltenmoor',
    stops: 12,
    minutes: 38,
    headway: '15 min',
    span: '04:52-00:18',
  },
  {
    no: 'N2',
    from: 'Steinhafen Hbf',
    to: 'Bergkamp',
    stops: 12,
    minutes: 51,
    headway: '20 min',
    span: '05:04-23:41',
  },
  {
    no: 'N3',
    from: 'Ostmole',
    to: 'Werftinsel',
    stops: 8,
    minutes: 22,
    headway: '10 min',
    span: '05:20-01:05',
  },
  {
    no: 'N4',
    from: 'Steinhafen Hbf',
    to: 'Flughafen Nord',
    stops: 7,
    minutes: 29,
    headway: '12 min',
    span: '04:10-00:52',
  },
  {
    no: 'N5',
    from: 'Bergkamp',
    to: 'Grenselund',
    stops: 19,
    minutes: 64,
    headway: '30 min',
    span: '05:38-22:56',
  },
  {
    no: 'N9',
    from: 'Steinhafen Hbf',
    to: 'Kaltenmoor',
    stops: 12,
    minutes: 41,
    headway: '60 min',
    span: '00:40-04:40',
  },
];

const N2_STOPS = [
  { name: 'Steinhafen Hbf', zone: 'A', min: 0, interchange: true },
  { name: 'Marktbrücke', zone: 'A', min: 3, interchange: false },
  { name: 'Rathaus', zone: 'A', min: 6, interchange: false },
  { name: 'Nordbad', zone: 'A', min: 9, interchange: false },
  { name: 'Ostmole', zone: 'B', min: 13, interchange: true },
  { name: 'Speicherreihe', zone: 'B', min: 17, interchange: false },
  { name: 'Viadukt Wehr', zone: 'B', min: 22, interchange: false },
  { name: 'Talstation', zone: 'B', min: 27, interchange: false },
  { name: 'Kaltenmoor Süd', zone: 'C', min: 33, interchange: false },
  { name: 'Hüttenwerk', zone: 'C', min: 38, interchange: false },
  { name: 'Bergkamp Ost', zone: 'C', min: 44, interchange: false },
  { name: 'Bergkamp', zone: 'C', min: 51, interchange: false },
];

const DEPARTURES = [
  {
    time: '09:12',
    line: 'N2',
    dest: 'Bergkamp',
    platform: '3',
    status: 'On time',
    late: false,
  },
  {
    time: '09:14',
    line: 'N4',
    dest: 'Flughafen Nord',
    platform: '1',
    status: 'On time',
    late: false,
  },
  {
    time: '09:18',
    line: 'N1',
    dest: 'Kaltenmoor',
    platform: '5',
    status: '4 min late',
    late: true,
  },
  {
    time: '09:22',
    line: 'N3',
    dest: 'Werftinsel',
    platform: '2',
    status: 'On time',
    late: false,
  },
  {
    time: '09:27',
    line: 'N5',
    dest: 'Grenselund',
    platform: '4',
    status: 'Short formation',
    late: true,
  },
  {
    time: '09:32',
    line: 'N2',
    dest: 'Bergkamp',
    platform: '3',
    status: 'On time',
    late: false,
  },
  {
    time: '09:34',
    line: 'N4',
    dest: 'Flughafen Nord',
    platform: '1',
    status: 'On time',
    late: false,
  },
  {
    time: '09:38',
    line: 'N1',
    dest: 'Kaltenmoor',
    platform: '5',
    status: 'On time',
    late: false,
  },
];

const ZONES = ['A', 'B', 'C', 'D'];

const FARE_MATRIX: Record<string, Record<string, string>> = {
  A: { A: '2.40', B: '3.60', C: '4.80', D: '6.20' },
  B: { A: '3.60', B: '2.40', C: '3.60', D: '4.80' },
  C: { A: '4.80', B: '3.60', C: '2.40', D: '3.60' },
  D: { A: '6.20', B: '4.80', C: '3.60', D: '2.40' },
};

const TICKETS = [
  { name: 'Single, one zone', price: '2.40' },
  { name: 'Day ticket, two zones', price: '8.40' },
  { name: 'Day ticket, all zones', price: '11.90' },
  { name: 'Group day, up to five people', price: '19.50' },
  { name: 'Monthly, all zones', price: '62.00' },
  { name: 'Annual, all zones', price: '620.00' },
];

const ACCESS_FACTS = [
  { label: 'Step-free stops', value: '84 of 91' },
  { label: 'Boarding ramps', value: 'All Type 4 and Type 6 vehicles' },
  { label: 'Wheelchair spaces', value: '2 per railcar, 4 on Type 6' },
  { label: 'Audio and visual announcements', value: '100 % of the fleet' },
  { label: 'Tactile paving', value: 'Every zone A and zone B platform' },
  { label: 'Induction loops', value: '11 staffed ticket windows' },
];

const ONBOARD = [
  {
    label: 'Bicycles',
    value:
      'Carried free of charge outside 06:30 to 08:30 and 16:00 to 18:00. Two spaces per vehicle.',
  },
  {
    label: 'Quiet coach',
    value: 'Rear coach on every Type 3 and Type 6 service. No telephone calls.',
  },
  {
    label: 'Validators',
    value:
      'One at each door. Paper tickets must be validated before the vehicle moves.',
  },
  {
    label: 'Power',
    value: 'Two sockets per seat pair on Type 6. None on Type 2 trams.',
  },
  {
    label: 'Lost property',
    value:
      'Steinhafen Hbf, level minus one. Weekdays 08:00 to 18:00. Items held 90 days.',
  },
];

const STAFF = [
  {
    slug: 'linie-driver',
    name: 'Ines Marek',
    role: 'Driver, line N2',
    since: 'With the authority since 2014',
    alt: 'Portrait of a transit driver in a dark uniform, photographed straight on in daylight',
    note: 'Drives the 05:04 out of Steinhafen four mornings a week. Has logged 41 000 km on the Bergkamp gradient.',
  },
  {
    slug: 'linie-controller',
    name: 'Tobias Kern',
    role: 'Revenue protection',
    since: 'With the authority since 2009',
    alt: 'Portrait of a transit ticket inspector in a dark uniform, photographed straight on in daylight',
    note: 'Checks roughly 900 tickets a week. Carries a printed fare table because the app is slower than he is.',
  },
];

const UPDATES = [
  {
    date: '12 Aug to 30 Aug',
    title: 'Viadukt Wehr resurfacing',
    body: 'Line N2 is replaced by bus between Speicherreihe and Talstation. Add 14 minutes to every journey. Buses depart from the forecourt, not the platform.',
    status: 'Planned',
    flag: true,
  },
  {
    date: '03 Sep, from 22:00',
    title: 'Signal renewal at Ostmole',
    body: 'Line N3 runs every 20 minutes instead of every 10. Last service to Werftinsel departs 23:40 rather than 01:05.',
    status: 'Planned',
    flag: true,
  },
  {
    date: 'From 28 Jul',
    title: 'Lift out of service, Bergkamp Ost',
    body: 'Northbound platform is reachable by stairs only. Step-free alternative: alight at Hüttenwerk and continue by line N5.',
    status: 'Active',
    flag: false,
  },
  {
    date: '15 Sep',
    title: 'Annual timetable change',
    body: 'New departure times on all six lines. Printed booklets available at staffed windows from 01 Sep. Journey times on N5 improve by 3 minutes.',
    status: 'Notice',
    flag: false,
  },
];

export default function LinieNordPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--concrete': '#f1f1ef',
        '--ink': '#17181a',
        '--signal': '#ffd400',
        '--steel': '#7e858c',
        '--pale': '#dcdede',
        '--dark': '#2a2e33',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="concrete,ink,signal,steel,pale,dark"
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
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..800&display=swap"
      />

      <header className={styles.masthead}>
        <div className={`${styles.container} ${styles.grid}`}>
          <p data-edit="masthead.wordmark" data-edit-max="240" data-edit-multiline className={styles.wordmark}>Linie Nord</p>
          <nav className={styles.nav} aria-label="Sections">
            <a data-edit="masthead.network" data-edit-max="28" href="#network">Network</a>
            <a data-edit="masthead.lines" data-edit-max="28" href="#lines">Lines</a>
            <a data-edit="masthead.departures" data-edit-max="28" href="#departures">Departures</a>
            <a data-edit="masthead.fares" data-edit-max="28" href="#fares">Fares</a>
            <a data-edit="masthead.updates" data-edit-max="28" href="#updates">Updates</a>
          </nav>
          <p className={styles.mastMeta}>
            Verkehrsbetrieb Steinhafen
            <br />
            Timetable valid to 14 Sep 2026
          </p>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.heroText}>
              <p data-edit="hero.kicker" data-edit-max="240" data-edit-multiline className={styles.kicker}>Regional transit authority</p>
              <h1 data-edit="hero.heroTitle" data-edit-max="70" id="hero-title" className={styles.heroTitle}>
                Six lines, 91 stops, one timetable.
              </h1>
              <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={styles.heroLede}>
                Linie Nord operates the regional rail network of the Steinhafen
                basin, from the harbour quays at Ostmole to the upper valley at
                Grenselund. First departure 04:10, last arrival 01:47. The
                network runs on public money and publishes its punctuality
                figures every quarter.
              </p>
              <p className={styles.heroActions}>
                <a data-edit="hero.buttonFilled" data-edit-max="28" href="#fares" className={styles.buttonFilled}>
                  Fares and zones
                </a>
                <a data-edit="hero.buttonPlain" data-edit-max="28" href="#departures" className={styles.buttonPlain}>
                  Live departures
                </a>
              </p>
            </div>
            <div data-edit-pattern="hero.field" data-edit-roles="0,3,4,1" className={styles.heroField}>
              <TabbiedPattern
                pattern={bothways}
                palette={[CONCRETE, STEEL, PALE, INK]}
                seed="ln-hero-01"
                options={{ grid: '8x12', frequency: 0.9 }}
                fit="grid"
                cellSize={72}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
          </div>
        </section>

        <div className={styles.bleed}>
          <div className={styles.heroPhoto}>
            <Figure editId="photo.linie-hero"
              slug="linie-hero"
              priority
              alt="A two-car regional railcar standing at an open platform under a flat grey sky"
              className={styles.img}
            />
          </div>
        </div>

        {/* 01 The network */}
        <section
          id="network"
          className={styles.section}
          aria-labelledby="network-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span data-edit="network.secNo" data-edit-max="60" className={styles.secNo}>01</span>
              <h2 data-edit="network.secTitle" data-edit-max="60" id="network-title" className={styles.secTitle}>
                The network
              </h2>
            </div>

            <div className={styles.netText}>
              <p data-edit="network.body" data-edit-max="240" data-edit-multiline>
                The network was assembled from three separate undertakings
                between 1968 and 1974: the harbour tramway, the Bergkamp
                mineral line and the municipal bus depot at Kaltenmoor. It has
                been operated as a single authority since 01 January 1975.
                Ownership is held by the region, not by an operating company.
              </p>
              <p data-edit="network.body2" data-edit-max="240" data-edit-multiline>
                Track gauge is 1435 mm throughout. Electrification at 15 kV
                covers 178 of the 214 route kilometres; the Grenselund
                extension remains diesel worked until 2029. Every line meets
                every other line at Steinhafen Hbf or at Ostmole, so no journey
                inside the four fare zones requires more than one change.
              </p>
              <p data-edit="network.netAside" data-edit-max="240" data-edit-multiline className={styles.netAside}>
                Head office: Bahnhofstrasse 4, 24 Steinhafen. Open to the public
                weekdays 08:00 to 16:30.
              </p>
            </div>

            <dl className={styles.figures}>
              {NETWORK_FIGURES.map((f, i) => (
                <div key={f.label} className={styles.figureItem}>
                  <dt data-edit={`network.figureLabel.${i}`} data-edit-max="28" className={styles.figureLabel}>{f.label}</dt>
                  <dd data-edit={`network.figureValue.${i}`} data-edit-max="200" data-edit-multiline className={styles.figureValue}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Raking members: the ballast and track band. */}
        <div className={styles.bleed}>
          <div data-edit-pattern="main.field" data-edit-roles="5,3,3,4" className={styles.band}>
            <TabbiedPattern
              pattern={rafter}
              palette={[DARK, STEEL, STEEL, PALE]}
              seed="ln-band-02"
              options={{ grid: '4x6', frequency: 0.85 }}
              fit="grid"
              cellSize={34}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </div>

        <div className={`${styles.container} ${styles.grid} ${styles.tileRow}`}>
          <figure className={styles.tileA}>
            <div className={styles.frameTall}>
              <Figure editId="photo.linie-viaduct"
                slug="linie-viaduct"
                alt="A concrete rail viaduct crossing a shallow valley, seen from below"
                className={styles.img}
              />
            </div>
            <figcaption data-edit="main.caption" data-edit-max="120" data-edit-multiline>Viadukt Wehr, 1971. 412 m, eleven spans.</figcaption>
          </figure>
          <div className={styles.tileB}>
            <div data-edit-pattern="main.field2" data-edit-roles="4,1,3" className={styles.frameTall}>
              <TabbiedPattern
                pattern={bothways}
                palette={[PALE, INK, STEEL]}
                seed="ln-tile-03"
                options={{ grid: '6x9', frequency: 0.85 }}
                fit="grid"
                cellSize={44}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <p data-edit="main.tileNote" data-edit-max="240" data-edit-multiline className={styles.tileNote}>
              Network schematic, 2026 revision. Crossings mark interchanges.
            </p>
          </div>
          <figure className={styles.tileC}>
            <div className={styles.frameTall}>
              <Figure editId="photo.linie-depot"
                slug="linie-depot"
                alt="Railcars stabled inside a maintenance depot with overhead inspection walkways"
                className={styles.img}
              />
            </div>
            <figcaption data-edit="main.caption2" data-edit-max="120" data-edit-multiline>Kaltenmoor depot. 41 vehicles, 96 staff.</figcaption>
          </figure>
        </div>

        {/* 02 Lines */}
        <section
          id="lines"
          className={styles.section}
          aria-labelledby="lines-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span data-edit="lines.secNo" data-edit-max="60" className={styles.secNo}>02</span>
              <h2 data-edit="lines.secTitle" data-edit-max="60" id="lines-title" className={styles.secTitle}>
                Lines and journey times
              </h2>
            </div>
            <p data-edit="lines.secLede" data-edit-max="240" data-edit-multiline className={styles.secLede}>
              Journey times are end to end, measured from the published
              departure at the first stop to the published arrival at the last.
              They include standing time at Steinhafen Hbf.
            </p>

            <div className={styles.listWrap} role="table" aria-label="Line listing">
              <div className={`${styles.listRow} ${styles.listHead}`} role="row">
                <span data-edit="lines.colLine" data-edit-max="60" className={styles.colLine} role="columnheader">
                  Line
                </span>
                <span data-edit="lines.colFrom" data-edit-max="60" className={styles.colFrom} role="columnheader">
                  From
                </span>
                <span data-edit="lines.colTo" data-edit-max="60" className={styles.colTo} role="columnheader">
                  To
                </span>
                <span data-edit="lines.colNum" data-edit-max="60" className={styles.colNum} role="columnheader">
                  Stops
                </span>
                <span data-edit="lines.colNum2" data-edit-max="60" className={styles.colNum} role="columnheader">
                  Minutes
                </span>
                <span data-edit="lines.colHead" data-edit-max="60" className={styles.colHead} role="columnheader">
                  Every
                </span>
                <span data-edit="lines.colSpan" data-edit-max="60" className={styles.colSpan} role="columnheader">
                  First and last
                </span>
              </div>
              {LINES.map((l, i) => (
                <div key={l.no} className={styles.listRow} role="row">
                  <span data-edit={`lines.colLine2.${i}`} data-edit-max="60" className={styles.colLine} role="cell">
                    {l.no}
                  </span>
                  <span data-edit={`lines.colFrom2.${i}`} data-edit-max="60" className={styles.colFrom} role="cell">
                    {l.from}
                  </span>
                  <span data-edit={`lines.colTo2.${i}`} data-edit-max="60" className={styles.colTo} role="cell">
                    {l.to}
                  </span>
                  <span data-edit={`lines.colNum3.${i}`} data-edit-max="60" className={styles.colNum} role="cell">
                    {l.stops}
                  </span>
                  <span data-edit={`lines.colNum4.${i}`} data-edit-max="60" className={styles.colNum} role="cell">
                    {l.minutes}
                  </span>
                  <span data-edit={`lines.colHead2.${i}`} data-edit-max="60" className={styles.colHead} role="cell">
                    {l.headway}
                  </span>
                  <span data-edit={`lines.colSpan2.${i}`} data-edit-max="60" className={styles.colSpan} role="cell">
                    {l.span}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.diagramCol}>
              <h3 data-edit="lines.subTitle" data-edit-max="40" className={styles.subTitle}>Line N2 in full</h3>
              <ol className={styles.diagram}>
                {N2_STOPS.map((s, i) => (
                  <li key={s.name} className={styles.stop}>
                    <span
                      className={
                        s.interchange
                          ? `${styles.dot} ${styles.dotChange}`
                          : styles.dot
                      }
                      aria-hidden="true"
                    />
                    <span data-edit={`lines.stopName.${i}`} data-edit-max="60" className={styles.stopName}>{s.name}</span>
                    <span className={styles.stopZone}>Zone {s.zone}</span>
                    <span data-edit={`lines.stopMin.${i}`} data-edit-max="60" className={styles.stopMin}>{s.min}</span>
                  </li>
                ))}
              </ol>
              <p data-edit="lines.diagramKey" data-edit-max="240" data-edit-multiline className={styles.diagramKey}>
                Yellow square marks an interchange. Final column is minutes
                from Steinhafen Hbf.
              </p>
            </div>

            <div className={styles.diagramNotes}>
              <h3 data-edit="lines.subTitle2" data-edit-max="40" className={styles.subTitle}>Rolling stock</h3>
              <dl className={styles.pairs}>
                <div>
                  <dt data-edit="lines.term" data-edit-max="28">Type 2</dt>
                  <dd data-edit="lines.body" data-edit-max="200" data-edit-multiline>Harbour tram, 1988, 92 places. Line N3 only.</dd>
                </div>
                <div>
                  <dt data-edit="lines.term2" data-edit-max="28">Type 3</dt>
                  <dd data-edit="lines.body2" data-edit-max="200" data-edit-multiline>Regional railcar, 2003, 148 places. Lines N5 and N9.</dd>
                </div>
                <div>
                  <dt data-edit="lines.term3" data-edit-max="28">Type 4</dt>
                  <dd data-edit="lines.body3" data-edit-max="200" data-edit-multiline>
                    Low-floor railcar, 2016, 176 places. Lines N1, N2 and N9.
                  </dd>
                </div>
                <div>
                  <dt data-edit="lines.term4" data-edit-max="28">Type 6</dt>
                  <dd data-edit="lines.body4" data-edit-max="200" data-edit-multiline>
                    Airport express, 2024, 210 places, luggage racks. Line N4.
                  </dd>
                </div>
              </dl>
              <p data-edit="lines.note" data-edit-max="240" data-edit-multiline className={styles.note}>
                Vehicle allocation is published each Monday at 06:00 and is
                subject to depot availability.
              </p>
            </div>
          </div>
        </section>

        {/* 03 Departures */}
        <section
          id="departures"
          className={styles.section}
          aria-labelledby="departures-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span data-edit="departures.secNo" data-edit-max="60" className={styles.secNo}>03</span>
              <h2 data-edit="departures.secTitle" data-edit-max="60" id="departures-title" className={styles.secTitle}>
                Departures, Steinhafen Hbf
              </h2>
            </div>
            <p data-edit="departures.secLede" data-edit-max="240" data-edit-multiline className={styles.secLede}>
              Board as displayed at 09:08 on a normal weekday. Real-time data is
              refreshed every 20 seconds at the stop and every 60 seconds here.
            </p>

            <div
              className={styles.boardWrap}
              role="table"
              aria-label="Departure board"
            >
              <div className={`${styles.boardRow} ${styles.listHead}`} role="row">
                <span data-edit="departures.text" data-edit-max="60" role="columnheader">Departs</span>
                <span data-edit="departures.text2" data-edit-max="60" role="columnheader">Line</span>
                <span data-edit="departures.text3" data-edit-max="60" role="columnheader">Destination</span>
                <span data-edit="departures.text4" data-edit-max="60" role="columnheader">Platform</span>
                <span data-edit="departures.text5" data-edit-max="60" role="columnheader">Status</span>
              </div>
              {DEPARTURES.map((d, i) => (
                <div
                  key={`${d.time}-${d.line}`}
                  className={styles.boardRow}
                  role="row"
                >
                  <span data-edit={`departures.boardTime.${i}`} data-edit-max="60" className={styles.boardTime} role="cell">
                    {d.time}
                  </span>
                  <span data-edit={`departures.boardLine.${i}`} data-edit-max="60" className={styles.boardLine} role="cell">
                    {d.line}
                  </span>
                  <span data-edit={`departures.text6.${i}`} data-edit-max="60" role="cell">{d.dest}</span>
                  <span data-edit={`departures.boardNum.${i}`} data-edit-max="60" className={styles.boardNum} role="cell">
                    {d.platform}
                  </span>
                  <span data-edit={`departures.statusLate.${i}`} data-edit-max="60"
                    className={d.late ? styles.statusLate : styles.statusOk}
                    role="cell"
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.boardNotes}>
              <p data-edit="departures.body" data-edit-max="240" data-edit-multiline>
                Platforms 1 and 2 are on the harbour side. Platforms 3 to 5 are
                reached by the underpass at the north end of the concourse, or
                by lift from the ticket hall.
              </p>
              <p data-edit="departures.body2" data-edit-max="240" data-edit-multiline>
                A service shown as short formation runs with one coach instead
                of two. Seating is reduced by roughly half; the bicycle spaces
                are unaffected.
              </p>
            </div>
          </div>
        </section>

        {/* 04 Fares */}
        {/* Departure-board lattice, run slim across the page. */}
        <div className={styles.bleed}>
          <div data-edit-pattern="main.field3" data-edit-roles="4,3,1" className={styles.bandSlim}>
            <TabbiedPattern
              pattern={dotmatrix}
              palette={[PALE, STEEL, INK]}
              seed="ln-band-04"
              options={{ grid: '4x6', frequency: 0.75 }}
              fit="grid"
              cellSize={34}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </div>

        <section
          id="fares"
          className={styles.section}
          aria-labelledby="fares-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span data-edit="fares.secNo" data-edit-max="60" className={styles.secNo}>04</span>
              <h2 data-edit="fares.secTitle" data-edit-max="60" id="fares-title" className={styles.secTitle}>
                Fares and zones
              </h2>
            </div>

            <div className={styles.matrixCol}>
              <h3 data-edit="fares.subTitle" data-edit-max="40" className={styles.subTitle}>Single fare in euro</h3>
              <div
                className={styles.matrix}
                role="table"
                aria-label="Single fare by zone pair"
              >
                <span data-edit="fares.matrixCorner" data-edit-max="60" className={styles.matrixCorner} role="columnheader">
                  From / To
                </span>
                {ZONES.map((z, i) => (
                  <span data-edit={`fares.matrixHead.${i}`} data-edit-max="60" key={`h-${z}`} className={styles.matrixHead} role="columnheader">
                    {z}
                  </span>
                ))}
                {ZONES.map((row, i) => (
                  <div key={row} className={styles.matrixRow} role="row">
                    <span data-edit={`fares.matrixHead2.${i}`} data-edit-max="60" className={styles.matrixHead} role="rowheader">
                      {row}
                    </span>
                    {ZONES.map((col, i2) => (
                      <span data-edit={`fares.matrixCell.${i}.${i2}`} data-edit-max="60"
                        key={`${row}${col}`}
                        className={
                          row === col
                            ? `${styles.matrixCell} ${styles.matrixCellSame}`
                            : styles.matrixCell
                        }
                        role="cell"
                      >
                        {FARE_MATRIX[row][col]}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <p data-edit="fares.note" data-edit-max="240" data-edit-multiline className={styles.note}>
                Zone A covers the city and the harbour. Zone B runs to the
                viaduct, zone C to Bergkamp, zone D to Grenselund and the upper
                valley. A journey is priced on the zones entered, not on
                distance.
              </p>
            </div>

            <div className={styles.ticketCol}>
              <h3 data-edit="fares.subTitle2" data-edit-max="40" className={styles.subTitle}>Tickets</h3>
              <dl className={styles.priceList}>
                {TICKETS.map((t, i) => (
                  <div key={t.name} className={styles.priceRow}>
                    <dt data-edit={`fares.term.${i}`} data-edit-max="28">{t.name}</dt>
                    <dd data-edit={`fares.body.${i}`} data-edit-max="200" data-edit-multiline>{t.price}</dd>
                  </div>
                ))}
              </dl>
              <p data-edit="fares.flag" data-edit-max="240" data-edit-multiline className={styles.flag}>
                Children under six travel free. Under 18 pay half.
              </p>
              <p data-edit="fares.note2" data-edit-max="240" data-edit-multiline className={styles.note}>
                Sold at staffed windows, at every validator machine, and on the
                authority app. Cash is accepted at the eleven staffed windows
                only.
              </p>
            </div>
          </div>
        </section>

        {/* 05 Accessibility */}
        <section
          id="access"
          className={styles.section}
          aria-labelledby="access-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span data-edit="access.secNo" data-edit-max="60" className={styles.secNo}>05</span>
              <h2 data-edit="access.secTitle" data-edit-max="60" id="access-title" className={styles.secTitle}>
                Accessibility
              </h2>
            </div>

            <div className={styles.accessText}>
              <p data-edit="access.body" data-edit-max="240" data-edit-multiline>
                Seven stops are not yet step-free: Speicherreihe, Hüttenwerk,
                Talstation, Werftinsel Nord, Grenselund Dorf, Bergkamp Ost and
                Nordbad. Work at Nordbad begins 06 Oct 2026 and is funded. The
                remaining six are scheduled between 2027 and 2031.
              </p>
              <p data-edit="access.body2" data-edit-max="240" data-edit-multiline>
                Staff assistance can be booked with 60 minutes notice between
                06:00 and 22:00 on 0800 41 41 41, or at any staffed window.
                Booked assistance is met at the platform, not at the entrance.
              </p>
            </div>

            <dl className={styles.pairs}>
              {ACCESS_FACTS.map((f, i) => (
                <div key={f.label}>
                  <dt data-edit={`access.term.${i}`} data-edit-max="28">{f.label}</dt>
                  <dd data-edit={`access.body3.${i}`} data-edit-max="200" data-edit-multiline>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 06 Onboard */}
        <section
          id="onboard"
          className={styles.section}
          aria-labelledby="onboard-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span data-edit="onboard.secNo" data-edit-max="60" className={styles.secNo}>06</span>
              <h2 data-edit="onboard.secTitle" data-edit-max="60" id="onboard-title" className={styles.secTitle}>
                Onboard
              </h2>
            </div>

            <figure className={styles.onboardPhoto}>
              <div className={styles.frameWide}>
                <Figure editId="photo.linie-interior"
                  slug="linie-interior"
                  alt="The interior of a modern railcar with grey seating, grab poles and daylight from wide windows"
                  className={styles.img}
                />
              </div>
              <figcaption data-edit="onboard.caption" data-edit-max="120" data-edit-multiline>
                Type 4 interior. 176 places, 48 of them seated.
              </figcaption>
            </figure>

            <div className={styles.validatorCol}>
              <div data-edit-pattern="onboard.field" data-edit-roles="0,3,4" className={styles.frameTall}>
                <TabbiedPattern
                  pattern={dotmatrix}
                  palette={[CONCRETE, STEEL, PALE]}
                  seed="ln-valid-06"
                  options={{ grid: '4x6', frequency: 0.85 }}
                  fit="grid"
                  cellSize={30}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <div className={styles.veil} aria-hidden="true" />
                <Figure editId="photo.linie-validator-cutout"
                  slug="linie-validator-cutout"
                  cutout
                  alt="A yellow ticket validator unit with a card reader, isolated on a plain field"
                  className={styles.cutout}
                />
              </div>
              <p data-edit="onboard.tileNote" data-edit-max="240" data-edit-multiline className={styles.tileNote}>
                Validator, type V3. One at each door.
              </p>
            </div>

            <dl className={styles.pairsWide}>
              {ONBOARD.map((o, i) => (
                <div key={o.label}>
                  <dt data-edit={`onboard.term.${i}`} data-edit-max="28">{o.label}</dt>
                  <dd data-edit={`onboard.body.${i}`} data-edit-max="200" data-edit-multiline>{o.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 07 Staff */}
        <section
          id="staff"
          className={styles.section}
          aria-labelledby="staff-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span data-edit="staff.secNo" data-edit-max="60" className={styles.secNo}>07</span>
              <h2 data-edit="staff.secTitle" data-edit-max="60" id="staff-title" className={styles.secTitle}>
                The people who run it
              </h2>
            </div>

            <div className={styles.staffRow}>
              {STAFF.map((p, i) => (
                <figure key={p.slug} className={styles.staffCard}>
                  <div className={styles.framePortrait}>
                    <Figure editId={`staff.photo.${i}`} slug={p.slug} alt={p.alt} className={styles.img} />
                  </div>
                  <figcaption>
                    <strong data-edit={`staff.staffName.${i}`} className={styles.staffName}>{p.name}</strong>
                    <span data-edit={`staff.staffRole.${i}`} data-edit-max="60" className={styles.staffRole}>{p.role}</span>
                    <span data-edit={`staff.staffSince.${i}`} data-edit-max="60" className={styles.staffSince}>{p.since}</span>
                    <span data-edit={`staff.staffNote.${i}`} data-edit-max="60" className={styles.staffNote}>{p.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className={styles.staffText}>
              <p data-edit="staff.body" data-edit-max="240" data-edit-multiline>
                The authority employs 612 people. 214 drive, 96 maintain the
                fleet at Kaltenmoor, 71 work on track and structures, 84 staff
                the windows and the control room, and the remainder plan,
                account and answer the telephone.
              </p>
              <p data-edit="staff.body2" data-edit-max="240" data-edit-multiline>
                Recruitment for the 2027 driver intake opens 02 Nov 2026.
                Training runs 14 months, is paid from the first day, and
                requires no previous rail experience.
              </p>
              <p data-edit="staff.note" data-edit-max="240" data-edit-multiline className={styles.note}>
                Vacancies: personal@linienord.example
              </p>
            </div>
          </div>
        </section>

        {/* 08 Updates */}
        <section
          id="updates"
          className={styles.section}
          aria-labelledby="updates-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span data-edit="updates.secNo" data-edit-max="60" className={styles.secNo}>08</span>
              <h2 data-edit="updates.secTitle" data-edit-max="60" id="updates-title" className={styles.secTitle}>
                Service updates
              </h2>
            </div>

            <ul className={styles.updates}>
              {UPDATES.map((u, i) => (
                <li key={u.title} className={styles.update}>
                  <span data-edit={`updates.updateDate.${i}`} data-edit-max="60" className={styles.updateDate}>{u.date}</span>
                  <div className={styles.updateBody}>
                    <h3 data-edit={`updates.updateTitle.${i}`} data-edit-max="40" className={styles.updateTitle}>{u.title}</h3>
                    <p data-edit={`updates.body.${i}`} data-edit-max="240" data-edit-multiline>{u.body}</p>
                  </div>
                  <span data-edit={`updates.chip.${i}`} data-edit-max="60"
                    className={
                      u.flag
                        ? `${styles.chip} ${styles.chipFlag}`
                        : styles.chip
                    }
                  >
                    {u.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="5,3,4,0" className={styles.footerField} aria-hidden="true">
          <TabbiedPattern
            pattern={ortho}
            palette={[DARK, STEEL, PALE, CONCRETE]}
            seed="ln-foot-09"
            options={{ grid: '6x9', frequency: 0.8 }}
            fit="grid"
            cellSize={48}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={`${styles.container} ${styles.grid} ${styles.footerGrid}`}>
          <div className={styles.footBrand}>
            <p data-edit="footer.footWordmark" data-edit-max="240" data-edit-multiline className={styles.footWordmark}>Linie Nord</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={styles.footTag}>
              Regional transit authority of the Steinhafen basin, operating
              since 01 January 1975.
            </p>
          </div>
          <div className={styles.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={styles.footHead}>Head office</h2>
            <address className={styles.footAddress}>
              Bahnhofstrasse 4
              <br />
              24 Steinhafen
              <br />
              auskunft@linienord.example
              <br />
              0800 41 41 41
            </address>
          </div>
          <div className={styles.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={styles.footHead}>Opening times</h2>
            <p className={styles.footList}>
              Ticket hall 05:00 to 23:30
              <br />
              Windows, weekdays 06:30 to 19:00
              <br />
              Windows, Saturday 08:00 to 14:00
              <br />
              Lost property, weekdays 08:00 to 18:00
            </p>
          </div>
          <div className={styles.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={styles.footHead}>Elsewhere</h2>
            <ul className={styles.footLinks}>
              <li>
                <a data-edit="footer.lines" data-edit-max="28" href="#lines">Line listing</a>
              </li>
              <li>
                <a data-edit="footer.fares" data-edit-max="28" href="#fares">Zone map and fares</a>
              </li>
              <li>
                <a data-edit="footer.access" data-edit-max="28" href="#access">Assistance booking</a>
              </li>
              <li>
                <a data-edit="footer.updates" data-edit-max="28" href="#updates">Current disruptions</a>
              </li>
            </ul>
          </div>
          <div className={styles.footBase}>
            <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>
              Published by Verkehrsbetrieb Steinhafen. Timetable data correct at
              01 Aug 2026.
            </p>
            <p>
              Patterns by{' '}
              <a data-edit="footer.link" data-edit-max="28"
                href="https://tabbied.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Tabbied
              </a>
              . Design fiction, not a real operator.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
