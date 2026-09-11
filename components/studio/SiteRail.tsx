'use client';

// The rail beside the canvas: the site's name, and three tabs.
//
// Colours and Patterns are the first release of the customizer, and they are
// the whole of what it changes: one swatch per brand role, and one design per
// pattern field. Content is a tab so the person can see where words and
// pictures will be edited, and reads that they are not edited here yet - the
// download is where copy changes today. Every change is planned and applied
// by the parent; this only says what was asked for.
import { useEffect, useState, type KeyboardEvent } from 'react';
import type { PatternSlot, TemplateSpec } from 'tabbied-templates';
import type { DesignChoice } from 'lib/designCatalog';
import styles from './SiteRail.module.css';

export type RailTab = 'colours' | 'patterns' | 'content';

const TABS: [RailTab, string][] = [
  ['colours', 'Colours'],
  ['patterns', 'Patterns'],
  ['content', 'Content'],
];

/** `hero.field` to `Hero`; the section a field sits in, for its caption. */
const sectionOf = (id: string) => {
  const head = id.split('.')[0] ?? id;

  return head.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
};

/** What a colour role is called: the spec's own name where it has one. */
const roleLabel = (spec: TemplateSpec, index: number): string =>
  spec.palette.names?.[index] ?? (index === 0 ? 'Ground' : `Ink ${index}`);

export default function SiteRail({
  title,
  onRename,
  spec,
  designs,
  palette,
  coloursChanged,
  onColour,
  onResetColours,
  patternSlots,
  designOn,
  patternsChanged,
  shuffling,
  onShuffle,
  onResetPatterns,
}: {
  title: string;
  /** Commit a new name. Called on blur and Enter, never per keystroke. */
  onRename: (title: string) => void;
  spec: TemplateSpec;
  designs: readonly DesignChoice[];
  /** The colours the page wears now, ground first. */
  palette: readonly string[];
  coloursChanged: boolean;
  onColour: (index: number, value: string) => void;
  onResetColours: () => void;
  patternSlots: readonly PatternSlot[];
  /** The design a field draws now, by slot id. */
  designOn: (slot: PatternSlot) => string;
  patternsChanged: boolean;
  shuffling: boolean;
  onShuffle: () => void;
  onResetPatterns: () => void;
}) {
  const [tab, setTab] = useState<RailTab>('colours');
  const [name, setName] = useState(title);

  // A rename that came back from the server (or a reload) wins over what is
  // in the field.
  useEffect(() => {
    setName(title);
  }, [title]);

  const commitName = () => {
    const next = name.trim();

    if (next === '' ) {
      setName(title);
      return;
    }

    if (next !== title) onRename(next);
  };

  const onNameKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.currentTarget.blur();
    if (event.key === 'Escape') {
      setName(title);
      event.currentTarget.blur();
    }
  };

  const names = new Map(designs.map((design) => [design.slug, design.name]));

  return (
    <aside className={styles.rail} aria-label="Customize this site">
      <div className={styles.nameBlock}>
        <label className={styles.nameLabel} htmlFor="site-name">
          Your site name
        </label>
        <div className={styles.nameField}>
          <input
            id="site-name"
            className={styles.nameInput}
            value={name}
            placeholder="Untitled site"
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            onBlur={commitName}
            onKeyDown={onNameKey}
          />
          <svg
            className={styles.namePencil}
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="What to change">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`${styles.tab} ${tab === key ? styles.tabOn : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'colours' ? (
        <section className={styles.panel} aria-label="Colours">
          <p className={styles.hint}>
            Each swatch sets one part of the page. Set the background first, then
            the inks that sit on it.
          </p>
          <div className={styles.swatches}>
            {palette.map((colour, index) => (
              <label key={index} className={styles.swatch}>
                <span className={styles.chip} style={{ background: colour }}>
                  <input
                    type="color"
                    value={colour}
                    aria-label={roleLabel(spec, index)}
                    onChange={(event) => onColour(index, event.target.value)}
                  />
                </span>
                <span className={styles.swatchName}>{roleLabel(spec, index)}</span>
                <code className={styles.swatchHex}>{colour}</code>
              </label>
            ))}
          </div>
          {coloursChanged ? (
            <button type="button" className={styles.textAction} onClick={onResetColours}>
              Reset colours
            </button>
          ) : null}
        </section>
      ) : null}

      {tab === 'patterns' ? (
        <section className={styles.panel} aria-label="Patterns">
          <p className={styles.hint}>
            The patterns currently placed on the page. Shuffle to draw a new set
            from the pattern library.
          </p>
          {patternSlots.length === 0 ? (
            <p className={styles.hint}>This template has no pattern fields.</p>
          ) : (
            // An explicit role: `list-style: none` strips the implicit one in
            // some engines, and the shuffle test counts the rows by it.
            <ul role="list" className={`${styles.fields} ${shuffling ? styles.fieldsBusy : ''}`}>
              {patternSlots.map((slot) => {
                const slug = designOn(slot);

                return (
                  <li key={slot.id} className={styles.field}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- a committed preview under public/, no loader needed */}
                    <img
                      className={styles.fieldThumb}
                      src={`/previews/${slug}.webp`}
                      alt=""
                      loading="lazy"
                      width="56"
                      height="44"
                    />
                    <span className={styles.fieldMeta}>
                      <span className={styles.fieldDesign}>{names.get(slug) ?? slug}</span>
                      <span className={styles.fieldSlot}>{slot.label ?? sectionOf(slot.id)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <div className={styles.patternActions}>
            {patternsChanged ? (
              <button type="button" className={styles.textAction} onClick={onResetPatterns}>
                Reset patterns
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              className={styles.shuffle}
              disabled={shuffling || patternSlots.length === 0}
              onClick={onShuffle}
            >
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={shuffling ? styles.spin : undefined}
              >
                {shuffling ? (
                  <path d="M12 3a9 9 0 1 0 9 9" />
                ) : (
                  <>
                    <path d="M16 3h5v5" />
                    <path d="M4 20 21 3" />
                    <path d="M21 16v5h-5" />
                    <path d="m15 15 6 6" />
                    <path d="M4 4l5 5" />
                  </>
                )}
              </svg>
              {shuffling ? 'Drawing...' : 'Shuffle patterns'}
            </button>
          </div>
        </section>
      ) : null}

      {tab === 'content' ? (
        <section className={styles.panel} aria-label="Content">
          <p className={styles.hint}>
            Copy and images can&apos;t be edited here yet. Download the site and
            change the text and photos in your own editor. AI editing arrives in
            a future release.
          </p>
          <ul className={styles.soon}>
            <li>
              <span>Rewrite copy with AI</span>
              <span className={styles.soonTag}>Soon</span>
            </li>
            <li>
              <span>Generate images with AI</span>
              <span className={styles.soonTag}>Soon</span>
            </li>
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
