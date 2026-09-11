import { TabbiedPattern } from 'tabbied/react';
import { coil, cornerbite, radius } from 'tabbied/patterns';
import s from './atelier-vane.module.css';

export const metadata = {
  title: 'Atelier Vane: Fashion label, Antwerp',
  description:
    'Atelier Vane is a fashion label in Antwerp. One collection a season, twelve looks, cut and sewn in a room on Kloosterstraat by six people.',
};

/* Ink and two greys, nothing else. Every field draws on a transparent ground
   so the white of the page runs straight through it. */
const INK = '#000000';
const GREY = '#8C8C8C';
const PALE = '#E4E4E4';

const NAV = [
  ['Collection', '#collection'],
  ['Materials', '#materials'],
  ['Stockists', '#stockists'],
  ['Shows', '#shows'],
  ['Atelier', '#atelier'],
  ['Press', '#press'],
];

const INDEX = [
  ['AW 26', 'Season'],
  ['12', 'Looks'],
  ['6', 'Mills'],
  ['1', 'Room'],
];

type Look = {
  no: string;
  name: string;
  fabric: string;
  note: string;
};

const LOOKS: Look[] = [
  { no: '01', name: 'Long coat', fabric: 'Double-faced wool, charcoal', note: 'Unlined, the seams bound by hand, a single button at the throat.' },
  { no: '02', name: 'Cape', fabric: 'Boiled wool, black', note: 'Cut from one piece with no shoulder seam. It closes with weight.' },
  { no: '03', name: 'Shirt', fabric: 'Cotton poplin, white', note: 'A collar that stands without a stiffener, because the cloth was chosen for it.' },
  { no: '04', name: 'Trouser', fabric: 'Wool flannel, mid grey', note: 'Wide leg, single pleat, a hem left three centimetres long to be finished at the shop.' },
  { no: '05', name: 'Knit', fabric: 'Lambswool, undyed', note: 'Two ply, plain, with a neck that is the same on both sides.' },
  { no: '06', name: 'Dress', fabric: 'Silk crepe, black', note: 'Bias cut, no fastening, a hem that touches the floor at 172 centimetres.' },
  { no: '07', name: 'Jacket', fabric: 'Wool serge, black', note: 'Three buttons, the middle one worn. The pockets are jetted and sewn shut.' },
  { no: '08', name: 'Skirt', fabric: 'Wool flannel, charcoal', note: 'Straight, to the shin, a slit at the back seam and a hook rather than a zip.' },
  { no: '09', name: 'Overshirt', fabric: 'Moleskin, off black', note: 'A shirt cut like a jacket and worn like neither. Two chest pockets.' },
  { no: '10', name: 'Trench', fabric: 'Cotton gabardine, stone', note: 'No epaulettes, no gun flap, no belt loops. A belt that ties.' },
  { no: '11', name: 'Waistcoat', fabric: 'Wool serge, black', note: 'Longer than a waistcoat is meant to be, with a back in the same cloth as the front.' },
  { no: '12', name: 'Evening coat', fabric: 'Silk and wool, black', note: 'The last look, and the only one with a lining. Shown once, made to order after.' },
];

type Material = {
  cloth: string;
  mill: string;
  place: string;
  used: string;
};

const MATERIALS: Material[] = [
  { cloth: 'Double-faced wool', mill: 'Lanificio Serra', place: 'Biella, Italy', used: 'Looks 01, 02' },
  { cloth: 'Wool flannel and serge', mill: 'Tessuti Cardone', place: 'Prato, Italy', used: 'Looks 04, 07, 08, 11' },
  { cloth: 'Cotton poplin', mill: 'Spinnerij Van Aken', place: 'Kortrijk, Belgium', used: 'Look 03' },
  { cloth: 'Cotton gabardine and moleskin', mill: 'Filature du Nord', place: 'Roubaix, France', used: 'Looks 09, 10' },
  { cloth: 'Lambswool yarn', mill: 'Harrow Mill', place: 'Selkirk, Scotland', used: 'Look 05' },
  { cloth: 'Silk crepe and silk-wool', mill: 'Seidenweberei Kessler', place: 'Krefeld, Germany', used: 'Looks 06, 12' },
];

