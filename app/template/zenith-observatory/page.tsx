import { TabbiedPattern } from 'tabbied/react';
import { spark } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './zenith-observatory.module.css';

export const metadata = {
  title: 'Zenith Observatory & Planetarium',
  description:
    'A public observatory on Cinder Ridge: viewing nights under a 0.61 m telescope, planetarium shows daily, school programs, and the darkest public sky within two hours of the city.',
};

const SPACE = '#10002B';
const NEBULA = '#5A189A';
const VIOLET = '#9D4EDD';
const ORCHID = '#C77DFF';
const LILAC = '#E0AAFF';
const PALE = '#FFD6FF';

const SKY_PALETTE = [SPACE, NEBULA, VIOLET, ORCHID, LILAC, PALE];
const FAINT_PALETTE = [SPACE, '#2A0A55', NEBULA, VIOLET];
const BRIGHT_PALETTE = ['#1B0440', ORCHID, LILAC, PALE, VIOLET];

const SHOWS = [
  {
    time: '18:30',
    name: 'First Light',
    detail: 'Our gentlest show: how eyes adapt to darkness, and what to look for tonight. Recommended before any viewing night.',
    dur: '35 MIN · ALL AGES',
  },
  {
    time: '19:45',
    name: 'The Slow Comets',
    detail: 'Icy visitors on thousand-year clocks: where they sleep, why they wake, and the comet due back the year you turn ninety.',
    dur: '40 MIN · AGES 8+',
  },
  {
    time: '21:00',
    name: 'Deep Field',
    detail: 'One patch of apparently empty sky, magnified until it holds ten thousand galaxies. Quiet, enormous, and our staff favourite.',
    dur: '45 MIN · AGES 12+',
  },
];

const TONIGHT = [
  { obj: 'Saturn', coords: 'RA 23h 04m · DEC −07° 41′', note: 'rings tilted 11°, best after 22:30' },
  { obj: 'M31 · Andromeda', coords: 'RA 00h 42m · DEC +41° 16′', note: 'naked-eye from the ridge on clear nights' },
  { obj: 'Albireo', coords: 'RA 19h 30m · DEC +27° 57′', note: 'gold-and-sapphire double star, crowd favourite' },
  { obj: 'Waxing Moon', coords: 'RA 14h 11m · DEC −12° 03′', note: 'terminator craters through the 20 cm refractor' },
];

const EXHIBITS = [
  {
    slug: 'zenith-planet-cutout',
    alt: 'Model of a ringed gas giant planet',
    name: 'The Ring Room',
    copy: 'A four-metre ringed giant you can walk beneath. Stand under the ring plane and watch it thin to a knife-edge, the same trick Saturn plays every fifteen years.',
  },
  {
    slug: 'zenith-comet-cutout',
    alt: 'Model comet with a bright head and streaming twin tails',
    name: 'Dirty Snowball',
    copy: 'A one-tonne comet nucleus reconstruction, kept at −20 °C behind glass. Touch the meteorite beside it: it is 4.5 billion years old and has been patient.',
  },
  {
    slug: 'zenith-moon-cutout',
    alt: 'Crescent moon model showing crater detail along the terminator',
    name: 'Terminator Line',
    copy: 'A crescent moon two storeys tall, lit by a slow artificial sun. Watch shadows crawl across crater floors: a lunar day compressed into eight minutes.',
  },
];

const PRICES = [
  { who: 'Adults', amt: '$14' },
  { who: 'Under 16', amt: '$8' },
  { who: 'Under 5', amt: 'Free' },
  { who: 'Viewing night add-on', amt: '$6' },
  { who: 'Planetarium show', amt: '$5' },
  { who: 'Ridge parking', amt: 'Free' },
];

const TIERS = [
  {
    name: 'Stargazer',
    price: '$48 / yr',
    perks: ['Unlimited daytime admission', 'Two viewing-night passes', 'Member newsletter, on paper'],
    featured: false,
  },
  {
    name: 'Astronomer',
    price: '$96 / yr',
    perks: [
      'Everything in Stargazer',
      'Unlimited viewing nights',
      'Eyepiece time on the 0.61 m',
      'Guest pass every visit',
    ],
    featured: true,
  },
  {
    name: 'Deep Field',
    price: '$220 / yr',
    perks: ['Everything in Astronomer', 'Annual all-night session', 'Name on a ridge bench', 'Family admission, always'],
    featured: false,
  },
];

