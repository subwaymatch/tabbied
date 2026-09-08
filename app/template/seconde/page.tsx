import { TabbiedPattern } from 'tabbied/react';
import {
  bothways, dotmatrix, dotset, fadedbar, hairpin, ring, tailoff, taper,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './seconde.module.css';

export const metadata = {
  title: 'Seconde: Chronométrage Sportif, Lausanne',
  description:
    'Seconde times races. Photo finish to one ten-thousandth, transponder splits, and results published before the athletes reach the barrier.',
};

/* Paper, ink, one magenta, two greys. Every field takes `transparent` in the
   background slot so the paper reads through. */
const INK = '#101010';
const MAGENTA = '#FF0059';
const GREY = '#8E8E8E';
const PALE = '#D6D6D2';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const SYSTEMS = [
  { code: 'PF-4', name: 'Photo finish', res: '1 / 10 000 s', body: 'A 10,000 fps line-scan camera on the finish plane, levelled to 0.2 mm over 8 metres. The image is the result; everything else is a convenience.' },
  { code: 'TR-2', name: 'Transponder', res: '1 / 1 000 s', body: 'Passive tags read by loops in the surface. Ninety-nine point nine nine per cent read rate over 40,000 passings last season.' },
  { code: 'GT-1', name: 'Light gate', res: '1 / 1 000 s', body: 'Twin-beam gates for sprints and training. Sends the split to the coach before the athlete has stopped running.' },
  { code: 'ST-3', name: 'Start detection', res: '1 / 1 000 s', body: 'Force-sensing blocks with a 100 ms reaction threshold. The trace is kept for every start, contested or not.' },
];

const RESULTS = [
  { pos: '1', name: 'Aïcha Bendjebbour', club: 'Stade Lausanne', time: '10.94', gap: '' },
  { pos: '2', name: 'Nina Lindqvist', club: 'IF Kronan', time: '11.02', gap: '+0.08' },
  { pos: '3', name: 'Rosa Marchetti', club: 'CA Bellinzona', time: '11.05', gap: '+0.11' },
  { pos: '4', name: 'Yuki Tanabe', club: 'Kobe TC', time: '11.07', gap: '+0.13' },
  { pos: '5', name: 'Hana Dvořák', club: 'AK Brno', time: '11.19', gap: '+0.25' },
  { pos: '6', name: 'Fenna de Wit', club: 'AV Haarlem', time: '11.22', gap: '+0.28' },
];

const SEASON = [
  ['18.04', 'Meeting de Lausanne', 'Athletics, track and field', 'Pierre-de-Coubertin'],
  ['09.05', 'Tour du Léman', 'Road cycling, 186 km', 'Léman circuit'],
  ['21.06', 'Championnats romands', 'Athletics, two days', 'Yverdon'],
  ['12.09', 'Course de l\'Escalade', 'Road running, 7,300 entries', 'Genève'],
  ['04.10', 'Coupe des Alpes', 'Alpine ski, timing trials', 'Verbier'],
];

const FACTS = [
  ['1 / 10 000', 'Second, photo finish'],
  ['40 812', 'Passings timed, 2025'],
  ['0', 'Results withdrawn'],
  ['22', 'Events a season'],
];

export default function SecondePage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f7f7f5',
        '--ink': '#101010',
        '--magenta': '#ff0059',
        '--grey': '#8e8e8e',
        '--pale': '#d6d6d2',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,magenta,grey,pale"
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
          Seconde
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.systems" data-edit-max="28" href="#systems">Systems</a>
          <a data-edit="bar.results" data-edit-max="28" href="#results">Results</a>
          <a data-edit="bar.season" data-edit-max="28" href="#season">Season</a>
          <a data-edit="bar.book" data-edit-max="28" href="#book">Book</a>
        </nav>
        <span data-edit="bar.clock" data-edit-max="60" className={s.clock}>Chronométrage sportif</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={fadedbar}
              palette={['transparent', PALE, MAGENTA]}
              fit="grid"
              cellSize={64}
              redrawInterval={2800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Lausanne / depuis 1991</p>
            <h1>
              The result exists
              <br />
              before the crowd
              <br />
              <span data-edit="hero.text" data-edit-max="60">finishes shouting.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              We time races to one ten-thousandth of a second and publish inside
              four. Thirty-five seasons, no result ever withdrawn.
            </p>
          </div>
        </section>

        {/* Full-bleed, and deliberately the tallest thing on the page: the
            finish line down the lanes, cropped to a long strip. */}
        <figure className={s.strip}>
          <Figure editId="photo.seconde-gate"
            slug="seconde-gate"
            alt="A photo-finish timing gate at the end of an empty athletics track seen down the lanes"
            priority
          />
        </figure>

        <dl className={s.facts}>
          {FACTS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ------------------------------------------------------- SYSTEMS */}
        <section id="systems" className={s.systems} aria-labelledby="systems-h">
          <h2 data-edit="systems.h2" data-edit-max="60" className={s.h2} id="systems-h">
            Four systems
          </h2>
          <ol className={s.sysList}>
            {SYSTEMS.map((x, i) => (
              <li key={x.code}>
                <span data-edit={`systems.sysCode.${i}`} data-edit-max="60" className={s.sysCode}>{x.code}</span>
                <div>
                  <h3 data-edit={`systems.title.${i}`} data-edit-max="40">{x.name}</h3>
                  <p data-edit={`systems.body.${i}`} data-edit-max="240" data-edit-multiline>{x.body}</p>
                </div>
                <span data-edit={`systems.sysRes.${i}`} data-edit-max="60" className={s.sysRes}>{x.res}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.seconde-console"
                slug="seconde-console"
                alt="A timing console with cables and a small screen on a folding table beside a track"
              />
              <figcaption data-edit="systems.caption" data-edit-max="120" data-edit-multiline>Console 2, trackside. Two operators, one kettle.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.seconde-lane"
                slug="seconde-lane"
                alt="A close overhead view of painted lane numbers on a running track surface"
              />
              <figcaption data-edit="systems.caption2" data-edit-max="120" data-edit-multiline>Lane 4, surveyed to 0.2 mm before every meeting.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ LANE BAND */}
        <section className={s.laneBand} aria-hidden="true">
          <div data-edit-pattern="laneBand.field" data-edit-roles="transparent,2,1,3" className={s.laneField}>
            <TabbiedPattern
              pattern={tailoff}
              palette={['transparent', MAGENTA, INK, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={2400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- RESULTS */}
        <section id="results" className={s.results} aria-labelledby="results-h">
          <div data-edit-pattern="results.field" data-edit-roles="transparent,4,3" className={s.resField} aria-hidden="true">
            <TabbiedPattern
              pattern={taper}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.resInner}>
            <h2 data-edit="results.h2" data-edit-max="60" className={s.h2} id="results-h">
              100 m women, final
            </h2>
            <p data-edit="results.note" data-edit-max="240" data-edit-multiline className={s.note}>
              Meeting de Lausanne, 18.04.2026, 19:42. Wind +0.4 m/s. Times
              official four seconds after the last athlete crossed.
            </p>
            <ol className={s.table}>
              {RESULTS.map((r, i) => (
                <li key={r.pos}>
                  <span data-edit={`results.pos.${i}`} data-edit-max="60" className={s.pos}>{r.pos}</span>
                  <span data-edit={`results.athlete.${i}`} data-edit-max="60" className={s.athlete}>{r.name}</span>
                  <span data-edit={`results.club.${i}`} data-edit-max="60" className={s.club}>{r.club}</span>
                  <span data-edit={`results.time.${i}`} data-edit-max="60" className={s.time}>{r.time}</span>
                  <span data-edit={`results.gap.${i}`} data-edit-max="60" className={s.gap}>{r.gap}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- SEASON */}
        <section id="season" className={s.season} aria-labelledby="season-h">
          <h2 data-edit="season.h2" data-edit-max="60" className={s.h2} id="season-h">
            Season 2026
          </h2>
          <ol className={s.dates}>
            {SEASON.map(([d, name, kind, place], i) => (
              <li key={name}>
                <span data-edit={`season.dDate.${i}`} data-edit-max="60" className={s.dDate}>{d}</span>
                <span data-edit={`season.dName.${i}`} data-edit-max="60" className={s.dName}>{name}</span>
                <span data-edit={`season.dKind.${i}`} data-edit-max="60" className={s.dKind}>{kind}</span>
                <span data-edit={`season.dPlace.${i}`} data-edit-max="60" className={s.dPlace}>{place}</span>
              </li>
            ))}
          </ol>
          <figure className={s.wide}>
            <Figure editId="photo.seconde-board"
              slug="seconde-board"
              alt="A large blank stadium scoreboard against an overcast sky seen from below"
            />
            <figcaption data-edit="season.caption" data-edit-max="120" data-edit-multiline>The board waits. It is the only part of the job that does.</figcaption>
          </figure>
        </section>

        {/* ---------------------------------------------------------- BOOK */}
        <section id="book" className={s.book} aria-labelledby="book-h">
          <div data-edit-pattern="book.field" data-edit-roles="transparent,2,3" className={s.bookField} aria-hidden="true">
            <TabbiedPattern
              pattern={dotset}
              palette={['transparent', MAGENTA, GREY]}
              fit="grid"
              cellSize={52}
              redrawInterval={3600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.bookInner}>
            <h2 data-edit="book.h2" data-edit-max="60" className={s.h2} id="book-h">
              Book the timing
            </h2>
            <div className={s.bookGrid}>
              <p data-edit="book.big" data-edit-max="240" data-edit-multiline className={s.big}>
                Tell us the discipline, the field size and the date. We reply
                with a crew, a rate and the list of things your venue needs to
                have flat.
              </p>
              <dl>
                <div>
                  <dt data-edit="book.term" data-edit-max="28">Write</dt>
                  <dd>
                    <a data-edit="book.link" data-edit-max="28" href="mailto:chrono@seconde.example">chrono@seconde.example</a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="book.term2" data-edit-max="28">Office</dt>
                  <dd>
                    Avenue de Rhodanie 12
                    <br />
                    1007 Lausanne
                  </dd>
                </div>
                <div>
                  <dt data-edit="book.term3" data-edit-max="28">Day rate</dt>
                  <dd data-edit="book.body" data-edit-max="200" data-edit-multiline>From CHF 2,400, crew of three, all systems</dd>
                </div>
                <div>
                  <dt data-edit="book.term4" data-edit-max="28">Notice</dt>
                  <dd data-edit="book.body2" data-edit-max="200" data-edit-multiline>Six weeks. Four if the surface is already surveyed.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Where a hundredth actually goes</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Three places a result is won or lost before anybody runs.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dotmatrix}
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
                  <Figure editId="photo.seconde-tile-watch-cutout" slug="seconde-tile-watch-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">The finish plane</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Levelled to 0.2 mm over eight metres. A finish line that is two millimetres out of plumb is worth more than most tailwinds.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={ring}
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
                  <Figure editId="photo.seconde-tile-block-cutout" slug="seconde-tile-block-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">The start</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Force-sensing blocks at 1 kHz. We keep the trace for every start, contested or not, and hand it over on request.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={fadedbar}
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
                  <Figure editId="photo.seconde-tile-chip-cutout" slug="seconde-tile-chip-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Synchronisation</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>One clock, distributed by cable, never by wireless. Two clocks agreeing is not the same as one clock being right.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">What we bring</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>One van, two crew, and the list below. Venues supply power and a flat place to put it.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Item</span>
                <span data-edit="index.text2" data-edit-max="60">Count</span>
                <span data-edit="index.text3" data-edit-max="60">Detail</span>
                <span data-edit="index.text4" data-edit-max="60">Weight</span>
            </li>
              <li key="Line-scan camera">
                <span data-edit="index.text5" data-edit-max="60">Line-scan camera</span>
                <span data-edit="index.text6" data-edit-max="60">2</span>
                <span data-edit="index.text7" data-edit-max="60">10 000 fps, twin plane</span>
                <span data-edit="index.text8" data-edit-max="60">14 kg</span>
              </li>
              <li key="Timing console">
                <span data-edit="index.text9" data-edit-max="60">Timing console</span>
                <span data-edit="index.text10" data-edit-max="60">2</span>
                <span data-edit="index.text11" data-edit-max="60">Primary and hot spare</span>
                <span data-edit="index.text12" data-edit-max="60">22 kg</span>
              </li>
              <li key="Start blocks, sensing">
                <span data-edit="index.text13" data-edit-max="60">Start blocks, sensing</span>
                <span data-edit="index.text14" data-edit-max="60">8</span>
                <span data-edit="index.text15" data-edit-max="60">1 kHz force trace</span>
                <span data-edit="index.text16" data-edit-max="60">96 kg</span>
              </li>
              <li key="Transponder loops">
                <span data-edit="index.text17" data-edit-max="60">Transponder loops</span>
                <span data-edit="index.text18" data-edit-max="60">6</span>
                <span data-edit="index.text19" data-edit-max="60">Surface or buried</span>
                <span data-edit="index.text20" data-edit-max="60">40 kg</span>
              </li>
              <li key="Light gates">
                <span data-edit="index.text21" data-edit-max="60">Light gates</span>
                <span data-edit="index.text22" data-edit-max="60">12</span>
                <span data-edit="index.text23" data-edit-max="60">Twin beam</span>
                <span data-edit="index.text24" data-edit-max="60">18 kg</span>
              </li>
              <li key="Cable, distribution">
                <span data-edit="index.text25" data-edit-max="60">Cable, distribution</span>
                <span data-edit="index.text26" data-edit-max="60">1 200 m</span>
                <span data-edit="index.text27" data-edit-max="60">Fibre and copper</span>
                <span data-edit="index.text28" data-edit-max="60">140 kg</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Asked by organisers</h2>
          <dl className={s.faqList}>
              <div key="How long do you need on ">
                <dt data-edit="faq.term" data-edit-max="28">How long do you need on site?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Half a day before the first event for a track, a full day for a road course. Most of it is surveying the finish, not plugging things in.</dd>
              </div>
              <div key="Can we use our own score">
                <dt data-edit="faq.term2" data-edit-max="28">Can we use our own scoreboard?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Yes, if it speaks a protocol from this century. We will test it the day before, not on the morning.</dd>
              </div>
              <div key="What happens if a system">
                <dt data-edit="faq.term3" data-edit-max="28">What happens if a system fails?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Two of everything, hot. The photo finish and the transponders are independent chains, so losing one never loses the meeting.</dd>
              </div>
              <div key="Do you publish results y">
                <dt data-edit="faq.term4" data-edit-max="28">Do you publish results yourselves?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>To your board and your feed, four seconds after the last athlete. What happens after that is your press officer, not us.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={hairpin}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={110}
              redrawInterval={4970}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Seconde</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Chronométrage sportif, Avenue de Rhodanie 12, Lausanne, depuis 1991.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Timing</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.systems" data-edit-max="28" href="#systems">Four systems</a>
              </li>
              <li>
                <a data-edit="footer.results" data-edit-max="28" href="#results">Live results</a>
              </li>
              <li>
                <a data-edit="footer.season" data-edit-max="28" href="#season">Season 2026</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Organisers</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.book" data-edit-max="28" href="#book">Book the timing</a>
              </li>
              <li>
                <a data-edit="footer.book2" data-edit-max="28" href="#book">Day rates</a>
              </li>
              <li>
                <a data-edit="footer.systems2" data-edit-max="28" href="#systems">Start detection</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Avenue de Rhodanie 12
              <br />
              1007 Lausanne
              <br />
              chrono@seconde.example
              <br />
              +41 21 000 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional timing company. Prices and times are invented.</p>
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
