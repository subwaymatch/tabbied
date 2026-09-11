import { TabbiedPattern } from 'tabbied/react';
import { bluff, garret, pinwheel } from 'tabbied/patterns';
import s from './velo-criterium.module.css';

export const metadata = {
  title: 'Velo Criterium: City-centre cycling race, Ghent',
  description:
    'Velo Criterium is a one-day criterium on a 1.4 km loop through the centre of Ghent. Seven races from sign-on to the elite finals, on Saturday 19 September 2026.',
};

/* Night ground, bone type, a lime and an electric blue. Every field draws on
   `transparent`, so the pattern sits in the navy of the page rather than on
   a plate of its own. */
const INK = '#F2F5FF';
const LIME = '#C6FF3D';
const BLUE = '#2F6BFF';
const GREY = '#6C7590';
/* Tiles pin their doodle to a whole multiple of the cell (6 x 72px) and let
   the plate clip it, so every grid track is a whole pixel. */
const TILE_BOX = 432;

const NAV = [
  ['Schedule', '#schedule'],
  ['Course', '#course'],
  ['Categories', '#categories'],
  ['Results', '#results'],
  ['Partners', '#partners'],
  ['Spectators', '#spectators'],
  ['Contact', '#contact'],
];

const BIG = [
  ['1.4', 'km per lap'],
  ['8', 'corners'],
  ['60', 'laps, elite men'],
  ['7', 'races in a day'],
];

type Slot = {
  time: string;
  what: string;
  detail: string;
  race: boolean;
};

const SCHEDULE: Slot[] = [
  { time: '07:30', what: 'Sign-on opens', detail: 'Korenmarkt tent, numbers and transponders', race: false },
  { time: '08:30', what: 'Under 15', detail: '20 laps, 28 km', race: true },
  { time: '09:30', what: 'Under 17', detail: '25 laps, 35 km', race: true },
  { time: '10:30', what: 'Women, amateur', detail: '30 laps, 42 km', race: true },
  { time: '11:45', what: 'Men, amateur', detail: '35 laps, 49 km', race: true },
  { time: '13:00', what: 'Course open', detail: 'Walk or ride the loop, slowly, for an hour', race: false },
  { time: '13:30', what: 'Kids lap', detail: 'One lap, any bike, no number needed', race: false },
  { time: '14:15', what: 'Women, elite', detail: '40 laps, 56 km, prime every tenth lap', race: true },
  { time: '16:30', what: 'Men, elite', detail: '60 laps, 84 km, prime every tenth lap', race: true },
  { time: '18:15', what: 'Podium', detail: 'Korenmarkt, both elite races', race: false },
  { time: '19:00', what: 'Roads reopen', detail: 'Barriers down by 20:00', race: false },
];

type Corner = {
  n: string;
  name: string;
  turn: string;
  note: string;
};

const CORNERS: Corner[] = [
  { n: '1', name: 'Korenmarkt', turn: 'Start and finish', note: 'A 220 m straight on setts, the finish line under the arch of the post office.' },
  { n: '2', name: 'Graslei hook', turn: 'Left, tight', note: 'From four riders wide to two in thirty metres, along the water. Where the elite race is lost.' },
  { n: '3', name: 'Sint-Michielsbrug', turn: 'Rise, 4 percent', note: 'Over the bridge and down the other side. The only climb, and it is done sixty times.' },
  { n: '4', name: 'The kettle', turn: 'Right, wide', note: 'A fast sweep off the bridge onto Sint-Michielsplein. The best place to make up ten places.' },
  { n: '5', name: 'Veldstraat chicane', turn: 'Left then right', note: 'Two tram lines crossed at an angle. Barriered both sides and gritted at seven.' },
  { n: '6', name: 'Kouter', turn: 'Right, long', note: 'A wide, slow arc around the square that lets the bunch breathe and the break go.' },
  { n: '7', name: 'Ketelvest', turn: 'Left, medium', note: 'Back along the water. Headwind most years. The last place a break can hide.' },
  { n: '8', name: 'Post office bend', turn: 'Right, tight', note: 'Onto the finishing straight. Sixth wheel here is a podium, twelfth is not.' },
];

type Category = {
  name: string;
  fee: string;
  laps: string;
  km: string;
  start: string;
  note: string;
};

