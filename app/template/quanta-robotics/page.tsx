import { TabbiedPattern } from 'tabbied/react';
import type { PatternDefinition } from 'tabbied';
import {
  circuit, hilbert, gimbal, switchback, dotmatrix, metro, isometry, rungs,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './quanta-robotics.module.css';

export const metadata = {
  title: 'Quanta Robotics Laboratory · Machines That Learn by Touching',
  description:
    'An independent robotics laboratory in New Arden. Manipulation, locomotion, and fleet learning research on hardware we build ourselves. Status: SYS.OK.',
};

const VOID = '#0B0E14';
const PHOSPHOR = '#25E0C8';
const SLATE = '#4A5568';
const PAPER = '#E8ECF1';
const INDIGO = '#7A88FF';
const PANEL = '#1A2230';

type Platform = {
  id: string;
  codename: string;
  role: string;
  status: string;
  log: string;
  slug: string;
  alt: string;
  seed: string;
  palette: string[];
  specs: [string, string][];
};

const PLATFORMS: Platform[] = [
  {
    id: 'QA-6',
    codename: 'VECTOR',
    role: 'Six-axis manipulator',
    status: 'DEPLOYED',
    log: 'Fourth revision. Learned to fold a shirt in 2024, to fold it well in 2025. Currently unloading dishwashers at partner sites and keeping notes.',
    slug: 'quanta-arm-cutout',
    alt: 'Six-axis robotic arm with teal accents, posed mid-reach',
    seed: 'qx-vector',
    palette: [PANEL, PHOSPHOR, SLATE, VOID],
    specs: [
      ['AXES', '6'],
      ['REACH', '940 mm'],
      ['PAYLOAD', '12 kg'],
      ['REPEATABILITY', '±0.02 mm'],
      ['CONTROL LOOP', '1 kHz / EtherCAT'],
      ['MASS', '38 kg'],
    ],
  },
  {
    id: 'QR-2',
    codename: 'SURVEYOR',
    role: 'All-terrain research rover',
    status: 'FIELD TRIALS',
    log: 'Eleven-hour endurance, four independent drive pods, one incident involving a hedge (resolved). Mapping the Foundry Walk quarry since March.',
    slug: 'quanta-rover-cutout',
    alt: 'Four-wheeled research rover with sensor mast and cargo bay',
    seed: 'qx-surveyor',
    palette: [PANEL, INDIGO, SLATE, VOID],
    specs: [
      ['DRIVE', '4 × independent pods'],
      ['TOP SPEED', '1.8 m/s'],
      ['ENDURANCE', '11 h'],
      ['PAYLOAD BAY', '40 L'],
      ['SENSING', 'LIDAR + stereo + IMU'],
      ['INGRESS', 'IP54'],
    ],
  },
  {
    id: 'QD-9',
    codename: 'KESTREL',
    role: 'Autonomous quadrotor',
    status: 'DEPLOYED',
    log: 'Onboard visual-inertial odometry, no GPS, no excuses. Flies the lab perimeter every morning at 06:10 and files a report nobody asked for.',
    slug: 'quanta-drone-cutout',
    alt: 'Compact quadcopter drone with guarded rotors',
    seed: 'qx-kestrel',
    palette: [PANEL, PHOSPHOR, INDIGO, VOID],
    specs: [
      ['ROTOR SPAN', '620 mm'],
      ['MASS', '1.4 kg'],
      ['FLIGHT TIME', '34 min'],
      ['WIND LIMIT', '12 m/s'],
      ['AUTONOMY', 'Onboard VIO'],
      ['NAVIGATION', 'GPS-denied'],
    ],
  },
  {
    id: 'QC-1',
    codename: 'BASEMENT',
    role: 'Fleet learning cluster',
    status: 'ALWAYS ON',
    log: 'The only platform that never leaves the building. Replays every grasp, fall, and near-miss from the fleet overnight; the robots wake up slightly better.',
    slug: 'quanta-server-cutout',
    alt: 'Tall server rack with cabling and status lights',
    seed: 'qx-basement',
    palette: [PANEL, SLATE, PHOSPHOR, VOID],
    specs: [
      ['NODES', '24'],
      ['ACCELERATORS', '96'],
      ['STORAGE', '2.4 PB'],
      ['INTERCONNECT', '800 Gb/s'],
      ['SIM THROUGHPUT', '40k episodes/day'],
      ['COOLING', 'Rear-door liquid'],
    ],
  },
];

/**
 * Six research areas, six spreads. Each carries its own generated plate and its
 * own pattern, so the six panels never repeat a pattern; the palettes all come
 * out of the same six site colours, which is what keeps the run coherent.
 */
type ResearchArea = {
  code: string;
  name: string;
  copy: string;
  slug: string;
  alt: string;
  art: PatternDefinition;
  seed: string;
  palette: string[];
  cell: number;
};

const RESEARCH: ResearchArea[] = [
  {
    code: 'RA-01',
    name: 'Manipulation',
    copy: 'Grasping things that were not designed to be grasped. Deformables, transparents, the lab mug with the broken handle.',
    slug: 'quanta-ra-manipulation',
    alt: 'A robot gripper closing on a folded cloth beside a glass beaker and a chipped mug',
    art: gimbal,
    seed: 'qx-ra-01',
    palette: [PANEL, PHOSPHOR, SLATE, VOID],
    cell: 78,
  },
  {
    code: 'RA-02',
    name: 'Locomotion',
    copy: 'Wheels where wheels work, legs where they do not. Recovery behaviors trained on 40,000 simulated falls and eleven real ones.',
    slug: 'quanta-ra-locomotion',
    alt: 'A four-legged robot mid-stride across a ramp of test blocks, a wheeled unit parked behind it',
    art: switchback,
    seed: 'qx-ra-02',
    palette: [PANEL, INDIGO, PHOSPHOR, VOID],
    cell: 66,
  },
  {
    code: 'RA-03',
    name: 'Perception & SLAM',
    copy: 'Maps that survive moved furniture. Long-horizon localization without GPS, beacons, or wishful thinking.',
    slug: 'quanta-ra-perception',
    alt: 'A rover with a spinning lidar head scanning a room drawn as a floating point cloud',
    art: dotmatrix,
    seed: 'qx-ra-03',
    palette: [PANEL, PHOSPHOR, INDIGO, SLATE],
    cell: 44,
  },
  {
    code: 'RA-04',
    name: 'Fleet learning',
    copy: 'Every robot\'s worst moment becomes every robot\'s training data. Nightly consolidation across the whole fleet.',
    slug: 'quanta-ra-fleet',
    alt: 'A row of small robots in charging docks, light traces converging into a server cabinet',
    art: metro,
    seed: 'qx-ra-04',
    palette: [PANEL, PHOSPHOR, INDIGO, PAPER],
    cell: 88,
  },
  {
    code: 'RA-05',
    name: 'Sim-to-real',
    copy: 'Closing the gap between the physics engine and the physics. Domain randomization with a grudge.',
    slug: 'quanta-ra-simreal',
    alt: 'The same robot arm twice, once as a simulation wireframe and once as a machine on a bench',
    art: isometry,
    seed: 'qx-ra-05',
    palette: [PANEL, SLATE, PHOSPHOR, INDIGO],
    cell: 56,
  },
  {
    code: 'RA-06',
    name: 'Human-robot safety',
    copy: 'Force limits, intent signaling, and the hard problem of standing politely in a corridor. Certified before clever.',
    slug: 'quanta-ra-safety',
    alt: 'A robot arm slowing as a human hand enters its work cell, a glowing boundary on the floor',
    art: rungs,
    seed: 'qx-ra-06',
    palette: [PANEL, INDIGO, PHOSPHOR, SLATE],
    cell: 62,
  },
];

const TELEMETRY = [
  { value: '2,412', unit: 'days', label: 'Lab uptime' },
  { value: '18.4M', unit: 'episodes', label: 'Logged to BASEMENT' },
  { value: '94.2%', unit: 'grasp', label: 'Success, novel objects' },
  { value: '61,300', unit: 'hours', label: 'Teleop demonstrations' },
  { value: '9.4', unit: 'km', label: 'Rover km per intervention' },
  { value: '0', unit: 'incidents', label: 'Reportable, 36 months' },
];

const PUBLICATIONS = [
  {
    year: '2026',
    title: 'Grasping the Long Tail: Fleet-Scale Consolidation for Household Objects',
    authors: 'Okafor, Lindqvist, Marsh',
    venue: 'Proc. CoRL',
  },
  {
    year: '2026',
    title: 'KESTREL: Perimeter Flight Without GPS, Twelve Months of Mornings',
    authors: 'Marsh, Tran',
    venue: 'Field Robotics Letters 11(2)',
  },
  {
    year: '2025',
    title: 'Eleven Real Falls: What Simulation Still Gets Wrong About Recovery',
    authors: 'Lindqvist, Adeyemi, Okafor',
    venue: 'Proc. RSS',
  },
  {
    year: '2025',
    title: 'Politeness as a Control Objective: Corridor Negotiation at 0.8 m/s',
    authors: 'Tran, Marsh, Whitlock',
    venue: 'HRI Workshop on Shared Spaces',
  },
  {
    year: '2024',
    title: 'VECTOR-3 to VECTOR-4: A Post-Mortem on Folding',
    authors: 'Okafor, Whitlock',
    venue: 'Quanta Technical Report QTR-041',
  },
];

const PARTNERS = [
  { name: 'Meridian Freight Systems', field: 'Depot logistics' },
  { name: 'Halcyon Port Authority', field: 'Container inspection' },
  { name: 'Bluefield Agriculture Group', field: 'Orchard survey' },
  { name: 'Northgate Medical Logistics', field: 'Sterile transport' },
  { name: 'Corvid Aerospace', field: 'Airframe inspection' },
  { name: 'The Ossett Institute', field: 'Assistive research' },
];

const ROLES = [
  { role: 'Research Engineer, Manipulation', team: 'RA-01', type: 'Full-time', loc: 'New Arden' },
  { role: 'Perception Scientist', team: 'RA-03', type: 'Full-time', loc: 'New Arden / hybrid' },
  { role: 'Field Test Lead, Rover', team: 'RA-02', type: 'Full-time', loc: 'New Arden + quarry' },
  { role: 'Machinist & Fabricator', team: 'Workshop', type: 'Full-time', loc: 'New Arden' },
  { role: 'Research Intern', team: 'Any', type: 'Summer 2027', loc: 'New Arden' },
];

function SectionHeader({
  index,
  name,
  id,
}: {
  index: string;
  name: string;
  id?: string;
}) {
  return (
    <h2 className={styles.sectionHeader} id={id}>
      <span className={styles.sectionIndex}>[{index}]</span>
      <span className={styles.sectionRule} aria-hidden="true" />
      <span className={styles.sectionName}>{name}</span>
    </h2>
  );
}

export default function QuantaRoboticsPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--void': '#0b0e14',
        '--phosphor': '#25e0c8',
        '--slate': '#4a5568',
        '--paper': '#e8ecf1',
        '--indigo': '#7a88ff',
        '--panel': '#1a2230',
        '--muted': '#93a1b5',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="void,phosphor,slate,paper,indigo,panel,muted"
      className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
      />

      <header className={styles.statusBar}>
        <a href="#sys-top" className={styles.wordmark}>
          QUANTA<span data-edit="statusBar.wordmarkDim" data-edit-max="60" className={styles.wordmarkDim}>.LAB</span>
        </a>
        <p className={styles.sysOk}>
          <span className={styles.okDot} aria-hidden="true" />
          SYS.OK
        </p>
        <nav aria-label="Sections" className={styles.statusNav}>
          <a data-edit="statusBar.platforms" data-edit-max="28" href="#platforms">platforms</a>
          <a data-edit="statusBar.research" data-edit-max="28" href="#research">research</a>
          <a data-edit="statusBar.pubs" data-edit-max="28" href="#pubs">pubs</a>
          <a data-edit="statusBar.careers" data-edit-max="28" href="#careers">careers</a>
        </nav>
        <p data-edit="statusBar.statusClock" data-edit-max="240" data-edit-multiline className={styles.statusClock}>T+2412d</p>
      </header>

      <main id="sys-top">
        {/* ------------------------------------------------------- HERO */}
        <section className={styles.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="0,1,5,2,4" className={styles.heroPattern}>
            <TabbiedPattern
              pattern={hilbert}
              palette={[VOID, PHOSPHOR, PANEL, SLATE, INDIGO]}
              seed="qx-hero"
              fit="grid"
              cellSize={96}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.heroFade} aria-hidden="true" />
          </div>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.heroBoot} aria-hidden="true">
                &gt; boot sequence complete · 06:12:04
              </p>
              <h1 id="hero-h" className={styles.heroTitle}>
                Machines that learn the world by touching it
                <span className={styles.cursor} aria-hidden="true" />
              </h1>
              <p data-edit="hero.heroSub" data-edit-max="240" data-edit-multiline className={styles.heroSub}>
                Quanta is an independent robotics laboratory in New Arden.
                We design our own platforms, run them until they fail, log the
                failure, and ship the lesson to the whole fleet by morning.
              </p>
              <dl className={styles.heroReadout}>
                <div>
                  <dt data-edit="hero.term" data-edit-max="28">FLEET</dt>
                  <dd data-edit="hero.body" data-edit-max="200" data-edit-multiline>31 units / 4 platforms</dd>
                </div>
                <div>
                  <dt data-edit="hero.term2" data-edit-max="28">MODE</dt>
                  <dd data-edit="hero.body2" data-edit-max="200" data-edit-multiline>continuous field trials</dd>
                </div>
                <div>
                  <dt data-edit="hero.term3" data-edit-max="28">FUNDING</dt>
                  <dd data-edit="hero.body3" data-edit-max="200" data-edit-multiline>independent, partner-backed</dd>
                </div>
              </dl>
              <div className={styles.heroActions}>
                <a data-edit="hero.cmdPrimary" data-edit-max="28" href="#platforms" className={styles.cmdPrimary}>
                  ./view --platforms
                </a>
                <a data-edit="hero.cmdSecondary" data-edit-max="28" href="#careers" className={styles.cmdSecondary}>
                  ./join
                </a>
              </div>
            </div>
            <figure className={styles.heroViewport}>
              <Figure editId="photo.quanta-hero"
                slug="quanta-hero"
                alt="Isometric view of the Quanta laboratory floor: robot arms at benches, a rover dock, and cable trays overhead"
                priority
                className={styles.heroImg}
              />
              <figcaption data-edit="hero.heroCaption" data-edit-max="120" data-edit-multiline className={styles.heroCaption}>
                FIG.0 / LAB FLOOR, BUILDING 4 / 06:10 PERIMETER FLIGHT IN PROGRESS
              </figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------- PLATFORMS */}
        <section className={styles.platforms} aria-labelledby="platforms">
          <SectionHeader index="01" name="PLATFORMS" id="platforms" />
          <p data-edit="platforms.sectionLede" data-edit-max="240" data-edit-multiline className={styles.sectionLede}>
            Four platforms, all designed and machined in-house. Spec sheets
            below are measured, not aspirational.
          </p>
          <div className={styles.platformGrid}>
            {PLATFORMS.map((p, i) => (
              <article key={p.id} className={styles.platformCard}>
                <header className={styles.platformHead}>
                  <h3 className={styles.platformName}>
                    <span data-edit={`platformHead.platformId.${i}`} data-edit-max="60" className={styles.platformId}>{p.id}</span> "{p.codename}"
                  </h3>
                  <p data-edit={`platformHead.platformStatus.${i}`} data-edit-max="240" data-edit-multiline className={styles.platformStatus} data-status={p.status}>
                    {p.status}
                  </p>
                </header>
                <div data-edit-pattern={`platformCard.field.${i}`} className={styles.platformStage} style={{ backgroundColor: p.palette[0] }}>
                  <TabbiedPattern
                    pattern={hilbert}
                    palette={p.palette}
                    seed={p.seed}
                    fit="grid"
                    cellSize={26}
                    style={{ position: 'absolute', inset: 0, opacity: 0.55 }}
                  />
                  <span className={styles.platformVeil} aria-hidden="true" />
                  <Figure editId={`platformCard.photo.${i}`}
                    slug={p.slug}
                    cutout
                    alt={p.alt}
                    className={styles.platformCutout}
                  />
                </div>
                <p data-edit={`platformCard.platformRole.${i}`} data-edit-max="240" data-edit-multiline className={styles.platformRole}>{p.role}</p>
                <p data-edit={`platformCard.platformLog.${i}`} data-edit-max="240" data-edit-multiline className={styles.platformLog}>{p.log}</p>
                <table className={styles.specTable}>
                  <caption className={styles.specCaption}>
                    {p.id} measured specification
                  </caption>
                  <tbody>
                    {p.specs.map(([k, v], i2) => (
                      <tr key={k}>
                        <th data-edit={`platformCard.heading.${i}.${i2}`} scope="row">{k}</th>
                        <td data-edit={`platformCard.cell.${i}.${i2}`}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- RESEARCH */}
        <section className={styles.research} aria-labelledby="research">
          <SectionHeader index="02" name="RESEARCH AREAS" id="research" />
          <ul className={styles.researchList}>
            {RESEARCH.map((r, i) => (
              <li key={r.code} className={styles.researchRow}>
                <div className={styles.researchShot}>
                  <Figure editId={`research.photo.${i}`} slug={r.slug} alt={r.alt} />
                </div>
                <div data-edit-pattern={`research.field.${i}`} className={styles.researchPanel}>
                  <TabbiedPattern
                    pattern={r.art}
                    palette={r.palette}
                    seed={r.seed}
                    fit="grid"
                    cellSize={r.cell}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                  <div className={styles.researchScrim} aria-hidden="true" />
                  <div className={styles.researchText}>
                    <p data-edit={`research.researchCode.${i}`} data-edit-max="240" data-edit-multiline className={styles.researchCode}>{r.code}</p>
                    <h3 data-edit={`research.researchName.${i}`} data-edit-max="40" className={styles.researchName}>{r.name}</h3>
                    <p data-edit={`research.researchCopy.${i}`} data-edit-max="240" data-edit-multiline className={styles.researchCopy}>{r.copy}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------- TELEMETRY */}
        <section className={styles.telemetry} aria-labelledby="telemetry-h">
          <div data-edit-pattern="telemetry.field" data-edit-roles="0,1,4,2,3" className={styles.telemetryPattern}>
            <TabbiedPattern
              pattern={circuit}
              palette={[VOID, PHOSPHOR, INDIGO, SLATE, PAPER]}
              seed="qx-telemetry"
              fit="grid"
              cellSize={64}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.telemetryScrim} aria-hidden="true" />
          </div>
          <div className={styles.telemetryInner}>
            <h2 id="telemetry-h" className={styles.telemetryTitle}>
              LAB TELEMETRY <span data-edit="telemetry.telemetryStamp" data-edit-max="60" className={styles.telemetryStamp}>SNAPSHOT 2026-07-31 06:12 UTC</span>
            </h2>
            <dl className={styles.telemetryGrid}>
              {TELEMETRY.map((t, i) => (
                <div key={t.label} className={styles.telemetryStat}>
                  <dd className={styles.telemetryValue}>
                    {t.value}
                    <span data-edit={`telemetry.telemetryUnit.${i}`} data-edit-max="60" className={styles.telemetryUnit}> {t.unit}</span>
                  </dd>
                  <dt data-edit={`telemetry.telemetryLabel.${i}`} data-edit-max="28" className={styles.telemetryLabel}>{t.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------- FACILITY */}
        <section className={styles.facility} aria-labelledby="facility-h">
          <SectionHeader index="03" name="THE LINE" id="facility-h" />
          <div className={styles.facilitySplit}>
            <figure className={styles.facilityFigure}>
              <Figure editId="photo.quanta-line"
                slug="quanta-line"
                alt="The small-batch assembly line at Quanta: partially built arms on fixtures under task lighting"
                className={styles.facilityImg}
              />
              <figcaption data-edit="facility.heroCaption" data-edit-max="120" data-edit-multiline className={styles.heroCaption}>
                FIG.3 / ASSEMBLY LINE, EAST BAY. BATCH 7 OF VECTOR REV D.
              </figcaption>
            </figure>
            <div className={styles.facilityCopy}>
              <p data-edit="facility.body" data-edit-max="240" data-edit-multiline>
                We build in batches of eight. Small enough that every unit gets
                torqued by a person who cares, large enough that the fixtures
                pay for themselves. Machining, harness, and calibration happen
                within forty meters of the researchers who will file the bug
                reports.
              </p>
              <p data-edit="facility.body2" data-edit-max="240" data-edit-multiline>
                The line runs two weeks per quarter. The rest of the time it is
                a repair bay, which tells you most of what field robotics is.
              </p>
              <ul className={styles.facilityList}>
                <li data-edit="facility.item" data-edit-max="80">CNC + wire EDM in-house</li>
                <li data-edit="facility.item2" data-edit-max="80">Harnesses hand-built, continuity-tested twice</li>
                <li data-edit="facility.item3" data-edit-max="80">Every joint serialized and torque-logged</li>
                <li data-edit="facility.item4" data-edit-max="80">Calibration rig shared with RA-01</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------- PUBLICATIONS */}
        <section className={styles.pubs} aria-labelledby="pubs">
          <SectionHeader index="04" name="PUBLICATIONS" id="pubs" />
          <ol className={styles.pubList}>
            {PUBLICATIONS.map((pub, i) => (
              <li key={pub.title} className={styles.pubRow}>
                <span data-edit={`pubs.pubYear.${i}`} data-edit-max="60" className={styles.pubYear}>{pub.year}</span>
                <div className={styles.pubBody}>
                  <h3 data-edit={`pubs.pubTitle.${i}`} data-edit-max="40" className={styles.pubTitle}>{pub.title}</h3>
                  <p className={styles.pubMeta}>
                    {pub.authors} · <cite data-edit={`pubs.attribution.${i}`} data-edit-max="48">{pub.venue}</cite>
                  </p>
                </div>
                <span className={styles.pubLinks} aria-hidden="true">
                  [PDF] [BIB]
                </span>
              </li>
            ))}
          </ol>
          <p data-edit="pubs.pubNote" data-edit-max="240" data-edit-multiline className={styles.pubNote}>
            Preprints on request. QTR series available under NDA, except
            QTR-041, which is mostly an apology to a shirt.
          </p>
        </section>

        {/* ------------------------------------------------ PARTNERSHIPS */}
        <section className={styles.partners} aria-labelledby="partners-h">
          <SectionHeader index="05" name="PARTNERSHIPS" id="partners-h" />
          <p data-edit="partners.sectionLede" data-edit-max="240" data-edit-multiline className={styles.sectionLede}>
            We deploy with partners whose problems are boring, repetitive, and
            therefore perfect. Pilots run 90 days with our engineers on-site.
          </p>
          <ul className={styles.partnerGrid}>
            {PARTNERS.map((p, i) => (
              <li key={p.name} className={styles.partnerCell}>
                <span data-edit={`partners.partnerName.${i}`} data-edit-max="60" className={styles.partnerName}>{p.name}</span>
                <span data-edit={`partners.partnerField.${i}`} data-edit-max="60" className={styles.partnerField}>{p.field}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------- CAREERS */}
        <section className={styles.careers} aria-labelledby="careers">
          <SectionHeader index="06" name="CAREERS" id="careers" />
          <p data-edit="careers.sectionLede" data-edit-max="240" data-edit-multiline className={styles.sectionLede}>
            Five open positions. We hire people who fix the thing before
            writing the ticket, then write the ticket anyway.
          </p>
          <div className={styles.rolesScroll}>
            <table className={styles.rolesTable}>
              <thead>
                <tr>
                  <th data-edit="careers.heading" scope="col">ROLE</th>
                  <th data-edit="careers.heading2" scope="col">TEAM</th>
                  <th data-edit="careers.heading3" scope="col">TYPE</th>
                  <th data-edit="careers.heading4" scope="col">LOCATION</th>
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r, i) => (
                  <tr key={r.role}>
                    <th data-edit={`careers.heading5.${i}`} scope="row">{r.role}</th>
                    <td data-edit={`careers.cell.${i}`}>{r.team}</td>
                    <td data-edit={`careers.cell2.${i}`}>{r.type}</td>
                    <td data-edit={`careers.cell3.${i}`}>{r.loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.careersApply}>
            Apply with something you have built:{' '}
            <a data-edit="careers.link" data-edit-max="28" href="mailto:join@quanta.example">join@quanta.example</a>
            <span className={styles.cursor} aria-hidden="true" />
          </p>
        </section>
      </main>

      {/* ------------------------------------------------------- FOOTER */}
      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="0,2,1,4" className={styles.footerPattern}>
          <TabbiedPattern
            pattern={circuit}
            palette={[VOID, SLATE, PHOSPHOR, INDIGO]}
            seed="qx-footer"
            fit="grid"
            cellSize={78}
            style={{ position: 'absolute', inset: 0 }}
          />
          <div className={styles.footerScrim} aria-hidden="true" />
        </div>
        <div className={styles.footerGrid}>
          <div>
            <p data-edit="footer.footerWordmark" data-edit-max="240" data-edit-multiline className={styles.footerWordmark}>QUANTA.LAB</p>
            <p className={styles.footerAddr}>
              Building 4, 220 Foundry Walk
              <br />
              New Arden, NA2 4QX
            </p>
          </div>
          <dl className={styles.footerMeta}>
            <div>
              <dt data-edit="footer.term" data-edit-max="28">GENERAL</dt>
              <dd>
                <a data-edit="footer.link" data-edit-max="28" href="mailto:hello@quanta.example">hello@quanta.example</a>
              </dd>
            </div>
            <div>
              <dt data-edit="footer.term2" data-edit-max="28">PARTNERSHIPS</dt>
              <dd>
                <a data-edit="footer.link2" data-edit-max="28" href="mailto:deploy@quanta.example">deploy@quanta.example</a>
              </dd>
            </div>
            <div>
              <dt data-edit="footer.term3" data-edit-max="28">VISITS</dt>
              <dd data-edit="footer.body" data-edit-max="200" data-edit-multiline>By appointment. Closed during batch weeks.</dd>
            </div>
          </dl>
          <p className={styles.footerLog}>
            &gt; session.end · © 2026 Quanta Robotics Laboratory. Fictional
            lab; real affection for robots.
            <br />
            &gt; pattern.src ={' '}
            <a data-edit="footer.footerCredit" data-edit-max="28" href="https://tabbied.com" rel="noopener" className={styles.footerCredit}>
              tabbied.com
            </a>{' '}
            // hilbert curve + circuit board, rendered live
          </p>
        </div>
      </footer>
    </div>
  );
}
