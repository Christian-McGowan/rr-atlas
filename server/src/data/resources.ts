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
  ],
  "fullerton-ca": [
    {
      id: "res_fullerton_1",
      type: "Evac Shelter",
      name: "Fullerton Community Shelter (Demo)",
      address: "303 W Commonwealth Ave, Fullerton, CA",
      lat: 33.8707,
      lng: -117.9271
    },
    {
      id: "res_fullerton_2",
      type: "Cooling Center",
      name: "Fullerton Cooling Center (Demo)",
      address: "Fullerton Public Library Area, Fullerton, CA",
      lat: 33.8789,
      lng: -117.9246
    },
    {
      id: "res_fullerton_3",
      type: "Hospital",
      name: "Fullerton Medical Center (Demo)",
      address: "Harbor Blvd Area, Fullerton, CA",
      lat: 33.8931,
      lng: -117.9278
    }
  ],
  "irvine-ca": [
    {
      id: "res_irvine_1",
      type: "Evac Shelter",
      name: "Irvine Emergency Shelter (Demo)",
      address: "1 Civic Center Plaza, Irvine, CA",
      lat: 33.6851,
      lng: -117.8259
    },
    {
      id: "res_irvine_2",
      type: "Cooling Center",
      name: "Irvine Cooling Center (Demo)",
      address: "Heritage Park Area, Irvine, CA",
      lat: 33.7042,
      lng: -117.7864
    },
    {
      id: "res_irvine_3",
      type: "Hospital",
      name: "Irvine Regional Hospital (Demo)",
      address: "Sand Canyon Ave Area, Irvine, CA",
      lat: 33.6603,
      lng: -117.7749
    }
  ]
};

export function getResourcesForPlace(placeSlug: string) {
  const place = getPlaceBySlug(placeSlug);
  if (!place) return [];

  return RESOURCES[placeSlug] ?? [];
}