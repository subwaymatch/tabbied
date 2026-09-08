import { TabbiedPattern } from 'tabbied/react';
import {
  corduroy, damier, plait, quilt, thickset, weave,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './meterware.module.css';

export const metadata = {
  title: 'Meterware: Weberei seit 1908, Vorarlberg',
  description:
    'Meterware weaves cloth by the metre in Vorarlberg. Forty-one qualities on the shelf, indigo dyed in the house, minimum order one metre.',
};

/* Ecru cloth, dark ink, one indigo. Every field takes `transparent` in the
   background slot so the ecru shows through the weave. */
const INK = '#14161F';
const INDIGO = '#2B3FAE';
const GREY = '#8E8A7E';
const PALE = '#DCD7C9';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const QUALITIES = [
  { art: '1104', name: 'Zwirnköper', comp: 'Cotton 100 %', weight: '340 g/m²', width: '150 cm', price: '€28 / m' },
  { art: '1140', name: 'Panamabindung', comp: 'Linen 60, cotton 40', weight: '260 g/m²', width: '150 cm', price: '€34 / m' },
  { art: '2011', name: 'Halbleinen grob', comp: 'Linen 55, cotton 45', weight: '420 g/m²', width: '140 cm', price: '€41 / m' },
  { art: '2208', name: 'Feinköper indigo', comp: 'Cotton 100 %', weight: '310 g/m²', width: '150 cm', price: '€38 / m' },
  { art: '3017', name: 'Wollflanell', comp: 'Wool 100 %', weight: '480 g/m²', width: '145 cm', price: '€62 / m' },
  { art: '3140', name: 'Doppelgewebe', comp: 'Wool 70, cotton 30', weight: '520 g/m²', width: '145 cm', price: '€71 / m' },
];

const HOUSE = [
  { n: '01', t: 'We dye before we weave', d: 'Yarn-dyed, not piece-dyed. It costs more, it fades in a way people like, and it is why our indigo goes grey rather than patchy.' },
  { n: '02', t: 'One metre is a real order', d: 'The minimum is one metre and always has been. A cutting length is not a nuisance; it is how people find out whether they want forty.' },
  { n: '03', t: 'Forty-one qualities, no seasons', d: 'The book does not change in spring. Articles are retired only when a yarn stops being made, and we announce it a year ahead.' },
  { n: '04', t: 'The loom is the limit', d: 'One hundred and fifty centimetres, because that is the reed. Anything wider is somebody else\'s mill and we will tell you which.' },
];

const NUMBERS = [
  ['1908', 'Weaving since'],
  ['41', 'Qualities in the book'],
  ['150 cm', 'Loom width'],
  ['1 m', 'Minimum order'],
];

export default function MeterwarePage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--ecru': '#efebe1',
        '--ink': '#14161f',
        '--indigo': '#2b3fae',
        '--grey': '#8e8a7e',
        '--pale': '#dcd7c9',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="ecru,ink,indigo,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          Meterware
          <i>Weberei, Vorarlberg</i>
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.book" data-edit-max="28" href="#book">The book</a>
          <a data-edit="bar.house" data-edit-max="28" href="#house">House rules</a>
          <a data-edit="bar.mill" data-edit-max="28" href="#mill">Mill</a>
          <a data-edit="bar.order" data-edit-max="28" href="#order">Order</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={weave}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={56}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Weberei seit 1908 / Bregenzerwald</p>
            <h1>
              Cloth by the metre,
              <br />
              and one metre
              <br />
              <span data-edit="hero.text" data-edit-max="60">is a real order.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Forty-one qualities, yarn-dyed in the house, woven on looms a
              hundred and fifty centimetres wide because that is the reed.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.meterware-loom"
            slug="meterware-loom"
            alt="A wide industrial loom mid-weave with warp threads stretched under even light"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Loom 4, article 2208. Eleven metres an hour, on a good day.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ----------------------------------------------------------- BOOK */}
        <section id="book" className={s.book} aria-labelledby="book-h">
          <h2 data-edit="book.h2" data-edit-max="60" className={s.h2} id="book-h">
            Six from the book
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span data-edit="book.text" data-edit-max="60">Art.</span>
              <span data-edit="book.text2" data-edit-max="60">Quality</span>
              <span data-edit="book.text3" data-edit-max="60">Composition</span>
              <span data-edit="book.text4" data-edit-max="60">Weight</span>
              <span data-edit="book.text5" data-edit-max="60">Width</span>
              <span data-edit="book.text6" data-edit-max="60">Price</span>
            </li>
            {QUALITIES.map((q, i) => (
              <li key={q.art}>
                <span data-edit={`book.art.${i}`} data-edit-max="60" className={s.art}>{q.art}</span>
                <span data-edit={`book.qname.${i}`} data-edit-max="60" className={s.qname}>{q.name}</span>
                <span data-edit={`book.text7.${i}`} data-edit-max="60">{q.comp}</span>
                <span data-edit={`book.num.${i}`} data-edit-max="60" className={s.num}>{q.weight}</span>
                <span data-edit={`book.num2.${i}`} data-edit-max="60" className={s.num}>{q.width}</span>
                <span data-edit={`book.price.${i}`} data-edit-max="60" className={s.price}>{q.price}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ WARP BAND */}
        <section className={s.warpBand} aria-hidden="true">
          <div data-edit-pattern="warpBand.field" data-edit-roles="transparent,2,1,3" className={s.warpField}>
            <TabbiedPattern
              pattern={plait}
              palette={['transparent', INDIGO, INK, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={3600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- HOUSE */}
        <section id="house" className={s.house} aria-labelledby="house-h">
          <div data-edit-pattern="house.field" data-edit-roles="transparent,3,4" className={s.houseField} aria-hidden="true">
            <TabbiedPattern
              pattern={corduroy}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={44}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.houseInner}>
            <h2 data-edit="house.h2" data-edit-max="60" className={s.h2} id="house-h">
              Four house rules
            </h2>
            <ol className={s.houseList}>
              {HOUSE.map((h, i) => (
                <li key={h.n}>
                  <span data-edit={`house.hN.${i}`} data-edit-max="60" className={s.hN}>{h.n}</span>
                  <h3 data-edit={`house.title.${i}`} data-edit-max="40">{h.t}</h3>
                  <p data-edit={`house.body.${i}`} data-edit-max="240" data-edit-multiline>{h.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.meterware-creel"
                  slug="meterware-creel"
                  alt="A warping creel filled with cones of indigo and undyed yarn"
                />
                <figcaption data-edit="house.caption" data-edit-max="120" data-edit-multiline>Creel, 384 ends. Set up takes longer than the weaving.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.meterware-rolls"
                  slug="meterware-rolls"
                  alt="Rolls of woven cloth stacked on end in a mill store"
                />
                <figcaption data-edit="house.caption2" data-edit-max="120" data-edit-multiline>The store. Nothing here is dyed after weaving.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- MILL */}
        <section id="mill" className={s.mill} aria-labelledby="mill-h">
          <h2 data-edit="mill.h2" data-edit-max="60" className={s.h2} id="mill-h">
            The mill
          </h2>
          <div className={s.millGrid}>
            <p data-edit="mill.big" data-edit-max="240" data-edit-multiline className={s.big}>
              Six looms, two warping frames, one indigo vat and eleven people,
              three of whom are the grandchildren of people who worked the same
              floor.
            </p>
            <div className={s.millCol}>
              <p data-edit="mill.body" data-edit-max="240" data-edit-multiline>
                The building is on the Bregenzerach because the water used to
                turn the wheel. It now cools the dye house, which is a less
                romantic job and a more useful one.
              </p>
              <p data-edit="mill.body2" data-edit-max="240" data-edit-multiline>
                We sell direct and to about sixty makers. There is no wholesale
                price and no retail price. There is a price, and it is on the
                list above.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure editId="photo.meterware-swatch"
              slug="meterware-swatch"
              alt="An open swatch book of woven cloth samples on a plain table"
            />
            <figcaption data-edit="mill.caption" data-edit-max="120" data-edit-multiline>The book. Posted free anywhere, once, to anyone who asks.</figcaption>
          </figure>
        </section>

        {/* ---------------------------------------------------------- ORDER */}
        <section id="order" className={s.order} aria-labelledby="order-h">
          <div data-edit-pattern="order.field" data-edit-roles="transparent,2,3" className={s.orderField} aria-hidden="true">
            <TabbiedPattern
              pattern={damier}
              palette={['transparent', INDIGO, GREY]}
              fit="grid"
              cellSize={78}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.orderInner}>
            <h2 data-edit="order.h2" data-edit-max="60" className={s.h2} id="order-h">
              Ordering
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="order.term" data-edit-max="28">Mill</dt>
                <dd>
                  Achstrasse 8
                  <br />
                  6870 Bezau, Vorarlberg
                </dd>
              </div>
              <div>
                <dt data-edit="order.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="order.link" data-edit-max="28" href="mailto:weberei@meterware.example">weberei@meterware.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="order.term3" data-edit-max="28">Swatch book</dt>
                <dd data-edit="order.body" data-edit-max="200" data-edit-multiline>Free, once per address. Ask by post or by mail.</dd>
              </div>
              <div>
                <dt data-edit="order.term4" data-edit-max="28">Lead time</dt>
                <dd data-edit="order.body2" data-edit-max="200" data-edit-multiline>From stock, three days. Woven to order, five weeks.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three decisions before the loom</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>By the time the shuttle moves, the cloth has already been decided.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={weave}
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
                  <Figure editId="photo.meterware-tile-cone-cutout" slug="meterware-tile-cone-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">The yarn</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Count, twist and origin. A high-twist cotton and a low-twist cotton at the same weight make two completely different cloths.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={plait}
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
                  <Figure editId="photo.meterware-tile-skein-cutout" slug="meterware-tile-skein-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">The dye</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Yarn dyed, in the house, before warping. It costs more and it is the only way to get an indigo that goes grey rather than patchy.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={thickset}
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
                  <Figure editId="photo.meterware-tile-cloth-cutout" slug="meterware-tile-cloth-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">The sett</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Ends per centimetre. Too open and it grins; too close and it boards. This is the number that takes the longest to get right.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Finishing</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>What happens after the loom. Every article is finished the same way every time, which is why repeat orders match.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Step</span>
                <span data-edit="index.text2" data-edit-max="60">Method</span>
                <span data-edit="index.text3" data-edit-max="60">Duration</span>
                <span data-edit="index.text4" data-edit-max="60">Effect</span>
            </li>
              <li key="Mending">
                <span data-edit="index.text5" data-edit-max="60">Mending</span>
                <span data-edit="index.text6" data-edit-max="60">By hand, on a frame</span>
                <span data-edit="index.text7" data-edit-max="60">2 h per 30 m</span>
                <span data-edit="index.text8" data-edit-max="60">Faults marked and repaired</span>
              </li>
              <li key="Scour">
                <span data-edit="index.text9" data-edit-max="60">Scour</span>
                <span data-edit="index.text10" data-edit-max="60">Warm, mild</span>
                <span data-edit="index.text11" data-edit-max="60">40 min</span>
                <span data-edit="index.text12" data-edit-max="60">Removes size and oil</span>
              </li>
              <li key="Full">
                <span data-edit="index.text13" data-edit-max="60">Full</span>
                <span data-edit="index.text14" data-edit-max="60">Mechanical, wool only</span>
                <span data-edit="index.text15" data-edit-max="60">20 to 90 min</span>
                <span data-edit="index.text16" data-edit-max="60">Density and handle</span>
              </li>
              <li key="Dry">
                <span data-edit="index.text17" data-edit-max="60">Dry</span>
                <span data-edit="index.text18" data-edit-max="60">Frame, no tension</span>
                <span data-edit="index.text19" data-edit-max="60">12 h</span>
                <span data-edit="index.text20" data-edit-max="60">Stable width</span>
              </li>
              <li key="Press">
                <span data-edit="index.text21" data-edit-max="60">Press</span>
                <span data-edit="index.text22" data-edit-max="60">Steam, one pass</span>
                <span data-edit="index.text23" data-edit-max="60">15 min</span>
                <span data-edit="index.text24" data-edit-max="60">Surface only</span>
              </li>
              <li key="Measure">
                <span data-edit="index.text25" data-edit-max="60">Measure</span>
                <span data-edit="index.text26" data-edit-max="60">Twice, by two people</span>
                <span data-edit="index.text27" data-edit-max="60">n/a</span>
                <span data-edit="index.text28" data-edit-max="60">Printed on the ticket</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Ordering questions</h2>
          <dl className={s.faqList}>
              <div key="Will the next roll match">
                <dt data-edit="faq.term" data-edit-max="28">Will the next roll match?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Within a batch, yes. Across batches there is a shade difference we will show you before shipping. Order the whole quantity at once if it matters.</dd>
              </div>
              <div key="Do you sell to the trade">
                <dt data-edit="faq.term2" data-edit-max="28">Do you sell to the trade?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>There is no trade price and no retail price. There is a price, and it is the one on the list.</dd>
              </div>
              <div key="Can you weave my design?">
                <dt data-edit="faq.term3" data-edit-max="28">Can you weave my design?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Above four hundred metres, yes, on 150 cm. Below that it is our book or another mill, and we will tell you which mill.</dd>
              </div>
              <div key="Will it shrink?">
                <dt data-edit="faq.term4" data-edit-max="28">Will it shrink?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Everything is finished before sale, so about one per cent. Wash the sample we send you before you cut forty metres.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={quilt}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={108}
              redrawInterval={4956}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Meterware</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Weberei seit 1908, Achstrasse 8, Bezau, Vorarlberg.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Cloth</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.book" data-edit-max="28" href="#book">Six from the book</a>
              </li>
              <li>
                <a data-edit="footer.house" data-edit-max="28" href="#house">House rules</a>
              </li>
              <li>
                <a data-edit="footer.mill" data-edit-max="28" href="#mill">The mill</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Ordering</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.order" data-edit-max="28" href="#order">Ordering</a>
              </li>
              <li>
                <a data-edit="footer.order2" data-edit-max="28" href="#order">Swatch book</a>
              </li>
              <li>
                <a data-edit="footer.order3" data-edit-max="28" href="#order">Lead times</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Achstrasse 8
              <br />
              6870 Bezau, Vorarlberg
              <br />
              weberei@meterware.example
              <br />
              Minimum order one metre
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional weaving mill. Prices and times are invented.</p>
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
