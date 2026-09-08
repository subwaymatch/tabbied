import { TabbiedPattern } from 'tabbied/react';
import {
  blindfold, dotfade, grainfall, gutter, lattice, speckfield, stylobate,
} from 'tabbied/patterns';
import s from './bureau-vektor.module.css';

export const metadata = {
  title: 'Bureau Vektor: Public statistics',
  description:
    'Bureau Vektor publishes the canton\'s official statistics: seventy series, released on a fixed calendar, whole and unrounded, free to reuse.',
};

/* White, ink, one ultramarine. Fields take `transparent` in the background
   slot so the paper of the page is the paper of the pattern. */
const INK = '#0c0d10';
const BLUE = '#1f3cff';
const GREY = '#8a8f99';
const PALE = '#e8eaf0';

const HEADLINE = [
  { v: '1 284 610', k: 'Resident population', d: '+0.7 %', up: true },
  { v: '2.9 %', k: 'Unemployment, seasonally adjusted', d: '−0.2 pt', up: false },
  { v: '71 400', k: 'Cross-border commuters', d: '+2.4 %', up: true },
  { v: '104.6', k: 'Consumer price index, 2020 = 100', d: '+1.1 %', up: true },
];

/* One year of a single series, published as a chart made of nothing but
   divs - the same numbers the table below carries. */
const SERIES_2026 = [
  ['Jan', 62], ['Feb', 58], ['Mar', 67], ['Apr', 74],
  ['May', 81], ['Jun', 88], ['Jul', 71], ['Aug', 64],
  ['Sep', 92], ['Oct', 97], ['Nov', 86], ['Dec', 79],
];

const METHODS = [
  {
    art: lattice,
    n: '01',
    t: 'Published whole',
    d: 'A figure goes out with its confidence interval, its sample size and the date it was collected. A number without those three is a rumour with a decimal point.',
  },
  {
    art: dotfade,
    n: '02',
    t: 'Revised in public',
    d: 'Every revision keeps its predecessor online at the same address. You can always see what we said before and how far off we were.',
  },
  {
    art: blindfold,
    n: '03',
    t: 'Never rounded early',
    d: 'Rounding happens once, at the point of presentation, and never in the pipeline. Two tables that disagree in the last digit are a bug, not a style.',
  },
];

const CATALOGUE = [
  ['VK-001', 'Resident population by commune', 'Monthly', '1962-', 'CSV, JSON, Parquet'],
  ['VK-004', 'Births, deaths, migration', 'Monthly', '1876-', 'CSV, JSON'],
  ['VK-011', 'Registered unemployment', 'Monthly', '1991-', 'CSV, JSON, Parquet'],
  ['VK-014', 'Vacancies by sector', 'Quarterly', '2004-', 'CSV, JSON'],
  ['VK-020', 'Consumer price index', 'Monthly', '1922-', 'CSV, JSON'],
  ['VK-026', 'Rents, new lettings', 'Quarterly', '1998-', 'CSV'],
  ['VK-031', 'Dwellings completed', 'Quarterly', '1945-', 'CSV, JSON'],
  ['VK-038', 'Cross-border commuters', 'Quarterly', '1996-', 'CSV, JSON'],
  ['VK-042', 'Public transport journeys', 'Monthly', '2008-', 'CSV, JSON, Parquet'],
  ['VK-049', 'Overnight stays', 'Monthly', '1934-', 'CSV, JSON'],
  ['VK-055', 'Electricity consumption', 'Monthly', '1971-', 'CSV, JSON'],
  ['VK-061', 'School enrolment', 'Annual', '1880-', 'CSV'],
  ['VK-068', 'Cantonal tax receipts', 'Annual', '1919-', 'CSV, JSON'],
  ['VK-070', 'Voter turnout by commune', 'Per ballot', '1848-', 'CSV, JSON, Parquet'],
];

const CALENDAR = [
  ['06.01', 'VK-011', 'Registered unemployment, December', '09:00'],
  ['13.01', 'VK-020', 'Consumer price index, December', '09:00'],
  ['20.01', 'VK-001', 'Resident population, year end', '09:00'],
  ['03.02', 'VK-011', 'Registered unemployment, January', '09:00'],
  ['10.02', 'VK-042', 'Public transport journeys, Q4', '09:00'],
  ['17.02', 'VK-031', 'Dwellings completed, Q4', '09:00'],
  ['03.03', 'VK-011', 'Registered unemployment, February', '09:00'],
  ['10.03', 'VK-038', 'Cross-border commuters, Q4', '09:00'],
  ['24.03', 'VK-068', 'Cantonal tax receipts, previous year', '09:00'],
  ['07.04', 'VK-011', 'Registered unemployment, March', '09:00'],
  ['14.04', 'VK-026', 'Rents, new lettings, Q1', '09:00'],
  ['28.04', 'VK-061', 'School enrolment, spring count', '09:00'],
];

