import { Container, Col, Row } from 'components/layout';
import styles from './HowItWorks.module.css';

export default function HowItWorksSection() {
  return (
    <div id="section-how-it-works" className={styles.howItWorksSection}>
      <Container>
        <Row>
          <Col>
            <h3 className="section-title">How it works</h3>
          </Col>
        </Row>

        <div className={styles.steps}>
          <Row>
            <Col md={4}>
              <div className={styles.stepBox}>
                <div className={`${styles.stepNumber} ${styles.one}`}>
                  <span>1</span>
                </div>
                <p>Pick a design from our growing collection of artwork</p>
              </div>
            </Col>

            <Col md={4}>
              <div className={styles.stepBox}>
                <div className={`${styles.stepNumber} ${styles.two}`}>
                  <span>2</span>
                </div>
                <p>Customize colors and choose settings for your design</p>
              </div>
            </Col>

            <Col md={4}>
              <div className={styles.stepBox}>
                <div className={`${styles.stepNumber} ${styles.three}`}>
                  <span>3</span>
                </div>
                <p>
                  Download your customized design{' '}
                  <span className={styles.highlight}>
                    <span className={styles.text}>for free</span>
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <div className={styles.imageBackground} />
    </div>
  );
}
