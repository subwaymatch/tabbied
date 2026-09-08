import { TabbiedPattern } from 'tabbied/react';
import {
  baste, birdsmouth, bobbin, buttonhole, cleat, curl, wander,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './ringmark.module.css';

export const metadata = {
  title: 'Ringmark: Bird observatory, Helgoland',
  description:
    'A ringing station on a North Sea island, manned every day since 1909. Totals published every January, whatever they say.',
};

/* Pale sand ground, ink, one lichen green. Every decorative field takes
   `transparent` in the background slot, so the ground of the page - and, in
   the plates, the plate itself - is what shows through the drawing. */
const INK = '#16180f';
const ACCENT = '#6b7f1e';
const GREY = '#8c8b7c';
const PANEL = '#dedcce';

/* Last year's list. Anything under twenty birds is in the appendix, not here. */
const SPECIES: [string, string][] = [
  ['Goldcrest', '4 118'], ['Robin', '2 906'], ['Blackcap', '2 441'],
  ['Chiffchaff', '1 887'], ['Song Thrush', '1 402'], ['Dunnock', '1 190'],
  ['Willow Warbler', '1 044'], ['Redwing', '968'], ['Blackbird', '901'],
  ['Brambling', '744'], ['Reed Warbler', '612'], ['Redstart', '588'],
  ['Wheatear', '431'], ['Pied Flycatcher', '397'], ['Siskin', '362'],
  ['Whitethroat', '318'], ['Bluethroat', '204'], ['Wryneck', '96'],
  ['Barred Warbler', '61'], ['Red-backed Shrike', '44'], ['Yellow-browed Warbler', '38'],
  ['Icterine Warbler', '27'],
];

const ROUNDS = [
  { n: '01', t: 'First round', d: 'The trap is walked at first light, before the birds have settled and before the gulls find them', at: '05:00' },
  { n: '02', t: 'Hourly rounds', d: 'Every hour to dusk. A bird is out of the trap and in a bag within four minutes, which is the whole discipline', at: '06:00 - 21:00' },
  { n: '03', t: 'On the bench', d: 'Ring, species, age, sex, wing, weight, fat and muscle. Ninety seconds a bird, and the bird decides if it is less', at: 'Continuous' },
  { n: '04', t: 'Release', d: 'From the hand, at the door, facing the dunes. Nothing is held over, nothing is kept', at: 'Continuous' },
  { n: '05', t: 'Enter and check', d: 'Written on paper first, typed the same evening, and read back by a second person before it counts', at: '22:00' },
];

const PRINCIPLES = [
  {
    art: baste,
    img: 'ringmark-tile-rings-cutout',
    alt: 'A small coil of plain aluminium bird rings on a wire loop',
    n: 'I',
    t: 'Every bird, every day',
    d: 'The station has been manned on every single day since 1909, through two wars and one evacuation. A gap in a hundred-and-seventeen-year series is worth more than any one season in it.',
  },
  {
    art: bobbin,
    img: 'ringmark-tile-pliers-cutout',
    alt: 'A pair of brass bird-ringing pliers',
    n: 'II',
    t: 'Four minutes in the trap',
    d: 'Rounds are hourly and never skipped, whatever the weather is doing. A bird that waits is a bird that loses more than the data is worth.',
  },
  {
    art: buttonhole,
    img: 'ringmark-tile-balance-cutout',
    alt: 'A slim spring balance with a hook at one end',
    n: 'III',
    t: 'Published as recorded',
    d: 'Totals go out every January without smoothing, without adjustment and without a covering note explaining why a bad year was really quite good.',
  },
];

const TOTALS = [
  ['2026', '31 208', '164 species', '11 controls abroad', 'Wettest autumn on record'],
  ['2025', '28 771', '158 species', '19 controls abroad', 'Late Goldcrest fall, 3 700 in a day'],
  ['2024', '34 990', '171 species', '14 controls abroad', 'First Siberian Rubythroat since 1991'],
  ['2023', '26 415', '149 species', '9 controls abroad', 'Trap rebuilt, six weeks lost'],
  ['2022', '30 116', '162 species', '21 controls abroad', ''],
  ['2021', '29 004', '155 species', '17 controls abroad', 'Two-week closure in April'],
  ['2020', '22 388', '141 species', '6 controls abroad', 'Station manned by two people only'],
  ['2019', '33 542', '168 species', '15 controls abroad', 'Centenary of the ringing scheme'],
];

const RECORD = [
  ['Ring', 'Aluminium, size 0 to 6', 'Fitted with pliers', 'Never re-used'],
  ['Wing', 'Maximum chord', 'To 0.5 mm', 'Stopped rule'],
  ['Weight', 'To 0.1 g', 'In a cone or a bag', 'Spring balance, tared'],
  ['Fat', 'Score 0 to 8', 'Furcular hollow', 'By eye, one observer'],
  ['Muscle', 'Score 0 to 3', 'Over the keel', 'By eye, one observer'],
  ['Age', 'EURING code', 'Plumage and skull', 'Recorded as unknown when unknown'],
  ['Moult', 'Primaries scored', '0 to 5 per feather', 'Only in autumn'],
  ['Time', 'To the nearest hour', 'Round, not capture', 'Local time, never shifted'],
  ['Observer', 'Initials', 'Every single record', 'Errors are attributable'],
  ['Check', 'Second reader', 'Same evening', 'Before it enters the database'],
];

const VISIT = [
  ['Station', 'Am Fallberg, 27498 Helgoland. Twenty minutes up from the harbour.'],
  ['Watching', 'Anyone may follow a round. Ask at the door; nobody has ever been turned away.'],
  ['Volunteers', 'Two-week placements, March to November. Bunk, food and no wages at all.'],
  ['Data', 'Every record since 1909 is public. The paper ledgers are digitised to 1962 so far.'],
];

/* What the letter is, answered before anyone has to ask. */
const SIGNUP_META: [string, string][] = [
  ['How often', 'Twice a season, and once more if something odd lands.'],
  ['What is in it', 'Totals, recoveries, and the birds we did not expect.'],
  ['Found a ring?', 'Send the number to fang@ringmark.example instead.'],
];

export default function RingmarkPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--ground': '#efede3',
        '--ink': '#16180f',
        '--accent': '#6b7f1e',
        '--grey': '#8c8b7c',
        '--panel': '#dedcce',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="ground,ink,accent,grey,panel"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Ringmark</a>
        <nav aria-label="Sections">
          <a data-edit="bar.species" data-edit-max="28" href="#species">Species</a>
          <a data-edit="bar.making" data-edit-max="28" href="#making">The day</a>
          <a data-edit="bar.totals" data-edit-max="28" href="#totals">Totals</a>
          <a data-edit="bar.record" data-edit-max="28" href="#record">What we record</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Vogelwarte / Helgoland</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={birdsmouth}
              palette={['transparent', PANEL, GREY, ACCENT]}
              fit="grid"
              cellSize={148}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Bird observatory / Helgoland / every day since 1909</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Thirty-one</span>
            <span data-edit="hero.text2" data-edit-max="60">thousand</span>
            <span data-edit="hero.hi" data-edit-max="60" className={s.hi}>birds. One island.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              One trap, hourly rounds from first light, and a hundred and
              seventeen years of the same nine measurements written down in the
              same order.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#making">
              A day at the station
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------ BLEED SCENE */}
        <figure className={s.bleed}>
          <Figure editId="photo.ringmark-trap"
            slug="ringmark-trap"
            alt="A large timber and netting Heligoland funnel trap running through low dune scrub"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>The funnel, from the wide end. Sixty metres to the catching box.</figcaption>
        </figure>

        {/* --------------------------------------------------------- SPECIES
            The year's list set as one block of display type. It is a table
            that happens to read as a poster. */}
        <section id="species" className={s.species} aria-labelledby="species-h">
          <div className={s.secHead}>
            <h2 data-edit="species.title" data-edit-max="60" id="species-h">Last year, in order</h2>
            <p data-edit="species.body" data-edit-max="240" data-edit-multiline>
              Twenty-two species of the hundred and sixty-four recorded.
              Everything under twenty birds is in the appendix, not on the
              front page.
            </p>
          </div>
          <ul className={s.speciesList}>
            {SPECIES.map(([name, n]) => (
              <li key={name}>
                {name}
                <i>{n}</i>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            The value of this station is not any single year. It is that
            somebody walked the same trap on the same island every day for a
            hundred and seventeen years and wrote down what was in it, on days
            when there was nothing in it at all.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Ringmark is a working ringing station, not a visitor centre.
              Three staff, six volunteers at a time, one trap and a hut that
              has been rebuilt four times.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              Everything we catch is measured, ringed and released inside about
              ninety seconds. Everything we record is published, including the
              years that make no sense.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,1,4" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={curl}
            palette={['transparent', ACCENT, INK, PANEL]}
            fit="grid"
            cellSize={112}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ---------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div className={s.secHead}>
            <h2 data-edit="making.title" data-edit-max="60" id="making-h">A day, five times over</h2>
            <p data-edit="making.body" data-edit-max="240" data-edit-multiline>Sixteen rounds between first light and dusk, and the same five things every time.</p>
          </div>
          <ol className={s.rows}>
            {ROUNDS.map((r, i) => (
              <li key={r.n}>
                <span data-edit={`making.rowN.${i}`} data-edit-max="60" className={s.rowN}>{r.n}</span>
                <h3 data-edit={`making.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{r.t}</h3>
                <span data-edit={`making.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{r.d}</span>
                <span data-edit={`making.rowDays.${i}`} data-edit-max="60" className={s.rowDays}>{r.at}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.ringmark-hut"
                slug="ringmark-hut"
                alt="A small whitewashed bird observatory hut standing among dunes under a pale sky"
              />
              <figcaption data-edit="making.caption" data-edit-max="120" data-edit-multiline>The hut. Rebuilt in 1947, 1962, 1991 and 2018, in the same footprint.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.ringmark-bench"
                slug="ringmark-bench"
                alt="A ringing bench seen from above with calipers, a spring balance and small paper bags"
              />
              <figcaption data-edit="making.caption2" data-edit-max="120" data-edit-multiline>The bench. Nine measurements, in this order, since 1909.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ PRINCIPLES */}
        <section className={s.principles} aria-labelledby="pr-h">
          <div className={s.secHead}>
            <h2 data-edit="pr.title" data-edit-max="60" id="pr-h">Three things we do not bend</h2>
            <p data-edit="pr.body" data-edit-max="240" data-edit-multiline>Two are about the birds. The third is about what a long series is worth.</p>
          </div>
          <div className={s.pGrid}>
            {PRINCIPLES.map((p, i) => (
              <article key={p.n}>
                <div className={s.pPlate}>
                  <div data-edit-pattern={`pr.field.${i}`} data-edit-roles="transparent,3,2" className={s.pField} aria-hidden="true">
                    <TabbiedPattern
                      pattern={p.art}
                      palette={['transparent', GREY, ACCENT]}
                      fit="grid"
                      cellSize={62}
                      redrawInterval={5400}
                      style={{ position: 'absolute', inset: 0 }}
                    />
                  </div>
                  <Figure editId={`pr.photo.${i}`} slug={p.img} alt={p.alt} cutout className={s.pObject} />
                </div>
                <p data-edit={`pr.pN.${i}`} data-edit-max="240" data-edit-multiline className={s.pN}>{p.n}</p>
                <h3 data-edit={`pr.title2.${i}`} data-edit-max="40">{p.t}</h3>
                <p data-edit={`pr.pBody.${i}`} data-edit-max="240" data-edit-multiline className={s.pBody}>{p.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- TOTALS */}
        <section id="totals" className={s.listing} aria-labelledby="totals-h">
          <div className={s.secHead}>
            <h2 data-edit="totals.title" data-edit-max="60" id="totals-h">Eight years</h2>
            <p data-edit="totals.body" data-edit-max="240" data-edit-multiline>Published every January. A control is one of our rings read by somebody else, somewhere else.</p>
          </div>
          <ol className={s.table}>
            {TOTALS.map((r, i) => (
              <li key={i}>
                <span data-edit={`totals.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`totals.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`totals.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`totals.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`totals.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={wander}
              palette={['transparent', ACCENT, GREY]}
              fit="grid"
              cellSize={116}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>A day with nothing in the trap is a data point. It took us forty years to start writing those down.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Dr Heike Stolzenberg, station head</cite>
          </blockquote>
        </section>

        {/* ---------------------------------------------------------- RECORD */}
        <section id="record" className={s.listing} aria-labelledby="record-h">
          <div className={s.secHead}>
            <h2 data-edit="record.title" data-edit-max="60" id="record-h">What goes on the card</h2>
            <p data-edit="record.body" data-edit-max="240" data-edit-multiline>Nine measurements and an initial. The order has not changed since the first ledger.</p>
          </div>
          <ol className={s.table}>
            {RECORD.map((r, i) => (
              <li key={i}>
                <span data-edit={`record.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`record.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`record.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span className={s.tMid} />
                <span data-edit={`record.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[3]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <div data-edit-pattern="visit.field" data-edit-roles="transparent,3,4" className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={baste}
              palette={['transparent', GREY, PANEL]}
              fit="grid"
              cellSize={102}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">Coming up the hill</h2>
          <dl className={s.visitList}>
            {VISIT.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`visit.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`visit.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Placements, recoveries, data requests</p>
          <h2 data-edit="contact.signupTitle" data-edit-max="60" id="contact-h" className={s.signupTitle}>The ringing report</h2>
          <form className={s.signup}>
            <label data-edit="contact.srOnly" className={s.srOnly} htmlFor="signup-mail">
              Email address
            </label>
            <input id="signup-mail" name="email" type="email" placeholder="you@example.com" />
            <button data-edit="contact.action" data-edit-max="24" type="submit">Put me on it</button>
          </form>
          <dl className={s.signupMeta}>
            {SIGNUP_META.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`contact.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`contact.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
          <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
            Am Fallberg, 27498 Helgoland. If you have found one of our rings,
            send the number and the place and we will tell you where the bird
            has been - that is a letter, not a newsletter, and it is always
            answered.
          </p>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,2,4,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={cleat}
          palette={['transparent', ACCENT, PANEL, GREY]}
          fit="grid"
          cellSize={102}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <div className={s.footObject}>
          <div className={s.footPlate}>
            <div data-edit-pattern="footer.field" data-edit-roles="transparent,3,2" className={s.footPlateField} aria-hidden="true">
              <TabbiedPattern
                pattern={curl}
                palette={['transparent', GREY, ACCENT]}
                fit="grid"
                cellSize={72}
                redrawInterval={6000}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <Figure editId="photo.ringmark-tile-logbook-cutout" slug="ringmark-tile-logbook-cutout" alt="A weathered field logbook with a pencil under its elastic loop" cutout className={s.footCut} />
          </div>
          <p data-edit="footer.footLine" data-edit-max="240" data-edit-multiline className={s.footLine}>A ring is only worth the line somebody wrote down beside it.</p>
        </div>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Station</h2>
            <ul>
              <li><a data-edit="footer.making" data-edit-max="28" href="#making">A day at the trap</a></li>
              <li><a data-edit="footer.record" data-edit-max="28" href="#record">What we record</a></li>
              <li><a data-edit="footer.visit" data-edit-max="28" href="#visit">Volunteering</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Results</h2>
            <ul>
              <li><a data-edit="footer.species" data-edit-max="28" href="#species">Last year</a></li>
              <li><a data-edit="footer.totals" data-edit-max="28" href="#totals">Eight years</a></li>
              <li><a data-edit="footer.visit2" data-edit-max="28" href="#visit">The archive</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Am Fallberg
              <br />
              27498 Helgoland
              <br />
              fang@ringmark.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional bird observatory. Totals, species counts and dates are invented.</p>
          <p>
            Patterns by{' '}
            <a data-edit="footer.link" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground; imagery generated with GPT Image 2.
          </p>
        </div>
      </footer>
    </div>
  );
}
