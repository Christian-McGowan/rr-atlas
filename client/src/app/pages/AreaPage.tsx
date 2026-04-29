import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/Page.module.css";
import UsMap from "../../components/UsMap";
import SearchBar from "../../components/SearchBar";
import RiskSnapshot from "../../components/RiskSnapshot";
import EventsPanel from "../../components/EventsPanel";
import ResourceList from "../../components/ResourceList";
import { api } from "../../lib/api";
import type { Place, RiskSnapshot as RiskSnapshotT, AtlasEvent, CommunityResource } from "../../lib/types";

const AS_OF_LABEL = "Feb 10, 2026";
const AS_OF_DATE = new Date("2026-02-10T23:59:59Z");

function isLiveEvent(e: AtlasEvent) {
  const s = (e.status ?? "").toLowerCase();
  if (s.includes("active") || s.includes("monitor") || s.includes("warning") || s.includes("evac")) return true;
  if (s.includes("contained") || s.includes("inactive") || s.includes("closed") || s.includes("past")) return false;

  const t = Date.parse(String((e as any).updatedAt ?? ""));
  if (Number.isFinite(t)) {
    const hours = (Date.now() - t) / (1000 * 60 * 60);
    return hours <= 48;
  }
  return false;
}

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const w = values.length * 10;
  const h = 34;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="34" aria-hidden="true" style={{ display: "block" }}>
      {values.map((v, i) => {
        const bh = Math.max(2, (v / max) * (h - 4));
        return (
          <rect
            key={i}
            x={i * 10 + 2}
            y={h - bh}
            width={6}
            height={bh}
            rx={2}
            fill="currentColor"
            opacity={0.25 + 0.6 * (v / max)}
          />
        );
      })}
    </svg>
  );
}

export default function AreaPage() {
  const { slug } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [risk, setRisk] = useState<RiskSnapshotT | null>(null);
  const [events, setEvents] = useState<AtlasEvent[]>([]);
  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"live" | "all">("live");

  const safeSlug = useMemo(() => slug ?? "", [slug]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const [p, r, e, res] = await Promise.all([
          api.getPlace(safeSlug),
          api.getRisk(safeSlug),
          api.getEvents({ placeSlug: safeSlug }),
          api.getResources(safeSlug)
        ]);
        if (cancelled) return;
        setPlace(p);
        setRisk(r);
        setEvents(e);
        setResources(res);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [safeSlug]);

  const shownEvents = useMemo(() => {
    const live = events.filter(isLiveEvent);
    const all = events.filter((e) => {
      const t = Date.parse(String((e as any).updatedAt ?? ""));
      return !Number.isFinite(t) || new Date(t) <= AS_OF_DATE;
    });
    return view === "live" ? live : all;
  }, [events, view]);

  // demo “risk trend” values
  const demoRiskTrend = useMemo(() => [52, 54, 55, 57, 60, 58, 61, 63, 62, 64, 66, 65], []);
  const demoResilience = useMemo(() => [48, 49, 51, 50, 52, 54, 55, 54, 56, 57, 58, 58], []);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Loading area…</div>
          </div>
        </div>
      </main>
    );
  }

  if (!place) {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Area not found</div>
            <div className={styles.cardSub}>Try searching again.</div>
            <div style={{ marginTop: 16 }}>
              <SearchBar placeholder='Try: "LA" or "90001"' />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.splitShell}>
        <div className={styles.splitHeader}>
          <div>
            <h1 className={styles.title}>{place.label}</h1>
            <p className={styles.subtitle}>A focused profile of risks, resilience signals, and community resources.</p>
          </div>
          <div className={styles.splitHeaderSearch}>
            <SearchBar placeholder='Search another place (e.g., "San Diego", "fire map")' />
          </div>
        </div>

        <section className={styles.splitLeft}>
          <div className={styles.stack}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Risk snapshot</div>
                  <div className={styles.cardSub}>Modeled indices (0–100) + top hazards</div>
                </div>
              </div>
              <div className={styles.cardBody}>{risk && <RiskSnapshot risk={risk} />}</div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Trends (demo)</div>
                  <div className={styles.cardSub}>How modeled risk + resilience are moving over time</div>
                </div>
              </div>

              <div className={styles.cardBodyStack}>
                <div className={styles.metricGrid}>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Overall risk</div>
                    <div className={styles.metricValue}>72</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Community resilience</div>
                    <div className={styles.metricValue}>58</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Expected annual loss</div>
                    <div className={styles.metricValue}>$210M</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Social vulnerability</div>
                    <div className={styles.metricValue}>49</div>
                  </div>
                </div>

                <div>
                  <div className={styles.smallLabel}>Risk (last 12 months, demo)</div>
                  <MiniBars values={demoRiskTrend} />
                </div>

                <div>
                  <div className={styles.smallLabel}>Resilience (last 12 months, demo)</div>
                  <MiniBars values={demoResilience} />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Events</div>
                  <div className={styles.cardSub}>
                    {view === "live" ? "What’s happening now" : `All events up to ${AS_OF_LABEL}`} (demo)
                  </div>
                </div>
              </div>

              <EventsPanel events={shownEvents} />
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Community resources</div>
                  <div className={styles.cardSub}>Shelters, cooling centers, hospitals (demo data)</div>
                </div>
              </div>
              <ResourceList resources={resources} />
            </div>
          </div>
        </section>

        <aside className={styles.splitRight}>
          <div className={`${styles.card} ${styles.stickyCard}`}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Map</div>
                <div className={styles.cardSub}>Centered on {place.label}</div>
              </div>
            </div>

            <div className={styles.stickyBody}>
              <div className={styles.mapFrame}>
                <UsMap mode="place" place={place} height="100%" />

                <div className={styles.mapOverlay} role="group" aria-label="Map event view">
                  <button
                    type="button"
                    className={`${styles.pill} ${view === "live" ? styles.pillActive : ""}`}
                    onClick={() => setView("live")}
                  >
                    🔴 Live
                  </button>
                  <button
                    type="button"
                    className={`${styles.pill} ${view === "all" ? styles.pillActive : ""}`}
                    onClick={() => setView("all")}
                  >
                    All (as of {AS_OF_LABEL})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
