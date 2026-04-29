import { useNavigate } from "react-router-dom";
import styles from "../../styles/Page.module.css";
import SearchBar from "../../components/SearchBar";
import UsMap from "../../components/UsMap";

type QuickRisk = {
  label: string;
  query: string;
  route?: string;
  emoji: string;
};

const QUICK_RISKS: QuickRisk[] = [
  { label: "Wildfire", query: "fire map", route: "/fire", emoji: "🔥" },
  { label: "Flood", query: "flood", emoji: "🌊" },
  { label: "Hurricane", query: "hurricane", emoji: "🌀" },
  { label: "Tornado", query: "tornado", emoji: "🌪️" },
  { label: "Earthquake", query: "earthquake", emoji: "🫨" },
  { label: "Extreme Heat", query: "heat", emoji: "🥵" },
  { label: "Winter Storm", query: "winter storm", emoji: "❄️" },
  { label: "Severe Storm", query: "storm", emoji: "⛈️" },
  { label: "Air Quality", query: "air quality", emoji: "😷" },
  { label: "Drought", query: "drought", emoji: "🏜️" },
  { label: "Landslide", query: "landslide", emoji: "🪨" }
];

export default function HomePage() {
  const navigate = useNavigate();

  const mapHeight = "calc(100vh - 180px)";

  function go(r: QuickRisk) {
    if (r.route) {
      navigate(r.route);
      return;
    }
    navigate(`/?q=${encodeURIComponent(r.query)}`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.landingShell}>
        {/* LEFT: stays in the centered content column */}
        <div className={styles.landingLeft}>
          <div className={styles.topStrip}>
            <p className={styles.subtitleCompact}>
              Search a city, ZIP, or hazard to see live and historical risks—fast, clean, and focused.
            </p>
            <SearchBar autoFocus placeholder='Try: "LA", "90001", "fire map", "fire LA"' />
          </div>

          <div className={styles.mapHeroCard}>
            <UsMap mode="nation" height={mapHeight} />
          </div>
        </div>

        {/* RIGHT: breaks out and pins to viewport right */}
        <aside className={styles.landingRight}>
          <div className={styles.quickCard}>
            <div className={styles.quickTitle}>Quick risk searches</div>
            <div className={styles.quickSub}>Jump into common hazard views.</div>

            <div className={styles.quickGrid}>
              {QUICK_RISKS.map((r) => (
                <button key={r.label} className={styles.quickBtn} onClick={() => go(r)}>
                  <span className={styles.quickEmoji}>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.quickHint}>
              Tip: combine with a place in search (e.g., <strong>fire LA</strong>,{" "}
              <strong>90210</strong>).
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
