import { TabbiedPattern } from 'tabbied/react';
import { tidering, wavelet } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './cerulean-swim.module.css';

export const metadata = {
  title: 'Cerulean · Swimwear for the Long Swim',
  description:
    'Cerulean is a small swimwear label on the Ligurian coast. Regenerated-nylon suits cut for salt and sewn for sun. Collection № 04, Meltemi, is in the water now.',
};

const FOAM = '#F2FBFC';
const TEAL = '#0FA3B1';
const AQUA = '#B5E2E8';
const CORAL = '#FF8266';
const SUN = '#FFD97D';
const DEEP = '#134D57';

const LOOKS = [
  {
    kind: 'photo' as const,
    slug: 'cerulean-beach',
    alt: 'Rows of striped parasols leaning over pale sand at midday',
    caption: 'Look 01 · parasol lines, Spiaggia di Levante',
    wide: true,
  },
  {
    kind: 'photo' as const,
    slug: 'cerulean-print-shorebreak',
    alt: 'Swim jersey printed with the Shorebreak repeat, folded so the arcs bend across the cloth',
    caption: 'Print · "Shorebreak", four inks',
    wide: false,
  },
  {
    kind: 'photo' as const,
    slug: 'cerulean-dive',
    alt: 'A swimmer gliding underwater through blue light, trailing a ribbon of bubbles',
    caption: 'Look 02 · the quiet under the surface',
    wide: false,
  },
  {
    kind: 'photo' as const,
    slug: 'cerulean-pool',
    alt: 'A sunlit pool corner with a chrome ladder and rippling tiles',
    caption: 'Look 03 · hotel pool, seven a.m.',
    wide: false,
  },
  {
    kind: 'photo' as const,
    slug: 'cerulean-print-undertow',
    alt: 'The darker Undertow colourway of the same repeat, with occasional arcs in coral',
    caption: 'Print · "Undertow", coral thread',
    wide: false,
  },
];

// Water temperatures are the club letter's whole premise, so the swims get a
// table of their own rather than prose.
const SWIMS = [
  { place: 'Baia dei Saraceni', where: 'Finale Ligure', temp: '19-24°C', season: 'May to October', note: 'Flat by seven, busy by ten. Enter off the left-hand rocks.' },
  { place: 'Punta Chiappa', where: 'Camogli', temp: '17-23°C', season: 'June to September', note: 'Deep straight off the shelf. The current runs west after noon.' },
  { place: 'Lido di Sestri', where: 'Sestri Levante', temp: '18-25°C', season: 'May to October', note: 'Our own bay. Two buoys, four hundred metres apart.' },
  { place: 'Cala Cipolla', where: 'Sardinia', temp: '20-26°C', season: 'June to October', note: 'Warmest water we publish. Shallow for a long way out.' },
  { place: 'Bagni Blu', where: 'Genova Nervi', temp: '16-22°C', season: 'All year, if you insist', note: 'The winter swim. Somebody is always already in.' },
];

const SIZES = [
  { size: 'XS', bust: '78-82', waist: '60-64', hip: '86-90', torso: '58' },
  { size: 'S', bust: '82-86', waist: '64-68', hip: '90-94', torso: '60' },
  { size: 'M', bust: '86-92', waist: '68-74', hip: '94-100', torso: '62' },
  { size: 'L', bust: '92-98', waist: '74-80', hip: '100-106', torso: '64' },
  { size: 'XL', bust: '98-106', waist: '80-88', hip: '106-114', torso: '66' },
  { size: 'XXL', bust: '106-114', waist: '88-96', hip: '114-122', torso: '68' },
];

