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
        {/* Ground line + dynamic player shadow */}
        <div className={styles.ground} />
        <div className={styles.playerShadow} />

        {/* Player figure */}
        <div className={styles.player}>
          {/* Head & headband */}
          <div className={styles.head}>
            <div className={styles.headband} />
            <div className={styles.earLeft} />
            <div className={styles.earRight} />
          </div>

          {/* Athletic Neck & Trapezius muscles */}
          <div className={styles.neck} />
          <div className={styles.traps} />

          {/* Jersey Torso & Shoulder Caps */}
          <div className={styles.torso}>
            <div className={styles.shoulderCapLeft} />
            <div className={styles.shoulderCapRight} />
            <div className={styles.jersey}>
              <div className={styles.collar} />
              <div className={styles.placket} />
              <div className={styles.numberBlock}>
                <span className={styles.numberText}>10</span>
              </div>
              <div className={styles.jerseyTexture} />
            </div>
          </div>

          {/* Realistic Rugby Shorts (Waistband + 2 angled leg openings) */}
          <div className={styles.shorts}>
            <div className={styles.shortsWaist} />
            <div className={styles.shortsLegLeft}>
              <div className={styles.shortsStripeLeft} />
            </div>
            <div className={styles.shortsLegRight}>
              <div className={styles.shortsStripeRight} />
            </div>
          </div>

          {/* Articulated Left Arm (Sleeve Bicep -> Elbow -> Forearm -> Hand) */}
          <div className={styles.armLeftWrapper}>
            <div className={styles.bicepLeft} />
            <div className={styles.forearmLeft}>
              <div className={styles.wristTapeLeft} />
              <div className={styles.handLeft} />
            </div>
          </div>

          {/* Articulated Right Arm (Sleeve Bicep -> Elbow -> Forearm -> Hand) */}
          <div className={styles.armRightWrapper}>
            <div className={styles.bicepRight} />
            <div className={styles.forearmRight}>
              <div className={styles.wristTapeRight} />
              <div className={styles.handRight} />
            </div>
          </div>

          {/* Athletic Left Leg (Quad -> Knee -> Calf -> Sock -> Boot) */}
          <div className={styles.legLeftWrapper}>
            <div className={styles.quadLeft} />
            <div className={styles.kneeLeft} />
            <div className={styles.calfLeft} />
            <div className={styles.sockLeft} />
            <div className={styles.bootLeft} />
          </div>

          {/* Athletic Right Leg (Quad -> Knee -> Calf -> Sock -> Boot) */}
          <div className={styles.legRightWrapper}>
            <div className={styles.quadRight} />
            <div className={styles.kneeRight} />
            <div className={styles.calfRight} />
            <div className={styles.sockRight} />
            <div className={styles.bootRight} />
          </div>
        </div>

        {/* Realistic Rugby Ball (White with ZRU Green panels & seams) */}
        <div className={styles.ball}>
          <div className={styles.ballPanelLeft} />
          <div className={styles.ballPanelRight} />
          <div className={styles.ballSeam} />
        </div>

        {/* Turf impact burst */}
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
