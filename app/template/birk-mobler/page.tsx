import { TabbiedPattern } from 'tabbied/react';
import { maline, ninon, tulle } from 'tabbied/patterns';
import s from './birk-mobler.module.css';

export const metadata = {
  title: 'Birk Mobler: Furniture maker, Aarhus',
  description:
    'Birk Mobler makes six pieces of furniture in oak, ash and elm, one at a time, in a workshop by the harbour in Aarhus. Prices in DKK, delivery included in the city.',
};

/* Site colours. Every field takes `transparent` in the background slot, so
   the dots sit in the paper rather than on a plate laid over it. */
const INK = '#1F1F1D';
const OAK = '#B8895A';
const GREY = '#9A9994';
const PALE = '#E6E4DF';

const NAV = [
  ['Pieces', '#pieces'],
  ['Woods', '#woods'],
  ['Making', '#making'],
  ['Showroom', '#showroom'],
  ['Care', '#care'],
  ['Contact', '#contact'],
];

type Piece = {
  name: string;
  kind: string;
  dims: string;
  woods: string;
  price: string;
  note: string;
};

const PIECES: Piece[] = [
  {
    name: 'Langbord',
    kind: 'Dining table',
    dims: '240 x 90 x 74 cm',
    woods: 'Oak or ash',
    price: '38 500 DKK',
    note: 'Also made at 200 and 280. Two solid boards, bookmatched, on a frame you can take apart with one key.',
  },
  {
    name: 'Baenk',
    kind: 'Bench',
    dims: '180 x 36 x 45 cm',
    woods: 'Oak, ash or elm',
    price: '9 800 DKK',
    note: 'Sits three at the table or two in a hallway. The seat is one board, so the grain runs the whole length.',
  },
  {
    name: 'Stol 3',
    kind: 'Chair',
    dims: '46 x 50 x 78 cm',
    woods: 'Oak or ash',
    price: '6 400 DKK',
    note: 'No arms, a slightly hollowed seat, a back you can lean on for a whole dinner. Sold singly.',
  },
  {
    name: 'Stol 7',
    kind: 'Armchair',
    dims: '58 x 54 x 76 cm',
    woods: 'Oak or elm',
    price: '8 900 DKK',
    note: 'The same chair with arms, which changes the joints more than you would think. Sold singly.',
  },
  {
    name: 'Reol',
    kind: 'Shelf',
    dims: '120 x 32 x 190 cm',
    woods: 'Ash or oak',
    price: '22 000 DKK',
    note: 'Five shelves, no back, no fixings visible. Stands on its own or bolts to the wall through two hidden brackets.',
  },
  {
    name: 'Seng',
    kind: 'Bed',
    dims: '180 x 210 x 32 cm',
    woods: 'Oak or ash',
    price: '29 500 DKK',
    note: 'For a 180 mattress; a 160 is the same price. A slatted base is included and the headboard is optional.',
  },
];

type Wood = {
  name: string;
  latin: string;
  from: string;
  note: string;
};

const WOODS: Wood[] = [
  {
    name: 'Oak',
    latin: 'Quercus robur',
    from: 'Silkeborg forests, felled in winter',
    note: 'Quarter-sawn where we can afford it, which shows the ray fleck and keeps a table top flat for decades. It darkens to honey over the first two years and then stops.',
  },
  {
    name: 'Ash',
    latin: 'Fraxinus excelsior',
    from: 'Djursland, from thinnings',
    note: 'Paler and straighter than oak, and it takes a bend without complaint, so the chair backs are ash even in an oak chair. It stays pale if you keep it out of the sun.',
  },
  {
    name: 'Elm',
    latin: 'Ulmus glabra',
    from: 'Single trunks, mostly from parks',
    note: 'There is very little of it left, so we buy trunks one at a time when a city has to take one down. The grain is wild and no two pieces match, which is the reason to want it.',
  },
];

type Step = {
  no: string;
  title: string;
  time: string;
  body: string;
};

