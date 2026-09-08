import { TabbiedPattern } from 'tabbied/react';
import { ridgeline, terrain } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './cairn-expeditions.module.css';

export const metadata = {
  title: 'Cairn Expeditions · IFMGA Alpine Guiding, Valsorde',
  description:
    'Small rope teams, honest forecasts, seventeen seasons in the Hautes-Cimes. Guided ascents, traverses and ski expeditions with certified alpine guides.',
};

const SLATE = '#10222E';
const ICE = '#A8CEDE';
const SNOW = '#F2F7F9';
const EMBER = '#E8734A';
const TEAL = '#4E7A8C';
const MIST = '#D8E8EF';

const trips = [
  {
    id: 'verre',
    name: 'Aiguille du Verre',
    route: 'North Ridge, integral',
    grade: 'AD',
    gradeNote: 'Assez difficile: sustained II/III rock, exposed crest',
    elevation: '3,842',
    days: '4 days',
    ratio: '2:1',
    season: 'Jun to Sep',
    price: '€1,890',
    slug: 'cairn-summit',
    alt: 'Two climbers moving along a narrow snow ridge toward a rocky summit',
    blurb:
      'A patient line up clean granite to the most photographed crest in the range. We take the extra half-day most parties skip, and it shows on summit morning.',
    includes: 'Hut nights, lift transfers, technical kit check, summit-day rations.',
  },
  {
    id: 'ferrand',
    name: 'Mont Ferrand Traverse',
    route: 'West Arête to Col des Autans',
    grade: 'PD+',
    gradeNote: 'Peu difficile: glacier travel, short mixed steps',
    elevation: '4,067',
    days: '6 days',
    ratio: '2:1',
    season: 'Jul to Sep',
    price: '€2,650',
    slug: 'cairn-valley',
    alt: 'Yellow expedition tents pitched on a rocky moraine below glaciated peaks',
    blurb:
      'Six days above 3,000 metres, hut to hut, with one night on the moraine at Camp Autans. The classic first 4,000er, walked at a pace your legs will thank you for.',
    includes: 'All huts and the moraine camp, glacier kit, rope fees, luggage shuttle.',
  },
  {
    id: 'vallon',
    name: 'Vallon Blanc',
    route: 'Ski expedition, three cols',
    grade: 'SKI / AD-',
    gradeNote: 'Ski alpinism: 35° slopes, crevassed terrain',
    elevation: '3,560',
    days: '5 days',
    ratio: '2:1',
    season: 'Mar to May',
    price: '€2,240',
    slug: 'cairn-night',
    alt: 'A glowing tent under a sky full of stars in a snowy mountain valley',
    blurb:
      'Cold starts, long descents, and one deliberately slow evening under the clearest sky in the massif. Skinning fitness matters more than turns here.',
    includes: 'Winter room fees, avalanche kit, skin wax, one alarmingly early alpine start.',
  },
];

const principles = [
  {
    n: '01',
    title: 'Acclimatize like it matters',
    body: 'Every itinerary carries a spare half-day at altitude. Headaches are data, not weakness, so we build schedules that listen to them.',
  },
  {
    n: '02',
    title: 'Small ropes, long margins',
    body: 'Two climbers to a guide, never more on technical ground. The margin we keep in reserve is the part of the trip you never see, and the part we are proudest of.',
  },
  {
    n: '03',
    title: 'The turnaround is a decision we share',
    body: 'We set the turn time together the night before, in plain numbers. When it arrives, we turn. The summit is optional; the walk down never is.',
  },
];

const stats = [
  { value: '214', label: 'Summits led' },
  { value: '17', label: 'Seasons in Valsorde' },
  { value: '6', label: 'IFMGA guides' },
  { value: '2:1', label: 'Max client ratio' },
];

const gearList = [
  'B2/B3 boots, worn in, not new',
  'Crampons, fitted to the boot you bring',
  'Harness with two 120 cm slings',
  'Headtorch plus spare batteries',
  'Insulated parka, even in August',
  'Hard-shell jacket and trousers',
  '1 L thermos and 1 L bottle',
  'Glacier glasses, category 4',
  'Sunscreen SPF 50, lip balm',
  'No cotton. We will notice.',
];

