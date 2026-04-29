import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/Page.module.css";
import SearchBar from "../../components/SearchBar";
import UsMap from "../../components/UsMap";
import EventsPanel from "../../components/EventsPanel";
import { api } from "../../lib/api";
import type { AtlasEvent, Place } from "../../lib/types";

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

function MiniLine({ values }: { values: number[] }) {
  const w = 220;
  const h = 44;
  const max = Math.max(1, ...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);

  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (w - 8) + 4;
      const y = h - 6 - ((v - min) / span) * (h - 12);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="44" aria-hidden="true" style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.75" />
    </svg>
  );
}

export default function FireAreaPage() {
  const { slug } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [events, setEvents] = useState<AtlasEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"live" | "all">("live");

  const safeSlug = useMemo(() => slug ?? "", [slug]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const [p, e] = await Promise.all([api.getPlace(safeSlug), api.getFireEvents({ placeSlug: safeSlug })]);
        if (cancelled) return;
        setPlace(p);
        setEvents(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [safeSlug]);

  const { shownEvents } = useMemo(() => {
    const live = events.filter(isLiveEvent);
    const all = events.filter((e) => {
      const t = Date.parse(String((e as any).updatedAt ?? ""));
      return !Number.isFinite(t) || new Date(t) <= AS_OF_DATE;
    });
    return { shownEvents: view === "live" ? live : all };
  }, [events, view]);

  const demoMetrics = useMemo(() => {
    const acres = shownEvents.reduce((sum, e: any) => sum + (typeof e.acres === "number" ? e.acres : 0), 0);
    const last7 = [12, 18, 15, 20, 22, 19, 16]; // demo “alerts”
    return { acres, last7 };
  }, [shownEvents]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Loading fire view…</div>
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
              <SearchBar placeholder='Try: "fire LA" or "fire 90001"' />
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
            <h1 className={styles.title}>{place.label}: Fire View</h1>
            <p className={styles.subtitle}>Fire reports filtered to this area (demo feed).</p>
          </div>
          <div className={styles.splitHeaderSearch}>
            <SearchBar placeholder='Try: "fire map" or "fire 90001"' />
          </div>
        </div>

        <section className={styles.splitLeft}>
          <div className={styles.stack}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Area conditions</div>
                  <div className={styles.cardSub}>
                    {view === "live" ? "Live fire activity indicators (demo)" : `All events up to ${AS_OF_LABEL} (demo)`}
                  </div>
                </div>
              </div>

              <div className={styles.cardBodyStack}>
                <div className={styles.metricGrid}>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Incidents</div>
                    <div className={styles.metricValue}>{shownEvents.length}</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Acres (sum)</div>
                    <div className={styles.metricValue}>{demoMetrics.acres.toLocaleString()}</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Wind (demo)</div>
                    <div className={styles.metricValue}>14 mph</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Humidity (demo)</div>
                    <div className={styles.metricValue}>22%</div>
                  </div>
                </div>

                <div style={{ color: "var(--text)" }}>
                  <div className={styles.smallLabel}>Alerts trend (last 7 days, demo)</div>
                  <MiniLine values={demoMetrics.last7} />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Fire feed</div>
                  <div className={styles.cardSub}>{loading ? "Loading…" : "Events list reflects the selected map view"}</div>
                </div>
              </div>
              <EventsPanel events={shownEvents} />
            </div>
          </div>
        </section>

        <aside className={styles.splitRight}>
          <div className={`${styles.card} ${styles.stickyCard}`}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Map</div>
                <div className={styles.cardSub}>Filtered markers near {place.label}</div>
              </div>
            </div>

            <div className={styles.stickyBody}>
              <div className={styles.mapFrame}>
                <UsMap mode="fire-place" place={place} fireEvents={shownEvents} height="100%" />

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
