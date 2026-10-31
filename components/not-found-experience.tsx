import Link from "next/link";
import styles from "./not-found-experience.module.css";

/** A single playful recovery moment for both public and signed-in 404 pages. */
export function NotFoundExperience() {
  return (
    <section className={styles.experience} aria-labelledby="not-found-title">
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.agent}>
          <span className={styles.antenna} />
          <span className={styles.head}>
            <span className={styles.face}>
              <span className={styles.eye} />
              <span className={styles.eye} />
              <span className={styles.mouth} />
            </span>
          </span>
          <span className={styles.body}>
            <span className={styles.arm} />
          </span>
        </div>
        <span className={styles.trail} />
        <span className={styles.card}>
          <span className={styles.cardNumber}>#404</span>
          <span className={styles.cardTitle}>Runaway issue</span>
          <span className={styles.cardLine} />
        </span>
      </div>

      <div className={styles.copy}>
        <p className={styles.code}>Route search incomplete</p>
        <h1 id="not-found-title" className={styles.title}>This page slipped away.</h1>
        <p className={styles.description}>
          Our agent followed the trail, but the page may have moved, been deleted, or never existed.
        </p>
        <div className={styles.actions}>
          <Link href="/issues" className={styles.primary}>Go to issues</Link>
          <Link href="/" className={styles.secondary}>Back to Ziki</Link>
        </div>
      </div>
    </section>
  );
}
