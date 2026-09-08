import { TabbiedPattern } from 'tabbied/react';
import {
  angleoff, fanned, gnomonwedge, mitre, overbar, quoinwedge, sail, skewback,
} from 'tabbied/patterns';
import s from './beaufort.module.css';

export const metadata = {
  title: 'Ateliers Beaufort: Sailmakers, Lorient',
  description:
    'A loft on the Blavet cutting sails by hand and by machine. Cruising, racing and classic wardrobes, cut for the wind you actually get.',
};

/* Night navy, bone, one sea green. Every field takes `transparent` in the
   background slot so the water of the page runs through the pattern. */
const BONE = '#efeae0';
const GREEN = '#00b37a';
const GREY = '#6e808f';
const DEEP = '#14293d';

/* The scale the loft is named after, and the spine of the whole page. Every
   row is one force, and the cut note is what it means for a sail. */
const SCALE = [
  ['0', 'Calm', '< 1', 'Sea like a mirror', 'Nothing we make will help you'],
  ['1', 'Light air', '1 - 3', 'Ripples, no foam', 'Code zero, and patience'],
  ['2', 'Light breeze', '4 - 6', 'Small wavelets', 'Full main, light genoa'],
  ['3', 'Gentle breeze', '7 - 10', 'Crests begin to break', 'The wardrobe is happy'],
  ['4', 'Moderate breeze', '11 - 16', 'Fairly frequent white horses', 'Where we cut for'],
  ['5', 'Fresh breeze', '17 - 21', 'Moderate waves, many white horses', 'First reef, no drama'],
  ['6', 'Strong breeze', '22 - 27', 'Large waves, spray', 'Second reef, working jib'],
  ['7', 'Near gale', '28 - 33', 'Sea heaps up, foam in streaks', 'Third reef, staysail'],
  ['8', 'Gale', '34 - 40', 'Moderately high waves, edges break', 'Storm jib and honesty'],
  ['9', 'Strong gale', '41 - 47', 'High waves, dense foam', 'Trysail. This is the cloth test'],
  ['10', 'Storm', '48 - 55', 'Very high waves, sea white', 'Nothing set that we did not triple-stitch'],
  ['11', 'Violent storm', '56 - 63', 'Exceptionally high waves', 'Everything below, everything lashed'],
  ['12', 'Hurricane', '64 +', 'Air filled with foam and spray', 'The loft would like a word'],
];

const WORK = [
  { n: '01', t: 'Cruising', d: 'Cross-cut and radial wardrobes in Dacron and laminate, cut to be reefed', lead: '6 weeks', from: '€ 3 400' },
  { n: '02', t: 'Racing', d: 'Membrane mains and headsails, moulded on our own floor', lead: '9 weeks', from: '€ 7 900' },
  { n: '03', t: 'Classic', d: 'Cotton and flax for boats that predate synthetics, hand-roped', lead: '14 weeks', from: '€ 9 200' },
  { n: '04', t: 'Repair', d: 'Anything, including sails we did not make and would not have made', lead: '4 days', from: '€ 90' },
  { n: '05', t: 'Covers', d: 'Stack packs, sprayhoods, winch and wheel covers in acrylic', lead: '3 weeks', from: '€ 640' },
];

const CLOTH = [
  ['Dacron HTP', '280 g/m²', 'Cross-cut cruising', '8 - 12 years', 'Held'],
  ['Dacron HTP', '380 g/m²', 'Heavy cruising, charter', '10 - 15 years', 'Held'],
  ['Hydra Net Radial', '340 g/m²', 'Radial cruising', '10 - 14 years', 'Held'],
  ['Laminate, Pentex', '295 g/m²', 'Fast cruising', '6 - 8 years', 'Held'],
  ['Membrane, Aramid', '240 g/m²', 'Racing, inshore', '3 - 5 seasons', 'Made here'],
  ['Membrane, Carbon', '210 g/m²', 'Racing, offshore', '2 - 4 seasons', 'Made here'],
  ['Nylon, 0.75 oz', '25 g/m²', 'Spinnaker, light', '5 - 8 years', 'Held'],
  ['Nylon, 1.5 oz', '50 g/m²', 'Spinnaker, all round', '6 - 10 years', 'Held'],
  ['Flax, No. 4', '410 g/m²', 'Classic, gaff rig', '20 years +', 'To order'],
  ['Cotton duck', '460 g/m²', 'Classic, museum work', '20 years +', 'To order'],
  ['Acrylic, solution dyed', '305 g/m²', 'Covers', '10 years', 'Held'],
  ['Your own cloth', ' - ', 'We will cut it, once', ' - ', ' - '],
];

