import { TabbiedPattern } from 'tabbied/react';
import {
  clipcorner, cornerchip, fadein, notchcut, petalcut, pindot, snipcorner,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './marais-blanc.module.css';

export const metadata = {
  title: 'Marais Blanc: Sea salt works, Guérande',
  description:
    'Thirty-six clay pans worked by hand since 1611. Salt raked at the surface, dried on the path, and sold unwashed and unground.',
};

/* White ground, ink, one salt rose. Every decorative field takes
   `transparent` in the background slot, so the paper of the page - and, in
   the plates, the plate itself - is what shows through the drawing. */
const INK = '#171519';
const ACCENT = '#c2456b';
const GREY = '#8c8a90';
const PANEL = '#e4e1dc';

/* Thirty-six pans in three ranks, tinted by the density of the brine standing
   in each. The strip is drawn from `d` and nothing else. */
const PANS = [
  [3, 4, 6, 8, 11, 14, 18, 22, 27, 33, 40, 48],
  [4, 5, 7, 10, 13, 17, 21, 26, 32, 39, 47, 57],
  [5, 7, 9, 12, 16, 20, 25, 31, 38, 46, 56, 68],
];

const WORK = [
  { n: '01', t: 'Open the vasière', d: 'The first basin takes sea water on a spring tide and holds it while the sun does the first two thirds of the work', when: 'March' },
  { n: '02', t: 'Run the adernes', d: 'Brine walks the marsh by gravity through a chain of shallowing basins, taking about a fortnight to cross it', when: 'April' },
  { n: '03', t: 'Rake the œillet', d: 'The crystallising pan. Coarse salt is drawn to the ledge with a lousse, once a day, for as long as the weather holds', when: 'June - September' },
  { n: '04', t: 'Lift the fleur', d: 'The film that forms on still water on a dry evening is skimmed off by hand before it can sink', when: 'Evenings' },
  { n: '05', t: 'Dry and store', d: 'Mounded on the path for a week, then carried in. Nothing is washed, nothing is ground, nothing is added', when: 'September' },
];

const PRINCIPLES = [
  {
    art: snipcorner,
    img: 'marais-blanc-tile-scoop-cutout',
    alt: 'A shallow wooden salt scoop worn smooth',
    n: 'I',
    t: 'Only wood touches it',
    d: 'Rake, scoop, barrow and store are all wood. Metal in a pan leaves a rust bloom that will not come out of the crop and cannot be washed away without washing the salt.',
  },
  {
    art: cornerchip,
    img: 'marais-blanc-tile-sack-cutout',
    alt: 'A small linen sack of coarse sea salt, open at the top',
    n: 'II',
    t: 'Nothing is added',
    d: 'No anti-caking agent, no iodine, no bleaching. Our salt clumps in a damp kitchen, which is the correct behaviour of salt and not a defect.',
  },
  {
    art: petalcut,
    img: 'marais-blanc-tile-stake-cutout',
    alt: 'A single weathered wooden bund stake with a squared head',
    n: 'III',
    t: 'The clay is the plant',
    d: 'There is no machinery here. The whole works is shaped earth, and a bad winter of repairs costs more days than the harvest itself.',
  },
];

const GRADES = [
  ['Gros sel', 'Coarse, grey', 'Raked from the floor', '1 kg, 5 kg', '€ 4.20 / kg'],
  ['Gros sel', 'Coarse, grey', 'Raked from the floor', '25 kg sack', '€ 2.90 / kg'],
  ['Fleur de sel', 'Fine, white', 'Skimmed from the surface', '125 g', '€ 9.50 / 125 g'],
  ['Fleur de sel', 'Fine, white', 'Skimmed from the surface', '250 g', '€ 17.00 / 250 g'],
  ['Sel fin', 'Ground once', 'Gros sel, milled here', '500 g', '€ 5.80 / 500 g'],
  ['Salicorne', 'Pickled', 'Grown on the bunds', '180 g jar', '€ 6.40'],
  ['Bath salt', 'Coarse, unsorted', 'Pan sweepings, clean', '2 kg', '€ 5.00'],
  ['Restaurant', 'Any grade', 'Direct, by arrangement', '25 kg +', 'On application'],
];

const YEAR = [
  ['January', 'Clay repair', 'Bunds rebuilt by hand', ' - '],
  ['February', 'Clay repair', 'Channels cleared', ' - '],
  ['March', 'Filling', 'First water on a spring tide', ' - '],
  ['April', 'Concentration', 'Brine walks the marsh', ' - '],
  ['May', 'Concentration', 'Pans brought up to strength', ' - '],
  ['June', 'Harvest', 'First raking if the weather holds', '3.1 t'],
  ['July', 'Harvest', 'The heaviest month, most years', '9.4 t'],
  ['August', 'Harvest', 'Fleur de sel every dry evening', '8.8 t'],
  ['September', 'Harvest', 'Last raking, then drying', '4.6 t'],
  ['October', 'Storing', 'Carried in and weighed', ' - '],
  ['November', 'Flooding', 'The marsh is put under water', ' - '],
  ['December', 'Rest', 'Nothing at all happens', ' - '],
];

const VISIT = [
  ['Where', 'Route des Marais, 44350 Guérande. Park on the road, walk the path.'],
  ['Walking', 'The bunds are public and slippery. They are also somebody\'s working floor.'],
  ['Buying', 'At the hut, June to October, and by post all year.'],
  ['Weather', 'A wet August is a bad year and there is nothing to be done about it.'],
];

/* Dates offered, and which of them have gone. */
const SLOTS = [
  { day: '14', month: 'June', state: 'Places left' },
  { day: '28', month: 'June', state: 'Places left' },
  { day: '12', month: 'July', state: 'Full', full: true },
  { day: '26', month: 'July', state: 'Two places' },
  { day: '09', month: 'Aug', state: 'Full', full: true },
  { day: '06', month: 'Sept', state: 'Places left' },
];

export default function MaraisBlancPage() {
  const strongest = Math.max(...PANS.flat());

  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--ground': '#fbfaf7',
        '--ink': '#171519',
        '--accent': '#c2456b',
        '--grey': '#8c8a90',
        '--panel': '#e4e1dc',
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
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Marais Blanc</a>
        <nav aria-label="Sections">
          <a data-edit="bar.marsh" data-edit-max="28" href="#marsh">The marsh</a>
          <a data-edit="bar.making" data-edit-max="28" href="#making">The year</a>
          <a data-edit="bar.grades" data-edit-max="28" href="#grades">Grades</a>
          <a data-edit="bar.calendar" data-edit-max="28" href="#calendar">Calendar</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Paludier / Guérande</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={clipcorner}
              palette={['transparent', PANEL, GREY, ACCENT]}
              fit="grid"
              cellSize={150}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Sea salt / Guérande / worked since 1611</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Sun, wind,</span>
            <span data-edit="hero.hi" data-edit-max="60" className={s.hi}>and a wooden rake.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Thirty-six clay pans, no pump and no machine. Sea water walks
              across the marsh for a fortnight and comes out as salt.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#marsh">
              How the marsh works
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------ BLEED SCENE */}
        <figure className={s.bleed}>
          <Figure editId="photo.marais-blanc-pans"
            slug="marais-blanc-pans"
            alt="Sea salt pans seen from directly above, a grid of shallow clay basins of pink brine"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>From above, in July. The pink is the brine, not the light.</figcaption>
        </figure>

        {/* ----------------------------------------------------------- MARSH */}
        <section id="marsh" className={s.marsh} aria-labelledby="marsh-h">
          <div className={s.secHead}>
            <h2 data-edit="marsh.title" data-edit-max="60" id="marsh-h">Thirty-six pans</h2>
            <p data-edit="marsh.body" data-edit-max="240" data-edit-multiline>
              The whole works, drawn as a plan and tinted by the strength of
              the brine standing in each pan. Water enters at the top left and
              leaves as salt at the bottom right.
            </p>
          </div>
          <div className={s.marshGrid}>
            {PANS.flatMap((row, r) =>
              row.map((dens, c) => {
                // Baumé readings cluster low, so a linear ramp leaves two
                // thirds of the marsh the same pink. The curve spreads them.
                const k = (dens / strongest) ** 0.62;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={s.pan}
                    style={{ background: `color-mix(in srgb, ${ACCENT} ${6 + k * 86}%, ${PANEL})` }}
                  >
                    <span className={s.panN} style={{ color: k > 0.52 ? '#fff' : INK }}>
                      {dens}°
                    </span>
                  </div>
                );
              }),
            )}
          </div>
          <p data-edit="marsh.marshNote" data-edit-max="240" data-edit-multiline className={s.marshNote}>
            Degrees Baumé, measured every morning. Salt begins to fall out of
            solution at about 25°, which is why only the last rank is ever
            raked.
          </p>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            Nobody here makes salt. The sun and the wind make it, at a rate
            neither can be asked to change, and the work is entirely a matter
            of moving water slowly enough and getting the crop off the floor
            before the weather turns.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Marais Blanc is one family and two employees working pans first
              cut in 1611. The clay is repaired every winter by hand, because
              the works and the tool are the same object.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              A good year is twenty-six tonnes and a bad one is nine. We have
              never had two good years in a row and we do not expect to.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,1,4" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={notchcut}
            palette={['transparent', ACCENT, INK, PANEL]}
            fit="grid"
            cellSize={116}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ---------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div className={s.secHead}>
            <h2 data-edit="making.title" data-edit-max="60" id="making-h">Five movements</h2>
            <p data-edit="making.body" data-edit-max="240" data-edit-multiline>Nine months of preparation for a harvest that lasts, in a good year, about ninety days.</p>
          </div>
          <ol className={s.rows}>
            {WORK.map((w, i) => (
              <li key={w.n}>
                <span data-edit={`making.rowN.${i}`} data-edit-max="60" className={s.rowN}>{w.n}</span>
                <h3 data-edit={`making.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{w.t}</h3>
                <span data-edit={`making.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{w.d}</span>
                <span data-edit={`making.rowDays.${i}`} data-edit-max="60" className={s.rowDays}>{w.when}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.marais-blanc-rake"
                slug="marais-blanc-rake"
                alt="A long-handled wooden salt rake resting across a clay bund beside a shallow brine pan"
              />
              <figcaption data-edit="making.caption" data-edit-max="120" data-edit-multiline>The lousse. Five metres of wood and no metal anywhere on it.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.marais-blanc-mound"
                slug="marais-blanc-mound"
                alt="A conical mound of freshly harvested white sea salt on a clay path"
              />
              <figcaption data-edit="making.caption2" data-edit-max="120" data-edit-multiline>A day's raking, drying on the path for a week before it is carried in.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ PRINCIPLES */}
        <section className={s.principles} aria-labelledby="pr-h">
          <div className={s.secHead}>
            <h2 data-edit="pr.title" data-edit-max="60" id="pr-h">Three rules of the marsh</h2>
            <p data-edit="pr.body" data-edit-max="240" data-edit-multiline>None of them is a marketing position. They are all just what happens if you do otherwise.</p>
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

        {/* ---------------------------------------------------------- GRADES */}
        <section id="grades" className={s.listing} aria-labelledby="grades-h">
          <div className={s.secHead}>
            <h2 data-edit="grades.title" data-edit-max="60" id="grades-h">What comes off the marsh</h2>
            <p data-edit="grades.body" data-edit-max="240" data-edit-multiline>Three grades and a weed. Prices are at the hut; post is at cost and slow.</p>
          </div>
          <ol className={s.table}>
            {GRADES.map((r, i) => (
              <li key={i}>
                <span data-edit={`grades.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[1]}</span>
                <span data-edit={`grades.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[0]}</span>
                <span data-edit={`grades.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`grades.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`grades.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={pindot}
              palette={['transparent', ACCENT, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>You cannot hurry it and you cannot store the weather. Everything else about this job is repairing clay.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Loïc Guéhenneuc, paludier</cite>
          </blockquote>
        </section>

        {/* -------------------------------------------------------- CALENDAR */}
        <section id="calendar" className={s.listing} aria-labelledby="cal-h">
          <div className={s.secHead}>
            <h2 data-edit="calendar.title" data-edit-max="60" id="cal-h">One year</h2>
            <p data-edit="calendar.body" data-edit-max="240" data-edit-multiline>Last year's, which was an average one: twenty-five point nine tonnes.</p>
          </div>
          <ol className={s.table}>
            {YEAR.map((r, i) => (
              <li key={i}>
                <span data-edit={`calendar.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`calendar.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`calendar.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span className={s.tMid} />
                <span data-edit={`calendar.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[3]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <div data-edit-pattern="visit.field" data-edit-roles="transparent,3,4" className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={snipcorner}
              palette={['transparent', GREY, PANEL]}
              fit="grid"
              cellSize={102}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">Coming out to the pans</h2>
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
          <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Orders, restaurants, visits</p>
          <h2 data-edit="contact.datesTitle" data-edit-max="60" id="contact-h" className={s.datesTitle}>Walk the pans with a saunier</h2>
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
            Route des Marais, 44350 Guérande. Two hours, flat, no shade, and
            it is called off without ceremony if it rains. From June to
            September nobody reads mail before dark, and in August nobody
            reads it at all - so book a date rather than write.
          </p>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,2,4,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={fadein}
          palette={['transparent', ACCENT, PANEL, GREY]}
          fit="grid"
          cellSize={104}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <p data-edit="footer.footMark" data-edit-max="240" data-edit-multiline className={s.footMark}>1611</p>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">The marsh</h2>
            <ul>
              <li><a data-edit="footer.marsh" data-edit-max="28" href="#marsh">Thirty-six pans</a></li>
              <li><a data-edit="footer.making" data-edit-max="28" href="#making">Five movements</a></li>
              <li><a data-edit="footer.calendar" data-edit-max="28" href="#calendar">One year</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Salt</h2>
            <ul>
              <li><a data-edit="footer.grades" data-edit-max="28" href="#grades">Grades and prices</a></li>
              <li><a data-edit="footer.visit" data-edit-max="28" href="#visit">Buying at the hut</a></li>
              <li><a data-edit="footer.visit2" data-edit-max="28" href="#visit">Walking the bunds</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Route des Marais
              <br />
              44350 Guérande
              <br />
              oeillet@maraisblanc.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional salt works. Tonnages, prices and dates are invented.</p>
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
