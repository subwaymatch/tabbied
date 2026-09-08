import { TabbiedPattern } from 'tabbied/react';
import {
  lantern, quire, recession, tesserae, veil, windowpane,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './sammlung-weiss.module.css';

export const metadata = {
  title: 'Sammlung Weiss: Private Collection, Winterthur',
  description:
    'The Weiss collection holds 411 works of postwar abstraction. Open eleven days a year, by ballot, twelve visitors at a time.',
};

/* Achromatic except for the paper's warmth. No accent colour anywhere: the
   pattern fields, all on a `transparent` ground, are the only figure. */
const INK = '#111111';
const STONE = '#6E6A60';
const PALE = '#CFCBBF';
const LIGHT = '#EAE7DD';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STONE;
const TILE_B = PALE;


const ROOMS = [
  { n: 'I', name: 'The long room', hangs: '14 works', note: 'North light, no artificial source. Closed on days when the meter reads under 180 lux at noon.' },
  { n: 'II', name: 'The small room', hangs: '6 works', note: 'One bench. The hang changes twice a year and is never announced in advance.' },
  { n: 'III', name: 'The stone room', hangs: '3 works', note: 'Sculpture only. The floor is the original 1962 screed and it is not to be walked on in heels.' },
  { n: 'IV', name: 'The store', hangs: '388 works', note: 'Not open. Researchers may request a viewing of up to four works, in writing, twice a year.' },
];

const HOLDINGS = [
  ['Painting', '186', '1948 to 1979'],
  ['Works on paper', '154', '1946 to 1988'],
  ['Sculpture', '38', '1951 to 1974'],
  ['Photography', '27', '1955 to 1969'],
  ['Editions', '6', '1962 to 1970'],
];

const DAYS = [
  ['14.03', 'Room I and II', 'Ballot closes 01.02'],
  ['11.04', 'Room I and II', 'Ballot closes 01.03'],
  ['09.05', 'Room I, II and III', 'Ballot closes 01.04'],
  ['13.06', 'Room I and II', 'Ballot closes 01.05'],
  ['12.09', 'Room I, II and III', 'Ballot closes 01.08'],
  ['10.10', 'Room I and II', 'Ballot closes 01.09'],
];

export default function SammlungWeissPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--bone': '#efede6',
        '--ink': '#111111',
        '--stone': '#6e6a60',
        '--pale': '#cfcbbf',
        '--light': '#eae7dd',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="bone,ink,stone,pale,light"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..600&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Sammlung Weiss
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.collection" data-edit-max="28" href="#collection">Collection</a>
          <a data-edit="bar.rooms" data-edit-max="28" href="#rooms">Rooms</a>
          <a data-edit="bar.visiting" data-edit-max="28" href="#visiting">Visiting</a>
          <a data-edit="bar.research" data-edit-max="28" href="#research">Research</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={lantern}
              palette={['transparent', PALE, STONE]}
              fit="grid"
              cellSize={168}
              redrawInterval={7200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Winterthur / 411 works / open eleven days a year</p>
            <h1 data-edit="hero.title" data-edit-max="70">
              A collection is
              <br />
              a long argument
              <br />
              with one taste.
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Postwar abstraction, bought slowly between 1961 and 1994 by two
              people who never once agreed in public.
            </p>
          </div>
        </section>

        {/* The gallery room, full width and tall. It is the only image on the
            page that is allowed to be big. */}
        <figure className={s.bleed}>
          <Figure editId="photo.weiss-room"
            slug="weiss-room"
            alt="An empty gallery room under a skylight with bare walls and a pale timber floor"
            priority
          />
        </figure>

        {/* ---------------------------------------------------- COLLECTION */}
        <section id="collection" className={s.collection} aria-labelledby="collection-h">
          <h2 data-edit="collection.h2" data-edit-max="60" className={s.h2} id="collection-h">
            What is here
          </h2>
          <div className={s.colGrid}>
            <ol className={s.holdings}>
              {HOLDINGS.map(([kind, n, span], i) => (
                <li key={kind}>
                  <span data-edit={`collection.hKind.${i}`} data-edit-max="60" className={s.hKind}>{kind}</span>
                  <span data-edit={`collection.hN.${i}`} data-edit-max="60" className={s.hN}>{n}</span>
                  <span data-edit={`collection.hSpan.${i}`} data-edit-max="60" className={s.hSpan}>{span}</span>
                </li>
              ))}
            </ol>
            <div className={s.colText}>
              <p data-edit="collection.big" data-edit-max="240" data-edit-multiline className={s.big}>
                Elsa and Martin Weiss bought their first painting in 1961 with
                money set aside for a car, and their last in 1994, three weeks
                before Martin died.
              </p>
              <p data-edit="collection.body" data-edit-max="240" data-edit-multiline>
                They collected against the market rather than with it: the
                unfashionable years of artists who later became fashionable, and
                a stubborn number of artists who never did. Roughly a third of
                the collection is by people with no monograph.
              </p>
              <p data-edit="collection.body2" data-edit-max="240" data-edit-multiline>
                Nothing has been sold. Nothing will be. The foundation deed
                forbids deaccession in terms a lawyer described, admiringly, as
                unhelpfully absolute.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ HANG BAND */}
        <section className={s.hangBand} aria-hidden="true">
          <div data-edit-pattern="hangBand.field" data-edit-roles="transparent,1,2,3" className={s.hangField}>
            <TabbiedPattern
              pattern={windowpane}
              palette={['transparent', INK, STONE, PALE]}
              fit="grid"
              cellSize={136}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- ROOMS */}
        <section id="rooms" className={s.rooms} aria-labelledby="rooms-h">
          <div data-edit-pattern="rooms.field" data-edit-roles="transparent,3,4" className={s.roomsField} aria-hidden="true">
            <TabbiedPattern
              pattern={quire}
              palette={['transparent', PALE, LIGHT]}
              fit="grid"
              cellSize={112}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.roomsInner}>
            <h2 data-edit="rooms.h2" data-edit-max="60" className={s.h2} id="rooms-h">
              Four rooms
            </h2>
            <ol className={s.roomList}>
              {ROOMS.map((r, i) => (
                <li key={r.n}>
                  <span data-edit={`rooms.rN.${i}`} data-edit-max="60" className={s.rN}>{r.n}</span>
                  <div>
                    <h3 data-edit={`rooms.title.${i}`} data-edit-max="40">{r.name}</h3>
                    <p data-edit={`rooms.body.${i}`} data-edit-max="240" data-edit-multiline>{r.note}</p>
                  </div>
                  <span data-edit={`rooms.rHangs.${i}`} data-edit-max="60" className={s.rHangs}>{r.hangs}</span>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.weiss-plinth"
                  slug="weiss-plinth"
                  alt="A rough grey stone sculpture on a plain white plinth in a bare room"
                />
                <figcaption data-edit="rooms.caption" data-edit-max="120" data-edit-multiline>Room III. One work, one bench, no label.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.weiss-crate"
                  slug="weiss-crate"
                  alt="A plywood art crate standing closed in an empty white room"
                />
                <figcaption data-edit="rooms.caption2" data-edit-max="120" data-edit-multiline>Arrived Tuesday. Opens Friday, once it has acclimatised.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- VISITING */}
        <section id="visiting" className={s.visiting} aria-labelledby="visiting-h">
          <h2 data-edit="visiting.h2" data-edit-max="60" className={s.h2} id="visiting-h">
            Eleven days
          </h2>
          <p data-edit="visiting.note" data-edit-max="240" data-edit-multiline className={s.note}>
            Twelve visitors per day, ninety minutes each, allocated by ballot.
            Entry is free. There is no shop, no café, and no photography.
          </p>
          <ol className={s.days}>
            {DAYS.map(([d, what, ballot], i) => (
              <li key={d}>
                <span data-edit={`visiting.dDate.${i}`} data-edit-max="60" className={s.dDate}>{d}</span>
                <span data-edit={`visiting.dWhat.${i}`} data-edit-max="60" className={s.dWhat}>{what}</span>
                <span data-edit={`visiting.dBallot.${i}`} data-edit-max="60" className={s.dBallot}>{ballot}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- RESEARCH */}
        <section id="research" className={s.research} aria-labelledby="research-h">
          <div data-edit-pattern="research.field" data-edit-roles="transparent,2,3" className={s.resField} aria-hidden="true">
            <TabbiedPattern
              pattern={recession}
              palette={['transparent', STONE, PALE]}
              fit="grid"
              cellSize={140}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.resInner}>
            <h2 data-edit="research.h2" data-edit-max="60" className={s.h2} id="research-h">
              Research and enquiries
            </h2>
            <div className={s.resGrid}>
              <p data-edit="research.big" data-edit-max="240" data-edit-multiline className={s.big}>
                The full catalogue is on paper, in one copy, in the reading room.
                We have been meaning to digitise it since 2009.
              </p>
              <dl>
                <div>
                  <dt data-edit="research.term" data-edit-max="28">Foundation</dt>
                  <dd data-edit="research.body3" data-edit-max="200" data-edit-multiline>
                    Rychenbergstrasse 210
                    <br />
                    8400 Winterthur
                  </dd>
                </div>
                <div>
                  <dt data-edit="research.term2" data-edit-max="28">Write</dt>
                  <dd>
                    <a data-edit="research.link" data-edit-max="28" href="mailto:stiftung@sammlung-weiss.example">
                      stiftung@sammlung-weiss.example
                    </a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="research.term3" data-edit-max="28">Ballot</dt>
                  <dd data-edit="research.body" data-edit-max="200" data-edit-multiline>One entry per person per day. Results by post.</dd>
                </div>
                <div>
                  <dt data-edit="research.term4" data-edit-max="28">Loans</dt>
                  <dd data-edit="research.body2" data-edit-max="200" data-edit-multiline>Two a year, to public institutions, for exhibitions with a catalogue.</dd>
                </div>
              </dl>
            </div>
            <figure className={s.wide}>
              <Figure editId="photo.weiss-racks"
                slug="weiss-racks"
                alt="Sliding storage racks holding framed works in a windowless art store"
              />
              <figcaption data-edit="research.caption" data-edit-max="120" data-edit-multiline>The store. Three hundred and eighty-eight works, waiting their turn.</figcaption>
            </figure>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three conditions the works live under</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Not policy for its own sake. Each of these is the reason something has survived seventy years.</p>
          <div className={s.tileGrid}>
              <article key="I">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,2,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={veil}
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
                  <Figure editId="photo.sammlung-weiss-tile-frame-cutout" slug="sammlung-weiss-tile-frame-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>I</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Light</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Fifty lux on works on paper, a hundred and fifty on paintings, and eleven days of opening a year. The store is the default state; display is the exception.</p>
              </article>
              <article key="II">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,2,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={lantern}
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
                  <Figure editId="photo.sammlung-weiss-tile-logger-cutout" slug="sammlung-weiss-tile-logger-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>II</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Air</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Nineteen degrees, fifty per cent, moved slowly. The plant is oversized so it never has to work hard, which is also why it has never failed.</p>
              </article>
              <article key="III">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,2,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={recession}
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
                  <Figure editId="photo.sammlung-weiss-tile-gloves-cutout" slug="sammlung-weiss-tile-gloves-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>III</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Handling</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Two people, cotton, no jewellery, and a written condition report before and after every movement, including the ones inside the building.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Conservation record</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Treatments carried out since 2015, listed because the deed requires it and because researchers ask.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Year</span>
                <span data-edit="index.text2" data-edit-max="60">Work</span>
                <span data-edit="index.text3" data-edit-max="60">Treatment</span>
                <span data-edit="index.text4" data-edit-max="60">Conservator</span>
            </li>
              <li key="2025">
                <span data-edit="index.text5" data-edit-max="60">2025</span>
                <span data-edit="index.text6" data-edit-max="60">Painting, FA 118</span>
                <span data-edit="index.text7" data-edit-max="60">Consolidation, local</span>
                <span data-edit="index.text8" data-edit-max="60">R. Frei, Basel</span>
              </li>
              <li key="2024">
                <span data-edit="index.text9" data-edit-max="60">2024</span>
                <span data-edit="index.text10" data-edit-max="60">Works on paper, 14 items</span>
                <span data-edit="index.text11" data-edit-max="60">Rehousing, deacidification</span>
                <span data-edit="index.text12" data-edit-max="60">M. Bähler, Bern</span>
              </li>
              <li key="2023">
                <span data-edit="index.text13" data-edit-max="60">2023</span>
                <span data-edit="index.text14" data-edit-max="60">Sculpture, FA 019</span>
                <span data-edit="index.text15" data-edit-max="60">Surface clean, wax</span>
                <span data-edit="index.text16" data-edit-max="60">Studio Lang, Zürich</span>
              </li>
              <li key="2021">
                <span data-edit="index.text17" data-edit-max="60">2021</span>
                <span data-edit="index.text18" data-edit-max="60">Painting, FA 072</span>
                <span data-edit="index.text19" data-edit-max="60">Varnish removal</span>
                <span data-edit="index.text20" data-edit-max="60">R. Frei, Basel</span>
              </li>
              <li key="2019">
                <span data-edit="index.text21" data-edit-max="60">2019</span>
                <span data-edit="index.text22" data-edit-max="60">Photographs, 27 items</span>
                <span data-edit="index.text23" data-edit-max="60">Cold storage, rehoused</span>
                <span data-edit="index.text24" data-edit-max="60">In house</span>
              </li>
              <li key="2016">
                <span data-edit="index.text25" data-edit-max="60">2016</span>
                <span data-edit="index.text26" data-edit-max="60">Painting, FA 004</span>
                <span data-edit="index.text27" data-edit-max="60">Structural, tear repair</span>
                <span data-edit="index.text28" data-edit-max="60">R. Frei, Basel</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Practical questions</h2>
          <dl className={s.faqList}>
              <div key="How does the ballot work">
                <dt data-edit="faq.term" data-edit-max="28">How does the ballot work?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>One entry per person per day, by post or by mail, closing six weeks ahead. Twelve names are drawn and answered by post. There is no waiting list.</dd>
              </div>
              <div key="Can I see a specific wor">
                <dt data-edit="faq.term2" data-edit-max="28">Can I see a specific work?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>If it is catalogued and not on display, yes, twice a year, in writing, with a reason. Uncatalogued material we cannot retrieve reliably and we say so.</dd>
              </div>
              <div key="Why is entry free?">
                <dt data-edit="faq.term3" data-edit-max="28">Why is entry free?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Because the deed says so. Elsa Weiss thought charging for a private collection was a category error and left no mechanism to reverse it.</dd>
              </div>
              <div key="Do you lend?">
                <dt data-edit="faq.term4" data-edit-max="28">Do you lend?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Two loans a year, to public institutions, for exhibitions with a catalogue. Nothing travels in January or August.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,3,2" className={s.codaField}>
            <TabbiedPattern
              pattern={tesserae}
              palette={['transparent', PALE, STONE]}
              fit="grid"
              cellSize={100}
              redrawInterval={4900}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Sammlung Weiss</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>A private collection of 411 works at Rychenbergstrasse 210, Winterthur.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Collection</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.collection" data-edit-max="28" href="#collection">What is here</a>
              </li>
              <li>
                <a data-edit="footer.rooms" data-edit-max="28" href="#rooms">Four rooms</a>
              </li>
              <li>
                <a data-edit="footer.research" data-edit-max="28" href="#research">Research</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Visiting</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.visiting" data-edit-max="28" href="#visiting">Eleven days</a>
              </li>
              <li>
                <a data-edit="footer.visiting2" data-edit-max="28" href="#visiting">The ballot</a>
              </li>
              <li>
                <a data-edit="footer.research2" data-edit-max="28" href="#research">Loans</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Rychenbergstrasse 210
              <br />
              8400 Winterthur
              <br />
              stiftung@sammlung-weiss.example
              <br />
              Entry free, by ballot
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional foundation. Prices and times are invented.</p>
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
