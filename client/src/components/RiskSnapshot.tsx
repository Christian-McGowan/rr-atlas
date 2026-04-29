import styles from "../styles/Panel.module.css";
import type { RiskSnapshot as RiskSnapshotT } from "../lib/types";

export default function RiskSnapshot({ risk }: { risk: RiskSnapshotT }) {
  return (
    <div className={styles.riskGrid}>
      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>Overall risk</div>
        <div className={styles.metricValue}>{risk.overallRisk}</div>
        <div className={styles.metricHint}>0–100 (higher = riskier)</div>
      </div>

      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>Community resilience</div>
        <div className={styles.metricValue}>{risk.resilience}</div>
        <div className={styles.metricHint}>0–100 (higher = stronger)</div>
      </div>

      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>Social vulnerability</div>
        <div className={styles.metricValue}>{risk.socialVulnerability}</div>
        <div className={styles.metricHint}>0–100 (higher = more vulnerable)</div>
      </div>

      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>Expected annual loss</div>
        <div className={styles.metricValue}>${risk.expectedAnnualLossM}M</div>
        <div className={styles.metricHint}>Modeled (demo)</div>
      </div>

      <div className={styles.fullRow}>
        <div className={styles.sectionTitle}>Top hazards</div>
        <div className={styles.chips}>
          {risk.topHazards.map((h) => (
            <span key={h} className={styles.chip}>{h}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
