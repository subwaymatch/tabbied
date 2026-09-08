import { TabbiedPattern } from 'tabbied/react';
import {
  bowl, comet, dipole, dustfall, lantern, quoit, sandfield, sparkle,
} from 'tabbied/patterns';
import s from './tiefsee.module.css';

export const metadata = {
  title: 'Tiefsee: Deep-sea research programme',
  description:
    'A deep-ocean research programme with one ship and two vehicles. Five depth zones, forty years of station data, everything published within a year.',
};

/* Deep water, bone, one cyan. Every field takes `transparent` in the
   background slot, so the page's own water shows through the pattern - and
   the page gets darker the further down it you read. */
const BONE = '#e6eef0';
const CYAN = '#00d2e0';
const GREY = '#5d7480';
const DEEP = '#0a1f2b';

/* The spine of the page: five zones, each one a section with its own ground.
   The tint on each band is set from `shade`, so the page darkens as it is
   read, which is the only illustration the subject needs. */
const ZONES = [
  {
    id: 'sunlit',
    depth: '0 - 200',
    name: 'Sunlit',
    latin: 'Epipelagic',
    shade: 0,
    art: dipole,
    body:
      'Everything that photosynthesises, and almost everything anybody has ever photographed. We spend as little time here as the ship can manage, because it is already the best-described water on the planet.',
    facts: [['1 %', 'Of ocean volume'], ['96 %', 'Of published papers'], ['18', 'Stations held']],
  },
  {
    id: 'twilight',
    depth: '200 - 1\u00a0000',
    name: 'Twilight',
    latin: 'Mesopelagic',
    shade: 22,
    art: bowl,
    body:
      'The layer that moves. Every night the largest migration on Earth rises through it and every dawn it sinks again, and the carbon it carries down is the single biggest number nobody can pin within a factor of two.',
    facts: [['20 %', 'Of ocean volume'], ['×2', 'Uncertainty on carbon flux'], ['31', 'Stations held']],
  },
  {
    id: 'midnight',
    depth: '1\u00a0000 - 4\u00a0000',
    name: 'Midnight',
    latin: 'Bathypelagic',
    shade: 44,
    art: lantern,
    body:
      'No sunlight at all, and more light than you would expect: something like nine in ten animals down here make their own. Our two vehicles are painted matte black for exactly this reason.',
    facts: [['≈ 90 %', 'Of animals bioluminescent'], ['4 °C', 'Water temperature'], ['26', 'Stations held']],
  },
  {
    id: 'abyss',
    depth: '4\u00a0000 - 6\u00a0000',
    name: 'Abyss',
    latin: 'Abyssopelagic',
    shade: 66,
    art: sandfield,
    body:
      'Flat, cold and enormous: most of the sea floor on the planet is this, a plain of soft sediment that takes a thousand years to lay down a centimetre. Also where the nodule licences are.',
    facts: [['1 cm', 'Sediment per 1 000 years'], ['600 bar', 'At 6 000 m'], ['44', 'Stations held']],
  },
  {
    id: 'trench',
    depth: '6\u00a0000 - 11\u00a0000',
    name: 'Trench',
    latin: 'Hadopelagic',
    shade: 88,
    art: quoit,
    body:
      'Twenty-seven separate trenches, each one effectively an island: too deep for anything to cross between them. The last full-depth dive from this programme was in 2024 and it lasted eleven hours.',
    facts: [['27', 'Trench systems'], ['11 h', 'Longest dive'], ['9', 'Stations held']],
  },
];

const FLEET = [
  ['RV Meridian', 'Research vessel', '78 m, ice class 1B', '2009', '32 crew, 24 scientists'],
  ['Nautilus 6000', 'Remote vehicle', 'Rated 6 000 m', '2018', 'Fibre tether, 8 km'],
  ['Kelpie', 'Autonomous glider', 'Rated 1 000 m', '2021', '90-day endurance'],
  ['Vollmer II', 'Crewed submersible', 'Rated 11 000 m', '2023', 'Three seats'],
  ['Lander A - F', 'Free-fall landers', 'Rated 11 000 m', '2016 - 2024', 'Six units, ballast release'],
];

const CRUISES = [
  ['ME-114', '2026', 'Iberian Abyssal Plain', '31 days', 'Sediment cores, 44 stations'],
  ['ME-112', '2026', 'Charlie-Gibbs Fracture', '24 days', 'Midwater trawls and imaging'],
  ['ME-109', '2025', 'Puerto Rico Trench', '38 days', 'Full-depth, Vollmer II × 6'],
  ['ME-106', '2025', 'Rockall Trough', '19 days', 'Time-series, station R7'],
  ['ME-103', '2025', 'Azores, Menez Gwen', '22 days', 'Vent chemistry'],
  ['ME-098', '2024', 'Kermadec Trench', '46 days', 'Full-depth, 11 h dive'],
  ['ME-094', '2024', 'Bay of Biscay', '16 days', 'Glider recovery, Kelpie × 3'],
  ['ME-089', '2023', 'Mid-Atlantic Ridge, 45° N', '33 days', 'Vent fauna, first survey'],
  ['ME-085', '2023', 'Porcupine Abyssal Plain', '28 days', 'Time-series, 30th year'],
  ['ME-081', '2022', 'Greenland Basin', '25 days', 'Under-ice, autonomous only'],
];

