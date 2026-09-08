import { TabbiedPattern } from 'tabbied/react';
import {
  decay, quarterfall, rolloff, roundcut, roundpair, roundstep, shearpair,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './kupferwalz.module.css';

export const metadata = {
  title: 'Kupferwalz: Copper rolling mill, Liège',
  description:
    'A copper rolling mill working to ten gauges, from roofing sheet to a hundredth of a millimetre. Cast, hot rolled, cold rolled, annealed and cut here.',
};

/* Night ground, warm paper, one copper. Every decorative field takes
   `transparent` in the background slot, so the ground of the page - and, in
   the plates, the plate itself - is what shows through the drawing. */
const INK = '#efe7de';
const ACCENT = '#b4552d';
const GREY = '#7a736d';
const PANEL = '#231a16';

/* Ten gauges. `mm` drives the drawn thickness of each bar, at forty times
   scale, so the strip is the specification rather than an illustration of it. */
const GAUGES = [
  { mm: 3.0, use: 'Roofing, standing seam' },
  { mm: 2.0, use: 'Roofing, welts and flashings' },
  { mm: 1.5, use: 'Cladding, folded panels' },
  { mm: 1.0, use: 'Cladding, cassette' },
  { mm: 0.7, use: 'Gutters and rainwater' },
  { mm: 0.5, use: 'Repoussé and spinning' },
  { mm: 0.3, use: 'Engraving plate' },
  { mm: 0.2, use: 'Etching plate' },
  { mm: 0.1, use: 'Shim and gasket' },
  { mm: 0.05, use: 'Foil, laminated' },
];

const LINE = [
  { n: '01', t: 'Melt and cast', d: 'Cathode copper and our own returns, melted under charcoal and cast as a slab 180 mm thick', at: '1 120 °C' },
  { n: '02', t: 'Hot roll', d: 'Down to 12 mm in eleven passes while the slab is still red, which is the only cheap reduction there is', at: '820 °C' },
  { n: '03', t: 'Mill and pickle', d: 'Both faces skimmed, the oxide taken off in acid, and the coil weighed before anything else happens', at: 'Cold' },
  { n: '04', t: 'Cold roll', d: 'The gauge is made here, one pass at a time, with an anneal whenever the metal stops being willing', at: 'Cold' },
  { n: '05', t: 'Anneal and cut', d: 'Softened to temper, levelled, and cut to sheet or slit to strip on the same line', at: '450 - 650 °C' },
];

const PRINCIPLES = [
  {
    art: roundcut,
    img: 'kupferwalz-tile-offcut-cutout',
    alt: 'A small rolled copper sheet offcut, slightly curled',
    n: 'I',
    t: 'Gauge is measured, not claimed',
    d: 'Every coil is measured on five points across the width and at both ends, and the sheet goes out with that measurement printed on it, including the one that is at the edge of tolerance.',
  },
  {
    art: roundpair,
    img: 'kupferwalz-tile-billet-cutout',
    alt: 'A short copper billet with sawn ends',
    n: 'II',
    t: 'One alloy, endlessly',
    d: 'Cu-DHP and nothing else. Copper is the only common metal that can be melted back into itself forever without losing anything, so our scrap never leaves the site.',
  },
  {
    art: roundstep,
    img: 'kupferwalz-tile-roll-cutout',
    alt: 'A heavy steel mill roll segment with polished faces',
    n: 'III',
    t: 'The rolls are ours',
    d: 'Ground in the building, to a crown of four hundredths, on a machine bought in 1961. A rolled sheet can be no flatter than the roll that made it.',
  },
];

const SPEC = [
  ['Cu-DHP', 'Phosphorus deoxidised', '99.90 % Cu min', 'EN 1172', 'Roofing and cladding'],
  ['Cu-DHP', 'Phosphorus deoxidised', '99.90 % Cu min', 'EN 1652', 'Sheet, strip, plate'],
  ['Temper R220', 'Annealed', '220 MPa min', 'Soft', 'Deep drawing, repoussé'],
  ['Temper R240', 'Quarter hard', '240 MPa min', 'Half soft', 'Folded panels'],
  ['Temper R290', 'Half hard', '290 MPa min', 'Springy', 'Standing seam'],
  ['Width', 'Slit to order', '20 - 1 000 mm', '± 0.5 mm', 'Any gauge'],
  ['Length', 'Cut to order', 'Up to 4 000 mm', '± 2 mm', 'Sheet only'],
  ['Coil weight', 'As rolled', '80 - 2 400 kg', ' - ', 'Inner Ø 400 or 500'],
  ['Finish', 'Mill', 'As rolled, bright', ' - ', 'Standard'],
  ['Finish', 'Pre-patinated', 'Green or brown', ' - ', 'Six week lead'],
];

const SHIPPED = [
  ['2026', 'Cathédrale Saint-Paul', 'Liège', '0.7 mm, 14 t', 'Roof, standing seam'],
  ['2025', 'Musée de la Boverie', 'Liège', '1.0 mm, 6 t', 'Cladding, cassette'],
  ['2025', 'Rijksmuseum depot', 'Amsterdam', '0.2 mm, 240 kg', 'Etching plate, cut sheet'],
  ['2024', 'Stadhuis', 'Maastricht', '0.7 mm, 9 t', 'Roof and gutters'],
  ['2024', 'Atelier Vandeputte', 'Ghent', '0.5 mm, 90 kg', 'Spinning blanks'],
  ['2023', 'Kasteel van Gaasbeek', 'Lennik', '2.0 mm, 3 t', 'Roof, restoration'],
  ['2022', 'Grand Curtius', 'Liège', '1.5 mm, 11 t', 'Cladding, pre-patinated'],
  ['2021', 'Basilique Saint-Martin', 'Liège', '0.7 mm, 17 t', 'Roof, the largest since 1998'],
];

const ORDERING = [
  ['Minimum', 'One sheet over the counter, one coil by lorry. There is no minimum for a restoration.'],
  ['Lead time', 'Four weeks from stock gauge, six for pre-patinated, ten for anything unusual.'],
  ['Offcuts', 'Sold by weight on Fridays and bought back at the same price whenever you like.'],
  ['Certificates', 'EN 10204 3.1 with every despatch, whether or not you ask for it.'],
];

export default function KupferwalzPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--ground': '#15100e',
        '--ink': '#efe7de',
        '--accent': '#b4552d',
        '--grey': '#7a736d',
        '--panel': '#231a16',
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
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Kupferwalz</a>
        <nav aria-label="Sections">
          <a data-edit="bar.gauge" data-edit-max="28" href="#gauge">Gauges</a>
          <a data-edit="bar.making" data-edit-max="28" href="#making">The line</a>
          <a data-edit="bar.spec" data-edit-max="28" href="#spec">Specification</a>
          <a data-edit="bar.shipped" data-edit-max="28" href="#shipped">Shipped</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Laminoir / Liège</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={rolloff}
              palette={['transparent', PANEL, GREY, ACCENT]}
              fit="grid"
              cellSize={158}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Copper rolling mill / Liège / since 1889</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Three</span>
            <span data-edit="hero.text2" data-edit-max="60">millimetres</span>
            <span data-edit="hero.hi" data-edit-max="60" className={s.hi}>to a twentieth.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Cast, hot rolled, cold rolled, annealed and cut in one building.
              One alloy, ten gauges, and a scrap bin that never leaves the
              site.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#gauge">
              The gauges
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------ BLEED SCENE */}
        <figure className={s.bleed}>
          <Figure editId="photo.kupferwalz-hall"
            slug="kupferwalz-hall"
            alt="The interior of a copper rolling mill, a wide sheet of copper running between steel rolls"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>The cold mill. Eleven passes behind it, four to go.</figcaption>
        </figure>

        {/* ----------------------------------------------------------- GAUGE
            Ten bars drawn at forty times their real thickness. The bar is
            not a quantity beside the number - it is the number. */}
        <section id="gauge" className={s.gauge} aria-labelledby="gauge-h">
          <div className={s.secHead}>
            <h2 data-edit="gauge.title" data-edit-max="60" id="gauge-h">Ten gauges</h2>
            <p data-edit="gauge.body" data-edit-max="240" data-edit-multiline>
              Drawn at forty times scale, so the thinnest one is still visible.
              Anything between them is a special and takes two weeks longer.
            </p>
          </div>
          <ol className={s.gaugeList}>
            {GAUGES.map((g, i) => (
              <li key={g.mm}>
                <span className={s.gaugeMm}>{g.mm.toFixed(2)} mm</span>
                <span
                  className={s.gaugeBar}
                  style={{ height: `${Math.max(1, g.mm * 40)}px` }}
                  aria-hidden="true"
                />
                <span data-edit={`gauge.gaugeUse.${i}`} data-edit-max="60" className={s.gaugeUse}>{g.use}</span>
              </li>
            ))}
          </ol>
          <p data-edit="gauge.gaugeNote" data-edit-max="240" data-edit-multiline className={s.gaugeNote}>
            Tolerance is ± 3 % of gauge or ± 0.01 mm, whichever is the larger,
            measured on five points across the width. The measurement travels
            with the coil.
          </p>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            Copper is the only material in this building that never gets worse.
            Everything we cut off, drop, reject or take back goes into the next
            melt, and it comes out exactly as good as the metal that arrived on
            a lorry.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Kupferwalz has rolled on the Quai des Ardennes since 1889.
              Forty-one people, one casting bay, a hot mill from 1974 and a
              cold mill that has been rebuilt twice around its original frame.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              We roll one alloy. Everything else about the order - gauge,
              temper, width, finish - is a setting; the metal never changes.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,4,3" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={decay}
            palette={['transparent', ACCENT, PANEL, GREY]}
            fit="grid"
            cellSize={118}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ---------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div className={s.secHead}>
            <h2 data-edit="making.title" data-edit-max="60" id="making-h">Five stations</h2>
            <p data-edit="making.body" data-edit-max="240" data-edit-multiline>A slab is 180 mm thick when it is cast and 0.05 mm when it leaves. Nothing else happens in between.</p>
          </div>
          <ol className={s.rows}>
            {LINE.map((x, i) => (
              <li key={x.n}>
                <span data-edit={`making.rowN.${i}`} data-edit-max="60" className={s.rowN}>{x.n}</span>
                <h3 data-edit={`making.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{x.t}</h3>
                <span data-edit={`making.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{x.d}</span>
                <span data-edit={`making.rowDays.${i}`} data-edit-max="60" className={s.rowDays}>{x.at}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.kupferwalz-coil"
                slug="kupferwalz-coil"
                alt="A tall coil of rolled copper sheet standing on end on a mill floor"
              />
              <figcaption data-edit="making.caption" data-edit-max="120" data-edit-multiline>Two point four tonnes, on end, waiting for the slitter.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.kupferwalz-stack"
                slug="kupferwalz-stack"
                alt="A stack of cut copper sheets on a pallet seen from a low angle"
              />
              <figcaption data-edit="making.caption2" data-edit-max="120" data-edit-multiline>Cut sheet, 1.0 mm. The gauge is printed on the top one.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ PRINCIPLES */}
        <section className={s.principles} aria-labelledby="pr-h">
          <div className={s.secHead}>
            <h2 data-edit="pr.title" data-edit-max="60" id="pr-h">Three habits of the mill</h2>
            <p data-edit="pr.body" data-edit-max="240" data-edit-multiline>All three cost money and all three are the reason anybody buys from a mill this small.</p>
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
                      cellSize={66}
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

        {/* ------------------------------------------------------------ SPEC */}
        <section id="spec" className={s.listing} aria-labelledby="spec-h">
          <div className={s.secHead}>
            <h2 data-edit="spec.title" data-edit-max="60" id="spec-h">The specification</h2>
            <p data-edit="spec.body" data-edit-max="240" data-edit-multiline>Published in full. If a job needs something not on this list, it is a conversation, not a form.</p>
          </div>
          <ol className={s.table}>
            {SPEC.map((r, i) => (
              <li key={i}>
                <span data-edit={`spec.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`spec.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`spec.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`spec.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`spec.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={shearpair}
              palette={['transparent', ACCENT, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>Every kilo of copper ever mined is still copper. We are only ever borrowing it and changing its thickness.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Martine Delhaize, melt shop</cite>
          </blockquote>
        </section>

        {/* --------------------------------------------------------- SHIPPED */}
        <section id="shipped" className={s.listing} aria-labelledby="shipped-h">
          <div className={s.secHead}>
            <h2 data-edit="shipped.title" data-edit-max="60" id="shipped-h">Where it went</h2>
            <p data-edit="shipped.body" data-edit-max="240" data-edit-multiline>Recent work, with the customer's permission. Roofs outlive everybody who argued about the budget.</p>
          </div>
          <ol className={s.table}>
            {SHIPPED.map((r, i) => (
              <li key={i}>
                <span data-edit={`shipped.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`shipped.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`shipped.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`shipped.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`shipped.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- ORDERING */}
        <section id="ordering" className={s.visit} aria-labelledby="ordering-h">
          <div data-edit-pattern="ordering.field" data-edit-roles="transparent,3,4" className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={roundcut}
              palette={['transparent', GREY, PANEL]}
              fit="grid"
              cellSize={102}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 data-edit="ordering.title" data-edit-max="60" id="ordering-h">Buying from a small mill</h2>
          <dl className={s.visitList}>
            {ORDERING.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`ordering.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`ordering.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div>
            <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Quotations, specials, scrap</p>
            <h2 data-edit="contact.formTitle" data-edit-max="60" id="contact-h" className={s.formTitle}>Ask for a price</h2>
            <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
              Quai des Ardennes 60, 4020 Liège. The weighbridge is open from
              six; the office, sensibly, is not. Quotes go out the day after
              the mill has looked at the schedule.
            </p>
          </div>
          <form className={s.form}>
            <p className={s.field}>
              <label data-edit="contact.label" htmlFor="alloy">Alloy</label>
              <select id="alloy" name="alloy" defaultValue="">
                <option value="" disabled>
                  Choose
                </option>
                <option>Cu-ETP</option>
                <option>Cu-DHP</option>
                <option>CuZn37 brass</option>
                <option>CuSn6 bronze</option>
                <option>Not sure yet</option>
              </select>
            </p>
            <p className={s.field}>
              <label data-edit="contact.label2" htmlFor="gauge">Finished gauge</label>
              <input id="gauge" name="gauge" type="text" placeholder="0.30 mm" />
            </p>
            <p className={s.field}>
              <label data-edit="contact.label3" htmlFor="width">Width</label>
              <input id="width" name="width" type="text" placeholder="620 mm" />
            </p>
            <p className={s.field}>
              <label data-edit="contact.label4" htmlFor="tonnes">Quantity</label>
              <input id="tonnes" name="tonnes" type="text" placeholder="Tonnes, or a coil count" />
            </p>
            <p className={`${s.field} ${s.fieldWide}`}>
              <label data-edit="contact.label5" htmlFor="notes">Temper, finish, anything unusual</label>
              <textarea id="notes" name="notes" placeholder="Half hard, mill finish, interleaved - tell us what happens to it next" />
            </p>
            <button data-edit="contact.submit" data-edit-max="24" type="submit" className={s.submit}>
              Send it over
            </button>
          </form>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,2,4,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={quarterfall}
          palette={['transparent', ACCENT, PANEL, GREY]}
          fit="grid"
          cellSize={106}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <div className={s.footObject}>
          <div className={s.footPlate}>
            <div data-edit-pattern="footer.field" data-edit-roles="transparent,3,2" className={s.footPlateField} aria-hidden="true">
              <TabbiedPattern
                pattern={decay}
                palette={['transparent', GREY, ACCENT]}
                fit="grid"
                cellSize={76}
                redrawInterval={6000}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <Figure editId="photo.kupferwalz-tile-micrometer-cutout" slug="kupferwalz-tile-micrometer-cutout" alt="A deep-throat sheet micrometer for measuring rolled copper strip" cutout className={s.footCut} />
          </div>
          <p data-edit="footer.footLine" data-edit-max="240" data-edit-multiline className={s.footLine}>A hundredth of a millimetre either way is the whole of this trade.</p>
        </div>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Mill</h2>
            <ul>
              <li><a data-edit="footer.making" data-edit-max="28" href="#making">Five stations</a></li>
              <li><a data-edit="footer.gauge" data-edit-max="28" href="#gauge">Ten gauges</a></li>
              <li><a data-edit="footer.spec" data-edit-max="28" href="#spec">Specification</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Trade</h2>
            <ul>
              <li><a data-edit="footer.shipped" data-edit-max="28" href="#shipped">Where it went</a></li>
              <li><a data-edit="footer.ordering" data-edit-max="28" href="#ordering">Ordering</a></li>
              <li><a data-edit="footer.ordering2" data-edit-max="28" href="#ordering">Offcuts</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Quai des Ardennes 60
              <br />
              4020 Liège
              <br />
              walzwerk@kupferwalz.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional rolling mill. Tonnages, tolerances and customers are invented.</p>
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
