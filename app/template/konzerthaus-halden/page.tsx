import { TabbiedPattern } from 'tabbied/react';
import { crescendo, diminuendo, gravure, ortho } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './konzerthaus-halden.module.css';

export const metadata = {
  title: 'Konzerthaus Halden: Season 2026/27',
  description:
    'Konzerthaus Halden, Haldenplatz 4. Ninety-two concerts between September 2026 and June 2027 in a 1,412-seat hall of 1964. Tickets from CHF 15, under 30 flat rate CHF 15.',
};

/* The six house colours. Every pattern field on the page draws from this set
   and nothing else: fields differ only in which of the six leads. */
const PAPER = '#F2F1EE';
const INK = '#111111';
const RED = '#E1261C';
const GREY = '#8C8C88';
const PALE = '#D8D7D2';
const WARM = '#B9B4A8';

/* Background first. Each field is a reordering or subset of the six above:
   red leads only where the accent is meant to be read. */
const FIELD_HERO = [PAPER, RED];
const FIELD_QUIET = [PALE, INK];
const FIELD_BAND = [PAPER, WARM, PALE, GREY];
const FIELD_STRIP = [PAPER, INK, GREY, PALE, WARM];
const FIELD_EDU = [PAPER, RED, GREY, PALE];
const FIELD_DARK = [INK, RED, WARM, GREY, PALE, PAPER];

const NAV = [
  { no: '01', label: 'Season', href: '#season' },
  { no: '02', label: 'Programme', href: '#programme' },
  { no: '03', label: 'Hall', href: '#hall' },
  { no: '04', label: 'Artists', href: '#artists' },
  { no: '05', label: 'Education', href: '#education' },
  { no: '06', label: 'Tickets', href: '#tickets' },
  { no: '07', label: 'Visit', href: '#visit' },
];

type Concert = {
  no: string;
  day: string;
  date: string;
  time: string;
  title: string;
  detail: string;
  artists: string;
  hall: string;
  price: string;
};

const PROGRAMME: Concert[] = [
  {
    no: '01',
    day: 'Fri',
    date: '11.09.2026',
    time: '19.30',
    title: 'Bruckner, Symphony No. 7',
    detail: 'Season opening. Wagner, Siegfried Idyll',
    artists: 'Halden Philharmonic, Ines Vogler',
    hall: 'Grosser Saal',
    price: 'CHF 25-110',
  },
  {
    no: '02',
    day: 'Sat',
    date: '26.09.2026',
    time: '20.00',
    title: 'Ligeti, Kurtág, Bartók',
    detail: 'String quartets of 1928 to 1994',
    artists: 'Quatuor Aveline',
    hall: 'Kammersaal',
    price: 'CHF 40',
  },
  {
    no: '03',
    day: 'Thu',
    date: '15.10.2026',
    time: '19.30',
    title: 'Mahler, Symphony No. 4',
    detail: 'Berg, Seven Early Songs',
    artists: 'Halden Philharmonic, Tomás Berrio',
    hall: 'Grosser Saal',
    price: 'CHF 30-125',
  },
  {
    no: '04',
    day: 'Sun',
    date: '08.11.2026',
    time: '17.00',
    title: 'Bach, the organ at 60',
    detail: 'Preludes and fugues, Trio Sonata No. 5',
    artists: 'Marthe Solberg, organ',
    hall: 'Grosser Saal',
    price: 'CHF 20-45',
  },
  {
    no: '05',
    day: 'Fri',
    date: '27.11.2026',
    time: '19.30',
    title: 'Sibelius, Violin Concerto',
    detail: 'Nielsen, Symphony No. 4',
    artists: 'Halden Philharmonic, Ines Vogler',
    hall: 'Grosser Saal',
    price: 'CHF 30-125',
  },
  {
    no: '06',
    day: 'Wed',
    date: '16.12.2026',
    time: '19.00',
    title: 'Handel, Messiah',
    detail: 'Period instruments, 34 voices',
    artists: 'Halden Chorus, Bertrand Aeby',
    hall: 'Grosser Saal',
    price: 'CHF 35-120',
  },
  {
    no: '07',
    day: 'Sat',
    date: '23.01.2027',
    time: '20.00',
    title: 'Shostakovich, Cello Concerto No. 1',
    detail: 'Weinberg, Symphony No. 10',
    artists: 'Junia Halvorsen, cello',
    hall: 'Grosser Saal',
    price: 'CHF 30-125',
  },
  {
    no: '08',
    day: 'Thu',
    date: '18.02.2027',
    time: '19.30',
    title: 'Feldman, Rothko Chapel',
    detail: 'Followed by 40 minutes of silence and questions',
    artists: 'Ensemble Halden Neue Musik',
    hall: 'Kammersaal',
    price: 'CHF 40',
  },
  {
    no: '09',
    day: 'Fri',
    date: '19.03.2027',
    time: '19.30',
    title: 'Ravel, Debussy, Dutilleux',
    detail: 'Including one first performance in Halden',
    artists: 'Halden Philharmonic, Ines Vogler',
    hall: 'Grosser Saal',
    price: 'CHF 25-110',
  },
  {
    no: '10',
    day: 'Sat',
    date: '24.04.2027',
    time: '20.00',
    title: 'Beethoven, Symphony No. 9',
    detail: 'Season close. Sold out in 2025 within 11 days',
    artists: 'Philharmonic and Chorus, Ines Vogler',
    hall: 'Grosser Saal',
    price: 'CHF 40-150',
  },
];