export default function ZenithObservatoryPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--space': '#10002b',
        '--space-2': '#150a33',
        '--nebula': '#5a189a',
        '--violet': '#9d4edd',
        '--orchid': '#c77dff',
        '--lilac': '#e0aaff',
        '--pale': '#ffd6ff',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="space,space-2,nebula,violet,orchid,lilac,pale"
      className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;600;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
      />

      {/* --- HERO --- */}
      <header data-edit-pattern="hero.field" data-edit-roles="0,2,3,4,5,6" className={styles.hero}>
        <TabbiedPattern
          pattern={spark}
          palette={SKY_PALETTE}
          seed="zen-sky-07"
          fit="cover"
          density={2}
          style={{ position: 'absolute', inset: 0 }}
        />
        <div className={styles.heroVeil} aria-hidden="true" />

        <div className={styles.topRow}>
          <p className={styles.brand}>
            <span aria-hidden="true">&#x2726;</span> ZENITH
          </p>
          <nav className={styles.nav} aria-label="Sections">
            <a data-edit="hero.tonight" data-edit-max="28" href="#tonight">Tonight</a>
            <a data-edit="hero.exhibits" data-edit-max="28" href="#exhibits">Exhibits</a>
            <a data-edit="hero.telescope" data-edit-max="28" href="#telescope">Telescope</a>
            <a data-edit="hero.visit" data-edit-max="28" href="#visit">Visit</a>
            <a data-edit="hero.membership" data-edit-max="28" href="#membership">Membership</a>
          </nav>
          <p data-edit="hero.coords" data-edit-max="240" data-edit-multiline className={styles.coords}>44.02° N · 121.31° W · ELEV 1 280 M</p>
        </div>

        <div className={styles.heroCenter}>
          <p data-edit="hero.heroEyebrow" data-edit-max="240" data-edit-multiline className={styles.heroEyebrow}>PUBLIC OBSERVATORY &amp; PLANETARIUM · CINDER RIDGE · EST. 1974</p>
          <h1 className={styles.heroTitle}>
            Look up.
            <br />
            We'll handle the rest.
          </h1>
          <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={styles.heroLede}>
            The darkest public sky within two hours of the city, a telescope
            older than most of our visitors, and staff who will happily point
            at things until you make them stop.
          </p>

          <div className={styles.countdown} role="group" aria-label="Time until the next public viewing night">
            <p data-edit="hero.countLabel" data-edit-max="240" data-edit-multiline className={styles.countLabel}>NEXT PUBLIC VIEWING NIGHT · SAT 09 AUG · GATES 21:00</p>
            <p className={styles.countDigits}>
              <span>
                08<em>DAYS</em>
              </span>
              <span className={styles.countSep} aria-hidden="true">
                :
              </span>
              <span>
                05<em>HRS</em>
              </span>
              <span className={styles.countSep} aria-hidden="true">
                :
              </span>
              <span>
                42<em>MIN</em>
              </span>
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={styles.cta} href="#visit">
              Reserve viewing tickets · $6
            </a>
          </div>
        </div>

        <div className={styles.heroDome}>
          <Figure editId="photo.zenith-dome-cutout"
            slug="zenith-dome-cutout"
            cutout
            priority
            alt="White observatory dome with its shutter open to the night sky"
            className={styles.heroDomeImg}
          />
        </div>
      </header>

      <main>
        {/* --- TONIGHT --- */}
        <section id="tonight" className={styles.section} aria-labelledby="tonight-title">
          <p data-edit="tonight.kicker" data-edit-max="240" data-edit-multiline className={styles.kicker}>◍ TONIGHT AT ZENITH</p>
          <h2 data-edit="tonight.h2" data-edit-max="60" id="tonight-title" className={styles.h2}>
            The sky is doing things
          </h2>
          <p data-edit="tonight.sub" data-edit-max="240" data-edit-multiline className={styles.sub}>
            Planetarium shows run in all weather. The telescope opens when the
            sky cooperates; we post the call at 17:00 sharp.
          </p>

          <div className={styles.showGrid}>
            {SHOWS.map((s, i) => (
              <article key={s.name} className={styles.showCard}>
                <p data-edit={`showCard.showTime.${i}`} data-edit-max="240" data-edit-multiline className={styles.showTime}>{s.time}</p>
                <h3 data-edit={`showCard.title.${i}`} data-edit-max="40">{s.name}</h3>
                <p data-edit={`showCard.showDetail.${i}`} data-edit-max="240" data-edit-multiline className={styles.showDetail}>{s.detail}</p>
                <p data-edit={`showCard.showDur.${i}`} data-edit-max="240" data-edit-multiline className={styles.showDur}>{s.dur}</p>
              </article>
            ))}
          </div>

          <div className={styles.objectPanel}>
            <h3 data-edit="tonight.objectTitle" data-edit-max="40" className={styles.objectTitle}>ON THE SCHEDULE, WEATHER WILLING</h3>
            <ul className={styles.objectList}>
              {TONIGHT.map((t, i) => (
                <li key={t.obj}>
                  <span data-edit={`tonight.objName.${i}`} data-edit-max="60" className={styles.objName}>{t.obj}</span>
                  <span data-edit={`tonight.objCoords.${i}`} data-edit-max="60" className={styles.objCoords}>{t.coords}</span>
                  <span data-edit={`tonight.objNote.${i}`} data-edit-max="60" className={styles.objNote}>{t.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- EXHIBITS --- */}
        <section id="exhibits" className={styles.sectionWide} aria-labelledby="exhibits-title">
          <p data-edit="exhibits.kicker" data-edit-max="240" data-edit-multiline className={styles.kicker}>◍ THE FLOOR</p>
          <h2 data-edit="exhibits.h2" data-edit-max="60" id="exhibits-title" className={styles.h2}>
            Exhibits you can stand under
          </h2>
          <p data-edit="exhibits.sub" data-edit-max="240" data-edit-multiline className={styles.sub}>
            Three permanent halls, rebuilt slowly and stubbornly since 1974. No
            screens where an object will do.
          </p>
          <div className={styles.exhibitGrid}>
            {EXHIBITS.map((e, i) => (
              <article key={e.slug} className={styles.exhibit}>
                <div data-edit-pattern={`exhibit.field.${i}`} className={styles.orbitTile}>
                  <TabbiedPattern
                    pattern={spark}
                    palette={i === 1 ? BRIGHT_PALETTE : FAINT_PALETTE}
                    seed={`zen-ex-${i + 1}`}
                    fit="grid"
                    cellSize={52}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                  <div className={styles.orbitVeil} aria-hidden="true" />
                  <div className={styles.orbitRing} aria-hidden="true" />
                  <div className={styles.orbitRingInner} aria-hidden="true" />
                  <Figure editId={`exhibit.photo.${i}`} slug={e.slug} cutout alt={e.alt} className={styles.exhibitImg} />
                </div>
                <h3 data-edit={`exhibit.title.${i}`} data-edit-max="40">{e.name}</h3>
                <p data-edit={`exhibit.body.${i}`} data-edit-max="240" data-edit-multiline>{e.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* --- TELESCOPE --- */}
        <section id="telescope" className={styles.telescope} aria-labelledby="scope-title">
          <div className={styles.scopeGrid}>
            <div className={styles.scopeMedia}>
              <Figure editId="photo.zenith-telescope-cutout"
                slug="zenith-telescope-cutout"
                cutout
                alt="Long brass refracting telescope on an equatorial mount"
                className={styles.scopeImg}
              />
            </div>
            <div className={styles.scopeBody}>
              <p data-edit="telescope.kickerLeft" data-edit-max="240" data-edit-multiline className={styles.kickerLeft}>◍ THE INSTRUMENT</p>
              <h2 data-edit="telescope.h2Left" data-edit-max="60" id="scope-title" className={styles.h2Left}>
                The Meridian Eye
              </h2>
              <p data-edit="telescope.scopeCopy" data-edit-max="240" data-edit-multiline className={styles.scopeCopy}>
                Our main instrument is a 0.61-metre Cassegrain, installed in
                1974 and resurfaced twice since. It has watched two comets
                arrive unannounced, one supernova in a neighbouring galaxy, and
                roughly four hundred thousand first looks at Saturn, which
                remain, by unanimous staff vote, the best part of the job.
              </p>
              <dl className={styles.scopeSpecs}>
                <div>
                  <dt data-edit="telescope.term" data-edit-max="28">APERTURE</dt>
                  <dd data-edit="telescope.body" data-edit-max="200" data-edit-multiline>0.61 m</dd>
                </div>
                <div>
                  <dt data-edit="telescope.term2" data-edit-max="28">FOCAL RATIO</dt>
                  <dd data-edit="telescope.body2" data-edit-max="200" data-edit-multiline>f/8</dd>
                </div>
                <div>
                  <dt data-edit="telescope.term3" data-edit-max="28">MOUNT</dt>
                  <dd data-edit="telescope.body3" data-edit-max="200" data-edit-multiline>Equatorial fork</dd>
                </div>
                <div>
                  <dt data-edit="telescope.term4" data-edit-max="28">FIRST LIGHT</dt>
                  <dd data-edit="telescope.body4" data-edit-max="200" data-edit-multiline>14 MAR 1974</dd>
                </div>
                <div>
                  <dt data-edit="telescope.term5" data-edit-max="28">LIMITING MAG.</dt>
                  <dd data-edit="telescope.body5" data-edit-max="200" data-edit-multiline>+15.2 visual</dd>
                </div>
                <div>
                  <dt data-edit="telescope.term6" data-edit-max="28">OLDEST PHOTON SHOWN</dt>
                  <dd data-edit="telescope.body6" data-edit-max="200" data-edit-multiline>≈ 12 billion yrs</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* --- PANORAMA --- */}
        <section className={styles.panorama} aria-label="The night sky from Cinder Ridge">
          <Figure editId="photo.zenith-panorama"
            slug="zenith-panorama"
            alt="Panorama of the Milky Way arching over the dark ridge line"
            className={styles.panoImg}
          />
          <blockquote className={styles.panoQuote}>
            <p data-edit="panorama.body" data-edit-max="240" data-edit-multiline>"The first time the dome opened, our six-year-old whispered. She whispered the whole drive home."</p>
            <cite data-edit="panorama.attribution" data-edit-max="48">Visitor log, 22 June 2025</cite>
          </blockquote>
        </section>

        {/* --- VISIT --- */}
        <section id="visit" className={styles.section} aria-labelledby="visit-title">
          <p data-edit="visit.kicker" data-edit-max="240" data-edit-multiline className={styles.kicker}>◍ PLAN A VISIT</p>
          <h2 data-edit="visit.h2" data-edit-max="60" id="visit-title" className={styles.h2}>
            Getting here is half the dark
          </h2>
          <div className={styles.visitGrid}>
            <div className={styles.visitCard}>
              <h3 data-edit="visit.title" data-edit-max="40">HOURS</h3>
              <ul className={styles.plainList}>
                <li>
                  <span data-edit="visit.text" data-edit-max="60">Wed - Sun</span>
                  <span data-edit="visit.text2" data-edit-max="60">13:00 - 23:30</span>
                </li>
                <li>
                  <span data-edit="visit.text3" data-edit-max="60">Viewing nights</span>
                  <span data-edit="visit.text4" data-edit-max="60">Sat, gates 21:00</span>
                </li>
                <li>
                  <span data-edit="visit.text5" data-edit-max="60">Mon - Tue</span>
                  <span data-edit="visit.text6" data-edit-max="60">Closed (we sleep)</span>
                </li>
                <li>
                  <span data-edit="visit.text7" data-edit-max="60">Full-moon weeks</span>
                  <span data-edit="visit.text8" data-edit-max="60">Planetarium only</span>
                </li>
              </ul>
            </div>
            <div className={styles.visitCard}>
              <h3 data-edit="visit.title2" data-edit-max="40">ADMISSION</h3>
              <ul className={styles.plainList}>
                {PRICES.map((p, i) => (
                  <li key={p.who}>
                    <span data-edit={`visit.text9.${i}`} data-edit-max="60">{p.who}</span>
                    <span data-edit={`visit.text10.${i}`} data-edit-max="60">{p.amt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.visitCardTall}>
              <Figure editId="photo.zenith-hero"
                slug="zenith-hero"
                alt="Illustration of the observatory dome on the ridge beneath a star-filled sky"
                className={styles.visitImg}
              />
              <div className={styles.visitCardTallBody}>
                <h3 data-edit="visit.title3" data-edit-max="40">FINDING US</h3>
                <p data-edit="visit.body" data-edit-max="240" data-edit-multiline>
                  9 Cinder Ridge Road, forty minutes past the last streetlight.
                  Use red headlamp mode on the final path; your eyes will
                  thank you within the hour. Dress for ten degrees colder than
                  town.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- MEMBERSHIP --- */}
        <section id="membership" className={styles.sectionWide} aria-labelledby="member-title">
          <p data-edit="membership.kicker" data-edit-max="240" data-edit-multiline className={styles.kicker}>◍ MEMBERSHIP</p>
          <h2 data-edit="membership.h2" data-edit-max="60" id="member-title" className={styles.h2}>
            Adopt a sky
          </h2>
          <p data-edit="membership.sub" data-edit-max="240" data-edit-multiline className={styles.sub}>
            Members keep the dome turning. In exchange: the ridge, whenever it
            is dark.
          </p>
          <div className={styles.tierGrid}>
            {TIERS.map((t, i) => (
              <article key={t.name} className={t.featured ? styles.tierFeatured : styles.tier}>
                {t.featured && (
                  <TabbiedPattern
                    pattern={spark}
                    palette={FAINT_PALETTE}
                    seed="zen-tier-02"
                    fit="grid"
                    cellSize={48}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                )}
                <div className={styles.tierBody}>
                  <h3 data-edit={`tierFeatured.title.${i}`} data-edit-max="40">{t.name}</h3>
                  <p data-edit={`tierFeatured.tierPrice.${i}`} data-edit-max="240" data-edit-multiline className={styles.tierPrice}>{t.price}</p>
                  <ul>
                    {t.perks.map((p, i2) => (
                      <li data-edit={`tierFeatured.item.${i}.${i2}`} data-edit-max="80" key={p}>{p}</li>
                    ))}
                  </ul>
                  <a className={styles.tierCta} href="mailto:members@zenithridge.example">
                    Join as {t.name}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* --- SCHOOL PROGRAMS --- */}
        <section className={styles.school} aria-labelledby="school-title">
          <div className={styles.schoolInner}>
            <p data-edit="school.kickerLeft" data-edit-max="240" data-edit-multiline className={styles.kickerLeft}>◍ FOR SCHOOLS</p>
            <h2 data-edit="school.h2Left" data-edit-max="60" id="school-title" className={styles.h2Left}>
              Field trips that end in silence
            </h2>
            <p data-edit="school.schoolCopy" data-edit-max="240" data-edit-multiline className={styles.schoolCopy}>
              A Zenith school visit is ninety minutes: one planetarium show,
              one exhibit hall, and, for autumn and winter bookings, ten
              minutes of real telescope time per class. Teachers receive a sky
              chart pack keyed to their term. We have hosted 214 schools;
              the record for longest stunned silence is 74 seconds, set by a
              year-five class meeting Saturn.
            </p>
            <dl className={styles.schoolStats}>
              <div>
                <dt data-edit="school.term" data-edit-max="28">SCHOOLS HOSTED</dt>
                <dd data-edit="school.body" data-edit-max="200" data-edit-multiline>214</dd>
              </div>
              <div>
                <dt data-edit="school.term2" data-edit-max="28">STUDENTS / YEAR</dt>
                <dd data-edit="school.body2" data-edit-max="200" data-edit-multiline>11 400</dd>
              </div>
              <div>
                <dt data-edit="school.term3" data-edit-max="28">COST PER STUDENT</dt>
                <dd data-edit="school.body3" data-edit-max="200" data-edit-multiline>$4</dd>
              </div>
              <div>
                <dt data-edit="school.term4" data-edit-max="28">BURSARY PLACES</dt>
                <dd data-edit="school.body4" data-edit-max="200" data-edit-multiline>1 IN 5</dd>
              </div>
            </dl>
            <a data-edit="school.cta" data-edit-max="28" className={styles.cta} href="mailto:schools@zenithridge.example">
              Book a school visit
            </a>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="0,2,3,4,5,6" className={styles.footerBand} aria-hidden="true">
          <TabbiedPattern
            pattern={spark}
            palette={SKY_PALETTE}
            seed="zen-foot-09"
            fit="grid"
            cellSize={44}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.footerInner}>
          <p className={styles.footerBrand}>
            <span aria-hidden="true">&#x2726;</span> ZENITH OBSERVATORY &amp; PLANETARIUM
          </p>
          <div className={styles.footerCols}>
            <div>
              <h3 data-edit="footer.title" data-edit-max="40">VISIT</h3>
              <p>
                9 Cinder Ridge Road
                <br />
                Wed-Sun · 13:00-23:30
              </p>
            </div>
            <div>
              <h3 data-edit="footer.title2" data-edit-max="40">CONTACT</h3>
              <p>
                <a data-edit="footer.link" data-edit-max="28" href="mailto:dome@zenithridge.example">dome@zenithridge.example</a>
                <br />
                <a data-edit="footer.link2" data-edit-max="28" href="tel:+15415550119">(541) 555-0119</a>
              </p>
            </div>
            <div>
              <h3 data-edit="footer.title3" data-edit-max="40">SKY CALL</h3>
              <p>
                Posted daily 17:00
                <br />
                Clear-sky line: ext. 2
              </p>
            </div>
          </div>
          <p className={styles.footerFine}>
            © 2026 Zenith Ridge Astronomical Society · a fictional observatory
            under a real sky.
            <span className={styles.credit}>
              {' '}
              Star fields generated with{' '}
              <a data-edit="footer.link3" data-edit-max="28" href="https://tabbied.com" rel="noopener">
                Tabbied
              </a>
              .
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
