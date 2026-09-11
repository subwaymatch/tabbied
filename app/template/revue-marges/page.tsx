import { TabbiedPattern } from 'tabbied/react';
import { batiste, moleskin, strand } from 'tabbied/patterns';
import s from './revue-marges.module.css';

export const metadata = {
  title: 'Revue Marges: Literary quarterly, Lyon',
  description:
    'Revue Marges is a literary quarterly printed in Lyon since 2015. Essays, fiction, one translated poem and one long interview an issue. Number 47, autumn 2026, is out now.',
};

/* Cream, near-black, one oxblood. Every field takes `transparent` in the
   background slot so the paper of the page runs through the pattern, the
   way the stock shows through a letterpress tint. */
const INK = '#1E1A17';
const OXBLOOD = '#7A1F2B';
const GREY = '#8A8177';
const PALE = '#DED4C3';

const NAV = [
  ['Le numéro', '#issue'],
  ['Sommaire', '#contents'],
  ['Rubriques', '#columns'],
  ['Abonnements', '#subscribe'],
  ['Contributeurs', '#contributors'],
  ['Ours', '#masthead'],
  ['Librairies', '#stockists'],
];

const FIGURES = [
  ['47', 'issues since 2015'],
  ['4', 'a year, on the solstices and equinoxes'],
  ['192', 'pages, sewn, uncoated'],
  ['1 500', 'copies printed, none pulped'],
];

type Entry = {
  kind: string;
  title: string;
  author: string;
  page: string;
  note: string;
};

const CONTENTS: Entry[] = [
  { kind: 'Essay', title: 'The last tram to Vaise', author: 'Anne-Laure Perrin', page: '9', note: 'On a line that closed in 1957 and the people who still describe the city by it' },
  { kind: 'Essay', title: 'On not finishing Proust', author: 'Théo Vasseur', page: '27', note: 'Twenty-two years, four attempts, one honest tally' },
  { kind: 'Essay', title: 'A short history of the margin', author: 'Claire Dumortier', page: '41', note: 'Glosses, doodles, and the reader who wrote back' },
  { kind: 'Fiction', title: 'Sunday at the Halles', author: 'Mathilde Rey', page: '58', note: 'A story in eleven stalls' },
  { kind: 'Fiction', title: 'The Saône in December', author: 'Ismaël Benzaïd', page: '73', note: 'A novella, first of two parts' },
  { kind: 'Fiction', title: 'Three keys', author: 'Luc Dorval', page: '96', note: 'A locksmith, a widow, and a door nobody has opened since 1989' },
  { kind: 'Poem', title: 'Ferry', author: 'Sigrún Halldórsdóttir', page: '112', note: 'Translated from the Icelandic by Pauline Marchand, with the original en face' },
  { kind: 'Interview', title: 'Forty years at the case', author: 'Bernard Ollier', page: '121', note: 'A typesetter talks for thirty-eight pages, led by Théo Vasseur' },
];

type Column = {
  name: string;
  by: string;
  pages: string;
  body: string;
};

const COLUMNS: Column[] = [
  {
    name: 'Lisière',
    by: 'The editors',
    pages: 'pp. 3 to 7',
    body: 'The opening pages. Not an editorial, more a note on what the issue turned out to be about once it was laid out, which is never what was planned.',
  },
  {
    name: 'Marginalia',
    by: 'Claire Dumortier',
    pages: 'pp. 161 to 172',
    body: 'Reading notes on eight books, of which at most two are new. The rule is that she must have read the whole thing, which is rarer in reviewing than it should be.',
  },
  {
    name: 'Le Cahier',
    by: 'A guest each issue',
    pages: 'sixteen pages, inserted',
    body: 'A sixteen-page insert on a heavier, greyer stock, given to one writer or one artist with no brief. It is bound in at the centre and can be cut out without loss.',
  },
  {
    name: 'La Dernière Page',
    by: 'A reader',
    pages: 'p. 192',
    body: 'A letter, chosen from the post. It is printed as it arrived, spelling included, and the writer gets a year of the review for their trouble.',
  },
];

type Tier = {
  name: string;
  price: string;
  unit: string;
  body: string;
};

