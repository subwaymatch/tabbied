import { TabbiedPattern } from 'tabbied/react';
import {
  chase, gravure, keyway, mortise, ortho, quire, spandrel, subdivide, windowpane,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './werkraum.module.css';

export const metadata = {
  title: 'Werkraum: Architektur, Basel',
  description:
    'Werkraum is an architecture practice in Basel. Eleven people, one room, forty-two built projects since 2009. Housing, schools, and the occasional bridge.',
};

/* Site colours. Every pattern field draws its inks from this set; the
   background slot is always `transparent`, so the pattern sits *in* the page
   colour rather than on a plate of its own. */
const INK = '#16161A';
const RED = '#D6001C';
const GREY = '#8E8E88';
const PALE = '#C9C8C1';
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;

const NAV = [
  ['01', 'Practice', '#practice'],
  ['02', 'Work', '#work'],
  ['03', 'Method', '#method'],
  ['04', 'People', '#people'],
  ['05', 'Materials', '#materials'],
  ['06', 'Awards', '#awards'],
  ['07', 'Office', '#office'],
];

type Project = {
  no: string;
  name: string;
  place: string;
  programme: string;
  year: string;
  area: string;
  status: string;
};

const WORK: Project[] = [
  { no: '42', name: 'Wohnhaus Sperrstrasse', place: 'Basel', programme: 'Housing, 24 units', year: '2026', area: '3,180 m²', status: 'On site' },
  { no: '41', name: 'Primarschule Rüti', place: 'Rüti ZH', programme: 'Primary school', year: '2025', area: '5,940 m²', status: 'Built' },
  { no: '39', name: 'Werkhof Kleinhüningen', place: 'Basel', programme: 'Depot and workshops', year: '2025', area: '2,410 m²', status: 'Built' },
  { no: '37', name: 'Steg über die Birs', place: 'Münchenstein', programme: 'Footbridge, 46 m span', year: '2024', area: '46 m', status: 'Built' },
  { no: '35', name: 'Umbau Haus Vogelsang', place: 'Riehen', programme: 'Conversion, single house', year: '2024', area: '260 m²', status: 'Built' },
  { no: '33', name: 'Genossenschaft Feldrain', place: 'Bern', programme: 'Housing, 61 units', year: '2023', area: '7,720 m²', status: 'Built' },
  { no: '31', name: 'Bibliothek Aarwangen', place: 'Aarwangen', programme: 'Library and archive', year: '2022', area: '1,860 m²', status: 'Built' },
  { no: '28', name: 'Atelierhaus Klybeck', place: 'Basel', programme: 'Studios, 14 units', year: '2021', area: '2,090 m²', status: 'Built' },
];

const METHOD = [
  {
    no: '3.1',
    title: 'One room, one conversation',
    body: 'Everyone works in the same room, at the same long table, on the same drawings. Nothing is presented internally, because nothing was ever hidden.',
  },
  {
    no: '3.2',
    title: 'Draw at 1:20 early',
    body: 'The junction decides the building. We draw the wall build-up in the second week, not the second year, and the plan follows what the wall turned out to want.',
  },
  {
    no: '3.3',
    title: 'Build what the trade knows',
    body: 'A detail no local carpenter has done before costs twice and lasts half. We invent where it matters and borrow everywhere else.',
  },
  {
    no: '3.4',
    title: 'Leave the structure visible',
    body: 'If a slab is doing work, it may as well be seen doing it. Fewer linings, fewer layers, fewer things to go wrong in year fifteen.',
  },
];

const PEOPLE = [
  ['Ines Rüegg', 'Partner, dipl. Arch ETH SIA', '2009'],
  ['Marek Haldemann', 'Partner, dipl. Arch ETH SIA', '2009'],
  ['Sofia Brenner', 'Associate, project lead', '2014'],
  ['Tobias Wyss', 'Associate, construction', '2016'],
  ['Nour Haddad', 'Architect', '2019'],
  ['Lena Fankhauser', 'Architect', '2020'],
  ['Cyril Aebi', 'Architect', '2021'],
  ['Marta Oliveira', 'Architect', '2022'],
  ['Jonas Sieber', 'Draughtsman', '2022'],
  ['Ruth Bächtold', 'Office manager', '2011'],
  ['Emil Stucki', 'Model shop', '2018'],
];

const MATERIALS = [
  { n: 'A', name: 'Fair-faced concrete', art: 'chase', body: 'Board-marked where it is touched, plain where it is not. We draw the tie grid ourselves and it is always on the drawing before tender.', img: 'werkraum-tile-concrete-cutout' },
  { n: 'B', name: 'Untreated timber', art: 'mortise', body: 'Silver-fir cladding, left to grey. Clients are shown a five-year-old sample and asked to agree to it in writing.', img: 'werkraum-tile-timber-cutout' },
  { n: 'C', name: 'Screed and terrazzo', art: 'quire', body: 'Poured on site, ground twice. The aggregate comes from within forty kilometres, which is a constraint and also the whole idea.', img: 'werkraum-tile-terrazzo-cutout' },
];

const AWARDS = [
  ['2026', 'Auszeichnung guter Bauten beider Basel', 'Wohnhaus Sperrstrasse', 'Shortlist'],
  ['2025', 'Prix Lignum, Region Mitte', 'Primarschule Rüti', 'Second prize'],
  ['2025', 'Open competition, Schulhaus Aarwangen', 'Aarwangen', 'Won, in progress'],
  ['2024', 'Best Architects 25', 'Steg über die Birs', 'Selected'],
  ['2023', 'Open competition, Genossenschaft Feldrain', 'Bern', 'Won, built'],
  ['2022', 'Swiss Timber Prize', 'Atelierhaus Klybeck', 'Nominated'],
];

const QUESTIONS = [
  { q: 'Do you work outside Switzerland?', a: 'No. Everything is built with people we can visit on a Tuesday, and the furthest site from this desk is one hundred and sixty kilometres.' },
  { q: 'Will you do a house?', a: 'Sometimes. We take one or two a year, usually a conversion, and we are honest that a small house costs proportionally more of our time than a block of twenty-four flats.' },
  { q: 'How much does a competition entry cost you?', a: 'About six weeks of one person, which is why we enter four a year rather than fifteen. We would rather lose slowly than badly.' },
  { q: 'Who draws the details?', a: 'Whoever is running the project, at the same table as everyone else. There is no separate technical department and there never will be.' },
];

const FACTS = [
  ['42', 'Built projects'],
  ['11', 'People'],
  ['17', 'Years'],
  ['1', 'Room'],
];

export default function WerkraumPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f4f3ef',
        '--ink': '#16161a',
        '--red': '#d6001c',
        '--grey': '#8e8e88',
        '--pale': '#c9c8c1',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..800&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Werkraum
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([no, label, href], i) => (
            <a key={href} href={href}>
              <span data-edit={`bar.text.${i}`} data-edit-max="60">{no}</span>
              {label}
            </a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Basel</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.field} aria-hidden="true">
            <TabbiedPattern
              pattern={ortho}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={132}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroGrid}>
            <p data-edit="hero.heroTag" data-edit-max="240" data-edit-multiline className={s.heroTag}>Architektur / Basel / seit 2009</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle}>
              We draw buildings that
              <br />
              are easy to build and
              <br />
              <em>hard to throw away.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Werkraum is eleven people in one room on Klybeckstrasse. Housing,
              schools, workshops, one footbridge. We take on six projects a year
              and finish them.
            </p>
            <dl className={s.facts}>
              {FACTS.map(([v, k], i) => (
                <div key={k}>
                  <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                  <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The one full-bleed photograph on the page, held to a letterbox so it
            reads as a plate between two pattern fields rather than as a hero. */}
        <figure className={s.plate}>
          <Figure editId="photo.werkraum-hero"
            slug="werkraum-hero"
            alt="A concrete housing block with deep window reveals under an overcast sky"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>
            42 / Wohnhaus Sperrstrasse, Basel. On site, completion autumn 2026.
          </figcaption>
        </figure>

        {/* ------------------------------------------------------ PRACTICE */}
        <section id="practice" className={s.practice} aria-labelledby="practice-h">
          <div className={s.rail}>
            <span data-edit="practice.text" data-edit-max="60">01</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.practiceBody}>
            <h2 data-edit="practice.title" data-edit-max="60" id="practice-h">The practice</h2>
            <div className={s.twoCol}>
              <p data-edit="practice.lead" data-edit-max="240" data-edit-multiline className={s.lead}>
                We were two people and a borrowed plotter in 2009. The plotter
                is still here. So is the habit of drawing every project at full
                size before anybody talks about a facade.
              </p>
              <p data-edit="practice.body" data-edit-max="240" data-edit-multiline>
                The office takes work in three sizes: a house, a block, and a
                building the town has to live with. We do not chase competitions
                we would not want to win, which means we enter about four a
                year and lose most of them cheerfully.
              </p>
              <p data-edit="practice.body2" data-edit-max="240" data-edit-multiline>
                Everything is built in Switzerland with people we can visit on a
                Tuesday. The furthest site from this desk is one hundred and
                sixty kilometres, and we would rather it stayed that way.
              </p>
            </div>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.werkraum-room"
                  slug="werkraum-room"
                  alt="A long studio table under north light with rolled drawings and cardboard models"
                />
                <figcaption data-edit="practice.caption" data-edit-max="120" data-edit-multiline>The room, Tuesday, half past nine.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.werkraum-model"
                  slug="werkraum-model"
                  alt="A grey cardboard massing model of six housing blocks on a plywood base"
                />
                <figcaption data-edit="practice.caption2" data-edit-max="120" data-edit-multiline>Massing study, 1:500, Feldrain.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- BAND / WORK */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,1,2,3" className={s.bandField}>
            <TabbiedPattern
              pattern={windowpane}
              palette={['transparent', INK, RED, GREY]}
              fit="grid"
              cellSize={144}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        <section id="work" className={s.work} aria-labelledby="work-h">
          <div className={s.rail}>
            <span data-edit="work.text" data-edit-max="60">02</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.workBody}>
            <h2 data-edit="work.title" data-edit-max="60" id="work-h">Selected work</h2>
            <p data-edit="work.workNote" data-edit-max="240" data-edit-multiline className={s.workNote}>
              Forty-two built projects. Eight shown, newest first. Numbering runs
              in the order jobs were opened, which is why it skips.
            </p>
            <ol className={s.table}>
              <li className={s.tableHead} aria-hidden="true">
                <span data-edit="work.text2" data-edit-max="60">No.</span>
                <span data-edit="work.text3" data-edit-max="60">Project</span>
                <span data-edit="work.text4" data-edit-max="60">Place</span>
                <span data-edit="work.text5" data-edit-max="60">Programme</span>
                <span data-edit="work.text6" data-edit-max="60">Area</span>
                <span data-edit="work.text7" data-edit-max="60">Year</span>
              </li>
              {WORK.map((p, i) => (
                <li key={p.no} className={s.row}>
                  <span data-edit={`work.rowNo.${i}`} data-edit-max="60" className={s.rowNo}>{p.no}</span>
                  <span className={s.rowName}>
                    {p.name}
                    <i className={p.status === 'On site' ? s.live : undefined}>
                      {p.status}
                    </i>
                  </span>
                  <span data-edit={`work.text8.${i}`} data-edit-max="60">{p.place}</span>
                  <span data-edit={`work.text9.${i}`} data-edit-max="60">{p.programme}</span>
                  <span data-edit={`work.num.${i}`} data-edit-max="60" className={s.num}>{p.area}</span>
                  <span data-edit={`work.num2.${i}`} data-edit-max="60" className={s.num}>{p.year}</span>
                </li>
              ))}
            </ol>
            <div className={s.trio}>
              <figure>
                <Figure editId="photo.werkraum-school"
                  slug="werkraum-school"
                  alt="A school courtyard with a concrete colonnade and pale timber soffits"
                />
                <figcaption data-edit="work.caption" data-edit-max="120" data-edit-multiline>41 / Primarschule Rüti</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.werkraum-bridge"
                  slug="werkraum-bridge"
                  alt="A slender steel footbridge crossing a river between bare trees"
                />
                <figcaption data-edit="work.caption2" data-edit-max="120" data-edit-multiline>37 / Steg über die Birs</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.werkraum-detail"
                  slug="werkraum-detail"
                  alt="A close view of a timber-to-concrete junction left visible on a facade"
                />
                <figcaption data-edit="work.caption3" data-edit-max="120" data-edit-multiline>39 / Werkhof, junction at 1:20</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <div data-edit-pattern="method.field" data-edit-roles="transparent,3,4" className={s.methodField} aria-hidden="true">
            <TabbiedPattern
              pattern={keyway}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={104}
              redrawInterval={6100}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.methodInner}>
            <div className={s.rail}>
              <span data-edit="method.text" data-edit-max="60">03</span>
              <span className={s.railRule} aria-hidden="true" />
            </div>
            <div>
              <h2 data-edit="method.title" data-edit-max="60" id="method-h">Four working rules</h2>
              <div className={s.methodGrid}>
                {METHOD.map((m, i) => (
                  <article key={m.no}>
                    <p data-edit={`method.mNo.${i}`} data-edit-max="240" data-edit-multiline className={s.mNo}>{m.no}</p>
                    <h3 data-edit={`method.title2.${i}`} data-edit-max="40">{m.title}</h3>
                    <p data-edit={`method.body.${i}`} data-edit-max="240" data-edit-multiline>{m.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- PEOPLE */}
        <section id="people" className={s.people} aria-labelledby="people-h">
          <div className={s.rail}>
            <span data-edit="people.text" data-edit-max="60">04</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.peopleBody}>
            <h2 data-edit="people.title" data-edit-max="60" id="people-h">Eleven people</h2>
            <ul className={s.peopleList}>
              {PEOPLE.map(([name, role, since], i) => (
                <li key={name}>
                  <span data-edit={`people.pName.${i}`} data-edit-max="60" className={s.pName}>{name}</span>
                  <span data-edit={`people.pRole.${i}`} data-edit-max="60" className={s.pRole}>{role}</span>
                  <span data-edit={`people.pSince.${i}`} data-edit-max="60" className={s.pSince}>{since}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------- MATERIALS */}
        <section id="materials" className={s.materials} aria-labelledby="materials-h">
          <div className={s.rail}>
            <span data-edit="materials.text" data-edit-max="60">05</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.materialsBody}>
            <h2 data-edit="materials.title" data-edit-max="60" id="materials-h">Three materials, mostly</h2>
            <p data-edit="materials.workNote" data-edit-max="240" data-edit-multiline className={s.workNote}>
              A short palette is not a style. It is what happens when the same
              eleven people specify the same things for seventeen years and get
              better at them.
            </p>
            <div className={s.matGrid}>
              {MATERIALS.map((m, i) => (
                <article key={m.n}>
                  {/* The decorative plate: a Tabbied pattern on a transparent
                      ground, standing in for a material sample. */}
                  <div data-edit-pattern={`materials.field.${i}`} data-edit-roles="transparent,3,4" className={s.matTile} aria-hidden="true">
                    <TabbiedPattern
                      pattern={m.art === 'chase' ? chase : m.art === 'mortise' ? mortise : quire}
                      palette={['transparent', GREY, PALE]}
                      fit="grid"
                      cellSize={72}
                      redrawInterval={5600}
                      style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                    />
                    <Figure editId={`materials.photo.${i}`} slug={m.img} alt="" cutout className={s.tileObject} />
                  </div>
                  <p data-edit={`materials.matN.${i}`} data-edit-max="240" data-edit-multiline className={s.matN}>{m.n}</p>
                  <h3 data-edit={`materials.title2.${i}`} data-edit-max="40">{m.name}</h3>
                  <p data-edit={`materials.matBody.${i}`} data-edit-max="240" data-edit-multiline className={s.matBody}>{m.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- AWARDS */}
        <section id="awards" className={s.awards} aria-labelledby="awards-h">
          <div className={s.rail}>
            <span data-edit="awards.text" data-edit-max="60">06</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.awardsBody}>
            <h2 data-edit="awards.title" data-edit-max="60" id="awards-h">Competitions and prizes</h2>
            <ol className={s.awardList}>
              {AWARDS.map(([year, what, where, result], i) => (
                <li key={`${year}-${what}`}>
                  <span data-edit={`awards.aYear.${i}`} data-edit-max="60" className={s.aYear}>{year}</span>
                  <span data-edit={`awards.aWhat.${i}`} data-edit-max="60" className={s.aWhat}>{what}</span>
                  <span data-edit={`awards.aWhere.${i}`} data-edit-max="60" className={s.aWhere}>{where}</span>
                  <span data-edit={`awards.aWon.${i}`} data-edit-max="60" className={result.startsWith('Won') ? s.aWon : s.aResult}>
                    {result}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ QUESTIONS */}
        <section id="questions" className={s.questions} aria-labelledby="questions-h">
          <div className={s.rail}>
            <span data-edit="questions.text" data-edit-max="60">07</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.questionsBody}>
            <h2 data-edit="questions.title" data-edit-max="60" id="questions-h">Four questions we get</h2>
            <dl className={s.qList}>
              {QUESTIONS.map((x, i) => (
                <div key={x.q}>
                  <dt data-edit={`questions.term.${i}`} data-edit-max="28">{x.q}</dt>
                  <dd data-edit={`questions.body.${i}`} data-edit-max="200" data-edit-multiline>{x.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* -------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <div data-edit-pattern="office.field" data-edit-roles="transparent,2,1" className={s.officeField} aria-hidden="true">
            <TabbiedPattern
              pattern={subdivide}
              palette={['transparent', RED, INK]}
              fit="grid"
              cellSize={190}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.officeInner}>
            <div className={s.rail}>
              <span data-edit="office.text" data-edit-max="60">08</span>
              <span className={s.railRule} aria-hidden="true" />
            </div>
            <div className={s.officeGrid}>
              <div>
                <h2 data-edit="office.title" data-edit-max="60" id="office-h">Klybeckstrasse 191</h2>
                <p data-edit="office.officeLead" data-edit-max="240" data-edit-multiline className={s.officeLead}>
                  Ground floor, courtyard side. Model shop at the back, plotter
                  by the window, the good coffee on the shelf nobody can reach.
                </p>
              </div>
              <dl className={s.contact}>
                <div>
                  <dt data-edit="office.term" data-edit-max="28">Post</dt>
                  <dd data-edit="office.body3" data-edit-max="200" data-edit-multiline>
                    Klybeckstrasse 191
                    <br />
                    4057 Basel
                  </dd>
                </div>
                <div>
                  <dt data-edit="office.term2" data-edit-max="28">Write</dt>
                  <dd>
                    <a data-edit="office.link" data-edit-max="28" href="mailto:buero@werkraum.example">buero@werkraum.example</a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="office.term3" data-edit-max="28">Call</dt>
                  <dd data-edit="office.body" data-edit-max="200" data-edit-multiline>+41 61 000 00 00</dd>
                </div>
                <div>
                  <dt data-edit="office.term4" data-edit-max="28">Open</dt>
                  <dd data-edit="office.body2" data-edit-max="200" data-edit-multiline>Mon to Thu, 09.00 to 17.00</dd>
                </div>
              </dl>
            </div>
            <p data-edit="office.officeApply" data-edit-max="240" data-edit-multiline className={s.officeApply}>
              We read every application. Portfolios as one PDF under 10 MB, to
              the address above, any time of year.
            </p>
          </div>
        </section>
      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={spandrel}
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
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Werkraum</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>An architecture practice at Klybeckstrasse 191, Basel, since 2009.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Practice</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.work" data-edit-max="28" href="#work">Selected work</a>
              </li>
              <li>
                <a data-edit="footer.method" data-edit-max="28" href="#method">Working rules</a>
              </li>
              <li>
                <a data-edit="footer.people" data-edit-max="28" href="#people">Eleven people</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Office</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.office" data-edit-max="28" href="#office">Klybeckstrasse 191</a>
              </li>
              <li>
                <a data-edit="footer.office2" data-edit-max="28" href="#office">Applications</a>
              </li>
              <li>
                <a data-edit="footer.practice" data-edit-max="28" href="#practice">About the practice</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Klybeckstrasse 191
              <br />
              4057 Basel
              <br />
              buero@werkraum.example
              <br />
              +41 61 000 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional architecture practice. Prices and times are invented.</p>
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
