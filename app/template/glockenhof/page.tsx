import { TabbiedPattern } from 'tabbied/react';
import {
  bangle, cavetto, chain, cupola, haunch, ovolo, scotia,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './glockenhof.module.css';

export const metadata = {
  title: 'Glockenhof: Bell foundry, Innsbruck',
  description:
    'A bell foundry casting in loam since 1782. One pour, one bell, tuned on the lathe to five partials and hung for three hundred years.',
};

/* Night ground, warm paper, one bronze. Every decorative field takes
   `transparent` in the background slot, so the ground of the page - and, in
   the plates, the plate itself - shows through the pattern rather than the
   pattern painting its own backdrop over it. */
const INK = '#f0ead8';
const ACCENT = '#c89b3c';
const GREY = '#7c736a';
const PANEL = '#221d18';

/* The house peal. `mm` drives the diameter of the circle drawn for each bell,
   so the row below is to scale and needs no caption to say so. */
const PEAL = [
  { note: 'C', mm: 1960, kg: '4 780', year: '1782' },
  { note: 'E\u266D', mm: 1650, kg: '2 890', year: '1782' },
  { note: 'F', mm: 1480, kg: '2 060', year: '1911' },
  { note: 'G', mm: 1310, kg: '1 470', year: '1782' },
  { note: 'A\u266D', mm: 1230, kg: '1 180', year: '1948' },
  { note: 'B\u266D', mm: 1100, kg: '870', year: '1948' },
  { note: 'C', mm: 980, kg: '610', year: '2004' },
  { note: 'E\u266D', mm: 830, kg: '380', year: '2004' },
];

const OPERATIONS = [
  { n: '01', t: 'Strickle the loam', d: 'The mould is swept, not carved: a shaped board turned on a spindle takes the profile out of wet loam', days: '9 days' },
  { n: '02', t: 'Build the false bell', d: 'A clay bell is built on the core, dressed with tallow, and the cope is built over it', days: '14 days' },
  { n: '03', t: 'Bake and lift', d: 'Fired for four days, the cope lifted, the false bell broken out, the void left is the bell', days: '6 days' },
  { n: '04', t: 'Pour', d: 'Seventy-eight parts copper, twenty-two tin, at 1 150 °C, into a mould buried to the neck in sand', days: '1 hour' },
  { n: '05', t: 'Tune', d: 'Mounted mouth-up and cut from the inside until all five partials fall where they should', days: '11 days' },
];

const PRINCIPLES = [
  {
    art: cavetto,
    img: 'glockenhof-tile-bell-cutout',
    alt: 'A small plain cast bronze bell',
    n: 'I',
    t: 'One pour, one bell',
    d: 'Nothing is cast twice from a mould. The loam is broken to get the bell out, which means every bell we have ever made had a mould made for it alone and no other.',
  },
  {
    art: ovolo,
    img: 'glockenhof-tile-clapper-cutout',
    alt: 'A forged bronze bell clapper on a short leather strap',
    n: 'II',
    t: 'Tuned by removing',
    d: 'A bell can only be made flatter. Every cut on the lathe is final, so the casting is deliberately sharp and the last eleven days are spent taking metal away from the inside.',
  },
  {
    art: scotia,
    img: 'glockenhof-tile-strickle-cutout',
    alt: 'A wooden strickle board used to sweep a bell mould',
    n: 'III',
    t: 'The profile is not for sale',
    d: 'Our strickle boards are cut from a drawing revised eleven times since 1782 and never published. They are the only thing in the building that is locked away.',
  },
];

const CAST = [
  ['2026', 'Stiftskirche Wilten', 'Innsbruck', '1 470 kg', 'G, four bells'],
  ['2025', 'Pfarrkirche Sölden', 'Ötztal', '610 kg', 'C, recast of 1734'],
  ['2025', 'Dom zu Brixen', 'Brixen', '2 890 kg', 'E\u266D, replacing 1943 loss'],
  ['2024', 'Klosterkirche Stams', 'Stams', '380 kg', 'E\u266D, sanctus'],
  ['2024', 'Rathausturm', 'Hall in Tirol', '870 kg', 'B\u266D, hour bell'],
  ['2023', 'Kapelle St. Magdalena', 'Gschnitz', '210 kg', 'F, single'],
  ['2023', 'Pfarrkirche Zirl', 'Zirl', '4 780 kg', 'C, the largest since 1911'],
  ['2022', 'Basilika Absam', 'Absam', '1 180 kg', 'A\u266D, third of five'],
  ['2021', 'Friedhofskapelle', 'Telfs', '96 kg', 'A, hand bell'],
  ['2019', 'Universitätskirche', 'Innsbruck', '2 060 kg', 'F, recast of 1911'],
];

const TUNING = [
  ['Hum', 'One octave below', '−1 200 cents', 'Cut at the lip'],
  ['Prime', 'The nominal itself', '0 cents', 'Cut at the waist'],
  ['Tierce', 'A minor third above', '+300 cents', 'Cut above the waist'],
  ['Quint', 'A fifth above', '+700 cents', 'Cut at the shoulder'],
  ['Nominal', 'One octave above', '+1 200 cents', 'Cut at the soundbow'],
  ['Superquint', 'A twelfth above', '+1 900 cents', 'Rarely touched'],
  ['Octave nominal', 'Two octaves above', '+2 400 cents', 'Never touched'],
  ['Tolerance', 'On every partial', '± 2 cents', 'Measured, not judged'],
  ['Alloy', 'Copper to tin', '78 : 22', 'Assayed each melt'],
  ['Temperature', 'At the pour', '1 150 °C', 'Optical pyrometer'],
];

const VISIT = [
  ['Foundry', 'Höttinger Au 41, 6020 Innsbruck. Pours are announced a week ahead.'],
  ['Watching', 'Anyone may watch a pour from the gantry. Children over eight, closed shoes.'],
  ['Lead time', 'Fourteen to twenty months. The mould alone is a month of it.'],
  ['Recasting', 'We will recast a cracked bell using its own metal, and we will tell you honestly whether it is worth it.'],
];

/* Dates offered, and which of them have gone. */
const SLOTS = [
  { day: '07', month: 'March', state: 'Full', full: true },
  { day: '18', month: 'April', state: 'Six places' },
  { day: '23', month: 'May', state: 'Places left' },
  { day: '11', month: 'July', state: 'Full', full: true },
  { day: '19', month: 'Sept', state: 'Places left' },
  { day: '14', month: 'Nov', state: 'Two places' },
];

export default function GlockenhofPage() {
  const widest = Math.max(...PEAL.map((b) => b.mm));

  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--ground': '#141210',
        '--ink': '#f0ead8',
        '--accent': '#c89b3c',
        '--grey': '#7c736a',
        '--panel': '#221d18',
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
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Glockenhof</a>
        <nav aria-label="Sections">
          <a data-edit="bar.peal" data-edit-max="28" href="#peal">The peal</a>
          <a data-edit="bar.making" data-edit-max="28" href="#making">Making</a>
          <a data-edit="bar.cast" data-edit-max="28" href="#cast">Cast here</a>
          <a data-edit="bar.tuning" data-edit-max="28" href="#tuning">Tuning</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Glockengiesserei / Innsbruck</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={cupola}
              palette={['transparent', PANEL, GREY, ACCENT]}
              fit="grid"
              cellSize={162}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Bell foundry / Innsbruck / since 1782</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">One pour.</span>
            <span data-edit="hero.hi" data-edit-max="60" className={s.hi}>Three hundred years.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Cast in loam, broken out of its own mould, and tuned by taking
              metal away until all five partials agree.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#making">
              How a bell is made
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------ BLEED SCENE
            The photograph runs edge to edge on its own: the patterns live
            beside the pictures on this page, never underneath them. */}
        <figure className={s.bleed}>
          <Figure editId="photo.glockenhof-hall"
            slug="glockenhof-hall"
            alt="The casting hall of a bell foundry seen from a gantry, loam moulds set into a sand floor"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>The hall, moulds set into the floor. Nine of them, all different.</figcaption>
        </figure>

        {/* ------------------------------------------------------------ PEAL
            Eight circles, drawn to the real diameters. Nothing is labelled
            "to scale" because it is. */}
        <section id="peal" className={s.peal} aria-labelledby="peal-h">
          <div className={s.secHead}>
            <h2 data-edit="peal.title" data-edit-max="60" id="peal-h">Eight bells</h2>
            <p data-edit="peal.body" data-edit-max="240" data-edit-multiline>The peal at Wilten, drawn to diameter. Three of them are ours from 1782 and two are replacements for metal taken in 1943.</p>
          </div>
          <ol className={s.pealRow}>
            {PEAL.map((b, i) => (
              <li key={`${b.note}-${b.mm}`}>
                <div className={s.pealDisc} aria-hidden="true">
                  <span style={{ width: `${(b.mm / widest) * 100}%` }} />
                </div>
                <p data-edit={`peal.pealNote.${i}`} data-edit-max="240" data-edit-multiline className={s.pealNote}>{b.note}</p>
                <p className={s.pealMeta}>
                  {b.mm} mm
                  <br />
                  {b.kg} kg
                  <br />
                  <i>{b.year}</i>
                </p>
                <span className={s.pealIdx}>{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            A bell is the only instrument that is finished by destroying part
            of it. You cast it deliberately too sharp, then cut metal out of
            the inside until five separate notes inside one lump of bronze
            fall into tune with each other.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Glockenhof has cast on the Höttinger Au since 1782, in loam, by
              the same method, with fourteen people and one crane that predates
              all of them.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              We are not the cheapest way to get a bell and we have never
              pretended to be. What we sell is a casting that will still be in
              tune when everybody involved in ordering it is dead.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,4,3" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={bangle}
            palette={['transparent', ACCENT, PANEL, GREY]}
            fit="grid"
            cellSize={124}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ---------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div className={s.secHead}>
            <h2 data-edit="making.title" data-edit-max="60" id="making-h">Five operations</h2>
            <p data-edit="making.body" data-edit-max="240" data-edit-multiline>Forty days of mould-making for one hour of pouring, and then eleven days of cutting it back.</p>
          </div>
          <ol className={s.rows}>
            {OPERATIONS.map((o, i) => (
              <li key={o.n}>
                <span data-edit={`making.rowN.${i}`} data-edit-max="60" className={s.rowN}>{o.n}</span>
                <h3 data-edit={`making.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{o.t}</h3>
                <span data-edit={`making.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{o.d}</span>
                <span data-edit={`making.rowDays.${i}`} data-edit-max="60" className={s.rowDays}>{o.days}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.glockenhof-pour"
                slug="glockenhof-pour"
                alt="Molten bronze running from a tilted crucible into a mould in a dark foundry"
              />
              <figcaption data-edit="making.caption" data-edit-max="120" data-edit-multiline>1 150 °C. The mould is buried to the neck in sand for this.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.glockenhof-lathe"
                slug="glockenhof-lathe"
                alt="A large bronze bell mounted mouth-up on a tuning lathe with shavings on the bed"
              />
              <figcaption data-edit="making.caption2" data-edit-max="120" data-edit-multiline>Mouth-up on the lathe. Everything from here is subtraction.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ PRINCIPLES
            Each plate is a pattern field on a transparent ground with a
            cut-out object sitting on it - the pattern is the surface, the
            object is the subject. */}
        <section className={s.principles} aria-labelledby="pr-h">
          <div className={s.secHead}>
            <h2 data-edit="pr.title" data-edit-max="60" id="pr-h">Three things that do not change</h2>
            <p data-edit="pr.body" data-edit-max="240" data-edit-multiline>Two of them are physics. The third is a drawing in a locked cupboard.</p>
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
                      cellSize={68}
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

        {/* ------------------------------------------------------------ CAST */}
        <section id="cast" className={s.listing} aria-labelledby="cast-h">
          <div className={s.secHead}>
            <h2 data-edit="cast.title" data-edit-max="60" id="cast-h">Cast here</h2>
            <p data-edit="cast.body" data-edit-max="240" data-edit-multiline>Recent work. A recast keeps the old bell's metal and, where we can read it, its inscription.</p>
          </div>
          <ol className={s.table}>
            {CAST.map((r, i) => (
              <li key={i}>
                <span data-edit={`cast.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`cast.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`cast.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`cast.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`cast.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={haunch}
              palette={['transparent', ACCENT, GREY]}
              fit="grid"
              cellSize={122}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>A bell out of tune with itself is not a bad bell. It is a very heavy mistake nobody can move.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Anneliese Ruetz, tuning</cite>
          </blockquote>
        </section>

        {/* ---------------------------------------------------------- TUNING */}
        <section id="tuning" className={s.listing} aria-labelledby="tuning-h">
          <div className={s.secHead}>
            <h2 data-edit="tuning.title" data-edit-max="60" id="tuning-h">The five partials</h2>
            <p data-edit="tuning.body" data-edit-max="240" data-edit-multiline>What is cut, where, and how close it has to land. Every bell leaves with its own measured sheet.</p>
          </div>
          <ol className={s.table}>
            {TUNING.map((r, i) => (
              <li key={i}>
                <span data-edit={`tuning.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`tuning.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`tuning.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span className={s.tMid} />
                <span data-edit={`tuning.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[3]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <div data-edit-pattern="visit.field" data-edit-roles="transparent,3,4" className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={scotia}
              palette={['transparent', GREY, PANEL]}
              fit="grid"
              cellSize={102}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">Coming to a pour</h2>
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
          <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Commissions, recasts, tuning reports</p>
          <h2 data-edit="contact.datesTitle" data-edit-max="60" id="contact-h" className={s.datesTitle}>Stand at the edge of a pour</h2>
          <ul className={s.dates}>
            {SLOTS.map((d, i) => (
              <li key={`${d.day}-${d.month}`}>
                <button type="button" className={s.slot} disabled={d.full}>
                  <span data-edit={`contact.slotDay.${i}`} data-edit-max="60" className={s.slotDay}>{d.day}</span>
                  <span data-edit={`contact.slotMonth.${i}`} data-edit-max="60" className={s.slotMonth}>{d.month}</span>
                  <span data-edit={`contact.slotState.${i}`} data-edit-max="60" className={s.slotState}>{d.state}</span>
                </button>
              </li>
            ))}
          </ul>
          <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
            Höttinger Au 41, 6020 Innsbruck. Twelve people, closed shoes, and
            an hour of nothing happening before the ninety seconds that matter.
            The office answers between eight and four, and nobody answers on
            the morning of a pour.
          </p>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,2,4,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={chain}
          palette={['transparent', ACCENT, PANEL, GREY]}
          fit="grid"
          cellSize={108}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <div className={s.footObject}>
          <div className={s.footPlate}>
            <div data-edit-pattern="footer.field" data-edit-roles="transparent,3,2" className={s.footPlateField} aria-hidden="true">
              <TabbiedPattern
                pattern={bangle}
                palette={['transparent', GREY, ACCENT]}
                fit="grid"
                cellSize={78}
                redrawInterval={6000}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <Figure editId="photo.glockenhof-tile-fork-cutout" slug="glockenhof-tile-fork-cutout" alt="A polished steel tuning fork standing on its stem" cutout className={s.footCut} />
          </div>
          <p data-edit="footer.footLine" data-edit-max="240" data-edit-multiline className={s.footLine}>A bell is tuned by removing metal, so every decision it contains is final.</p>
        </div>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Foundry</h2>
            <ul>
              <li><a data-edit="footer.making" data-edit-max="28" href="#making">Five operations</a></li>
              <li><a data-edit="footer.tuning" data-edit-max="28" href="#tuning">The five partials</a></li>
              <li><a data-edit="footer.cast" data-edit-max="28" href="#cast">Cast here</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Bells</h2>
            <ul>
              <li><a data-edit="footer.peal" data-edit-max="28" href="#peal">Eight bells</a></li>
              <li><a data-edit="footer.visit" data-edit-max="28" href="#visit">Watching a pour</a></li>
              <li><a data-edit="footer.visit2" data-edit-max="28" href="#visit">Recasting</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Höttinger Au 41
              <br />
              6020 Innsbruck
              <br />
              guss@glockenhof.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional bell foundry. Bells, weights and dates are invented.</p>
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