const DESKS = [
  ['Population', 'Nadia Christen', '7 staff'],
  ['Labour', 'Émile Roux', '6 staff'],
  ['Prices', 'Bettina Suter', '5 staff'],
  ['Construction', 'Jorge Almeida', '4 staff'],
  ['Mobility', 'Anneke de Wit', '5 staff'],
  ['Methods', 'Tarek Hamdi', '3 staff'],
];

const REUSE = [
  ['Licence', 'CC BY 4.0. Attribute the bureau, not the individual analyst.'],
  ['API', 'One endpoint per series, versioned, no key, no rate limit worth mentioning.'],
  ['Bulk', 'The whole catalogue as Parquet, rebuilt nightly, about 4 GB.'],
  ['Citation', 'Every series page carries a citation string with the exact revision.'],
];

/* x and y are percentages of the locator box, not coordinates -
   the schematic is a diagram of relative position, nothing more. */
const OFFICES = [
  { city: 'Genève', role: 'Head office', addr: 'Rue du Recensement 4, 1204', fix: '+41 22 000 04 00', x: 27, y: 62, head: true },
  { city: 'Lausanne', role: 'Household survey', addr: 'Avenue de Rumine 21, 1005', fix: '+41 21 000 21 00', x: 39, y: 46 },
  { city: 'Sion', role: 'Alpine register', addr: 'Rue de Lausanne 63, 1950', fix: '+41 27 000 63 00', x: 57, y: 74 },
  { city: 'Neuchâtel', role: 'Methods and revisions', addr: 'Espace de l\'Europe 10, 2000', fix: '+41 32 000 10 00', x: 68, y: 28 },
];

