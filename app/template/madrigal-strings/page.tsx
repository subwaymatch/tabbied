import type { CSSProperties } from 'react';
import { TabbiedPattern } from 'tabbied/react';
import { linocut, lunette } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './madrigal-strings.module.css';

export const metadata = {
  title: 'Madrigal · Atelier di Liuteria, Casteldoro',
  description:
    'Violins, bows, and cases made in the old manner since 1968. Two benches, one varnish room, and an adjustment year with every instrument.',
};

const AUBERGINE = '#2D132C';
const WINE = '#801336';
const CARMINE = '#C72C41';
const VERMILION = '#EE4540';
const GOLD = '#F0C419';
const PARCHMENT = '#FFE9C7';

type Instrument = {
  numeral: string;
  name: string;
  subtitle: string;
  copy: string;
  slug: string;
  alt: string;
  seed: string;
  palette: string[];
  wide?: boolean;
  specs: [string, string][];
  price: string;
};

const INSTRUMENTS: Instrument[] = [
  {
    numeral: 'I',
    name: 'The Violin',
    subtitle: 'Modello Casteldoro, after the old Cremonese proportions',
    copy: 'Each violin begins as two billets chosen by ear from the attic library, split, never sawn, so the grain runs true. The arching is carved to shadow lines Aurelio drew in 1972, and no two tops are graduated alike: the wood decides, the maker listens.',
    slug: 'madrigal-violin-cutout',
    alt: 'A finished violin standing upright, its amber varnish catching the light',
    seed: 'md-violin',
    palette: [WINE, AUBERGINE, CARMINE, GOLD],
    specs: [
      ['Top', 'Val di Fiemme spruce, seasoned 14 years'],
      ['Back & ribs', 'Balkan maple, deep flame'],
      ['Neck', 'Quarter-sawn maple, boxwood crown'],
      ['Fittings', 'Ebony, hand-fitted'],
      ['Varnish', 'Oil, 22 coats, sun-dried'],
      ['String length', '328 mm'],
    ],
    price: '€24,000',
  },
  {
    numeral: 'II',
    name: 'The Bow',
    subtitle: 'Round stick, silver-mounted, after the French manner',
    copy: 'Ottavio came to bows through repair, which is to say through the mistakes of others. His sticks are cambered over a spirit lamp in candle-quiet passes; the balance is set for players who draw the sound out rather than press it in.',
    slug: 'madrigal-bow-cutout',
    alt: 'A violin bow photographed vertically, frog and silver winding visible',
    seed: 'md-bow',
    palette: [AUBERGINE, WINE, VERMILION, GOLD],
    specs: [
      ['Stick', 'Seasoned ipê, round section'],
      ['Frog', 'Ebony, silver-mounted'],
      ['Weight', '61 g'],
      ['Balance point', '265 mm from frog'],
      ['Hair', 'Mongolian white, unbleached'],
      ['Winding', 'Silver wire, lizard grip'],
    ],
    price: '€3,800',
  },
  {
    numeral: 'III',
    name: 'The Case',
    subtitle: 'A travelling case built like a small instrument',
    copy: 'The case is made in the same room as the violins, of poplar laminate bent on the old forms. Garnet velvet, a brass hygrometer, and a compartment sized to a rosin cake and a letter, because every instrument that leaves us is expected to write home.',
    slug: 'madrigal-case-cutout',
    alt: 'An open violin case lined with deep red velvet',
    seed: 'md-case',
    palette: [CARMINE, AUBERGINE, WINE, PARCHMENT],
    wide: true,
    specs: [
      ['Shell', 'Poplar laminate, five-ply'],
      ['Lining', 'Garnet velvet, horsehair padding'],
      ['Fittings', 'Brass, hand-aged'],
      ['Mass', '3.2 kg'],
      ['Climate', 'Brass hygrometer, humidor tube'],
      ['Cover', 'Waxed canvas, leather spine'],
    ],
    price: '€1,450',
  },
];