const BUILT = [
  ['2026', 'Aïda', 'Sloop, 14 m', 'Full cruising wardrobe', '6 sails'],
  ['2026', 'Kerlouan', 'Ketch, 19 m', 'Main, mizzen, staysail', '3 sails'],
  ['2025', 'Marie-Jeanne', 'Sinagot, 1928', 'Flax, hand-roped, museum spec', '2 sails'],
  ['2025', 'Rafale IV', 'Class 40', 'Membrane inventory, offshore', '9 sails'],
  ['2025', 'Petit Nord', 'Cutter, 11 m', 'Radial main and yankee', '4 sails'],
  ['2024', 'Bélouga', 'Sloop, 8 m', 'Dacron cruising pair', '2 sails'],
  ['2024', 'Tabarly', 'Classic yawl, 1964', 'Restoration, matched to plans', '7 sails'],
  ['2024', 'Grain de Sel', 'Catamaran, 12 m', 'Square-top main, self-tacker', '3 sails'],
  ['2023', 'Ouessant', 'Pilot cutter, 1911', 'Flax throughout', '5 sails'],
  ['2023', 'Vent Debout', 'Figaro 3', 'One-design, class measured', '4 sails'],
];

const CRAFT = [
  {
    art: gnomonwedge,
    n: 'I',
    t: 'Measured on the boat',
    d: 'Nobody cuts from a drawing. We come with a laser and a ladder, take the rig standing and loaded, and photograph the mast bend under sail before a panel is designed.',
  },
  {
    art: fanned,
    n: 'II',
    t: 'Cut on the floor',
    d: 'Eight hundred square metres of flat floor, which is the whole reason the loft is where it is. Panels are broadseamed by eye and checked against the plot before they are joined.',
  },
  {
    art: overbar,
    n: 'III',
    t: 'Finished by hand',
    d: 'Corners, rings and reef points are hand-worked, because the machine is faster and the hand is right. A classic gets hand-roping all the way round and takes three weeks longer.',
  },
];

const VISIT = [
  ['Loft', 'Quai des Indes 9, 56100 Lorient. Ring the bell on the water side.'],
  ['Season', 'Booked out from March. Repairs go in front of everything in July.'],
  ['Pick-up', 'Delivered to your berth in Brittany, freighted anywhere else.'],
  ['Guarantee', 'Five years on our stitching, and the cloth-maker warrants the cloth.'],
];

/* When, what, and where - the footer dateline. */
const NEXT_UP: [string, string, string][] = [
  ['08.03', 'Mainsail, Class 40 - three panels recut', 'On the floor'],
  ['22.03', 'Genoa for a Bermudan 38, measured in February', 'Cut'],
  ['04.04', 'Storm jib for a delivery crew who asked twice', 'Sewn'],
];

