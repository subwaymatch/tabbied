import { TabbiedPattern } from 'tabbied/react';
import { gloaming, scumble } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './maison-ambre.module.css';

export const metadata = {
  title: 'Maison Ambre · Parfums composés à Grasse',
  description:
    'Maison Ambre composes perfumes in small numbered editions: three eaux, one nose, and an atelier above the old lavender exchange. Founded 1987.',
};

const NOIR = '#141210';
const GOLD = '#C9A227';
const CHAMPAGNE = '#E8D9B0';
const BRONZE = '#8C6A2F';
const IVORY = '#FBF6EA';
const TAUPE = '#5A4632';

const EAUX = [
  {
    numeral: 'I',
    name: 'Ambre Premier',
    form: 'Eau de parfum · 100 ml',
    price: '€210',
    slug: 'ambre-bottle-1-cutout',
    alt: 'Tall amber glass flacon with a brushed gold cap',
    line: 'The house signature. Amber warmed slowly, the way a room holds the last hour of sun.',
    notes: {
      tete: 'Bergamot, pink pepper',
      coeur: 'Labdanum, rose de mai',
      fond: 'Amber accord, vanilla, cedar',
    },
    seed: 'ma-eau-1',
    palette: [NOIR, GOLD, TAUPE, CHAMPAGNE],
  },
  {
    numeral: 'II',
    name: 'Fumée Noire',
    form: 'Eau de parfum · 75 ml',
    price: '€185',
    slug: 'ambre-bottle-2-cutout',
    alt: 'Round smoked-glass flacon with a black lacquer stopper',
    line: 'Smoke without fire. Black tea poured in a cold chapel; leather gloves left on the pew.',
    notes: {
      tete: 'Black tea, cade wood',
      coeur: 'Iris root, suede accord',
      fond: 'Birch tar, tonka bean',
    },
    seed: 'ma-eau-2',
    palette: [NOIR, TAUPE, BRONZE, CHAMPAGNE],
  },
  {
    numeral: 'III',
    name: 'Voyage d\'Or',
    form: 'Parfum de voyage · 3 × 10 ml',
    price: '€95',
    slug: 'ambre-bottle-3-cutout',
    alt: 'Slender gold travel atomiser, cap removed',
    line: 'The bright one. Citrus at altitude, honeyed blossom below, made to be refilled, never finished.',
    notes: {
      tete: 'Yuzu, néroli',
      coeur: 'Orange blossom, acacia honey',
      fond: 'Blond woods, white musk',
    },
    seed: 'ma-eau-3',
    palette: [NOIR, GOLD, BRONZE, IVORY],
  },
];

const INGREDIENTS = [
  ['Labdanum', 'Crete · resin, sun-split'],
  ['Vanilla', 'Madagascar · pod, cured 9 months'],
  ['Iris', 'Tuscany · rhizome, aged 3 years'],
  ['Rose de mai', 'Grasse · picked before seven'],
  ['Cedar', 'Atlas · heartwood only'],
  ['Yuzu', 'Shikoku · cold-pressed peel'],
];

const ATELIER_STEPS = [
  {
    numeral: 'I',
    title: 'Composition',
    body: 'Hélène works at the organ each morning between eight and eleven, when her nose is honest. A formula may hold forty materials; most are dismissed by the tenth day.',
  },
  {
    numeral: 'II',
    title: 'Macération',
    body: 'The concentrate rests in alcohol for forty days in the dark, at cellar temperature. Nothing is hurried; the materials must agree with each other before we bottle them.',
  },
  {
    numeral: 'III',
    title: 'Glaçage',
    body: 'Chilled, filtered once through paper, never twice. A perfume over-polished loses its shadow, so we keep a little of the dusk in every flacon.',
  },
  {
    numeral: 'IV',
    title: 'Numérotation',
    body: 'Each edition is bottled by hand and numbered in pencil: batch, day, flacon. Edition sizes are small enough that we remember the weather when we made them.',
  },
];