const CATEGORIES: Category[] = [
  { name: 'Under 15', fee: 'EUR 5', laps: '20', km: '28', start: '08:30', note: 'Licence or day permit' },
  { name: 'Under 17', fee: 'EUR 8', laps: '25', km: '35', start: '09:30', note: 'Licence or day permit' },
  { name: 'Women, amateur', fee: 'EUR 15', laps: '30', km: '42', start: '10:30', note: 'Day permit at sign-on, EUR 5' },
  { name: 'Men, amateur', fee: 'EUR 15', laps: '35', km: '49', start: '11:45', note: 'Day permit at sign-on, EUR 5' },
  { name: 'Kids lap', fee: 'Free', laps: '1', km: '1.4', start: '13:30', note: 'Under 12, helmet, a parent at the fence' },
  { name: 'Women, elite', fee: 'EUR 25', laps: '40', km: '56', start: '14:15', note: 'Elite or U23 licence, 120 places' },
  { name: 'Men, elite', fee: 'EUR 25', laps: '60', km: '84', start: '16:30', note: 'Elite or U23 licence, 120 places' },
];

type Result = {
  year: string;
  men: string;
  menTeam: string;
  women: string;
  womenTeam: string;
};

const RESULTS: Result[] = [
  { year: '2025', men: 'Arne Vandeputte', menTeam: 'Leiedal Cycling', women: 'Fien Goossens', womenTeam: 'Team Schelde' },
  { year: '2024', men: 'Milan Dierckx', menTeam: 'Wielerclub Kortrijk', women: 'Lotte Vermeire', womenTeam: 'Bruges Velo' },
  { year: '2023', men: 'Arne Vandeputte', menTeam: 'Leiedal Cycling', women: 'Fien Goossens', womenTeam: 'Team Schelde' },
  { year: '2022', men: 'Robbe Claeys', menTeam: 'Gent Track Club', women: 'Noor Daems', womenTeam: 'Vlaamse Ardennen RT' },
  { year: '2021', men: 'Seppe Vanhoutte', menTeam: 'Bruges Velo', women: 'Lotte Vermeire', womenTeam: 'Bruges Velo' },
  { year: '2020', men: 'No race', menTeam: 'Edition cancelled', women: 'No race', womenTeam: 'Edition cancelled' },
  { year: '2019', men: 'Kobe Declercq', menTeam: 'Wielerclub Kortrijk', women: 'Hanne Baert', womenTeam: 'Gent Track Club' },
];

type Partner = {
  name: string;
  role: string;
};

const PARTNERS: Partner[] = [
  { name: 'Brouwerij De Sleutel', role: 'Title partner, and the beer tent' },
  { name: 'Fietsen Verhaeghe', role: 'Course partner, neutral service at corner 4' },
  { name: 'Bakkerij Ten Bos', role: 'The sign-on tent breakfast' },
  { name: 'Koffiebranderij Ruys', role: 'Coffee for the marshals, from six' },
  { name: 'Drukkerij Standaert', role: 'Numbers, posters, the programme' },
  { name: 'Hotel Ampère', role: 'Team accommodation, Friday and Saturday' },
  { name: 'Garage Lievens', role: 'The lead car and the broom wagon' },
  { name: 'Stad Gent', role: 'Roads, barriers, and permission' },
];

type Spot = {
  name: string;
  where: string;
  body: string;
};

const SPOTS: Spot[] = [
  {
    name: 'Graslei terrace',
    where: 'Corner 2',
    body: 'The tightest corner on the loop, seen from a cafe chair. Riders pass at arm\'s length every two minutes. Full by nine.',
  },
  {
    name: 'The bridge',
    where: 'Corner 3',
    body: 'Sint-Michielsbrug, both pavements. The only place you see the whole bunch stretch out, and the only place with a breeze.',
  },
  {
    name: 'Kouter stand',
    where: 'Corner 6',
    body: 'A 400-seat stand, free, first come. A screen shows the rest of the loop and a speaker tells you who is in the break.',
  },
];

const CLOSURES = [
  ['Korenmarkt, Graslei, Sint-Michielshelling', '06:00 to 19:30'],
  ['Sint-Michielsplein, Veldstraat to Kouter', '06:00 to 19:30'],
  ['Kouter, Ketelvest, Kalandeberg', '06:00 to 19:30'],
  ['Tram lines 1 and 4 through the centre', 'Diverted 06:00 to 20:00'],
  ['Residents inside the loop', 'Out before 06:00, back after 19:30, by pass'],
];

