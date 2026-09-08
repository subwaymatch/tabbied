import { TabbiedPattern } from 'tabbied/react';
import {
  axial, crease, frieze, halving, miura, ogee, waterbomb,
} from 'tabbied/patterns';
import s from './falzbogen.module.css';

export const metadata = {
  title: 'Falzbogen: Bookbindery, Leipzig',
  description:
    'A trade bindery that still folds, sews and cases in by hand. Editions, conservation and the sixteen-page signature the whole trade is built on.',
};

/* Cream, ink, one crimson. Every field takes `transparent` in the background
   slot so the sheet of the page runs through the pattern. */
const INK = '#171310';
const RED = '#b0003a';
const GREY = '#8b857a';
const PALE = '#e0dacb';

/* A sixteen-page signature, imposed. Two formes, eight pages each, and the
   order is the whole reason a book folds into a book. */
const IMPOSITION = [
  [16, 1, 4, 13],
  [9, 8, 5, 12],
];

const WORK = [
  { n: '01', t: 'Edition binding', d: 'Sewn sections, cloth or quarter-leather, cased in by hand', run: '20 - 500', lead: '8 weeks' },
  { n: '02', t: 'Conservation', d: 'Rebacking, resewing, and leaving alone whatever can be left alone', run: '1', lead: 'By survey' },
  { n: '03', t: 'Trade sewing', d: 'Section sewing for other binders and short-run printers', run: '50 - 5 000', lead: '3 weeks' },
  { n: '04', t: 'Boxes and slipcases', d: 'Clamshells, drop-backs and phase boxes, measured off the book', run: '1 - 200', lead: '4 weeks' },
  { n: '05', t: 'Blocking', d: 'Foil and blind, from brass, on cloth, paper or leather', run: 'Any', lead: '2 weeks' },
];

const FOLDS = [
  {
    art: crease,
    n: 'I',
    t: 'Fold',
    d: 'A sheet is folded three times to make sixteen pages, and where the grain runs decides whether the finished book will open flat or fight you for its whole life.',
  },
  {
    art: miura,
    n: 'II',
    t: 'Gather',
    d: 'Signatures are collated in order and checked at the back margin, where the collation marks step down the spine in a diagonal you can read at a glance.',
  },
  {
    art: waterbomb,
    n: 'III',
    t: 'Sew',
    d: 'On tapes, on cords, or unsupported, depending on the book and the century it thinks it is from. Sewing is the only structure in a well-made book that is not glue.',
  },
  {
    art: halving,
    n: 'IV',
    t: 'Case in',
    d: 'Boards cut, cloth turned in, the book laid into its case and left in the press overnight. Twelve hours, and there is no way to make it eight.',
  },
];

const STRUCTURES = [
  ['Sewn on tapes', 'Cloth case', 'Opens flat to 170°', 'Editions, 20 - 500', '€ 34 / copy'],
  ['Sewn on cords', 'Quarter leather', 'Opens flat to 160°', 'Editions, 20 - 120', '€ 96 / copy'],
  ['Unsupported link', 'Paper case', 'Opens flat to 180°', 'Artists\' books', '€ 41 / copy'],
  ['Coptic', 'Exposed spine', 'Opens flat to 180°', 'Artists\' books', '€ 52 / copy'],
  ['Long stitch', 'Limp vellum', 'Opens flat to 175°', 'Notebooks, editions', '€ 28 / copy'],
  ['Japanese stab', 'Soft cover', 'Does not open flat', 'Short run, single sheets', '€ 19 / copy'],
  ['Perfect, PUR', 'Soft cover', 'Opens flat to 150°', 'Runs over 300', '€ 6 / copy'],
  ['Drop-back box', 'Cloth over board', ' - ', 'Any', '€ 118 each'],
  ['Clamshell', 'Cloth over board', ' - ', 'Any', '€ 96 each'],
  ['Phase box', 'Archival board', ' - ', 'Conservation', '€ 22 each'],
];