export default function BeaufortPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--navy': '#0b1b2b',
        '--bone': '#efeae0',
        '--green': '#00b37a',
        '--grey': '#6e808f',
        '--deep': '#14293d',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="navy,bone,green,grey,deep"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Ateliers Beaufort</a>
        <nav aria-label="Sections">
          <a data-edit="bar.scale" data-edit-max="28" href="#scale">The scale</a>
          <a data-edit="bar.work" data-edit-max="28" href="#work">Work</a>
          <a data-edit="bar.cloth" data-edit-max="28" href="#cloth">Cloth</a>
          <a data-edit="bar.built" data-edit-max="28" href="#built">Built here</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Voilerie / Lorient</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={sail}
              palette={['transparent', DEEP, GREY, GREEN]}
              fit="grid"
              cellSize={158}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Sailmakers / Lorient / since 1971</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Cut for</span>
            <span data-edit="hero.text2" data-edit-max="60">force</span>
            <span data-edit="hero.green" data-edit-max="60" className={s.green}>four.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              A sail cut for the wind you get, not the wind in the brochure.
              Eight hundred square metres of floor on the Blavet and fifty-five
              years of doing it here.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#work">
              What we make
            </a>
          </div>
        </section>

        {/* ----------------------------------------------------------- SCALE
            Thirteen rows, force nought to twelve, each one a full-width
            band with the number set as large as the row is tall. This is the
            spine of the page and the reason it is as long as it is. */}
        <section id="scale" className={s.scale} aria-labelledby="scale-h">
          <div className={s.secHead}>
            <h2 data-edit="scale.title" data-edit-max="60" id="scale-h">Nought to twelve</h2>
            <p data-edit="scale.body" data-edit-max="240" data-edit-multiline>
              The scale Admiral Beaufort wrote down in 1805, and what each force
              means on our floor. Force four is where a cruising wardrobe should
              be at its best.
            </p>
          </div>
          <ol className={s.scaleList}>
            {SCALE.map((f, i) => (
              <li key={f[0]} data-key={f[0] === '4' ? 'yes' : 'no'}>
                <span data-edit={`scale.fN.${i}`} data-edit-max="60" className={s.fN}>{f[0]}</span>
                <div className={s.fBody}>
                  <h3 data-edit={`scale.title2.${i}`} data-edit-max="40">{f[1]}</h3>
                  <p data-edit={`scale.fSea.${i}`} data-edit-max="240" data-edit-multiline className={s.fSea}>{f[3]}</p>
                </div>
                <span className={s.fKt}>{f[2]} kt</span>
                <span data-edit={`scale.fCut.${i}`} data-edit-max="60" className={s.fCut}>{f[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            Most sails are designed for the wind a brochure photograph is taken
            in. We ask what you actually sail in, which is usually less wind,
            more chop and shorter-handed than anybody admits, and we cut for
            that.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              The loft has been on the Quai des Indes since 1971 and on the same
              floor since 1988. Eleven of us: six on the floor, two on the
              machines, one in the rigging and two who do everything else.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              We make membrane sails here rather than buying them in, which is
              unusual for a loft this size and is the single most expensive
              decision the business has ever taken.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <div className={s.secHead}>
            <h2 data-edit="work.title" data-edit-max="60" id="work-h">What we make</h2>
            <p data-edit="work.body" data-edit-max="240" data-edit-multiline>Lead times are from the day we measure, not the day you call.</p>
          </div>
          <ol className={s.rows}>
            {WORK.map((x, i) => (
              <li key={x.n}>
                <span data-edit={`work.rowN.${i}`} data-edit-max="60" className={s.rowN}>{x.n}</span>
                <h3 data-edit={`work.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{x.t}</h3>
                <span data-edit={`work.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{x.d}</span>
                <span data-edit={`work.rowLead.${i}`} data-edit-max="60" className={s.rowLead}>{x.lead}</span>
                <span data-edit={`work.rowFrom.${i}`} data-edit-max="60" className={s.rowFrom}>{x.from}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,4,3" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={quoinwedge}
            palette={['transparent', GREEN, DEEP, GREY]}
            fit="grid"
            cellSize={118}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ----------------------------------------------------------- CRAFT */}
        <section id="craft" className={s.craft} aria-labelledby="craft-h">
          <div className={s.secHead}>
            <h2 data-edit="craft.title" data-edit-max="60" id="craft-h">Three habits</h2>
            <p data-edit="craft.body" data-edit-max="240" data-edit-multiline>None of them fast, all of them the reason a sail lasts a decade.</p>
          </div>
          <div className={s.cGrid}>
            {CRAFT.map((c, i) => (
              <article key={c.n}>
                <div data-edit-pattern={`craft.field.${i}`} data-edit-roles="transparent,3,2" className={s.cPlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={c.art}
                    palette={['transparent', GREY, GREEN]}
                    fit="grid"
                    cellSize={66}
                    redrawInterval={5400}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p data-edit={`craft.cN.${i}`} data-edit-max="240" data-edit-multiline className={s.cN}>{c.n}</p>
                <h3 data-edit={`craft.title2.${i}`} data-edit-max="40">{c.t}</h3>
                <p data-edit={`craft.cBody.${i}`} data-edit-max="240" data-edit-multiline className={s.cBody}>{c.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------- CLOTH */}
        <section id="cloth" className={s.listing} aria-labelledby="cloth-h">
          <div className={s.secHead}>
            <h2 data-edit="cloth.title" data-edit-max="60" id="cloth-h">Cloth on the shelf</h2>
            <p data-edit="cloth.body" data-edit-max="240" data-edit-multiline>Held means it is in the building. Made here means it is laid up on our own floor.</p>
          </div>
          <ol className={s.table}>
            {CLOTH.map((r, i) => (
              <li key={i}>
                <span data-edit={`cloth.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[1]}</span>
                <span data-edit={`cloth.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[0]}</span>
                <span data-edit={`cloth.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`cloth.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`cloth.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={mitre}
              palette={['transparent', GREEN, GREY]}
              fit="grid"
              cellSize={124}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>A sail is a wing you have to fold up and put in a bag. Everything difficult about it comes from the second half of that sentence.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Yann Le Guillou, master sailmaker</cite>
          </blockquote>
        </section>

        {/* ----------------------------------------------------------- BUILT */}
        <section id="built" className={s.listing} aria-labelledby="built-h">
          <div className={s.secHead}>
            <h2 data-edit="built.title" data-edit-max="60" id="built-h">Built here</h2>
            <p data-edit="built.body" data-edit-max="240" data-edit-multiline>Recent wardrobes. Owners who asked not to appear are not on the list, which is why it is short.</p>
          </div>
          <ol className={s.table}>
            {BUILT.map((r, i) => (
              <li key={r[1]}>
                <span data-edit={`built.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`built.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`built.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`built.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`built.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <div data-edit-pattern="visit.field" data-edit-roles="transparent,2,3" className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={angleoff}
              palette={['transparent', GREEN, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.visitInner}>
            <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">Coming to the loft</h2>
            <dl className={s.visitList}>
              {VISIT.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`visit.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`visit.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div>
            <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Measure, quote, argue</p>
            <h2 data-edit="contact.formTitle" data-edit-max="60" id="contact-h" className={s.formTitle}>Start a sail</h2>
            <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
              Quai des Indes 9, 56100 Lorient. Somebody is on the floor from
              seven in the morning; the telephone is answered from nine, and a
              quote takes about a fortnight because we would rather measure
              twice.
            </p>
          </div>
          <form className={s.form}>
            <p className={s.field}>
              <label data-edit="contact.label" htmlFor="boat">Boat</label>
              <input id="boat" name="boat" type="text" placeholder="Class, or length overall" />
            </p>
            <p className={s.field}>
              <label data-edit="contact.label2" htmlFor="sail">Sail</label>
              <select id="sail" name="sail" defaultValue="">
                <option value="" disabled>
                  Choose
                </option>
                <option>Mainsail</option>
                <option>Genoa</option>
                <option>Staysail</option>
                <option>Spinnaker</option>
                <option>Storm jib</option>
              </select>
            </p>
            <p className={s.field}>
              <label data-edit="contact.label3" htmlFor="rig">Rig measurements</label>
              <select id="rig" name="rig" defaultValue="">
                <option value="" disabled>
                  Choose
                </option>
                <option>I have a current survey</option>
                <option>Please come and measure</option>
                <option>Copy the sail I have</option>
              </select>
            </p>
            <p className={s.field}>
              <label data-edit="contact.label4" htmlFor="when">Wanted by</label>
              <input id="when" name="when" type="text" placeholder="A month is enough" />
            </p>
            <p className={`${s.field} ${s.fieldWide}`}>
              <label data-edit="contact.label5" htmlFor="notes">What it is for</label>
              <textarea id="notes" name="notes" placeholder="Cruising, racing, delivery, or something you have not told a sailmaker before" />
            </p>
            <button data-edit="contact.submit" data-edit-max="24" type="submit" className={s.submit}>
              Send it over
            </button>
          </form>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,2,4,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={skewback}
          palette={['transparent', GREEN, DEEP, GREY]}
          fit="grid"
          cellSize={108}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <ol className={s.footNext} aria-label="On the floor">
          {NEXT_UP.map(([when, what, tag], i) => (
            <li key={when}>
              <span data-edit={`footer.fnWhen.${i}`} data-edit-max="60" className={s.fnWhen}>{when}</span>
              <span data-edit={`footer.fnWhat.${i}`} data-edit-max="60" className={s.fnWhat}>{what}</span>
              <span data-edit={`footer.fnTag.${i}`} data-edit-max="60" className={s.fnTag}>{tag}</span>
            </li>
          ))}
        </ol>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Loft</h2>
            <ul>
              <li><a data-edit="footer.work" data-edit-max="28" href="#work">What we make</a></li>
              <li><a data-edit="footer.cloth" data-edit-max="28" href="#cloth">Cloth</a></li>
              <li><a data-edit="footer.built" data-edit-max="28" href="#built">Built here</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Reference</h2>
            <ul>
              <li><a data-edit="footer.scale" data-edit-max="28" href="#scale">The scale</a></li>
              <li><a data-edit="footer.craft" data-edit-max="28" href="#craft">Three habits</a></li>
              <li><a data-edit="footer.visit" data-edit-max="28" href="#visit">Visiting</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Quai des Indes 9
              <br />
              56100 Lorient
              <br />
              plancher@beaufort.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional sail loft. Boats, prices and cloth weights are invented.</p>
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