const POLICY = [
  ['Publication', 'Every dataset is public within twelve months of the ship docking. No exceptions have been granted since 2011.'],
  ['Imagery', 'All video and stills are CC BY. Sixteen thousand hours of it, indexed by station.'],
  ['Berths', 'Four berths on every cruise are held for early-career scientists from outside the consortium.'],
  ['Mining', 'The programme surveys licence areas and publishes what it finds. It does not consult for licence holders.'],
];

const NUMBERS = [
  ['128', 'Stations held'],
  ['11 034', 'Metres, deepest dive'],
  ['16 000', 'Hours of seabed video, public'],
  ['12', 'Months, maximum embargo'],
];

/* x and y are percentages of the locator box, not coordinates -
   the schematic is a diagram of relative position, nothing more. */
const OFFICES = [
  { city: 'Kiel', role: 'Shore office and archive', addr: 'Schwentinestrasse 12, 24149', fix: '54.33 N  10.14 E', x: 30, y: 22, head: true },
  { city: 'Las Palmas', role: 'Refit and northern turn', addr: 'Muelle Grande, 35008', fix: '28.14 N  15.42 W', x: 24, y: 58 },
  { city: 'Walvis Bay', role: 'Southern turn', addr: 'Third Street East, 13013', fix: '22.96 S  14.51 E', x: 58, y: 82 },
  { city: 'At sea', role: 'Two hundred days a year', addr: 'Wherever the transect is', fix: 'Iridium, when it feels like it', x: 70, y: 44 },
];