const STEPS: Step[] = [
  {
    no: '1',
    title: 'A conversation',
    time: 'Week 1',
    body: 'You tell us the room, we ask about the doorways. We send a drawing at 1:10 and a price that does not change afterwards.',
  },
  {
    no: '2',
    title: 'The boards',
    time: 'Week 2',
    body: 'You are welcome at the timber store on a Friday to pick the boards yourself. Most people do, and most people take longer than they meant to.',
  },
  {
    no: '3',
    title: 'The making',
    time: 'Weeks 3 to 10',
    body: 'One person makes the whole piece. Joints are cut by hand, nothing is screwed through a visible face, and the piece stands in the workshop for a week before it is oiled.',
  },
  {
    no: '4',
    title: 'Oil, and a year later',
    time: 'Week 11',
    body: 'Three coats of oil, delivery, assembly in the room. Twelve months on we come back, tighten what needs it and re-oil the top for nothing.',
  },
];

const HOURS = [
  ['Thursday', '12 to 18'],
  ['Friday', '12 to 18'],
  ['Saturday', '10 to 15'],
  ['Other days', 'By appointment'],
];

const DELIVERY = [
  ['Aarhus', 'Included'],
  ['Jutland and Funen', '900 DKK'],
  ['Zealand and Copenhagen', '1 600 DKK'],
  ['Elsewhere', 'By quote, in a crate'],
];

const CARE = [
  {
    title: 'Everyday',
    body: 'A damp cloth, wrung out, and nothing else. Wipe along the grain and let it dry on its own.',
  },
  {
    title: 'Once a year',
    body: 'Re-oil with the tin we send. A thin coat, twenty minutes, then wipe everything off again. The wiping is the part people skip.',
  },
  {
    title: 'Heat and water',
    body: 'A hot pan will leave a white ring and a wet glass a dark one. Both come out with fine paper and oil, and we will show you how.',
  },
  {
    title: 'Sun',
    body: 'Oak darkens and ash yellows in direct sun. Turn a table now and then in the first year so it does so evenly.',
  },
  {
    title: 'What not to use',
    body: 'No silicone polish, no spray cleaner, no wax on an oiled surface. They seal the wood and the next coat of oil cannot get in.',
  },
];

const FACTS = [
  ['6', 'Pieces'],
  ['3', 'Woods'],
  ['1', 'Maker per piece'],
  ['2011', 'Since'],
];

