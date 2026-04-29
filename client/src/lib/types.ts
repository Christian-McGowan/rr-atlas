export type PlaceType = "city" | "zip";

export type Place = {
  id: string;
  type: PlaceType;
  slug: string;
  label: string;
  center: [number, number]; // [lat, lng]
  bounds?: [[number, number], [number, number]]; // [[southWest], [northEast]]
  state?: string;
};

export type RiskSnapshot = {
  placeSlug: string;
  overallRisk: number;
  resilience: number;
  socialVulnerability: number;
  expectedAnnualLossM: number;
  topHazards: string[];
};

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

export type CommunityResource = {
  id: string;
  type: "Evac Shelter" | "Cooling Center" | "Hospital";
  name: string;
  address: string;
  lat: number;
  lng: number;
};
