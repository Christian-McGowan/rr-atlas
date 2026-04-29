import { useMemo, useState } from "react";
import styles from "../styles/Panel.module.css";
import type { AtlasEvent } from "../lib/types";

function isLive(e: AtlasEvent) {
  const seventyTwoH = 72 * 60 * 60 * 1000;
  const t = new Date(e.updatedAt).getTime();
  return e.status === "active" || Date.now() - t < seventyTwoH;
}

export default function EventsPanel({ events }: { events: AtlasEvent[] }) {
  const [tab, setTab] = useState<"live" | "past">("live");

  const { live, past } = useMemo(() => {
    const live: AtlasEvent[] = [];
    const past: AtlasEvent[] = [];
    for (const e of events) (isLive(e) ? live : past).push(e);
    live.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    past.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    return { live, past };
  }, [events]);

  const list = tab === "live" ? live : past;

  return (
    <div>
      <div className={styles.tabs}>
        <button className={tab === "live" ? styles.tabActive : styles.tab} onClick={() => setTab("live")}>
          Live ({live.length})
        </button>
        <button className={tab === "past" ? styles.tabActive : styles.tab} onClick={() => setTab("past")}>
          Past ({past.length})
        </button>
      </div>

      {list.length === 0 ? (
        <div className={styles.empty}>No events in this category.</div>
      ) : (
        <ul className={styles.eventList}>
          {list.map((e) => (
            <li key={e.id} className={styles.eventItem}>
              <div className={styles.eventTitle}>{e.title}</div>
              <div className={styles.eventMeta}>
                <span className={styles.badge}>{e.hazard}</span>
                <span className={styles.badgeMuted}>{e.status}</span>
                <span className={styles.badgeMuted}>{new Date(e.updatedAt).toLocaleString()}</span>
                <span className={styles.badgeMuted}>{e.acres.toLocaleString()} acres</span>
              </div>
              <div className={styles.eventSource}>Source: {e.source}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
