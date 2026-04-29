import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "../styles/Map.module.css";
import type { AtlasEvent, Place } from "../lib/types";

const US_CENTER: [number, number] = [39.5, -98.35];
const US_ZOOM = 4;

// Demo cutoff date for "All events"
const ALL_EVENTS_CUTOFF_ISO = "2026-02-10T23:59:59.000Z";
const ALL_EVENTS_CUTOFF_LABEL = "Feb 10, 2026";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

type Mode = "nation" | "place" | "fire-nation" | "fire-place";
type EventView = "live" | "all";

type Props = {
  mode: Mode;
  place?: Place;
  fireEvents?: AtlasEvent[];
  height?: string;
};

function isLiveEvent(e: AtlasEvent) {
  const s = (e.status ?? "").toLowerCase();
  return s === "active" || s === "monitoring" || s === "open";
}

export default function UsMap({ mode, place, fireEvents, height }: Props) {
  const center: [number, number] = place?.center ?? US_CENTER;
  const zoom = mode === "place" || mode === "fire-place" ? 10 : US_ZOOM;

  const [view, setView] = React.useState<EventView>("live");

  const filteredEvents = React.useMemo(() => {
    if (!fireEvents?.length) return [];
    const cutoff = new Date(ALL_EVENTS_CUTOFF_ISO).getTime();

    if (view === "live") return fireEvents.filter(isLiveEvent);
    // "all" = live + past, but not beyond cutoff date
    return fireEvents.filter((e) => new Date(e.updatedAt).getTime() <= cutoff);
  }, [fireEvents, view]);

  return (
    <div
      className={styles.wrap}
      style={height ? ({ ["--map-height" as any]: height } as React.CSSProperties) : undefined}
    >
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className={styles.map}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {place && (mode === "place" || mode === "fire-place") && (
          <Marker position={place.center} icon={defaultIcon}>
            <Popup>
              <strong>{place.label}</strong>
              <div style={{ fontSize: 12, marginTop: 4 }}>{place.type.toUpperCase()}</div>
            </Popup>
          </Marker>
        )}

        {filteredEvents.map((e) => (
          <Marker key={e.id} position={[e.lat, e.lng]} icon={defaultIcon}>
            <Popup>
              <strong>{e.title}</strong>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                Status: {e.status}
                <br />
                Updated: {new Date(e.updatedAt).toLocaleString()}
                <br />
                Acres: {e.acres.toLocaleString()}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map overlay toggle (bottom-left) */}
      <div className={styles.eventToggle}>
        <button
          type="button"
          className={`${styles.eventBtn} ${view === "live" ? styles.eventBtnActive : ""}`}
          onClick={() => setView("live")}
        >
          🔴 Live events
        </button>
        <button
          type="button"
          className={`${styles.eventBtn} ${view === "all" ? styles.eventBtnActive : ""}`}
          onClick={() => setView("all")}
        >
          🗂 All events (to {ALL_EVENTS_CUTOFF_LABEL})
        </button>
      </div>
    </div>
  );
}
