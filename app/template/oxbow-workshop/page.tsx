import { TabbiedPattern } from 'tabbied/react';
import { halving, mortise } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './oxbow-workshop.module.css';

export const metadata = {
  title: 'Oxbow Workshop · Catalogue № 7, Spring 2026',
  description:
    'Oxbow is a furniture workshop in the Hudson Valley. Four pieces in oak, walnut and ash: numbered plates, full materials, honest lead times. Commissions open.',
};

const BONE = '#F5F1E8';
const INK = '#2E2A25';
const OAK = '#A9713C';
const WALNUT = '#6B4F35';
const SAGE = '#9AA69B';
const SAND = '#C7BBA5';

type Plate = {
  no: string;
  title: string;
  slug: string;
  alt: string;
  field: 'pattern' | 'sage' | 'sand';
  seed?: string;
  palette?: string[];
  wide?: boolean;
  para: string;
  specs: [string, string][];
};

const PLATES: Plate[] = [
  {
    no: '01',
    title: 'Low Chair',
    slug: 'oxbow-chair-cutout',
    alt: 'A low lounge chair in pale oak with a hand-woven cane seat and back',
    field: 'pattern',
    seed: 'ox-plate-01',
    palette: [BONE, SAND, SAGE],
    para: 'A chair for sitting low and long. The seat is woven in unbleached cane over an oak frame; the back is shaped with a spokeshave to meet the spine, not the eye.',
    specs: [
      ['Materials', 'Quartersawn white oak, cane'],
      ['Joinery', 'Wedged through-tenons'],
      ['Finish', 'Hard-wax oil'],
      ['Dimensions', 'W 640 × D 780 × H 690 mm'],
      ['Lead time', '8 weeks'],
      ['Price', '$2,400'],
    ],
  },
  {
    no: '02',
    title: 'Long Credenza',
    slug: 'oxbow-credenza-cutout',
    alt: 'A long, low credenza in dark walnut with sliding doors and slender legs',
    field: 'sand',
    wide: true,
    para: 'Casework in walnut, carcase dovetailed at each corner. The doors slide on waxed oak runners; there is no hardware to catch a sleeve. Interior in ash, left bright.',
    specs: [
      ['Materials', 'Black walnut, ash interior'],
      ['Joinery', 'Through-dovetails, sliding doors'],
      ['Finish', 'Oil and wax'],
      ['Dimensions', 'W 1800 × D 450 × H 640 mm'],
      ['Lead time', '12 weeks'],
      ['Price', '$6,800'],
    ],
  },
  {
    no: '03',
    title: 'Staked Stool',
    slug: 'oxbow-stool-cutout',
    alt: 'A three-legged stool with a carved round seat and splayed legs',
    field: 'pattern',
    seed: 'ox-plate-03',
    palette: [BONE, SAGE, SAND],
    para: 'Three legs, because floors are not flat. The seat is saddled by hand from a single ash plank; the legs are riven, not sawn, so the grain runs their full length.',
    specs: [
      ['Materials', 'Ash, riven and shaved'],
      ['Joinery', 'Staked, wedged'],
      ['Finish', 'Raw, burnished'],
      ['Dimensions', 'Ø 340 × H 450 mm'],
      ['Lead time', '3 weeks'],
      ['Price', '$480'],
    ],
  },
  {
    no: '04',
    title: 'Paper Lamp',
    slug: 'oxbow-lamp-cutout',
    alt: 'A tall floor lamp with a blackened-steel stem and a cylindrical paper shade',
    field: 'sage',
    para: 'Steel where it must be, paper where it can be. The stem is blackened bar stock on a cast base; the shade is kozo paper on an oak ring, and it warms a room, not a page.',
    specs: [
      ['Materials', 'Blackened steel, kozo paper, oak'],
      ['Joinery', 'Turned collar, set screw'],
      ['Finish', 'Wax over blackening'],
      ['Dimensions', 'Ø 320 × H 1420 mm'],
      ['Lead time', '5 weeks'],
      ['Price', '$1,150'],
    ],
  },
];

