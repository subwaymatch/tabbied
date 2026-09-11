import { TabbiedPattern } from 'tabbied/react';
import { basse, combed, slashbar } from 'tabbied/patterns';
import s from './nullsec.module.css';

export const metadata = {
  title: 'Nullsec: Security research collective, Berlin',
  description:
    'Nullsec is a security research collective of nine people in Berlin. One hundred and twelve advisories, four tools, a ninety-day disclosure clock, and the occasional talk.',
};

/* Terminal inks. Every field draws on `transparent`, so the pattern sits in
   the near-black of the page rather than on a plate of its own. */
const INK = '#D9F5E3';
const GREEN = '#2CFF7A';
const GREY = '#5C7365';
const PALE = '#0E1713';

const NAV = [
  ['advisories', '#advisories'],
  ['tools', '#tools'],
  ['disclosure', '#disclosure'],
  ['talks', '#talks'],
  ['members', '#members'],
  ['contact', '#contact'],
];

const FACTS = [
  ['112', 'advisories since 2017'],
  ['47', 'CVEs credited'],
  ['4', 'tools maintained'],
  ['9', 'members'],
];

type Advisory = {
  id: string;
  cve: string;
  product: string;
  severity: string;
  status: string;
  date: string;
};

const ADVISORIES: Advisory[] = [
  { id: 'NS-2026-014', cve: 'CVE-2026-31877', product: 'Ferrule Gateway 4.x', severity: 'Critical', status: 'Published', date: '2026-08-27' },
  { id: 'NS-2026-013', cve: 'CVE-2026-30412', product: 'Lantern MDM agent', severity: 'High', status: 'Embargo to 09-30', date: '2026-08-12' },
  { id: 'NS-2026-011', cve: 'CVE-2026-27109', product: 'Brightlink meter firmware', severity: 'High', status: 'Published', date: '2026-07-03' },
  { id: 'NS-2026-009', cve: 'CVE-2026-24551', product: 'Kestrel VPN client, Linux', severity: 'Medium', status: 'Published', date: '2026-06-18' },
  { id: 'NS-2026-007', cve: 'CVE-2026-21938', product: 'Quillbox e-invoice validator', severity: 'Critical', status: 'Published', date: '2026-05-02' },
  { id: 'NS-2026-005', cve: 'CVE-2026-18204', product: 'Tessellate CI runner', severity: 'Medium', status: 'Fixed, no CVE text', date: '2026-03-21' },
  { id: 'NS-2026-003', cve: 'CVE-2026-14670', product: 'Marrow OTA updater', severity: 'High', status: 'Published', date: '2026-02-09' },
  { id: 'NS-2026-001', cve: 'none assigned', product: 'Halyard door controller', severity: 'Low', status: 'Published', date: '2026-01-14' },
];

type Tool = {
  name: string;
  blurb: string;
  meta: string;
};

const TOOLS: Tool[] = [
  {
    name: 'hexwire',
    blurb: 'A stateful fuzzer for binary network protocols. Grammar in, crashes out, every crash replayable from a single file.',
    meta: 'MIT / v3.4.1 / Rust',
  },
  {
    name: 'sieve',
    blurb: 'Unpacks firmware images from sixty-one vendors into a directory you can grep. Knows the padding tricks so you do not have to.',
    meta: 'GPL-3.0 / v1.9.0 / Python',
  },
  {
    name: 'pinhole',
    blurb: 'A TLS-terminating proxy for devices that pin the wrong certificate. Sits between the thing and its cloud and shows you the conversation.',
    meta: 'Apache-2.0 / v0.12.3 / Go',
  },
  {
    name: 'dredge',
    blurb: 'Pulls keys, tokens and URLs out of memory dumps and core files, and tells you which process they belonged to.',
    meta: 'MIT / v2.1.0 / C',
  },
];

type Step = {
  day: string;
  title: string;
  body: string;
};

