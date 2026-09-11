import { TabbiedPattern } from 'tabbied/react';
import { bight, cendal, spit } from 'tabbied/patterns';
import s from './fennel-and-thyme.module.css';

export const metadata = {
  title: 'Fennel and Thyme: Herbal apothecary, Bath',
  description:
    'Fennel and Thyme is a herbal apothecary in a Georgian shopfront on Margaret\'s Buildings, Bath. Tinctures made in the back room, teas blended at the counter, two herbalists upstairs.',
};

/* Deep green ink on cream paper, with sage and honey for the accents. Every
   pattern field takes `transparent` in the background slot so the paper runs
   through it and the field reads as a pressed leaf on the page rather than a
   plate laid on top of it. */
const INK = '#22302A';
const SAGE = '#5F8063';
const HONEY = '#C9A16F';
const GREY = '#8E9689';
const PALE = '#DDE3D8';

const NAV = [
  ['Tinctures', '#tinctures'],
  ['Teas', '#teas'],
  ['Consultations', '#consultations'],
  ['Seasons', '#seasons'],
  ['Sourcing', '#sourcing'],
  ['Visit', '#visit'],
];

const GLANCE = [
  ['41', 'Tinctures on the shelf'],
  ['12', 'Tea blends'],
  ['2', 'Herbalists'],
  ['100', 'Miles, at most, to a grower'],
];

type Tincture = {
  name: string;
  latin: string;
  purpose: string;
  size: string;
  price: string;
};

const TINCTURES: Tincture[] = [
  {
    name: 'Elderflower and Lime Blossom',
    latin: 'Sambucus nigra, Tilia cordata',
    purpose: 'Hay fever season, from the first sneeze in May to the last of the grass.',
    size: '50 ml',
    price: '14.50',
  },
  {
    name: 'Valerian and Hops',
    latin: 'Valeriana officinalis, Humulus lupulus',
    purpose: 'Sleep that will not come, and the three in the morning ceiling.',
    size: '50 ml',
    price: '13.00',
  },
  {
    name: 'Milk Thistle',
    latin: 'Silybum marianum',
    purpose: 'The liver, after December. Taken for six weeks, then not at all.',
    size: '100 ml',
    price: '18.00',
  },
  {
    name: 'Echinacea and Elderberry',
    latin: 'Echinacea purpurea, Sambucus nigra',
    purpose: 'The first day of a cold, not the fourth. By then it is soup you want.',
    size: '50 ml',
    price: '15.50',
  },
  {
    name: 'Lemon Balm and Chamomile',
    latin: 'Melissa officinalis, Matricaria chamomilla',
    purpose: 'A racing mind and a tight chest. Gentle enough for the afternoon.',
    size: '50 ml',
    price: '12.50',
  },
  {
    name: 'Hawthorn Berry',
    latin: 'Crataegus monogyna',
    purpose: 'The heart, gently, over months rather than days. Picked in October.',
    size: '100 ml',
    price: '16.00',
  },
];

type Tea = {
  name: string;
  leaves: string;
  note: string;
  weight: string;
  price: string;
};

const TEAS: Tea[] = [
  {
    name: 'Morning Meadow',
    leaves: 'Fennel seed, lemon verbena, nettle, calendula petal',
    note: 'Bright and a little grassy. The one the shop drinks first thing.',
    weight: '60 g',
    price: '7.20',
  },
  {
    name: 'Evening Hedge',
    leaves: 'Chamomile, lime flower, lavender, oat straw',
    note: 'Soft, honeyed, and best made in a pot with the lid on for six minutes.',
    weight: '50 g',
    price: '7.80',
  },
  {
    name: 'Bath Stone',
    leaves: 'Peppermint, liquorice root, ginger, cardamom',
    note: 'Warm and sweet without sugar. Named for the colour it goes in the cup.',
    weight: '60 g',
    price: '6.90',
  },
  {
    name: 'Cold Frame',
    leaves: 'Elderflower, yarrow, peppermint, echinacea leaf',
    note: 'The winter blend. Drunk hot, under a blanket, ideally with the door shut.',
    weight: '50 g',
    price: '7.40',
  },
  {
    name: 'Kitchen Garden',
    leaves: 'Thyme, sage, rosehip, lemon peel',
    note: 'Savoury and sharp. Good after a heavy lunch, and for a sore throat.',
    weight: '50 g',
    price: '6.60',
  },
];