type Stockist = {
  city: string;
  shop: string;
  street: string;
};

const STOCKISTS: Stockist[] = [
  { city: 'Antwerpen', shop: 'Vane', street: 'Kloosterstraat 41' },
  { city: 'Bruxelles', shop: 'Saint-Boniface', street: 'Rue Saint-Boniface 18' },
  { city: 'Paris', shop: 'Maison Orme', street: '7 rue de Turenne' },
  { city: 'London', shop: 'Halden and Co.', street: '22 Lamb\'s Conduit Street' },
  { city: 'København', shop: 'Studio Hval', street: 'Store Strandstraede 9' },
  { city: 'Milano', shop: 'Corso Nove', street: 'Via Solferino 9' },
  { city: 'Tokyo', shop: 'Kagi', street: 'Aoyama 5-4-41' },
  { city: 'Seoul', shop: 'Bom', street: 'Hannam-dong 738' },
  { city: 'New York', shop: 'Ninth Room', street: '114 Crosby Street' },
  { city: 'Berlin', shop: 'Haus Lindow', street: 'Potsdamer Strasse 81' },
];

type Show = {
  date: string;
  city: string;
  what: string;
  where: string;
  time: string;
};

const SHOWS: Show[] = [
  { date: '02 Oct 2026', city: 'Paris', what: 'Runway, AW 26', where: 'Salle Cordier, 11e', time: '19:30' },
  { date: '09 Oct 2026', city: 'Antwerpen', what: 'Presentation, twelve looks on stands', where: 'The atelier, Kloosterstraat 41', time: '18:00 to 21:00' },
  { date: '21 Nov 2026', city: 'Tokyo', what: 'Presentation with Kagi', where: 'Kagi, Aoyama', time: '17:00' },
  { date: '13 Jan 2027', city: 'Paris', what: 'Showroom, SS 27, by appointment', where: '7 rue de Turenne, 2nd floor', time: '10:00 to 18:00' },
  { date: '05 Mar 2027', city: 'Paris', what: 'Runway, SS 27', where: 'To be announced', time: '19:30' },
];

type Person = {
  name: string;
  role: string;
  since: string;
};

const PEOPLE: Person[] = [
  { name: 'Ilse Vane', role: 'Design', since: '2016' },
  { name: 'Joris Maes', role: 'Pattern cutting', since: '2016' },
  { name: 'Lena Dierckx', role: 'First hand, tailoring', since: '2018' },
  { name: 'Samuel Okoro', role: 'Knit', since: '2020' },
  { name: 'Marthe Peeters', role: 'Production and the mills', since: '2019' },
  { name: 'Kobe Van Damme', role: 'Studio, stockists, press', since: '2022' },
];

const PRESS = [
  ['Press', 'press@ateliervane.example'],
  ['Samples', 'Available from 12 October, by courier, for seven days'],
  ['Images', 'Runway and look-book, on request, credited to the atelier'],
  ['Wholesale', 'marthe@ateliervane.example'],
  ['Telephone', '+32 3 000 00 00, Tuesday to Friday, 10:00 to 17:00'],
];

