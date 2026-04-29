import type { AtlasEvent, CommunityResource, Place, RiskSnapshot } from "./types";

type SearchResponse = {
  route?: string;
  match?: Place;
  message?: string;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  async search(q: string): Promise<SearchResponse> {
    return getJson(`/api/search?q=${encodeURIComponent(q)}`);
  },

  async getPlace(slug: string): Promise<Place> {
    return getJson(`/api/places/${encodeURIComponent(slug)}`);
  },

  async getRisk(placeSlug: string): Promise<RiskSnapshot> {
    return getJson(`/api/risk/${encodeURIComponent(placeSlug)}`);
  },

  async getEvents(args: { placeSlug: string }): Promise<AtlasEvent[]> {
    return getJson(`/api/events?placeSlug=${encodeURIComponent(args.placeSlug)}`);
  },

  async getFireEvents(args: { placeSlug?: string }): Promise<AtlasEvent[]> {
    const qs = args.placeSlug ? `?placeSlug=${encodeURIComponent(args.placeSlug)}` : "";
    return getJson(`/api/fire${qs}`);
  },

  async getResources(placeSlug: string): Promise<CommunityResource[]> {
    return getJson(`/api/resources/${encodeURIComponent(placeSlug)}`);
  }
};
