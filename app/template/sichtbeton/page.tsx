import { TabbiedPattern } from 'tabbied/react';
import {
  chase, dieblock, gritfield, keyway, recession, subdivide,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './sichtbeton.module.css';

export const metadata = {
  title: 'Sichtbeton: Betontechnologie, Zürich',
  description:
    'Sichtbeton advises on fair-faced concrete: mix design, formwork, curing, and the site trials that decide whether a wall is acceptable before it is poured.',
};

/* Grey paper, near-black ink, one safety orange. Every pattern field takes
   `transparent` in its background slot. */
const INK = '#131313';
const ORANGE = '#FF5A00';
const STEEL = '#8B8B87';
const PALE = '#D3D3CE';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = PALE;


const CLASSES = [
  { c: 'SB 1', use: 'Basements, plant rooms', form: 'Any', tol: 'Joints ± 20 mm', trial: 'None' },
  { c: 'SB 2', use: 'Stair cores, back of house', form: 'Sheet, unspecified', tol: 'Joints ± 15 mm', trial: 'None' },
  { c: 'SB 3', use: 'Visible interiors', form: 'Specified panel, sequenced', tol: 'Joints ± 10 mm', trial: '1 panel' },
  { c: 'SB 4', use: 'Facades, exposed halls', form: 'Board-marked, numbered', tol: 'Joints ± 5 mm', trial: '2 panels' },
];

const CHECKS = [
  { n: '01', t: 'Mix before form', d: 'A mix is chosen for colour, workability and bleed before anyone draws a panel layout. Doing it the other way round is how walls come out mottled.' },
  { n: '02', t: 'One cement, one quarry', d: 'A single delivery source for the whole visible surface. Change the quarry mid-pour and no amount of curing will hide it.' },
  { n: '03', t: 'Trial panels, full height', d: 'Two panels, cast on site, in the weather the real pour will get. Signed off by the architect before the first real lift.' },
  { n: '04', t: 'Curing is the finish', d: 'The wall is decided in the first seven days. We write the curing regime into the contract and inspect it, because nobody else will.' },
];

const NUMBERS = [
  ['SB 1 to 4', 'Classes advised'],
  ['214', 'Trial panels witnessed'],
  ['7 d', 'Curing, minimum'],
  ['0', 'Walls we have agreed to render'],
];

export default function SichtbetonPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--grey-p': '#e9e9e6',
        '--ink': '#131313',
        '--orange': '#ff5a00',
        '--steel': '#8b8b87',
        '--pale': '#d3d3ce',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="grey-p,ink,orange,steel,pale"
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
          Sichtbeton
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.classes" data-edit-max="28" href="#classes">Classes</a>
          <a data-edit="bar.checks" data-edit-max="28" href="#checks">Checks</a>
          <a data-edit="bar.trials" data-edit-max="28" href="#trials">Trials</a>
          <a data-edit="bar.office" data-edit-max="28" href="#office">Office</a>
        </nav>
        <span data-edit="bar.meta" data-edit-max="60" className={s.meta}>Betontechnologie / Zürich</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={subdivide}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={176}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Betontechnologie / seit 1996</p>
            <h1>
              A fair-faced wall
              <br />
              is decided before
              <br />
              <span data-edit="hero.text" data-edit-max="60">anybody pours it.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Mix design, formwork strategy, trial panels and curing. We are the
              people who say no in week four so nobody has to say it in week
              forty.
            </p>
          </div>
        </section>

        {/* The wall itself, edge to edge, cropped so the tie holes set the
            page's rhythm before any text does. */}
        <figure className={s.bleed}>
          <Figure editId="photo.sichtbeton-wall"
            slug="sichtbeton-wall"
            alt="A large board-marked fair-faced concrete wall with tie holes in a regular grid"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>SB 4, board-marked, tie grid at 1,200 mm. Cast in November.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* -------------------------------------------------------- CLASSES */}
        <section id="classes" className={s.classes} aria-labelledby="classes-h">
          <h2 data-edit="classes.h2" data-edit-max="60" className={s.h2} id="classes-h">
            Four classes
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span data-edit="classes.text" data-edit-max="60">Class</span>
              <span data-edit="classes.text2" data-edit-max="60">Typical use</span>
              <span data-edit="classes.text3" data-edit-max="60">Formwork</span>
              <span data-edit="classes.text4" data-edit-max="60">Tolerance</span>
              <span data-edit="classes.text5" data-edit-max="60">Trial</span>
            </li>
            {CLASSES.map((c, i) => (
              <li key={c.c}>
                <span data-edit={`classes.cls.${i}`} data-edit-max="60" className={s.cls}>{c.c}</span>
                <span data-edit={`classes.use.${i}`} data-edit-max="60" className={s.use}>{c.use}</span>
                <span data-edit={`classes.text6.${i}`} data-edit-max="60">{c.form}</span>
                <span data-edit={`classes.num.${i}`} data-edit-max="60" className={s.num}>{c.tol}</span>
                <span data-edit={`classes.none.${i}`} data-edit-max="60" className={c.trial === 'None' ? s.none : s.req}>{c.trial}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- TIE BAND */}
        <section className={s.tieBand} aria-hidden="true">
          <div data-edit-pattern="tieBand.field" data-edit-roles="transparent,1,2,3" className={s.tieField}>
            <TabbiedPattern
              pattern={chase}
              palette={['transparent', INK, ORANGE, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={3800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- CHECKS */}
        <section id="checks" className={s.checks} aria-labelledby="checks-h">
          <div data-edit-pattern="checks.field" data-edit-roles="transparent,3,4" className={s.checksField} aria-hidden="true">
            <TabbiedPattern
              pattern={keyway}
              palette={['transparent', STEEL, PALE]}
              fit="grid"
              cellSize={98}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.checksInner}>
            <h2 data-edit="checks.h2" data-edit-max="60" className={s.h2} id="checks-h">
              Four things that decide the wall
            </h2>
            <ol className={s.checkList}>
              {CHECKS.map((c, i) => (
                <li key={c.n}>
                  <span data-edit={`checks.chN.${i}`} data-edit-max="60" className={s.chN}>{c.n}</span>
                  <h3 data-edit={`checks.title.${i}`} data-edit-max="40">{c.t}</h3>
                  <p data-edit={`checks.body.${i}`} data-edit-max="240" data-edit-multiline>{c.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.sichtbeton-formwork"
                  slug="sichtbeton-formwork"
                  alt="Timber formwork panels stacked and braced on a construction site"
                />
                <figcaption data-edit="checks.caption" data-edit-max="120" data-edit-multiline>Panels numbered and sequenced. Reuse is capped at four.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.sichtbeton-rebar"
                  slug="sichtbeton-rebar"
                  alt="A dense reinforcement cage tied and waiting for a pour, seen from above"
                />
                <figcaption data-edit="checks.caption2" data-edit-max="120" data-edit-multiline>Cover checked twice: once by the steelfixer, once by us.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- TRIALS */}
        <section id="trials" className={s.trials} aria-labelledby="trials-h">
          <h2 data-edit="trials.h2" data-edit-max="60" className={s.h2} id="trials-h">
            Trial panels
          </h2>
          <div className={s.trialGrid}>
            <p data-edit="trials.big" data-edit-max="240" data-edit-multiline className={s.big}>
              Two panels, full height, cast on the site by the crew who will do
              the real pour, in whatever weather turns up. Then everybody stands
              in front of them and agrees, in writing, what acceptable means.
            </p>
            <div className={s.trialCol}>
              <p data-edit="trials.body" data-edit-max="240" data-edit-multiline>
                A photograph is not a trial panel. Neither is a sample from
                another job, another supplier or another season. Concrete is a
                local material and the panel is the only honest specification.
              </p>
              <p data-edit="trials.body2" data-edit-max="240" data-edit-multiline>
                The signed panel stays on site until practical completion. When
                a dispute happens, and it does, the wall is compared to the
                panel and not to anybody's memory of the panel.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure editId="photo.sichtbeton-cylinder"
              slug="sichtbeton-cylinder"
              alt="Concrete test cylinders standing on a laboratory bench beside a compression machine"
            />
            <figcaption data-edit="trials.caption" data-edit-max="120" data-edit-multiline>Cubes at 7 and 28 days. Colour is judged on the panel, not on these.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <div data-edit-pattern="office.field" data-edit-roles="transparent,2,3" className={s.officeField} aria-hidden="true">
            <TabbiedPattern
              pattern={gritfield}
              palette={['transparent', ORANGE, STEEL]}
              fit="grid"
              cellSize={54}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.officeInner}>
            <h2 data-edit="office.h2" data-edit-max="60" className={s.h2} id="office-h">
              Engaging us
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="office.term" data-edit-max="28">Office</dt>
                <dd>
                  Hardturmstrasse 260
                  <br />
                  8005 Zürich
                </dd>
              </div>
              <div>
                <dt data-edit="office.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="office.link" data-edit-max="28" href="mailto:beton@sichtbeton.example">beton@sichtbeton.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="office.term3" data-edit-max="28">When</dt>
                <dd data-edit="office.body" data-edit-max="200" data-edit-multiline>At concept design. Later is possible and more expensive.</dd>
              </div>
              <div>
                <dt data-edit="office.term4" data-edit-max="28">Site work</dt>
                <dd data-edit="office.body2" data-edit-max="200" data-edit-multiline>Trial panel witnessing, first lift, and a weekly walk.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three things that show on a finished wall</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Invisible in the specification, unmissable in daylight, permanent either way.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={gritfield}
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
                  <Figure editId="photo.sichtbeton-tile-cube-cutout" slug="sichtbeton-tile-cube-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">The joint</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Day joints and panel joints are the drawing. Set them out with the architect at 1:20 and they read as intent rather than as an accident.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={keyway}
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
                  <Figure editId="photo.sichtbeton-tile-cone-cutout" slug="sichtbeton-tile-cone-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">The pour</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Rate, vibration and lift height. Most blowholes and most colour variation are decided in the ninety minutes the concrete is moving.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={subdivide}
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
                  <Figure editId="photo.sichtbeton-tile-cylinder-cutout" slug="sichtbeton-tile-cylinder-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">The cure</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Seven days minimum, and the wall is finished in the first three. Strip early and you get a lighter, chalkier surface nobody can fix later.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Typical mix, SB 4</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>One example, published because clients ask what a fair-faced specification actually contains.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Constituent</span>
                <span data-edit="index.text2" data-edit-max="60">Quantity</span>
                <span data-edit="index.text3" data-edit-max="60">Source</span>
                <span data-edit="index.text4" data-edit-max="60">Note</span>
            </li>
              <li key="CEM I 42,5 N">
                <span data-edit="index.text5" data-edit-max="60">CEM I 42,5 N</span>
                <span data-edit="index.text6" data-edit-max="60">340 kg/m³</span>
                <span data-edit="index.text7" data-edit-max="60">Single works</span>
                <span data-edit="index.text8" data-edit-max="60">No change mid-project</span>
              </li>
              <li key="Aggregate, 0/16">
                <span data-edit="index.text9" data-edit-max="60">Aggregate, 0/16</span>
                <span data-edit="index.text10" data-edit-max="60">1 810 kg/m³</span>
                <span data-edit="index.text11" data-edit-max="60">Single quarry</span>
                <span data-edit="index.text12" data-edit-max="60">Washed, graded</span>
              </li>
              <li key="Water">
                <span data-edit="index.text13" data-edit-max="60">Water</span>
                <span data-edit="index.text14" data-edit-max="60">153 l/m³</span>
                <span data-edit="index.text15" data-edit-max="60">Mains</span>
                <span data-edit="index.text16" data-edit-max="60">w/c 0.45</span>
              </li>
              <li key="Plasticiser">
                <span data-edit="index.text17" data-edit-max="60">Plasticiser</span>
                <span data-edit="index.text18" data-edit-max="60">1.2 %</span>
                <span data-edit="index.text19" data-edit-max="60">One supplier</span>
                <span data-edit="index.text20" data-edit-max="60">No retarder</span>
              </li>
              <li key="Air content">
                <span data-edit="index.text21" data-edit-max="60">Air content</span>
                <span data-edit="index.text22" data-edit-max="60">2.0 %</span>
                <span data-edit="index.text23" data-edit-max="60">Measured</span>
                <span data-edit="index.text24" data-edit-max="60">Every load</span>
              </li>
              <li key="Slump class">
                <span data-edit="index.text25" data-edit-max="60">Slump class</span>
                <span data-edit="index.text26" data-edit-max="60">F4</span>
                <span data-edit="index.text27" data-edit-max="60">Measured</span>
                <span data-edit="index.text28" data-edit-max="60">Every load</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Questions from contractors</h2>
          <dl className={s.faqList}>
              <div key="Can we reuse the formwor">
                <dt data-edit="faq.term" data-edit-max="28">Can we reuse the formwork more than four times?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Not on a visible face. Panel wear shows as a progressive lightening across a facade and there is no remedy short of replacement.</dd>
              </div>
              <div key="What if the trial panel ">
                <dt data-edit="faq.term2" data-edit-max="28">What if the trial panel is rejected?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>We cast another. Two panels are in the price precisely so that rejecting the first is a normal outcome and not an argument.</dd>
              </div>
              <div key="Do you accept a photogra">
                <dt data-edit="faq.term3" data-edit-max="28">Do you accept a photographic sample?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>No. Concrete is a local material; a photograph of somebody else's wall tells us nothing about your aggregate or your crew.</dd>
              </div>
              <div key="Can defects be repaired?">
                <dt data-edit="faq.term4" data-edit-max="28">Can defects be repaired?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Small blowholes, sometimes, by a specialist, on a sample first. Colour variation across a lift, no. That one is permanent.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={dieblock}
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
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Sichtbeton</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Betontechnologie, Hardturmstrasse 260, Zürich, seit 1996.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Advice</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.classes" data-edit-max="28" href="#classes">Four classes</a>
              </li>
              <li>
                <a data-edit="footer.checks" data-edit-max="28" href="#checks">What decides the wall</a>
              </li>
              <li>
                <a data-edit="footer.trials" data-edit-max="28" href="#trials">Trial panels</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Engagement</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.office" data-edit-max="28" href="#office">Engaging us</a>
              </li>
              <li>
                <a data-edit="footer.office2" data-edit-max="28" href="#office">Site work</a>
              </li>
              <li>
                <a data-edit="footer.classes2" data-edit-max="28" href="#classes">Tolerances</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Hardturmstrasse 260
              <br />
              8005 Zürich
              <br />
              beton@sichtbeton.example
              <br />
              Engage at concept design
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional consultancy. Prices and times are invented.</p>
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