const MATERIALS = [
  ['Buckram', 'Bamberger Kaliko', '18 colours held', 'Cloth', 'Held'],
  ['Book cloth', 'Van Heek Scholco', '31 colours held', 'Cloth', 'Held'],
  ['Goatskin', 'Harmatan', 'To order, by skin', 'Leather', 'To order'],
  ['Calf', 'Hewit', 'To order, by skin', 'Leather', 'To order'],
  ['Vellum', 'Cowley', 'To order, by skin', 'Leather', 'To order'],
  ['Zerkall', '145 gsm', 'Mould made, endpapers', 'Paper', 'Held'],
  ['Hahnemühle Bugra', '90 gsm', '14 colours, endpapers', 'Paper', 'Held'],
  ['Grey board', '2.0 / 2.5 / 3.0 mm', 'Boards', 'Board', 'Held'],
  ['Archival board', '1.5 mm', 'Boxes, conservation', 'Board', 'Held'],
  ['Linen thread', 'No. 18 / 25 / 30', 'Sewing', 'Thread', 'Held'],
  ['Wheat starch', 'Made weekly', 'Conservation adhesive', 'Adhesive', 'Made here'],
  ['PVA, neutral', ' - ', 'Trade adhesive', 'Adhesive', 'Held'],
];

const RECENT = [
  ['2026', 'Sächsische Akademie', 'Proceedings, vol. 118', 'Sewn on tapes, buckram', '400 copies'],
  ['2026', 'Edition Rotpunkt', 'Neun Städte', 'Quarter leather, blocked', '80 copies'],
  ['2025', 'Universitätsbibliothek', 'Rebacking, 44 volumes', 'Conservation', '44 volumes'],
  ['2025', 'Studio Halm', 'Ein Jahr Papier', 'Coptic, exposed spine', '120 copies'],
  ['2025', 'Verlag am Ring', 'Gesammelte Aufsätze', 'Sewn on tapes, cloth', '650 copies'],
  ['2024', 'Stadtarchiv Leipzig', 'Phase boxes, 310 items', 'Conservation', '310 boxes'],
  ['2024', 'Private commission', 'A family cookbook', 'Limp vellum, long stitch', '6 copies'],
  ['2023', 'Museum der Schrift', 'Facsimile, 1462 missal', 'Sewn on cords, alum-tawed', '25 copies'],
];

const SHOP = [
  ['Quoting', 'Send a dummy or the page count, trim size and paper. We will not quote from a description alone.'],
  ['Minimums', 'None for conservation. Twenty copies for edition work, because the setup is the cost.'],
  ['Apprentices', 'Two at any time, three and a half years each, and they sew before they touch a board.'],
  ['Visits', 'Any Tuesday. The presses are on the ground floor and the sewing frames are upstairs by the window.'],
];

