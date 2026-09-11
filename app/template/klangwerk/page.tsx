import { TabbiedPattern } from 'tabbied/react';
import {
  curl, dotwash, flux, maelstrom, neon, ripplering, spark, streaking,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './klangwerk.module.css';

export const metadata = {
  title: 'Klangwerk: Studio für elektroakustische Musik',
  description:
    'Klangwerk is an electroacoustic studio in Leipzig. Two rooms, one anechoic chamber, residencies for composers working with fixed media and live electronics.',
};

/* Near-black ground, pale type, one acid green. Every pattern field takes
   `transparent` in the background slot and reads as room tone. */
const PALE = '#E9E9E4';
const GREEN = '#00E58A';
const STEEL = '#5A6068';
const PANEL = '#14161A';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = PALE;
const TILE_B = STEEL;


const ROOMS = [
  {
    id: 'I',
    name: 'Studio Eins',
    kind: 'Ambisonic room, 3rd order',
    body: 'Sixteen speakers on a half-sphere, decoded in the room and nowhere else. Built in 1998 around a floor that was already there and has never been levelled.',
    specs: [
      ['Speakers', '16, half-sphere'],
      ['Decode', '3rd order, in-room'],
      ['Floor', '38 m², floating'],
      ['Noise floor', '22 dB(A)'],
    ],
  },
  {
    id: 'II',
    name: 'Studio Zwei',
    kind: 'Stereo and quad, tape',
    body: 'The old room. Two Studer machines, a patchbay that predates most of the people using it, and a hard 4 kHz notch in the ceiling nobody has ever managed to fix.',
    specs: [
      ['Format', 'Stereo, quad'],
      ['Tape', '2 × Studer A80'],
      ['Patch', '208 points, bantam'],
      ['Floor', '24 m²'],
    ],
  },
  {
    id: 'III',
    name: 'Reflexionsarmer Raum',
    kind: 'Anechoic chamber',
    body: 'Free-field above 90 Hz. Used for impulse capture, instrument recording and, once a year, a concert for eleven people who sit very still.',
    specs: [
      ['Cutoff', '90 Hz'],
      ['Wedges', '0.9 m, glass wool'],
      ['Volume', '96 m³'],
      ['Access', 'Booked in half-days'],
    ],
  },
];

const RESIDENCIES = [
  { period: 'Jan to Mar', name: 'Ada Køhler', work: 'Fixed media, 8 channels', place: 'Copenhagen' },
  { period: 'Apr to Jun', name: 'Tomás Reiter', work: 'Live electronics and cello', place: 'Vienna' },
  { period: 'Jul to Sep', name: 'Nour El-Sayed', work: 'Field recording, ambisonic', place: 'Cairo' },
  { period: 'Oct to Dec', name: 'Mira Halvorsen', work: 'Tape and feedback systems', place: 'Bergen' },
];

const SERIES = [
  ['24.09', 'Reihe 41 / I', 'Køhler, new work for 16 channels', 'Studio Eins', '20.00'],
  ['22.10', 'Reihe 41 / II', 'Reiter, cello and live electronics', 'Studio Eins', '20.00'],
  ['19.11', 'Reihe 41 / III', 'Tape night: four pieces, no interval', 'Studio Zwei', '21.00'],
  ['17.12', 'Reihe 41 / IV', 'Eleven listeners, anechoic', 'Kammer', '19.00'],
];

export default function KlangwerkPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--void': '#08090b',
        '--pale': '#e9e9e4',
        '--green': '#00e58a',
        '--steel': '#5a6068',
        '--panel': '#14161a',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="void,pale,green,steel,panel"
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
          Klangwerk
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.rooms" data-edit-max="28" href="#rooms">Räume</a>
          <a data-edit="bar.residencies" data-edit-max="28" href="#residencies">Residencies</a>
          <a data-edit="bar.series" data-edit-max="28" href="#series">Reihe</a>
          <a data-edit="bar.apply" data-edit-max="28" href="#apply">Apply</a>
        </nav>
        <span data-edit="bar.hz" data-edit-max="60" className={s.hz}>90 Hz to 20 kHz</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={flux}
              palette={['transparent', GREEN, STEEL]}
              fit="grid"
              cellSize={150}
              redrawInterval={3000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Studio für elektroakustische Musik / Leipzig / seit 1998</p>
          <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
            A room is an
            <br />
            instrument you
            <br />
            <span>cannot pack away.</span>
          </h1>
          <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
            Three listening spaces, four residencies a year, and a concert
            series that has never once started late.
          </p>
        </section>

        {/* Full-bleed plate. On a dark page the photograph is the brightest
            thing on the screen, so it gets the whole width and a long crop. */}
        <figure className={s.bleed}>
          <Figure editId="photo.klangwerk-desk"
            slug="klangwerk-desk"
            alt="A large analogue mixing desk in a darkened studio lit by a single green indicator glow"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Studio Zwei, 02.40. Reel two of four.</figcaption>
        </figure>

        {/* --------------------------------------------------------- ROOMS */}
        <section id="rooms" className={s.rooms} aria-labelledby="rooms-h">
          <div className={s.secHead}>
            <span data-edit="rooms.text" data-edit-max="60">01</span>
            <h2 data-edit="rooms.title" data-edit-max="60" id="rooms-h">Three rooms</h2>
          </div>
          <div className={s.roomList}>
            {ROOMS.map((r, i) => (
              <article key={r.id}>
                <p data-edit={`rooms.rId.${i}`} data-edit-max="240" data-edit-multiline className={s.rId}>{r.id}</p>
                <div>
                  <h3 data-edit={`rooms.title2.${i}`} data-edit-max="40">{r.name}</h3>
                  <p data-edit={`rooms.rKind.${i}`} data-edit-max="240" data-edit-multiline className={s.rKind}>{r.kind}</p>
                  <p data-edit={`rooms.rBody.${i}`} data-edit-max="240" data-edit-multiline className={s.rBody}>{r.body}</p>
                </div>
                <dl className={s.rSpecs}>
                  {r.specs.map(([k, v], i2) => (
                    <div key={k}>
                      <dt data-edit={`rooms.term.${i}.${i2}`} data-edit-max="28">{k}</dt>
                      <dd data-edit={`rooms.body.${i}.${i2}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.klangwerk-modular"
                slug="klangwerk-modular"
                alt="A wall of modular synthesiser panels with patch cables, lit low"
              />
              <figcaption data-edit="rooms.caption" data-edit-max="120" data-edit-multiline>The wall in Studio Zwei. Patched by whoever is in.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.klangwerk-chamber"
                slug="klangwerk-chamber"
                alt="The interior of an anechoic chamber, wedge foam on every surface"
              />
              <figcaption data-edit="rooms.caption2" data-edit-max="120" data-edit-multiline>Free field above 90 Hz. Bring a jumper.</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------------------------------------------- TONE BAND */}
        <section className={s.tone} aria-hidden="true">
          <div data-edit-pattern="tone.field" data-edit-roles="transparent,2,1,3" className={s.toneField}>
            <TabbiedPattern
              pattern={spark}
              palette={['transparent', GREEN, PALE, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={2600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------- RESIDENCIES */}
        <section id="residencies" className={s.res} aria-labelledby="res-h">
          <div data-edit-pattern="residencies.field" data-edit-roles="transparent,3,2" className={s.resField} aria-hidden="true">
            <TabbiedPattern
              pattern={curl}
              palette={['transparent', STEEL, GREEN]}
              fit="grid"
              cellSize={104}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.resInner}>
            <div className={s.secHead}>
              <span data-edit="residencies.text" data-edit-max="60">02</span>
              <h2 data-edit="residencies.title" data-edit-max="60" id="res-h">Residencies, 2026</h2>
            </div>
            <p data-edit="residencies.note" data-edit-max="240" data-edit-multiline className={s.note}>
              Three months, one room, a small fee and no obligation to produce
              anything. Applications open each September and close when the
              inbox becomes unmanageable.
            </p>
            <ol className={s.resList}>
              {RESIDENCIES.map((r, i) => (
                <li key={r.name}>
                  <span data-edit={`residencies.rPeriod.${i}`} data-edit-max="60" className={s.rPeriod}>{r.period}</span>
                  <span data-edit={`residencies.rName.${i}`} data-edit-max="60" className={s.rName}>{r.name}</span>
                  <span data-edit={`residencies.rWork.${i}`} data-edit-max="60" className={s.rWork}>{r.work}</span>
                  <span data-edit={`residencies.rPlace.${i}`} data-edit-max="60" className={s.rPlace}>{r.place}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- SERIES */}
        <section id="series" className={s.series} aria-labelledby="series-h">
          <div className={s.secHead}>
            <span data-edit="series.text" data-edit-max="60">03</span>
            <h2 data-edit="series.title" data-edit-max="60" id="series-h">Reihe 41</h2>
          </div>
          <ol className={s.dates}>
            {SERIES.map(([date, no, what, room, time], i) => (
              <li key={no}>
                <span data-edit={`series.dDate.${i}`} data-edit-max="60" className={s.dDate}>{date}</span>
                <span data-edit={`series.dNo.${i}`} data-edit-max="60" className={s.dNo}>{no}</span>
                <span data-edit={`series.dWhat.${i}`} data-edit-max="60" className={s.dWhat}>{what}</span>
                <span data-edit={`series.dRoom.${i}`} data-edit-max="60" className={s.dRoom}>{room}</span>
                <span data-edit={`series.dTime.${i}`} data-edit-max="60" className={s.dTime}>{time}</span>
              </li>
            ))}
          </ol>
          <figure className={s.wide}>
            <Figure editId="photo.klangwerk-tape"
              slug="klangwerk-tape"
              alt="A reel-to-reel tape machine on a rack in a dark control room"
            />
            <figcaption data-edit="series.caption" data-edit-max="120" data-edit-multiline>A80 number two. Aligned every Monday, whether it needs it or not.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- APPLY */}
        <section id="apply" className={s.apply} aria-labelledby="apply-h">
          <div data-edit-pattern="apply.field" data-edit-roles="transparent,2,3,1" className={s.applyField} aria-hidden="true">
            <TabbiedPattern
              pattern={maelstrom}
              palette={['transparent', GREEN, STEEL, PALE]}
              fit="grid"
              cellSize={96}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.applyInner}>
            <h2 data-edit="apply.title" data-edit-max="60" id="apply-h">Ask for a room</h2>
            <div className={s.applyGrid}>
              <p data-edit="apply.big" data-edit-max="240" data-edit-multiline className={s.big}>
                Send a link to something you have made and a paragraph about
                what you want the room for. No proposal template, no budget
                narrative, no letters of support.
              </p>
              <dl>
                <div>
                  <dt data-edit="apply.term" data-edit-max="28">Write</dt>
                  <dd>
                    <a data-edit="apply.link" data-edit-max="28" href="mailto:raum@klangwerk.example">raum@klangwerk.example</a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="apply.term2" data-edit-max="28">Studio</dt>
                  <dd data-edit="apply.body3" data-edit-max="200" data-edit-multiline>
                    Karl-Heine-Str. 41, Halle 4
                    <br />
                    04229 Leipzig
                  </dd>
                </div>
                <div>
                  <dt data-edit="apply.term3" data-edit-max="28">Day rate</dt>
                  <dd data-edit="apply.body" data-edit-max="200" data-edit-multiline>€90 Studio Eins, €60 Zwei, €140 Kammer</dd>
                </div>
                <div>
                  <dt data-edit="apply.term4" data-edit-max="28">Residents</dt>
                  <dd data-edit="apply.body2" data-edit-max="200" data-edit-multiline>Free, with a key</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">What the rooms are actually for</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Three ways of working that the building supports and a laptop does not.</p>
          <div className={s.tileGrid}>
              <article key="I">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,1,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={ripplering}
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
                  <Figure editId="photo.klangwerk-tile-monitor-cutout" slug="klangwerk-tile-monitor-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>I</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Hearing in space</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Sixteen speakers on a half-sphere means a sound can be put somewhere and left there. Most composers spend the first week just walking around.</p>
              </article>
              <article key="II">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,1,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dotwash}
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
                  <Figure editId="photo.klangwerk-tile-cans-cutout" slug="klangwerk-tile-cans-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>II</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Hearing without a room</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>The anechoic chamber removes the argument. What you hear is the source, which is uncomfortable and extremely useful.</p>
              </article>
              <article key="III">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,1,3" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={streaking}
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
                  <Figure editId="photo.klangwerk-tile-tape-cutout" slug="klangwerk-tile-tape-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>III</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Hearing on tape</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Two Studers, because a tape delay that you can reach into behaves differently from one you can undo.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Available on request</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Kept in the store, signed out on a card, returned before the next resident arrives.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Item</span>
                <span data-edit="index.text2" data-edit-max="60">Count</span>
                <span data-edit="index.text3" data-edit-max="60">Detail</span>
                <span data-edit="index.text4" data-edit-max="60">Condition</span>
            </li>
              <li key="Neumann KM 184">
                <span data-edit="index.text5" data-edit-max="60">Neumann KM 184</span>
                <span data-edit="index.text6" data-edit-max="60">8</span>
                <span data-edit="index.text7" data-edit-max="60">Matched pairs</span>
                <span data-edit="index.text8" data-edit-max="60">Good</span>
              </li>
              <li key="Schoeps CMC with caps">
                <span data-edit="index.text9" data-edit-max="60">Schoeps CMC with caps</span>
                <span data-edit="index.text10" data-edit-max="60">6</span>
                <span data-edit="index.text11" data-edit-max="60">Cardioid, omni, fig-8</span>
                <span data-edit="index.text12" data-edit-max="60">Excellent</span>
              </li>
              <li key="DPA 4060 lavalier">
                <span data-edit="index.text13" data-edit-max="60">DPA 4060 lavalier</span>
                <span data-edit="index.text14" data-edit-max="60">12</span>
                <span data-edit="index.text15" data-edit-max="60">For contact and internal</span>
                <span data-edit="index.text16" data-edit-max="60">Good</span>
              </li>
              <li key="Hydrophone, own build">
                <span data-edit="index.text17" data-edit-max="60">Hydrophone, own build</span>
                <span data-edit="index.text18" data-edit-max="60">4</span>
                <span data-edit="index.text19" data-edit-max="60">Aquarian element</span>
                <span data-edit="index.text20" data-edit-max="60">Serviceable</span>
              </li>
              <li key="Contact mic, own build">
                <span data-edit="index.text21" data-edit-max="60">Contact mic, own build</span>
                <span data-edit="index.text22" data-edit-max="60">20</span>
                <span data-edit="index.text23" data-edit-max="60">Piezo, potted</span>
                <span data-edit="index.text24" data-edit-max="60">Variable</span>
              </li>
              <li key="Tape, 1/4 inch">
                <span data-edit="index.text25" data-edit-max="60">Tape, 1/4 inch</span>
                <span data-edit="index.text26" data-edit-max="60">40 reels</span>
                <span data-edit="index.text27" data-edit-max="60">SM900, used</span>
                <span data-edit="index.text28" data-edit-max="60">Bulk erased</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Before you apply</h2>
          <dl className={s.faqList}>
              <div key="Do I need to be a compos">
                <dt data-edit="faq.term" data-edit-max="28">Do I need to be a composer?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>No. We have had a sound designer, two sculptors, an ornithologist and a person who makes maps of noise complaints. The room does not care.</dd>
              </div>
              <div key="Is there a concert at th">
                <dt data-edit="faq.term2" data-edit-max="28">Is there a concert at the end?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Only if you want one. About half of residents present something in Reihe 41 and the other half leave with a hard drive, which is equally fine.</dd>
              </div>
              <div key="Can I bring my own equip">
                <dt data-edit="faq.term3" data-edit-max="28">Can I bring my own equipment?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Yes, and you can leave it plugged in for three months. Nothing is patched out overnight because somebody else has the room tomorrow.</dd>
              </div>
              <div key="Is there accommodation?">
                <dt data-edit="faq.term4" data-edit-max="28">Is there accommodation?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>A flat above the varnish store, one bedroom, no lift. It is included, and it is loud on Fridays.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,1,3" className={s.codaField}>
            <TabbiedPattern
              pattern={neon}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={112}
              redrawInterval={4984}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Klangwerk</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Studio für elektroakustische Musik, Karl-Heine-Str. 41, Leipzig.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Rooms</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.rooms" data-edit-max="28" href="#rooms">Studio Eins</a>
              </li>
              <li>
                <a data-edit="footer.rooms2" data-edit-max="28" href="#rooms">Studio Zwei</a>
              </li>
              <li>
                <a data-edit="footer.rooms3" data-edit-max="28" href="#rooms">Anechoic chamber</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Programme</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.residencies" data-edit-max="28" href="#residencies">Residencies</a>
              </li>
              <li>
                <a data-edit="footer.series" data-edit-max="28" href="#series">Reihe 41</a>
              </li>
              <li>
                <a data-edit="footer.apply" data-edit-max="28" href="#apply">Ask for a room</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Karl-Heine-Str. 41, Halle 4
              <br />
              04229 Leipzig
              <br />
              raum@klangwerk.example
              <br />
              Day rate from €60
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional studio. Prices and times are invented.</p>
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