type Consultation = {
  kind: string;
  length: string;
  price: string;
  body: string;
};

const CONSULTATIONS: Consultation[] = [
  {
    kind: 'First consultation',
    length: '75 minutes',
    price: '68',
    body: 'Everything from childhood onward, what is in the kitchen cupboard, and what the doctor has already said. A prescription is made up the same afternoon.',
  },
  {
    kind: 'Follow-up',
    length: '40 minutes',
    price: '38',
    body: 'Usually four to six weeks on. What changed, what did not, and whether the bottle needs adjusting or finishing.',
  },
  {
    kind: 'Short review',
    length: '20 minutes',
    price: '22',
    body: 'By telephone, for a repeat prescription or a quick question. Booked the same week, more often than not.',
  },
  {
    kind: 'Dispensary visit',
    length: '10 minutes',
    price: '0',
    body: 'Come to the counter and ask. Simple things, a tea for a cough, a salve for a hand, do not need an appointment.',
  },
];

type Season = {
  name: string;
  months: string;
  makes: string[];
};

const SEASONS: Season[] = [
  {
    name: 'Spring',
    months: 'March to May',
    makes: ['Nettle syrup from the first cut', 'Cleavers juice, pressed daily', 'Elderflower cordial in the last week of May'],
  },
  {
    name: 'Summer',
    months: 'June to August',
    makes: ["St John's wort oil, left in the window", 'Rose petal glycerite', 'Lime flower from the avenue on Great Pulteney Street'],
  },
  {
    name: 'Autumn',
    months: 'September to November',
    makes: ['Elderberry rob, thick enough to coat a spoon', 'Hawthorn berry tincture', 'Rosehip syrup for the winter shelf'],
  },
  {
    name: 'Winter',
    months: 'December to February',
    makes: ['Fire cider, started in November', 'Thyme and honey syrup', 'The stock take and the seed order'],
  },
];

type Grower = {
  farm: string;
  place: string;
  grows: string;
  note: string;
};

const GROWERS: Grower[] = [
  {
    farm: 'Hollow Ash Farm',
    place: 'Chew Valley, Somerset',
    grows: 'Chamomile, calendula, lemon balm',
    note: 'Fifteen minutes down the A37. We pick with them for a week in July.',
  },
  {
    farm: 'Blackdown Herbs',
    place: 'Wellington, Somerset',
    grows: 'Echinacea, valerian, milk thistle',
    note: 'Roots lifted in October and dried in their barn, not ours.',
  },
  {
    farm: 'Wyeside Organics',
    place: 'Ross-on-Wye, Herefordshire',
    grows: 'Elder, hawthorn, nettle, hops',
    note: 'Hedgerow crops from twelve acres they have never ploughed.',
  },
  {
    farm: 'Ty Mawr Lavender',
    place: 'Brecon, Powys',
    grows: 'Lavender, thyme, sage',
    note: 'The Mediterranean herbs, grown on a south slope at 300 metres.',
  },
  {
    farm: 'Coombe Orchards',
    place: 'Dundry, Bristol',
    grows: 'Rosehip, apple cider vinegar',
    note: 'The vinegar for the fire cider, from windfalls nobody else wanted.',
  },
];

const HOURS = [
  ['Monday', 'Closed'],
  ['Tuesday to Friday', '10.00 to 17.30'],
  ['Saturday', '10.00 to 18.00'],
  ['Sunday', '11.00 to 16.00'],
];

const FIND = [
  ['On foot', 'Five minutes from the Royal Crescent, off Brock Street. The shop is the green frontage halfway along.'],
  ['By train', 'Bath Spa, then twenty minutes uphill or the number 4 bus to Queen Square.'],
  ['By car', 'No parking on the Buildings. Charlotte Street car park is the nearest, four minutes on foot.'],
  ['Access', 'One shallow step at the door with a ramp inside it; the consulting room is upstairs, so we consult downstairs on request.'],
];

