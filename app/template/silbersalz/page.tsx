import { TabbiedPattern } from 'tabbied/react';
import {
  dustfall, grain, grainfield, halftone, misprint, peppering,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './silbersalz.module.css';

export const metadata = {
  title: 'Silbersalz: Fotolabor, Leipzig',
  description:
    'Silbersalz develops film and makes silver gelatin prints. Hand processing, hand printing, and a price list that has not changed since 2019.',
};

/* Bone paper, near-black ink, one safelight red. Every field takes
   `transparent` in the background slot. */
const INK = '#101010';
const RED = '#C8102E';
const GREY = '#8A8880';
const PALE = '#D9D6CC';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const DEVELOP = [
  { fmt: '135', proc: 'B&W, hand tank', dev: 'ID-11, 1+1', turn: '3 days', price: '€9' },
  { fmt: '135', proc: 'C-41, dip and dunk', dev: 'Standard', turn: '1 day', price: '€8' },
  { fmt: '120', proc: 'B&W, hand tank', dev: 'ID-11 or Rodinal', turn: '3 days', price: '€10' },
  { fmt: '120', proc: 'E-6, hand line', dev: 'Standard', turn: '5 days', price: '€14' },
  { fmt: '4×5', proc: 'B&W, tray', dev: 'By agreement', turn: '5 days', price: '€6 / sheet' },
  { fmt: '8×10', proc: 'B&W, tray', dev: 'By agreement', turn: '7 days', price: '€14 / sheet' },
];

const PRINTS = [
  { size: '18 × 24 cm', paper: 'Fibre, glossy', price: '€28' },
  { size: '24 × 30 cm', paper: 'Fibre, glossy or matt', price: '€38' },
  { size: '30 × 40 cm', paper: 'Fibre, glossy or matt', price: '€54' },
  { size: '40 × 50 cm', paper: 'Fibre, matt only', price: '€86' },
  { size: '50 × 60 cm', paper: 'Fibre, matt only', price: '€128' },
];

const HOUSE = [
  { n: '01', t: 'Everything by hand', d: 'One person, one tank, one film at a time for black and white. It is slower than a machine and the negatives come back the way you exposed them.' },
  { n: '02', t: 'We keep your negatives dry', d: 'Sleeved the same day, in polyester, never PVC. Collected or posted flat, never rolled.' },
  { n: '03', t: 'Test strip first, always', d: 'Every print starts with a strip and a look under the light. Nobody here has ever printed to a number.' },
  { n: '04', t: 'The list does not move', d: 'Prices last changed in 2019 and will change again when the paper does, not when the accountant asks.' },
];

export default function SilbersalzPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--bone': '#edebe4',
        '--ink': '#101010',
        '--red': '#c8102e',
        '--grey': '#8a8880',
        '--pale': '#d9d6cc',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="bone,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.link" data-edit-format="emphasis" data-edit-max="30" className={s.mark} href="#top">
          Silbersalz
          <i>Fotolabor, Leipzig</i>
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.develop" data-edit-max="28" href="#develop">Developing</a>
          <a data-edit="bar.print" data-edit-max="28" href="#print">Printing</a>
          <a data-edit="bar.house" data-edit-max="28" href="#house">House rules</a>
          <a data-edit="bar.counter" data-edit-max="28" href="#counter">Counter</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={halftone}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={40}
              redrawInterval={3000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Hand processing / seit 1998</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              One film at a
              <br />
              time, in a tank,
              <br />
              <span>by somebody.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Black and white, colour negative and transparency. Silver gelatin
              prints made under an enlarger by a person who looks at them.
            </p>
          </div>
        </section>

        {/* The darkroom, full width. Red safelight against a bone page: the
            one place the accent colour is allowed to fill the frame. */}
        <figure className={s.bleed}>
          <Figure editId="photo.silbersalz-darkroom"
            slug="silbersalz-darkroom"
            alt="A darkroom under a red safelight with developing trays in a row and an enlarger"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Darkroom 1. Three trays, one clock, no windows.</figcaption>
        </figure>

        {/* -------------------------------------------------------- DEVELOP */}
        <section id="develop" className={s.develop} aria-labelledby="develop-h">
          <h2 data-edit="develop.h2" data-edit-max="60" className={s.h2} id="develop-h">
            Developing
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span data-edit="develop.text" data-edit-max="60">Format</span>
              <span data-edit="develop.text2" data-edit-max="60">Process</span>
              <span data-edit="develop.text3" data-edit-max="60">Developer</span>
              <span data-edit="develop.text4" data-edit-max="60">Turnaround</span>
              <span data-edit="develop.text5" data-edit-max="60">Price</span>
            </li>
            {DEVELOP.map((d, i) => (
              <li key={`${d.fmt}-${d.proc}`}>
                <span data-edit={`develop.fmt.${i}`} data-edit-max="60" className={s.fmt}>{d.fmt}</span>
                <span data-edit={`develop.proc.${i}`} data-edit-max="60" className={s.proc}>{d.proc}</span>
                <span data-edit={`develop.dev.${i}`} data-edit-max="60" className={s.dev}>{d.dev}</span>
                <span data-edit={`develop.turn.${i}`} data-edit-max="60" className={s.turn}>{d.turn}</span>
                <span data-edit={`develop.price.${i}`} data-edit-max="60" className={s.price}>{d.price}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------- GRAIN BAND */}
        <section className={s.grainBand} aria-hidden="true">
          <div data-edit-pattern="grainBand.field" data-edit-roles="transparent,1,2,3" className={s.grainField}>
            <TabbiedPattern
              pattern={grainfield}
              palette={['transparent', INK, RED, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={2400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ----------------------------------------------------------- PRINT */}
        <section id="print" className={s.print} aria-labelledby="print-h">
          <div data-edit-pattern="print.field" data-edit-roles="transparent,3,4" className={s.printField} aria-hidden="true">
            <TabbiedPattern
              pattern={dustfall}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={54}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.printInner}>
            <h2 data-edit="print.h2" data-edit-max="60" className={s.h2} id="print-h">
              Silver gelatin prints
            </h2>
            <div className={s.printGrid}>
              <ol className={s.prices}>
                {PRINTS.map((p, i) => (
                  <li key={p.size}>
                    <span data-edit={`print.pSize.${i}`} data-edit-max="60" className={s.pSize}>{p.size}</span>
                    <span data-edit={`print.pPaper.${i}`} data-edit-max="60" className={s.pPaper}>{p.paper}</span>
                    <span data-edit={`print.pPrice.${i}`} data-edit-max="60" className={s.pPrice}>{p.price}</span>
                  </li>
                ))}
              </ol>
              <div className={s.printText}>
                <p data-edit="print.big" data-edit-max="240" data-edit-multiline className={s.big}>
                  Every print begins with a test strip and ends with somebody
                  standing under the inspection light deciding whether it is
                  finished.
                </p>
                <p data-edit="print.body" data-edit-max="240" data-edit-multiline>
                  Prices are for a straight print with normal dodging and
                  burning. Anything that needs more than four operations on one
                  sheet is quoted, and we will tell you before we start.
                </p>
                <p data-edit="print.body2" data-edit-max="240" data-edit-multiline>
                  Fibre paper only. We stopped stocking resin coated in 2014 and
                  have not been asked for it since 2017.
                </p>
              </div>
            </div>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.silbersalz-contacts"
                  slug="silbersalz-contacts"
                  alt="Contact sheets spread on a glowing light table with a loupe"
                />
                <figcaption data-edit="print.caption" data-edit-max="120" data-edit-multiline>Contacts come with every roll, whether you asked or not.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.silbersalz-enlarger"
                  slug="silbersalz-enlarger"
                  alt="A large format enlarger standing on a bench with lens and bellows"
                />
                <figcaption data-edit="print.caption2" data-edit-max="120" data-edit-multiline>Enlarger 2, 5×7, condenser head. Aligned in March.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- HOUSE */}
        <section id="house" className={s.house} aria-labelledby="house-h">
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
          <figure className={s.wide}>
            <Figure editId="photo.silbersalz-drying"
              slug="silbersalz-drying"
              alt="Strips of developed film hanging to dry from a line with weighted clips"
            />
            <figcaption data-edit="house.caption" data-edit-max="120" data-edit-multiline>Drying cabinet. Two hours, no heat, no hurry.</figcaption>
          </figure>
        </section>

        {/* -------------------------------------------------------- COUNTER */}
        <section id="counter" className={s.counter} aria-labelledby="counter-h">
          <div data-edit-pattern="counter.field" data-edit-roles="transparent,2,3" className={s.counterField} aria-hidden="true">
            <TabbiedPattern
              pattern={peppering}
              palette={['transparent', RED, GREY]}
              fit="grid"
              cellSize={38}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.counterInner}>
            <h2 data-edit="counter.h2" data-edit-max="60" className={s.h2} id="counter-h">
              The counter
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="counter.term" data-edit-max="28">Lab</dt>
                <dd data-edit="counter.body3" data-edit-max="200" data-edit-multiline>
                  Karl-Liebknecht-Str. 62
                  <br />
                  04275 Leipzig
                </dd>
              </div>
              <div>
                <dt data-edit="counter.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="counter.link" data-edit-max="28" href="mailto:labor@silbersalz.example">labor@silbersalz.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="counter.term3" data-edit-max="28">Open</dt>
                <dd data-edit="counter.body" data-edit-max="200" data-edit-multiline>Tue to Fri 11.00 to 18.00, Sat 11.00 to 15.00</dd>
              </div>
              <div>
                <dt data-edit="counter.term4" data-edit-max="28">Post</dt>
                <dd data-edit="counter.body2" data-edit-max="200" data-edit-multiline>Send film in a padded envelope. We return it the same way.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three things that ruin a negative</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>None of them happens in the camera, and all of them are avoidable.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={peppering}
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
                  <Figure editId="photo.silbersalz-tile-film-cutout" slug="silbersalz-tile-film-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Heat in transit</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>A film left in a car in July shifts before it is ever developed. Post it, or bring it; do not leave it on the parcel shelf for a fortnight.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dustfall}
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
                  <Figure editId="photo.silbersalz-tile-tank-cutout" slug="silbersalz-tile-tank-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Time in the tank</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Thirty seconds either way at twenty degrees is nothing. Three minutes is a different film. This is why we do one at a time.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={halftone}
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
                  <Figure editId="photo.silbersalz-tile-reel-cutout" slug="silbersalz-tile-reel-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Water</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Drying marks are the single most common fault we see on home-developed film, and they are permanent. Final rinse, wetting agent, hang, leave it.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">What we stock at the counter</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Small quantities, at roughly what we pay, because a lab with no film in it is a strange place.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Stock</span>
                <span data-edit="index.text2" data-edit-max="60">Format</span>
                <span data-edit="index.text3" data-edit-max="60">Speed</span>
                <span data-edit="index.text4" data-edit-max="60">Price</span>
            </li>
              <li key="HP5 Plus">
                <span data-edit="index.text5" data-edit-max="60">HP5 Plus</span>
                <span data-edit="index.text6" data-edit-max="60">135-36, 120</span>
                <span data-edit="index.text7" data-edit-max="60">400</span>
                <span data-edit="index.text8" data-edit-max="60">€7.50</span>
              </li>
              <li key="FP4 Plus">
                <span data-edit="index.text9" data-edit-max="60">FP4 Plus</span>
                <span data-edit="index.text10" data-edit-max="60">135-36, 120</span>
                <span data-edit="index.text11" data-edit-max="60">125</span>
                <span data-edit="index.text12" data-edit-max="60">€7.20</span>
              </li>
              <li key="Delta 3200">
                <span data-edit="index.text13" data-edit-max="60">Delta 3200</span>
                <span data-edit="index.text14" data-edit-max="60">135-36</span>
                <span data-edit="index.text15" data-edit-max="60">3200</span>
                <span data-edit="index.text16" data-edit-max="60">€10.90</span>
              </li>
              <li key="Portra 400">
                <span data-edit="index.text17" data-edit-max="60">Portra 400</span>
                <span data-edit="index.text18" data-edit-max="60">135-36, 120</span>
                <span data-edit="index.text19" data-edit-max="60">400</span>
                <span data-edit="index.text20" data-edit-max="60">€14.80</span>
              </li>
              <li key="Ektachrome E100">
                <span data-edit="index.text21" data-edit-max="60">Ektachrome E100</span>
                <span data-edit="index.text22" data-edit-max="60">135-36</span>
                <span data-edit="index.text23" data-edit-max="60">100</span>
                <span data-edit="index.text24" data-edit-max="60">€18.40</span>
              </li>
              <li key="Ilford MG fibre">
                <span data-edit="index.text25" data-edit-max="60">Ilford MG fibre</span>
                <span data-edit="index.text26" data-edit-max="60">24 × 30, 50 sheets</span>
                <span data-edit="index.text27" data-edit-max="60">n/a</span>
                <span data-edit="index.text28" data-edit-max="60">€96</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Sending film in</h2>
          <dl className={s.faqList}>
              <div key="How should I post it?">
                <dt data-edit="faq.term" data-edit-max="28">How should I post it?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>A padded envelope, canisters in a freezer bag, and a note with your name in the bag rather than only on the outside.</dd>
              </div>
              <div key="Do you push and pull?">
                <dt data-edit="faq.term2" data-edit-max="28">Do you push and pull?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Two stops either way on black and white, one on colour negative. Tell us on the note; we cannot tell by looking.</dd>
              </div>
              <div key="Will you scan as well?">
                <dt data-edit="faq.term3" data-edit-max="28">Will you scan as well?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Yes, at two sizes, but we would rather make you a print. A scan is a proposal; a print is a decision.</dd>
              </div>
              <div key="What happens to a blank ">
                <dt data-edit="faq.term4" data-edit-max="28">What happens to a blank roll?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>We tell you, we do not charge you, and we say what we think went wrong. It is nearly always the film not catching on the take-up spool.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={grain}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={4928}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Silbersalz</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Fotolabor, Karl-Liebknecht-Str. 62, Leipzig, seit 1998.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Services</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.develop" data-edit-max="28" href="#develop">Developing</a>
              </li>
              <li>
                <a data-edit="footer.print" data-edit-max="28" href="#print">Silver gelatin prints</a>
              </li>
              <li>
                <a data-edit="footer.house" data-edit-max="28" href="#house">House rules</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Counter</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.counter" data-edit-max="28" href="#counter">The counter</a>
              </li>
              <li>
                <a data-edit="footer.counter2" data-edit-max="28" href="#counter">Send film by post</a>
              </li>
              <li>
                <a data-edit="footer.develop2" data-edit-max="28" href="#develop">Turnarounds</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Karl-Liebknecht-Str. 62
              <br />
              04275 Leipzig
              <br />
              labor@silbersalz.example
              <br />
              Tue to Fri 11.00 to 18.00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional photographic lab. Prices and times are invented.</p>
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
