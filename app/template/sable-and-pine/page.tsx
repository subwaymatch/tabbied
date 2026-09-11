import { TabbiedPattern } from 'tabbied/react';
import { alcove, grosgrain, rebate } from 'tabbied/patterns';
import s from './sable-and-pine.module.css';

export const metadata = {
  title: 'Sable and Pine: Interiors atelier, Melbourne',
  description:
    'Sable and Pine is an interiors atelier in Fitzroy North, Melbourne. Whole houses, kitchens and joinery, colour and styling, since 2011. Sixty-one projects, three designers, three cabinetmakers.',
};

/* Sand, ink and three mid-century accents. Every field draws on
   `transparent`, so the pattern sits in the sand of the page rather than
   on a plate of its own. */
const INK = '#2A241E';
const MUSTARD = '#D9A428';
const OLIVE = '#5F6B3A';
const TERRACOTTA = '#C6633B';
const GREY = '#8F8577';
/* The tiles pin their doodle to a whole multiple of the cell (8 x 72px)
   and let the rounded frame clip it. A fluid box gives fractional grid
   tracks and a hairline seam at every cell edge. */
const TILE_BOX = 576;

const NAV = [
  ['Services', '#services'],
  ['Projects', '#projects'],
  ['Materials', '#materials'],
  ['Process', '#process'],
  ['Studio', '#studio'],
];

const FACTS = [
  ['61', 'Projects since 2011'],
  ['3', 'Designers'],
  ['3', 'Cabinetmakers'],
  ['1:20', 'Joinery scale'],
];

type Service = {
  no: string;
  name: string;
  body: string;
  fee: string;
  basis: string;
};

const SERVICES: Service[] = [
  {
    no: '01',
    name: 'Full interiors',
    body: 'Whole rooms or whole houses: layout, joinery, finishes, lighting, furniture, and the set of drawings a builder can price from.',
    fee: 'AUD 28,000 to 90,000',
    basis: 'Design fee, by scope',
  },
  {
    no: '02',
    name: 'Kitchen and joinery',
    body: 'One room drawn to the millimetre and built by one of three cabinetmakers we have worked with for a decade.',
    fee: 'AUD 12,000 to 40,000',
    basis: 'Design fee, build separate',
  },
  {
    no: '03',
    name: 'Colour consultation',
    body: 'Half a day in the house with the fan decks, then a schedule that names every surface, its colour and its finish.',
    fee: 'AUD 650 a room',
    basis: 'AUD 1,900 for a whole house',
  },
  {
    no: '04',
    name: 'Styling',
    body: 'Furniture, rugs, art and lamps, sourced and placed for a house that is finished but not yet lived in.',
    fee: 'AUD 2,400 a room',
    basis: 'Purchases at trade, passed on',
  },
];

type Project = {
  name: string;
  suburb: string;
  kind: string;
  year: string;
};

const PROJECTS: Project[] = [
  { name: 'Mahoney House', suburb: 'Beaumaris', kind: 'Whole house, 1958 original', year: '2026' },
  { name: 'Apartment 7', suburb: 'Fitzroy North', kind: 'Kitchen and living', year: '2026' },
  { name: 'The Long Room', suburb: 'Eltham', kind: 'Extension interiors', year: '2025' },
  { name: 'Kerr Street', suburb: 'Fitzroy', kind: 'Terrace, three floors', year: '2025' },
  { name: 'Hillside', suburb: 'Warrandyte', kind: 'Whole house', year: '2024' },
  { name: 'Bay Street Flat', suburb: 'Brighton', kind: 'Colour and styling', year: '2024' },
  { name: 'Surgery on Rathdowne', suburb: 'Carlton North', kind: 'Commercial fit-out', year: '2023' },
  { name: 'Lorne Weekender', suburb: 'Lorne', kind: 'Whole house', year: '2022' },
];

type Library = {
  name: string;
  note: string;
  items: string[];
};