const POLICY: Step[] = [
  {
    day: 'day 0',
    title: 'Report',
    body: 'We write to the vendor security contact, or the nearest thing we can find, with a proof of concept and a proposed fix where we have one. The mail is signed and the clock starts.',
  },
  {
    day: 'day 7',
    title: 'Second channel',
    body: 'If nobody has acknowledged, we try another route (a support address, a maintainer, a board member on a public network) and copy the national CERT.',
  },
  {
    day: 'day 30',
    title: 'Status check',
    body: 'We ask for a fix date and say what our publication date is. A vendor that has started work and says so gets our full cooperation on the text.',
  },
  {
    day: 'day 90',
    title: 'Publish',
    body: 'The advisory goes out with or without a fix. A fix that is in progress with a date we believe extends this by up to thirty days, once.',
  },
  {
    day: 'exploited',
    title: 'Bring it forward',
    body: 'Evidence of exploitation in the wild moves publication to seven days from the evidence, because at that point secrecy is protecting nobody but the attacker.',
  },
  {
    day: 'always',
    title: 'Credit accurately',
    body: 'The advisory records how the vendor responded, including silence, in a timeline with dates. We do not editorialise; the dates do that.',
  },
];

type Talk = {
  year: string;
  event: string;
  city: string;
  title: string;
  who: string;
};

const TALKS: Talk[] = [
  { year: '2026', event: 'Overrun', city: 'Amsterdam', title: 'Ninety days is a long time: what actually happens after disclosure', who: 'vex' },
  { year: '2026', event: 'Lockpick', city: 'Berlin', title: 'Every smart meter in this room', who: 'nadir, moth' },
  { year: '2025', event: 'Bytefall', city: 'Prague', title: 'Sixty-one vendors, one unpacker', who: 's1lke' },
  { year: '2025', event: 'Sealed Congress', city: 'Leipzig', title: 'A door controller that opens for anyone', who: 'ort' },
  { year: '2025', event: 'Hexwerk', city: 'Wien', title: 'Fuzzing stateful protocols without writing the state machine', who: 'vex' },
  { year: '2024', event: 'Overrun', city: 'Amsterdam', title: 'Pinned wrong: certificate pinning in the field', who: 'pf_' },
  { year: '2024', event: 'Lockpick', city: 'Berlin', title: 'What a CERT does with your email', who: 'nadir' },
];

type Member = {
  handle: string;
  focus: string;
  since: string;
};

const MEMBERS: Member[] = [
  { handle: 'vex', focus: 'Protocol fuzzing, hexwire', since: '2017' },
  { handle: 'nadir', focus: 'Coordination, CERT liaison', since: '2017' },
  { handle: 'moth', focus: 'Embedded and RF', since: '2018' },
  { handle: 's1lke', focus: 'Firmware, sieve', since: '2019' },
  { handle: 'ort', focus: 'Physical access systems', since: '2020' },
  { handle: 'pf_', focus: 'TLS and PKI, pinhole', since: '2020' },
  { handle: 'quorra', focus: 'Web and identity', since: '2022' },
  { handle: 'hal9', focus: 'Cloud and CI/CD', since: '2023' },
  { handle: 'dusk', focus: 'Memory forensics, dredge', since: '2024' },
];

const CONTACT = [
  ['report', 'report@nullsec.example'],
  ['fingerprint', '4A1F 90C2 7D3E 5B88 1E0C  6F2A D4B7 39E1 A05C 7F42'],
  ['matrix', '#nullsec:matrix.example'],
  ['post', 'Nullsec e.V., Gerichtstrasse 23, 13347 Berlin'],
  ['open lab', 'Thursdays from 19:00, ring twice'],
];

