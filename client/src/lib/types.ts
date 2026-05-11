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

export type SavedLocation = {
  slug: string;
  label: string;
  type: PlaceType;
  state?: string;
  center: [number, number];
  addedAt: string;
};

export type AlertPreferences = {
  emailAlerts: boolean;
  inAppAlerts: boolean;
  minimumSeverity: string;
  hazards: string[];
  weeklySummary: boolean;
  quietHours: boolean;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  savedLocations: SavedLocation[];
  preferences: AlertPreferences;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
