import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import { PALETTE_COUNT, PATTERN_COUNT, TEMPLATE_COUNT } from 'lib/siteCounts';
import HomeNav from 'components/main-page/HomeNav';
import HomeHero from 'components/main-page/HomeHero';
import HomePatternLibrary from 'components/main-page/HomePatternLibrary';
import HomeHowItWorks from 'components/main-page/HomeHowItWorks';
import HomeTemplates from 'components/main-page/HomeTemplates';
import HomeStory from 'components/main-page/HomeStory';
import HomeFooter from 'components/main-page/HomeFooter';
import styles from 'components/main-page/home.module.css';

export const metadata: Metadata = {
  title: 'Tabbied - Free generative patterns and website templates',
  description: `Explore a growing library of ${PATTERN_COUNT} customizable patterns and ${TEMPLATE_COUNT} free website templates, ready to edit, download, and use.`,
};

export default function Home() {
  return (
    <div className={`${styles.home} ${plexMono.variable}`}>
      {/* The two hairlines marking the edges of the 1280px column, running the
          full height of the page behind every section. */}
      <div className={`${styles.columnRule} ${styles.columnRuleLeft}`} aria-hidden="true" />
      <div className={`${styles.columnRule} ${styles.columnRuleRight}`} aria-hidden="true" />

      <HomeNav />

      <HomeHero patternCount={PATTERN_COUNT} templateCount={TEMPLATE_COUNT} />

      <HomePatternLibrary patternCount={PATTERN_COUNT} />

      <HomeHowItWorks />

      <HomeTemplates templateCount={TEMPLATE_COUNT} />

      <HomeStory
        patternCount={PATTERN_COUNT}
        templateCount={TEMPLATE_COUNT}
        paletteCount={PALETTE_COUNT}
      />

      <HomeFooter />
    </div>
  );
}