const SEASON_FIGURES = [
  { value: '92', label: 'Concerts, Sept 2026 to June 2027' },
  { value: '18', label: 'First performances in Halden' },
  { value: '41', label: 'Visiting ensembles and soloists' },
  { value: '1,412', label: 'Seats in the Grosser Saal' },
];

const HALL_SPECS = [
  { label: 'Built', value: '1961-1964' },
  { label: 'Architect', value: 'Elsa Reinhardt' },
  { label: 'Acoustic refit', value: '2019, Kessler + Ost' },
  { label: 'Seats, Grosser Saal', value: '1,412' },
  { label: 'Seats, Kammersaal', value: '260' },
  { label: 'Reverberation, occupied', value: '2.1 s' },
  { label: 'Reverberation, empty', value: '2.6 s' },
  { label: 'Stage area', value: '214 m²' },
];

const ORGAN_SPECS = [
  { label: 'Builder', value: 'Kuhn, Männedorf' },
  { label: 'Installed', value: '1966' },
  { label: 'Stops', value: '62' },
  { label: 'Pipes', value: '4,388' },
  { label: 'Manuals', value: '4 and pedal' },
];

const RESIDENTS = [
  {
    slug: 'halden-conductor',
    alt: 'Studio portrait of conductor Ines Vogler, short grey hair, dark jacket with a red collar',
    name: 'Ines Vogler',
    role: 'Chief Conductor',
    since: 'Appointed 2023, contract to 2030',
    body: 'Vogler conducts 22 of the 92 concerts this season, including the opening Bruckner and the closing Ninth. She rehearses with the doors open on Thursday mornings and expects the hall to be used, not admired.',
  },
  {
    slug: 'halden-soloist',
    alt: 'Studio portrait of cellist Junia Halvorsen in a dark roll-neck against a plain wall',
    name: 'Junia Halvorsen',
    role: 'Artist in Residence 2026/27',
    since: 'One season, six appearances',
    body: 'Halvorsen plays the Shostakovich in January, two chamber programmes in the Kammersaal, and three unannounced 20-minute recitals in the foyer. Foyer recitals are free and are not listed in advance.',
  },
];

const EDUCATION = [
  {
    no: '01',
    title: 'Open rehearsals',
    body: 'Fourteen Thursday mornings, 10.00 to 12.30. Free, no booking, come and go. Doors on Gerberstrasse.',
    figure: '14 dates',
  },
  {
    no: '02',
    title: 'Schools programme',
    body: 'Years 3 to 9. Two visits from a player, then a concert in the hall. Transport paid within the canton.',
    figure: '42 schools, 6,100 pupils',
  },
  {
    no: '03',
    title: 'Instrument library',
    body: 'Instruments on loan for a year at a time, CHF 40 including insurance. Waiting list runs to about five months.',
    figure: '180 instruments',
  },
  {
    no: '04',
    title: 'Under 30',
    body: 'Any unsold seat, any concert, CHF 15. Released 14 days before the date, in person or online.',
    figure: 'CHF 15 flat',
  },
];

