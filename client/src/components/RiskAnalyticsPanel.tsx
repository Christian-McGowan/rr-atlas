import MiniLineChart from "./charts/MiniLineChart";
import BarBreakdown from "./charts/BarBreakdown";
import styles from "../styles/Panel.module.css";

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i)) * 16777619;
  return Math.abs(h);
}

function makeSeries(seed: number, n: number, base: number, swing: number) {
  const out: number[] = [];
  let x = seed % 97;
  for (let i = 0; i < n; i++) {
    x = (x * 37 + 17) % 101;
    out.push(Math.round(base + ((x - 50) / 50) * swing));
  }
  return out.map((v) => Math.max(0, Math.min(100, v)));
}

export default function RiskAnalyticsPanel({ seedLabel }: { seedLabel: string }) {
  const seed = hashSeed(seedLabel);

  const trend = makeSeries(seed, 12, 62, 10);
  const hazard = [
    { label: "Wildfire", value: 78 },
    { label: "Flood", value: 54 },
    { label: "Heat", value: 68 },
    { label: "Quake", value: 49 },
    { label: "Air", value: 43 }
  ].map((x, idx) => ({ ...x, value: Math.max(10, Math.min(95, x.value + ((seed % (idx + 7)) - 3))) }));

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Risk analytics (demo)</div>
        <div className={styles.panelSub}>Modeled trend + hazard breakdown</div>
      </div>

      <div className={styles.panelBody}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>12-month risk trend</div>
          <div style={{ color: "rgba(15,23,42,0.75)", fontSize: 13, marginBottom: 10 }}>
            Demo series (0–100). Higher = riskier.
          </div>
          <div style={{ color: "rgba(37,99,235,0.95)" }}>
            <MiniLineChart points={trend} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Top hazard drivers</div>
          <BarBreakdown items={hazard} />
        </div>
      </div>
    </div>
  );
}