const MATERIALS: Library[] = [
  {
    name: 'Timbers',
    note: 'Australian where the grain suits, walnut where it does not.',
    items: ['Victorian ash', 'Blackwood', 'Spotted gum', 'American walnut', 'Hoop pine ply, for the inside of things'],
  },
  {
    name: 'Stones',
    note: 'Honed, never polished. A bench should take a mark.',
    items: ['Harcourt granite', 'Travertine, honed', 'Terrazzo, cast in Coburg', 'Bluestone, sawn', 'Marble, for one bench only'],
  },
  {
    name: 'Textiles',
    note: 'Wool first, linen second, and nothing that cannot be sat on.',
    items: ['Wool boucle', 'Belgian linen', 'Mohair velvet', 'Aniline leather', 'Hand-loomed jute'],
  },
];

type Step = {
  n: string;
  title: string;
  body: string;
};

const PROCESS: Step[] = [
  { n: '1', title: 'Visit', body: 'A morning in the house with a tape and a coffee. We listen more than we talk, and we do not bring a mood board.' },
  { n: '2', title: 'Brief', body: 'A written brief you sign. What stays, what goes, what it must cost, and what it should feel like at seven in the evening.' },
  { n: '3', title: 'Draw', body: 'Plans, elevations and joinery at 1:20. Two rounds of changes are in the fee; in fourteen years nobody has needed three.' },
  { n: '4', title: 'Build', body: 'We tender to builders we know, visit weekly, and answer the phone when the plasterer asks the question the drawing did not.' },
  { n: '5', title: 'Style', body: 'The last fortnight. Rugs down, lamps in, the art rehung, and a house handed over looking as if it was always going to.' },
];

const HOURS = [
  ['Monday to Thursday', '9:00 to 5:30'],
  ['Friday', '9:00 to 1:00'],
  ['Saturday', 'By appointment'],
  ['Sunday', 'Closed'],
];