const TICKET_ROWS = [
  { label: 'Price bands, Grosser Saal', value: 'CHF 25 / 45 / 70 / 95 / 125 / 150' },
  { label: 'Price, Kammersaal', value: 'CHF 40, unreserved seating' },
  { label: 'Subscription, six concerts', value: '20 per cent off, seat held to 2030' },
  { label: 'Under 30', value: 'CHF 15, from 14 days before' },
  { label: 'Companion seat', value: 'Free with a registered ticket' },
  { label: 'Exchange', value: 'Up to 48 hours before, CHF 5 per ticket' },
  { label: 'Box office', value: 'Tue to Fri 12.00-18.30, Sat 10.00-14.00' },
  { label: 'Telephone', value: '+41 44 512 60 00' },
];

const TRAVEL = [
  { label: 'Address', value: 'Haldenplatz 4, 8032 Halden' },
  { label: 'Tram', value: 'Lines 3 and 8, stop Haldenplatz' },
  { label: 'Rail', value: 'S6 to Halden Nord, then 7 minutes on foot' },
  { label: 'Parking', value: 'Parkhaus Haldenplatz, 240 spaces, entrance Gerberstrasse' },
  { label: 'Doors', value: 'Open 45 minutes before the start' },
  { label: 'Latecomers', value: 'Admitted at the first suitable break' },
  { label: 'Cloakroom', value: 'Free, staffed until 30 minutes after the end' },
  { label: 'Step-free access', value: 'Haldenplatz entrance, lift to all levels' },
];

function SectionNumber({ n }: { n: string }) {
  return (
    <p className={s.sectionNo} aria-hidden="true">
      {n}
    </p>
  );
}