const MAKERS = [
  {
    slug: 'oxbow-maker-1',
    alt: 'Portrait of Naomi Alcott in a charcoal work apron',
    name: 'Naomi Alcott',
    role: 'Founder · chairs, weaving',
    bio: 'Trained as a boatbuilder; still lofts every chair full-scale on the shop floor. Keeps the cane damp and the jokes dry.',
    plate: 'Fig. iv',
  },
  {
    slug: 'oxbow-maker-2',
    alt: 'Portrait of Edmund Tate in a rust-colored chore coat',
    name: 'Edmund Tate',
    role: 'Casework, finishing',
    bio: 'Thirty years at the bench. Grades every board in the yard by ear as much as by eye, and has never once rushed an oil coat.',
    plate: 'Fig. v',
  },
];

const COMMISSION_STEPS = [
  {
    numeral: 'I',
    title: 'Enquiry',
    body: 'Write with a room, a use, and a budget. Photographs help. We answer within the week, plainly, including when the answer is no.',
  },
  {
    numeral: 'II',
    title: 'Drawings',
    body: 'Full-scale drawings and a wood sample, posted to you. Two rounds of revision are included. A third of the price reserves the bench.',
  },
  {
    numeral: 'III',
    title: 'Making',
    body: 'Six to fourteen weeks, depending on the work. You receive one photograph, midway, from the bench. The piece is better than the updates would be.',
  },
  {
    numeral: 'IV',
    title: 'Delivery',
    body: 'Blanket-wrapped in our own van within two hundred miles; crated in ash offcuts beyond. We place it, level it, and take the wrappings home.',
  },
];

