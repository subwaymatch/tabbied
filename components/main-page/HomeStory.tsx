'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useMediaQuery from 'lib/useMediaQuery';
import { seededRandom, type Rand } from './homeMotion';
import styles from './HomeStory.module.css';

// Near-white squares drifting behind the copy, plus one slow ring of them
// orbiting the centre. The section is about the work being generative, so the
// background is generated rather than placed.

const SQUARE_COUNT = 20;
const ORBIT_COUNT = 14;

/** How often one or two squares are retired and redrawn elsewhere. */
const STORY_INTERVAL = 2600;

/** Long enough for the opacity transition below to finish before the swap. */
const FADE_MS = 1300;

const SEED = 0x5709;

const TONES = ['oklch(0.96 0.001 260)', 'oklch(0.94 0.002 260)', 'oklch(0.98 0.001 260)'];
const ORBIT_TONES = ['oklch(0.94 0.002 260)', 'oklch(0.9 0.003 260)', 'oklch(0.97 0.001 260)'];

type Square = {
  left: number;
  top: number;
  size: number;
  color: string;
  opacity: number;
};

function randomSquare(rand: Rand): Square {
  return {
    left: rand() * 96,
    top: rand() * 88,
    size: 28 + rand() * 26,
    color: TONES[Math.floor(rand() * TONES.length)],
    opacity: 0.3 + rand() * 0.4,
  };
}

/**
 * Seeded like the hero's grids, and for the same reason - but note this one is
 * built inside the component rather than at module scope. A module-level
 * `Math.random()` would run once on the server and again in the browser and
 * produce two different backgrounds for the same markup.
 */
function initialSquares(): Square[] {
  const rand = seededRandom(SEED);

  return Array.from({ length: SQUARE_COUNT }, () => randomSquare(rand));
}

const ORBIT = (() => {
  const rand = seededRandom(SEED ^ 0xffff);

  return Array.from({ length: ORBIT_COUNT }, (_, i) => ({
    angle: (360 / ORBIT_COUNT) * i,
    size: 20 + rand() * 20,
    color: ORBIT_TONES[Math.floor(rand() * ORBIT_TONES.length)],
  }));
})();

/** `count` distinct square indices. */
function sampleSquares(count: number): number[] {
  const picked: number[] = [];

  while (picked.length < count) {
    const i = Math.floor(Math.random() * SQUARE_COUNT);

    if (!picked.includes(i)) {
      picked.push(i);
    }
  }

  return picked;
}

export default function HomeStory({
  patternCount,
  templateCount,
  paletteCount,
}: {
  patternCount: number;
  templateCount: number;
  paletteCount: number;
}) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [squares, setSquares] = useState(initialSquares);
  const [fading, setFading] = useState<number[]>([]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    // A square fades out where it is, then reappears somewhere else - so the
    // swap needs a second beat, and every pending one has to be cancellable.
    const pending = new Set<ReturnType<typeof setTimeout>>();

    const timer = setInterval(() => {
      const chosen = sampleSquares(1 + Math.floor(Math.random() * 2));
      const replacements = chosen.map(() => randomSquare(Math.random));

      setFading((current) => Array.from(new Set([...current, ...chosen])));

      const swap = setTimeout(() => {
        pending.delete(swap);

        setSquares((current) => {
          const next = current.slice();
          chosen.forEach((index, i) => {
            next[index] = replacements[i];
          });

          return next;
        });
        setFading((current) => current.filter((index) => !chosen.includes(index)));
      }, FADE_MS);

      pending.add(swap);
    }, STORY_INTERVAL);

    return () => {
      clearInterval(timer);
      pending.forEach(clearTimeout);
    };
  }, [reduceMotion]);

  return (
    <section className={styles.section}>
      <div className={styles.backdrop} aria-hidden="true">
        {squares.map((square, i) => (
          <span
            key={i}
            className={styles.square}
            style={{
              left: `${square.left}%`,
              top: `${square.top}%`,
              width: square.size,
              height: square.size,
              background: square.color,
              opacity: fading.includes(i) ? 0 : square.opacity,
            }}
          />
        ))}

        <div className={styles.orbit}>
          {ORBIT.map((square) => (
            <span
              key={square.angle}
              className={styles.orbitSquare}
              style={{
                width: square.size,
                height: square.size,
                background: square.color,
                transform: `rotate(${square.angle}deg) translate(420px, 0) rotate(45deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.inner}>
        <span className={styles.badge}>Our story</span>

        <h2 className={styles.title}>
          Simple tools to help you move from inspiration to creation
        </h2>

        <p className={styles.body}>
          Tabbied began as a tool for generating wall art, but we soon
          discovered a bigger opportunity: helping people overcome the blank
          canvas. With customizable patterns, ready-made color palettes, and
          free website templates, Tabbied makes it easier to explore ideas, find
          combinations that work, and turn inspiration into something useful.
        </p>

        {/* Plain elements rather than a <dl>: two of the four are links, and an
            anchor is not a permitted child of a description list. */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{paletteCount}</span>
            <span className={styles.statLabel}>Color palettes</span>
          </div>

          <Link href="/patterns" prefetch={false} className={styles.stat}>
            <span className={styles.statNumber}>{patternCount}</span>
            <span className={styles.statLabel}>
              Unique patterns <span className={styles.statArrow} aria-hidden="true">&rarr;</span>
            </span>
          </Link>

          <Link href="/templates" prefetch={false} className={styles.stat}>
            <span className={styles.statNumber}>{templateCount}</span>
            <span className={styles.statLabel}>
              Website templates <span className={styles.statArrow} aria-hidden="true">&rarr;</span>
            </span>
          </Link>

          <div className={styles.stat}>
            <span className={styles.statNumber}>1</span>
            <span className={styles.statLabel}>Pattern engine</span>
          </div>
        </div>
      </div>
    </section>
  );
}