const HISTORY = [
  {
    year: '1968',
    text: 'Aurelio Madrigal, thirty-six and lately of the Ferrante workshop, takes a lease on the corner room at Vicolo dei Liutai 7 and builds his first bench from the crates his tools arrived in.',
  },
  {
    year: '1974',
    text: 'The first Casteldoro model violin is completed and sold, after two years of argument with its arching. Aurelio keeps the drawings; we still work from them.',
  },
  {
    year: '1979',
    text: 'His son Ottavio, aged eleven, is paid one coin per week to keep the glue pot and say nothing. He manages the first duty perfectly.',
  },
  {
    year: '1994',
    text: 'Ottavio takes the front bench. Aurelio moves to the window seat, where the light is better and the criticism has a shorter distance to travel.',
  },
  {
    year: '2007',
    text: 'Aurelio dies in October, three days after varnishing his two-hundredth instrument. The workshop closes for a month and reopens with his chisels sharpened.',
  },
  {
    year: '2019',
    text: 'The attic wood library reaches three hundred billets, the oldest seasoned since 1981. We began refusing wood we will not live to use; it goes to younger hands.',
  },
];

const MOVEMENTS = [
  {
    numeral: 'I',
    title: 'Colloquio',
    tempo: 'adagio, unhurried',
    copy: 'A conversation before anything else. You visit, or we exchange letters and recordings. We listen to how you play and, more carefully, to what you complain about. The waitlist opens twice a year, in spring and autumn.',
  },
  {
    numeral: 'II',
    title: 'Il Legno',
    tempo: 'con cura',
    copy: 'Wood is chosen from the attic library: tap tones struck, grain read, a billet set aside under your name. Players who visit choose between two or three matched sets. Most close their eyes to decide. This is correct.',
  },
  {
    numeral: 'III',
    title: 'Costruzione',
    tempo: 'andante, five months',
    copy: 'Five months at the bench, then a summer in the varnish room, where coats are laid on in the morning and cured in the south window. We send three photographs during this time and answer no questions about the colour.',
  },
  {
    numeral: 'IV',
    title: 'La Consegna',
    tempo: 'vivace, then a year of patience',
    copy: 'Delivery in person, always. Then the adjustment year: two returns to the bench are included, for the sound post to be moved by fractions and the instrument to be told it is behaving well. It will have opinions. So will you.',
  },
];

const PLACEMENTS = [
  { holder: 'Orchestra del Teatro Aurelio', detail: 'Principal second violin · Casteldoro model, 2012' },
  { holder: 'The Merle Quartet', detail: 'Two violins and a bow · touring since 2016' },
  { holder: 'Camerata di San Feliciano', detail: 'Concertmaster · violin № 214' },
  { holder: 'Elena Corvatta', detail: 'Soloist · violin № 198, "la Rondine"' },
  { holder: 'Jun Hasebe', detail: 'Recitalist · commissioned pair, violin and bow, 2023' },
  { holder: 'Conservatorio di Casteldoro', detail: 'Three student instruments on permanent loan' },
];

function Ornament() {
  return (
    <div className={styles.ornament} aria-hidden="true">
      <span className={styles.ornamentRule} />
      <span className={styles.ornamentMark}>&#x2766;</span>
      <span className={styles.ornamentRule} />
    </div>
  );
}

