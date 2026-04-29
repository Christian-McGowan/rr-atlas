export type PlaceType = "city" | "zip";

export type Place = {
  id: string;
  type: PlaceType;
  slug: string;
  label: string;
  state?: string;
  center: [number, number];
  bounds?: [[number, number], [number, number]];
  aliases: string[];
};

export type RiskSnapshot = {
  placeSlug: string;
  overallRisk: number;
  resilience: number;
  socialVulnerability: number;
  expectedAnnualLossM: number;
  topHazards: string[];
};

const PLACES: Place[] = [
  {
    id: "city_la",
    type: "city",
    slug: "los-angeles-ca",
    label: "Los Angeles, CA",
    state: "CA",
    center: [34.0522, -118.2437],
    bounds: [[33.70, -118.70], [34.35, -117.90]],
    aliases: ["la", "los angeles", "los angeles ca", "los-angeles", "losangeles"]
  },
  {
    id: "zip_90001",
    type: "zip",
    slug: "90001-los-angeles-ca",
    label: "90001 (Los Angeles, CA)",
    state: "CA",
    center: [33.9739, -118.2479],
    bounds: [[33.94, -118.28], [34.01, -118.20]],
    aliases: ["90001", "la 90001", "los angeles 90001"]
  },
  {
    id: "city_sandiego",
    type: "city",
    slug: "san-diego-ca",
    label: "San Diego, CA",
    state: "CA",
    center: [32.7157, -117.1611],
    bounds: [[32.53, -117.30], [32.93, -116.90]],
    aliases: ["san diego", "san diego ca", "sd"]
  }
];

const RISK: Record<string, RiskSnapshot> = {
  "los-angeles-ca": {
    placeSlug: "los-angeles-ca",
    overallRisk: 72,
    resilience: 58,
    socialVulnerability: 49,
    expectedAnnualLossM: 210,
    topHazards: ["Wildfire", "Earthquake (future)", "Heat", "Air quality"]
  },
  "90001-los-angeles-ca": {
    placeSlug: "90001-los-angeles-ca",
    overallRisk: 70,
    resilience: 55,
    socialVulnerability: 61,
    expectedAnnualLossM: 36,
    topHazards: ["Wildfire smoke", "Heat", "Flooding (flash)"]
  },
  "san-diego-ca": {
    placeSlug: "san-diego-ca",
    overallRisk: 61,
    resilience: 62,
    socialVulnerability: 37,
    expectedAnnualLossM: 95,
    topHazards: ["Wildfire", "Coastal flooding", "Heat"]
  }
};

export function getPlaceBySlug(slug: string) {
  return PLACES.find((p) => p.slug === slug) ?? null;
}

export function searchPlaces(raw: string) {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  return PLACES.filter((p) => p.aliases.some((a) => a === q || a.includes(q) || q.includes(a)));
}

export function getRiskForPlace(placeSlug: string) {
  return RISK[placeSlug] ?? null;
}

export function listPlaces() {
  return PLACES.slice();
}