export default function TiefseePage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--water': '#04121a',
        '--bone': '#e6eef0',
        '--cyan': '#00d2e0',
        '--grey': '#5d7480',
        '--deep': '#0a1f2b',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="water,bone,cyan,grey,deep"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Tiefsee</a>
        <nav aria-label="Sections">
          <a data-edit="bar.zones" data-edit-max="28" href="#zones">Zones</a>
          <a data-edit="bar.fleet" data-edit-max="28" href="#fleet">Fleet</a>
          <a data-edit="bar.cruises" data-edit-max="28" href="#cruises">Cruises</a>
          <a data-edit="bar.policy" data-edit-max="28" href="#policy">Data</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Deep-sea programme</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={dipole}
              palette={['transparent', DEEP, GREY, CYAN]}
              fit="grid"
              cellSize={168}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Deep-sea research / one ship, two vehicles / since 1986</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Eleven</span>
            <span data-edit="hero.text2" data-edit-max="60">thousand</span>
            <span data-edit="hero.cyan" data-edit-max="60" className={s.cyan}>metres down.</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Five zones, a hundred and twenty-eight standing stations, and
              everything we find published inside a year of the ship docking.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#zones">
              Go down
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------------ ZONES
            The page is the water column. Each zone is a full-bleed band and
            each one is darker than the last, so scrolling is descending. */}
        <section id="zones" aria-label="The five zones">
          {ZONES.map((z, i) => (
            <article
              key={z.id}
              id={z.id}
              className={s.zone}
              style={{ background: `color-mix(in srgb, #000 ${z.shade}%, ${DEEP})` }}
            >
              <div data-edit-pattern={`zone.field.${i}`} data-edit-roles="transparent,2,3,1" className={s.zoneField} aria-hidden="true">
                <TabbiedPattern
                  pattern={z.art}
                  palette={['transparent', CYAN, GREY, BONE]}
                  fit="grid"
                  cellSize={128 - i * 8}
                  redrawInterval={5200 + i * 340}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
              <div className={s.zoneInner}>
                <p className={s.zDepth}>
                  {z.depth}
                  <span data-edit={`zone.text.${i}`} data-edit-max="60">m</span>
                </p>
                <div className={s.zBody}>
                  <h2 data-edit={`zone.title.${i}`} data-edit-max="60">{z.name}</h2>
                  <p data-edit={`zone.zLatin.${i}`} data-edit-max="240" data-edit-multiline className={s.zLatin}>{z.latin}</p>
                  <p data-edit={`zone.zText.${i}`} data-edit-max="240" data-edit-multiline className={s.zText}>{z.body}</p>
                  <dl className={s.zFacts}>
                    {z.facts.map(([v, k], i2) => (
                      <div key={k}>
                        <dt data-edit={`zone.term.${i}.${i2}`} data-edit-max="28">{v}</dt>
                        <dd data-edit={`zone.body.${i}.${i2}`} data-edit-max="200" data-edit-multiline>{k}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            Below a thousand metres there is no seasonality, no daylight and
            almost no data. Four fifths of the living space on this planet is
            down there and we have looked at a fraction of one per cent of it
            with our own eyes.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Tiefsee is a consortium programme: one ship, two crewed and
              uncrewed vehicles, six landers, and a hundred and twenty-eight
              stations that have been reoccupied on the same coordinates since
              1986.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              The oldest of those time-series is now forty years long, which is
              the only reason anybody can say anything at all about whether the
              abyssal plain is changing.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------- NUMBERS */}
        <section className={s.numbers} aria-label="The programme in numbers">
          <div data-edit-pattern="numbers.field" data-edit-roles="transparent,3,4" className={s.numbersField} aria-hidden="true">
            <TabbiedPattern
              pattern={sandfield}
              palette={['transparent', GREY, DEEP]}
              fit="grid"
              cellSize={92}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <p data-edit={`numbers.nVal.${i}`} data-edit-max="240" data-edit-multiline className={s.nVal}>{v}</p>
              <p data-edit={`numbers.nKey.${i}`} data-edit-max="240" data-edit-multiline className={s.nKey}>{k}</p>
            </div>
          ))}
        </section>

        {/* ----------------------------------------------------------- FLEET */}
        <section id="fleet" className={s.listing} aria-labelledby="fleet-h">
          <div className={s.secHead}>
            <h2 data-edit="fleet.title" data-edit-max="60" id="fleet-h">What goes down</h2>
            <p data-edit="fleet.body" data-edit-max="240" data-edit-multiline>One ship, five kinds of vehicle. The landers are the cheapest and have done the most work.</p>
          </div>
          <ol className={s.table}>
            {FLEET.map((r, i) => (
              <li key={r[0]}>
                <span data-edit={`fleet.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[1]}</span>
                <span data-edit={`fleet.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[0]}</span>
                <span data-edit={`fleet.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`fleet.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`fleet.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,3,1" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={comet}
              palette={['transparent', CYAN, GREY, BONE]}
              fit="grid"
              cellSize={126}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>We have better maps of Mars. Mars does not have four kilometres of water on top of it.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Dr Salla Vainio, chief scientist</cite>
          </blockquote>
        </section>

        {/* --------------------------------------------------------- CRUISES */}
        <section id="cruises" className={s.listing} aria-labelledby="cr-h">
          <div className={s.secHead}>
            <h2 data-edit="cruises.title" data-edit-max="60" id="cr-h">Recent cruises</h2>
            <p data-edit="cruises.body" data-edit-max="240" data-edit-multiline>Every one of these has its full dataset online. The number is the cruise, not the year.</p>
          </div>
          <ol className={s.table}>
            {CRUISES.map((r, i) => (
              <li key={r[0]}>
                <span data-edit={`cruises.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`cruises.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[2]}</span>
                <span data-edit={`cruises.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[1]}</span>
                <span data-edit={`cruises.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`cruises.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- POLICY */}
        <section id="policy" className={s.policy} aria-labelledby="policy-h">
          <div data-edit-pattern="policy.field" data-edit-roles="transparent,3,2" className={s.policyField} aria-hidden="true">
            <TabbiedPattern
              pattern={dustfall}
              palette={['transparent', GREY, CYAN]}
              fit="grid"
              cellSize={104}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.policyInner}>
            <h2 data-edit="policy.title" data-edit-max="60" id="policy-h">What we do with it</h2>
            <dl className={s.policyList}>
              {POLICY.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`policy.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`policy.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Berths, data, collaboration</p>
          <h2 data-edit="contact.officesHead" data-edit-max="60" id="contact-h" className={s.officesHead}>A shore office and two turns</h2>
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
                  pattern={bowl}
                  palette={['transparent', GREY, CYAN]}
                  fit="grid"
                  cellSize={124}
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
            The ship is at sea about two hundred days a year and the shore
            office answers within a week, faster if the request is for data
            that should already be public.
          </p>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,2,1,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={sparkle}
          palette={['transparent', CYAN, BONE, GREY]}
          fit="grid"
          cellSize={110}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <p className={s.footStatement}>
          Data goes public twelve months after the cruise, <em>whether or not</em> we have written about it.
        </p>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">Science</h2>
            <ul>
              <li><a data-edit="footer.zones" data-edit-max="28" href="#zones">The five zones</a></li>
              <li><a data-edit="footer.cruises" data-edit-max="28" href="#cruises">Cruises</a></li>
              <li><a data-edit="footer.policy" data-edit-max="28" href="#policy">Data policy</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Programme</h2>
            <ul>
              <li><a data-edit="footer.fleet" data-edit-max="28" href="#fleet">The fleet</a></li>
              <li><a data-edit="footer.policy2" data-edit-max="28" href="#policy">Berths</a></li>
              <li><a data-edit="footer.policy3" data-edit-max="28" href="#policy">Imagery</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Ashore</h2>
            <p>
              Kaianlage 3
              <br />
              At sea 200 days a year
              <br />
              station@tiefsee.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional research programme. Ships, cruises and figures are invented.</p>
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