const rentals = [
  { slug: 'cairn-axe-cutout', alt: 'Classic mountaineering ice axe with steel head and orange grip', name: 'Ice axe', spec: '58 cm · steel head', price: '€9 / day', tall: true },
  { slug: 'cairn-boots-cutout', alt: 'Pair of rigid grey and orange mountaineering boots', name: 'B3 boots', spec: 'EU 36 to 48 · fitted', price: '€14 / day', tall: false },
];

const guides = [
  {
    slug: 'cairn-guide-1',
    alt: 'Portrait of guide Lena Aubry-Storli, blonde braid, orange shell jacket',
    name: 'Lena Aubry-Storli',
    cert: 'IFMGA · since 2011',
    home: 'Valsorde, b. Tromsø',
    line: 'Reads a lenticular cloud the way other people read a timetable. Leads the ski programme and most north faces.',
  },
  {
    slug: 'cairn-guide-2',
    alt: 'Portrait of guide Mateo Quispe, slate fleece jacket',
    name: 'Mateo Quispe',
    cert: 'IFMGA · since 2007',
    home: 'Valsorde, b. Huaraz',
    line: 'Nineteen seasons across the Andes and the Alps. Has never once been late for a sunrise, and will not start now.',
  },
];

const credentials = [
  {
    title: 'IFMGA / UIAGM certification',
    body: 'Every Cairn guide holds the full international mountain guide diploma, the highest qualification the profession has.',
  },
  {
    title: 'Wilderness First Responder',
    body: 'Recertified annually, every guide, no exceptions. Scenario days each November on the Séracs glacier.',
  },
  {
    title: 'Evening forecast briefing',
    body: 'We publish our own avalanche and weather read for clients every evening at 18:00, in writing, with our reasoning.',
  },
  {
    title: 'Satellite comms on every rope',
    body: 'Two-way satellite messengers travel with each rope team, checked and charged at the evening kit review.',
  },
];

const bookingSteps = [
  {
    n: 'I',
    title: 'Write to us',
    body: 'Dates, the trip you have in mind, and an honest note on your experience. Honest is the useful kind.',
  },
  {
    n: 'II',
    title: 'Talk to your guide',
    body: 'A thirty-minute call, not with an office but with the guide who will hold your rope. We match objectives to conditions.',
  },
  {
    n: 'III',
    title: 'Hold your dates',
    body: 'A 30% deposit reserves the rope. The balance is due six weeks out, after the final conditions review.',
  },
];

