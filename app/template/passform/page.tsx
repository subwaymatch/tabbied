import { TabbiedPattern } from 'tabbied/react';
import {
  bias, corduroy, damier, dogtooth, stitch, taper, thickset,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './passform.module.css';

export const metadata = {
  title: 'Passform: Maßschneiderei, Hamburg',
  description:
    'Passform cuts bespoke by hand in Hamburg. Four fittings, sixty-two hours, one pattern kept for life.',
};

/* Linen paper, dark ink, one rust that reads as thread. Pattern fields take
   `transparent` in the background slot, so the linen shows through the weave. */
const INK = '#191512';
const RUST = '#C1440E';
const GREY = '#9A9086';
const PALE = '#E5DFD4';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const STAGES = [
  { n: 'I', t: 'Measure', hrs: '2 h', d: 'Twenty-eight measurements, taken twice, and a long look at how you actually stand rather than how you stand when being measured.' },
  { n: 'II', t: 'Draft', hrs: '6 h', d: 'The pattern is drawn on brown paper by one cutter and kept forever. Your second suit begins from it and takes forty hours instead of sixty-two.' },
  { n: 'III', t: 'Baste', hrs: '14 h', d: 'A first fitting in white thread, deliberately ugly, so nobody is tempted to admire it instead of correcting it.' },
  { n: 'IV', t: 'Forward', hrs: '22 h', d: 'Canvas, padding stitch, and the shoulder. Second and third fittings sit here, a fortnight apart.' },
  { n: 'V', t: 'Finish', hrs: '18 h', d: 'Buttonholes, lining and the last fitting. If the collar is not right we take the whole thing back to the bench, and we have.' },
];

const CLOTHS = [
  ['Worsted, 11 oz', 'Huddersfield', 'Year-round, four seasons'],
  ['Flannel, 14 oz', 'Yorkshire', 'Autumn and winter, drapes and forgives'],
  ['Fresco, 9 oz', 'Huddersfield', 'High twist, open weave, for August'],
  ['Tweed, 16 oz', 'Outer Hebrides', 'Country only. Heavy, and it should be'],
  ['Linen, 8 oz', 'Kortrijk', 'Creases. That is the material working, not failing'],
];

const NUMBERS = [
  ['62 h', 'Hours, first suit'],
  ['4', 'Fittings'],
  ['28', 'Measurements'],
  ['1972', 'Bench opened'],
];

export default function PassformPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--linen': '#f5f1ea',
        '--ink': '#191512',
        '--rust': '#c1440e',
        '--grey': '#9a9086',
        '--pale': '#e5dfd4',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="linen,ink,rust,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Passform
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.how" data-edit-max="28" href="#how">How</a>
          <a data-edit="bar.cloth" data-edit-max="28" href="#cloth">Cloth</a>
          <a data-edit="bar.prices" data-edit-max="28" href="#prices">Prices</a>
          <a data-edit="bar.bench" data-edit-max="28" href="#bench">Bench</a>
        </nav>
        <span data-edit="bar.since" data-edit-max="60" className={s.since}>Maßschneiderei seit 1972</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={stitch}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={52}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Hamburg / Neuer Wall 44, Hinterhof</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              A pattern drawn
              <br />
              once and kept
              <br />
              <span>for the rest of it.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Bespoke, cut by hand, four fittings. Sixty-two hours the first
              time and forty every time after, because the hard part is already
              on paper with your name on it.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.passform-table"
            slug="passform-table"
            alt="A long tailor's cutting table covered with brown paper pattern pieces, shears and chalk"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Bench 1. The pattern for a coat begun in 1996 and altered eleven times.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ------------------------------------------------------------ HOW */}
        <section id="how" className={s.how} aria-labelledby="how-h">
          <h2 data-edit="how.h2" data-edit-max="60" className={s.h2} id="how-h">
            Five stages
          </h2>
          <ol className={s.stages}>
            {STAGES.map((x, i) => (
              <li key={x.n}>
                <span data-edit={`how.stN.${i}`} data-edit-max="60" className={s.stN}>{x.n}</span>
                <div>
                  <h3 data-edit={`how.title.${i}`} data-edit-max="40">{x.t}</h3>
                  <p data-edit={`how.body.${i}`} data-edit-max="240" data-edit-multiline>{x.d}</p>
                </div>
                <span data-edit={`how.stHrs.${i}`} data-edit-max="60" className={s.stHrs}>{x.hrs}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.passform-stand"
                slug="passform-stand"
                alt="A half-made jacket in canvas basted onto a tailor's dress stand"
              />
              <figcaption data-edit="how.caption" data-edit-max="120" data-edit-multiline>Stage III. White thread, on purpose.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.passform-chalk"
                slug="passform-chalk"
                alt="A close view of chalk marks and basting stitches on dark wool cloth"
              />
              <figcaption data-edit="how.caption2" data-edit-max="120" data-edit-multiline>Chalk survives one pressing. Say what you mean the first time.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ WEAVE BAND */}
        <section className={s.weaveBand} aria-hidden="true">
          <div data-edit-pattern="weaveBand.field" data-edit-roles="transparent,1,2,3" className={s.weaveField}>
            <TabbiedPattern
              pattern={damier}
              palette={['transparent', INK, RUST, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={3800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- CLOTH */}
        <section id="cloth" className={s.cloth} aria-labelledby="cloth-h">
          <div data-edit-pattern="cloth.field" data-edit-roles="transparent,3,4" className={s.clothField} aria-hidden="true">
            <TabbiedPattern
              pattern={bias}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={88}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.clothInner}>
            <h2 data-edit="cloth.h2" data-edit-max="60" className={s.h2} id="cloth-h">
              Cloth we keep on the shelf
            </h2>
            <p data-edit="cloth.note" data-edit-max="240" data-edit-multiline className={s.note}>
              About four hundred lengths in the room, and a merchant two streets
              away for everything else. We will talk you out of anything under
              nine ounces for a first suit.
            </p>
            <ol className={s.clothList}>
              {CLOTHS.map(([name, from, note], i) => (
                <li key={name}>
                  <span data-edit={`cloth.cName.${i}`} data-edit-max="60" className={s.cName}>{name}</span>
                  <span data-edit={`cloth.cFrom.${i}`} data-edit-max="60" className={s.cFrom}>{from}</span>
                  <span data-edit={`cloth.cNote.${i}`} data-edit-max="60" className={s.cNote}>{note}</span>
                </li>
              ))}
            </ol>
            <figure className={s.wide}>
              <Figure editId="photo.passform-threads"
                slug="passform-threads"
                alt="A wall of thread spools arranged by shade in a tailoring workroom"
              />
              <figcaption data-edit="cloth.caption" data-edit-max="120" data-edit-multiline>Silk thread, arranged by shade because the light changes.</figcaption>
            </figure>
          </div>
        </section>

        {/* --------------------------------------------------------- PRICES */}
        <section id="prices" className={s.prices} aria-labelledby="prices-h">
          <h2 data-edit="prices.h2" data-edit-max="60" className={s.h2} id="prices-h">
            Prices
          </h2>
          <ol className={s.priceList}>
            <li>
              <span data-edit="prices.text" data-edit-max="60">Two-piece suit</span>
              <span data-edit="prices.pFrom" data-edit-max="60" className={s.pFrom}>from €4,600</span>
              <span data-edit="prices.pNote" data-edit-max="60" className={s.pNote}>62 hours, four fittings, pattern kept</span>
            </li>
            <li>
              <span data-edit="prices.text2" data-edit-max="60">Repeat order</span>
              <span data-edit="prices.pFrom2" data-edit-max="60" className={s.pFrom}>from €3,400</span>
              <span data-edit="prices.pNote2" data-edit-max="60" className={s.pNote}>40 hours, two fittings, same pattern</span>
            </li>
            <li>
              <span data-edit="prices.text3" data-edit-max="60">Jacket alone</span>
              <span data-edit="prices.pFrom3" data-edit-max="60" className={s.pFrom}>from €3,200</span>
              <span data-edit="prices.pNote3" data-edit-max="60" className={s.pNote}>44 hours, three fittings</span>
            </li>
            <li>
              <span data-edit="prices.text4" data-edit-max="60">Overcoat</span>
              <span data-edit="prices.pFrom4" data-edit-max="60" className={s.pFrom}>from €5,100</span>
              <span data-edit="prices.pNote4" data-edit-max="60" className={s.pNote}>70 hours, four fittings</span>
            </li>
            <li>
              <span data-edit="prices.text5" data-edit-max="60">Alterations, our work</span>
              <span data-edit="prices.pFrom5" data-edit-max="60" className={s.pFrom}>free, forever</span>
              <span data-edit="prices.pNote5" data-edit-max="60" className={s.pNote}>Bodies change. The pattern is still here.</span>
            </li>
          </ol>
        </section>

        {/* ---------------------------------------------------------- BENCH */}
        <section id="bench" className={s.bench} aria-labelledby="bench-h">
          <div data-edit-pattern="bench.field" data-edit-roles="transparent,2,3" className={s.benchField} aria-hidden="true">
            <TabbiedPattern
              pattern={taper}
              palette={['transparent', RUST, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.benchInner}>
            <h2 data-edit="bench.h2" data-edit-max="60" className={s.h2} id="bench-h">
              Come and be measured
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="bench.term" data-edit-max="28">Workroom</dt>
                <dd data-edit="bench.body3" data-edit-max="200" data-edit-multiline>
                  Neuer Wall 44, Hinterhof
                  <br />
                  20354 Hamburg
                </dd>
              </div>
              <div>
                <dt data-edit="bench.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="bench.link" data-edit-max="28" href="mailto:mass@passform.example">mass@passform.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="bench.term3" data-edit-max="28">Appointments</dt>
                <dd data-edit="bench.body" data-edit-max="200" data-edit-multiline>Tue to Fri. Allow two hours for the first.</dd>
              </div>
              <div>
                <dt data-edit="bench.term4" data-edit-max="28">Waiting list</dt>
                <dd data-edit="bench.body2" data-edit-max="200" data-edit-multiline>Fourteen weeks to the first fitting.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three things a machine cannot do</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Not romance. Three specific operations that decide whether a coat hangs.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={damier}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5400}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.passform-tile-hanger-cutout" slug="passform-tile-hanger-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">The shoulder</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Pad stitched by hand so the canvas and the cloth move independently. A fused shoulder is flat on the hanger and flat on you.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={bias}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={6200}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.passform-tile-canvas-cutout" slug="passform-tile-canvas-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">The canvas</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Floating, not glued. It takes the shape of your chest over about a year, which is a feature and cannot be simulated.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={corduroy}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={4800}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.passform-tile-tape-cutout" slug="passform-tile-tape-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">The second fitting</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Where the coat stops being a size and starts being yours. Nothing measured at the start survives it unchanged.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">What we make besides suits</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Same bench, same pattern, smaller commitment. All prices before cloth.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Garment</span>
                <span data-edit="index.text2" data-edit-max="60">Hours</span>
                <span data-edit="index.text3" data-edit-max="60">Fittings</span>
                <span data-edit="index.text4" data-edit-max="60">From</span>
            </li>
              <li key="Overcoat">
                <span data-edit="index.text5" data-edit-max="60">Overcoat</span>
                <span data-edit="index.text6" data-edit-max="60">70</span>
                <span data-edit="index.text7" data-edit-max="60">4</span>
                <span data-edit="index.text8" data-edit-max="60">€5,100</span>
              </li>
              <li key="Odd jacket">
                <span data-edit="index.text9" data-edit-max="60">Odd jacket</span>
                <span data-edit="index.text10" data-edit-max="60">44</span>
                <span data-edit="index.text11" data-edit-max="60">3</span>
                <span data-edit="index.text12" data-edit-max="60">€3,200</span>
              </li>
              <li key="Trousers, alone">
                <span data-edit="index.text13" data-edit-max="60">Trousers, alone</span>
                <span data-edit="index.text14" data-edit-max="60">16</span>
                <span data-edit="index.text15" data-edit-max="60">2</span>
                <span data-edit="index.text16" data-edit-max="60">€1,150</span>
              </li>
              <li key="Waistcoat">
                <span data-edit="index.text17" data-edit-max="60">Waistcoat</span>
                <span data-edit="index.text18" data-edit-max="60">14</span>
                <span data-edit="index.text19" data-edit-max="60">2</span>
                <span data-edit="index.text20" data-edit-max="60">€980</span>
              </li>
              <li key="Dinner suit">
                <span data-edit="index.text21" data-edit-max="60">Dinner suit</span>
                <span data-edit="index.text22" data-edit-max="60">68</span>
                <span data-edit="index.text23" data-edit-max="60">4</span>
                <span data-edit="index.text24" data-edit-max="60">€5,400</span>
              </li>
              <li key="Alteration, our work">
                <span data-edit="index.text25" data-edit-max="60">Alteration, our work</span>
                <span data-edit="index.text26" data-edit-max="60">n/a</span>
                <span data-edit="index.text27" data-edit-max="60">As needed</span>
                <span data-edit="index.text28" data-edit-max="60">Free</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Before your first appointment</h2>
          <dl className={s.faqList}>
              <div key="What should I bring?">
                <dt data-edit="faq.term" data-edit-max="28">What should I bring?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>The shoes you will wear with it, and a jacket you already like, even if you like it for reasons you cannot articulate. Especially then.</dd>
              </div>
              <div key="How long does it take?">
                <dt data-edit="faq.term2" data-edit-max="28">How long does it take?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Fourteen weeks to the first fitting, and about six months to delivery. Repeat orders are half that because the pattern already exists.</dd>
              </div>
              <div key="Can I supply my own clot">
                <dt data-edit="faq.term3" data-edit-max="28">Can I supply my own cloth?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Yes, and we will tell you honestly if it is not enough or not suitable. Three and a half metres for a two-piece, more if it has a check.</dd>
              </div>
              <div key="What if I change shape?">
                <dt data-edit="faq.term4" data-edit-max="28">What if I change shape?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>We alter our own work free, for as long as the garment lasts. Bodies change; the pattern is still in the drawer.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={dogtooth}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={102}
              redrawInterval={4914}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Passform</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Maßschneiderei, Neuer Wall 44, Hamburg, seit 1972.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Making</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.how" data-edit-max="28" href="#how">Five stages</a>
              </li>
              <li>
                <a data-edit="footer.cloth" data-edit-max="28" href="#cloth">Cloth on the shelf</a>
              </li>
              <li>
                <a data-edit="footer.prices" data-edit-max="28" href="#prices">Prices</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Customers</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.bench" data-edit-max="28" href="#bench">Be measured</a>
              </li>
              <li>
                <a data-edit="footer.prices2" data-edit-max="28" href="#prices">Alterations</a>
              </li>
              <li>
                <a data-edit="footer.bench2" data-edit-max="28" href="#bench">Waiting list</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Neuer Wall 44, Hinterhof
              <br />
              20354 Hamburg
              <br />
              mass@passform.example
              <br />
              Tue to Fri, by appointment
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional tailoring house. Prices and times are invented.</p>
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