const TIERS: Tier[] = [
  {
    name: 'Single issue',
    price: '18',
    unit: 'euros, post paid in France',
    body: 'The current number, or any back number that is still in the cupboard. Numbers 1, 4 and 12 are not.',
  },
  {
    name: 'One year',
    price: '62',
    unit: 'euros, four issues',
    body: 'Starts with the next number unless you ask for the current one. Renewal is by letter, not by direct debit, and we will write to you before it lapses.',
  },
  {
    name: 'Two years',
    price: '112',
    unit: 'euros, eight issues',
    body: 'The rate most of our subscribers are on. Includes the two Cahiers we print separately in that time, which are otherwise sold only at the launch.',
  },
];

const TERMS = [
  ['Students and under 26', '48 euros a year, with a card or a good story'],
  ['Outside France', 'Add 14 euros a year for postage; we send by letter post, flat'],
  ['Libraries and institutions', '90 euros a year, invoiced, two copies'],
  ['Gift', 'Say so on the order and we write the card ourselves'],
];

const CONTRIBUTORS = [
  ['Anne-Laure Perrin', 'Founded the review in 2015 and still reads every submission. Lives above a bakery in the Croix-Rousse and writes about the city as if it were a person.'],
  ['Théo Vasseur', 'Editor and interviewer. Has now not finished Proust four times and is planning a fifth attempt for the winter.'],
  ['Claire Dumortier', 'Copy editor and the author of Marginalia. Reads with a pencil and returns library books annotated, to the librarian\'s dismay.'],
  ['Mathilde Rey', 'Her first collection, Stalls, appears in the spring. She works Saturdays on a cheese counter and takes notes between customers.'],
  ['Ismaël Benzaïd', 'Novelist. The Saône in December is his third piece for the review and the first to run in two parts.'],
  ['Luc Dorval', 'Was a locksmith for twenty-six years. Three keys is his first published story and was sent in by post, handwritten.'],
  ['Sigrún Halldórsdóttir', 'Poet, Reykjavík. Ferry is from a sequence about the harbour written over one winter of crossings.'],
  ['Pauline Marchand', 'Translates from Icelandic and Danish. She teaches at the university and answers letters in the language they arrive in.'],
  ['Bernard Ollier', 'Set type by hand from 1979 to 2019 in a shop on the rue Burdeau. Still keeps a case of Garamond in the kitchen.'],
];

const MASTHEAD = [
  ['Editor', 'Anne-Laure Perrin'],
  ['Deputy editor', 'Théo Vasseur'],
  ['Copy and production', 'Claire Dumortier'],
  ['Design', 'Atelier Trente-Six, Lyon'],
  ['Typefaces', 'Fraunces and Source Serif, set in-house'],
  ['Paper', 'Uncoated 90 g, cover 300 g, sewn'],
  ['Printer', 'Imprimerie des Terreaux, Villeurbanne'],
  ['Print run', '1 500 copies, numbered'],
  ['Registered', 'Lyon, 2015, association loi 1901'],
];

type Shop = {
  city: string;
  shop: string;
  street: string;
};

const STOCKISTS: Shop[] = [
  { city: 'Lyon', shop: 'Librairie Lisière', street: '12 rue des Capucins, 1er' },
  { city: 'Lyon', shop: 'La Page Blanche', street: '48 rue de Marseille, 7e' },
  { city: 'Lyon', shop: 'Le Comptoir des Livres', street: '5 rue Burdeau, 1er' },
  { city: 'Paris', shop: 'Librairie Ménilmontant', street: '71 rue de Ménilmontant, 20e' },
  { city: 'Paris', shop: 'Le Dernier Feuillet', street: '3 rue de la Butte-aux-Cailles, 13e' },
  { city: 'Marseille', shop: 'Librairie du Cours', street: '22 cours Julien' },
  { city: 'Toulouse', shop: 'Chapitre Sept', street: '17 rue du Taur' },
  { city: 'Bordeaux', shop: 'Librairie des Quais', street: '9 quai des Chartrons' },
  { city: 'Nantes', shop: 'Le Cabinet de Lecture', street: '4 rue de Verdun' },
  { city: 'Strasbourg', shop: 'L\'Encrier', street: '31 rue des Juifs' },
  { city: 'Lille', shop: 'Librairie Beaufort', street: '15 rue de la Monnaie' },
  { city: 'Rennes', shop: 'Papier Buvard', street: '8 rue Saint-Georges' },
  { city: 'Grenoble', shop: 'Le Marque-Page', street: '26 rue Lakanal' },
];