export default function KonzerthausHaldenPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f2f1ee',
        '--ink': '#111111',
        '--red': '#e1261c',
        '--grey': '#8c8c88',
        '--pale': '#d8d7d2',
        '--warm': '#b9b4a8',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,red,grey,pale,warm"
      className={s.page}>
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

      <header className={s.masthead}>
        <div className={s.wrap}>
          <div className={s.grid}>
            <p data-edit="masthead.wordmark" data-edit-max="240" data-edit-multiline className={s.wordmark}>Konzerthaus Halden</p>
            <p className={s.mastheadMeta}>
              Haldenplatz 4, 8032 Halden
              <br />
              Box office +41 44 512 60 00
            </p>
            <nav className={s.nav} aria-label="Sections">
              <ul>
                {NAV.map((item, i) => (
                  <li key={item.no}>
                    <a href={item.href}>
                      <span data-edit={`masthead.navNo.${i}`} data-edit-max="60" className={s.navNo}>{item.no}</span> {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={s.hero} aria-labelledby="t-hero">
          <div className={s.wrap}>
            <div className={s.grid}>
              <div className={s.heroType}>
                <p data-edit="tHero.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Season 2026/27</p>
                <h1 data-edit="tHero.title" data-edit-max="70" id="t-hero">
                  Ninety-two concerts in a room built to be heard from every
                  seat.
                </h1>
                <p data-edit="tHero.lead" data-edit-max="240" data-edit-multiline className={s.lead}>
                  Halden opened its hall in 1964 with a Bruckner Seventh and has
                  played one every September since. The 2026/27 season runs from
                  11 September to 24 April, with eighteen first performances and
                  a flat rate of CHF 15 for anyone under 30.
                </p>
                <p className={s.heroActions}>
                  <a data-edit="tHero.button" data-edit-max="28" className={s.button} href="#programme">
                    See the programme
                  </a>
                  <a data-edit="tHero.textLink" data-edit-max="28" className={s.textLink} href="#tickets">
                    Subscriptions and prices
                  </a>
                </p>
              </div>
              <figure className={s.heroArt}>
                <Figure editId="photo.halden-poster"
                  slug="halden-poster"
                  alt="The season poster mounted on a pale foyer wall in raking daylight"
                  className={s.photo}
                />
                <figcaption data-edit="tHero.caption" data-edit-max="120" data-edit-multiline className={s.caption}>
                  Fig. 1. The season poster in the foyer. The same dynamic ramp,
                  pianissimo to fortissimo, has run on every one since 2019.
                </figcaption>
              </figure>
            </div>
          </div>
          <div className={s.heroImage}>
            <Figure editId="photo.halden-hero"
              slug="halden-hero"
              alt="The Grosser Saal of Konzerthaus Halden seen from the rear stalls, lights up before a concert"
              priority
              className={s.bleedPhoto}
            />
          </div>
        </section>

        {/* 01 Season */}
        <section id="season" className={s.section} aria-labelledby="t-season">
          <div className={s.wrap}>
            <div className={s.grid}>
              <SectionNumber n="01" />
              <h2 data-edit="season.sectionTitle" data-edit-max="60" id="t-season" className={s.sectionTitle}>
                A season is a shape, not a shopping list.
              </h2>
              <div className={s.seasonBodyA}>
                <p data-edit="season.body" data-edit-max="240" data-edit-multiline>
                  We programme in arcs. The autumn is late romantic and loud
                  because the hall was designed for that repertoire and still
                  answers to it. Winter narrows: chamber music in the Kammersaal,
                  the organ, one long evening of Feldman. Spring opens out again
                  and ends with the Ninth, as it has done in eleven of the last
                  fourteen seasons.
                </p>
                <p data-edit="season.body2" data-edit-max="240" data-edit-multiline>
                  Nothing is programmed to fill a gap. If a date has no argument
                  behind it, the date stays empty and the hall is given to the
                  education department instead.
                </p>
              </div>
              <div className={s.seasonBodyB}>
                <p data-edit="season.body3" data-edit-max="240" data-edit-multiline>
                  Subscriptions open on 6 May 2026, single tickets on 3 June.
                  Renewal has run at 62 per cent for three seasons, which means
                  roughly 340 subscription seats reach the public each year.
                </p>
                <p data-edit="season.body4" data-edit-max="240" data-edit-multiline>
                  The full printed season book, 96 pages, is free at the box
                  office and posted anywhere in Switzerland on request.
                </p>
              </div>
              <div className={s.seasonArt}>
                <div data-edit-pattern="season.field" data-edit-roles="4,1" className={`${s.artField} ${s.fieldPale}`} aria-hidden="true">
                  <TabbiedPattern
                    pattern={crescendo}
                    palette={FIELD_QUIET}
                    seed="kh-season-2"
                    fit="cover"
                    options={{ grid: '6x9' }}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
              </div>
              <ul className={s.figures}>
                {SEASON_FIGURES.map((f, i) => (
                  <li key={f.label}>
                    <span data-edit={`season.figureValue.${i}`} data-edit-max="60" className={s.figureValue}>{f.value}</span>
                    <span data-edit={`season.figureLabel.${i}`} data-edit-max="60" className={s.figureLabel}>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Band: pattern field with cello cut-out */}
        <div className={s.band}>
          <div data-edit-pattern="main.field" data-edit-roles="0,5,4,3" className={s.bandField} aria-hidden="true">
            <TabbiedPattern
              pattern={diminuendo}
              palette={FIELD_BAND}
              seed="kh-band-3"
              fit="cover"
              options={{ grid: '10x15', frequency: 0.9 }}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.wrap}>
            <div className={s.grid}>
              <p data-edit="main.bandNote" data-edit-max="240" data-edit-multiline className={s.bandNote}>
                Instruments belonging to the house are lent to residents and to
                the instrument library. The 1911 Bergonzi copy below has been in
                Halden since 1968.
              </p>
              <div className={s.bandCutout}>
                <span className={s.veil} aria-hidden="true" />
                <Figure editId="photo.halden-cello-cutout"
                  slug="halden-cello-cutout"
                  cutout
                  alt="A cello standing upright, cut out against the pattern field"
                  className={s.cutoutPhoto}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 02 Programme */}
        <section
          id="programme"
          className={s.section}
          aria-labelledby="t-programme"
        >
          <div className={s.wrap}>
            <div className={s.grid}>
              <SectionNumber n="02" />
              <h2 data-edit="programme.sectionTitle" data-edit-max="60" id="t-programme" className={s.sectionTitle}>
                Programme, September 2026 to April 2027.
              </h2>
              <p data-edit="programme.sectionNote" data-edit-max="240" data-edit-multiline className={s.sectionNote}>
                Ten of ninety-two dates. Times are start times. Prices are the
                lowest and highest band for that date, before any reduction.
              </p>
            </div>

            <div className={s.programmeHead} aria-hidden="true">
              <span data-edit="programme.colDate" data-edit-max="60" className={s.colDate}>Date</span>
              <span data-edit="programme.colTime" data-edit-max="60" className={s.colTime}>Time</span>
              <span data-edit="programme.colWork" data-edit-max="60" className={s.colWork}>Programme</span>
              <span data-edit="programme.colArtist" data-edit-max="60" className={s.colArtist}>Artists</span>
              <span data-edit="programme.colPrice" data-edit-max="60" className={s.colPrice}>Price</span>
            </div>
            <span className={s.rule} aria-hidden="true" />

            <ol className={s.programme}>
              {PROGRAMME.map((c, i) => (
                <li key={c.no} className={s.concert}>
                  <span className={s.colDate}>
                    <span data-edit={`programme.concertNo.${i}`} data-edit-max="60" className={s.concertNo}>{c.no}</span>
                    <span data-edit={`programme.concertDay.${i}`} data-edit-max="60" className={s.concertDay}>{c.day}</span>{' '}
                    <span data-edit={`programme.tabular.${i}`} data-edit-max="60" className={s.tabular}>{c.date}</span>
                  </span>
                  <span data-edit={`programme.colTime2.${i}`} data-edit-max="60" className={`${s.colTime} ${s.tabular}`}>{c.time}</span>
                  <span className={s.colWork}>
                    <span data-edit={`programme.concertTitle.${i}`} data-edit-max="60" className={s.concertTitle}>{c.title}</span>
                    <span data-edit={`programme.concertDetail.${i}`} data-edit-max="60" className={s.concertDetail}>{c.detail}</span>
                  </span>
                  <span className={s.colArtist}>
                    {c.artists}
                    <span data-edit={`programme.concertHall.${i}`} data-edit-max="60" className={s.concertHall}>{c.hall}</span>
                  </span>
                  <span data-edit={`programme.colPrice2.${i}`} data-edit-max="60" className={`${s.colPrice} ${s.tabular}`}>{c.price}</span>
                </li>
              ))}
            </ol>

            <div className={s.grid}>
              <p data-edit="programme.programmeFoot" data-edit-max="240" data-edit-multiline className={s.programmeFoot}>
                The remaining 82 dates are listed in the season book and at the
                box office. Foyer recitals are not listed anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Full-width ruled strip: the seat plan, reduced to its lines */}
        <div className={s.strip}>
          <div data-edit-pattern="main.field2" data-edit-roles="0,1,3,4,5" className={`${s.stripField} ${s.fieldPaper}`} aria-hidden="true">
            <TabbiedPattern
              pattern={ortho}
              palette={FIELD_STRIP}
              seed="kh-strip-4"
              fit="grid"
              cellSize={44}
              options={{ frequency: 1 }}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </div>

        {/* 03 Hall */}
        <section id="hall" className={s.section} aria-labelledby="t-hall">
          <div className={s.wrap}>
            <div className={s.grid}>
              <SectionNumber n="03" />
              <h2 data-edit="hall.sectionTitle" data-edit-max="60" id="t-hall" className={s.sectionTitle}>
                The hall, and what it does to a sound.
              </h2>
              <div className={s.hallText}>
                <p data-edit="hall.body" data-edit-max="240" data-edit-multiline>
                  Reinhardt built a shoebox, narrow and tall, and refused the
                  fan shape that was fashionable in 1961. The side walls are
                  ribbed oak over 90 mm of plaster, which is heavy enough to
                  return the bass rather than absorb it. The result is a room
                  that flatters a string section and forgives a brass section
                  nothing.
                </p>
                <p data-edit="hall.body2" data-edit-max="240" data-edit-multiline>
                  The 2019 refit changed very little on purpose: a new stage
                  riser system, 140 replaced seats with matched absorption, and
                  the removal of a 1988 canopy that had been dulling the upper
                  balcony for thirty years.
                </p>
              </div>
              <div className={s.hallPhoto}>
                <Figure editId="photo.halden-orchestra"
                  slug="halden-orchestra"
                  alt="The orchestra on stage from a high side balcony, players in dark clothing under warm light"
                  className={s.photo}
                />
                <p data-edit="hall.caption" data-edit-max="240" data-edit-multiline className={s.caption}>
                  Grosser Saal, full orchestra layout. 214 m² of stage, risers
                  at 200 mm.
                </p>
              </div>
              <dl className={`${s.specList} ${s.hallSpecs}`}>
                {HALL_SPECS.map((spec, i) => (
                  <div key={spec.label} className={s.specRow}>
                    <dt data-edit={`hall.term.${i}`} data-edit-max="28">{spec.label}</dt>
                    <dd data-edit={`hall.tabular.${i}`} data-edit-max="200" data-edit-multiline className={s.tabular}>{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <div className={s.organPhoto}>
                <Figure editId="photo.halden-organ"
                  slug="halden-organ"
                  alt="The organ facade rising above the choir seats, pipes in vertical ranks"
                  className={s.photo}
                />
              </div>
              <div className={s.organText}>
                <h3 data-edit="hall.title" data-edit-max="40">The organ</h3>
                <dl className={`${s.specList} ${s.organSpecs}`}>
                  {ORGAN_SPECS.map((spec, i) => (
                    <div key={spec.label} className={s.specRow}>
                      <dt data-edit={`hall.term2.${i}`} data-edit-max="28">{spec.label}</dt>
                      <dd data-edit={`hall.tabular2.${i}`} data-edit-max="200" data-edit-multiline className={s.tabular}>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                <p data-edit="hall.body3" data-edit-max="240" data-edit-multiline>
                  Tuned twice a year, in March and in September, over four
                  nights each time. The instrument is available to students of
                  the conservatory on Monday afternoons at no charge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 Artists */}
        <section id="artists" className={s.section} aria-labelledby="t-artists">
          <div className={s.wrap}>
            <div className={s.grid}>
              <SectionNumber n="04" />
              <h2 data-edit="artists.sectionTitle" data-edit-max="60" id="t-artists" className={s.sectionTitle}>
                Artists in residence.
              </h2>
              <p data-edit="artists.sectionNote" data-edit-max="240" data-edit-multiline className={s.sectionNote}>
                Two residencies a season. Both are expected in the building, not
                only on the stage.
              </p>
            </div>
            <div className={`${s.grid} ${s.residentsRow}`}>
              {RESIDENTS.map((r, i) => (
                <article
                  key={r.name}
                  className={i === 0 ? s.residentA : s.residentB}
                >
                  <div className={s.portraitFrame}>
                    <Figure editId={`residentA.photo.${i}`} slug={r.slug} alt={r.alt} className={s.portrait} />
                  </div>
                  <h3 data-edit={`residentA.title.${i}`} data-edit-max="40">{r.name}</h3>
                  <p data-edit={`residentA.residentRole.${i}`} data-edit-max="240" data-edit-multiline className={s.residentRole}>{r.role}</p>
                  <p data-edit={`residentA.residentSince.${i}`} data-edit-max="240" data-edit-multiline className={s.residentSince}>{r.since}</p>
                  <p data-edit={`residentA.body.${i}`} data-edit-max="240" data-edit-multiline>{r.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 05 Education */}
        <section
          id="education"
          className={s.section}
          aria-labelledby="t-education"
        >
          <div className={s.wrap}>
            <div className={s.grid}>
              <SectionNumber n="05" />
              <h2 data-edit="education.sectionTitle" data-edit-max="60" id="t-education" className={s.sectionTitle}>
                Education, which is most of what the building does before 18.00.
              </h2>
              <div className={s.eduPhoto}>
                <Figure editId="photo.halden-rehearsal"
                  slug="halden-rehearsal"
                  alt="A morning rehearsal seen from the stalls, chairs and stands set out under working light"
                  className={s.photo}
                />
              </div>
              <div className={s.eduArt}>
                <div data-edit-pattern="education.field" data-edit-roles="0,2,3,4" className={`${s.artField} ${s.fieldPaper}`} aria-hidden="true">
                  <TabbiedPattern
                    pattern={ortho}
                    palette={FIELD_EDU}
                    seed="kh-edu-5"
                    fit="cover"
                    options={{ grid: '6x9', frequency: 0.8 }}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
              </div>
              <ol className={s.eduList}>
                {EDUCATION.map((e, i) => (
                  <li key={e.no}>
                    <span data-edit={`education.eduNo.${i}`} data-edit-max="60" className={s.eduNo}>{e.no}</span>
                    <h3 data-edit={`education.title.${i}`} data-edit-max="40">{e.title}</h3>
                    <p data-edit={`education.body.${i}`} data-edit-max="240" data-edit-multiline>{e.body}</p>
                    <p data-edit={`education.eduFigure.${i}`} data-edit-max="240" data-edit-multiline className={s.eduFigure}>{e.figure}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 06 Tickets */}
        <section id="tickets" className={s.section} aria-labelledby="t-tickets">
          <div className={s.wrap}>
            <div className={s.grid}>
              <SectionNumber n="06" />
              <h2 data-edit="tickets.sectionTitle" data-edit-max="60" id="t-tickets" className={s.sectionTitle}>
                Tickets.
              </h2>
              <div className={s.ticketIntro}>
                <p data-edit="tickets.body" data-edit-max="240" data-edit-multiline>
                  Subscriptions open 6 May 2026 at 09.00. Single tickets open 3
                  June 2026 at 09.00. There is no booking fee, online or at the
                  counter, and there never has been.
                </p>
                <p className={s.heroActions}>
                  <a data-edit="tickets.button" data-edit-max="28" className={s.button} href="#visit">
                    Box office details
                  </a>
                </p>
              </div>
              <dl className={`${s.specList} ${s.ticketSpecs}`}>
                {TICKET_ROWS.map((row, i) => (
                  <div key={row.label} className={s.specRow}>
                    <dt data-edit={`tickets.term.${i}`} data-edit-max="28">{row.label}</dt>
                    <dd data-edit={`tickets.tabular.${i}`} data-edit-max="200" data-edit-multiline className={s.tabular}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* 07 Visit */}
        <section id="visit" className={s.section} aria-labelledby="t-visit">
          <div className={s.wrap}>
            <div className={s.grid}>
              <SectionNumber n="07" />
              <h2 data-edit="visit.sectionTitle" data-edit-max="60" id="t-visit" className={s.sectionTitle}>
                How to find us.
              </h2>
              <dl className={`${s.specList} ${s.travelSpecs}`}>
                {TRAVEL.map((row, i) => (
                  <div key={row.label} className={s.specRow}>
                    <dt data-edit={`visit.term.${i}`} data-edit-max="28">{row.label}</dt>
                    <dd data-edit={`visit.body.${i}`} data-edit-max="200" data-edit-multiline>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className={s.visitPhoto}>
                <Figure editId="photo.halden-foyer"
                  slug="halden-foyer"
                  alt="The foyer at Konzerthaus Halden before a concert, terrazzo floor and a long counter"
                  className={s.photo}
                />
                <p data-edit="visit.caption" data-edit-max="240" data-edit-multiline className={s.caption}>
                  Foyer, Haldenplatz entrance. The counter opens 90 minutes
                  before every concert.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <span className={s.ruleLight} aria-hidden="true" />
          <div className={s.grid}>
            <div className={s.footBrand}>
              <p data-edit="footer.footWordmark" data-edit-max="240" data-edit-multiline className={s.footWordmark}>Konzerthaus Halden</p>
              <p>
                Haldenplatz 4
                <br />
                8032 Halden
                <br />
                Switzerland
              </p>
            </div>
            <div className={s.footContact}>
              <p data-edit="footer.footLabel" data-edit-max="240" data-edit-multiline className={s.footLabel}>Box office</p>
              <p>
                <a data-edit="footer.link" data-edit-max="28" href="tel:+41445126000">+41 44 512 60 00</a>
                <br />
                <a data-edit="footer.link2" data-edit-max="28" href="mailto:kasse@konzerthaus-halden.ch">
                  kasse@konzerthaus-halden.ch
                </a>
                <br />
                Tue to Fri 12.00-18.30
                <br />
                Sat 10.00-14.00
              </p>
            </div>
            <div className={s.footColophon}>
              <p data-edit="footer.footLabel2" data-edit-max="240" data-edit-multiline className={s.footLabel}>Colophon</p>
              <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>
                Konzerthaus Halden AG, founded 1964. Supported by the Canton of
                Halden and 2,140 members of the Freundeskreis. Set in Inter.
                Season pattern generated with Tabbied.
              </p>
            </div>
            <div className={s.footArt}>
              <div data-edit-pattern="footer.field" data-edit-roles="1,2,5,3,4,0" className={`${s.artField} ${s.fieldInk}`} aria-hidden="true">
                <TabbiedPattern
                  pattern={gravure}
                  palette={FIELD_DARK}
                  seed="kh-foot-6"
                  fit="cover"
                  options={{ grid: '6x9', frequency: 0.9 }}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
            </div>
            <p data-edit="footer.footFine" data-edit-max="240" data-edit-multiline className={s.footFine}>
              This is a fictional organisation built to demonstrate Tabbied
              patterns. Prices, dates and people are invented.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