const QUESTIONS = [
  { q: 'Which cut should I order?', a: 'If you swim lengths or race, take High tide and your usual size. If you swim to float, read a book and get wet, take Low tide. Between the two, the torso length is the thing that changes, not the width.' },
  { q: 'What happens between sizes?', a: 'Size down for a training fit, up for comfort. The knit gives about a centimetre in the water and takes it back when it dries.' },
  { q: 'Will chlorine finish it?', a: 'Eventually, as it finishes everything. Aqualith holds colour through two hundred and forty hours of testing, which is about three summers of daily lengths. Rinse cold and it will outlast that.' },
  { q: 'Do you take returns?', a: 'Thirty days, unworn, hygiene strip intact. Post it back in the bag it came in; the bag is the return envelope, which is why it looks like that.' },
  { q: 'Do you make anything for men?', a: 'Trunks in the same two cuts, from spring. The waistband took eleven goes and is still not right.' },
];

const PRODUCTS = [
  {
    slug: 'cerulean-suit-1-cutout',
    alt: 'Deep-teal one-piece swimsuit laid flat',
    name: 'The Ondine',
    kind: 'One-piece · low scooped back',
    price: '$148',
    note: 'Our first cut and still the one we reach for. Holds its line from first length to last.',
    tall: true,
  },
  {
    slug: 'cerulean-suit-2-cutout',
    alt: 'Two-piece swimsuit in aqua and coral laid flat',
    name: 'The Riva',
    kind: 'Two-piece · tie sides',
    price: '$132',
    note: 'Top and bottom sold as a pair, sized separately. Stays put through a proper dive.',
    tall: false,
  },
  {
    slug: 'cerulean-goggles-cutout',
    alt: 'Mirrored swimming goggles with pale straps',
    name: 'Noon Goggles',
    kind: 'Mirrored · anti-fog',
    price: '$38',
    note: 'For the glare hours. Split-seal gaskets, no raccoon rings before lunch.',
    tall: false,
  },
  {
    slug: 'cerulean-towel-cutout',
    alt: 'A rolled beach towel striped in aqua, sun-yellow and coral',
    name: 'The Meridian Towel',
    kind: 'Woven cotton · 90 × 170 cm',
    price: '$56',
    note: 'Loomed dense, hemmed flat, dries before you do. Sand shakes out in one flick.',
    tall: false,
  },
];

const FABRIC_FACTS = [
  { label: 'Regenerated nylon', value: '78%' },
  { label: 'Elastane', value: '22%' },
  { label: 'Sun protection', value: 'UPF 50+' },
  { label: 'Chlorine tested', value: '240 hrs' },
  { label: 'Sizes', value: 'XS to 3XL' },
  { label: 'Cuts', value: 'Low tide / High tide' },
];

const CARE_STEPS = [
  {
    title: 'Rinse before you rest',
    body: 'Fresh, cool water within the hour: salt and chlorine keep working long after you stop swimming.',
  },
  {
    title: 'Hands, not machines',
    body: 'A basin, a drop of mild soap, a gentle press. Never wring; twisting is what ages elastane, not swimming.',
  },
  {
    title: 'Dry flat, in shade',
    body: 'Lay it on the Meridian, roll once, then flat over a rail out of the sun. Direct heat fades a print in a season.',
  },
  {
    title: 'Mind the rough edges',
    body: 'Pool copings, pier ladders, velcro straps: snags love a fine knit. Sit on the towel; that is what it is for.',
  },
  {
    title: 'Let it rest a day',
    body: 'Elastane recovers overnight. Two suits in rotation will outlast four worn back to back.',
  },
];

const STOCKISTS = [
  { shop: 'Baia Baia', city: 'Lisbon' },
  { shop: 'The Swim Library', city: 'Los Angeles' },
  { shop: 'Sonnenbad', city: 'Zürich' },
  { shop: 'Tide & Co.', city: 'Sydney' },
  { shop: 'Mizu Mizu', city: 'Tokyo' },
  { shop: 'Salt Supply', city: 'St Ives' },
];