export default function RevueMargesPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f6f1e7',
        '--ink': '#1e1a17',
        '--oxblood': '#7a1f2b',
        '--grey': '#8a8177',
        '--pale': '#ded4c3',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,oxblood,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..600;1,8..60,400..600&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Revue Marges
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <span data-edit="bar.barFolio" data-edit-max="60" className={s.barFolio}>No 47 / Automne 2026</span>
      </header>

      <main id="top">
        {/* ----------------------------------------------------------- HERO
            The cover, more or less: the pattern as a printed tint behind a
            headline set at the largest optical size the face has. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={moleskin}
              palette={['transparent', PALE, GREY, OXBLOOD]}
              fit="grid"
              cellSize={128}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Revue trimestrielle de littérature / Lyon / depuis 2015</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle} id="hero-h">
              What is written
              <br />
              <em>in the margins.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              A literary quarterly of one hundred and ninety-two pages, printed
              in Lyon, sewn rather than glued. Essays, fiction, one poem in
              translation and one very long interview an issue. Number 47 is
              out now.
            </p>
            <dl className={s.figures}>
              {FIGURES.map(([v, k], i) => (
                <div key={k}>
                  <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                  <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------------- ISSUE
            The editorial, in two columns with a drop cap. The folio in the
            margin is the review's own page number for the piece. */}
        <section id="issue" className={s.section} aria-labelledby="issue-h">
          <div className={s.folio}>
            <span data-edit="issue.folioNo" data-edit-max="60" className={s.folioNo}>p. 3</span>
            <span data-edit="issue.folioLabel" data-edit-max="60" className={s.folioLabel}>Lisière</span>
          </div>
          <div className={s.body}>
            <p data-edit="issue.smallCaps" data-edit-max="240" data-edit-multiline className={s.smallCaps}>Numéro 47, automne 2026</p>
            <h2 data-edit="issue.h2" data-edit-max="60" className={s.h2} id="issue-h">Edges</h2>
            <div className={s.twoCol}>
              <p data-edit="issue.lead" data-edit-max="240" data-edit-multiline className={s.lead}>
                Every issue starts as a list of things we would like to print
                and ends as a description of what the pieces had in common,
                found afterwards. This time the word was edges: a tram line
                that stopped being drawn on the map, the outer reaches of a
                novel that nobody in this office has finished, a harbour poem
                written from the deck, and a locksmith who spent a career at
                the point where one side of a door meets the other.
              </p>
              <p data-edit="issue.body" data-edit-max="240" data-edit-multiline>
                We did not commission any of it to a theme. We never do. The
                theme arrives when the proofs are on the floor in order and
                somebody notices, and it goes on the cover only if it survives
                a week of being argued with. Edges did. So did the interview,
                which is the longest we have run, and which we cut by a third
                and then put half of that back.
              </p>
              <p data-edit="issue.body2" data-edit-max="240" data-edit-multiline>
                Le Cahier is given this time to the photographer Odile Ferrand,
                who spent the winter on the towpath between the two rivers and
                came back with sixteen pages and no captions. We have added
                none.
              </p>
              <p data-edit="issue.body3" data-edit-max="240" data-edit-multiline>
                The last page is a letter from a reader in Grenoble who
                disagrees with an essay we printed in number 44, at some length
                and in very good handwriting. She is right about two of her
                three points and she now has a subscription.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- CONTENTS */}
        <section id="contents" className={s.section} aria-labelledby="contents-h">
          <div className={s.folio}>
            <span data-edit="contents.folioNo" data-edit-max="60" className={s.folioNo}>p. 8</span>
            <span data-edit="contents.folioLabel" data-edit-max="60" className={s.folioLabel}>Sommaire</span>
          </div>
          <div className={s.body}>
            <p data-edit="contents.smallCaps" data-edit-max="240" data-edit-multiline className={s.smallCaps}>Table of contents</p>
            <h2 data-edit="contents.h2" data-edit-max="60" className={s.h2} id="contents-h">In this number</h2>
            <ol className={s.toc}>
              {CONTENTS.map((e, i) => (
                <li key={e.title}>
                  <span data-edit={`contents.tocKind.${i}`} data-edit-max="60" className={s.tocKind}>{e.kind}</span>
                  <span className={s.tocMain}>
                    <span data-edit={`contents.tocTitle.${i}`} data-edit-max="60" className={s.tocTitle}>{e.title}</span>
                    <span data-edit={`contents.tocAuthor.${i}`} data-edit-max="60" className={s.tocAuthor}>{e.author}</span>
                    <span data-edit={`contents.tocNote.${i}`} data-edit-max="60" className={s.tocNote}>{e.note}</span>
                  </span>
                  <span data-edit={`contents.tocPage.${i}`} data-edit-max="60" className={s.tocPage}>{e.page}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- COLUMNS
            The quiet field: batiste far back under a paper wash, so the
            column names read as if printed on a tinted stock. */}
        <section id="columns" className={s.columns} aria-labelledby="columns-h">
          <div data-edit-pattern="columns.field" data-edit-roles="transparent,4,3" className={s.columnsField} aria-hidden="true">
            <TabbiedPattern
              pattern={batiste}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={96}
              redrawInterval={6600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.columnsInner}>
            <div className={s.folio}>
              <span data-edit="columns.folioNo" data-edit-max="60" className={s.folioNo}>p. 161</span>
              <span data-edit="columns.folioLabel" data-edit-max="60" className={s.folioLabel}>Rubriques</span>
            </div>
            <div className={s.body}>
              <p data-edit="columns.smallCaps" data-edit-max="240" data-edit-multiline className={s.smallCaps}>The recurring columns</p>
              <h2 data-edit="columns.h2" data-edit-max="60" className={s.h2} id="columns-h">Four things that are always there</h2>
              <ul className={s.columnList}>
                {COLUMNS.map((c, i) => (
                  <li key={c.name}>
                    <h3 data-edit={`columns.title.${i}`} data-edit-max="40">{c.name}</h3>
                    <p data-edit={`columns.columnBy.${i}`} data-edit-max="240" data-edit-multiline className={s.columnBy}>{c.by}</p>
                    <p data-edit={`columns.columnPages.${i}`} data-edit-max="240" data-edit-multiline className={s.columnPages}>{c.pages}</p>
                    <p data-edit={`columns.columnBody.${i}`} data-edit-max="240" data-edit-multiline className={s.columnBody}>{c.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- BAND
            The loudest field: strand, full width, no copy. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,2,1,4" className={s.bandField}>
            <TabbiedPattern
              pattern={strand}
              palette={['transparent', OXBLOOD, INK, PALE]}
              fit="grid"
              cellSize={120}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------ SUBSCRIBE */}
        <section id="subscribe" className={s.section} aria-labelledby="subscribe-h">
          <div className={s.folio}>
            <span data-edit="subscribe.folioNo" data-edit-max="60" className={s.folioNo}>p. 190</span>
            <span data-edit="subscribe.folioLabel" data-edit-max="60" className={s.folioLabel}>Abonnements</span>
          </div>
          <div className={s.body}>
            <p data-edit="subscribe.smallCaps" data-edit-max="240" data-edit-multiline className={s.smallCaps}>Subscriptions</p>
            <h2 data-edit="subscribe.h2" data-edit-max="60" className={s.h2} id="subscribe-h">Three ways to take the review</h2>
            <ul className={s.tiers}>
              {TIERS.map((t, i) => (
                <li key={t.name}>
                  <h3 data-edit={`subscribe.title.${i}`} data-edit-max="40">{t.name}</h3>
                  <p data-edit={`subscribe.tierPrice.${i}`} data-edit-max="240" data-edit-multiline className={s.tierPrice}>{t.price}</p>
                  <p data-edit={`subscribe.tierUnit.${i}`} data-edit-max="240" data-edit-multiline className={s.tierUnit}>{t.unit}</p>
                  <p data-edit={`subscribe.tierBody.${i}`} data-edit-max="240" data-edit-multiline className={s.tierBody}>{t.body}</p>
                </li>
              ))}
            </ul>
            <dl className={s.terms}>
              {TERMS.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`subscribe.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`subscribe.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
            <p data-edit="subscribe.subscribeNote" data-edit-max="240" data-edit-multiline className={s.subscribeNote}>
              Orders by letter to the address below, with a cheque, or by
              transfer once we have written back with the details. We do not
              take cards and we are not sorry.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------- CONTRIBUTORS */}
        <section id="contributors" className={s.section} aria-labelledby="contributors-h">
          <div className={s.folio}>
            <span data-edit="contributors.folioNo" data-edit-max="60" className={s.folioNo}>p. 188</span>
            <span data-edit="contributors.folioLabel" data-edit-max="60" className={s.folioLabel}>Contributeurs</span>
          </div>
          <div className={s.body}>
            <p data-edit="contributors.smallCaps" data-edit-max="240" data-edit-multiline className={s.smallCaps}>Who wrote number 47</p>
            <h2 data-edit="contributors.h2" data-edit-max="60" className={s.h2} id="contributors-h">Nine contributors</h2>
            <dl className={s.people}>
              {CONTRIBUTORS.map(([name, bio], i) => (
                <div key={name}>
                  <dt data-edit={`contributors.term.${i}`} data-edit-max="28">{name}</dt>
                  <dd data-edit={`contributors.body.${i}`} data-edit-max="200" data-edit-multiline>{bio}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* -------------------------------------------------------- MASTHEAD */}
        <section id="masthead" className={s.section} aria-labelledby="masthead-h">
          <div className={s.folio}>
            <span data-edit="masthead.folioNo" data-edit-max="60" className={s.folioNo}>p. 2</span>
            <span data-edit="masthead.folioLabel" data-edit-max="60" className={s.folioLabel}>Ours</span>
          </div>
          <div className={s.body}>
            <p data-edit="masthead.smallCaps" data-edit-max="240" data-edit-multiline className={s.smallCaps}>The masthead</p>
            <h2 data-edit="masthead.h2" data-edit-max="60" className={s.h2} id="masthead-h">Who makes it</h2>
            <dl className={s.masthead}>
              {MASTHEAD.map(([role, name], i) => (
                <div key={role}>
                  <dt data-edit={`masthead.term.${i}`} data-edit-max="28">{role}</dt>
                  <dd data-edit={`masthead.body.${i}`} data-edit-max="200" data-edit-multiline>{name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------------- STOCKISTS */}
        <section id="stockists" className={s.section} aria-labelledby="stockists-h">
          <div className={s.folio}>
            <span data-edit="stockists.folioNo" data-edit-max="60" className={s.folioNo}>p. 191</span>
            <span data-edit="stockists.folioLabel" data-edit-max="60" className={s.folioLabel}>Librairies</span>
          </div>
          <div className={s.body}>
            <p data-edit="stockists.smallCaps" data-edit-max="240" data-edit-multiline className={s.smallCaps}>Where to buy</p>
            <h2 data-edit="stockists.h2" data-edit-max="60" className={s.h2} id="stockists-h">Thirteen bookshops</h2>
            <p data-edit="stockists.stockNote" data-edit-max="240" data-edit-multiline className={s.stockNote}>
              Independent shops that take six copies or more and have never
              sent one back. If yours is not here, ask them; we send a sample
              to any bookshop that writes.
            </p>
            <ul className={s.shops}>
              {STOCKISTS.map((x, i) => (
                <li key={x.shop}>
                  <span data-edit={`stockists.shopCity.${i}`} data-edit-max="60" className={s.shopCity}>{x.city}</span>
                  <span data-edit={`stockists.shopName.${i}`} data-edit-max="60" className={s.shopName}>{x.shop}</span>
                  <span data-edit={`stockists.shopStreet.${i}`} data-edit-max="60" className={s.shopStreet}>{x.street}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* A coda: the cover tint again, at working size, nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
          <TabbiedPattern
            pattern={moleskin}
            palette={['transparent', PALE, GREY]}
            fit="grid"
            cellSize={104}
            redrawInterval={5000}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Revue Marges</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              A literary quarterly printed in Lyon since 2015. Four numbers a
              year, on the solstices and the equinoxes.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>The review</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.issue" data-edit-max="28" href="#issue">Number 47</a>
              </li>
              <li>
                <a data-edit="footer.contents" data-edit-max="28" href="#contents">Sommaire</a>
              </li>
              <li>
                <a data-edit="footer.columns" data-edit-max="28" href="#columns">Rubriques</a>
              </li>
              <li>
                <a data-edit="footer.contributors" data-edit-max="28" href="#contributors">Contributors</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Practical</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.subscribe" data-edit-max="28" href="#subscribe">Subscribe</a>
              </li>
              <li>
                <a data-edit="footer.stockists" data-edit-max="28" href="#stockists">Bookshops</a>
              </li>
              <li>
                <a data-edit="footer.masthead" data-edit-max="28" href="#masthead">Masthead</a>
              </li>
              <li>
                <a data-edit="footer.link" data-edit-max="28" href="mailto:courrier@revuemarges.example">Submissions</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Write to us</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Revue Marges
              <br />
              8 rue Burdeau
              <br />
              69001 Lyon
              <br />
              courrier@revuemarges.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional literary review. Names, prices and page numbers are invented.</p>
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