export default function FalzbogenPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f2eee4',
        '--ink': '#171310',
        '--red': '#b0003a',
        '--grey': '#8b857a',
        '--pale': '#e0dacb',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Falzbogen</a>
        <nav aria-label="Sections">
          <a data-edit="bar.work" data-edit-max="28" href="#work">Work</a>
          <a data-edit="bar.folds" data-edit-max="28" href="#folds">Folding</a>
          <a data-edit="bar.structures" data-edit-max="28" href="#structures">Structures</a>
          <a data-edit="bar.recent" data-edit-max="28" href="#recent">Recent</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Buchbinderei / Leipzig</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={miura}
              palette={['transparent', PALE, GREY, RED]}
              fit="grid"
              cellSize={152}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Bookbindery / Leipzig / since 1902</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Sixteen</span>
            <span data-edit="hero.text2" data-edit-max="60">pages,</span>
            <span data-edit="hero.red" data-edit-max="60" className={s.red}>three folds.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              A trade bindery that still folds with a bone, sews on tapes and
              leaves a book in the press overnight because there is no faster
              way to do it properly.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#work">
              What we bind
            </a>
          </div>
        </section>

        {/* ----------------------------------------------------- IMPOSITION
            The sheet, imposed. Eight pages a side, upside down on alternate
            rows, exactly as it comes off the press - which is the closest a
            web page gets to being a printed one. */}
        <section id="imposition" className={s.imposition} aria-labelledby="imp-h">
          <div className={s.secHead}>
            <h2 data-edit="imposition.title" data-edit-max="60" id="imp-h">One sheet, imposed</h2>
            <p data-edit="imposition.body" data-edit-max="240" data-edit-multiline>
              Sixteen pages on one sheet, half of them upside down. Fold it
              three times, trim the head, and the numbers run in order. This
              is the whole trade in one diagram.
            </p>
          </div>
          <div className={s.sheet}>
            {IMPOSITION.map((row, ri) => (
              <div className={s.sheetRow} key={ri}>
                {row.map((n, i) => (
                  <div className={s.pageCell} key={n} data-flip={ri === 0 ? 'yes' : 'no'}>
                    <span data-edit={`imposition.text.${ri}.${i}`} data-edit-max="60">{n}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p data-edit="imposition.sheetNote" data-edit-max="240" data-edit-multiline className={s.sheetNote}>
            Outer forme above, inner forme below. Page 1 sits next to page 16
            and neither of them knows it until the sheet is folded.
          </p>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            Everything that makes a book last is invisible once it is finished:
            the direction of the grain, the tension of the thread, the twelve
            hours it spent under a weight. What you can see is the part that
            was easy.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Falzbogen has bound in Leipzig since 1902, in three buildings, the
              last of them since 1961. Fourteen binders, two apprentices, four
              standing presses and a guillotine older than any of us.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              We bind for publishers, for libraries and for people who have one
              book that matters. The last of those pays the same rate as the
              first and waits the same length of time.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <div className={s.secHead}>
            <h2 data-edit="work.title" data-edit-max="60" id="work-h">What we bind</h2>
            <p data-edit="work.body" data-edit-max="240" data-edit-multiline>Lead times start when the sheets arrive, not when the order does.</p>
          </div>
          <ol className={s.rows}>
            {WORK.map((w, i) => (
              <li key={w.n}>
                <span data-edit={`work.rowN.${i}`} data-edit-max="60" className={s.rowN}>{w.n}</span>
                <h3 data-edit={`work.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{w.t}</h3>
                <span data-edit={`work.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{w.d}</span>
                <span data-edit={`work.rowRun.${i}`} data-edit-max="60" className={s.rowRun}>{w.run}</span>
                <span data-edit={`work.rowLead.${i}`} data-edit-max="60" className={s.rowLead}>{w.lead}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,1,4" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={crease}
            palette={['transparent', RED, INK, PALE]}
            fit="grid"
            cellSize={116}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ----------------------------------------------------------- FOLDS */}
        <section id="folds" className={s.folds} aria-labelledby="folds-h">
          <div className={s.secHead}>
            <h2 data-edit="folds.title" data-edit-max="60" id="folds-h">Fold, gather, sew, case</h2>
            <p data-edit="folds.body" data-edit-max="240" data-edit-multiline>Four operations, in this order, and no shortcut through any of them.</p>
          </div>
          <div className={s.fGrid}>
            {FOLDS.map((f, i) => (
              <article key={f.n}>
                <div data-edit-pattern={`folds.field.${i}`} data-edit-roles="transparent,3,2" className={s.fPlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={f.art}
                    palette={['transparent', GREY, RED]}
                    fit="grid"
                    cellSize={62}
                    redrawInterval={5400}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p data-edit={`folds.fN.${i}`} data-edit-max="240" data-edit-multiline className={s.fN}>{f.n}</p>
                <h3 data-edit={`folds.title2.${i}`} data-edit-max="40">{f.t}</h3>
                <p data-edit={`folds.fBody.${i}`} data-edit-max="240" data-edit-multiline className={s.fBody}>{f.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ STRUCTURES */}
        <section id="structures" className={s.listing} aria-labelledby="str-h">
          <div className={s.secHead}>
            <h2 data-edit="structures.title" data-edit-max="60" id="str-h">Structures and what they cost</h2>
            <p data-edit="structures.body" data-edit-max="240" data-edit-multiline>Per copy, in a run of a hundred, sheets supplied. The opening angle is measured, not claimed.</p>
          </div>
          <ol className={s.table}>
            {STRUCTURES.map((r, i) => (
              <li key={i}>
                <span data-edit={`structures.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[3]}</span>
                <span data-edit={`structures.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[0]}</span>
                <span data-edit={`structures.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[1]}</span>
                <span data-edit={`structures.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`structures.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={ogee}
              palette={['transparent', RED, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>A book that will not stay open is a book nobody finishes. Everything we do is in service of that one hinge.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Dorothea Klemm, workshop</cite>
          </blockquote>
        </section>

        {/* ------------------------------------------------------- MATERIALS */}
        <section className={s.listing} aria-labelledby="mat-h">
          <div className={s.secHead}>
            <h2 data-edit="mat.title" data-edit-max="60" id="mat-h">In the store room</h2>
            <p data-edit="mat.body" data-edit-max="240" data-edit-multiline>Held means it is upstairs. To order means it comes by the skin and you choose it yourself.</p>
          </div>
          <ol className={s.table}>
            {MATERIALS.map((r, i) => (
              <li key={r[0] + r[1]}>
                <span data-edit={`mat.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[3]}</span>
                <span data-edit={`mat.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[0]}</span>
                <span data-edit={`mat.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[1]}</span>
                <span data-edit={`mat.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`mat.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- RECENT */}
        <section id="recent" className={s.listing} aria-labelledby="recent-h">
          <div className={s.secHead}>
            <h2 data-edit="recent.title" data-edit-max="60" id="recent-h">Off the bench</h2>
            <p data-edit="recent.body" data-edit-max="240" data-edit-multiline>Work finished in the last three years, with the client's permission to say so.</p>
          </div>
          <ol className={s.table}>
            {RECENT.map((r, i) => (
              <li key={i}>
                <span data-edit={`recent.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`recent.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[2]}</span>
                <span data-edit={`recent.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[1]}</span>
                <span data-edit={`recent.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`recent.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ SHOP */}
        <section id="shop" className={s.shop} aria-labelledby="shop-h">
          <div data-edit-pattern="shop.field" data-edit-roles="transparent,3,4" className={s.shopField} aria-hidden="true">
            <TabbiedPattern
              pattern={frieze}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={108}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.shopInner}>
            <h2 data-edit="shop.title" data-edit-max="60" id="shop-h">Working with us</h2>
            <dl className={s.shopList}>
              {SHOP.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`shop.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`shop.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div>
            <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Dummies, surveys, quotations</p>
            <h2 data-edit="contact.formTitle" data-edit-max="60" id="contact-h" className={s.formTitle}>Quote a binding</h2>
            <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
              Nonnenstrasse 17, 04229 Leipzig. Post a dummy and we will send
              it back bound, once, at no charge, which settles most
              arguments faster than a specification does.
            </p>
          </div>
          <form className={s.form}>
            <p className={s.field}>
              <label data-edit="contact.label" htmlFor="edition">Edition</label>
              <input id="edition" name="edition" type="text" placeholder="How many copies" />
            </p>
            <p className={s.field}>
              <label data-edit="contact.label2" htmlFor="trim">Trim size</label>
              <input id="trim" name="trim" type="text" placeholder="170 × 240 mm" />
            </p>
            <p className={s.field}>
              <label data-edit="contact.label3" htmlFor="binding">Binding</label>
              <select id="binding" name="binding" defaultValue="">
                <option value="" disabled>
                  Choose
                </option>
                <option>Section-sewn case</option>
                <option>Otabind</option>
                <option>Swiss brochure</option>
                <option>Quarter cloth</option>
                <option>Come and tell us</option>
              </select>
            </p>
            <p className={s.field}>
              <label data-edit="contact.label4" htmlFor="extent">Extent</label>
              <input id="extent" name="extent" type="text" placeholder="Pages, including plates" />
            </p>
            <p className={`${s.field} ${s.fieldWide}`}>
              <label data-edit="contact.label5" htmlFor="notes">Stock, endpapers, foil</label>
              <textarea id="notes" name="notes" placeholder="And whether it has to lie flat, which changes everything" />
            </p>
            <button data-edit="contact.submit" data-edit-max="24" type="submit" className={s.submit}>
              Send it over
            </button>
          </form>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,4,2,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={axial}
          palette={['transparent', PALE, RED, GREY]}
          fit="grid"
          cellSize={104}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <nav className={s.footIndex} aria-label="Sections">
          <a data-edit="footer.work" data-edit-max="28" href="#work">What we bind</a>
          <a data-edit="footer.structures" data-edit-max="28" href="#structures">Structures</a>
          <a data-edit="footer.folds" data-edit-max="28" href="#folds">Four folds</a>
          <a data-edit="footer.shop" data-edit-max="28" href="#shop">Working with us</a>
        </nav>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">On the bench</h2>
            <p>
              Six benches, three of them older than the firm
              <br />
              Two thread-sewing machines, one hand frame
              <br />
              A nipping press of 1911, still the fastest way
            </p>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Craft</h2>
            <ul>
              <li><a data-edit="footer.imposition" data-edit-max="28" href="#imposition">Imposition</a></li>
              <li><a data-edit="footer.folds2" data-edit-max="28" href="#folds">Four operations</a></li>
              <li><a data-edit="footer.shop2" data-edit-max="28" href="#shop">Working with us</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Nonnenstrasse 17
              <br />
              04229 Leipzig
              <br />
              bogen@falzbogen.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional bookbindery. Clients, prices and materials are invented.</p>
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