export default function SableAndPinePage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f3ebdd',
        '--ink': '#2a241e',
        '--mustard': '#d9a428',
        '--olive': '#5f6b3a',
        '--terracotta': '#c6633b',
        '--grey': '#8f8577',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,mustard,olive,terracotta,grey"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Sable and Pine
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Fitzroy North, est. 2011</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO
            grosgrain: short ribbons in the three accents, feathering out at
            their ends. The panel in front is offset from an olive block, the
            way a fifties sideboard sits off its plinth. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,4,2,1,5" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={grosgrain}
              palette={['transparent', OLIVE, TERRACOTTA, MUSTARD, INK, GREY]}
              fit="grid"
              cellSize={128}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <div className={s.heroPanel}>
              <p data-edit="hero.label" data-edit-max="240" data-edit-multiline className={s.label}>Interiors atelier / Melbourne</p>
              <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
                A house should look
                <br />
                as if it was
                <br />
                <em>always going to.</em>
              </h1>
              <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
                Sable and Pine is three designers and a drawing board on St
                Georges Road. Whole houses, kitchens, colour and the last
                fortnight of styling, drawn at 1:20 and built by people we
                have known for a decade.
              </p>
            </div>
            <dl className={s.facts}>
              {FACTS.map(([value, label], i) => (
                <div key={label}>
                  <dt data-edit={`hero.term.${i}`} data-edit-max="28">{value}</dt>
                  <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------------ SERVICES */}
        <section id="services" className={s.section} aria-labelledby="services-h">
          <div className={s.sectionHead}>
            <p data-edit="services.label" data-edit-max="240" data-edit-multiline className={s.label}>What we do</p>
            <h2 data-edit="services.blockHead" data-edit-max="60" id="services-h" className={s.blockHead}>
              Four services
            </h2>
          </div>
          <ol className={s.services}>
            {SERVICES.map((sv, i) => (
              <li key={sv.no}>
                <span data-edit={`services.serviceNo.${i}`} data-edit-max="60" className={s.serviceNo}>{sv.no}</span>
                <h3 data-edit={`services.title.${i}`} data-edit-max="40">{sv.name}</h3>
                <p data-edit={`services.serviceBody.${i}`} data-edit-max="240" data-edit-multiline className={s.serviceBody}>{sv.body}</p>
                <p data-edit={`services.serviceFee.${i}`} data-edit-max="240" data-edit-multiline className={s.serviceFee}>{sv.fee}</p>
                <p data-edit={`services.serviceBasis.${i}`} data-edit-max="240" data-edit-multiline className={s.serviceBasis}>{sv.basis}</p>
              </li>
            ))}
          </ol>
          <p data-edit="services.sectionNote" data-edit-max="240" data-edit-multiline className={s.sectionNote}>
            Fees are fixed once the brief is signed. Hourly work is for the
            odd afternoon only and is charged at AUD 220, in halves.
          </p>
        </section>

        {/* ------------------------------------------------------ PROJECTS */}
        <section id="projects" className={s.section} aria-labelledby="projects-h">
          <div className={s.sectionHead}>
            <p data-edit="projects.label" data-edit-max="240" data-edit-multiline className={s.label}>Recent work</p>
            <h2 data-edit="projects.blockHead" data-edit-max="60" id="projects-h" className={s.blockHead}>
              Eight of sixty-one
            </h2>
          </div>
          <ol className={s.projects}>
            <li className={s.projectsHead} aria-hidden="true">
              <span data-edit="projects.text" data-edit-max="60">Project</span>
              <span data-edit="projects.text2" data-edit-max="60">Suburb</span>
              <span data-edit="projects.text3" data-edit-max="60">Type</span>
              <span data-edit="projects.text4" data-edit-max="60">Year</span>
            </li>
            {PROJECTS.map((p, i) => (
              <li key={p.name}>
                <span data-edit={`projects.projectName.${i}`} data-edit-max="60" className={s.projectName}>{p.name}</span>
                <span data-edit={`projects.projectSuburb.${i}`} data-edit-max="60" className={s.projectSuburb}>{p.suburb}</span>
                <span data-edit={`projects.projectKind.${i}`} data-edit-max="60" className={s.projectKind}>{p.kind}</span>
                <span data-edit={`projects.projectYear.${i}`} data-edit-max="60" className={s.projectYear}>{p.year}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- BAND
            rebate: blocks with a notch out of one edge, the joint half of a
            cabinetmaker's vocabulary. The loudest field on the page. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,1,5,2,4,3" className={s.bandField} aria-hidden="true">
            <TabbiedPattern
              pattern={rebate}
              palette={['transparent', INK, GREY, MUSTARD, TERRACOTTA, OLIVE]}
              fit="grid"
              cellSize={96}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ----------------------------------------------------- MATERIALS
            Three rounded-square tiles with alcove inside (a frame with one
            side left open), each standing in for a shelf of samples. */}
        <section id="materials" className={s.section} aria-labelledby="materials-h">
          <div className={s.sectionHead}>
            <p data-edit="materials.label" data-edit-max="240" data-edit-multiline className={s.label}>The library</p>
            <h2 data-edit="materials.blockHead" data-edit-max="60" id="materials-h" className={s.blockHead}>
              Fifteen materials, mostly
            </h2>
          </div>
          <div className={s.libraryGrid}>
            {MATERIALS.map((lib, i) => (
              <article key={lib.name} className={s.library}>
                <div data-edit-pattern={`library.field.${i}`} data-edit-roles="transparent,1,4,3,5" className={s.tile} aria-hidden="true">
                  <TabbiedPattern
                    pattern={alcove}
                    palette={['transparent', INK, TERRACOTTA, OLIVE, GREY]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={6400}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <h3 data-edit={`library.title.${i}`} data-edit-max="40">{lib.name}</h3>
                <p data-edit={`library.libraryNote.${i}`} data-edit-max="240" data-edit-multiline className={s.libraryNote}>{lib.note}</p>
                <ul className={s.libraryList}>
                  {lib.items.map((item, j) => (
                    <li data-edit={`library.item.${i}.${j}`} data-edit-max="80" key={`${i}-${j}`}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p data-edit="materials.sectionNote" data-edit-max="240" data-edit-multiline className={s.sectionNote}>
            The shelves are at the studio and can be visited. Everything on
            them has been in a finished house; a sample we have not lived
            with does not go in the library.
          </p>
        </section>

        {/* ------------------------------------------------------- PROCESS */}
        <section id="process" className={s.section} aria-labelledby="process-h">
          <div className={s.sectionHead}>
            <p data-edit="process.label" data-edit-max="240" data-edit-multiline className={s.label}>How it goes</p>
            <h2 data-edit="process.blockHead" data-edit-max="60" id="process-h" className={s.blockHead}>
              Five steps, in order
            </h2>
          </div>
          <ol className={s.process}>
            {PROCESS.map((step, i) => (
              <li key={step.n}>
                <span data-edit={`process.stepN.${i}`} data-edit-max="60" className={s.stepN}>{step.n}</span>
                <h3 data-edit={`process.title.${i}`} data-edit-max="40">{step.title}</h3>
                <p data-edit={`process.body.${i}`} data-edit-max="240" data-edit-multiline>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div className={s.studioGrid}>
            <div className={s.studioPanel}>
              <p data-edit="studio.labelLight" data-edit-max="240" data-edit-multiline className={s.labelLight}>The studio</p>
              <h2 data-edit="studio.title" data-edit-max="60" id="studio-h">212 St Georges Road</h2>
              <p data-edit="studio.studioLede" data-edit-max="240" data-edit-multiline className={s.studioLede}>
                A former dry cleaner in Fitzroy North with the north light of a
                shopfront and the sample shelves along the back wall. The
                drawing board is by the window. The kettle is always on.
              </p>
              <dl className={s.hours}>
                {HOURS.map(([day, time], i) => (
                  <div key={day}>
                    <dt data-edit={`studio.term.${i}`} data-edit-max="28">{day}</dt>
                    <dd data-edit={`studio.body.${i}`} data-edit-max="200" data-edit-multiline>{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={s.enquire}>
              <p data-edit="studio.label" data-edit-max="240" data-edit-multiline className={s.label}>How to enquire</p>
              <h3 data-edit="studio.title2" data-edit-max="40">Write first, then we visit</h3>
              <p data-edit="studio.enquireBody" data-edit-max="240" data-edit-multiline className={s.enquireBody}>
                Send the address of the house, what you would like done, and
                roughly when. We reply within three working days and, if it is
                a fit, come to see it before either of us says yes.
              </p>
              <dl className={s.contact}>
                <div>
                  <dt data-edit="studio.term2" data-edit-max="28">Email</dt>
                  <dd>
                    <a data-edit="studio.link" data-edit-max="28" href="mailto:studio@sableandpine.example">studio@sableandpine.example</a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="studio.term3" data-edit-max="28">Phone</dt>
                  <dd data-edit="studio.body2" data-edit-max="200" data-edit-multiline>+61 3 0000 0000</dd>
                </div>
                <div>
                  <dt data-edit="studio.term4" data-edit-max="28">Post</dt>
                  <dd data-edit="studio.body" data-edit-max="200" data-edit-multiline>
                    212 St Georges Road
                    <br />
                    Fitzroy North VIC 3068
                  </dd>
                </div>
              </dl>
              <a data-edit="studio.button" data-edit-max="28" className={s.button} href="mailto:studio@sableandpine.example">
                Start with an email
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* A coda: grosgrain again at a smaller cell, in the two quiet tones,
          with nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,5,3,2" className={s.codaField} aria-hidden="true">
          <TabbiedPattern
            pattern={grosgrain}
            palette={['transparent', GREY, OLIVE, MUSTARD]}
            fit="grid"
            cellSize={80}
            redrawInterval={5000}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Sable and Pine</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              An interiors atelier at 212 St Georges Road, Fitzroy North,
              since 2011. Three designers, three cabinetmakers, one library.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Work</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.services" data-edit-max="28" href="#services">Four services</a>
              </li>
              <li>
                <a data-edit="footer.projects" data-edit-max="28" href="#projects">Recent projects</a>
              </li>
              <li>
                <a data-edit="footer.materials" data-edit-max="28" href="#materials">The library</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Studio</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.process" data-edit-max="28" href="#process">How it goes</a>
              </li>
              <li>
                <a data-edit="footer.studio" data-edit-max="28" href="#studio">Hours</a>
              </li>
              <li>
                <a data-edit="footer.studio2" data-edit-max="28" href="#studio">Enquire</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Post</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              212 St Georges Road
              <br />
              Fitzroy North VIC 3068
              <br />
              studio@sableandpine.example
              <br />
              +61 3 0000 0000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional interiors atelier. Fees, projects and people are invented.</p>
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
