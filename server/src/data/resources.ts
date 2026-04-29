import { getPlaceBySlug } from "./places.js";

export type CommunityResource = {
  id: string;
  type: "Evac Shelter" | "Cooling Center" | "Hospital";
  name: string;
  address: string;
  lat: number;
  lng: number;
};

const RESOURCES: Record<string, CommunityResource[]> = {
  "los-angeles-ca": [
    {
      id: "res_la_1",
      type: "Evac Shelter",
      name: "LA Community Shelter (Demo)",
      address: "123 Demo St, Los Angeles, CA",
      lat: 34.05,
      lng: -118.25
    },
    {
      id: "res_la_2",
      type: "Cooling Center",
      name: "Downtown Cooling Center (Demo)",
      address: "200 Demo Ave, Los Angeles, CA",
      lat: 34.04,
      lng: -118.24
    },
    {
      id: "res_la_3",
      type: "Hospital",
      name: "Central Hospital (Demo)",
      address: "1 Health Way, Los Angeles, CA",
      lat: 34.06,
      lng: -118.22
    }
  ],
  "90001-los-angeles-ca": [
    {
      id: "res_90001_1",
      type: "Cooling Center",
      name: "South LA Cooling Site (Demo)",
      address: "90001 Demo Blvd, Los Angeles, CA",
      lat: 33.98,
      lng: -118.25
    }
  ]
};

export function getResourcesForPlace(placeSlug: string) {
  const place = getPlaceBySlug(placeSlug);
  if (!place) return [];
  return RESOURCES[placeSlug] ?? [];
}
