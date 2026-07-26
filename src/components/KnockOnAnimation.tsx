import Link from "next/link";
import styles from "./KnockOnAnimation.module.css";

/**
 * KnockOnAnimation
 *
 * Minimalist, CSS-only geometric illustration of a rugby player
 * fumbling the ball forward (a "knock-on"). Used on 404 / not-found pages.
 *
 * Player wears a green ZRU jersey with collar, number, white socks, and boots.
 * No SVG, no images, no JS animation libraries — pure CSS shapes + keyframes.
 */
export default function KnockOnAnimation() {
  return (
    <div className={styles.wrapper}>
      {/* ── Animation scene ──────────────────────────────────────── */}
      <div className={styles.scene} aria-hidden="true">
        {/* Ground line + shadow */}
        <div className={styles.ground} />
        <div className={styles.playerShadow} />

        {/* Player figure */}
        <div className={styles.player}>
          {/* Head + headband */}
          <div className={styles.head}>
            <div className={styles.headband} />
          </div>

          {/* Neck */}
          <div className={styles.neck} />

          {/* Jersey — collar, number, texture */}
          <div className={styles.jersey}>
            <div className={styles.collar} />
            <div className={styles.numberBlock}>
              <span className={styles.numberText}>10</span>
            </div>
            <div className={styles.jerseyTexture} />
          </div>

          {/* Shorts + side stripe */}
          <div className={styles.shorts}>
            <div className={styles.shortsStripe} />
          </div>

          {/* Arms (sleeves with wrist tape via ::after) */}
          <div className={styles.armLeft} />
          <div className={styles.armRight} />

          {/* Legs */}
          <div className={styles.legLeft} />
          <div className={styles.legRight} />

          {/* White socks */}
          <div className={styles.sockLeft} />
          <div className={styles.sockRight} />

          {/* Boots (cleats via ::before/::after) */}
          <div className={styles.bootLeft} />
          <div className={styles.bootRight} />
        </div>

        {/* Rugby ball */}
        <div className={styles.ball}>
          <div className={styles.ballSeam} />
        </div>

        {/* Impact burst at landing spot */}
        <div className={styles.impact} />
      </div>

      {/* ── Text content ─────────────────────────────────────────── */}
      <div className={styles.text}>
        <h1 className={styles.title}>Knock-on!</h1>
        <p className={styles.subtitle}>This page dropped the ball.</p>
        <Link href="/" className={styles.homeLink}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
