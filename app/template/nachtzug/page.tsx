import { TabbiedPattern } from 'tabbied/react';
import {
  bothways, dotfield, picket, rungs, sliver, streaking,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './nachtzug.module.css';

export const metadata = {
  title: 'Nachtzug: Schlafwagen quer durch Europa',
  description:
    'Nachtzug runs six sleeper services across Europe. Book a berth, a compartment or a whole carriage. Breakfast is included and the window opens.',
};

/* Night ground, bone type, one warm gold that stands for the reading lamp.
   Every field takes `transparent` in the background slot. */
const BONE = '#EDE8DA';
const GOLD = '#E0A83C';
const STEEL = '#545C74';
const DEEP = '#141827';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = DEEP;


const LINES = [
  { no: 'NZ 401', from: 'Wien Hbf', to: 'Roma Termini', dep: '19.42', arr: '09.12', nights: '1', runs: 'Daily' },
  { no: 'NZ 412', from: 'Zürich HB', to: 'Zagreb Gl. kol.', dep: '20.55', arr: '10.28', nights: '1', runs: 'Daily' },
  { no: 'NZ 430', from: 'Berlin Hbf', to: 'Kraków Główny', dep: '21.10', arr: '07.44', nights: '1', runs: 'Tue Thu Sat' },
  { no: 'NZ 455', from: 'Hamburg Hbf', to: 'Sofia Central', dep: '18.30', arr: '18.05', nights: '2', runs: 'Fri' },
  { no: 'NZ 470', from: 'Paris Est', to: 'București Nord', dep: '17.48', arr: '20.55', nights: '2', runs: 'Wed Sun' },
  { no: 'NZ 488', from: 'København H', to: 'Ljubljana', dep: '19.05', arr: '11.36', nights: '1', runs: 'Daily' },
];

const BERTHS = [
  { name: 'Couchette, six', price: 'from €49', body: 'Six bunks, a curtain, and the entirely reasonable expectation that somebody will snore.' },
  { name: 'Couchette, four', price: 'from €69', body: 'Four bunks, a washbasin, and enough room to change without choreography.' },
  { name: 'Sleeper, two', price: 'from €139', body: 'Two berths, a proper bed, a door that locks and a window that opens twelve centimetres.' },
  { name: 'Sleeper, single', price: 'from €219', body: 'One berth, one lamp, and the whole compartment. Booked out three months ahead in summer.' },
];

const RULES = [
  'Breakfast is included in every berth, at whatever hour you appear',
  'The window opens. This is not negotiable and never will be',
  'Bicycles travel in the van, six per train, booked separately',
  'Dogs travel free in couchettes if the whole compartment is booked',
  'No wake-up call before 06.30 unless you ask for one',
];

export default function NachtzugPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--night': '#0b0e1a',
        '--bone': '#ede8da',
        '--gold': '#e0a83c',
        '--steel': '#545c74',
        '--deep': '#141827',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="night,bone,gold,steel,deep"
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
          Nachtzug
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.lines" data-edit-max="28" href="#lines">Lines</a>
          <a data-edit="bar.berths" data-edit-max="28" href="#berths">Berths</a>
          <a data-edit="bar.aboard" data-edit-max="28" href="#aboard">Aboard</a>
          <a data-edit="bar.book" data-edit-max="28" href="#book">Book</a>
        </nav>
        <span data-edit="bar.tag" data-edit-max="60" className={s.tag}>Schlafwagen seit 1994</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={rungs}
              palette={['transparent', STEEL, GOLD]}
              fit="grid"
              cellSize={96}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Six lines / eleven countries / one timetable</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              Go to sleep in
              <br />
              one country and
              <br />
              <span>wake in another.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Six sleeper services across Europe, every one of them slower than
              flying and better than arriving.
            </p>
          </div>
        </section>

        {/* The compartment at night, full width and tall: the single image the
            whole proposition rests on. */}
        <figure className={s.bleed}>
          <Figure editId="photo.nachtzug-compartment"
            slug="nachtzug-compartment"
            alt="A sleeper compartment at night with a made-up bunk, a warm reading lamp and a dark window"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>NZ 401, compartment 7. Somewhere south of Villach, 02.10.</figcaption>
        </figure>

        {/* ---------------------------------------------------------- LINES */}
        <section id="lines" className={s.lines} aria-labelledby="lines-h">
          <h2 data-edit="lines.h2" data-edit-max="60" className={s.h2} id="lines-h">
            The six lines
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span data-edit="lines.text" data-edit-max="60">Service</span>
              <span data-edit="lines.text2" data-edit-max="60">From</span>
              <span data-edit="lines.text3" data-edit-max="60">To</span>
              <span data-edit="lines.text4" data-edit-max="60">Dep</span>
              <span data-edit="lines.text5" data-edit-max="60">Arr</span>
              <span data-edit="lines.text6" data-edit-max="60">Nights</span>
              <span data-edit="lines.text7" data-edit-max="60">Runs</span>
            </li>
            {LINES.map((l, i) => (
              <li key={l.no}>
                <span data-edit={`lines.no.${i}`} data-edit-max="60" className={s.no}>{l.no}</span>
                <span data-edit={`lines.from.${i}`} data-edit-max="60" className={s.from}>{l.from}</span>
                <span data-edit={`lines.to.${i}`} data-edit-max="60" className={s.to}>{l.to}</span>
                <span data-edit={`lines.time.${i}`} data-edit-max="60" className={s.time}>{l.dep}</span>
                <span data-edit={`lines.time2.${i}`} data-edit-max="60" className={s.time}>{l.arr}</span>
                <span data-edit={`lines.nights.${i}`} data-edit-max="60" className={s.nights}>{l.nights}</span>
                <span data-edit={`lines.runs.${i}`} data-edit-max="60" className={s.runs}>{l.runs}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ RAIL BAND */}
        <section className={s.railBand} aria-hidden="true">
          <div data-edit-pattern="railBand.field" data-edit-roles="transparent,2,1,3" className={s.railField}>
            <TabbiedPattern
              pattern={bothways}
              palette={['transparent', GOLD, BONE, STEEL]}
              fit="grid"
              cellSize={104}
              redrawInterval={3200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- BERTHS */}
        <section id="berths" className={s.berths} aria-labelledby="berths-h">
          <div data-edit-pattern="berths.field" data-edit-roles="transparent,3,2" className={s.berthsField} aria-hidden="true">
            <TabbiedPattern
              pattern={dotfield}
              palette={['transparent', STEEL, GOLD]}
              fit="grid"
              cellSize={40}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.berthsInner}>
            <h2 data-edit="berths.h2" data-edit-max="60" className={s.h2} id="berths-h">
              Four ways to lie down
            </h2>
            <ol className={s.berthList}>
              {BERTHS.map((b, i) => (
                <li key={b.name}>
                  <h3 data-edit={`berths.title.${i}`} data-edit-max="40">{b.name}</h3>
                  <p data-edit={`berths.bPrice.${i}`} data-edit-max="240" data-edit-multiline className={s.bPrice}>{b.price}</p>
                  <p data-edit={`berths.bBody.${i}`} data-edit-max="240" data-edit-multiline className={s.bBody}>{b.body}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.nachtzug-platform"
                  slug="nachtzug-platform"
                  alt="A long sleeper train standing at a lit platform late at night"
                />
                <figcaption data-edit="berths.caption" data-edit-max="120" data-edit-multiline>Wien Hbf, platform 9. Boarding from 19.10.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.nachtzug-dining"
                  slug="nachtzug-dining"
                  alt="An empty dining car set for breakfast with lamps lit and night outside"
                />
                <figcaption data-edit="berths.caption2" data-edit-max="120" data-edit-multiline>The dining car opens at 06.30 and closes when it empties.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- ABOARD */}
        <section id="aboard" className={s.aboard} aria-labelledby="aboard-h">
          <h2 data-edit="aboard.h2" data-edit-max="60" className={s.h2} id="aboard-h">
            Aboard
          </h2>
          <div className={s.aboardGrid}>
            <ul className={s.rules}>
              {RULES.map((r, i) => (
                <li data-edit={`aboard.item.${i}`} data-edit-max="80" key={r}>{r}</li>
              ))}
            </ul>
            <figure className={s.tall}>
              <Figure editId="photo.nachtzug-corridor"
                slug="nachtzug-corridor"
                alt="The narrow corridor of a sleeping car at night with warm lamps receding"
              />
              <figcaption data-edit="aboard.caption" data-edit-max="120" data-edit-multiline>Carriage 274, built 1988, refitted 2019.</figcaption>
            </figure>
          </div>
        </section>

        {/* ----------------------------------------------------------- BOOK */}
        <section id="book" className={s.book} aria-labelledby="book-h">
          <div data-edit-pattern="book.field" data-edit-roles="transparent,2,3" className={s.bookField} aria-hidden="true">
            <TabbiedPattern
              pattern={sliver}
              palette={['transparent', GOLD, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.bookInner}>
            <h2 data-edit="book.h2" data-edit-max="60" className={s.h2} id="book-h">
              Booking
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="book.term" data-edit-max="28">Reservations</dt>
                <dd>
                  <a data-edit="book.link" data-edit-max="28" href="mailto:schlafwagen@nachtzug.example">schlafwagen@nachtzug.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="book.term2" data-edit-max="28">Telephone</dt>
                <dd data-edit="book.body" data-edit-max="200" data-edit-multiline>+43 1 000 000, 07.00 to 21.00</dd>
              </div>
              <div>
                <dt data-edit="book.term3" data-edit-max="28">Opens</dt>
                <dd data-edit="book.body2" data-edit-max="200" data-edit-multiline>Six months ahead, at 08.00 Vienna time</dd>
              </div>
              <div>
                <dt data-edit="book.term4" data-edit-max="28">Whole carriage</dt>
                <dd data-edit="book.body3" data-edit-max="200" data-edit-multiline>Thirty berths, by arrangement, six weeks notice</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three reasons the night train survived</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>It was written off four times between 1998 and 2016. Here is what kept it running.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dotfield}
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
                  <Figure editId="photo.nachtzug-tile-bed-cutout" slug="nachtzug-tile-bed-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">The bed</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>A night on a train is a night of accommodation. Costed that way, the sleeper stops looking expensive and starts looking obvious.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={sliver}
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
                  <Figure editId="photo.nachtzug-tile-border-cutout" slug="nachtzug-tile-border-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">The border</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Nobody wakes you. Schengen did more for the sleeper than any marketing campaign, and a whole generation has never been asked for a passport at 03.00.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={rungs}
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
                  <Figure editId="photo.nachtzug-tile-ticket-cutout" slug="nachtzug-tile-ticket-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">The arithmetic</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Twelve hours that would otherwise be spent awake, in an airport, being processed. The train is slower and the day is longer.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Rolling stock</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Everything is owned and maintained at Wien Simmering. Ages are honest.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Type</span>
                <span data-edit="index.text2" data-edit-max="60">Built</span>
                <span data-edit="index.text3" data-edit-max="60">Refit</span>
                <span data-edit="index.text4" data-edit-max="60">In service</span>
            </li>
              <li key="Sleeping car, WLABmz">
                <span data-edit="index.text5" data-edit-max="60">Sleeping car, WLABmz</span>
                <span data-edit="index.text6" data-edit-max="60">1988</span>
                <span data-edit="index.text7" data-edit-max="60">2019</span>
                <span data-edit="index.text8" data-edit-max="60">24</span>
              </li>
              <li key="Couchette, Bcmz">
                <span data-edit="index.text9" data-edit-max="60">Couchette, Bcmz</span>
                <span data-edit="index.text10" data-edit-max="60">1991</span>
                <span data-edit="index.text11" data-edit-max="60">2021</span>
                <span data-edit="index.text12" data-edit-max="60">31</span>
              </li>
              <li key="Seating, Bmz">
                <span data-edit="index.text13" data-edit-max="60">Seating, Bmz</span>
                <span data-edit="index.text14" data-edit-max="60">1986</span>
                <span data-edit="index.text15" data-edit-max="60">2017</span>
                <span data-edit="index.text16" data-edit-max="60">12</span>
              </li>
              <li key="Dining, WRmz">
                <span data-edit="index.text17" data-edit-max="60">Dining, WRmz</span>
                <span data-edit="index.text18" data-edit-max="60">1978</span>
                <span data-edit="index.text19" data-edit-max="60">2015</span>
                <span data-edit="index.text20" data-edit-max="60">6</span>
              </li>
              <li key="Van, Dms">
                <span data-edit="index.text21" data-edit-max="60">Van, Dms</span>
                <span data-edit="index.text22" data-edit-max="60">1994</span>
                <span data-edit="index.text23" data-edit-max="60">2020</span>
                <span data-edit="index.text24" data-edit-max="60">8</span>
              </li>
              <li key="Locomotive, hired">
                <span data-edit="index.text25" data-edit-max="60">Locomotive, hired</span>
                <span data-edit="index.text26" data-edit-max="60">n/a</span>
                <span data-edit="index.text27" data-edit-max="60">n/a</span>
                <span data-edit="index.text28" data-edit-max="60">Per section</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Before you board</h2>
          <dl className={s.faqList}>
              <div key="Is there a shower?">
                <dt data-edit="faq.term" data-edit-max="28">Is there a shower?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>In the two-berth and single sleepers, yes, at the end of the carriage. In couchettes, a washbasin in the compartment and nothing else.</dd>
              </div>
              <div key="Can I book a compartment">
                <dt data-edit="faq.term2" data-edit-max="28">Can I book a compartment to myself?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Yes, at the whole-compartment rate, which is less than the sum of the berths. Most solo travellers who have tried it never go back.</dd>
              </div>
              <div key="What if I miss my connec">
                <dt data-edit="faq.term3" data-edit-max="28">What if I miss my connection?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Our tickets are through-ticketed, so the next service is on us. This is not generosity; it is the rule the whole network runs on.</dd>
              </div>
              <div key="Does the window really o">
                <dt data-edit="faq.term4" data-edit-max="28">Does the window really open?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Twelve centimetres, in every sleeper and every couchette. We have replaced entire carriages and kept the mechanism.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,1,3" className={s.codaField}>
            <TabbiedPattern
              pattern={picket}
              palette={['transparent', BONE, STEEL]}
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
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Nachtzug</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Schlafwagen quer durch Europa, six lines, since 1994.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Travel</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.lines" data-edit-max="28" href="#lines">The six lines</a>
              </li>
              <li>
                <a data-edit="footer.berths" data-edit-max="28" href="#berths">Four kinds of berth</a>
              </li>
              <li>
                <a data-edit="footer.aboard" data-edit-max="28" href="#aboard">Aboard</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Booking</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.book" data-edit-max="28" href="#book">Reservations</a>
              </li>
              <li>
                <a data-edit="footer.book2" data-edit-max="28" href="#book">Whole carriage</a>
              </li>
              <li>
                <a data-edit="footer.aboard2" data-edit-max="28" href="#aboard">Bicycles and dogs</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Reservations, 07.00 to 21.00
              <br />
              schlafwagen@nachtzug.example
              <br />
              +43 1 000 000
              <br />
              Opens six months ahead
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional sleeper operator. Prices and times are invented.</p>
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
