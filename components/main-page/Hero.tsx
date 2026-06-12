'use client';

import { useEffect, useRef } from 'react';
import 'css-doodle';
import Link from 'next/link';
import { Container, Row, Col } from 'components/layout';
import styles from './Hero.module.css';

export default function MainHero() {
  const doodleRef = useRef<any>(null);

  // Re-randomize the backdrop every couple of seconds, but only while it can
  // actually be seen: pause when the hero is scrolled away or the tab is
  // hidden (each update re-renders the whole doodle grid), and stay still for
  // users who prefer reduced motion.
  useEffect(() => {
    const doodleElement = doodleRef.current;

    if (!doodleElement) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isInView = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const sync = () => {
      const shouldAnimate =
        isInView && !document.hidden && !reducedMotion.matches;

      if (shouldAnimate && timer === null) {
        timer = setInterval(() => {
          doodleRef.current?.update();
        }, 2000);
      } else if (!shouldAnimate && timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      isInView = entries[0].isIntersecting;
      sync();
    });

    observer.observe(doodleElement);
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);

      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, []);

  return (
    <div className={styles.heroSection}>
      <div className={styles.doodleBackground}>
        <div className={styles.doodleWrapper}>
          <style>
            {`
              css-doodle#hero-doodle {
                --color0:#326dc9;
                --color1:#263349;
                --color2:#41d6f4;
                --color3:#d65ea6;
                --color4:#41d6f4;
                --color5:#d65ea6;

                /* set custom colors and inject z-index for the specific color to use for association */
                --randomColor: @p(var(--color1), var(--color2), var(--color3), var(--color4), var(--color5));
                --rule: (
                  /*Frequency options of 0.2, 0.4, 0.6, 0.8, 1.0 */
                  @random(0.2) {
                    background: var(--randomColor);
                    -webkit-clip-path: @pick(circle(100% at 0 0), circle(100% at 100% 0), circle(100% at 100% 100%), circle(100% at 0 100%), circle(50% at 50% 50%), circle(25% at 50% 50%), polygon(0 0, 0% 100%, 100% 100%), polygon(100% 0, 0 0, 100% 100%), polygon(100% 0, 0 0, 0 100%), polygon(100% 100%, 100% 0, 0 100%));
                    clip-path: @pick(circle(100% at 0 0), circle(100% at 100% 0), circle(100% at 100% 100%), circle(100% at 0 100%), circle(50% at 50% 50%), circle(25% at 50% 50%), polygon(0 0, 0% 100%, 100% 100%), polygon(100% 0, 0 0, 100% 100%), polygon(100% 0, 0 0, 0 100%), polygon(100% 100%, 100% 0, 0 100%));
                    overflow:hidden;

                    /* On or off option for displaying box shadows */
                    -webkit-box-shadow:0 0 @pick(0, 40)px rgba(0,0,0,0.2);
                    box-shadow:0 0 @pick(0, 40)px rgba(0,0,0,0.2);

                    -webkit-transition: ease @rand(200ms, 600ms);
                    transition: ease @rand(200ms, 600ms);
                  }
                  @random(0.05) {
                    width:100%;
                    height:100%;
                    overflow:hidden;
                    -webkit-clip-path: @pick(circle(100% at 0 0), circle(100% at 100% 0), circle(100% at 100% 100%), circle(100% at 0 100%));
                    clip-path: @pick(circle(100% at 0 0), circle(100% at 100% 0), circle(100% at 100% 100%), circle(100% at 0 100%));
                    background: repeating-linear-gradient(
                      @pick(45deg, 135deg),
                      var(--color0),
                      var(--color0) 5%,
                      var(--color1) 5%,
                      var(--color1) 10%
                    );

                  }
                );
              }`}
          </style>
          <css-doodle ref={doodleRef} id="hero-doodle" use="var(--rule)">
            {`
              :doodle {
                @grid: 14x7/ 100%;
                text-align:center;
                box-sizing:border-box;
              }
              :container {
                background: var(--color0);
                overflow:hidden;
              }
            `}
          </css-doodle>
        </div>
      </div>

      <div className={styles.contentBackground} />

      <Container>
        <Row align="center">
          <Col
            lg={{ span: 6, offset: 3 }}
            md={{ span: 6, offset: 3 }}
            sm={{ span: 8, offset: 2 }}
            xs={{ span: 12, offset: 0 }}
          >
            <div className={styles.heroContent}>
              <p className={styles.heroText}>
                Doodle with <br className={styles.lineBreak} />
                generated patterns
              </p>

              <div className={styles.heroActions}>
                <Link
                  href="/select-artwork/"
                  className={styles.actionBtn}
                  prefetch={false}
                >
                  Make your art
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