const STOCKISTS = [
  {
    city: 'Grasse',
    lines: ['Maison Ambre · Atelier', '7 rue du Miel Doré', 'Tue - Sat · 10h - 18h'],
    note: 'Private visits by appointment',
  },
  {
    city: 'Paris',
    lines: ['Comptoir de la Brume', '14 passage des Orfèvres', 'Mon - Sat · 11h - 19h'],
    note: 'Full collection & engraving',
  },
  {
    city: 'Kyoto',
    lines: ['Salon Hakuro', '2-9 Kagerō-dōri, Higashiyama', 'Thu - Mon · 12h - 18h'],
    note: 'Eaux I and II only',
  },
];

export default function MaisonAmbrePage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--noir': '#141210',
        '--noir-2': '#1c1916',
        '--gold': '#c9a227',
        '--champagne': '#e8d9b0',
        '--bronze': '#8c6a2f',
        '--ivory': '#fbf6ea',
        '--taupe': '#5a4632',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="noir,noir-2,gold,champagne,bronze,ivory,taupe"
      className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Jost:wght@200..500&display=swap"
      />

      <header className={styles.masthead}>
        <p data-edit="masthead.mastheadOrigin" data-edit-max="240" data-edit-multiline className={styles.mastheadOrigin}>Grasse · Paris · Kyoto</p>
        <p className={styles.wordmark}>
          <span className={styles.wordmarkRule} aria-hidden="true" />
          Maison&nbsp;Ambre
          <span className={styles.wordmarkRule} aria-hidden="true" />
        </p>
        <nav aria-label="Sections" className={styles.mastheadNav}>
          <a data-edit="masthead.maison" data-edit-max="28" href="#maison">La Maison</a>
          <a data-edit="masthead.eaux" data-edit-max="28" href="#eaux">Les Eaux</a>
          <a data-edit="masthead.nez" data-edit-max="28" href="#nez">Le Nez</a>
          <a data-edit="masthead.atelier" data-edit-max="28" href="#atelier">L'Atelier</a>
          <a data-edit="masthead.visites" data-edit-max="28" href="#visites">Visites</a>
        </nav>
      </header>

      <main>
        {/* ------------------------------------------------------------ hero */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroImage}>
            <Figure editId="photo.ambre-hero"
              slug="ambre-hero"
              alt="An amber perfume bottle on dark marble, a thread of smoke rising behind it"
              priority
            />
          </div>
          <div data-edit-pattern="hero.field" data-edit-roles="0,4,2,6" className={styles.heroMist} aria-hidden="true">
            <TabbiedPattern
              pattern={scumble}
              palette={[NOIR, BRONZE, GOLD, TAUPE]}
              seed="ma-hero-mist-06"
              fit="grid"
              cellSize={30}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.heroVeil} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p data-edit="hero.heroOverline" data-edit-max="240" data-edit-multiline className={styles.heroOverline}>Parfums composés à Grasse · depuis MCMLXXXVII</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              Light, held
              <br />
              <em>in shadow</em>
            </h1>
            <p className={styles.heroLine}>
              Three eaux. One nose. Small numbered editions,
              <br />
              composed above the old lavender exchange.
            </p>
            <a href="#eaux" className={styles.heroCue}>
              Descendre
              <span aria-hidden="true"> ↓</span>
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------- la maison */}
        <section id="maison" className={styles.maison} aria-labelledby="maison-title">
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              I
            </span>
            <h2 data-edit="sectionHead.title" data-edit-max="60" id="maison-title">La Maison</h2>
            <p data-edit="sectionHead.sectionSub" data-edit-max="240" data-edit-multiline className={styles.sectionSub}>Founded 1987 · Independent since</p>
          </header>
          <div className={styles.maisonColumns}>
            <p className={styles.maisonLead}>
              <span className={styles.dropCap} aria-hidden="true">
                M
              </span>
              aison Ambre began in a single rented room above the old lavender exchange in
              Grasse, with a copper still, a north-facing window, and the conviction that a
              perfume should behave like dusk: arriving slowly, and leaving something behind.
            </p>
            <div className={styles.maisonBody}>
              <p data-edit="maison.body" data-edit-max="240" data-edit-multiline>
                We have grown carefully since: one atelier, three eaux, and editions small
                enough to number in pencil. We do not launch by season. A composition joins the
                house when it is finished, which has happened eleven times in thirty-nine years,
                and been reversed eight.
              </p>
              <p>
                What remains of each attempt is kept in the archive, four hundred amber vials
                we call <i>la mémoire</i>. Visitors may smell them. Nothing in the archive is
                for sale, which is precisely why it matters.
              </p>
            </div>
          </div>
          <dl className={styles.maisonFigures}>
            <div>
              <dt data-edit="maison.term" data-edit-max="28">Editions composed</dt>
              <dd data-edit="maison.body2" data-edit-max="200" data-edit-multiline>XI</dd>
            </div>
            <div>
              <dt data-edit="maison.term2" data-edit-max="28">Kept in the collection</dt>
              <dd data-edit="maison.body3" data-edit-max="200" data-edit-multiline>III</dd>
            </div>
            <div>
              <dt data-edit="maison.term3" data-edit-max="28">Materials in the organ</dt>
              <dd data-edit="maison.body4" data-edit-max="200" data-edit-multiline>412</dd>
            </div>
            <div>
              <dt data-edit="maison.term4" data-edit-max="28">Rooms in the atelier</dt>
              <dd data-edit="maison.body5" data-edit-max="200" data-edit-multiline>IV</dd>
            </div>
          </dl>
        </section>

        {/* ------------------------------------------------------- les eaux */}
        <section id="eaux" className={styles.eaux} aria-labelledby="eaux-title">
          <div data-edit-pattern="eaux.field" data-edit-roles="0,6,4,2" className={styles.eauxField} aria-hidden="true">
            <TabbiedPattern
              pattern={scumble}
              palette={[NOIR, TAUPE, BRONZE, GOLD]}
              seed="ma-eaux-field-03"
              fit="grid"
              cellSize={34}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.eauxFieldScrim} />
          </div>
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              II
            </span>
            <h2 data-edit="sectionHead.title2" data-edit-max="60" id="eaux-title">Les Trois Eaux</h2>
            <p data-edit="sectionHead.sectionSub2" data-edit-max="240" data-edit-multiline className={styles.sectionSub}>The collection entire; nothing else is made</p>
          </header>
          <p className={styles.eauxHint} aria-hidden="true">
            Faites glisser <span data-edit="eaux.text" data-edit-max="60">⟶</span>
          </p>
          <div className={styles.eauxRow} role="list">
            {EAUX.map((eau, i) => (
              <article key={eau.name} className={styles.eauCard} role="listitem">
                <div className={styles.eauStage}>
                  <div data-edit-pattern={`eauCard.field.${i}`} className={styles.eauPattern} aria-hidden="true">
                    <TabbiedPattern
                      pattern={gloaming}
                      palette={eau.palette}
                      seed={eau.seed}
                      fit="cover"
                      style={{ position: 'absolute', inset: 0, opacity: 0.85 }}
                    />
                  </div>
                  <div className={styles.eauBottle}>
                    <Figure editId={`eauCard.photo.${i}`} slug={eau.slug} cutout alt={eau.alt} />
                  </div>
                  <span className={styles.eauNumeral} aria-hidden="true">
                    {eau.numeral}
                  </span>
                </div>
                <div className={styles.eauBody}>
                  <h3 data-edit={`eauCard.title.${i}`} data-edit-max="40">{eau.name}</h3>
                  <p data-edit={`eauCard.eauForm.${i}`} data-edit-max="240" data-edit-multiline className={styles.eauForm}>{eau.form}</p>
                  <p data-edit={`eauCard.eauLine.${i}`} data-edit-max="240" data-edit-multiline className={styles.eauLine}>{eau.line}</p>
                  <dl className={styles.eauNotes}>
                    <div>
                      <dt data-edit={`eauCard.term.${i}`} data-edit-max="28">Tête</dt>
                      <dd data-edit={`eauCard.body.${i}`} data-edit-max="200" data-edit-multiline>{eau.notes.tete}</dd>
                    </div>
                    <div>
                      <dt data-edit={`eauCard.term2.${i}`} data-edit-max="28">Cœur</dt>
                      <dd data-edit={`eauCard.body2.${i}`} data-edit-max="200" data-edit-multiline>{eau.notes.coeur}</dd>
                    </div>
                    <div>
                      <dt data-edit={`eauCard.term3.${i}`} data-edit-max="28">Fond</dt>
                      <dd data-edit={`eauCard.body3.${i}`} data-edit-max="200" data-edit-multiline>{eau.notes.fond}</dd>
                    </div>
                  </dl>
                  <p data-edit={`eauCard.eauPrice.${i}`} data-edit-max="240" data-edit-multiline className={styles.eauPrice}>{eau.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ ingredient band */}
        <section className={styles.matieres} aria-labelledby="matieres-title">
          <div className={styles.matieresImage}>
            <Figure editId="photo.ambre-ingredients"
              slug="ambre-ingredients"
              alt="A still life of amber resin, vanilla pods, and dried blossom on dark cloth"
            />
          </div>
          <div className={styles.matieresPanel}>
            <h2 data-edit="matieres.matieresTitle" data-edit-max="60" id="matieres-title" className={styles.matieresTitle}>
              Les Matières
            </h2>
            <p data-edit="matieres.matieresLine" data-edit-max="240" data-edit-multiline className={styles.matieresLine}>
              Bought from growers we can name, in quantities they can bear.
            </p>
            <dl className={styles.matieresList}>
              {INGREDIENTS.map(([name, origin], i) => (
                <div key={name}>
                  <dt data-edit={`matieres.term.${i}`} data-edit-max="28">{name}</dt>
                  <dd data-edit={`matieres.body.${i}`} data-edit-max="200" data-edit-multiline>{origin}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------- archive band */}
        <aside className={styles.archive} aria-label="L'archive">
          <div data-edit-pattern="archive.field" data-edit-roles="0,4,2,6" className={styles.archiveField} aria-hidden="true">
            <TabbiedPattern
              pattern={gloaming}
              palette={[NOIR, BRONZE, GOLD, TAUPE]}
              seed="ma-archive-07"
              fit="grid"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.archiveScrim} />
          </div>
          <p className={styles.archiveLine}>
            <span data-edit="archive.archiveLabel" data-edit-max="60" className={styles.archiveLabel}>La mémoire</span>
            Four hundred amber vials, kept and never sold
          </p>
        </aside>

        {/* -------------------------------------------------------- le nez */}
        <section id="nez" className={styles.nez} aria-labelledby="nez-title">
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              III
            </span>
            <h2 data-edit="sectionHead.title3" data-edit-max="60" id="nez-title">Le Nez</h2>
            <p data-edit="sectionHead.sectionSub3" data-edit-max="240" data-edit-multiline className={styles.sectionSub}>Hélène Verdier · perfumer since 1994</p>
          </header>
          <div className={styles.nezGrid}>
            <figure className={styles.nezPortrait}>
              <div className={styles.portraitFrame}>
                <Figure editId="photo.ambre-nose"
                  slug="ambre-nose"
                  alt="Portrait of Hélène Verdier, silver chignon, black jacket, photographed against a charcoal wall"
                />
              </div>
              <figcaption data-edit="nez.caption" data-edit-max="120" data-edit-multiline>Hélène Verdier · atelier, Grasse</figcaption>
            </figure>
            <div className={styles.nezText}>
              <blockquote className={styles.nezQuote}>
                <p data-edit="nez.body" data-edit-max="240" data-edit-multiline>
                  "A perfume is finished when removing one material ruins it, and not one
                  moment before. Most of my work is removal."
                </p>
              </blockquote>
              <p data-edit="nez.body2" data-edit-max="240" data-edit-multiline>
                Hélène Verdier trained beside her grandmother's copper still and spent a decade
                matching lost scents for the great houses before Maison Ambre gave her the one
                thing the great houses could not: time. She has composed every edition since
                1994, declines all briefs, and keeps office hours only for the archive.
              </p>
              <p>
                Her rule for the house is unchanged in three decades: <i>one nose, no
                committees, no focus groups. A perfume is an opinion, not a poll.</i>
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ l'atelier */}
        <section id="atelier" className={styles.atelier} aria-labelledby="atelier-title">
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              IV
            </span>
            <h2 data-edit="sectionHead.title4" data-edit-max="60" id="atelier-title">L'Atelier</h2>
            <p data-edit="sectionHead.sectionSub4" data-edit-max="240" data-edit-multiline className={styles.sectionSub}>Four movements, forty days</p>
          </header>
          <figure className={styles.atelierFigure}>
            <Figure editId="photo.ambre-atelier"
              slug="ambre-atelier"
              alt="The perfumer's organ: tiered shelves of labelled amber vials in low light"
            />
            <figcaption data-edit="atelier.caption" data-edit-max="120" data-edit-multiline>The organ, photographed at closing. 412 materials, one chair.</figcaption>
          </figure>
          <ol className={styles.atelierSteps}>
            {ATELIER_STEPS.map((step, i) => (
              <li key={step.numeral}>
                <span className={styles.stepNumeral} aria-hidden="true">
                  {step.numeral}
                </span>
                <h3 data-edit={`atelier.title.${i}`} data-edit-max="40">{step.title}</h3>
                <p data-edit={`atelier.body.${i}`} data-edit-max="240" data-edit-multiline>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- visites */}
        <section id="visites" className={styles.visites} aria-labelledby="visites-title">
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              V
            </span>
            <h2 data-edit="sectionHead.title5" data-edit-max="60" id="visites-title">Stockists &amp; Visites</h2>
            <p data-edit="sectionHead.sectionSub5" data-edit-max="240" data-edit-multiline className={styles.sectionSub}>Found in few places, on purpose</p>
          </header>
          <div className={styles.stockistRow}>
            {STOCKISTS.map((stockist, i) => (
              <article key={stockist.city} className={styles.stockist}>
                <h3 data-edit={`stockist.title.${i}`} data-edit-max="40">{stockist.city}</h3>
                {stockist.lines.map((line, i2) => (
                  <p data-edit={`stockist.body.${i}.${i2}`} data-edit-max="240" data-edit-multiline key={line}>{line}</p>
                ))}
                <p data-edit={`stockist.stockistNote.${i}`} data-edit-max="240" data-edit-multiline className={styles.stockistNote}>{stockist.note}</p>
              </article>
            ))}
          </div>
          <p className={styles.visitesCoda}>
            The atelier receives twelve visitors a week, in pairs, for the archive and a
            reading of the three eaux. Write to{' '}
            <a data-edit="visites.link" data-edit-max="28" href="mailto:visites@maison-ambre.example">visites@maison-ambre.example</a>;
            allow us a fortnight to reply; we are few.
          </p>
        </section>
      </main>

      {/* -------------------------------------------------------------- footer */}
      <footer className={styles.footer}>
        <div data-edit-pattern="footer.field" data-edit-roles="0,4,2" className={styles.footerBand} aria-hidden="true">
          <TabbiedPattern
            pattern={gloaming}
            palette={[NOIR, BRONZE, GOLD]}
            seed="ma-footer-02"
            fit="grid"
            style={{ position: 'absolute', inset: 0, opacity: 0.9 }}
          />
        </div>
        <div className={styles.footerInner}>
          <p data-edit="footer.footerMark" data-edit-max="240" data-edit-multiline className={styles.footerMark}>Maison&nbsp;Ambre</p>
          <p data-edit="footer.footerLine" data-edit-max="240" data-edit-multiline className={styles.footerLine}>
            MCMLXXXVII to MMXXVI · A fictional house, faithfully imagined
          </p>
          <nav aria-label="Footer" className={styles.footerNav}>
            <a data-edit="footer.maison" data-edit-max="28" href="#maison">La Maison</a>
            <a data-edit="footer.eaux" data-edit-max="28" href="#eaux">Les Eaux</a>
            <a data-edit="footer.visites" data-edit-max="28" href="#visites">Visites</a>
          </nav>
          <p className={styles.footerCredit}>
            Motifs de fumée, patterns by{' '}
            <a data-edit="footer.link" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
