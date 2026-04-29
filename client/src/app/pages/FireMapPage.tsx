import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/Page.module.css";
import SearchBar from "../../components/SearchBar";
import UsMap from "../../components/UsMap";
import EventsPanel from "../../components/EventsPanel";
import { api } from "../../lib/api";
import type { AtlasEvent } from "../../lib/types";

const AS_OF_LABEL = "Feb 10, 2026";
const AS_OF_DATE = new Date("2026-02-10T23:59:59Z");

function isLiveEvent(e: AtlasEvent) {
  const s = (e.status ?? "").toLowerCase();
  if (s.includes("active") || s.includes("monitor") || s.includes("warning") || s.includes("evac")) return true;
  if (s.includes("contained") || s.includes("inactive") || s.includes("closed") || s.includes("past")) return false;

  // fallback: treat recently updated as "live"
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

export default function FireMapPage() {
  const [events, setEvents] = useState<AtlasEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"live" | "all">("live");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const e = await api.getFireEvents({});
        if (!cancelled) setEvents(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const { liveEvents, allEvents, shownEvents } = useMemo(() => {
    const live = events.filter(isLiveEvent);
    const all = events.filter((e) => {
      const t = Date.parse(String((e as any).updatedAt ?? ""));
      return !Number.isFinite(t) || new Date(t) <= AS_OF_DATE;
    });
    return {
      liveEvents: live,
      allEvents: all,
      shownEvents: view === "live" ? live : all
    };
  }, [events, view]);

  // demo “trend” values
  const trend = useMemo(() => [3, 5, 4, 6, 8, 7, 5, 6, 9, 8, 7, 6, 5, 4], []);

  const totals = useMemo(() => {
    const acres = shownEvents.reduce((sum, e: any) => sum + (typeof e.acres === "number" ? e.acres : 0), 0);
    const active = shownEvents.filter((e) => (e.status ?? "").toLowerCase().includes("active")).length;
    const monitoring = shownEvents.filter((e) => (e.status ?? "").toLowerCase().includes("monitor")).length;
    return { acres, active, monitoring };
  }, [shownEvents]);

  return (
    <main className={styles.page}>
      <div className={styles.splitShell}>
        <div className={styles.splitHeader}>
          <div>
            <h1 className={styles.title}>National Wildfire Map</h1>
            <p className={styles.subtitle}>
              A clean national view of fire reports. Toggle between <strong>live</strong> and <strong>all</strong> events.
            </p>
          </div>
          <div className={styles.splitHeaderSearch}>
            <SearchBar placeholder='Try: "fire LA" or "fire 90001" or "LA"' />
          </div>
        </div>

        <section className={styles.splitLeft}>
          <div className={styles.stack}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Activity overview</div>
                  <div className={styles.cardSub}>
                    {view === "live"
                      ? `Live incidents right now (demo)`
                      : `All incidents up to ${AS_OF_LABEL} (demo)`}
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
                    <div className={styles.metricLabel}>Active</div>
                    <div className={styles.metricValue}>{totals.active}</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Monitoring</div>
                    <div className={styles.metricValue}>{totals.monitoring}</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabel}>Total acres</div>
                    <div className={styles.metricValue}>{totals.acres.toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ color: "var(--text)" }}>
                  <div className={styles.smallLabel}>New reports (last 14 days, demo)</div>
                  <MiniBars values={trend} />
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
                <div className={styles.cardSub}>Markers show the selected event set</div>
              </div>
            </div>

            <div className={styles.stickyBody}>
              <div className={styles.mapFrame}>
                <UsMap mode="fire-nation" fireEvents={shownEvents} height="100%" />

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
