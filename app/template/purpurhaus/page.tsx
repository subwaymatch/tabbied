import { TabbiedPattern } from 'tabbied/react';
import {
  bothcut, dimetric, elbow, evolute, meetpart, prismfold, spiralblock,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './purpurhaus.module.css';

export const metadata = {
  title: 'Purpurhaus: Natural dye works, Porto',
  description:
    'A dye house working only with plants, insects and iron. Fourteen dips to the deepest plum, every recipe published, every batch numbered.',
};

/* Cream ground, ink, one plum. Every decorative field takes `transparent` in
   the background slot, so the paper of the page - and, in the plates, the
   plate itself - is what shows through the drawing. */
const INK = '#191317';
const ACCENT = '#5e2750';
const GREY = '#8b8279';
const PANEL = '#e2dbcb';

/* Fourteen dips of one skein in one vat. The mordant changes at the seventh,
   which is the only step in the ladder that is a decision rather than time. */
const DIPS = [
  'Alum', 'Alum', 'Alum', 'Alum', 'Alum', 'Alum', 'Alum',
  'Iron', 'Iron', 'Iron', 'Iron', 'Iron', 'Iron', 'Iron',
];

const STEPS = [
  { n: '01', t: 'Scour', d: 'Two hours in soda ash at a rolling simmer. Grease left in the fibre is the reason most dyeing goes patchy', hrs: '2 h' },
  { n: '02', t: 'Mordant', d: 'Alum for the clear side of the range, iron for the sad side. The mordant, not the dye, decides what colour you get', hrs: '4 h' },
  { n: '03', t: 'Build the vat', d: 'Cochineal, madder or logwood, brought up slowly and never boiled, because boiling takes the red out of everything', hrs: '6 h' },
  { n: '04', t: 'Dip', d: 'Twenty minutes in, twenty minutes out in the air. The air is where the colour actually happens', hrs: '× 14' },
  { n: '05', t: 'Wash and dry', d: 'Rinsed until the water runs clear, then a fortnight on the rack out of direct sun', hrs: '14 days' },
];

const PRINCIPLES = [
  {
    art: evolute,
    img: 'purpurhaus-tile-skein-cutout',
    alt: 'A single thick skein of deep purple dyed yarn',
    n: 'I',
    t: 'Every recipe is published',
    d: 'Weights, temperatures, times and water. A recipe kept secret dies with the dyer, and this trade has lost more that way than it has to synthetics.',
  },
  {
    art: bothcut,
    img: 'purpurhaus-tile-jar-cutout',
    alt: 'A glass jar of dry purple dye pigment with a cork stopper',
    n: 'II',
    t: 'Nothing is corrected',
    d: 'No synthetic top-up to hit a target, ever. If a batch comes out two dips lighter than the last it is sold as what it is, with its own number on the band.',
  },
  {
    art: meetpart,
    img: 'purpurhaus-tile-paddle-cutout',
    alt: 'A long wooden dye paddle stained deep purple at one end',
    n: 'III',
    t: 'The vat is never boiled',
    d: 'Eighty-two degrees, held. Above that the reds go brown and there is no recovering them, which is one of very few things in this building that is genuinely irreversible.',
  },
];

const DYES = [
  ['Cochineal', 'Dactylopius coccus', 'Insect, Canary Islands', 'Alum', 'Crimson to rose'],
  ['Cochineal', 'Dactylopius coccus', 'Insect, Canary Islands', 'Iron', 'Plum to aubergine'],
  ['Madder', 'Rubia tinctorum', 'Root, grown in Alentejo', 'Alum', 'Brick to orange-red'],
  ['Logwood', 'Haematoxylum campechianum', 'Heartwood, imported', 'Alum', 'Violet to purple'],
  ['Logwood', 'Haematoxylum campechianum', 'Heartwood, imported', 'Iron', 'Near-black'],
  ['Weld', 'Reseda luteola', 'Whole plant, grown here', 'Alum', 'Clear yellow'],
  ['Woad', 'Isatis tinctoria', 'Leaf, fermented vat', 'None', 'Blue, by oxidation'],
  ['Walnut', 'Juglans regia', 'Hull, gathered', 'None', 'Warm brown'],
  ['Oak gall', 'Quercus infectoria', 'Gall, imported', 'Iron', 'Grey to black'],
  ['Onion', 'Allium cepa', 'Skin, from the market', 'Alum', 'Ochre'],
];

const BATCHES = [
  ['PH-214', '2026', 'Cochineal on wool', '14 dips, iron', '4.2 kg', 'Sold out'],
  ['PH-211', '2026', 'Logwood on silk', '9 dips, alum', '1.8 kg', '600 g left'],
  ['PH-208', '2025', 'Madder on linen', '6 dips, alum', '6.0 kg', '2.1 kg left'],
  ['PH-204', '2025', 'Woad on wool', 'Fermented vat', '3.4 kg', 'Sold out'],
  ['PH-199', '2025', 'Cochineal on wool', '7 dips, alum', '5.1 kg', '900 g left'],
  ['PH-193', '2024', 'Oak gall on linen', '4 dips, iron', '2.7 kg', 'Sold out'],
  ['PH-188', '2024', 'Weld over woad', '3 + 5 dips', '1.2 kg', '400 g left'],
  ['PH-181', '2023', 'Walnut on wool', '5 dips, none', '8.8 kg', 'Sold out'],
];

const BUYING = [
  ['By the skein', '100 g skeins from the current batch, at the door and by post.'],
  ['By the metre', 'Linen and silk dyed to a batch, cut from the piece. Twelve metre minimum.'],
  ['Commission', 'Your fibre, our vat. Send a sample first; some wool simply will not take.'],
  ['Teaching', 'Four people at a time, three days, twice a year. It is mostly washing.'],
];

/* Day, hours, and whether the desk is shut - the third slot is
   omitted on the days it is open. */
const HOURS: [string, string, boolean?][] = [
  ['Monday', 'Vats down', true],
  ['Tuesday', '09 - 17'],
  ['Wednesday', '09 - 17'],
  ['Thursday', '09 - 17'],
  ['Friday', '09 - 15'],
  ['Saturday', 'By arrangement'],
  ['Sunday', 'Shut', true],
];

export default function PurpurhausPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--ground': '#f4f0e6',
        '--ink': '#191317',
        '--accent': '#5e2750',
        '--grey': '#8b8279',
        '--panel': '#e2dbcb',
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
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Purpurhaus</a>
        <nav aria-label="Sections">
          <a data-edit="bar.ladder" data-edit-max="28" href="#ladder">The ladder</a>
          <a data-edit="bar.making" data-edit-max="28" href="#making">Dyeing</a>
          <a data-edit="bar.dyes" data-edit-max="28" href="#dyes">Dyestuffs</a>
          <a data-edit="bar.batches" data-edit-max="28" href="#batches">Batches</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Tinturaria / Porto</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={prismfold}
              palette={['transparent', PANEL, GREY, ACCENT]}
              fit="grid"
              cellSize={154}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Natural dye works / Porto / since 1954</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Fourteen dips</span>
            <span data-edit="hero.hi" data-edit-max="60" className={s.hi}>to the bottom.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Plants, insects and iron. No synthetic correction, no boiling,
              and a published recipe for every colour that has ever left this
              building.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#ladder">
              See the ladder
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------ BLEED SCENE */}
        <figure className={s.bleed}>
          <Figure editId="photo.purpurhaus-vats"
            slug="purpurhaus-vats"
            alt="A row of open dye vats in a whitewashed dye house holding deep purple liquid, skeins hanging above"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Four vats, one dyestuff. The steam is the only thing here that is not measured.</figcaption>
        </figure>

        {/* ---------------------------------------------------------- LADDER
            Fourteen blocks, computed from the dip number, so the strip and
            the table under it cannot ever disagree. */}
        <section id="ladder" className={s.ladder} aria-labelledby="ladder-h">
          <div className={s.secHead}>
            <h2 data-edit="ladder.title" data-edit-max="60" id="ladder-h">One skein, fourteen times</h2>
            <p data-edit="ladder.body" data-edit-max="240" data-edit-multiline>
              The same wool, the same cochineal vat, dipped again and again.
              The mordant changes at the eighth, which is why the second rank
              turns towards plum instead of getting darker red.
            </p>
          </div>
          <div className={s.ladderGrid}>
            {DIPS.map((mordant, i) => {
              const k = (i + 1) / DIPS.length;
              return (
                <div
                  key={i}
                  className={s.dip}
                  style={{ background: `color-mix(in srgb, ${ACCENT} ${8 + k * 88}%, ${PANEL})` }}
                >
                  <span className={s.dipN} style={{ color: k > 0.42 ? '#fff' : INK }}>
                    {i + 1}
                  </span>
                  <span data-edit={`ladder.dipK.${i}`} data-edit-max="60"
                    className={s.dipK}
                    style={{ color: k > 0.42 ? 'rgb(255 255 255 / 0.74)' : 'rgb(25 19 23 / 0.55)' }}
                  >
                    {mordant}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            A natural dye is not a colour you choose. It is a colour you arrive
            at, from a particular insect, in a particular water, at a
            temperature you hold for six hours, and the honest thing to do with
            the result is to number it and sell it as itself.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Purpurhaus has dyed on the Rua de Miragaia since 1954. Six of us,
              four vats, a drying loft, and a water supply we have had analysed
              every year since 1971 because the water is half the recipe.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              We are not a natural alternative to industrial dyeing. We are a
              slower, more expensive and less repeatable process that produces
              colours industry cannot make, and that is the entire offer.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,1,4" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={spiralblock}
            palette={['transparent', ACCENT, INK, PANEL]}
            fit="grid"
            cellSize={114}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ---------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div className={s.secHead}>
            <h2 data-edit="making.title" data-edit-max="60" id="making-h">Five steps</h2>
            <p data-edit="making.body" data-edit-max="240" data-edit-multiline>Two days of work and a fortnight of hanging still. The hanging is not waiting; it is part of it.</p>
          </div>
          <ol className={s.rows}>
            {STEPS.map((x, i) => (
              <li key={x.n}>
                <span data-edit={`making.rowN.${i}`} data-edit-max="60" className={s.rowN}>{x.n}</span>
                <h3 data-edit={`making.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{x.t}</h3>
                <span data-edit={`making.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{x.d}</span>
                <span data-edit={`making.rowDays.${i}`} data-edit-max="60" className={s.rowDays}>{x.hrs}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.purpurhaus-drying"
                slug="purpurhaus-drying"
                alt="Skeins of freshly dyed purple yarn hanging on a wooden drying rack in daylight"
              />
              <figcaption data-edit="making.caption" data-edit-max="120" data-edit-multiline>The loft. Out of direct sun, for two weeks, and no shortcut exists.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.purpurhaus-pigment"
                slug="purpurhaus-pigment"
                alt="Small heaps of dry dye pigment on a stone bench, seen from above"
              />
              <figcaption data-edit="making.caption2" data-edit-max="120" data-edit-multiline>Ground and weighed. From here on, everything is arithmetic.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ PRINCIPLES */}
        <section className={s.principles} aria-labelledby="pr-h">
          <div className={s.secHead}>
            <h2 data-edit="pr.title" data-edit-max="60" id="pr-h">Three refusals</h2>
            <p data-edit="pr.body" data-edit-max="240" data-edit-multiline>Each one makes the work less repeatable, which is the point rather than the cost.</p>
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
                      cellSize={64}
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

        {/* ------------------------------------------------------------ DYES */}
        <section id="dyes" className={s.listing} aria-labelledby="dyes-h">
          <div className={s.secHead}>
            <h2 data-edit="dyes.title" data-edit-max="60" id="dyes-h">Ten dyestuffs</h2>
            <p data-edit="dyes.body" data-edit-max="240" data-edit-multiline>Everything in the store room. The mordant column is doing most of the work in this table.</p>
          </div>
          <ol className={s.table}>
            {DYES.map((r, i) => (
              <li key={i}>
                <span data-edit={`dyes.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[3]}</span>
                <span data-edit={`dyes.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[0]}</span>
                <span data-edit={`dyes.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[1]}</span>
                <span data-edit={`dyes.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`dyes.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={dimetric}
              palette={['transparent', ACCENT, GREY]}
              fit="grid"
              cellSize={118}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>Anyone can match a colour. The difficult thing is admitting, in writing, that you did not.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Idalina Freire, dyer</cite>
          </blockquote>
        </section>

        {/* --------------------------------------------------------- BATCHES */}
        <section id="batches" className={s.listing} aria-labelledby="batches-h">
          <div className={s.secHead}>
            <h2 data-edit="batches.title" data-edit-max="60" id="batches-h">Batches, numbered</h2>
            <p data-edit="batches.body" data-edit-max="240" data-edit-multiline>Every band carries its batch number. When a batch is gone, that colour is gone with it.</p>
          </div>
          <ol className={s.table}>
            {BATCHES.map((r, i) => (
              <li key={i}>
                <span data-edit={`batches.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`batches.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[2]}</span>
                <span data-edit={`batches.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`batches.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[4]}</span>
                <span data-edit={`batches.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[5]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- BUYING */}
        <section id="buying" className={s.visit} aria-labelledby="buying-h">
          <div data-edit-pattern="buying.field" data-edit-roles="transparent,3,4" className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={evolute}
              palette={['transparent', GREY, PANEL]}
              fit="grid"
              cellSize={102}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 data-edit="buying.title" data-edit-max="60" id="buying-h">Buying and learning</h2>
          <dl className={s.visitList}>
            {BUYING.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`buying.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`buying.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div>
            <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>The dye house</p>
            <a data-edit="contact.deskTel" data-edit-max="28" id="contact-h" className={s.deskTel} href="tel:+351220008800">
              +351&nbsp;22&nbsp;000&nbsp;88&nbsp;00
            </a>
            <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
              Rua de Miragaia 88, 4050 Porto. The recipe book is a PDF, it is
              free, and it is the only thing we send out the same day.
            </p>
          </div>
          <div>
            <dl className={s.hours}>
              {HOURS.map(([d, h, shut], i) => (
                <div key={d} className={shut ? s.hoursShut : undefined}>
                  <dt data-edit={`contact.term.${i}`} data-edit-max="28">{d}</dt>
                  <dd data-edit={`contact.body.${i}`} data-edit-max="200" data-edit-multiline>{h}</dd>
                </div>
              ))}
            </dl>
            <p data-edit="contact.hoursNote" data-edit-max="240" data-edit-multiline className={s.hoursNote}>
              An indigo vat is fed on Monday and left alone; anything dipped
              that day comes out the colour of an apology.
            </p>
          </div>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,2,4,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={elbow}
          palette={['transparent', ACCENT, PANEL, GREY]}
          fit="grid"
          cellSize={104}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <div className={s.footObject}>
          <div className={s.footPlate}>
            <div data-edit-pattern="footer.field" data-edit-roles="transparent,3,2" className={s.footPlateField} aria-hidden="true">
              <TabbiedPattern
                pattern={spiralblock}
                palette={['transparent', GREY, ACCENT]}
                fit="grid"
                cellSize={76}
                redrawInterval={6000}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <Figure editId="photo.purpurhaus-tile-swatch-cutout" slug="purpurhaus-tile-swatch-cutout" alt="A fan of dyed wool swatch cards spread open" cutout className={s.footCut} />
          </div>
          <p data-edit="footer.footLine" data-edit-max="240" data-edit-multiline className={s.footLine}>Every colour here can be named, sourced and made again next year.</p>
        </div>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Dye house</h2>
            <ul>
              <li><a data-edit="footer.making" data-edit-max="28" href="#making">Five steps</a></li>
              <li><a data-edit="footer.ladder" data-edit-max="28" href="#ladder">The ladder</a></li>
              <li><a data-edit="footer.dyes" data-edit-max="28" href="#dyes">Dyestuffs</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Yarn</h2>
            <ul>
              <li><a data-edit="footer.batches" data-edit-max="28" href="#batches">Batches</a></li>
              <li><a data-edit="footer.buying" data-edit-max="28" href="#buying">Buying</a></li>
              <li><a data-edit="footer.buying2" data-edit-max="28" href="#buying">Teaching</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Rua de Miragaia 88
              <br />
              4050 Porto
              <br />
              cuba@purpurhaus.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional dye works. Batches, recipes and dates are invented.</p>
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