export default function CairnExpeditionsPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--slate': '#10222e',
        '--slate-2': '#16303f',
        '--slate-3': '#1c3a4c',
        '--ice': '#a8cede',
        '--snow': '#f2f7f9',
        '--ember': '#e8734a',
        '--teal': '#4e7a8c',
        '--mist': '#d8e8ef',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="slate,slate-2,slate-3,ice,snow,ember,teal,mist"
      className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:opsz,wght@14..32,300..700&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />

      <header className={styles.topbar}>
        <a className={styles.brand} href="#top">
          <span className={styles.brandMark} aria-hidden="true">
            ▲▲
          </span>
          Cairn
        </a>
        <nav className={styles.nav} aria-label="Site">
          <a data-edit="topbar.expeditions" data-edit-max="28" href="#expeditions">Expeditions</a>
          <a data-edit="topbar.approach" data-edit-max="28" href="#approach">Approach</a>
          <a data-edit="topbar.gear" data-edit-max="28" href="#gear">Gear</a>
          <a data-edit="topbar.guides" data-edit-max="28" href="#guides">Guides</a>
          <a data-edit="topbar.safety" data-edit-max="28" href="#safety">Safety</a>
        </nav>
        <a data-edit="topbar.navCta" data-edit-max="28" className={styles.navCta} href="#enquire">
          Enquire
        </a>
      </header>

      <main id="top">
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroMedia}>
            <Figure editId="photo.cairn-hero"
              slug="cairn-hero"
              alt="A rope team of alpinists crossing a snowfield at dawn, peaks glowing behind them"
              priority
            />
          </div>
          <div className={styles.heroScrim} aria-hidden="true" />
          <div className={styles.heroInner}>
            <p data-edit="hero.kicker" data-edit-max="240" data-edit-multiline className={styles.kicker}>IFMGA alpine guiding · Valsorde, Hautes-Cimes</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              The mountain sets
              <br />
              the schedule.
              <br />
              <em>We keep it.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={styles.heroLede}>
              Small rope teams, honest forecasts, and seventeen seasons of knowing when to go up
              and when to make tea instead.
            </p>
            <div className={styles.heroActions}>
              <a data-edit="hero.btnPrimary" data-edit-max="28" className={styles.btnPrimary} href="#expeditions">
                See the expeditions
              </a>
              <a data-edit="hero.btnGhost" data-edit-max="28" className={styles.btnGhost} href="#enquire">
                Talk to a guide
              </a>
            </div>
          </div>
          <p className={styles.heroMeta}>
            <span data-edit="hero.text" data-edit-max="60">46.02° N · 7.41° E</span>
            <span data-edit="hero.text2" data-edit-max="60">EST. 2009</span>
            <span data-edit="hero.text3" data-edit-max="60">BUREAU: 14 ROUTE DES SÉRACS</span>
          </p>
        </section>

        <div data-edit-pattern="top.field" data-edit-roles="0,6,3,5,7" className={styles.ridgeDivider} role="presentation">
          <TabbiedPattern
            pattern={ridgeline}
            palette={[SLATE, TEAL, ICE, EMBER, MIST]}
            seed="cairn-divider"
            fit="grid"
          />
        </div>

        {/* EXPEDITIONS */}
        <section id="expeditions" className={styles.section} aria-labelledby="exp-title">
          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionIndex" data-edit-max="240" data-edit-multiline className={styles.sectionIndex}>01 / Expeditions</p>
            <h2 data-edit="sectionHead.sectionTitle" data-edit-max="60" id="exp-title" className={styles.sectionTitle}>
              Three ways up, this season
            </h2>
            <p data-edit="sectionHead.sectionLede" data-edit-max="240" data-edit-multiline className={styles.sectionLede}>
              Set departures with two clients to a rope. Private dates on request; the mountain
              does not mind which calendar you use.
            </p>
          </header>
          <div className={styles.tripGrid}>
            {trips.map((trip, i) => (
              <article key={trip.id} className={styles.tripCard}>
                <div className={styles.tripMedia}>
                  <Figure editId={`tripCard.photo.${i}`} slug={trip.slug} alt={trip.alt} />
                  <span data-edit={`tripCard.gradeBadge.${i}`} data-edit-max="60" className={styles.gradeBadge} title={trip.gradeNote}>
                    {trip.grade}
                  </span>
                </div>
                <div className={styles.tripBody}>
                  <h3 data-edit={`tripCard.tripName.${i}`} data-edit-max="40" className={styles.tripName}>{trip.name}</h3>
                  <p data-edit={`tripCard.tripRoute.${i}`} data-edit-max="240" data-edit-multiline className={styles.tripRoute}>{trip.route}</p>
                  <p className={styles.tripElev}>
                    <span data-edit={`tripCard.tripElevNum.${i}`} data-edit-max="60" className={styles.tripElevNum}>{trip.elevation}</span>
                    <span data-edit={`tripCard.tripElevUnit.${i}`} data-edit-max="60" className={styles.tripElevUnit}>m</span>
                  </p>
                  <dl className={styles.tripSpecs}>
                    <div>
                      <dt data-edit={`tripCard.term.${i}`} data-edit-max="28">Duration</dt>
                      <dd data-edit={`tripCard.body.${i}`} data-edit-max="200" data-edit-multiline>{trip.days}</dd>
                    </div>
                    <div>
                      <dt data-edit={`tripCard.term2.${i}`} data-edit-max="28">Ratio</dt>
                      <dd data-edit={`tripCard.body2.${i}`} data-edit-max="200" data-edit-multiline>{trip.ratio}</dd>
                    </div>
                    <div>
                      <dt data-edit={`tripCard.term3.${i}`} data-edit-max="28">Season</dt>
                      <dd data-edit={`tripCard.body3.${i}`} data-edit-max="200" data-edit-multiline>{trip.season}</dd>
                    </div>
                  </dl>
                  <p data-edit={`tripCard.tripBlurb.${i}`} data-edit-max="240" data-edit-multiline className={styles.tripBlurb}>{trip.blurb}</p>
                  <p data-edit={`tripCard.tripIncludes.${i}`} data-edit-max="240" data-edit-multiline className={styles.tripIncludes}>{trip.includes}</p>
                  <div className={styles.tripFoot}>
                    <span data-edit={`tripCard.tripPrice.${i}`} data-edit-max="60" className={styles.tripPrice}>{trip.price}</span>
                    <a data-edit={`tripCard.tripLink.${i}`} data-edit-max="28" className={styles.tripLink} href="#enquire">
                      Reserve a rope &rarr;
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* APPROACH */}
        <section data-edit-pattern="approach.field" data-edit-roles="0,3,6,5,7" id="approach" className={styles.approach} aria-labelledby="approach-title">
          <TabbiedPattern
            pattern={terrain}
            palette={[SLATE, ICE, TEAL, EMBER, MIST]}
            seed="cairn-approach"
            fit="cover"
            density={1}
            className={styles.approachField}
          />
          <div className={styles.approachScrim} aria-hidden="true" />
          <div className={styles.approachInner}>
            <header className={styles.sectionHead}>
              <p data-edit="sectionHead.sectionIndex2" data-edit-max="240" data-edit-multiline className={styles.sectionIndex}>02 / Approach</p>
              <h2 data-edit="sectionHead.sectionTitle2" data-edit-max="60" id="approach-title" className={styles.sectionTitle}>
                How we guide
              </h2>
            </header>
            <div className={styles.principles}>
              {principles.map((p, i) => (
                <article key={p.n} className={styles.principle}>
                  <span data-edit={`principle.principleNum.${i}`} data-edit-max="60" className={styles.principleNum}>{p.n}</span>
                  <h3 data-edit={`principle.title.${i}`} data-edit-max="40">{p.title}</h3>
                  <p data-edit={`principle.body.${i}`} data-edit-max="240" data-edit-multiline>{p.body}</p>
                </article>
              ))}
            </div>
            <blockquote className={styles.quote}>
              <p data-edit="approach.body" data-edit-max="240" data-edit-multiline>
                "Nobody remembers a fast ascent. Everybody remembers feeling looked after at
                4,000 metres."
              </p>
              <cite data-edit="approach.attribution" data-edit-max="48">The line we hire guides by</cite>
            </blockquote>
          </div>
        </section>

        {/* STATS BAND */}
        <section data-edit-pattern="statsBand.field" data-edit-roles="0,6,3,7,5" className={styles.statsBand} aria-label="Cairn in numbers">
          <TabbiedPattern
            pattern={ridgeline}
            palette={[SLATE, TEAL, ICE, MIST, EMBER]}
            seed="cairn-stats"
            fit="grid"
            cellSize={48}
            className={styles.statsPattern}
            /* Inline, because the package sets width/height:100% inline on the
               wrapper and a class cannot outrank that. Whole multiples of the
               cell (64 × 48px wide, 10 × 48px tall), clipped by the band. 64 is
               css-doodle's hard grid cap, so asking for more columns than that
               silently rescales the cell and puts the seams back. */
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 3072,
              height: 480,
            }}
          />
          <div className={styles.statsInner}>
            {stats.map((s, i) => (
              <div key={s.label} className={styles.stat}>
                <span data-edit={`statsBand.statValue.${i}`} data-edit-max="60" className={styles.statValue}>{s.value}</span>
                <span data-edit={`statsBand.statLabel.${i}`} data-edit-max="60" className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* GEAR */}
        <section id="gear" className={styles.section} aria-labelledby="gear-title">
          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionIndex3" data-edit-max="240" data-edit-multiline className={styles.sectionIndex}>03 / Gear</p>
            <h2 data-edit="sectionHead.sectionTitle3" data-edit-max="60" id="gear-title" className={styles.sectionTitle}>
              What you carry
            </h2>
            <p data-edit="sectionHead.sectionLede2" data-edit-max="240" data-edit-multiline className={styles.sectionLede}>
              We check every pack the evening before departure. Twice, if it is your first
              glacier. The list is short because your shoulders will meet every item on it.
            </p>
          </header>
          <div className={styles.gearLayout}>
            <ul className={styles.gearChecklist}>
              {gearList.map((item, i) => (
                <li data-edit={`gear.item.${i}`} data-edit-max="80" key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.gearTemplate}>
              <div data-edit-pattern="gear.field" data-edit-roles="6,0,3,4" className={styles.packPanel}>
                <TabbiedPattern
                  pattern={ridgeline}
                  palette={[TEAL, SLATE, ICE, SNOW]}
                  seed="cairn-pack"
                  fit="grid"
                  className={styles.packPattern}
                />
                <Figure editId="photo.cairn-pack-cutout"
                  slug="cairn-pack-cutout"
                  cutout
                  alt="Orange 38-litre alpine climbing pack with ice-axe loops"
                  className={styles.packImg}
                />
                <p data-edit="gear.packCaption" data-edit-max="240" data-edit-multiline className={styles.packCaption}>The house 38 L pack · €7 / day</p>
              </div>
              <div className={styles.rentalRow}>
                {rentals.map((r, i) => (
                  <figure
                    key={r.slug}
                    className={r.tall ? styles.rentalCardTall : styles.rentalCard}
                  >
                    <Figure editId={`gear.photo.${i}`} slug={r.slug} cutout alt={r.alt} className={styles.rentalImg} />
                    <figcaption>
                      <strong data-edit={`gear.emphasis.${i}`}>{r.name}</strong>
                      <span data-edit={`gear.text.${i}`} data-edit-max="60">{r.spec}</span>
                      <span data-edit={`gear.rentalPrice.${i}`} data-edit-max="60" className={styles.rentalPrice}>{r.price}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
          <p data-edit="gear.gearNote" data-edit-max="240" data-edit-multiline className={styles.gearNote}>
            Everything above can be rented from the bureau, fitted the evening you arrive.
            Bring your own boots if you love them; bring nothing cotton either way.
          </p>
        </section>

        {/* GUIDES */}
        <section id="guides" className={styles.sectionAlt} aria-labelledby="guides-title">
          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionIndex4" data-edit-max="240" data-edit-multiline className={styles.sectionIndex}>04 / Guides</p>
            <h2 data-edit="sectionHead.sectionTitle4" data-edit-max="60" id="guides-title" className={styles.sectionTitle}>
              The people on your rope
            </h2>
          </header>
          <div className={styles.guideGrid}>
            {guides.map((g, i) => (
              <article key={g.name} className={styles.guideCard}>
                <div className={styles.portraitFrame}>
                  <Figure editId={`guideCard.photo.${i}`} slug={g.slug} alt={g.alt} />
                </div>
                <div className={styles.guideBody}>
                  <h3 data-edit={`guideCard.title.${i}`} data-edit-max="40">{g.name}</h3>
                  <p className={styles.guideCert}>
                    {g.cert} · {g.home}
                  </p>
                  <p data-edit={`guideCard.body.${i}`} data-edit-max="240" data-edit-multiline>{g.line}</p>
                </div>
              </article>
            ))}
          </div>
          <p data-edit="guides.guideMore" data-edit-max="240" data-edit-multiline className={styles.guideMore}>
            Four more guides join the roster in high season, and you will meet the one holding
            your rope on the phone, long before the trailhead.
          </p>
        </section>

        {/* SAFETY */}
        <section id="safety" className={styles.section} aria-labelledby="safety-title">
          <header className={styles.sectionHead}>
            <p data-edit="sectionHead.sectionIndex5" data-edit-max="240" data-edit-multiline className={styles.sectionIndex}>05 / Safety</p>
            <h2 data-edit="sectionHead.sectionTitle5" data-edit-max="60" id="safety-title" className={styles.sectionTitle}>
              Credentials, in writing
            </h2>
            <p data-edit="sectionHead.sectionLede3" data-edit-max="240" data-edit-multiline className={styles.sectionLede}>
              Competence is quiet. It looks like paperwork, drills in November, and a forecast
              read out loud every evening whether the news is good or not.
            </p>
          </header>
          <div className={styles.credGrid}>
            {credentials.map((c, i) => (
              <article key={c.title} className={styles.credCard}>
                <h3 data-edit={`credCard.title.${i}`} data-edit-max="40">{c.title}</h3>
                <p data-edit={`credCard.body.${i}`} data-edit-max="240" data-edit-multiline>{c.body}</p>
              </article>
            ))}
          </div>
          <p data-edit="safety.safetySmall" data-edit-max="240" data-edit-multiline className={styles.safetySmall}>
            Full rescue and repatriation insurance is required on every trip; we will help you
            arrange it, and we read the fine print so you do not have to. Turn-around decisions
            are final and non-refundable; summits are weather permitting, descents are not.
          </p>
        </section>

        {/* ENQUIRE */}
        <section data-edit-pattern="enquire.field" data-edit-roles="0,6,3,5,7" id="enquire" className={styles.enquire} aria-labelledby="enquire-title">
          <TabbiedPattern
            pattern={ridgeline}
            palette={[SLATE, TEAL, ICE, EMBER, MIST]}
            seed="cairn-enquire"
            fit="cover"
            density={1}
            className={styles.enquireField}
          />
          <div className={styles.enquireScrim} aria-hidden="true" />
          <div className={styles.enquireInner}>
            <header className={styles.sectionHead}>
              <p data-edit="sectionHead.sectionIndex6" data-edit-max="240" data-edit-multiline className={styles.sectionIndex}>06 / Enquire</p>
              <h2 data-edit="sectionHead.sectionTitle6" data-edit-max="60" id="enquire-title" className={styles.sectionTitle}>
                Plan a season with us
              </h2>
            </header>
            <div className={styles.bookingSteps}>
              {bookingSteps.map((s, i) => (
                <article key={s.n} className={styles.bookingStep}>
                  <span data-edit={`bookingStep.bookingNum.${i}`} data-edit-max="60" className={styles.bookingNum}>{s.n}</span>
                  <h3 data-edit={`bookingStep.title.${i}`} data-edit-max="40">{s.title}</h3>
                  <p data-edit={`bookingStep.body.${i}`} data-edit-max="240" data-edit-multiline>{s.body}</p>
                </article>
              ))}
            </div>
            <div className={styles.enquirePanel}>
              <div>
                <p className={styles.enquireLead}>
                  Write with your dates and ambitions,<br /> we answer within two working days.
                </p>
                <a data-edit="enquire.btnPrimary" data-edit-max="28" className={styles.btnPrimary} href="mailto:bureau@cairn-expeditions.example">
                  bureau@cairn-expeditions.example
                </a>
              </div>
              <dl className={styles.enquireMeta}>
                <div>
                  <dt data-edit="enquire.term" data-edit-max="28">Bureau hours</dt>
                  <dd data-edit="enquire.body" data-edit-max="200" data-edit-multiline>Tue to Sat · 09:00 to 17:00</dd>
                </div>
                <div>
                  <dt data-edit="enquire.term2" data-edit-max="28">Telephone</dt>
                  <dd data-edit="enquire.body2" data-edit-max="200" data-edit-multiline>+41 (0)27 555 08 14</dd>
                </div>
                <div>
                  <dt data-edit="enquire.term3" data-edit-max="28">In person</dt>
                  <dd data-edit="enquire.body3" data-edit-max="200" data-edit-multiline>14 Route des Séracs, 1974 Valsorde</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="0,6,3" className={styles.footerField} role="presentation">
          <TabbiedPattern
            pattern={ridgeline}
            palette={[SLATE, TEAL, ICE]}
            seed="cairn-footer"
            fit="grid"
          />
        </div>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.brandMark} aria-hidden="true">
              ▲▲
            </span>
            <span data-edit="footer.text" data-edit-max="60">Cairn Expeditions</span>
          </div>
          <nav className={styles.footerNav} aria-label="Footer">
            <a data-edit="footer.expeditions" data-edit-max="28" href="#expeditions">Expeditions</a>
            <a data-edit="footer.approach" data-edit-max="28" href="#approach">Approach</a>
            <a data-edit="footer.gear" data-edit-max="28" href="#gear">Gear</a>
            <a data-edit="footer.guides" data-edit-max="28" href="#guides">Guides</a>
            <a data-edit="footer.safety" data-edit-max="28" href="#safety">Safety</a>
            <a data-edit="footer.enquire" data-edit-max="28" href="#enquire">Enquire</a>
          </nav>
          <p data-edit="footer.footerFine" data-edit-max="240" data-edit-multiline className={styles.footerFine}>
            Cairn Expeditions Sàrl · 14 Route des Séracs, 1974 Valsorde · Guiding under IFMGA
            standards since 2009. Forecasts are read at 18:00; alarms are set for earlier than
            you hope.
          </p>
          <p className={styles.credit}>
            Ridgelines and map fields drawn by{' '}
            <a data-edit="footer.link" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