export default function OxbowWorkshopPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--bone': '#f5f1e8',
        '--ink': '#2e2a25',
        '--oak': '#a9713c',
        '--walnut': '#6b4f35',
        '--sage': '#9aa69b',
        '--sand': '#c7bba5',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="bone,ink,oak,walnut,sage,sand"
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
        href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400..700;1,400..700&family=Mulish:wght@300..700&display=swap"
      />

      {/* MASTHEAD - a label pasted on the catalogue's patterned endpaper */}
      <header className={styles.masthead}>
        <div data-edit-pattern="masthead.field" data-edit-roles="0,5,4,2" className={styles.mastField} aria-hidden="true">
          <TabbiedPattern
            pattern={mortise}
            palette={[BONE, SAND, SAGE, OAK]}
            seed="ox-endpaper-02"
            fit="grid"
            cellSize={88}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.mastScrim} aria-hidden="true" />
        <div className={styles.mastPlate}>
          <p data-edit="masthead.mastLabel" data-edit-max="240" data-edit-multiline className={styles.mastLabel}>Catalogue № 7 · Spring 2026</p>
          <h1 data-edit="masthead.mastTitle" data-edit-max="70" className={styles.mastTitle}>OXBOW</h1>
          <p data-edit="masthead.mastSub" data-edit-max="240" data-edit-multiline className={styles.mastSub}>Furniture Workshop · Hudson Valley</p>
          <nav className={styles.mastNav} aria-label="Catalogue contents">
            <a data-edit="masthead.collection" data-edit-max="28" href="#collection">The Collection</a>
            <span aria-hidden="true">·</span>
            <a data-edit="masthead.joinery" data-edit-max="28" href="#joinery">On Joinery</a>
            <span aria-hidden="true">·</span>
            <a data-edit="masthead.workshop" data-edit-max="28" href="#workshop">The Workshop</a>
            <span aria-hidden="true">·</span>
            <a data-edit="masthead.commissions" data-edit-max="28" href="#commissions">Commissions</a>
          </nav>
        </div>
      </header>

      <main>
        {/* FRONTISPIECE */}
        <section className={styles.frontis} aria-labelledby="frontis-title">
          <h2 data-edit="frontis.visuallyHidden" data-edit-max="60" id="frontis-title" className={styles.visuallyHidden}>
            Frontispiece
          </h2>
          <figure className={styles.frontisFigure}>
            <div className={styles.frontisFrame}>
              <Figure editId="photo.oxbow-hero"
                slug="oxbow-hero"
                alt="The Oxbow workshop in morning light: benches, clamps on the wall, shavings on the floor"
                priority
                className={styles.coverImg}
              />
            </div>
            <figcaption data-edit="frontis.plateCaption" data-edit-max="120" data-edit-multiline className={styles.plateCaption}>
              Fig. i · The workshop at Millbrook Lane, seven in the morning.
            </figcaption>
          </figure>
          <p data-edit="frontis.frontisStatement" data-edit-max="240" data-edit-multiline className={styles.frontisStatement}>
            Four objects this season. Oak, walnut, ash. Everything here is cut,
            fitted, and finished by two pairs of hands in one room, and priced
            to say so.
          </p>
        </section>

        {/* THE COLLECTION */}
        <section
          id="collection"
          className={styles.collection}
          aria-labelledby="collection-title"
        >
          <header className={styles.chapterHead}>
            <p data-edit="chapterHead.chapterLabel" data-edit-max="240" data-edit-multiline className={styles.chapterLabel}>Part One</p>
            <h2 data-edit="chapterHead.chapterTitle" data-edit-max="60" className={styles.chapterTitle} id="collection-title">
              The Collection
            </h2>
          </header>

          {PLATES.map((plate, i) => (
            <article
              key={plate.no}
              className={`${styles.plate} ${i % 2 === 1 ? styles.plateFlip : ''}`}
              aria-labelledby={`plate-${plate.no}`}
            >
              <div className={styles.plateMedia}>
                <div
                  className={`${styles.plateField} ${
                    plate.field === 'sage'
                      ? styles.fieldSage
                      : plate.field === 'sand'
                        ? styles.fieldSand
                        : ''
                  } ${plate.wide ? styles.plateFieldWide : ''}`}
                >
                  {plate.field === 'pattern' && (
                    <>
                      <TabbiedPattern
                        pattern={halving}
                        palette={plate.palette}
                        seed={plate.seed}
                        fit="grid"
                        cellSize={68}
                        style={{ position: 'absolute', inset: 0 }}
                      />
                      <span className={styles.plateVeil} aria-hidden="true" />
                    </>
                  )}
                  <Figure editId={`plate.photo.${i}`}
                    slug={plate.slug}
                    cutout
                    alt={plate.alt}
                    className={styles.plateImg}
                  />
                </div>
                <p className={styles.plateCaption}>
                  Plate {plate.no} · photographed against the shop wall,
                  unstyled.
                </p>
              </div>
              <div className={styles.plateText}>
                <p className={styles.plateNo}>Plate {plate.no}</p>
                <h3 data-edit={`plate.plateTitle.${i}`} data-edit-max="40" id={`plate-${plate.no}`} className={styles.plateTitle}>
                  {plate.title}
                </h3>
                <p data-edit={`plate.platePara.${i}`} data-edit-max="240" data-edit-multiline className={styles.platePara}>{plate.para}</p>
                <dl className={styles.specSheet}>
                  {plate.specs.map(([label, value], i2) => (
                    <div key={label} className={styles.specRow}>
                      <dt data-edit={`plate.term.${i}.${i2}`} data-edit-max="28">{label}</dt>
                      <dd data-edit={`plate.body.${i}.${i2}`} data-edit-max="200" data-edit-multiline>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </section>

        {/* ON JOINERY */}
        <section
          id="joinery"
          className={styles.joinery}
          aria-labelledby="joinery-title"
        >
          <header className={styles.chapterHead}>
            <p data-edit="chapterHead.chapterLabel2" data-edit-max="240" data-edit-multiline className={styles.chapterLabel}>Part Two</p>
            <h2 data-edit="chapterHead.chapterTitle2" data-edit-max="60" className={styles.chapterTitle} id="joinery-title">
              On Joinery
            </h2>
          </header>
          <div className={styles.joineryCols}>
            <figure className={styles.joineryFigure}>
              <div className={styles.joineryFrame}>
                <Figure editId="photo.oxbow-hands"
                  slug="oxbow-hands"
                  alt="Hands paring the shoulder of a dovetail with a chisel"
                  className={styles.coverImg}
                />
              </div>
              <figcaption data-edit="joinery.plateCaption" data-edit-max="120" data-edit-multiline className={styles.plateCaption}>
                Fig. ii · Paring a dovetail shoulder. The last two strokes
                matter most.
              </figcaption>
            </figure>
            <div className={styles.joineryText}>
              <p data-edit="joinery.body" data-edit-max="240" data-edit-multiline>
                We use glue, and we do not trust it. Every joint in this
                catalogue would hold with the glue omitted: the tenon is
                wedged, the dovetail is tapered, the stool leg swells against
                its socket as the seat dries around it.
              </p>
              <p data-edit="joinery.body2" data-edit-max="240" data-edit-multiline>
                The mortise and tenon is the oldest agreement in woodwork:
                one piece gives way so another can enter, and both are
                stronger for it. The pattern running through this catalogue is
                that joint, drawn plainly. We chose it over a photograph of
                one because the idea is the point.
              </p>
              <p data-edit="joinery.body3" data-edit-max="240" data-edit-multiline>
                Wood moves. A tabletop grows and shrinks a few millimetres
                every year, forever. Good joinery does not fight this; it
                leaves room. Buttons, slots, elongated holes; the quiet
                allowances are the craft.
              </p>
            </div>
          </div>
        </section>

        {/* QUIET DIVIDER */}
        <div data-edit-pattern="main.field" data-edit-roles="5,0,3,4" className={styles.tailband} aria-hidden="true">
          <TabbiedPattern
            pattern={halving}
            palette={[SAND, BONE, WALNUT, SAGE]}
            seed="ox-band-05"
            fit="grid"
            cellSize={76}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* THE WORKSHOP */}
        <section
          id="workshop"
          className={styles.workshop}
          aria-labelledby="workshop-title"
        >
          <header className={styles.chapterHead}>
            <p data-edit="chapterHead.chapterLabel3" data-edit-max="240" data-edit-multiline className={styles.chapterLabel}>Part Three</p>
            <h2 data-edit="chapterHead.chapterTitle3" data-edit-max="60" className={styles.chapterTitle} id="workshop-title">
              The Workshop
            </h2>
          </header>
          <figure className={styles.workshopFigure}>
            <div className={styles.workshopFrame}>
              <Figure editId="photo.oxbow-showroom"
                slug="oxbow-showroom"
                alt="The Oxbow showroom: finished pieces spaced widely on a pale floor"
                className={styles.coverImg}
              />
            </div>
            <figcaption data-edit="workshop.plateCaption" data-edit-max="120" data-edit-multiline className={styles.plateCaption}>
              Fig. iii · The showroom, one room over from the bench room.
            </figcaption>
          </figure>
          <div className={styles.workshopCols}>
            <p data-edit="workshop.body" data-edit-max="240" data-edit-multiline>
              Oxbow occupies a former cider barn at 6 Millbrook Lane, ten
              minutes from the river whose bend named us. The bench room holds
              two benches, a wall of clamps, and the timber for the year,
              stickered and drying. The showroom holds whatever is finished
              and nothing that is not.
            </p>
            <p data-edit="workshop.body2" data-edit-max="240" data-edit-multiline>
              We buy logs, not lumber, from two sawyers within an hour of the
              shop, and we dry them ourselves for eighteen months. It is the
              slowest possible way to work and the only one that lets us
              choose a board for the chair it will become.
            </p>
          </div>
          <dl className={styles.workshopFacts}>
            <div>
              <dt data-edit="workshop.term" data-edit-max="28">Founded</dt>
              <dd data-edit="workshop.body3" data-edit-max="200" data-edit-multiline>2014</dd>
            </div>
            <div>
              <dt data-edit="workshop.term2" data-edit-max="28">Makers</dt>
              <dd data-edit="workshop.body4" data-edit-max="200" data-edit-multiline>Two</dd>
            </div>
            <div>
              <dt data-edit="workshop.term3" data-edit-max="28">Timber drying</dt>
              <dd data-edit="workshop.body5" data-edit-max="200" data-edit-multiline>18 months</dd>
            </div>
            <div>
              <dt data-edit="workshop.term4" data-edit-max="28">Showroom</dt>
              <dd data-edit="workshop.body6" data-edit-max="200" data-edit-multiline>Sat 10 to 4, or by note</dd>
            </div>
          </dl>
        </section>

        {/* MAKERS */}
        <section className={styles.makers} aria-labelledby="makers-title">
          <header className={styles.chapterHead}>
            <p data-edit="chapterHead.chapterLabel4" data-edit-max="240" data-edit-multiline className={styles.chapterLabel}>Part Four</p>
            <h2 data-edit="chapterHead.chapterTitle4" data-edit-max="60" className={styles.chapterTitle} id="makers-title">
              The Makers
            </h2>
          </header>
          <div className={styles.makerGrid}>
            {MAKERS.map((m, i) => (
              <article key={m.name} className={styles.makerCard}>
                <div className={styles.makerMat}>
                  <div className={styles.makerFrame}>
                    <Figure editId={`makerCard.photo.${i}`}
                      slug={m.slug}
                      alt={m.alt}
                      className={styles.makerImg}
                    />
                  </div>
                </div>
                <p className={styles.plateCaption}>
                  {m.plate} · at the bench, one window, no styling.
                </p>
                <h3 data-edit={`makerCard.makerName.${i}`} data-edit-max="40" className={styles.makerName}>{m.name}</h3>
                <p data-edit={`makerCard.makerRole.${i}`} data-edit-max="240" data-edit-multiline className={styles.makerRole}>{m.role}</p>
                <p data-edit={`makerCard.makerBio.${i}`} data-edit-max="240" data-edit-multiline className={styles.makerBio}>{m.bio}</p>
              </article>
            ))}
          </div>
        </section>

        {/* COMMISSIONS */}
        <section
          id="commissions"
          className={styles.commissions}
          aria-labelledby="commissions-title"
        >
          <header className={styles.chapterHead}>
            <p data-edit="chapterHead.chapterLabel5" data-edit-max="240" data-edit-multiline className={styles.chapterLabel}>Part Five</p>
            <h2 data-edit="chapterHead.chapterTitle5" data-edit-max="60" className={styles.chapterTitle} id="commissions-title">
              Commissions
            </h2>
            <div data-edit-pattern="chapterHead.field" data-edit-roles="0,2,3" className={styles.ornament} aria-hidden="true">
              <TabbiedPattern
                pattern={mortise}
                palette={[BONE, OAK, WALNUT]}
                seed="ox-ornament-01"
                fit="grid"
                cellSize={26}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
          </header>
          <p data-edit="commissions.commissionsLede" data-edit-max="240" data-edit-multiline className={styles.commissionsLede}>
            Half of each year's bench time is kept for commissioned work:
            dining tables, benches, the occasional bed. The process has four
            movements and no surprises.
          </p>
          <ol className={styles.movementList}>
            {COMMISSION_STEPS.map((s, i) => (
              <li key={s.numeral} className={styles.movement}>
                <span className={styles.movementNumeral} aria-hidden="true">
                  {s.numeral}
                </span>
                <h3 data-edit={`commissions.movementTitle.${i}`} data-edit-max="40" className={styles.movementTitle}>{s.title}</h3>
                <p data-edit={`commissions.movementBody.${i}`} data-edit-max="240" data-edit-multiline className={styles.movementBody}>{s.body}</p>
              </li>
            ))}
          </ol>
          <p className={styles.commissionsNote}>
            The book opens for autumn on the first of September. Write to{' '}
            <a data-edit="commissions.colophon" data-edit-max="28" href="#colophon">bench@oxbow.example</a>.
          </p>
        </section>

        {/* CARE & DELIVERY */}
        <section className={styles.care} aria-labelledby="care-title">
          <header className={styles.chapterHead}>
            <p data-edit="chapterHead.chapterLabel6" data-edit-max="240" data-edit-multiline className={styles.chapterLabel}>Appendix</p>
            <h2 data-edit="chapterHead.chapterTitle6" data-edit-max="60" className={styles.chapterTitle} id="care-title">
              Care &amp; Delivery
            </h2>
          </header>
          <div className={styles.careCols}>
            <div>
              <h3 data-edit="care.careHead" data-edit-max="40" className={styles.careHead}>Care of oiled wood</h3>
              <p data-edit="care.body" data-edit-max="240" data-edit-multiline>
                Dust with a dry cloth. Wipe spills when you notice them, not
                urgently. Once a year, a coin-sized pool of the oil we send
                with each piece, spread thin and buffed after twenty minutes.
                No silicone polish, ever; it cannot be undone.
              </p>
              <p data-edit="care.body2" data-edit-max="240" data-edit-multiline>
                Walnut lightens toward honey in sunlight; oak deepens. Neither
                is damage. A ring left by a glass will usually rub out with
                the oil; a dent can be raised with a damp cloth and a warm
                iron. Anything worse, bring it back. Repairs to our own work
                are free for as long as we exist.
              </p>
            </div>
            <div>
              <h3 data-edit="care.careHead2" data-edit-max="40" className={styles.careHead}>Delivery</h3>
              <p data-edit="care.body3" data-edit-max="240" data-edit-multiline>
                Within two hundred miles of the workshop we deliver ourselves,
                blanket-wrapped, and place the piece where it will live.
                Farther afield, work travels crated in ash offcuts with a
                carrier we have used for nine years. Crates are returnable;
                most come back as firewood, which is also fine.
              </p>
              <p data-edit="care.body4" data-edit-max="240" data-edit-multiline>
                Lead times in this catalogue are honest, not optimistic. When
                a date moves, you hear it from us first, with a reason.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* COLOPHON */}
      <footer id="colophon" className={styles.colophon}>
        <div className={styles.colophonInner}>
          <div className={styles.colophonRule} aria-hidden="true" />
          <p data-edit="colophon.colophonMark" data-edit-max="240" data-edit-multiline className={styles.colophonMark}>OXBOW</p>
          <address className={styles.colophonAddress}>
            6 Millbrook Lane · Hudson Valley, New York
            <br />
            bench@oxbow.example · Showroom Saturdays 10 to 4
          </address>
          <p className={styles.colophonNote}>
            Catalogue № 7, set in Cormorant and Mulish. Photography made in the
            workshop with no styling and one window. Two joints are drawn
            through the book: "Mortise" on the endpapers and "Halving" on the
            plates and bands, both with{' '}
            <a data-edit="colophon.tabbiedCredit" data-edit-max="28"
              href="https://tabbied.com"
              target="_blank"
              rel="noreferrer noopener"
              className={styles.tabbiedCredit}
            >
              Tabbied
            </a>
            .
          </p>
        </div>
        {/* back endpaper */}
        <div data-edit-pattern="colophon.field" data-edit-roles="1,5,2" className={styles.colophonTail} aria-hidden="true">
          <TabbiedPattern
            pattern={mortise}
            palette={[INK, SAND, OAK]}
            seed="ox-tail-08"
            fit="grid"
            cellSize={84}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <p data-edit="colophon.colophonFinis" data-edit-max="240" data-edit-multiline className={styles.colophonFinis}>© 2026 Oxbow Workshop · finis.</p>
      </footer>
    </div>
  );
}
