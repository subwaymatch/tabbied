import { TabbiedPattern } from 'tabbied/react';
import {
  bokeh, drybrush, glazing, grainfield, scumble, tinting, toning,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './cobalt-works.module.css';

export const metadata = {
  title: 'Cobalt Works: Dry Pigment, Sheffield',
  description:
    'Cobalt Works has milled dry pigment in Sheffield since 1911. Eleven blues, forty earths, ground to order and sold by the kilo.',
};

/* Bone paper, near-black ink, one saturated cobalt. Every pattern field takes
   `transparent` in its background slot so the paper carries through. */
const INK = '#14161C';
const BLUE = '#0033CC';
const STEEL = '#7E8494';
const PALE = '#DEDBD0';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = PALE;


const PIGMENTS = [
  { ref: 'PB 28', name: 'Cobalt Blue', family: 'Blue', origin: 'Synthetic oxide', grind: '4 µm', price: '£142 / kg' },
  { ref: 'PB 29', name: 'Ultramarine', family: 'Blue', origin: 'Synthetic', grind: '3 µm', price: '£38 / kg' },
  { ref: 'PB 27', name: 'Prussian Blue', family: 'Blue', origin: 'Synthetic', grind: '2 µm', price: '£46 / kg' },
  { ref: 'PB 15', name: 'Phthalo Blue', family: 'Blue', origin: 'Organic', grind: '1 µm', price: '£52 / kg' },
  { ref: 'PBr 7', name: 'Raw Umber, Cyprus', family: 'Earth', origin: 'Natural, washed', grind: '9 µm', price: '£18 / kg' },
  { ref: 'PY 43', name: 'Yellow Ochre, Roussillon', family: 'Earth', origin: 'Natural, levigated', grind: '11 µm', price: '£24 / kg' },
  { ref: 'PR 102', name: 'Red Oxide, Sinopia', family: 'Earth', origin: 'Natural, calcined', grind: '8 µm', price: '£21 / kg' },
  { ref: 'PBk 9', name: 'Bone Black', family: 'Black', origin: 'Calcined bone', grind: '5 µm', price: '£29 / kg' },
];

const STEPS = [
  { n: 'I', t: 'Source', d: 'Earths from six quarries we have bought from for longer than any of us has worked here. Synthetics from two makers, both named on the label.' },
  { n: 'II', t: 'Wash and levigate', d: 'Natural earths are settled through four tanks over eleven days. What comes out of the last tank is what we sell.' },
  { n: 'III', t: 'Mill', d: 'Roller mill for the earths, jet mill for anything under 3 µm. Grind is measured on every batch and printed on the tin.' },
  { n: 'IV', t: 'Draw down', d: 'Every batch is drawn down beside the retained standard in daylight. If a colourist can see the difference, the batch goes back.' },
];

const FACTS = [
  ['1911', 'Milling since'],
  ['11', 'Blues in stock'],
  ['4 µm', 'Finest routine grind'],
  ['1 kg', 'Smallest order'],
];

export default function CobaltWorksPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--bone': '#f6f4ee',
        '--ink': '#14161c',
        '--blue': '#0033cc',
        '--steel': '#7e8494',
        '--pale': '#dedbd0',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="bone,ink,blue,steel,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.link" data-edit-format="emphasis" data-edit-max="40" className={s.mark} href="#top">
          Cobalt Works
          <i>Dry pigment, Sheffield</i>
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.stock" data-edit-max="28" href="#stock">Stock</a>
          <a data-edit="bar.making" data-edit-max="28" href="#making">Making</a>
          <a data-edit="bar.matching" data-edit-max="28" href="#matching">Matching</a>
          <a data-edit="bar.order" data-edit-max="28" href="#order">Order</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={glazing}
              palette={['transparent', BLUE, STEEL]}
              fit="grid"
              cellSize={140}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Est. 1911 / Attercliffe</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              Colour is a
              <br />
              <span>material</span> before
              <br />
              it is an effect.
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              We mill dry pigment and sell it by the kilo, unbound and
              unadulterated. What you do with it afterwards is your business.
            </p>
          </div>
        </section>

        {/* The loudest image on the page and the reason the site exists: raw
            pigment, full width, no crop apology. */}
        <figure className={s.bleed}>
          <Figure editId="photo.cobalt-powder"
            slug="cobalt-powder"
            alt="Heaps of intense dry blue pigment powder on a pale worktop"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>PB 28, batch 26-114. Ground to 4 µm on Tuesday.</figcaption>
        </figure>

        <dl className={s.facts}>
          {FACTS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ---------------------------------------------------------- STOCK */}
        <section id="stock" className={s.stock} aria-labelledby="stock-h">
          <h2 data-edit="stock.h2" data-edit-max="60" className={s.h2} id="stock-h">
            In stock this week
          </h2>
          <ol className={s.list}>
            <li className={s.listHead} aria-hidden="true">
              <span data-edit="stock.text" data-edit-max="60">Index</span>
              <span data-edit="stock.text2" data-edit-max="60">Pigment</span>
              <span data-edit="stock.text3" data-edit-max="60">Family</span>
              <span data-edit="stock.text4" data-edit-max="60">Origin</span>
              <span data-edit="stock.text5" data-edit-max="60">Grind</span>
              <span data-edit="stock.text6" data-edit-max="60">Price</span>
            </li>
            {PIGMENTS.map((p, i) => (
              <li key={p.ref}>
                <span data-edit={`stock.ref.${i}`} data-edit-max="60" className={s.ref}>{p.ref}</span>
                <span data-edit={`stock.pname.${i}`} data-edit-max="60" className={s.pname}>{p.name}</span>
                <span data-edit={`stock.fam.${i}`} data-edit-max="60" className={p.family === 'Blue' ? s.fam : undefined}>{p.family}</span>
                <span data-edit={`stock.text7.${i}`} data-edit-max="60">{p.origin}</span>
                <span data-edit={`stock.num.${i}`} data-edit-max="60" className={s.num}>{p.grind}</span>
                <span data-edit={`stock.num2.${i}`} data-edit-max="60" className={s.num}>{p.price}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ WASH BAND */}
        <section className={s.washBand} aria-hidden="true">
          <div data-edit-pattern="washBand.field" data-edit-roles="transparent,2,3,4" className={s.washField}>
            <TabbiedPattern
              pattern={tinting}
              palette={['transparent', BLUE, STEEL, PALE]}
              fit="grid"
              cellSize={136}
              redrawInterval={3400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div data-edit-pattern="making.field" data-edit-roles="transparent,3,4" className={s.makingField} aria-hidden="true">
            <TabbiedPattern
              pattern={scumble}
              palette={['transparent', STEEL, PALE]}
              fit="grid"
              cellSize={96}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.makingInner}>
            <h2 data-edit="making.h2" data-edit-max="60" className={s.h2} id="making-h">
              Four steps, eleven days
            </h2>
            <ol className={s.steps}>
              {STEPS.map((x, i) => (
                <li key={x.n}>
                  <span data-edit={`making.stepN.${i}`} data-edit-max="60" className={s.stepN}>{x.n}</span>
                  <h3 data-edit={`making.title.${i}`} data-edit-max="40">{x.t}</h3>
                  <p data-edit={`making.body.${i}`} data-edit-max="240" data-edit-multiline>{x.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.cobalt-mill"
                  slug="cobalt-mill"
                  alt="An industrial roller mill grinding blue pigment in a workshop"
                />
                <figcaption data-edit="making.caption" data-edit-max="120" data-edit-multiline>Number 3 roller mill, in service since 1957.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.cobalt-drums"
                  slug="cobalt-drums"
                  alt="Rows of sealed steel drums on pallets in a bright warehouse"
                />
                <figcaption data-edit="making.caption2" data-edit-max="120" data-edit-multiline>Bay 2. Everything here is sold by weight, not by story.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- MATCHING */}
        <section id="matching" className={s.matching} aria-labelledby="matching-h">
          <h2 data-edit="matching.h2" data-edit-max="60" className={s.h2} id="matching-h">
            Matching
          </h2>
          <div className={s.matchGrid}>
            <p data-edit="matching.big" data-edit-max="240" data-edit-multiline className={s.big}>
              Send a chip, a fragment, or a photograph of a wall you cannot
              remove. We will mill against it and send three drawdowns before
              you commit to a kilo.
            </p>
            <div className={s.matchCol}>
              <p data-edit="matching.body" data-edit-max="240" data-edit-multiline>
                Conservation work is quoted separately and always includes the
                analysis: what we think the original was, how confident we are,
                and what we would use instead if the original is now illegal.
              </p>
              <p data-edit="matching.body2" data-edit-max="240" data-edit-multiline>
                We do not tint to a screen value. If your reference is a hex
                code, we will ask you for something physical first.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure editId="photo.cobalt-chips"
              slug="cobalt-chips"
              alt="A fan of painted colour chip cards ranging from pale to deep blue"
            />
            <figcaption data-edit="matching.caption" data-edit-max="120" data-edit-multiline>Standards for PB 28, drawn down in daylight, kept for forty years.</figcaption>
          </figure>
        </section>

        {/* ---------------------------------------------------------- ORDER */}
        <section id="order" className={s.order} aria-labelledby="order-h">
          <div data-edit-pattern="order.field" data-edit-roles="transparent,2,3" className={s.orderField} aria-hidden="true">
            <TabbiedPattern
              pattern={drybrush}
              palette={['transparent', BLUE, STEEL]}
              fit="grid"
              cellSize={72}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.orderInner}>
            <h2 data-edit="order.h2" data-edit-max="60" className={s.h2} id="order-h">
              Ordering
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="order.term" data-edit-max="28">Works</dt>
                <dd data-edit="order.body3" data-edit-max="200" data-edit-multiline>
                  Effingham Lane, Attercliffe
                  <br />
                  Sheffield S9 2QP
                </dd>
              </div>
              <div>
                <dt data-edit="order.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="order.link" data-edit-max="28" href="mailto:mill@cobaltworks.example">mill@cobaltworks.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="order.term3" data-edit-max="28">Counter</dt>
                <dd data-edit="order.body" data-edit-max="200" data-edit-multiline>Mon to Thu, 08.00 to 16.00. Bring a container.</dd>
              </div>
              <div>
                <dt data-edit="order.term4" data-edit-max="28">Post</dt>
                <dd data-edit="order.body2" data-edit-max="200" data-edit-multiline>1 kg minimum, 25 kg maximum per parcel.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three ways a pigment goes wrong</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Not adulteration, which is rare. These are the everyday faults that make a batch unusable.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={bokeh}
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
                  <Figure editId="photo.cobalt-works-tile-grind-cutout" slug="cobalt-works-tile-grind-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Grind drift</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Two microns coarser and the same pigment reads paler and chalkier. Grind is measured on every batch and printed on the tin.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={grainfield}
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
                  <Figure editId="photo.cobalt-works-tile-moisture-cutout" slug="cobalt-works-tile-moisture-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Moisture</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Earths take up water and cake. Warehouse bays are checked weekly and anything above six per cent goes back through the dryer.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={glazing}
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
                  <Figure editId="photo.cobalt-works-tile-settling-cutout" slug="cobalt-works-tile-settling-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Settling</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>A tinted mix separates in the tin. That is the pigment behaving, not failing, and it is why we sell dry and let you bind it.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Binders we stock</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Sold alongside the pigment because people ask, and because the wrong binder wastes good colour.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Binder</span>
                <span data-edit="index.text2" data-edit-max="60">For</span>
                <span data-edit="index.text3" data-edit-max="60">Unit</span>
                <span data-edit="index.text4" data-edit-max="60">Price</span>
            </li>
              <li key="Linseed, cold pressed">
                <span data-edit="index.text5" data-edit-max="60">Linseed, cold pressed</span>
                <span data-edit="index.text6" data-edit-max="60">Oil paint</span>
                <span data-edit="index.text7" data-edit-max="60">1 L</span>
                <span data-edit="index.text8" data-edit-max="60">£24</span>
              </li>
              <li key="Stand oil">
                <span data-edit="index.text9" data-edit-max="60">Stand oil</span>
                <span data-edit="index.text10" data-edit-max="60">Glazes</span>
                <span data-edit="index.text11" data-edit-max="60">500 ml</span>
                <span data-edit="index.text12" data-edit-max="60">£19</span>
              </li>
              <li key="Gum arabic, solution">
                <span data-edit="index.text13" data-edit-max="60">Gum arabic, solution</span>
                <span data-edit="index.text14" data-edit-max="60">Watercolour</span>
                <span data-edit="index.text15" data-edit-max="60">500 ml</span>
                <span data-edit="index.text16" data-edit-max="60">£16</span>
              </li>
              <li key="Rabbit skin glue">
                <span data-edit="index.text17" data-edit-max="60">Rabbit skin glue</span>
                <span data-edit="index.text18" data-edit-max="60">Distemper, size</span>
                <span data-edit="index.text19" data-edit-max="60">1 kg</span>
                <span data-edit="index.text20" data-edit-max="60">£31</span>
              </li>
              <li key="Casein powder">
                <span data-edit="index.text21" data-edit-max="60">Casein powder</span>
                <span data-edit="index.text22" data-edit-max="60">Limewash, secco</span>
                <span data-edit="index.text23" data-edit-max="60">1 kg</span>
                <span data-edit="index.text24" data-edit-max="60">£28</span>
              </li>
              <li key="Acrylic dispersion">
                <span data-edit="index.text25" data-edit-max="60">Acrylic dispersion</span>
                <span data-edit="index.text26" data-edit-max="60">Modern media</span>
                <span data-edit="index.text27" data-edit-max="60">1 L</span>
                <span data-edit="index.text28" data-edit-max="60">£22</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Ordering questions</h2>
          <dl className={s.faqList}>
              <div key="Is one kilo really the m">
                <dt data-edit="faq.term" data-edit-max="28">Is one kilo really the minimum?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Yes, and it always has been. A cutting quantity is how people find out whether they want twenty-five.</dd>
              </div>
              <div key="Can you match a historic">
                <dt data-edit="faq.term2" data-edit-max="28">Can you match a historic colour?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Send a chip or a fragment. We will mill against it and send three drawdowns, with a note on what we think the original was.</dd>
              </div>
              <div key="Are your earths natural?">
                <dt data-edit="faq.term3" data-edit-max="28">Are your earths natural?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>The ones marked natural are washed and levigated only. The synthetics say so on the label, with the maker named.</dd>
              </div>
              <div key="Do you ship abroad?">
                <dt data-edit="faq.term4" data-edit-max="28">Do you ship abroad?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Within Europe, yes, up to 25 kg a parcel. Some pigments are restricted in some countries and we check before taking money.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={toning}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={118}
              redrawInterval={5026}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Cobalt Works</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Dry pigment milled at Effingham Lane, Sheffield, since 1911.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Pigment</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.stock" data-edit-max="28" href="#stock">In stock</a>
              </li>
              <li>
                <a data-edit="footer.making" data-edit-max="28" href="#making">How it is made</a>
              </li>
              <li>
                <a data-edit="footer.matching" data-edit-max="28" href="#matching">Matching</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Trade</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.order" data-edit-max="28" href="#order">Ordering</a>
              </li>
              <li>
                <a data-edit="footer.order2" data-edit-max="28" href="#order">Counter hours</a>
              </li>
              <li>
                <a data-edit="footer.order3" data-edit-max="28" href="#order">Post and carriage</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Effingham Lane, Attercliffe
              <br />
              Sheffield S9 2QP
              <br />
              mill@cobaltworks.example
              <br />
              Mon to Thu, 08.00 to 16.00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional pigment mill. Prices and times are invented.</p>
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