export default function NullsecPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#050807',
        '--ink': '#d9f5e3',
        '--green': '#2cff7a',
        '--grey': '#5c7365',
        '--pale': '#0e1713',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,green,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          nullsec
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>berlin / utc+02:00</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO
            combed draws fine rules in blocks, which on this ground reads as
            a wall of scan lines. Loud at the top, faded out under the
            facts so the numbers sit on plain black. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,4,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={combed}
              palette={['transparent', GREY, PALE, GREEN]}
              fit="grid"
              cellSize={120}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.heroPrompt" data-edit-max="240" data-edit-multiline className={s.heroPrompt}>nullsec@wedding:~$ cat README</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
              We break things
              <br />
              before somebody
              <br />
              <em>else does.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Nullsec is nine researchers in a former print shop in Wedding.
              We find vulnerabilities in software people depend on, report
              them to whoever can fix them, and publish what we learned once
              they have. Or once ninety days have passed, whichever is first.
            </p>
            <dl className={s.ruled + ' ' + s.facts}>
              {FACTS.map(([value, label], i) => (
                <div key={label}>
                  <dt data-edit={`hero.term.${i}`} data-edit-max="28">{value}</dt>
                  <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------- ADVISORIES */}
        <section id="advisories" className={s.section} aria-labelledby="advisories-h">
          <div className={s.sectionHead}>
            <h2 data-edit="advisories.title" data-edit-max="60" id="advisories-h">advisories</h2>
            <p data-edit="advisories.sectionCmd" data-edit-max="240" data-edit-multiline className={s.sectionCmd}>ls -lt advisories/ | head -8</p>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th data-edit="advisories.heading" scope="col">id</th>
                  <th data-edit="advisories.heading2" scope="col">cve</th>
                  <th data-edit="advisories.heading3" scope="col">product</th>
                  <th data-edit="advisories.heading4" scope="col">sev</th>
                  <th data-edit="advisories.heading5" scope="col">status</th>
                  <th data-edit="advisories.heading6" scope="col">date</th>
                </tr>
              </thead>
              <tbody>
                {ADVISORIES.map((a, i) => (
                  <tr key={a.id}>
                    <td data-edit={`advisories.cellId.${i}`} className={s.cellId}>{a.id}</td>
                    <td data-edit={`advisories.cellCve.${i}`} className={s.cellCve}>{a.cve}</td>
                    <td data-edit={`advisories.cellProduct.${i}`} className={s.cellProduct}>{a.product}</td>
                    <td data-edit={`advisories.sevCritical.${i}`}
                      className={
                        a.severity === 'Critical'
                          ? s.sevCritical
                          : a.severity === 'High'
                            ? s.sevHigh
                            : s.sevLow
                      }>
                      {a.severity}
                    </td>
                    <td data-edit={`advisories.cellStatus.${i}`} className={s.cellStatus}>{a.status}</td>
                    <td data-edit={`advisories.cellDate.${i}`} className={s.cellDate}>{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p data-edit="advisories.sectionFoot" data-edit-max="240" data-edit-multiline className={s.sectionFoot}>
            The full index, one hundred and twelve entries since 2017, is in
            the git repository. Every advisory carries a CVE where MITRE would
            give us one and a plain description where they would not.
          </p>
        </section>

        {/* ---------------------------------------------------------- BAND
            basse: wide columns rising through counted levels. The one loud
            field on the page, with nothing to read. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,2,3,1" className={s.bandField} aria-hidden="true">
            <TabbiedPattern
              pattern={basse}
              palette={['transparent', GREEN, GREY, INK]}
              fit="grid"
              cellSize={96}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- TOOLS */}
        <section id="tools" className={s.section} aria-labelledby="tools-h">
          <div className={s.sectionHead}>
            <h2 data-edit="tools.title" data-edit-max="60" id="tools-h">tools</h2>
            <p data-edit="tools.sectionCmd" data-edit-max="240" data-edit-multiline className={s.sectionCmd}>git clone https://git.nullsec.example/</p>
          </div>
          <ul className={s.ruled + ' ' + s.toolGrid}>
            {TOOLS.map((t, i) => (
              <li key={t.name}>
                <h3 data-edit={`tools.title2.${i}`} data-edit-max="40">{t.name}</h3>
                <p data-edit={`tools.toolBlurb.${i}`} data-edit-max="240" data-edit-multiline className={s.toolBlurb}>{t.blurb}</p>
                <p data-edit={`tools.toolMeta.${i}`} data-edit-max="240" data-edit-multiline className={s.toolMeta}>{t.meta}</p>
              </li>
            ))}
          </ul>
          <p data-edit="tools.sectionFoot" data-edit-max="240" data-edit-multiline className={s.sectionFoot}>
            Four tools, all of them things we needed twice. Issues and patches
            are read within the week. A tool nobody here uses any more is
            archived, not abandoned, and the README says which.
          </p>
        </section>

        {/* ---------------------------------------------------- DISCLOSURE
            slashbar as a quiet wash: sparse bars at low opacity, with the
            paper colour pooled under the steps so the policy stays legible. */}
        <section id="disclosure" className={s.disclosure} aria-labelledby="disclosure-h">
          <div data-edit-pattern="disclosure.field" data-edit-roles="transparent,3,4,1" className={s.washField} aria-hidden="true">
            <TabbiedPattern
              pattern={slashbar}
              palette={['transparent', GREY, PALE, INK]}
              fit="grid"
              cellSize={88}
              redrawInterval={6600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.disclosureInner}>
            <div className={s.sectionHead}>
              <h2 data-edit="disclosure.title" data-edit-max="60" id="disclosure-h">coordinated disclosure</h2>
              <p data-edit="disclosure.sectionCmd" data-edit-max="240" data-edit-multiline className={s.sectionCmd}>cat POLICY.md</p>
            </div>
            <ol className={s.ruled + ' ' + s.policy}>
              {POLICY.map((step, i) => (
                <li key={step.day}>
                  <span data-edit={`disclosure.policyDay.${i}`} data-edit-max="60" className={s.policyDay}>{step.day}</span>
                  <h3 data-edit={`disclosure.title2.${i}`} data-edit-max="40">{step.title}</h3>
                  <p data-edit={`disclosure.body.${i}`} data-edit-max="240" data-edit-multiline>{step.body}</p>
                </li>
              ))}
            </ol>
            <p data-edit="disclosure.sectionFoot" data-edit-max="240" data-edit-multiline className={s.sectionFoot}>
              The policy has not changed since 2019 and is applied to every
              report, including the ones where we like the vendor. A vendor
              that wants a different timeline can ask, in writing, with a
              reason, and the answer is usually yes for a fix and no for a
              lawyer.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------- TALKS */}
        <section id="talks" className={s.section} aria-labelledby="talks-h">
          <div className={s.sectionHead}>
            <h2 data-edit="talks.title" data-edit-max="60" id="talks-h">talks</h2>
            <p data-edit="talks.sectionCmd" data-edit-max="240" data-edit-multiline className={s.sectionCmd}>grep -r slides ./talks | sort -r</p>
          </div>
          <ol className={s.talks}>
            {TALKS.map((t, i) => (
              <li key={`${t.year}-${t.event}-${t.who}`}>
                <span data-edit={`talks.talkYear.${i}`} data-edit-max="60" className={s.talkYear}>{t.year}</span>
                <span data-edit={`talks.talkTitle.${i}`} data-edit-max="60" className={s.talkTitle}>{t.title}</span>
                <span data-edit={`talks.talkEvent.${i}`} data-edit-max="60" className={s.talkEvent}>{t.event}</span>
                <span data-edit={`talks.talkCity.${i}`} data-edit-max="60" className={s.talkCity}>{t.city}</span>
                <span data-edit={`talks.talkWho.${i}`} data-edit-max="60" className={s.talkWho}>{t.who}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- MEMBERS */}
        <section id="members" className={s.section} aria-labelledby="members-h">
          <div className={s.sectionHead}>
            <h2 data-edit="members.title" data-edit-max="60" id="members-h">members</h2>
            <p data-edit="members.sectionCmd" data-edit-max="240" data-edit-multiline className={s.sectionCmd}>getent group nullsec</p>
          </div>
          <ul className={s.ruled + ' ' + s.members}>
            {MEMBERS.map((m, i) => (
              <li key={m.handle}>
                <span data-edit={`members.memberHandle.${i}`} data-edit-max="60" className={s.memberHandle}>{m.handle}</span>
                <span data-edit={`members.memberFocus.${i}`} data-edit-max="60" className={s.memberFocus}>{m.focus}</span>
                <span data-edit={`members.memberSince.${i}`} data-edit-max="60" className={s.memberSince}>{m.since}</span>
              </li>
            ))}
          </ul>
          <p data-edit="members.sectionFoot" data-edit-max="240" data-edit-multiline className={s.sectionFoot}>
            Membership is by invitation after a year of showing up on
            Thursdays. There is no fee, no hierarchy and no logo on a hoodie.
            Handles are what we use in advisories; names are on the register
            of the Verein like anybody else.
          </p>
        </section>

        {/* ------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div className={s.sectionHead}>
            <h2 data-edit="contact.title" data-edit-max="60" id="contact-h">contact</h2>
            <p data-edit="contact.sectionCmd" data-edit-max="240" data-edit-multiline className={s.sectionCmd}>gpg --fingerprint report@nullsec.example</p>
          </div>
          <div className={s.contactGrid}>
            <dl className={s.ruled + ' ' + s.contactList}>
              {CONTACT.map(([term, value], i) => (
                <div key={term}>
                  <dt data-edit={`contact.term.${i}`} data-edit-max="28">{term}</dt>
                  <dd data-edit={`contact.body.${i}`} data-edit-max="200" data-edit-multiline>{value}</dd>
                </div>
              ))}
            </dl>
            <div className={s.contactNote}>
              <p data-edit="contact.body2" data-edit-max="240" data-edit-multiline>
                Encrypt reports to the key above. Reports that arrive in the
                clear are answered in the clear, which is a choice we would
                rather you did not make on our behalf.
              </p>
              <p data-edit="contact.body3" data-edit-max="240" data-edit-multiline>
                We do not run a bug bounty and do not take rewards for
                advisories. If you are a vendor and one of our reports has
                reached you, reply to the mail; the clock is already running.
              </p>
              <a data-edit="contact.button" data-edit-max="28" className={s.button} href="mailto:report@nullsec.example">
                write to report@
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* A coda: combed at a small cell, so it reads as the raw data stream
          the rest of the page was summarising. Nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,3,2,4" className={s.codaField} aria-hidden="true">
          <TabbiedPattern
            pattern={combed}
            palette={['transparent', GREY, GREEN, PALE]}
            fit="grid"
            cellSize={72}
            redrawInterval={3900}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>nullsec</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              A security research collective, registered as a Verein in
              Berlin since 2017. Nine members, one print shop, no clients.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>work</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.advisories" data-edit-max="28" href="#advisories">advisories</a>
              </li>
              <li>
                <a data-edit="footer.tools" data-edit-max="28" href="#tools">tools</a>
              </li>
              <li>
                <a data-edit="footer.talks" data-edit-max="28" href="#talks">talks</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>collective</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.disclosure" data-edit-max="28" href="#disclosure">disclosure policy</a>
              </li>
              <li>
                <a data-edit="footer.members" data-edit-max="28" href="#members">members</a>
              </li>
              <li>
                <a data-edit="footer.contact" data-edit-max="28" href="#contact">open lab</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>post</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Nullsec e.V.
              <br />
              Gerichtstrasse 23
              <br />
              13347 Berlin
              <br />
              report@nullsec.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>
            A fictional research collective. The advisories, tools, talks,
            people and fingerprint are invented.
          </p>
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