const TRAVEL = [
  ['By train', 'Gent-Sint-Pieters, then tram 1 to Korenmarkt, diverted to Zuid on race day, a ten-minute walk. Extra trains from Brussels and Antwerp from 07:00.'],
  ['By bike', 'Guarded bike parking at Sint-Baafsplein and Zuid, free, from 07:00 to 20:00. The loop itself is closed to bikes that are not racing.'],
  ['By car', 'Do not. If you must, the Zuid and Sint-Pieters car parks are outside the closures and full by ten.'],
];

const CONTACT = [
  ['Organiser', 'vzw Velo Criterium Gent'],
  ['Entries', 'entries@velocriterium.example'],
  ['Press', 'press@velocriterium.example'],
  ['Partners', 'partners@velocriterium.example'],
  ['Telephone', '+32 9 000 00 00, race week only'],
  ['Post', 'Postbus 41, 9000 Gent'],
];

export default function VeloCriteriumPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#0b1220',
        '--ink': '#f2f5ff',
        '--lime': '#c6ff3d',
        '--blue': '#2f6bff',
        '--grey': '#6c7590',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,lime,blue,grey"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500..900;1,500..900&family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Velo Criterium</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <span data-edit="bar.barDate" data-edit-max="60" className={s.barDate}>Sat 19.09.2026</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,2,4" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={pinwheel}
              palette={['transparent', BLUE, LIME, GREY]}
              fit="grid"
              cellSize={128}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.speedLines} aria-hidden="true" />
          <div className={s.heroInner}>
            <p data-edit="hero.skewTag" data-edit-max="240" data-edit-multiline className={s.skewTag}>Edition 08</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
              Sixty laps
              <br />
              <em>through the middle of Ghent.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              One day, one 1.4 km loop, seven races from the under-15s at
              half past eight to the elite men at half past four. Free to
              watch from anywhere you can stand.
            </p>
            <div className={s.heroActions}>
              <a data-edit="hero.btn" data-edit-max="28" className={s.btn} href="#categories">Enter a race</a>
              <a data-edit="hero.btnLine" data-edit-max="28" className={s.btnLine} href="#spectators">Where to watch</a>
            </div>
          </div>
          <dl className={s.big}>
            {BIG.map(([v, k], i) => (
              <div key={k}>
                <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* -------------------------------------------------------- SCHEDULE */}
        <section id="schedule" className={s.schedule} aria-labelledby="schedule-h">
          <div className={s.secHead}>
            <p data-edit="schedule.skewTag" data-edit-max="240" data-edit-multiline className={s.skewTag}>Race day</p>
            <h2 data-edit="schedule.title" data-edit-max="60" id="schedule-h">Saturday 19 September</h2>
            <p data-edit="schedule.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Times are start times and they hold. A race that finishes early
              does not bring the next one forward.
            </p>
          </div>
          <ol className={s.timeline}>
            {SCHEDULE.map((sl, i) => (
              <li key={sl.time} className={sl.race ? `${s.slot} ${s.slotRace}` : s.slot}>
                <time data-edit={`schedule.slotTime.${i}`} className={s.slotTime}>{sl.time}</time>
                <span data-edit={`schedule.slotWhat.${i}`} data-edit-max="60" className={s.slotWhat}>{sl.what}</span>
                <span data-edit={`schedule.slotDetail.${i}`} data-edit-max="60" className={s.slotDetail}>{sl.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,2,3,1" className={s.bandField}>
            <TabbiedPattern
              pattern={garret}
              palette={['transparent', LIME, BLUE, INK]}
              fit="grid"
              cellSize={96}
              redrawInterval={3900}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- COURSE */}
        <section id="course" className={s.course} aria-labelledby="course-h">
          <div className={s.courseInner}>
            <div className={s.secHead}>
              <p data-edit="course.skewTag" data-edit-max="240" data-edit-multiline className={s.skewTag}>The loop</p>
              <h2 data-edit="course.title" data-edit-max="60" id="course-h">1.4 kilometres, eight corners</h2>
              <p data-edit="course.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                Setts on the straight, tarmac on the rest, one bridge. Ridden
                anticlockwise, which puts the water on the right for the whole
                lap and the crowd on the left.
              </p>
            </div>
            <ol className={s.corners}>
              {CORNERS.map((c, i) => (
                <li key={c.n}>
                  <span data-edit={`course.cornerNo.${i}`} data-edit-max="60" className={s.cornerNo}>{c.n}</span>
                  <h3 data-edit={`course.title2.${i}`} data-edit-max="40">{c.name}</h3>
                  <p data-edit={`course.cornerTurn.${i}`} data-edit-max="240" data-edit-multiline className={s.cornerTurn}>{c.turn}</p>
                  <p data-edit={`course.cornerNote.${i}`} data-edit-max="240" data-edit-multiline className={s.cornerNote}>{c.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ CATEGORIES */}
        <section id="categories" className={s.categories} aria-labelledby="categories-h">
          <div className={s.secHead}>
            <p data-edit="categories.skewTag" data-edit-max="240" data-edit-multiline className={s.skewTag}>Entries</p>
            <h2 data-edit="categories.title" data-edit-max="60" id="categories-h">Seven races, one fee each</h2>
            <p data-edit="categories.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Entries open 1 July and close at 120 riders or at midnight on
              16 September, whichever comes first. Elite fields fill in a
              week.
            </p>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th data-edit="categories.heading" scope="col">Category</th>
                  <th data-edit="categories.heading2" scope="col">Fee</th>
                  <th data-edit="categories.heading3" scope="col">Laps</th>
                  <th data-edit="categories.heading4" scope="col">km</th>
                  <th data-edit="categories.heading5" scope="col">Start</th>
                  <th data-edit="categories.heading6" scope="col">Note</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((c, i) => (
                  <tr key={c.name}>
                    <td data-edit={`categories.tdName.${i}`} className={s.tdName}>{c.name}</td>
                    <td data-edit={`categories.tdNum.${i}`} className={s.tdNum}>{c.fee}</td>
                    <td data-edit={`categories.tdNum2.${i}`} className={s.tdNum}>{c.laps}</td>
                    <td data-edit={`categories.tdNum3.${i}`} className={s.tdNum}>{c.km}</td>
                    <td data-edit={`categories.tdNum4.${i}`} className={s.tdNum}>{c.start}</td>
                    <td data-edit={`categories.tdNote.${i}`} className={s.tdNote}>{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p data-edit="categories.tableNote" data-edit-max="240" data-edit-multiline className={s.tableNote}>
            Prizes are paid on the day, in cash, to ten places in each elite
            race and to three in the rest. A prime is EUR 50 and a bottle of
            something from the title partner.
          </p>
        </section>

        {/* --------------------------------------------------------- RESULTS */}
        <section id="results" className={s.results} aria-labelledby="results-h">
          <div className={s.secHead}>
            <p data-edit="results.skewTag" data-edit-max="240" data-edit-multiline className={s.skewTag}>Archive</p>
            <h2 data-edit="results.title" data-edit-max="60" id="results-h">Winners since 2019</h2>
          </div>
          <ol className={s.resultList}>
            {RESULTS.map((r, i) => (
              <li key={r.year}>
                <span data-edit={`results.resultYear.${i}`} data-edit-max="60" className={s.resultYear}>{r.year}</span>
                <span data-edit={`results.resultLabel.${i}`} data-edit-max="60" className={s.resultLabel}>Men</span>
                <span data-edit={`results.resultName.${i}`} data-edit-max="60" className={s.resultName}>{r.men}</span>
                <span data-edit={`results.resultTeam.${i}`} data-edit-max="60" className={s.resultTeam}>{r.menTeam}</span>
                <span data-edit={`results.resultLabel2.${i}`} data-edit-max="60" className={s.resultLabel}>Women</span>
                <span data-edit={`results.resultName2.${i}`} data-edit-max="60" className={s.resultName}>{r.women}</span>
                <span data-edit={`results.resultTeam2.${i}`} data-edit-max="60" className={s.resultTeam}>{r.womenTeam}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- PARTNERS */}
        <section id="partners" className={s.partners} aria-labelledby="partners-h">
          <div className={s.secHead}>
            <p data-edit="partners.skewTag" data-edit-max="240" data-edit-multiline className={s.skewTag}>Partners</p>
            <h2 data-edit="partners.title" data-edit-max="60" id="partners-h">Eight names, all of them from Ghent</h2>
          </div>
          <ul className={s.partnerList}>
            {PARTNERS.map((p, i) => (
              <li key={p.name}>
                <span data-edit={`partners.partnerName.${i}`} data-edit-max="60" className={s.partnerName}>{p.name}</span>
                <span data-edit={`partners.partnerRole.${i}`} data-edit-max="60" className={s.partnerRole}>{p.role}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------ SPECTATORS */}
        <section id="spectators" className={s.spectators} aria-labelledby="spectators-h">
          <div className={s.secHead}>
            <p data-edit="spectators.skewTag" data-edit-max="240" data-edit-multiline className={s.skewTag}>Watching</p>
            <h2 data-edit="spectators.title" data-edit-max="60" id="spectators-h">Where to stand</h2>
            <p data-edit="spectators.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Every metre of the loop is barriered and every metre is free.
              Three places are better than the rest.
            </p>
          </div>
          <ul className={s.spotGrid}>
            {SPOTS.map((sp, i) => (
              <li key={sp.name} className={s.spot}>
                {/* A pattern tile stands in for the photograph of the spot. */}
                <div data-edit-pattern={`spectators.field.${i}`} data-edit-roles="transparent,4,3" className={s.spotTile} aria-hidden="true">
                  <TabbiedPattern
                    pattern={bluff}
                    palette={['transparent', GREY, BLUE]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5000 + i * 500}
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
                <p data-edit={`spectators.spotWhere.${i}`} data-edit-max="240" data-edit-multiline className={s.spotWhere}>{sp.where}</p>
                <h3 data-edit={`spectators.title2.${i}`} data-edit-max="40">{sp.name}</h3>
                <p data-edit={`spectators.spotBody.${i}`} data-edit-max="240" data-edit-multiline className={s.spotBody}>{sp.body}</p>
              </li>
            ))}
          </ul>
          <div className={s.infoGrid}>
            <div className={s.infoCol}>
              <h3 data-edit="spectators.title3" data-edit-max="40">Road closures</h3>
              <dl className={s.infoList}>
                {CLOSURES.map(([k, v], i) => (
                  <div key={k}>
                    <dt data-edit={`spectators.term.${i}`} data-edit-max="28">{k}</dt>
                    <dd data-edit={`spectators.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={s.infoCol}>
              <h3 data-edit="spectators.title4" data-edit-max="40">Getting there</h3>
              <dl className={s.infoList}>
                {TRAVEL.map(([k, v], i) => (
                  <div key={k}>
                    <dt data-edit={`spectators.term2.${i}`} data-edit-max="28">{k}</dt>
                    <dd data-edit={`spectators.body2.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div className={s.contactInner}>
            <div>
              <p data-edit="contact.skewTag" data-edit-max="240" data-edit-multiline className={s.skewTag}>Contact</p>
              <h2 data-edit="contact.title" data-edit-max="60" id="contact-h">Ask before race week</h2>
              <p data-edit="contact.contactLede" data-edit-max="240" data-edit-multiline className={s.contactLede}>
                Four volunteers answer the mail between February and
                September. In race week they are on the course and the
                telephone is the way in.
              </p>
            </div>
            <dl className={s.contactList}>
              {CONTACT.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`contact.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`contact.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.speedLinesFoot} aria-hidden="true" />
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Velo Criterium</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>A city-centre criterium in Ghent, run by volunteers since 2019. Eighth edition, Saturday 19 September 2026.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>The race</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.schedule" data-edit-max="28" href="#schedule">Schedule</a></li>
              <li><a data-edit="footer.course" data-edit-max="28" href="#course">The loop</a></li>
              <li><a data-edit="footer.categories" data-edit-max="28" href="#categories">Categories</a></li>
              <li><a data-edit="footer.results" data-edit-max="28" href="#results">Winners</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Coming</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.spectators" data-edit-max="28" href="#spectators">Where to stand</a></li>
              <li><a data-edit="footer.spectators2" data-edit-max="28" href="#spectators">Road closures</a></li>
              <li><a data-edit="footer.partners" data-edit-max="28" href="#partners">Partners</a></li>
              <li><a data-edit="footer.contact" data-edit-max="28" href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Organiser</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              vzw Velo Criterium Gent
              <br />
              Postbus 41, 9000 Gent
              <br />
              entries@velocriterium.example
              <br />
              +32 9 000 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional race. Times, riders, teams, partners and closures are invented.</p>
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