export default function MadrigalStringsPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--aubergine': '#2d132c',
        '--wine': '#801336',
        '--carmine': '#c72c41',
        '--vermilion': '#ee4540',
        '--gold': '#f0c419',
        '--parchment': '#ffe9c7',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="aubergine,wine,carmine,vermilion,gold,parchment"
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
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap"
      />

      <header className={styles.masthead}>
        <p data-edit="masthead.mastheadEst" data-edit-max="240" data-edit-multiline className={styles.mastheadEst}>Anno MCMLXVIII</p>
        <a data-edit="masthead.mastheadTitle" data-edit-max="28" href="#programme" className={styles.mastheadTitle}>
          Madrigal
        </a>
        <p data-edit="masthead.mastheadSub" data-edit-max="240" data-edit-multiline className={styles.mastheadSub}>Atelier di Liuteria · Casteldoro</p>
        <nav aria-label="Programme" className={styles.mastheadNav}>
          <a data-edit="masthead.history" data-edit-max="28" href="#history">History</a>
          <a data-edit="masthead.instruments" data-edit-max="28" href="#instruments">Instruments</a>
          <a data-edit="masthead.varnish" data-edit-max="28" href="#varnish">Varnish</a>
          <a data-edit="masthead.commission" data-edit-max="28" href="#commission">Commissions</a>
          <a data-edit="masthead.visiting" data-edit-max="28" href="#visiting">Visiting</a>
        </nav>
      </header>

      <main id="programme">
        {/* --------------------------------------------------------- HERO */}
        <section className={styles.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="0,4,2,1,5" className={styles.heroField}>
            <TabbiedPattern
              pattern={lunette}
              palette={[AUBERGINE, GOLD, CARMINE, WINE, PARCHMENT]}
              seed="md-hero-field"
              fit="grid"
              cellSize={112}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.heroFieldScrim} aria-hidden="true" />
          </div>
          <div className={styles.heroArch}>
            <Figure editId="photo.madrigal-violin-cutout"
              slug="madrigal-violin-cutout"
              cutout
              alt="A Madrigal violin standing upright against a carved linocut pattern, varnish glowing amber"
              priority
              className={styles.heroViolin}
            />
          </div>
          <div className={styles.heroCartouche}>
            <h1 data-edit="hero.heroTitle" data-edit-max="70" id="hero-h" className={styles.heroTitle}>
              Instruments in the old manner
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={styles.heroLede}>
              Two benches, one varnish room, and fifty-eight years of morning
              light. The Madrigal workshop builds violins, bows, and cases for
              players who intend to keep them for life, and then leave them to
              someone who will.
            </p>
            <p className={styles.heroNote}>
              <span data-edit="hero.smallCaps" data-edit-max="60" className={styles.smallCaps}>Commissions open</span> ·
              autumn waitlist, from September the 1st
            </p>
          </div>
          <figure className={styles.heroBench}>
            <Figure editId="photo.madrigal-hero"
              slug="madrigal-hero"
              alt="A violin in progress resting on the workbench among shavings, gouges, and a pot of varnish"
              className={styles.framedImg}
            />
            <figcaption data-edit="hero.caption" data-edit-max="120" data-edit-multiline className={styles.caption}>
              The front bench, a little after seven in the morning.
            </figcaption>
          </figure>
        </section>

        <Ornament />

        {/* ------------------------------------------------------ HISTORY */}
        <section className={styles.history} aria-labelledby="history">
          <h2 data-edit="history.sectionTitle" data-edit-max="60" className={styles.sectionTitle} id="history">
            A Short History of the House
          </h2>
          <p data-edit="history.prose" data-edit-max="240" data-edit-multiline className={`${styles.prose} ${styles.dropCap}`}>
            Madrigal is not an old workshop by the standards of this town,
            where the pavement remembers three centuries of shavings. It is,
            however, a stubborn one. Founded in 1968 in a single corner room,
            it has occupied the same address, kept the same hours, and refused
            the same shortcuts ever since. What follows are the dates we
            consider worth engraving.
          </p>
          <figure className={styles.historyFigure}>
            <Figure editId="photo.madrigal-workshop"
              slug="madrigal-workshop"
              alt="The workshop wall: tools on hooks, violin bodies in the white hanging in a patient row"
              className={styles.framedImg}
            />
            <figcaption data-edit="history.caption" data-edit-max="120" data-edit-multiline className={styles.caption}>
              The north wall, instruments in the white, waiting on the varnish
              room.
            </figcaption>
          </figure>
          <ol className={styles.timeline}>
            {HISTORY.map((h, i) => (
              <li key={h.year} className={styles.timelineRow}>
                <span data-edit={`history.timelineYear.${i}`} data-edit-max="60" className={styles.timelineYear}>{h.year}</span>
                <p data-edit={`history.timelineText.${i}`} data-edit-max="240" data-edit-multiline className={styles.timelineText}>{h.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <Ornament />

        {/* -------------------------------------------------- INSTRUMENTS */}
        <section className={styles.instruments} aria-labelledby="instruments">
          <div data-edit-pattern="instruments.field" data-edit-roles="0,1,2,4" className={styles.sectionField}>
            <TabbiedPattern
              pattern={linocut}
              palette={[AUBERGINE, WINE, CARMINE, GOLD]}
              seed="md-instruments-field"
              fit="grid"
              cellSize={72}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.sectionScrim} aria-hidden="true" />
          </div>
          <h2 data-edit="instruments.sectionTitle" data-edit-max="60" className={styles.sectionTitle} id="instruments">
            The Instruments
          </h2>
          <p data-edit="instruments.prose" data-edit-max="240" data-edit-multiline className={styles.prose}>
            Three things leave this workshop, each numbered in the ledger
            Aurelio opened in 1968. We make eight or nine violins in a year, a
            handful of bows, and cases as the bending forms allow. Prices are
            those of the current ledger page and include the adjustment year.
          </p>
          {INSTRUMENTS.map((inst, i) => (
            <article key={inst.name} className={styles.instrument}>
              <div
                className={`${styles.pedestal} ${inst.wide ? styles.pedestalWide : ''}`}
                style={{ '--plate-tint': inst.palette[0] } as CSSProperties}
              >
                <Figure editId={`instrument.photo.${i}`}
                  slug={inst.slug}
                  cutout
                  alt={inst.alt}
                  className={inst.wide ? styles.cutoutWide : styles.cutoutTall}
                />
              </div>
              <div className={styles.instrumentBody}>
                <p className={styles.instrumentNumeral} aria-hidden="true">
                  {inst.numeral}
                </p>
                <h3 data-edit={`instrument.instrumentName.${i}`} data-edit-max="40" className={styles.instrumentName}>{inst.name}</h3>
                <p data-edit={`instrument.instrumentSubtitle.${i}`} data-edit-max="240" data-edit-multiline className={styles.instrumentSubtitle}>{inst.subtitle}</p>
                <p data-edit={`instrument.prose.${i}`} data-edit-max="240" data-edit-multiline className={styles.prose}>{inst.copy}</p>
                <dl className={styles.specList}>
                  {inst.specs.map(([k, v], i2) => (
                    <div key={k} className={styles.specRow}>
                      <dt data-edit={`instrument.term.${i}.${i2}`} data-edit-max="28">{k}</dt>
                      <dd data-edit={`instrument.body.${i}.${i2}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className={styles.instrumentPrice}>
                  <span data-edit={`instrument.smallCaps.${i}`} data-edit-max="60" className={styles.smallCaps}>From the ledger</span>{' '}
                  {inst.price}
                </p>
              </div>
            </article>
          ))}
        </section>

        <Ornament />

        {/* ------------------------------------------------------ VARNISH */}
        <section className={styles.varnish} aria-labelledby="varnish">
          <div data-edit-pattern="varnish.field" data-edit-roles="0,4,1,2" className={styles.sectionField}>
            <TabbiedPattern
              pattern={lunette}
              palette={[AUBERGINE, GOLD, WINE, CARMINE]}
              seed="md-varnish-field"
              fit="grid"
              cellSize={94}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.sectionScrim} aria-hidden="true" />
          </div>
          <h2 data-edit="varnish.sectionTitle" data-edit-max="60" className={styles.sectionTitle} id="varnish">
            The Varnish Room
          </h2>
          <div className={styles.varnishSplit}>
            <figure className={styles.varnishFigure}>
              <Figure editId="photo.madrigal-varnish"
                slug="madrigal-varnish"
                alt="A varnish brush laying a coat of deep amber over a violin top, close enough to see the grain"
                className={styles.framedImg}
              />
              <figcaption data-edit="varnish.caption" data-edit-max="120" data-edit-multiline className={styles.caption}>
                The eleventh coat, laid before nine in the morning.
              </figcaption>
            </figure>
            <div>
              <p data-edit="varnish.prose" data-edit-max="240" data-edit-multiline className={`${styles.prose} ${styles.dropCap}`}>
                Our varnish is cooked in autumn, in the yard, from oil and
                resins whose proportions are written in a hand we can no longer
                consult. Twenty-two coats, each thinner than the last, each
                cured in the south window until the surface will take a
                thumbprint and give it back.
              </p>
              <p data-edit="varnish.prose2" data-edit-max="240" data-edit-multiline className={styles.prose}>
                Colour is the wood's decision. We only escort it: a
                golden ground, then reds laid over like late light on brick.
                Asked to match a photograph, we decline politely and pour the
                visitor more coffee.
              </p>
              <blockquote className={styles.pullQuote}>
                <p data-edit="varnish.body" data-edit-max="240" data-edit-multiline>
                  "Varnish is the part of the violin that keeps arriving
                  after the maker has stopped."
                </p>
                <cite data-edit="varnish.attribution" data-edit-max="48">Aurelio Madrigal, ledger margin, 1989</cite>
              </blockquote>
            </div>
          </div>
        </section>

        <Ornament />

        {/* --------------------------------------------------- COMMISSION */}
        <section className={styles.commission} aria-labelledby="commission">
          <div data-edit-pattern="commission.field" data-edit-roles="0,2,4,1" className={styles.sectionField}>
            <TabbiedPattern
              pattern={linocut}
              palette={[AUBERGINE, CARMINE, GOLD, WINE]}
              seed="md-commission-field"
              fit="grid"
              cellSize={58}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.sectionScrim} aria-hidden="true" />
          </div>
          <h2 data-edit="commission.sectionTitle" data-edit-max="60" className={styles.sectionTitle} id="commission">
            A Commission, in Four Movements
          </h2>
          <p data-edit="commission.prose" data-edit-max="240" data-edit-multiline className={styles.prose}>
            From first letter to delivered instrument is, at present, a little
            under two years. The programme is unchanged since 1994 and is
            performed without intermission.
          </p>
          <ol className={styles.movements}>
            {MOVEMENTS.map((m, i) => (
              <li key={m.numeral} className={styles.movement}>
                <p className={styles.movementNumeral} aria-hidden="true">
                  {m.numeral}
                </p>
                <div>
                  <h3 className={styles.movementTitle}>
                    {m.title}
                    <span className={styles.movementTempo}> · {m.tempo}</span>
                  </h3>
                  <p data-edit={`commission.prose2.${i}`} data-edit-max="240" data-edit-multiline className={styles.prose}>{m.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Ornament />

        {/* ------------------------------------------------------ LUTHIER */}
        <section className={styles.luthier} aria-labelledby="luthier-h">
          <figure className={styles.luthierPlate}>
            <div className={styles.luthierPortrait}>
              <Figure editId="photo.madrigal-luthier"
                slug="madrigal-luthier"
                alt="Ottavio Madrigal, white-haired and spectacled, in his burgundy work apron"
                className={styles.luthierImg}
              />
            </div>
            <figcaption data-edit="luthier.luthierCaption" data-edit-max="120" data-edit-multiline className={styles.luthierCaption}>
              Ottavio at the front bench, photographed in the varnish room
              window.
            </figcaption>
          </figure>
          <div className={styles.luthierBody}>
            <h2 data-edit="luthier.sectionTitle" data-edit-max="60" className={styles.sectionTitle} id="luthier-h">
              The Luthier
            </h2>
            <p className={styles.luthierName}>
              <span data-edit="luthier.smallCaps" data-edit-max="60" className={styles.smallCaps}>Ottavio Madrigal</span> ·
              second of the name
            </p>
            <p data-edit="luthier.prose" data-edit-max="240" data-edit-multiline className={styles.prose}>
              Ottavio has kept the front bench since 1994 and the glue pot
              since 1979. He trained under his father and, by his own account,
              under every instrument that came in for repair: "the
              broken ones are the honest teachers." His violins carry the
              house model forward with a slightly fuller lower bout and a
              varnish he will discuss only in the past tense.
            </p>
            <p data-edit="luthier.prose2" data-edit-max="240" data-edit-multiline className={styles.prose}>
              He is assisted three days a week by his daughter Bianca, who
              rehairs the bows, keeps the ledger, and is teaching the workshop
              cat nothing, because the cat was here first.
            </p>
          </div>
        </section>

        <Ornament />

        {/* ----------------------------------------------------- CONCERTS */}
        <section className={styles.concerts} aria-labelledby="concerts-h">
          <h2 data-edit="concerts.sectionTitle" data-edit-max="60" className={styles.sectionTitle} id="concerts-h">
            Concerts &amp; Placements
          </h2>
          <figure className={styles.concertFigure}>
            <Figure editId="photo.madrigal-concert"
              slug="madrigal-concert"
              alt="A string quartet on a warmly lit stage, two Madrigal instruments among them"
              className={styles.framedImg}
            />
            <figcaption data-edit="concerts.caption" data-edit-max="120" data-edit-multiline className={styles.caption}>
              The Merle Quartet at the Teatro Aurelio, spring programme, 2026.
            </figcaption>
          </figure>
          <p data-edit="concerts.prose" data-edit-max="240" data-edit-multiline className={styles.prose}>
            Our instruments work for a living. The ledger currently places
            them in the following hands, among others who prefer not to be
            listed:
          </p>
          <ul className={styles.placements}>
            {PLACEMENTS.map((p, i) => (
              <li key={p.holder} className={styles.placementRow}>
                <span data-edit={`concerts.placementHolder.${i}`} data-edit-max="60" className={styles.placementHolder}>{p.holder}</span>
                <span data-edit={`concerts.placementDetail.${i}`} data-edit-max="60" className={styles.placementDetail}>{p.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <Ornament />

        {/* ----------------------------------------------------- VISITING */}
        <section className={styles.visiting} aria-labelledby="visiting">
          <div data-edit-pattern="visiting.field" data-edit-roles="0,1,4,2" className={styles.visitingField}>
            <TabbiedPattern
              pattern={lunette}
              palette={[AUBERGINE, WINE, GOLD, CARMINE]}
              seed="md-visiting"
              fit="grid"
              cellSize={86}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.visitingScrim} aria-hidden="true" />
          </div>
          <h2 data-edit="visiting.sectionTitle" data-edit-max="60" className={styles.sectionTitle} id="visiting">
            Visiting the Atelier
          </h2>
          <p data-edit="visiting.prose" data-edit-max="240" data-edit-multiline className={styles.prose}>
            The workshop is open to players, students, and the politely
            curious. Ring the lower bell; the upper one has been ornamental
            since 1983.
          </p>
          <div className={styles.visitGrid}>
            <div className={styles.visitCell}>
              <h3 data-edit="visiting.visitLabel" data-edit-max="40" className={styles.visitLabel}>Address</h3>
              <p className={styles.visitValue}>
                Vicolo dei Liutai 7<br />
                Casteldoro, 53077
              </p>
            </div>
            <div className={styles.visitCell}>
              <h3 data-edit="visiting.visitLabel2" data-edit-max="40" className={styles.visitLabel}>Hours</h3>
              <p className={styles.visitValue}>
                Tuesday - Friday, 10-18
                <br />
                Saturday by appointment
              </p>
            </div>
            <div className={styles.visitCell}>
              <h3 data-edit="visiting.visitLabel3" data-edit-max="40" className={styles.visitLabel}>Correspondence</h3>
              <p className={styles.visitValue}>
                <a data-edit="visiting.link" data-edit-max="28" href="mailto:bottega@madrigal.example">
                  bottega@madrigal.example
                </a>
                <br />
                Letters answered on Mondays
              </p>
            </div>
          </div>
          <p data-edit="visiting.visitNote" data-edit-max="240" data-edit-multiline className={styles.visitNote}>
            Repairs and rehairs are taken Tuesday mornings, in the order the
            cases arrive.
          </p>
        </section>
      </main>

      {/* --------------------------------------------------------- FOOTER */}
      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="0,1,2,3,4" className={styles.footerBand}>
          <TabbiedPattern
            pattern={linocut}
            palette={[AUBERGINE, WINE, CARMINE, VERMILION, GOLD]}
            seed="md-footer"
            fit="grid"
            cellSize={40}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.colophon}>
          <p data-edit="footer.colophonTitle" data-edit-max="240" data-edit-multiline className={styles.colophonTitle}>Madrigal</p>
          <p data-edit="footer.colophonLine" data-edit-max="240" data-edit-multiline className={styles.colophonLine}>
            Atelier di Liuteria · Vicolo dei Liutai 7, Casteldoro · Anno
            MCMLXVIII
          </p>
          <p className={styles.colophonFine}>
            This programme is set in Garamond's manner; the engravings
            are cut fresh at every printing by{' '}
            <a data-edit="footer.link" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            . A fictional workshop, engraved with real affection. © 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
