import { TabbiedPattern } from 'tabbied/react';
import {
  abutment, caltrop, doublebar, fulcrum, hilbert, recession, trigram,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './mesura.module.css';

export const metadata = {
  title: 'Mesura: Structural Engineering, Barcelona',
  description:
    'Mesura is a structural engineering office in Barcelona. Long-span steel, post-tensioned concrete, and the arithmetic that holds them up.',
};

/* Paper, ink, one orange, two greys. Pattern fields take `transparent` in the
   background slot so the paper reads through every gap. */
const INK = '#15171A';
const ORANGE = '#FF6A00';
const STEEL = '#8C9096';
const PALE = '#D9D8D2';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = PALE;


const CAPABILITIES = [
  { n: '01', t: 'Long-span steel', d: 'Trusses, arches and space frames from 30 to 180 metres. Fabrication drawings issued from the same model we analysed.' },
  { n: '02', t: 'Post-tensioned concrete', d: 'Flat slabs and transfer structures. We draw the tendon layout before the architect fixes the column grid, and say why.' },
  { n: '03', t: 'Assessment and reuse', d: 'Load testing and capacity checks on structures older than the codes that would condemn them. Most of them pass.' },
  { n: '04', t: 'Seismic retrofit', d: 'Base isolation, added damping, and the unglamorous work of tying a floor plate back to a wall it was never connected to.' },
  { n: '05', t: 'Facade engineering', d: 'Movement joints, restraint, thermal bridging. The part of the building that everybody photographs and nobody calculates.' },
  { n: '06', t: 'Expert witness', d: 'Twenty-two cases, eleven for claimants. We write the report we would defend at a viva.' },
];

const PROJECTS = [
  { code: 'M-231', name: 'Mercat de la Vall', span: '64 m', mat: 'Steel arch', year: '2026', role: 'Full design' },
  { code: 'M-228', name: 'Pont de Sant Roc', span: '112 m', mat: 'Composite box', year: '2025', role: 'Full design' },
  { code: 'M-219', name: 'Nau 7, Poblenou', span: '31 m', mat: 'Reuse, timber added', year: '2025', role: 'Assessment' },
  { code: 'M-207', name: 'Torre Aigua', span: '9 storeys', mat: 'PT flat slab', year: '2024', role: 'Full design' },
  { code: 'M-198', name: 'Escola Bruguera', span: '22 m', mat: 'Seismic retrofit', year: '2023', role: 'Retrofit' },
];

const NUMBERS = [
  ['231', 'Jobs opened since 2004'],
  ['180 m', 'Longest span built'],
  ['0', 'Structures lost'],
  ['14', 'Engineers'],
];

export default function MesuraPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f2f1ed',
        '--ink': '#15171a',
        '--orange': '#ff6a00',
        '--steel': '#8c9096',
        '--pale': '#d9d8d2',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,orange,steel,pale"
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
          Mesura
          <i>Enginyeria d'Estructures</i>
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.what" data-edit-max="28" href="#what">Capabilities</a>
          <a data-edit="bar.work" data-edit-max="28" href="#work">Work</a>
          <a data-edit="bar.method" data-edit-max="28" href="#method">Method</a>
          <a data-edit="bar.office" data-edit-max="28" href="#office">Office</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={trigram}
              palette={['transparent', STEEL, ORANGE]}
              fit="grid"
              cellSize={118}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Barcelona / est. 2004</p>
            <h1>
              Every structure is
              <br />
              an argument about
              <br />
              <span data-edit="hero.text" data-edit-max="60">where the load goes.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              We make that argument in writing, with numbers anyone in the room
              can check, before anybody orders steel.
            </p>
          </div>
          <dl className={s.numbers}>
            {NUMBERS.map(([v, k], i) => (
              <div key={k}>
                <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.mesura-truss"
            slug="mesura-truss"
            alt="A steel roof truss under construction against an overcast sky, joints in orange primer"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>M-231 / Mercat de la Vall. Arch closed 14.03.2026.</figcaption>
        </figure>

        {/* ---------------------------------------------------- CAPABILITIES */}
        <section id="what" className={s.what} aria-labelledby="what-h">
          <h2 data-edit="what.h2" data-edit-max="60" id="what-h" className={s.h2}>
            Six things we do
          </h2>
          <ol className={s.caps}>
            {CAPABILITIES.map((c, i) => (
              <li key={c.n}>
                <span data-edit={`what.capN.${i}`} data-edit-max="60" className={s.capN}>{c.n}</span>
                <h3 data-edit={`what.title.${i}`} data-edit-max="40">{c.t}</h3>
                <p data-edit={`what.body.${i}`} data-edit-max="240" data-edit-multiline>{c.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------- LOAD-PATH BAND */}
        <section className={s.loadBand} aria-hidden="true">
          <div data-edit-pattern="loadBand.field" data-edit-roles="transparent,1,2,3" className={s.loadField}>
            <TabbiedPattern
              pattern={caltrop}
              palette={['transparent', INK, ORANGE, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={3600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <h2 data-edit="work.h2" data-edit-max="60" id="work-h" className={s.h2}>
            Recent work
          </h2>
          <ol className={s.projects}>
            <li className={s.projHead} aria-hidden="true">
              <span data-edit="work.text" data-edit-max="60">Job</span>
              <span data-edit="work.text2" data-edit-max="60">Name</span>
              <span data-edit="work.text3" data-edit-max="60">Span</span>
              <span data-edit="work.text4" data-edit-max="60">Structure</span>
              <span data-edit="work.text5" data-edit-max="60">Role</span>
              <span data-edit="work.text6" data-edit-max="60">Year</span>
            </li>
            {PROJECTS.map((p, i) => (
              <li key={p.code}>
                <span data-edit={`work.pCode.${i}`} data-edit-max="60" className={s.pCode}>{p.code}</span>
                <span data-edit={`work.pName.${i}`} data-edit-max="60" className={s.pName}>{p.name}</span>
                <span data-edit={`work.pSpan.${i}`} data-edit-max="60" className={s.pSpan}>{p.span}</span>
                <span data-edit={`work.text7.${i}`} data-edit-max="60">{p.mat}</span>
                <span data-edit={`work.text8.${i}`} data-edit-max="60">{p.role}</span>
                <span data-edit={`work.pYear.${i}`} data-edit-max="60" className={s.pYear}>{p.year}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure editId="photo.mesura-testrig"
                slug="mesura-testrig"
                alt="A laboratory load test rig pressing a concrete beam to failure"
              />
              <figcaption data-edit="work.caption" data-edit-max="120" data-edit-multiline>Beam test to failure, 486 kN. The model said 471.</figcaption>
            </figure>
            <figure>
              <Figure editId="photo.mesura-bearing"
                slug="mesura-bearing"
                alt="A close view of a large steel bridge bearing between abutment and deck"
              />
              <figcaption data-edit="work.caption2" data-edit-max="120" data-edit-multiline>M-228, pot bearing at abutment B. ±48 mm.</figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <div data-edit-pattern="method.field" data-edit-roles="transparent,3,4" className={s.methodField} aria-hidden="true">
            <TabbiedPattern
              pattern={fulcrum}
              palette={['transparent', STEEL, PALE]}
              fit="grid"
              cellSize={112}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.methodInner}>
            <h2 data-edit="method.h2" data-edit-max="60" id="method-h" className={s.h2}>
              How the work is checked
            </h2>
            <div className={s.methodGrid}>
              <div>
                <p data-edit="method.big" data-edit-max="240" data-edit-multiline className={s.big}>
                  Every load path is calculated twice, by two people, in two
                  ways. If the answers differ by more than five per cent, we stop
                  and find out which of us is wrong.
                </p>
                <p data-edit="method.small" data-edit-max="240" data-edit-multiline className={s.small}>
                  The second calculation is done by hand, on paper, at a scale
                  the first engineer cannot see. It catches modelling errors that
                  no amount of mesh refinement will.
                </p>
              </div>
              <ol className={s.steps}>
                <li>
                  <span data-edit="method.text" data-edit-max="60">A</span>
                  <div>
                    <h3 data-edit="method.title" data-edit-max="40">Scheme by hand</h3>
                    <p data-edit="method.body" data-edit-max="240" data-edit-multiline>Sketch, span-to-depth, a load take-down on one sheet. Before any model exists.</p>
                  </div>
                </li>
                <li>
                  <span data-edit="method.text2" data-edit-max="60">B</span>
                  <div>
                    <h3 data-edit="method.title2" data-edit-max="40">Model and analyse</h3>
                    <p data-edit="method.body2" data-edit-max="240" data-edit-multiline>Linear first, non-linear only where the answer depends on it. Every model is archived with its inputs.</p>
                  </div>
                </li>
                <li>
                  <span data-edit="method.text3" data-edit-max="60">C</span>
                  <div>
                    <h3 data-edit="method.title3" data-edit-max="40">Independent check</h3>
                    <p data-edit="method.body3" data-edit-max="240" data-edit-multiline>A second engineer, a different method, no sight of the first result until both are finished.</p>
                  </div>
                </li>
                <li>
                  <span data-edit="method.text4" data-edit-max="60">D</span>
                  <div>
                    <h3 data-edit="method.title4" data-edit-max="40">On site</h3>
                    <p data-edit="method.body4" data-edit-max="240" data-edit-multiline>We attend the first of every connection type. Drawings are wrong until proven otherwise.</p>
                  </div>
                </li>
              </ol>
            </div>
            <figure className={s.wide}>
              <Figure editId="photo.mesura-drawings"
                slug="mesura-drawings"
                alt="Structural drawings and a scale rule laid out on a plain table"
              />
              <figcaption data-edit="method.caption" data-edit-max="120" data-edit-multiline>Issue C, M-231. Twelve sheets, one revision cloud.</figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <div data-edit-pattern="office.field" data-edit-roles="transparent,2,3" className={s.officeField} aria-hidden="true">
            <TabbiedPattern
              pattern={hilbert}
              palette={['transparent', ORANGE, STEEL]}
              fit="grid"
              cellSize={78}
              redrawInterval={4000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.officeInner}>
            <h2 data-edit="office.h2" data-edit-max="60" className={s.h2} id="office-h">
              Carrer de Pujades 118
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="office.term" data-edit-max="28">Office</dt>
                <dd>
                  Carrer de Pujades 118, 3r
                  <br />
                  08005 Barcelona
                </dd>
              </div>
              <div>
                <dt data-edit="office.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="office.link" data-edit-max="28" href="mailto:calcul@mesura.example">calcul@mesura.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="office.term3" data-edit-max="28">Call</dt>
                <dd data-edit="office.body" data-edit-max="200" data-edit-multiline>+34 900 000 000</dd>
              </div>
              <div>
                <dt data-edit="office.term4" data-edit-max="28">Hiring</dt>
                <dd data-edit="office.body2" data-edit-max="200" data-edit-multiline>Two engineers, any level. Send calculations, not a CV.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three failure modes we design against</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Collapse is rare. These three are what actually goes wrong and what most of the calculation is really for.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={trigram}
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
                  <Figure editId="photo.mesura-tile-rule-cutout" slug="mesura-tile-rule-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Serviceability, not strength</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Almost nothing fails in bending. Things fail by deflecting, cracking, or vibrating enough that people stop using the room.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={doublebar}
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
                  <Figure editId="photo.mesura-tile-beam-cutout" slug="mesura-tile-beam-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">The connection, not the member</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>The member is a catalogue page. The joint is a decision, and it is where the load actually has to be believed.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
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
                  <Figure editId="photo.mesura-tile-calipers-cutout" slug="mesura-tile-calipers-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Time</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Creep, shrinkage, thermal cycling, and the fact that a building is loaded for eighty years and analysed for an afternoon.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Codes and software</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>What we work to and what we work in. Listed because clients and checking engineers both ask.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Standard</span>
                <span data-edit="index.text2" data-edit-max="60">Scope</span>
                <span data-edit="index.text3" data-edit-max="60">Version</span>
                <span data-edit="index.text4" data-edit-max="60">Note</span>
            </li>
              <li key="Eurocode 0 to 8">
                <span data-edit="index.text5" data-edit-max="60">Eurocode 0 to 8</span>
                <span data-edit="index.text6" data-edit-max="60">All work</span>
                <span data-edit="index.text7" data-edit-max="60">EN, Spanish NA</span>
                <span data-edit="index.text8" data-edit-max="60">Plus CTE where it applies</span>
              </li>
              <li key="CTE DB SE">
                <span data-edit="index.text9" data-edit-max="60">CTE DB SE</span>
                <span data-edit="index.text10" data-edit-max="60">Buildings</span>
                <span data-edit="index.text11" data-edit-max="60">2019</span>
                <span data-edit="index.text12" data-edit-max="60">National</span>
              </li>
              <li key="EHE-08">
                <span data-edit="index.text13" data-edit-max="60">EHE-08</span>
                <span data-edit="index.text14" data-edit-max="60">Concrete</span>
                <span data-edit="index.text15" data-edit-max="60">2008</span>
                <span data-edit="index.text16" data-edit-max="60">Still current</span>
              </li>
              <li key="FEM, in house">
                <span data-edit="index.text17" data-edit-max="60">FEM, in house</span>
                <span data-edit="index.text18" data-edit-max="60">Analysis</span>
                <span data-edit="index.text19" data-edit-max="60">Linear and non-linear</span>
                <span data-edit="index.text20" data-edit-max="60">Every model archived with inputs</span>
              </li>
              <li key="Hand check">
                <span data-edit="index.text21" data-edit-max="60">Hand check</span>
                <span data-edit="index.text22" data-edit-max="60">Everything</span>
                <span data-edit="index.text23" data-edit-max="60">Paper</span>
                <span data-edit="index.text24" data-edit-max="60">A second engineer, a different method</span>
              </li>
              <li key="BIM">
                <span data-edit="index.text25" data-edit-max="60">BIM</span>
                <span data-edit="index.text26" data-edit-max="60">Coordination</span>
                <span data-edit="index.text27" data-edit-max="60">IFC 4</span>
                <span data-edit="index.text28" data-edit-max="60">We issue the model and the drawings</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Questions from architects</h2>
          <dl className={s.faqList}>
              <div key="When do you want to be i">
                <dt data-edit="faq.term" data-edit-max="28">When do you want to be involved?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>At the sketch. A structural scheme costs almost nothing in week two and costs a redesign in week forty.</dd>
              </div>
              <div key="Will you tell us it cann">
                <dt data-edit="faq.term2" data-edit-max="28">Will you tell us it cannot be done?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Rarely. We will tell you what it costs, in depth, in money and in programme, and let you decide whether the idea is worth it.</dd>
              </div>
              <div key="Can we use your model?">
                <dt data-edit="faq.term3" data-edit-max="28">Can we use your model?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Yes, as IFC, with a note saying what it is and is not for. It is an analysis model, not a fabrication model, and confusing the two is expensive.</dd>
              </div>
              <div key="Do you do the site work?">
                <dt data-edit="faq.term4" data-edit-max="28">Do you do the site work?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>We attend the first of every connection type and then monthly. Drawings are wrong until somebody has stood under them.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={abutment}
              palette={['transparent', PALE, STEEL]}
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
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Mesura</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Structural engineering at Carrer de Pujades 118, Barcelona, since 2004.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Engineering</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.what" data-edit-max="28" href="#what">Capabilities</a>
              </li>
              <li>
                <a data-edit="footer.work" data-edit-max="28" href="#work">Recent work</a>
              </li>
              <li>
                <a data-edit="footer.method" data-edit-max="28" href="#method">How work is checked</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Practice</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.office" data-edit-max="28" href="#office">Carrer de Pujades 118</a>
              </li>
              <li>
                <a data-edit="footer.office2" data-edit-max="28" href="#office">Hiring</a>
              </li>
              <li>
                <a data-edit="footer.what2" data-edit-max="28" href="#what">Expert witness</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Carrer de Pujades 118, 3r
              <br />
              08005 Barcelona
              <br />
              calcul@mesura.example
              <br />
              +34 900 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional engineering office. Prices and times are invented.</p>
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