export default function CeruleanSwimPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--foam': '#f2fbfc',
        '--teal': '#0fa3b1',
        '--aqua': '#b5e2e8',
        '--coral': '#ff8266',
        '--sun': '#ffd97d',
        '--deep': '#134d57',
        '--ink': '#123a41',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="foam,teal,aqua,coral,sun,deep,ink"
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
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Karla:ital,wght@0,300..700;1,300..700&display=swap"
      />

      <header className={styles.masthead}>
        <nav className={styles.navRow} aria-label="Site">
          <div className={styles.navSide}>
            <a data-edit="masthead.lookbook" data-edit-max="28" href="#lookbook">Lookbook</a>
            <a data-edit="masthead.shop" data-edit-max="28" href="#shop">Shop</a>
          </div>
          <p data-edit="masthead.logo" data-edit-max="240" data-edit-multiline className={styles.logo}>Cerulean</p>
          <div className={`${styles.navSide} ${styles.navSideRight}`}>
            <a data-edit="masthead.fabric" data-edit-max="28" href="#fabric">Fabric</a>
            <a data-edit="masthead.swims" data-edit-max="28" href="#swims">Swims</a>
            <a data-edit="masthead.navPill" data-edit-max="28" href="#club" className={styles.navPill}>
              The Water Club
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div data-edit-pattern="hero.field" data-edit-roles="0,1,2,4" className={styles.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={wavelet}
              palette={[FOAM, TEAL, AQUA, SUN]}
              seed="cs-hero-07"
              fit="grid"
              cellSize={96}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.heroScrim} aria-hidden="true" />
          <div className={styles.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={styles.eyebrow}>Collection № 04 · Meltemi</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              Cut for salt.
              <br />
              <em>Sewn for sun.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={styles.heroLede}>
              Swimwear made slowly on the Ligurian coast from regenerated nylon,
              built to outlast summers, tides, and the hotel pool you were not
              strictly a guest of.
            </p>
            <div className={styles.heroFrame}>
              <Figure editId="photo.cerulean-hero"
                slug="cerulean-hero"
                alt="A swimmer floating on her back in clear turquoise water, photographed from above"
                priority
                className={styles.coverImg}
              />
              <p className={styles.heroBadge} aria-hidden="true">
                <span data-edit="hero.text" data-edit-max="60">UPF</span>
                <strong data-edit="hero.emphasis">50+</strong>
                <span data-edit="hero.text2" data-edit-max="60">salt-tested</span>
              </p>
            </div>
          </div>
        </section>

        {/* LOOKBOOK */}
        <section
          id="lookbook"
          className={styles.section}
          aria-labelledby="lookbook-title"
        >
          <header className={styles.secHead}>
            <h2 id="lookbook-title" className={styles.secTitle}>
              The <em>Meltemi</em> lookbook
            </h2>
            <p data-edit="secHead.secLede" data-edit-max="240" data-edit-multiline className={styles.secLede}>
              Named for the dry summer wind that flattens the Aegean by
              afternoon. Three looks, two prints, one long season.
            </p>
          </header>
          <div className={styles.lookGrid}>
            {LOOKS.map((look, i) => (
              <figure
                key={look.caption}
                className={`${styles.lookCard} ${look.wide ? styles.lookWide : ''}`}
              >
                <div className={styles.lookMedia}>
                  <Figure editId={`lookbook.photo.${i}`}
                    slug={look.slug}
                    alt={look.alt}
                    className={styles.coverImg}
                  />
                </div>
                <figcaption data-edit={`lookbook.caption.${i}`} data-edit-max="120" data-edit-multiline>{look.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* SHOP */}
        <section
          id="shop"
          className={styles.section}
          aria-labelledby="shop-title"
        >
          <header className={styles.secHead}>
            <h2 id="shop-title" className={styles.secTitle}>
              In the <em>water</em> now
            </h2>
            <p data-edit="secHead.secLede2" data-edit-max="240" data-edit-multiline className={styles.secLede}>
              Everything below is sewn in editions of a few hundred. When a
              colour is gone it waits for next summer, like the rest of us.
            </p>
          </header>
          <div className={styles.shopGrid}>
            {PRODUCTS.map((p, i) => (
              <article key={p.slug} className={styles.productCard}>
                <div
                  className={`${styles.productStage} ${p.tall ? styles.productStageTall : ''}`}
                >
                  <Figure editId={`productCard.photo.${i}`}
                    slug={p.slug}
                    cutout
                    alt={p.alt}
                    className={styles.productImg}
                  />
                </div>
                <div className={styles.productMeta}>
                  <h3 data-edit={`productCard.productName.${i}`} data-edit-max="40" className={styles.productName}>{p.name}</h3>
                  <p data-edit={`productCard.productKind.${i}`} data-edit-max="240" data-edit-multiline className={styles.productKind}>{p.kind}</p>
                  <p data-edit={`productCard.productNote.${i}`} data-edit-max="240" data-edit-multiline className={styles.productNote}>{p.note}</p>
                  <p data-edit={`productCard.productPrice.${i}`} data-edit-max="240" data-edit-multiline className={styles.productPrice}>{p.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* RIBBON DIVIDER */}
        <div data-edit-pattern="main.field" data-edit-roles="2,0,1" className={styles.ribbon} aria-hidden="true">
          <TabbiedPattern
            pattern={tidering}
            palette={[AQUA, FOAM, TEAL]}
            seed="cs-ribbon-03"
            fit="grid"
            cellSize={110}
            /* Pinned to an exact multiple of the cell and clipped by the band,
               so every grid track is a whole pixel at any viewport width. */
            style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 2640, height: 220 }}
          />
        </div>

        {/* FABRIC & FIT */}
        <section
          id="fabric"
          className={styles.section}
          aria-labelledby="fabric-title"
        >
          <div className={styles.fabricCols}>
            <div>
              <h2 id="fabric-title" className={styles.secTitle}>
                Fabric &amp; <em>fit</em>
              </h2>
              <p data-edit="fabric.fabricBody" data-edit-max="240" data-edit-multiline className={styles.fabricBody}>
                Every Cerulean piece is knitted from Aqualith™, a regenerated
                nylon spun from recovered fishing nets and carpet offcuts. It
                arrives on our cutting tables in Sestri as a dense, matte knit
                that holds its colour through two hundred and forty hours of
                chlorine testing, roughly three summers of daily lengths.
              </p>
              <p className={styles.fabricBody}>
                We cut two ways. <strong data-edit="fabric.emphasis">Low tide</strong> sits lighter: higher
                leg, open back, for floating and warm bays.{' '}
                <strong data-edit="fabric.emphasis2">High tide</strong> is our training cut: locked seams,
                full back, straps that stay crossed at the flip turn. Both are
                sewn flat so nothing chafes at kilometre three.
              </p>
              <p data-edit="fabric.fabricFine" data-edit-max="240" data-edit-multiline className={styles.fabricFine}>
                Offcuts go back into the loop; last season we returned 312 kg.
              </p>
            </div>
            <dl className={styles.fabricFacts}>
              {FABRIC_FACTS.map((f, i) => (
                <div key={f.label} className={styles.fact}>
                  <dt data-edit={`fabric.term.${i}`} data-edit-max="28">{f.label}</dt>
                  <dd data-edit={`fabric.body.${i}`} data-edit-max="200" data-edit-multiline>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CARE GUIDE - white card floating on a full-width tide field */}
        <div className={styles.careBand}>
          <div data-edit-pattern="main.field2" data-edit-roles="2,0,1" className={styles.careField} aria-hidden="true">
            <TabbiedPattern
              pattern={tidering}
              palette={[AQUA, FOAM, TEAL]}
              seed="cs-care-11"
              fit="grid"
              cellSize={132}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <section className={styles.sectionAlt} aria-labelledby="care-title">
            <div className={styles.careInner}>
              <header className={styles.secHead}>
                <h2 id="care-title" className={styles.secTitle}>
                  Care, in <em>five</em> slow steps
                </h2>
                <p data-edit="secHead.secLede3" data-edit-max="240" data-edit-multiline className={styles.secLede}>
                  A suit is a small machine for holding you together at speed.
                  Treat it like this and it will do ten seasons.
                </p>
              </header>
              <ol className={styles.careList}>
                {CARE_STEPS.map((step, i) => (
                  <li key={step.title} className={styles.careStep}>
                    <span className={styles.careNo} aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <h3 data-edit={`care.title.${i}`} data-edit-max="40">{step.title}</h3>
                      <p data-edit={`care.body.${i}`} data-edit-max="240" data-edit-multiline>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        {/* WHERE WE SWIM - the club letter's premise, given a table */}
        <section
          id="swims"
          className={styles.section}
          aria-labelledby="swims-title"
        >
          <header className={styles.secHead}>
            <h2 id="swims-title" className={styles.secTitle}>
              Where we <em>swim</em>
            </h2>
            <p data-edit="secHead.secLede4" data-edit-max="240" data-edit-multiline className={styles.secLede}>
              Five stretches of water we know well enough to publish. The
              temperatures are what we measured, not what the tourist board
              would like them to be.
            </p>
          </header>
          <div className={styles.swimTable}>
            <div className={`${styles.swimRow} ${styles.swimHead}`} aria-hidden="true">
              <span data-edit="swims.text" data-edit-max="60">Water</span>
              <span data-edit="swims.text2" data-edit-max="60">Where</span>
              <span data-edit="swims.text3" data-edit-max="60">Temperature</span>
              <span data-edit="swims.text4" data-edit-max="60">Season</span>
            </div>
            {SWIMS.map((w, i) => (
              <article key={w.place} className={styles.swimRow}>
                <span data-edit={`swimRow.swimPlace.${i}`} data-edit-max="60" className={styles.swimPlace}>{w.place}</span>
                <span data-edit={`swimRow.swimWhere.${i}`} data-edit-max="60" className={styles.swimWhere}>{w.where}</span>
                <span data-edit={`swimRow.swimTemp.${i}`} data-edit-max="60" className={styles.swimTemp}>{w.temp}</span>
                <span data-edit={`swimRow.swimSeason.${i}`} data-edit-max="60" className={styles.swimSeason}>{w.season}</span>
                <p data-edit={`swimRow.swimNote.${i}`} data-edit-max="240" data-edit-multiline className={styles.swimNote}>{w.note}</p>
              </article>
            ))}
          </div>
          <figure className={styles.swimShot}>
            <Figure editId="photo.cerulean-swimspot"
              slug="cerulean-swimspot"
              alt="A stone jetty running into flat clear sea at first light, a marker buoy offshore"
              className={styles.coverImg}
            />
            <figcaption data-edit="swims.caption" data-edit-max="120" data-edit-multiline>Lido di Sestri, 06.40. The near buoy is two hundred metres.</figcaption>
          </figure>
        </section>

        {/* MADE IN SESTRI */}
        <section
          id="atelier"
          className={styles.section}
          aria-labelledby="atelier-title"
        >
          <div className={styles.atelierCols}>
            <figure className={styles.atelierShot}>
              <Figure editId="photo.cerulean-atelier"
                slug="cerulean-atelier"
                alt="A machinist running a flatlock seam in teal swim jersey in a bright coastal workroom"
                className={styles.coverImg}
              />
            </figure>
            <div>
              <h2 id="atelier-title" className={styles.secTitle}>
                Made in <em>Sestri</em>
              </h2>
              <p data-edit="atelier.fabricBody" data-edit-max="240" data-edit-multiline className={styles.fabricBody}>
                Eleven people in a first-floor room above a chandlery, four
                streets back from the water. Every suit is cut, sewn and
                finished here, which is slower than the alternative and the
                reason we only manage two collections a year.
              </p>
              <p data-edit="atelier.fabricBody2" data-edit-max="240" data-edit-multiline className={styles.fabricBody}>
                The seams are flatlocked rather than overlocked: the join sits
                flush with the cloth instead of standing proud of it, so there
                is nothing to rub at kilometre three. It takes about four times
                as long and it is the only part of the process we will not
                move.
              </p>
              <p data-edit="atelier.fabricFine" data-edit-max="240" data-edit-multiline className={styles.fabricFine}>
                Open to visitors on the first Saturday of the month, if you ring first.
              </p>
            </div>
          </div>
        </section>

        {/* SIZE & FIT */}
        <section
          id="sizing"
          className={styles.section}
          aria-labelledby="sizing-title"
        >
          <header className={styles.secHead}>
            <h2 id="sizing-title" className={styles.secTitle}>
              Size &amp; <em>fit</em>
            </h2>
            <p data-edit="secHead.secLede5" data-edit-max="240" data-edit-multiline className={styles.secLede}>
              Measurements in centimetres, taken on the body rather than on the
              garment. Torso is the loop from shoulder, through, and back.
            </p>
          </header>
          <div className={styles.sizeTable} role="table" aria-label="Size chart in centimetres">
            <div className={`${styles.sizeRow} ${styles.sizeHead}`} role="row">
              <span data-edit="sizing.text" data-edit-max="60" role="columnheader">Size</span>
              <span data-edit="sizing.text2" data-edit-max="60" role="columnheader">Bust</span>
              <span data-edit="sizing.text3" data-edit-max="60" role="columnheader">Waist</span>
              <span data-edit="sizing.text4" data-edit-max="60" role="columnheader">Hip</span>
              <span data-edit="sizing.text5" data-edit-max="60" role="columnheader">Torso</span>
            </div>
            {SIZES.map((r, i) => (
              <div key={r.size} className={styles.sizeRow} role="row">
                <span data-edit={`sizing.sizeName.${i}`} data-edit-max="60" className={styles.sizeName} role="cell">{r.size}</span>
                <span data-edit={`sizing.text6.${i}`} data-edit-max="60" role="cell">{r.bust}</span>
                <span data-edit={`sizing.text7.${i}`} data-edit-max="60" role="cell">{r.waist}</span>
                <span data-edit={`sizing.text8.${i}`} data-edit-max="60" role="cell">{r.hip}</span>
                <span data-edit={`sizing.text9.${i}`} data-edit-max="60" role="cell">{r.torso}</span>
              </div>
            ))}
          </div>
          <p data-edit="sizing.fabricFine" data-edit-max="240" data-edit-multiline className={styles.fabricFine}>
            Between two sizes, size down for High tide and up for Low tide.
          </p>
        </section>

        {/* QUESTIONS */}
        <section
          id="questions"
          className={styles.section}
          aria-labelledby="questions-title"
        >
          <header className={styles.secHead}>
            <h2 id="questions-title" className={styles.secTitle}>
              Before you <em>order</em>
            </h2>
          </header>
          <div className={styles.qaList}>
            {QUESTIONS.map((x, i) => (
              <article key={x.q} className={styles.qaItem}>
                <h3 data-edit={`qaItem.qaQ.${i}`} data-edit-max="40" className={styles.qaQ}>{x.q}</h3>
                <p data-edit={`qaItem.qaA.${i}`} data-edit-max="240" data-edit-multiline className={styles.qaA}>{x.a}</p>
              </article>
            ))}
          </div>
        </section>

        {/* WATER CLUB */}
        <section id="club" className={styles.club} aria-labelledby="club-title">
          <div data-edit-pattern="club.field" data-edit-roles="transparent,1,2,4" className={styles.clubField} aria-hidden="true">
            <TabbiedPattern
              pattern={wavelet}
              palette={['transparent', TEAL, AQUA, SUN]}
              seed="cs-club-09"
              fit="grid"
              cellSize={132}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.clubCard}>
            <h2 id="club-title" className={styles.clubTitle}>
              The <em>Water Club</em>
            </h2>
            <p data-edit="club.clubLede" data-edit-max="240" data-edit-multiline className={styles.clubLede}>
              One letter a month: sea temperatures we trust, a swim worth
              travelling for, and first call on new editions. No sales voice,
              ever; we are usually in the water by eight.
            </p>
            <form className={styles.clubForm} aria-label="Join the Water Club">
              <label data-edit="club.clubLabel" className={styles.clubLabel} htmlFor="club-email">
                Your email
              </label>
              <div className={styles.clubRow}>
                <input
                  id="club-email"
                  type="email"
                  name="email"
                  placeholder="you@somewhere-sunny.example"
                  autoComplete="email"
                  className={styles.clubInput}
                />
                <button data-edit="club.clubButton" data-edit-max="24" type="button" className={styles.clubButton}>
                  Wade in
                </button>
              </div>
            </form>
            <p data-edit="club.clubFine" data-edit-max="240" data-edit-multiline className={styles.clubFine}>
              1,900 swimmers already float here. Leave whenever the water gets
              cold.
            </p>
          </div>
        </section>

        {/* STOCKISTS */}
        <section className={styles.section} aria-labelledby="stockists-title">
          <header className={styles.secHead}>
            <h2 id="stockists-title" className={styles.secTitle}>
              Where we <em>wash up</em>
            </h2>
            <p data-edit="secHead.secLede6" data-edit-max="240" data-edit-multiline className={styles.secLede}>
              Six shops we would visit even if they did not carry us. Call
              ahead for sizes; small editions travel unevenly.
            </p>
          </header>
          <ul className={styles.stockists}>
            {STOCKISTS.map((s, i) => (
              <li key={s.shop} className={styles.stockist}>
                <span data-edit={`stockists.stockShop.${i}`} data-edit-max="60" className={styles.stockShop}>{s.shop}</span>
                <span data-edit={`stockists.stockCity.${i}`} data-edit-max="60" className={styles.stockCity}>{s.city}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="0,2,1" className={styles.footerWave} aria-hidden="true">
          <TabbiedPattern
            pattern={tidering}
            palette={[FOAM, AQUA, TEAL]}
            seed="cs-foot-05"
            fit="grid"
            cellSize={130}
            style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 2600, height: 260 }}
          />
        </div>
        <div className={styles.footerInner}>
          <p data-edit="footer.footerLogo" data-edit-max="240" data-edit-multiline className={styles.footerLogo}>Cerulean</p>
          <div className={styles.footerCols}>
            <div>
              <h2 data-edit="footer.footerHead" data-edit-max="60" className={styles.footerHead}>Atelier</h2>
              <address className={styles.footerAddress}>
                Via delle Reti 9<br />
                Sestri Levante, Italy
                <br />
                ciao@cerulean.example
              </address>
            </div>
            <div>
              <h2 data-edit="footer.footerHead2" data-edit-max="60" className={styles.footerHead}>Paddle over</h2>
              <ul className={styles.footerList}>
                <li>
                  <a data-edit="footer.lookbook" data-edit-max="28" href="#lookbook">Lookbook № 04</a>
                </li>
                <li>
                  <a data-edit="footer.shop" data-edit-max="28" href="#shop">Shop the edition</a>
                </li>
                <li>
                  <a data-edit="footer.fabric" data-edit-max="28" href="#fabric">Aqualith™ fabric</a>
                </li>
                <li>
                  <a data-edit="footer.club" data-edit-max="28" href="#club">The Water Club</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 data-edit="footer.footerHead3" data-edit-max="60" className={styles.footerHead}>Small print</h2>
              <p data-edit="footer.footerNote" data-edit-max="240" data-edit-multiline className={styles.footerNote}>
                Free repairs for the life of every suit. Postage both ways on
                us within the EU; everywhere else we split it, like a good
                lunch bill.
              </p>
            </div>
          </div>
          <div className={styles.footerBase}>
            <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>© 2026 Cerulean Swim S.r.l. · sewn by six people and the sea.</p>
            <p className={styles.tabbiedCredit}>
              "Wavelet" and "Tidering" patterns by{' '}
              <a data-edit="footer.link" data-edit-max="28"
                href="https://tabbied.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Tabbied
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
