import { getPlaceBySlug } from "./places.js";

export type AtlasEvent = {
  id: string;
  hazard: "wildfire" | "flood" | "storm";
  title: string;
  lat: number;
  lng: number;
  status: "active" | "monitoring" | "contained";
  acres: number;
  updatedAt: string;
  source: string;
};

const now = Date.now();
const iso = (t: number) => new Date(t).toISOString();

const EVENTS: AtlasEvent[] = [
  {
    id: "wf_la_1",
    hazard: "wildfire",
    title: "Angeles Crest Fire (Demo)",
    lat: 34.30,
    lng: -118.10,
    status: "active",
    acres: 1840,
    updatedAt: iso(now - 2 * 60 * 60 * 1000),
    source: "Demo feed"
  },
  {
    id: "wf_la_2",
    hazard: "wildfire",
    title: "Baldwin Hills Brush Fire (Demo)",
    lat: 34.01,
    lng: -118.36,
    status: "contained",
    acres: 210,
    updatedAt: iso(now - 9 * 24 * 60 * 60 * 1000),
    source: "Demo feed"
  },
  {
    id: "wf_sd_1",
    hazard: "wildfire",
    title: "East County Fire (Demo)",
    lat: 32.85,
    lng: -116.85,
    status: "monitoring",
    acres: 520,
    updatedAt: iso(now - 30 * 60 * 1000),
    source: "Demo feed"
  },
  {
    id: "wf_co_1",
    hazard: "wildfire",
    title: "Front Range Fire (Demo)",
    lat: 39.74,
    lng: -104.99,
    status: "active",
    acres: 910,
    updatedAt: iso(now - 4 * 60 * 60 * 1000),
    source: "Demo feed"
  },
  {
    id: "wf_fl_1",
    hazard: "wildfire",
    title: "Panhandle Fire (Demo)",
    lat: 30.45,
    lng: -85.50,
    status: "contained",
    acres: 130,
    updatedAt: iso(now - 20 * 24 * 60 * 60 * 1000),
    source: "Demo feed"
  },

  // a couple non-fire hazards so Area pages feel multi-hazard
  {
    id: "fl_la_1",
    hazard: "flood",
    title: "Flash Flood Advisory (Demo)",
    lat: 34.06,
    lng: -118.25,
    status: "monitoring",
    acres: 0,
    updatedAt: iso(now - 5 * 60 * 60 * 1000),
    source: "Demo feed"
  },
  {
    id: "st_la_1",
    hazard: "storm",
    title: "Severe Storm Watch (Demo)",
    lat: 34.12,
    lng: -118.30,
    status: "contained",
    acres: 0,
    updatedAt: iso(now - 60 * 24 * 60 * 60 * 1000),
    source: "Demo feed"
  }
];

function withinBounds(lat: number, lng: number, bounds: [[number, number],[number, number]]) {
  const [[sLat, sLng],[nLat, nLng]] = bounds;
  return lat >= sLat && lat <= nLat && lng >= sLng && lng <= nLng;
}

export function getFireEvents(placeSlug?: string) {
  const onlyFire = EVENTS.filter((e) => e.hazard === "wildfire");
  if (!placeSlug) return onlyFire;

  const place = getPlaceBySlug(placeSlug);
  if (!place?.bounds) return [];
  return onlyFire.filter((e) => withinBounds(e.lat, e.lng, place.bounds!));
}

export function getEventsForPlace(placeSlug: string, opts: { hazard: "any" | "wildfire" | "flood" | "storm" }) {
  const place = getPlaceBySlug(placeSlug);
  if (!place?.bounds) return [];

  const filtered = EVENTS.filter((e) => withinBounds(e.lat, e.lng, place.bounds!));
  if (opts.hazard === "any") return filtered;
  return filtered.filter((e) => e.hazard === opts.hazard);
}