export default function BirkMoblerPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#fafaf8',
        '--ink': '#1f1f1d',
        '--oak': '#b8895a',
        '--grey': '#9a9994',
        '--pale': '#e6e4df',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,oak,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..600&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Birk Mobler</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Aarhus</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            Sparse dots over most of the viewport, and one light sentence. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={ninon}
              palette={['transparent', OAK, PALE, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Furniture maker, Aarhus, since 2011</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle} id="hero-h">
              Six pieces, three woods,
              <br />
              <em>made one at a time.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              A table, a bench, two chairs, a shelf and a bed. Each is made by
              one person in a workshop by the harbour, from boards you can
              choose yourself, and delivered with the oil to look after it.
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

        {/* ---------------------------------------------------------- PIECES */}
        <section id="pieces" className={s.sec} aria-labelledby="pieces-h">
          <div className={s.secHead}>
            <span data-edit="pieces.secNo" data-edit-max="60" className={s.secNo}>01</span>
            <h2 data-edit="pieces.title" data-edit-max="60" id="pieces-h">The pieces</h2>
            <p data-edit="pieces.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Prices include Danish VAT, three coats of oil and delivery in
              Aarhus. Dimensions are width, depth and height.
            </p>
          </div>
          <ol className={s.pieces}>
            <li className={s.pieceHead} aria-hidden="true">
              <span data-edit="pieces.text" data-edit-max="60">Piece</span>
              <span data-edit="pieces.text2" data-edit-max="60">Dimensions</span>
              <span data-edit="pieces.text3" data-edit-max="60">Woods</span>
              <span data-edit="pieces.text4" data-edit-max="60">Price</span>
            </li>
            {PIECES.map((p, i) => (
              <li key={p.name} className={s.pieceRow}>
                <div className={s.pieceName}>
                  <h3 data-edit={`pieces.title2.${i}`} data-edit-max="40">{p.name}</h3>
                  <span data-edit={`pieces.text5.${i}`} data-edit-max="60">{p.kind}</span>
                </div>
                <span data-edit={`pieces.pieceDims.${i}`} data-edit-max="60" className={s.pieceDims}>{p.dims}</span>
                <span data-edit={`pieces.pieceWoods.${i}`} data-edit-max="60" className={s.pieceWoods}>{p.woods}</span>
                <span data-edit={`pieces.piecePrice.${i}`} data-edit-max="60" className={s.piecePrice}>{p.price}</span>
                <p data-edit={`pieces.pieceNote.${i}`} data-edit-max="240" data-edit-multiline className={s.pieceNote}>{p.note}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- WOODS */}
        <section id="woods" className={s.sec} aria-labelledby="woods-h">
          <div className={s.secHead}>
            <span data-edit="woods.secNo" data-edit-max="60" className={s.secNo}>02</span>
            <h2 data-edit="woods.title" data-edit-max="60" id="woods-h">Three woods</h2>
            <p data-edit="woods.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              All of it Danish, all of it dried in our own shed for at least
              two years before it is planed.
            </p>
          </div>
          <div className={s.woods}>
            {WOODS.map((w, i) => (
              <article key={w.name} className={s.wood}>
                <span className={s.woodRule} aria-hidden="true" />
                <h3 data-edit={`wood.title.${i}`} data-edit-max="40">{w.name}</h3>
                <p data-edit={`wood.woodLatin.${i}`} data-edit-max="240" data-edit-multiline className={s.woodLatin}>{w.latin}</p>
                <p data-edit={`wood.woodFrom.${i}`} data-edit-max="240" data-edit-multiline className={s.woodFrom}>{w.from}</p>
                <p data-edit={`wood.woodNote.${i}`} data-edit-max="240" data-edit-multiline className={s.woodNote}>{w.note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND
            The loudest field on the page, and it is still quiet: feathered
            dots in the oak colour, edge to edge, nothing to read. */}
        <div className={s.band} aria-hidden="true">
          <div data-edit-pattern="top.field" data-edit-roles="transparent,2,4" className={s.bandField}>
            <TabbiedPattern
              pattern={maline}
              palette={['transparent', OAK, PALE]}
              fit="grid"
              cellSize={96}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div data-edit-pattern="making.field" data-edit-roles="transparent,4,3" className={s.makingField} aria-hidden="true">
            <TabbiedPattern
              pattern={tulle}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={64}
              redrawInterval={6800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.makingInner}>
            <div className={s.secHead}>
              <span data-edit="making.secNo" data-edit-max="60" className={s.secNo}>03</span>
              <h2 data-edit="making.title" data-edit-max="60" id="making-h">How a piece is made</h2>
              <p data-edit="making.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
                Eleven weeks from the first conversation, most of the time.
                Elm takes longer because we have to find the tree.
              </p>
            </div>
            <ol className={s.steps}>
              {STEPS.map((st, i) => (
                <li key={st.no}>
                  <span data-edit={`making.stepNo.${i}`} data-edit-max="60" className={s.stepNo}>{st.no}</span>
                  <h3 data-edit={`making.title2.${i}`} data-edit-max="40">{st.title}</h3>
                  <span data-edit={`making.stepTime.${i}`} data-edit-max="60" className={s.stepTime}>{st.time}</span>
                  <p data-edit={`making.body.${i}`} data-edit-max="240" data-edit-multiline>{st.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- SHOWROOM */}
        <section id="showroom" className={s.sec} aria-labelledby="showroom-h">
          <div className={s.secHead}>
            <span data-edit="showroom.secNo" data-edit-max="60" className={s.secNo}>04</span>
            <h2 data-edit="showroom.title" data-edit-max="60" id="showroom-h">Showroom, delivery, assembly</h2>
            <p data-edit="showroom.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              The showroom is the front half of the workshop, so you will hear
              the planer. Every piece is there to sit on.
            </p>
          </div>
          <div className={s.visit}>
            <div>
              <h3 data-edit="showroom.visitHead" data-edit-max="40" className={s.visitHead}>Hours</h3>
              <dl className={s.visitList}>
                {HOURS.map(([d, h], i) => (
                  <div key={d}>
                    <dt data-edit={`showroom.term.${i}`} data-edit-max="28">{d}</dt>
                    <dd data-edit={`showroom.body.${i}`} data-edit-max="200" data-edit-multiline>{h}</dd>
                  </div>
                ))}
              </dl>
              <p data-edit="showroom.visitNote" data-edit-max="240" data-edit-multiline className={s.visitNote}>
                Sydhavnsgade 14, by the old grain silo. There is parking in the
                yard and the number 16 bus stops outside.
              </p>
            </div>
            <div>
              <h3 data-edit="showroom.visitHead2" data-edit-max="40" className={s.visitHead}>Delivery</h3>
              <dl className={s.visitList}>
                {DELIVERY.map(([where, cost], i) => (
                  <div key={where}>
                    <dt data-edit={`showroom.term2.${i}`} data-edit-max="28">{where}</dt>
                    <dd data-edit={`showroom.body2.${i}`} data-edit-max="200" data-edit-multiline>{cost}</dd>
                  </div>
                ))}
              </dl>
              <p data-edit="showroom.visitNote2" data-edit-max="240" data-edit-multiline className={s.visitNote}>
                Two of us bring it, carry it in and assemble it in the room.
                Beds and shelves are put together on the spot; tables arrive
                with the legs off and go on with one key, which you keep.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ CARE */}
        <section id="care" className={s.sec} aria-labelledby="care-h">
          <div className={s.secHead}>
            <span data-edit="care.secNo" data-edit-max="60" className={s.secNo}>05</span>
            <h2 data-edit="care.title" data-edit-max="60" id="care-h">Looking after it</h2>
            <p data-edit="care.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              An oiled surface is easy to live with and easy to mend. The whole
              of it fits on one card, which is in the drawer of every piece.
            </p>
          </div>
          <dl className={s.care}>
            {CARE.map((c, i) => (
              <div key={c.title}>
                <dt data-edit={`care.term.${i}`} data-edit-max="28">{c.title}</dt>
                <dd data-edit={`care.body.${i}`} data-edit-max="200" data-edit-multiline>{c.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.sec} aria-labelledby="contact-h">
          <div className={s.secHead}>
            <span data-edit="contact.secNo" data-edit-max="60" className={s.secNo}>06</span>
            <h2 data-edit="contact.title" data-edit-max="60" id="contact-h">Write, call, or come by</h2>
            <p data-edit="contact.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              We answer within two working days, and never from the workshop
              floor, so a call on a Friday afternoon may wait until Monday.
            </p>
          </div>
          <dl className={s.contact}>
            <div>
              <dt data-edit="contact.term" data-edit-max="28">Post</dt>
              <dd data-edit="contact.body3" data-edit-max="200" data-edit-multiline>
                Birk Mobler
                <br />
                Sydhavnsgade 14
                <br />
                8000 Aarhus C
              </dd>
            </div>
            <div>
              <dt data-edit="contact.term2" data-edit-max="28">Write</dt>
              <dd>
                <a data-edit="contact.link" data-edit-max="28" href="mailto:hej@birkmobler.example">hej@birkmobler.example</a>
              </dd>
            </div>
            <div>
              <dt data-edit="contact.term3" data-edit-max="28">Call</dt>
              <dd data-edit="contact.body" data-edit-max="200" data-edit-multiline>+45 86 00 00 00</dd>
            </div>
            <div>
              <dt data-edit="contact.term4" data-edit-max="28">Company</dt>
              <dd data-edit="contact.body2" data-edit-max="200" data-edit-multiline>Birk Mobler ApS, CVR 00 00 00 00</dd>
            </div>
          </dl>
        </section>
      </main>

      {/* A coda: the hero's dots again, smaller and quieter, then the footer. */}
      <div className={s.coda} aria-hidden="true">
        <div data-edit-pattern="page.field" data-edit-roles="transparent,4,2" className={s.codaField}>
          <TabbiedPattern
            pattern={ninon}
            palette={['transparent', PALE, OAK]}
            fit="grid"
            cellSize={72}
            redrawInterval={5800}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </div>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Birk Mobler</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              Six pieces in oak, ash and elm, made one at a time in Aarhus.
            </p>
          </div>
          <div>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Pieces</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.pieces" data-edit-max="28" href="#pieces">The six pieces</a></li>
              <li><a data-edit="footer.woods" data-edit-max="28" href="#woods">Three woods</a></li>
              <li><a data-edit="footer.making" data-edit-max="28" href="#making">How a piece is made</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Practical</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.showroom" data-edit-max="28" href="#showroom">Showroom hours</a></li>
              <li><a data-edit="footer.showroom2" data-edit-max="28" href="#showroom">Delivery and assembly</a></li>
              <li><a data-edit="footer.care" data-edit-max="28" href="#care">Care</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Here</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Sydhavnsgade 14
              <br />
              8000 Aarhus C
              <br />
              hej@birkmobler.example
              <br />
              +45 86 00 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional furniture maker. Prices, dimensions and hours are invented.</p>
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
