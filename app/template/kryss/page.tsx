import { TabbiedPattern } from 'tabbied/react';
import {
  bothways, caltrop, dotmatrix, ell, metro, staple, trigram,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './kryss.module.css';

export const metadata = {
  title: 'Kryss: Wayfinding, Oslo',
  description:
    'Kryss designs wayfinding for stations, hospitals and campuses. Decision points, plain names, and signs we test by asking strangers to find things.',
};

/* Paper, ink, one directional green. Every field takes `transparent` in the
   background slot, so the concourse colour of the page runs through them. */
const INK = '#131416';
const GREEN = '#00843D';
const GREY = '#8E9094';
const PALE = '#E2E2DE';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const PROJECTS = [
  { code: 'K-46', client: 'Bergen Sentralstasjon', kind: 'Rail interchange', pts: '212', year: '2026' },
  { code: 'K-42', client: 'Ullevål sykehus', kind: 'Hospital campus', pts: '486', year: '2025' },
  { code: 'K-38', client: 'Universitetet i Tromsø', kind: 'Campus', pts: '304', year: '2024' },
  { code: 'K-33', client: 'Trondheim Havn', kind: 'Port terminal', pts: '96', year: '2024' },
  { code: 'K-27', client: 'Oslo Rådhus', kind: 'Civic building', pts: '58', year: '2022' },
];

const METHOD = [
  { n: '01', t: 'Walk it as a stranger', d: 'Before anything is drawn, we walk the building the way a first-time visitor does: from the wrong entrance, in a hurry, carrying something.' },
  { n: '02', t: 'Find the decision points', d: 'A sign is only useful where a person has to choose. We map every fork in the building, count them, and then remove the signs that are not at one.' },
  { n: '03', t: 'Say what the place is called', d: 'Not what the department is called on the org chart. If everyone calls it the old wing, the sign says the old wing.' },
  { n: '04', t: 'Test with strangers', d: 'Twelve people who have never been in the building, given a destination and a stopwatch. We publish the failure rate to the client, including the embarrassing one.' },
];

const NUMBERS = [
  ['46', 'Schemes since 2011'],
  ['1 156', 'Decision points mapped'],
  ['12', 'Testers per scheme'],
  ['1', 'Type size on a fingerpost'],
];

export default function KryssPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f4f4f1',
        '--ink': '#131416',
        '--green': '#00843d',
        '--grey': '#8e9094',
        '--pale': '#e2e2de',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,green,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.link" data-edit-format="emphasis" data-edit-max="28" className={s.mark} href="#top">
          <span className={s.arrow} aria-hidden="true" />
          Kryss
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.method" data-edit-max="28" href="#method">Method</a>
          <a data-edit="bar.work" data-edit-max="28" href="#work">Work</a>
          <a data-edit="bar.testing" data-edit-max="28" href="#testing">Testing</a>
          <a data-edit="bar.studio" data-edit-max="28" href="#studio">Studio</a>
        </nav>
        <span data-edit="bar.tag" data-edit-max="60" className={s.tag}>Skiltdesign / Oslo</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={caltrop}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={130}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Wayfinding / Oslo / siden 2011</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              A sign is only
              <br />
              useful where
              <br />
              <span>somebody chooses.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              We map every fork in a building, name things the way people
              already name them, and then hand a stranger a stopwatch.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.kryss-sign"
            slug="kryss-sign"
            alt="A large suspended wayfinding sign panel in a bright station concourse seen straight on"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>K-46, concourse level. One panel, four destinations, no logos.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* --------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <h2 data-edit="method.h2" data-edit-max="60" className={s.h2} id="method-h">
            Four steps
          </h2>
          <ol className={s.methodList}>
            {METHOD.map((m, i) => (
              <li key={m.n}>
                <span data-edit={`method.mN.${i}`} data-edit-max="60" className={s.mN}>{m.n}</span>
                <div>
                  <h3 data-edit={`method.title.${i}`} data-edit-max="40">{m.t}</h3>
                  <p data-edit={`method.body.${i}`} data-edit-max="240" data-edit-multiline>{m.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.kryss-totem"
                slug="kryss-totem"
                alt="A tall freestanding sign totem outdoors on a paved plaza under overcast light"
              />
              <figcaption data-edit="method.caption" data-edit-max="120" data-edit-multiline>Totem, K-42. Read at 30 m, 12 m and 2 m, in that order.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.kryss-model"
                slug="kryss-model"
                alt="A small scale model of a station concourse with miniature sign panels"
              />
              <figcaption data-edit="method.caption2" data-edit-max="120" data-edit-multiline>1:100. Cheaper than being wrong at full size.</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------------------------------------------- ROUTE BAND */}
        <section className={s.routeBand} aria-hidden="true">
          <div data-edit-pattern="routeBand.field" data-edit-roles="transparent,2,1,3" className={s.routeField}>
            <TabbiedPattern
              pattern={metro}
              palette={['transparent', GREEN, INK, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={3200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ----------------------------------------------------------- WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <div data-edit-pattern="work.field" data-edit-roles="transparent,3,4" className={s.workField} aria-hidden="true">
            <TabbiedPattern
              pattern={bothways}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={112}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.workInner}>
            <h2 data-edit="work.h2" data-edit-max="60" className={s.h2} id="work-h">
              Recent schemes
            </h2>
            <ol className={s.table}>
              <li className={s.thead} aria-hidden="true">
                <span data-edit="work.text" data-edit-max="60">Job</span>
                <span data-edit="work.text2" data-edit-max="60">Client</span>
                <span data-edit="work.text3" data-edit-max="60">Type</span>
                <span data-edit="work.text4" data-edit-max="60">Decision points</span>
                <span data-edit="work.text5" data-edit-max="60">Year</span>
              </li>
              {PROJECTS.map((p, i) => (
                <li key={p.code}>
                  <span data-edit={`work.code.${i}`} data-edit-max="60" className={s.code}>{p.code}</span>
                  <span data-edit={`work.client.${i}`} data-edit-max="60" className={s.client}>{p.client}</span>
                  <span data-edit={`work.kind.${i}`} data-edit-max="60" className={s.kind}>{p.kind}</span>
                  <span data-edit={`work.pts.${i}`} data-edit-max="60" className={s.pts}>{p.pts}</span>
                  <span data-edit={`work.year.${i}`} data-edit-max="60" className={s.year}>{p.year}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- TESTING */}
        <section id="testing" className={s.testing} aria-labelledby="testing-h">
          <h2 data-edit="testing.h2" data-edit-max="60" className={s.h2} id="testing-h">
            Testing
          </h2>
          <div className={s.testGrid}>
            <p data-edit="testing.big" data-edit-max="240" data-edit-multiline className={s.big}>
              Twelve strangers, one destination each, one stopwatch. If more than
              two of them stop and look around, the sign is in the wrong place
              and we move it before anyone signs off.
            </p>
            <div className={s.testCol}>
              <p data-edit="testing.body" data-edit-max="240" data-edit-multiline>
                The report goes to the client with the failure rate on the first
                page, not in an appendix. In eleven of forty-six schemes the
                first round failed, and saying so is the entire value of doing
                it.
              </p>
              <p data-edit="testing.body2" data-edit-max="240" data-edit-multiline>
                We test again after installation, with different people, in the
                weather the building actually gets. Signs that work in June and
                fail in a January afternoon are a real category.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure editId="photo.kryss-floor"
              slug="kryss-floor"
              alt="A painted green directional stripe running across a pale concrete floor"
            />
            <figcaption data-edit="testing.caption" data-edit-max="120" data-edit-multiline>K-33. When the ceiling is too high to hang from, use the floor.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div data-edit-pattern="studio.field" data-edit-roles="transparent,2,3" className={s.studioField} aria-hidden="true">
            <TabbiedPattern
              pattern={trigram}
              palette={['transparent', GREEN, GREY]}
              fit="grid"
              cellSize={88}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.studioInner}>
            <h2 data-edit="studio.h2" data-edit-max="60" className={s.h2} id="studio-h">
              Studio
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="studio.term" data-edit-max="28">Office</dt>
                <dd data-edit="studio.body3" data-edit-max="200" data-edit-multiline>
                  Youngstorget 3
                  <br />
                  0181 Oslo
                </dd>
              </div>
              <div>
                <dt data-edit="studio.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="studio.link" data-edit-max="28" href="mailto:skilt@kryss.example">skilt@kryss.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="studio.term3" data-edit-max="28">Engage us</dt>
                <dd data-edit="studio.body" data-edit-max="200" data-edit-multiline>At plan stage. Signs cannot fix a corridor that lies.</dd>
              </div>
              <div>
                <dt data-edit="studio.term4" data-edit-max="28">Team</dt>
                <dd data-edit="studio.body2" data-edit-max="200" data-edit-multiline>Seven, of whom two are always on site somewhere</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three ways a sign fails</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Almost never legibility. These three account for most of what we are called in to fix.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={staple}
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
                  <Figure editId="photo.kryss-tile-arrow-cutout" slug="kryss-tile-arrow-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">It is not at a decision</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>A sign twenty metres past the fork is worse than no sign, because it confirms a choice already made. We map the forks first and hang signs only there.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={trigram}
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
                  <Figure editId="photo.kryss-tile-plate-cutout" slug="kryss-tile-plate-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">It uses the wrong name</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>The org chart says Department of Ambulatory Services. Everybody says the day unit. The sign that says both is the sign that works.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dotmatrix}
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
                  <Figure editId="photo.kryss-tile-totem-cutout" slug="kryss-tile-totem-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">It arrives too late</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Read at thirty metres, twelve metres and two metres, in that order, with a different amount of information at each. Most systems only design the last one.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Typography and materials</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>The house specification. Deviating from it needs a reason written down.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Element</span>
                <span data-edit="index.text2" data-edit-max="60">Specification</span>
                <span data-edit="index.text3" data-edit-max="60">Minimum</span>
                <span data-edit="index.text4" data-edit-max="60">Note</span>
            </li>
              <li key="Primary destination">
                <span data-edit="index.text5" data-edit-max="60">Primary destination</span>
                <span data-edit="index.text6" data-edit-max="60">Inter, 500</span>
                <span data-edit="index.text7" data-edit-max="60">35 mm cap</span>
                <span data-edit="index.text8" data-edit-max="60">At 12 m reading distance</span>
              </li>
              <li key="Secondary">
                <span data-edit="index.text9" data-edit-max="60">Secondary</span>
                <span data-edit="index.text10" data-edit-max="60">Inter, 400</span>
                <span data-edit="index.text11" data-edit-max="60">22 mm cap</span>
                <span data-edit="index.text12" data-edit-max="60">Never more than four per panel</span>
              </li>
              <li key="Arrow">
                <span data-edit="index.text13" data-edit-max="60">Arrow</span>
                <span data-edit="index.text14" data-edit-max="60">Drawn, house</span>
                <span data-edit="index.text15" data-edit-max="60">Cap height</span>
                <span data-edit="index.text16" data-edit-max="60">Leading edge aligns to type</span>
              </li>
              <li key="Panel">
                <span data-edit="index.text17" data-edit-max="60">Panel</span>
                <span data-edit="index.text18" data-edit-max="60">Anodised aluminium</span>
                <span data-edit="index.text19" data-edit-max="60">3 mm</span>
                <span data-edit="index.text20" data-edit-max="60">Powder coat on the reverse</span>
              </li>
              <li key="Contrast">
                <span data-edit="index.text21" data-edit-max="60">Contrast</span>
                <span data-edit="index.text22" data-edit-max="60">70 % minimum</span>
                <span data-edit="index.text23" data-edit-max="60">LRV difference</span>
                <span data-edit="index.text24" data-edit-max="60">Measured, not judged</span>
              </li>
              <li key="Mounting">
                <span data-edit="index.text25" data-edit-max="60">Mounting</span>
                <span data-edit="index.text26" data-edit-max="60">Suspended or post</span>
                <span data-edit="index.text27" data-edit-max="60">2 100 mm</span>
                <span data-edit="index.text28" data-edit-max="60">Clear headroom</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Questions from clients</h2>
          <dl className={s.faqList}>
              <div key="Can you just do the sign">
                <dt data-edit="faq.term" data-edit-max="28">Can you just do the signs?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>We can, and it will not work. If the corridor lies, no sign fixes it. We would rather tell you that in week one than in year two.</dd>
              </div>
              <div key="How long does a scheme t">
                <dt data-edit="faq.term2" data-edit-max="28">How long does a scheme take?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Four to nine months depending on size. Testing is six weeks of it and it is not the part to compress.</dd>
              </div>
              <div key="Do you handle fabricatio">
                <dt data-edit="faq.term3" data-edit-max="28">Do you handle fabrication?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>No. We specify, tender and inspect. Keeping the design and the fabrication separate is how we can reject a batch.</dd>
              </div>
              <div key="What if the building cha">
                <dt data-edit="faq.term4" data-edit-max="28">What if the building changes?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>The system is drawn so panels can be replaced individually. Nobody has ever regretted that and several clients have regretted the alternative.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={ell}
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
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Kryss</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Skiltdesign, Youngstorget 3, Oslo, siden 2011.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Practice</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.method" data-edit-max="28" href="#method">Four steps</a>
              </li>
              <li>
                <a data-edit="footer.work" data-edit-max="28" href="#work">Recent schemes</a>
              </li>
              <li>
                <a data-edit="footer.testing" data-edit-max="28" href="#testing">Testing</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Studio</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.studio" data-edit-max="28" href="#studio">Youngstorget 3</a>
              </li>
              <li>
                <a data-edit="footer.studio2" data-edit-max="28" href="#studio">Engage us</a>
              </li>
              <li>
                <a data-edit="footer.studio3" data-edit-max="28" href="#studio">The team</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Youngstorget 3
              <br />
              0181 Oslo
              <br />
              skilt@kryss.example
              <br />
              Seven people
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional wayfinding studio. Prices and times are invented.</p>
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