export default function AtelierVanePage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#ffffff',
        '--ink': '#000000',
        '--grey': '#8c8c8c',
        '--pale': '#e4e4e4',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Inter+Tight:wght@300..600&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Atelier Vane</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Antwerpen</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            A vertical season label on the left edge, the title flush right,
            and the pattern behind all of it at nearly full strength. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,3,2,1" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={cornerbite}
              palette={['transparent', PALE, GREY, INK]}
              fit="grid"
              cellSize={104}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.vertical" data-edit-max="240" data-edit-multiline className={s.vertical}>Autumn Winter 26</p>
          <div className={s.heroText}>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
              Twelve looks,
              <br />
              <em>one cloth at a time.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Cut and sewn in one room in Antwerp by six people. Shown in
              Paris in October. Sold in ten shops and nowhere online.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------- INDEX */}
        <section className={s.index} aria-labelledby="index-h">
          <h2 data-edit="index.srOnly" data-edit-max="60" id="index-h" className={s.srOnly}>The season in numbers</h2>
          <dl className={s.indexList}>
            {INDEX.map(([v, k], i) => (
              <div key={k}>
                <dt data-edit={`index.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`index.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ------------------------------------------------------ COLLECTION */}
        <section id="collection" className={s.collection} aria-labelledby="collection-h">
          <div className={s.secHead}>
            <p data-edit="collection.micro" data-edit-max="240" data-edit-multiline className={s.micro}>01 / Collection</p>
            <h2 data-edit="collection.title" data-edit-max="60" id="collection-h">Autumn Winter 26</h2>
            <p data-edit="collection.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Twelve looks in the order they walked. Each is one cloth from
              one mill, and each fits the person who wore it, which is why
              the hems are finished in the shop.
            </p>
          </div>
          <ol className={s.looks}>
            {LOOKS.map((l, i) => (
              <li key={l.no}>
                <span data-edit={`collection.lookNo.${i}`} data-edit-max="60" className={s.lookNo}>{l.no}</span>
                <h3 data-edit={`collection.lookName.${i}`} data-edit-max="40" className={s.lookName}>{l.name}</h3>
                <span data-edit={`collection.lookFabric.${i}`} data-edit-max="60" className={s.lookFabric}>{l.fabric}</span>
                <p data-edit={`collection.lookNote.${i}`} data-edit-max="240" data-edit-multiline className={s.lookNote}>{l.note}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- MATERIALS */}
        <section id="materials" className={s.materials} aria-labelledby="materials-h">
          <div className={s.secHeadRight}>
            <p data-edit="materials.micro" data-edit-max="240" data-edit-multiline className={s.micro}>02 / Materials</p>
            <h2 data-edit="materials.title" data-edit-max="60" id="materials-h">Six mills</h2>
            <p data-edit="materials.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              The cloth is bought before the collection is drawn, in the
              lengths the mill has, and the looks are cut to what arrived.
              Nothing is dyed to match.
            </p>
          </div>
          <dl className={s.mills}>
            {MATERIALS.map((m, i) => (
              <div key={m.cloth}>
                <dt data-edit={`materials.term.${i}`} data-edit-max="28">{m.cloth}</dt>
                <dd data-edit={`materials.millName.${i}`} data-edit-max="200" data-edit-multiline className={s.millName}>{m.mill}</dd>
                <dd data-edit={`materials.millPlace.${i}`} data-edit-max="200" data-edit-multiline className={s.millPlace}>{m.place}</dd>
                <dd data-edit={`materials.millUsed.${i}`} data-edit-max="200" data-edit-multiline className={s.millUsed}>{m.used}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ------------------------------------------------------- STOCKISTS
            The quiet field: the pattern at low strength under a wash of the
            paper colour, so the list reads over it. */}
        <section id="stockists" className={s.stockists} aria-labelledby="stockists-h">
          <div data-edit-pattern="stockists.field" data-edit-roles="transparent,3,2" className={s.stockField} aria-hidden="true">
            <TabbiedPattern
              pattern={radius}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={128}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.stockInner}>
            <div className={s.secHead}>
              <p data-edit="stockists.micro" data-edit-max="240" data-edit-multiline className={s.micro}>03 / Stockists</p>
              <h2 data-edit="stockists.title" data-edit-max="60" id="stockists-h">Ten shops</h2>
              <p data-edit="stockists.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
                Each shop takes the whole collection or none of it, and each
                is visited once a season by someone from the room.
              </p>
            </div>
            <ul className={s.stockList}>
              {STOCKISTS.map((st, i) => (
                <li key={st.city}>
                  <span data-edit={`stockists.stockCity.${i}`} data-edit-max="60" className={s.stockCity}>{st.city}</span>
                  <span data-edit={`stockists.stockShop.${i}`} data-edit-max="60" className={s.stockShop}>{st.shop}</span>
                  <span data-edit={`stockists.stockStreet.${i}`} data-edit-max="60" className={s.stockStreet}>{st.street}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------------- SHOWS */}
        <section id="shows" className={s.shows} aria-labelledby="shows-h">
          <div className={s.secHeadRight}>
            <p data-edit="shows.micro" data-edit-max="240" data-edit-multiline className={s.micro}>04 / Shows</p>
            <h2 data-edit="shows.title" data-edit-max="60" id="shows-h">Dates</h2>
          </div>
          <ol className={s.showList}>
            {SHOWS.map((sh, i) => (
              <li key={sh.date}>
                <span data-edit={`shows.showDate.${i}`} data-edit-max="60" className={s.showDate}>{sh.date}</span>
                <span data-edit={`shows.showCity.${i}`} data-edit-max="60" className={s.showCity}>{sh.city}</span>
                <span data-edit={`shows.showWhat.${i}`} data-edit-max="60" className={s.showWhat}>{sh.what}</span>
                <span data-edit={`shows.showWhere.${i}`} data-edit-max="60" className={s.showWhere}>{sh.where}</span>
                <span data-edit={`shows.showTime.${i}`} data-edit-max="60" className={s.showTime}>{sh.time}</span>
              </li>
            ))}
          </ol>
          <p data-edit="shows.showNote" data-edit-max="240" data-edit-multiline className={s.showNote}>
            Invitations are posted, not emailed, and there is no standing. A
            seat that is not taken by 19:25 is given to whoever is outside.
          </p>
        </section>

        {/* --------------------------------------------------------- ATELIER */}
        <section id="atelier" className={s.atelier} aria-labelledby="atelier-h">
          <div className={s.atelierText}>
            <p data-edit="atelier.micro" data-edit-max="240" data-edit-multiline className={s.micro}>05 / Atelier</p>
            <h2 data-edit="atelier.title" data-edit-max="60" id="atelier-h">
              One room,
              <br />
              six people.
            </h2>
            <p data-edit="atelier.atelierLede" data-edit-max="240" data-edit-multiline className={s.atelierLede}>
              A former printing works on Kloosterstraat, with the north light
              a printer needed and a cutting table that was here when we
              came. Everything in the collection is made at that table.
            </p>
            <p data-edit="atelier.atelierBody" data-edit-max="240" data-edit-multiline className={s.atelierBody}>
              There are no interns and no seasons of unpaid work. Two of the
              six trained here, and the others came from tailoring houses in
              Brussels, Paris and Lagos. The atelier is open on the second
              Saturday of each month, from eleven, to anyone who rings the
              bell.
            </p>
          </div>
          <ul className={s.people}>
            {PEOPLE.map((p, i) => (
              <li key={p.name}>
                <span data-edit={`atelier.personName.${i}`} data-edit-max="60" className={s.personName}>{p.name}</span>
                <span data-edit={`atelier.personRole.${i}`} data-edit-max="60" className={s.personRole}>{p.role}</span>
                <span data-edit={`atelier.personSince.${i}`} data-edit-max="60" className={s.personSince}>{p.since}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------------------------------------- PRESS */}
        <section id="press" className={s.press} aria-labelledby="press-h">
          <div className={s.secHeadRight}>
            <p data-edit="press.micro" data-edit-max="240" data-edit-multiline className={s.micro}>06 / Press</p>
            <h2 data-edit="press.title" data-edit-max="60" id="press-h">Contact</h2>
          </div>
          <dl className={s.pressList}>
            {PRESS.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`press.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`press.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
          <p data-edit="press.pressAddr" data-edit-max="240" data-edit-multiline className={s.pressAddr}>
            Atelier Vane, Kloosterstraat 41, 2000 Antwerpen, Belgium.
          </p>
        </section>
      </main>

      {/* A coda: the pattern at working size, nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,1,2,3" className={s.codaField}>
          <TabbiedPattern
            pattern={coil}
            palette={['transparent', INK, GREY, PALE]}
            fit="grid"
            cellSize={144}
            redrawInterval={5200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Atelier Vane</p>
          <ul className={s.footLinks}>
            {NAV.map(([label, href], i) => (
              <li key={href}>
                <a data-edit={`footer.link.${i}`} data-edit-max="28" href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
            Kloosterstraat 41
            <br />
            2000 Antwerpen
            <br />
            press@ateliervane.example
          </p>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional fashion label. The looks, mills, shops and people are invented.</p>
          <p>
            Patterns by{' '}
            <a data-edit="footer.link2" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground and redrawn on a timer.
          </p>
        </div>
      </footer>
    </div>
  );
}
