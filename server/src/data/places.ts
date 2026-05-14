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
    bounds: [
      [33.7, -118.7],
      [34.35, -117.9]
    ],
    aliases: ["la", "los angeles", "los angeles ca", "los-angeles", "losangeles"]
  },
  {
    id: "zip_90001",
    type: "zip",
    slug: "90001-los-angeles-ca",
    label: "90001 (Los Angeles, CA)",
    state: "CA",
    center: [33.9739, -118.2479],
    bounds: [
      [33.94, -118.28],
      [34.01, -118.2]
    ],
    aliases: ["90001", "la 90001", "los angeles 90001"]
  },
  {
    id: "city_fullerton",
    type: "city",
    slug: "fullerton-ca",
    label: "Fullerton, CA",
    state: "CA",
    center: [33.8704, -117.9242],
    bounds: [
      [33.82, -117.99],
      [33.93, -117.86]
    ],
    aliases: ["fullerton", "fullerton ca", "fullerton california"]
  },
  {
    id: "city_irvine",
    type: "city",
    slug: "irvine-ca",
    label: "Irvine, CA",
    state: "CA",
    center: [33.6846, -117.8265],
    bounds: [
      [33.6, -117.89],
      [33.75, -117.68]
    ],
    aliases: ["irvine", "irvine ca", "irvine california"]
  },
  {
    id: "city_sandiego",
    type: "city",
    slug: "san-diego-ca",
    label: "San Diego, CA",
    state: "CA",
    center: [32.7157, -117.1611],
    bounds: [
      [32.53, -117.3],
      [32.93, -116.9]
    ],
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
  "fullerton-ca": {
    placeSlug: "fullerton-ca",
    overallRisk: 54,
    resilience: 64,
    socialVulnerability: 35,
    expectedAnnualLossM: 42,
    topHazards: ["Localized flooding", "Heat", "Earthquake", "Air quality"]
  },
  "irvine-ca": {
    placeSlug: "irvine-ca",
    overallRisk: 46,
    resilience: 70,
    socialVulnerability: 28,
    expectedAnnualLossM: 38,
    topHazards: ["Wildfire edge risk", "Heat", "Air quality", "Earthquake"]
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

  return PLACES.filter((p) =>
    p.aliases.some((a) => a === q || a.includes(q) || q.includes(a))
  );
}

export function getRiskForPlace(placeSlug: string) {
  return RISK[placeSlug] ?? null;
}

export function listPlaces() {
  return PLACES.slice();
}