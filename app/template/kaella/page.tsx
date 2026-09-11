import { TabbiedPattern } from 'tabbied/react';
import {
  curl, dotwash, lagoon, pebble, ripplering, tidering,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './kaella.module.css';

export const metadata = {
  title: 'Källa: Kommunalt Vatten, Uppsala',
  description:
    'Källa supplies drinking water to 91,000 households in Uppsala. Source, treatment, network and what came out of the tap this morning.',
};

/* Pale water, dark ink, one aqua. Every pattern field takes `transparent` in
   the background slot so the page colour reads through. */
const INK = '#0F1A1D';
const AQUA = '#00A6A6';
const STEEL = '#7E9296';
const MIST = '#DCE7E7';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = MIST;


const TODAY = [
  { p: 'Hardness', v: '5.8', u: '°dH', note: 'Medium soft' },
  { p: 'pH', v: '7.9', u: '', note: 'Within 7.5 to 9.0' },
  { p: 'Nitrate', v: '2.1', u: 'mg/l', note: 'Limit 50' },
  { p: 'Turbidity', v: '0.09', u: 'FNU', note: 'Limit 1.0' },
  { p: 'Chloride', v: '11', u: 'mg/l', note: 'Limit 250' },
  { p: 'Temperature', v: '8.4', u: '°C', note: 'At the works' },
];

const CHAIN = [
  { n: '01', t: 'Source', d: 'Fourteen wells in the Uppsala esker, drawing from an aquifer recharged by the Fyris river through two kilometres of glacial sand.' },
  { n: '02', t: 'Aeration', d: 'Cascade aeration to raise oxygen and drive off carbon dioxide, in the open, in whatever weather Uppland provides.' },
  { n: '03', t: 'Filtration', d: 'Rapid sand, then slow sand at 0.1 metres an hour. The slow filters are biological and are cleaned by hand, twice a year.' },
  { n: '04', t: 'UV and distribution', d: 'UV disinfection, no chlorine in normal operation, then 940 kilometres of main to 91,000 households.' },
];

const NUMBERS = [
  ['91 000', 'Households supplied'],
  ['940 km', 'Water main'],
  ['14', 'Wells in the esker'],
  ['0.09', 'FNU turbidity today'],
];

const WORKS = [
  ['Galgbacken', 'Slow sand, 6 beds', '1957', '38 000 m³/d'],
  ['Stadsträdgården', 'Rapid + slow sand', '1971', '52 000 m³/d'],
  ['Bäcklösa', 'Rapid sand, UV', '2004', '24 000 m³/d'],
];

export default function KaellaPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--pale': '#f2f6f6',
        '--ink': '#0f1a1d',
        '--aqua': '#00a6a6',
        '--steel': '#7e9296',
        '--mist': '#dce7e7',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="pale,ink,aqua,steel,mist"
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
          Källa
          <i>Kommunalt vatten, Uppsala</i>
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.today" data-edit-max="28" href="#today">Today</a>
          <a data-edit="bar.chain" data-edit-max="28" href="#chain">Treatment</a>
          <a data-edit="bar.works" data-edit-max="28" href="#works">Works</a>
          <a data-edit="bar.contact" data-edit-max="28" href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={ripplering}
              palette={['transparent', MIST, STEEL]}
              fit="grid"
              cellSize={150}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroScrim} aria-hidden="true" />
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Uppsala vatten / sedan 1876</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              It comes out of
              <br />
              a hill, and we try
              <br />
              <span>not to spoil it.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Fourteen wells in the esker, three works, nine hundred and forty
              kilometres of main. No chlorine in normal operation, because the
              water does not need it.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.kaella-basin"
            slug="kaella-basin"
            alt="A still rectangular water treatment basin seen from a walkway at dawn with mist on the surface"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Slow filter 3, Galgbacken. 0.1 metres an hour, since 1957.</figcaption>
        </figure>

        {/* ---------------------------------------------------------- TODAY */}
        <section id="today" className={s.today} aria-labelledby="today-h">
          <div className={s.secHead}>
            <h2 data-edit="today.title" data-edit-max="60" id="today-h">This morning, at the works</h2>
            <p data-edit="today.body" data-edit-max="240" data-edit-multiline>Sampled 06.00, published unedited. Yesterday and every day back to 2011 are in the archive.</p>
          </div>
          <ol className={s.readings}>
            {TODAY.map((t, i) => (
              <li key={t.p}>
                <span data-edit={`today.rP.${i}`} data-edit-max="60" className={s.rP}>{t.p}</span>
                <span className={s.rV}>
                  {t.v}
                  <i>{t.u}</i>
                </span>
                <span data-edit={`today.rNote.${i}`} data-edit-max="60" className={s.rNote}>{t.note}</span>
              </li>
            ))}
          </ol>
          <dl className={s.numbers}>
            {NUMBERS.map(([v, k], i) => (
              <div key={k}>
                <dt data-edit={`today.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`today.body2.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ----------------------------------------------------- FLOW BAND */}
        <section className={s.flowBand} aria-hidden="true">
          <div data-edit-pattern="flowBand.field" data-edit-roles="transparent,2,1,3" className={s.flowField}>
            <TabbiedPattern
              pattern={tidering}
              palette={['transparent', AQUA, INK, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={3000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- CHAIN */}
        <section id="chain" className={s.chain} aria-labelledby="chain-h">
          <div data-edit-pattern="chain.field" data-edit-roles="transparent,3,4" className={s.chainField} aria-hidden="true">
            <TabbiedPattern
              pattern={lagoon}
              palette={['transparent', STEEL, MIST]}
              fit="grid"
              cellSize={110}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.chainInner}>
            <div className={s.secHead}>
              <h2 data-edit="chain.title" data-edit-max="60" id="chain-h">Well to tap, in four steps</h2>
            </div>
            <ol className={s.chainList}>
              {CHAIN.map((c, i) => (
                <li key={c.n}>
                  <span data-edit={`chain.cN.${i}`} data-edit-max="60" className={s.cN}>{c.n}</span>
                  <h3 data-edit={`chain.title2.${i}`} data-edit-max="40">{c.t}</h3>
                  <p data-edit={`chain.body.${i}`} data-edit-max="240" data-edit-multiline>{c.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.kaella-valves"
                  slug="kaella-valves"
                  alt="A valve hall of large painted pipework and hand wheels, evenly lit"
                />
                <figcaption data-edit="chain.caption" data-edit-max="120" data-edit-multiline>Valve hall, Bäcklösa. Everything here is turned by hand.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.kaella-reservoir"
                  slug="kaella-reservoir"
                  alt="An open service reservoir at first light with flat water and a low concrete edge"
                />
                <figcaption data-edit="chain.caption2" data-edit-max="120" data-edit-multiline>Service reservoir, 14,000 m³, covered since 1988.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- WORKS */}
        <section id="works" className={s.works} aria-labelledby="works-h">
          <div className={s.secHead}>
            <h2 data-edit="works.title" data-edit-max="60" id="works-h">Three works</h2>
          </div>
          <ol className={s.worksList}>
            {WORKS.map(([name, kind, year, cap], i) => (
              <li key={name}>
                <span data-edit={`works.wName.${i}`} data-edit-max="60" className={s.wName}>{name}</span>
                <span data-edit={`works.wKind.${i}`} data-edit-max="60" className={s.wKind}>{kind}</span>
                <span data-edit={`works.wYear.${i}`} data-edit-max="60" className={s.wYear}>{year}</span>
                <span data-edit={`works.wCap.${i}`} data-edit-max="60" className={s.wCap}>{cap}</span>
              </li>
            ))}
          </ol>
          <figure className={s.wide}>
            <Figure editId="photo.kaella-sample"
              slug="kaella-sample"
              alt="A rack of clear water sample bottles on a laboratory bench"
            />
            <figcaption data-edit="works.caption" data-edit-max="120" data-edit-multiline>Ninety-four samples a week, six of them from taps chosen at random.</figcaption>
          </figure>
        </section>

        {/* -------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div data-edit-pattern="contact.field" data-edit-roles="transparent,2,3" className={s.contactField} aria-hidden="true">
            <TabbiedPattern
              pattern={dotwash}
              palette={['transparent', AQUA, STEEL]}
              fit="grid"
              cellSize={46}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.contactInner}>
            <div className={s.secHead}>
              <h2 data-edit="contact.title" data-edit-max="60" id="contact-h">If something is wrong with the water</h2>
            </div>
            <dl className={s.dl}>
              <div>
                <dt data-edit="contact.term" data-edit-max="28">Report a fault, 24 h</dt>
                <dd data-edit="contact.body" data-edit-max="200" data-edit-multiline>018 000 000</dd>
              </div>
              <div>
                <dt data-edit="contact.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="contact.link" data-edit-max="28" href="mailto:vatten@kaella.example">vatten@kaella.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="contact.term3" data-edit-max="28">Office</dt>
                <dd data-edit="contact.body3" data-edit-max="200" data-edit-multiline>
                  Kungsängsvägen 27
                  <br />
                  753 23 Uppsala
                </dd>
              </div>
              <div>
                <dt data-edit="contact.term4" data-edit-max="28">Discoloured water</dt>
                <dd data-edit="contact.body2" data-edit-max="200" data-edit-multiline>Run the cold tap for five minutes. If it persists, call the number above.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three things we test for that nobody asks about</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>The parameters on the front page are the ones people know. These are the ones that actually keep the supply safe.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
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
                  <Figure editId="photo.kaella-tile-petri-cutout" slug="kaella-tile-petri-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Coliforms</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Ninety-four samples a week, six from taps chosen at random across the network. A single positive closes a zone until three consecutive clears.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
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
                  <Figure editId="photo.kaella-tile-bottle-cutout" slug="kaella-tile-bottle-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Trihalomethanes</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>A by-product of chlorination, which is one of several reasons we do not chlorinate in normal operation. Measured anyway, monthly.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={lagoon}
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
                  <Figure editId="photo.kaella-tile-gauge-cutout" slug="kaella-tile-gauge-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Pressure</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Not a quality parameter, but a low-pressure event is how contamination gets into a main. Logged continuously at forty points.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Network</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>What the nine hundred and forty kilometres are actually made of, oldest first.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Material</span>
                <span data-edit="index.text2" data-edit-max="60">Length</span>
                <span data-edit="index.text3" data-edit-max="60">Laid</span>
                <span data-edit="index.text4" data-edit-max="60">Replacement</span>
            </li>
              <li key="Cast iron">
                <span data-edit="index.text5" data-edit-max="60">Cast iron</span>
                <span data-edit="index.text6" data-edit-max="60">118 km</span>
                <span data-edit="index.text7" data-edit-max="60">1876 to 1955</span>
                <span data-edit="index.text8" data-edit-max="60">Priority, 4 km a year</span>
              </li>
              <li key="Asbestos cement">
                <span data-edit="index.text9" data-edit-max="60">Asbestos cement</span>
                <span data-edit="index.text10" data-edit-max="60">96 km</span>
                <span data-edit="index.text11" data-edit-max="60">1950 to 1974</span>
                <span data-edit="index.text12" data-edit-max="60">Priority, on failure</span>
              </li>
              <li key="Ductile iron">
                <span data-edit="index.text13" data-edit-max="60">Ductile iron</span>
                <span data-edit="index.text14" data-edit-max="60">341 km</span>
                <span data-edit="index.text15" data-edit-max="60">1970 to 2000</span>
                <span data-edit="index.text16" data-edit-max="60">As required</span>
              </li>
              <li key="PE 100">
                <span data-edit="index.text17" data-edit-max="60">PE 100</span>
                <span data-edit="index.text18" data-edit-max="60">372 km</span>
                <span data-edit="index.text19" data-edit-max="60">1995 onward</span>
                <span data-edit="index.text20" data-edit-max="60">None expected</span>
              </li>
              <li key="Steel, trunk">
                <span data-edit="index.text21" data-edit-max="60">Steel, trunk</span>
                <span data-edit="index.text22" data-edit-max="60">13 km</span>
                <span data-edit="index.text23" data-edit-max="60">1962</span>
                <span data-edit="index.text24" data-edit-max="60">Relined 2018</span>
              </li>
              <li key="Service pipes">
                <span data-edit="index.text25" data-edit-max="60">Service pipes</span>
                <span data-edit="index.text26" data-edit-max="60">n/a</span>
                <span data-edit="index.text27" data-edit-max="60">Various</span>
                <span data-edit="index.text28" data-edit-max="60">Lead: none remaining</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Questions from households</h2>
          <dl className={s.faqList}>
              <div key="Why is my water cloudy?">
                <dt data-edit="faq.term" data-edit-max="28">Why is my water cloudy?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Almost always air, not dirt. Fill a glass and leave it for two minutes; if it clears from the bottom up it was air and there is nothing wrong.</dd>
              </div>
              <div key="Do I need a filter?">
                <dt data-edit="faq.term2" data-edit-max="28">Do I need a filter?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>No. If you dislike the taste, a jug in the fridge for an hour does more than any filter, and costs nothing.</dd>
              </div>
              <div key="Is it hard water?">
                <dt data-edit="faq.term3" data-edit-max="28">Is it hard water?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Five point eight degrees, which is medium soft. You will use less detergent here than almost anywhere else in the country.</dd>
              </div>
              <div key="Why does it taste differ">
                <dt data-edit="faq.term4" data-edit-max="28">Why does it taste different in summer?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Slightly warmer at the tap and slightly longer in the main. Same water, same source, different residence time.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={pebble}
              palette={['transparent', MIST, STEEL]}
              fit="grid"
              cellSize={106}
              redrawInterval={4942}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Källa</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Kommunalt vatten, Kungsängsvägen 27, Uppsala, sedan 1876.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Water</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.today" data-edit-max="28" href="#today">This morning</a>
              </li>
              <li>
                <a data-edit="footer.chain" data-edit-max="28" href="#chain">Well to tap</a>
              </li>
              <li>
                <a data-edit="footer.works" data-edit-max="28" href="#works">Three works</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Customers</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.contact" data-edit-max="28" href="#contact">Report a fault</a>
              </li>
              <li>
                <a data-edit="footer.contact2" data-edit-max="28" href="#contact">Discoloured water</a>
              </li>
              <li>
                <a data-edit="footer.today2" data-edit-max="28" href="#today">The archive</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Kungsängsvägen 27
              <br />
              753 23 Uppsala
              <br />
              vatten@kaella.example
              <br />
              018 000 000, 24 h
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional water utility. Prices and times are invented.</p>
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