export default function FennelAndThymePage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f4f1e8',
        '--ink': '#22302a',
        '--sage': '#5f8063',
        '--honey': '#c9a16f',
        '--grey': '#8e9689',
        '--pale': '#dde3d8',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,sage,honey,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Karla:wght@400;500;600&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Fennel and Thyme</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Bath, since 2011</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            The loudest field on the page: spit's arcs in sage and honey over
            the cream, fading out under the lede so the type sits on paper. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,5,2,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={spit}
              palette={['transparent', PALE, SAGE, HONEY]}
              fit="grid"
              cellSize={120}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Herbal apothecary, Margaret&apos;s Buildings</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
              Made slowly,
              <br />
              from plants
              <br />
              <em>we can name.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              A dispensary, a tea counter and two herbalists in a Georgian
              shopfront. Every tincture is made in the back room from plants
              we know the grower of, and most of them by first name.
            </p>
            <span data-edit="hero.text" data-edit-max="60" className={s.ornament} aria-hidden="true">&#x2766;</span>
            <dl className={s.glance}>
              {GLANCE.map(([v, k], i) => (
                <div key={k}>
                  <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                  <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------------- TINCTURES */}
        <section id="tinctures" className={s.tinctures} aria-labelledby="tinctures-h">
          <div className={s.secHead}>
            <p data-edit="tinctures.label" data-edit-max="240" data-edit-multiline className={s.label}>The dispensary</p>
            <h2 data-edit="tinctures.title" data-edit-max="60" id="tinctures-h">Six tinctures we are never without</h2>
            <p data-edit="tinctures.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Forty-one on the shelf, and these six are the ones that empty
              first. All are 1:3 in 45% spirit unless the label says
              otherwise, and every label names the farm.
            </p>
          </div>
          <ul className={s.tinctureGrid}>
            {TINCTURES.map((t, i) => (
              <li key={t.name} className={s.tincture}>
                <h3 data-edit={`tinctures.title2.${i}`} data-edit-max="40">{t.name}</h3>
                <p data-edit={`tinctures.latin.${i}`} data-edit-max="240" data-edit-multiline className={s.latin}>{t.latin}</p>
                <p data-edit={`tinctures.purpose.${i}`} data-edit-max="240" data-edit-multiline className={s.purpose}>{t.purpose}</p>
                <div className={s.priceRow}>
                  <span data-edit={`tinctures.size.${i}`} data-edit-max="60" className={s.size}>{t.size}</span>
                  <span data-edit={`tinctures.price.${i}`} data-edit-max="60" className={s.price}>{t.price}</span>
                </div>
              </li>
            ))}
          </ul>
          <p data-edit="tinctures.footnote" data-edit-max="240" data-edit-multiline className={s.footnote}>
            Prices in pounds sterling. A prescription made up after a
            consultation is priced by the bottle, from 9.00 for 100 ml.
          </p>
        </section>

        {/* ------------------------------------------------------------ TEAS
            On the pale tint, as a ledger rather than cards: the tea counter is
            a list you read down. */}
        <section id="teas" className={s.teas} aria-labelledby="teas-h">
          <div className={s.teasInner}>
            <div className={s.secHead}>
              <p data-edit="teas.label" data-edit-max="240" data-edit-multiline className={s.label}>The tea counter</p>
              <h2 data-edit="teas.title" data-edit-max="60" id="teas-h">Five blends, weighed to order</h2>
              <p data-edit="teas.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                Loose leaf, in paper, by the 50 or 60 gram bag. A pot for two
                at the counter is 3.20 and comes with a timer.
              </p>
            </div>
            <ol className={s.teaList}>
              {TEAS.map((t, i) => (
                <li key={t.name}>
                  <h3 data-edit={`teas.teaName.${i}`} data-edit-max="40" className={s.teaName}>{t.name}</h3>
                  <p data-edit={`teas.teaLeaves.${i}`} data-edit-max="240" data-edit-multiline className={s.teaLeaves}>{t.leaves}</p>
                  <p data-edit={`teas.teaNote.${i}`} data-edit-max="240" data-edit-multiline className={s.teaNote}>{t.note}</p>
                  <span data-edit={`teas.teaWeight.${i}`} data-edit-max="60" className={s.teaWeight}>{t.weight}</span>
                  <span data-edit={`teas.teaPrice.${i}`} data-edit-max="60" className={s.teaPrice}>{t.price}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND
            Bight's scalloped slabs at full width, pinned to whole cells. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,2,3,5" className={s.bandField}>
            <TabbiedPattern
              pattern={bight}
              palette={['transparent', SAGE, HONEY, PALE]}
              fit="grid"
              cellSize={96}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------- CONSULTATIONS */}
        <section id="consultations" className={s.consult} aria-labelledby="consult-h">
          <div className={s.consultIntro}>
            <p data-edit="consultations.label" data-edit-max="240" data-edit-multiline className={s.label}>Upstairs</p>
            <h2 data-edit="consultations.title" data-edit-max="60" id="consult-h">Seeing a herbalist</h2>
            <p data-edit="consultations.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Two of us, Anna Prideaux and Tom Haskett, both members of the
              National Institute of Medical Herbalists, seeing people Tuesday
              to Saturday in the room above the shop.
            </p>
            <p data-edit="consultations.consultNote" data-edit-max="240" data-edit-multiline className={s.consultNote}>
              We work alongside your GP, not instead of one. Bring a list of
              anything you already take, and we will check it against every
              plant before a bottle is made.
            </p>
          </div>
          <ol className={s.consultList}>
            {CONSULTATIONS.map((c, i) => (
              <li key={c.kind}>
                <div className={s.consultHead}>
                  <h3 data-edit={`consultations.title2.${i}`} data-edit-max="40">{c.kind}</h3>
                  <span data-edit={`consultations.consultLength.${i}`} data-edit-max="60" className={s.consultLength}>{c.length}</span>
                  <span data-edit={`consultations.consultPrice.${i}`} data-edit-max="60" className={s.consultPrice}>{c.price}</span>
                </div>
                <p data-edit={`consultations.body.${i}`} data-edit-max="240" data-edit-multiline>{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------------- SEASONS */}
        <section id="seasons" className={s.seasons} aria-labelledby="seasons-h">
          <div className={s.secHead}>
            <p data-edit="seasons.label" data-edit-max="240" data-edit-multiline className={s.label}>The back room</p>
            <h2 data-edit="seasons.title" data-edit-max="60" id="seasons-h">What we make, by quarter</h2>
            <p data-edit="seasons.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              The shop runs on the plants&apos; calendar rather than ours.
              Each thing is made once, in its week, and lasts until the next
              one comes round.
            </p>
          </div>
          <div className={s.seasonGrid}>
            {SEASONS.map((q, i) => (
              <article key={q.name} className={s.season}>
                <p data-edit={`season.seasonMonths.${i}`} data-edit-max="240" data-edit-multiline className={s.seasonMonths}>{q.months}</p>
                <h3 data-edit={`season.title.${i}`} data-edit-max="40">{q.name}</h3>
                <ul>
                  {q.makes.map((m, j) => (
                    <li data-edit={`season.item.${i}.${j}`} data-edit-max="80" key={`${i}-${j}`}>{m}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- SOURCING
            Cendal's diagonal sash at low opacity behind the growers, with a
            paper wash where the copy sits. */}
        <section id="sourcing" className={s.sourcing} aria-labelledby="sourcing-h">
          <div data-edit-pattern="sourcing.field" data-edit-roles="transparent,5,4" className={s.sourcingField} aria-hidden="true">
            <TabbiedPattern
              pattern={cendal}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.sourcingInner}>
            <div className={s.secHead}>
              <p data-edit="sourcing.label" data-edit-max="240" data-edit-multiline className={s.label}>Where it comes from</p>
              <h2 data-edit="sourcing.title" data-edit-max="60" id="sourcing-h">Five growers, all within a hundred miles</h2>
              <p data-edit="sourcing.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                We do not buy dried herb from a wholesaler if a farm we can
                drive to grows it. What is not grown within a hundred miles is
                named on the label with the country it came from.
              </p>
            </div>
            <ul className={s.growerList}>
              {GROWERS.map((g, i) => (
                <li key={g.farm}>
                  <h3 data-edit={`sourcing.growerFarm.${i}`} data-edit-max="40" className={s.growerFarm}>{g.farm}</h3>
                  <p data-edit={`sourcing.growerPlace.${i}`} data-edit-max="240" data-edit-multiline className={s.growerPlace}>{g.place}</p>
                  <p data-edit={`sourcing.growerGrows.${i}`} data-edit-max="240" data-edit-multiline className={s.growerGrows}>{g.grows}</p>
                  <p data-edit={`sourcing.growerNote.${i}`} data-edit-max="240" data-edit-multiline className={s.growerNote}>{g.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------------- VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <div className={s.visitGrid}>
            <div className={s.visitIntro}>
              <p data-edit="visit.label" data-edit-max="240" data-edit-multiline className={s.label}>The shop</p>
              <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">14 Margaret&apos;s Buildings</h2>
              <p data-edit="visit.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                A quiet pedestrian street between Brock Street and Catharine
                Place. Green frontage, a bay window full of jars, and a bell
                on the door that has not been replaced since 1931.
              </p>
              <dl className={s.hours}>
                {HOURS.map(([d, h], i) => (
                  <div key={d}>
                    <dt data-edit={`visit.term.${i}`} data-edit-max="28">{d}</dt>
                    <dd data-edit={`visit.body.${i}`} data-edit-max="200" data-edit-multiline>{h}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <dl className={s.find}>
              {FIND.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`visit.term2.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`visit.body2.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={s.contactCard}>
            <span data-edit="visit.text" data-edit-max="60" className={s.ornament} aria-hidden="true">&#x2619;</span>
            <p data-edit="visit.contactLead" data-edit-max="240" data-edit-multiline className={s.contactLead}>Write, ring, or come in</p>
            <a data-edit="visit.contactMail" data-edit-max="28" className={s.contactMail} href="mailto:shop@fennelandthyme.example">shop@fennelandthyme.example</a>
            <a data-edit="visit.contactTel" data-edit-max="28" className={s.contactTel} href="tel:+441225000000">01225 000 000</a>
            <p data-edit="visit.contactNote" data-edit-max="240" data-edit-multiline className={s.contactNote}>
              Appointments by telephone or at the counter. We do not book
              online, on purpose.
            </p>
          </div>
        </section>
      </main>

      {/* A coda: spit again, smaller and quieter, as a pressed border before
          the footer. Nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,5,2" className={s.codaField}>
          <TabbiedPattern
            pattern={spit}
            palette={['transparent', PALE, SAGE]}
            fit="grid"
            cellSize={88}
            redrawInterval={5800}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Fennel and Thyme</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              Herbal apothecary and dispensary, Bath. Tinctures, teas and
              consultations since 2011.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Shop</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.tinctures" data-edit-max="28" href="#tinctures">Tinctures</a></li>
              <li><a data-edit="footer.teas" data-edit-max="28" href="#teas">Teas</a></li>
              <li><a data-edit="footer.seasons" data-edit-max="28" href="#seasons">By the season</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Herbalists</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.consultations" data-edit-max="28" href="#consultations">Consultations</a></li>
              <li><a data-edit="footer.sourcing" data-edit-max="28" href="#sourcing">Our growers</a></li>
              <li><a data-edit="footer.visit" data-edit-max="28" href="#visit">Finding us</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Post</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              14 Margaret&apos;s Buildings
              <br />
              Bath BA1 2LP
              <br />
              shop@fennelandthyme.example
              <br />
              01225 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>
            Nothing on this page is medical advice. A fictional apothecary;
            the growers, prices and hours are invented.
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