export default function BureauVektorPage() {
  const max = Math.max(...SERIES_2026.map(([, v]) => Number(v)));

  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#ffffff',
        '--ink': '#0c0d10',
        '--blue': '#1f3cff',
        '--grey': '#8a8f99',
        '--pale': '#e8eaf0',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,blue,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Bureau Vektor
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.indicators" data-edit-max="28" href="#indicators">Indicators</a>
          <a data-edit="bar.catalogue" data-edit-max="28" href="#catalogue">Catalogue</a>
          <a data-edit="bar.calendar" data-edit-max="28" href="#calendar">Calendar</a>
          <a data-edit="bar.reuse" data-edit-max="28" href="#reuse">Reuse</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Office of statistics</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={gutter}
              palette={['transparent', PALE, GREY, BLUE]}
              fit="grid"
              cellSize={148}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Official statistics / the canton / since 1919</p>
          <h1 className={s.heroType}>
            Numbers,
            <br />
            published
            <br />
            <span data-edit="hero.blue" data-edit-max="60" className={s.blue}>whole.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Seventy series on a fixed calendar, at nine in the morning, with
              the method attached and nothing held back for a press conference.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#catalogue">
              Browse the catalogue
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------ INDICATORS
            Four figures at poster size on the blue ground. The change of
            ground does the separating; there is not a rule on the page. */}
        <section id="indicators" className={s.indicators} aria-label="Headline indicators">
          <div data-edit-pattern="indicators.field" data-edit-roles="transparent,3,4" className={s.indicatorsField} aria-hidden="true">
            <TabbiedPattern
              pattern={lattice}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={92}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          {HEADLINE.map((h, i) => (
            <div key={h.k}>
              <p data-edit={`indicators.iVal.${i}`} data-edit-max="240" data-edit-multiline className={s.iVal}>{h.v}</p>
              <p data-edit={`indicators.iKey.${i}`} data-edit-max="240" data-edit-multiline className={s.iKey}>{h.k}</p>
              <p className={s.iDelta} data-up={h.up ? 'yes' : 'no'}>
                {h.d} on the year
              </p>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            A statistic that arrives without its method is decoration. We
            publish the method, the sample, the interval and the revision
            history in the same release, at the same hour, whether the number
            is convenient or not.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Bureau Vektor is the canton's statistical office. It has been
              publishing since 1919 and has missed its own calendar four times,
              each of which is documented on the methods page.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              Nothing here is embargoed. Ministers read the figures at the same
              moment as everybody else, which is a rule the bureau fought for in
              1974 and would fight for again.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------- CHART
            A twelve-bar chart built out of divs and the accent colour. It is
            the same data as VK-042 in the table below, and it is the largest
            thing on the page for the same reason a poster has a picture. */}
        <section className={s.chart} aria-labelledby="chart-h">
          <div className={s.secHead}>
            <h2 data-edit="chart.title" data-edit-max="60" id="chart-h">VK-042, one year</h2>
            <p data-edit="chart.body" data-edit-max="240" data-edit-multiline>
              Public transport journeys, millions, by month. Provisional for
              November and December, as always at this point in the year.
            </p>
          </div>
          <div className={s.bars}>
            {SERIES_2026.map(([m, v], i) => (
              <div className={s.barCol} key={String(m)}>
                <span data-edit={`chart.barVal.${i}`} data-edit-max="60" className={s.barVal}>{v}</span>
                <div
                  className={s.barFill}
                  style={{ height: `${(Number(v) / max) * 100}%` }}
                  data-prov={i > 9 ? 'yes' : 'no'}
                />
                <span data-edit={`chart.barKey.${i}`} data-edit-max="60" className={s.barKey}>{m}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,4,3" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={stylobate}
            palette={['transparent', BLUE, PALE, GREY]}
            fit="grid"
            cellSize={118}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* --------------------------------------------------------- METHODS */}
        <section className={s.methods} aria-labelledby="methods-h">
          <div className={s.secHead}>
            <h2 data-edit="methods.title" data-edit-max="60" id="methods-h">Three commitments</h2>
            <p data-edit="methods.body" data-edit-max="240" data-edit-multiline>In the enabling act of 1919, in almost these words.</p>
          </div>
          <div className={s.mGrid}>
            {METHODS.map((m, i) => (
              <article key={m.n}>
                <div data-edit-pattern={`methods.field.${i}`} data-edit-roles="transparent,3,2" className={s.mPlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={m.art}
                    palette={['transparent', GREY, BLUE]}
                    fit="grid"
                    cellSize={60}
                    redrawInterval={5600}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p data-edit={`methods.mN.${i}`} data-edit-max="240" data-edit-multiline className={s.mN}>{m.n}</p>
                <h3 data-edit={`methods.title2.${i}`} data-edit-max="40">{m.t}</h3>
                <p data-edit={`methods.mBody.${i}`} data-edit-max="240" data-edit-multiline className={s.mBody}>{m.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- CATALOGUE */}
        <section id="catalogue" className={s.listing} aria-labelledby="cat-h">
          <div className={s.secHead}>
            <h2 data-edit="catalogue.title" data-edit-max="60" id="cat-h">Seventy series</h2>
            <p data-edit="catalogue.body" data-edit-max="240" data-edit-multiline>Fourteen of them below. Every one is downloadable in full, back to its first year.</p>
          </div>
          <ol className={s.table}>
            {CATALOGUE.map((r, i) => (
              <li key={r[0]}>
                <span data-edit={`catalogue.tId.${i}`} data-edit-max="60" className={s.tId}>{r[0]}</span>
                <span data-edit={`catalogue.tName.${i}`} data-edit-max="60" className={s.tName}>{r[1]}</span>
                <span data-edit={`catalogue.tFreq.${i}`} data-edit-max="60" className={s.tFreq}>{r[2]}</span>
                <span data-edit={`catalogue.tSpan.${i}`} data-edit-max="60" className={s.tSpan}>{r[3]}</span>
                <span data-edit={`catalogue.tFmt.${i}`} data-edit-max="60" className={s.tFmt}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- CALENDAR */}
        <section id="calendar" className={s.listing} aria-labelledby="cal-h">
          <div className={s.secHead}>
            <h2 data-edit="calendar.title" data-edit-max="60" id="cal-h">The release calendar</h2>
            <p data-edit="calendar.body" data-edit-max="240" data-edit-multiline>Set a year ahead and not moved for convenience. First quarter shown.</p>
          </div>
          <ol className={s.table}>
            {CALENDAR.map((r, i) => (
              <li key={r[0] + r[1]}>
                <span data-edit={`calendar.tId.${i}`} data-edit-max="60" className={s.tId}>{r[0]}</span>
                <span data-edit={`calendar.tName.${i}`} data-edit-max="60" className={s.tName}>{r[2]}</span>
                <span data-edit={`calendar.tFreq.${i}`} data-edit-max="60" className={s.tFreq}>{r[1]}</span>
                <span className={s.tSpan} />
                <span data-edit={`calendar.tFmt.${i}`} data-edit-max="60" className={s.tFmt}>{r[3]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,4,3" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={grainfall}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={118}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>The interesting figure and the reliable figure are rarely the same figure, and only one of them is ours to publish.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Tarek Hamdi, head of methods</cite>
          </blockquote>
        </section>

        {/* ----------------------------------------------------------- DESKS */}
        <section id="desks" className={s.desks} aria-labelledby="desks-h">
          <div data-edit-pattern="desks.field" data-edit-roles="transparent,4,3" className={s.desksField} aria-hidden="true">
            <TabbiedPattern
              pattern={speckfield}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={110}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.desksInner}>
            <div className={s.secHead}>
              <h2 data-edit="desks.title" data-edit-max="60" id="desks-h">Six desks</h2>
              <p data-edit="desks.body" data-edit-max="240" data-edit-multiline>Thirty statisticians and a librarian. Every series has a named owner who answers mail.</p>
            </div>
            <ol className={s.deskList}>
              {DESKS.map(([area, who, n], i) => (
                <li key={area}>
                  <span className={s.dIdx}>{String(i + 1).padStart(2, '0')}</span>
                  <span data-edit={`desks.dArea.${i}`} data-edit-max="60" className={s.dArea}>{area}</span>
                  <span data-edit={`desks.dWho.${i}`} data-edit-max="60" className={s.dWho}>{who}</span>
                  <span data-edit={`desks.dN.${i}`} data-edit-max="60" className={s.dN}>{n}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------------------------------------------- REUSE */}
        <section id="reuse" className={s.reuse} aria-labelledby="reuse-h">
          <div data-edit-pattern="reuse.field" data-edit-roles="transparent,3,4" className={s.reuseField} aria-hidden="true">
            <TabbiedPattern
              pattern={blindfold}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={104}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 data-edit="reuse.title" data-edit-max="60" id="reuse-h">Take it and use it</h2>
          <dl className={s.reuseList}>
            {REUSE.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`reuse.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`reuse.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Corrections, queries, freedom-of-information</p>
          <h2 data-edit="contact.officesHead" data-edit-max="60" id="contact-h" className={s.officesHead}>Four offices, one series</h2>
          <div className={s.officeCols}>
            <ul className={s.offices}>
              {OFFICES.map((o, i) => (
                <li key={o.city}>
                  <p data-edit={`contact.oCity.${i}`} data-edit-max="240" data-edit-multiline className={s.oCity}>{o.city}</p>
                  <p data-edit={`contact.oRole.${i}`} data-edit-max="240" data-edit-multiline className={s.oRole}>{o.role}</p>
                  <p data-edit={`contact.oAddr.${i}`} data-edit-max="240" data-edit-multiline className={s.oAddr}>{o.addr}</p>
                  <p data-edit={`contact.oFix.${i}`} data-edit-max="240" data-edit-multiline className={s.oFix}>{o.fix}</p>
                </li>
              ))}
            </ul>
            <div className={s.locator} aria-hidden="true">
              <div data-edit-pattern="contact.field" data-edit-roles="transparent,3,2" className={s.locatorField}>
                <TabbiedPattern
                  pattern={blindfold}
                  palette={['transparent', GREY, BLUE]}
                  fit="grid"
                  cellSize={132}
                  redrawInterval={6200}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
              {OFFICES.map((o, i) => (
                <span
                  key={o.city}
                  className={o.head ? `${s.pin} ${s.pinHead}` : s.pin}
                  style={{ left: `${o.x}%`, top: `${o.y}%` }}
                >
                  <span className={s.pinDot} />
                  <span data-edit={`contact.text.${i}`} data-edit-max="60">{o.city}</span>
                </span>
              ))}
            </div>
          </div>
          <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
            A correction request is answered within five working days, and if
            we were wrong the correction is published, not quietly applied.
          </p>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,2,4,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={dotfade}
          palette={['transparent', BLUE, PALE, GREY]}
          fit="grid"
          cellSize={100}
          redrawInterval={5200}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <p className={s.footStatement}>
          Every table on this site can be downloaded, reused and <em>argued with</em>.
        </p>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Data</h2>
            <ul>
              <li><a data-edit="footer.catalogue" data-edit-max="28" href="#catalogue">Series catalogue</a></li>
              <li><a data-edit="footer.calendar" data-edit-max="28" href="#calendar">Release calendar</a></li>
              <li><a data-edit="footer.reuse" data-edit-max="28" href="#reuse">Licence and API</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Bureau</h2>
            <ul>
              <li><a data-edit="footer.indicators" data-edit-max="28" href="#indicators">Headline indicators</a></li>
              <li><a data-edit="footer.desks" data-edit-max="28" href="#desks">The desks</a></li>
              <li><a data-edit="footer.reuse2" data-edit-max="28" href="#reuse">Citation</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Rue du Recensement 4
              <br />
              1204 Genève
              <br />
              tabellen@vektor.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional statistical office. Every figure on this page is invented.</p>
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
