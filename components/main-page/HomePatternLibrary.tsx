'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useMediaQuery from 'lib/useMediaQuery';
import { PALETTE_POOLS, TIMING, seededRandom, type PaletteName } from './homeMotion';
import styles from './HomePatternLibrary.module.css';

// A miniature of the editor: a pattern field and the three controls that shape
// it, stepping through their own values so the section demonstrates the claim
// in its headline rather than describing it.

const DEMO_COLS = 6;
const DEMO_ROWS = 3;
const DEMO_CELLS = DEMO_COLS * DEMO_ROWS;

/** How many cells the low-frequency setting clears. */
const SPARSE_CELLS = 6;

/** How many cells turn a quarter or a half rotation on each step. */
const SPUN_CELLS = 4;

const SEED = 0x0d0d1e;

type ControlKey = 'colors' | 'frequency' | 'density';

const CONTROLS: { key: ControlKey; label: string; values: string[] }[] = [
  { key: 'colors', label: 'Colors', values: ['Mint', 'Ocean', 'Sunset', 'Lilac'] },
  { key: 'frequency', label: 'Frequency', values: ['1.0', '0.6'] },
  { key: 'density', label: 'Density', values: [`${DEMO_COLS}×${DEMO_ROWS}`] },
];

/** The frequency value that thins the field out; anything else fills it. */
const SPARSE_VALUE = '0.6';

type DemoState = {
  step: number;
  valueIdx: Record<ControlKey, number>;
  colors: string[];
  rotations: number[];
  cleared: number[];
};

function fillCells(rand: () => number, palette: PaletteName): string[] {
  const pool = PALETTE_POOLS[palette];

  return Array.from({ length: DEMO_CELLS }, () => pool[Math.floor(rand() * pool.length)]);
}

/** `count` distinct cell indices. */
function sampleCells(count: number): number[] {
  const picked: number[] = [];

  while (picked.length < count) {
    const i = Math.floor(Math.random() * DEMO_CELLS);

    if (!picked.includes(i)) {
      picked.push(i);
    }
  }

  return picked;
}

function initialState(): DemoState {
  return {
    step: 0,
    valueIdx: { colors: 0, frequency: 0, density: 0 },
    // Seeded, so the prerendered field survives hydration (see homeMotion.ts).
    colors: fillCells(seededRandom(SEED), 'Mint'),
    rotations: Array(DEMO_CELLS).fill(0),
    cleared: [],
  };
}

export default function HomePatternLibrary({
  patternCount,
}: {
  patternCount: number;
}) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [demo, setDemo] = useState(initialState);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const timer = setInterval(() => {
      // Every random draw that does not depend on the previous state happens
      // here rather than inside the updater, which React may run twice in
      // development and which must stay a function of its argument.
      const spun = sampleCells(SPUN_CELLS);
      const turns = spun.map(() => (Math.random() < 0.5 ? 90 : 180));
      const sparse = sampleCells(SPARSE_CELLS);

      setDemo((previous) => {
        const step = (previous.step + 1) % CONTROLS.length;
        const control = CONTROLS[step];
        const value = (previous.valueIdx[control.key] + 1) % control.values.length;

        const rotations = previous.rotations.slice();
        spun.forEach((cell, i) => {
          rotations[cell] = (rotations[cell] + turns[i]) % 360;
        });

        return {
          step,
          valueIdx: { ...previous.valueIdx, [control.key]: value },
          rotations,
          colors:
            control.key === 'colors'
              ? fillCells(Math.random, control.values[value] as PaletteName)
              : previous.colors,
          cleared:
            control.key === 'frequency'
              ? control.values[value] === SPARSE_VALUE
                ? sparse
                : []
              : previous.cleared,
        };
      });
    }, TIMING.demo);

    return () => clearInterval(timer);
  }, [reduceMotion]);

  const activeKey = CONTROLS[demo.step].key;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.rowHeader}>
          <span className={styles.eyebrow}>Pattern library</span>
          <Link href="/patterns" prefetch={false} className={styles.viewAll}>
            View all {patternCount} &rarr;
          </Link>
        </div>

        <div className={styles.columns}>
          <div>
            <h2 className={styles.title}>Pick a design and start customizing</h2>
            <p className={styles.body}>
              Tweak colors, frequency, and density in real time. Every pattern
              updates instantly as you edit: no page reloads, no guesswork.
            </p>
            <Link href="/patterns" prefetch={false} className={styles.cta}>
              <span className={styles.ctaDisc} aria-hidden="true">
                &rarr;
              </span>
              <span>Make your pattern</span>
            </Link>
          </div>

          <div className={styles.demo} aria-hidden="true">
            <div className={styles.demoGrid}>
              {demo.colors.map((color, i) => (
                <div
                  key={i}
                  className={styles.demoCell}
                  style={{ opacity: demo.cleared.includes(i) ? 0 : 1 }}
                >
                  <div
                    className={styles.demoTriangle}
                    style={{
                      background: color,
                      transform: `rotate(${demo.rotations[i]}deg)`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div>
              {CONTROLS.map((control) => (
                <div
                  key={control.key}
                  className={styles.control}
                  data-active={control.key === activeKey || undefined}
                >
                  <span className={styles.controlLabel}>{control.label}</span>
                  <span className={styles.controlValue}>
                    {control.values[demo.valueIdx[control.key]]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
