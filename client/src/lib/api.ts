import type { AlertPreferences, AtlasEvent, AuthResponse, AuthUser, CommunityResource, Place, RiskSnapshot, SavedLocation } from "./types";

type SearchResponse = {
  route?: string;
  match?: Place;
  message?: string;
};

type RequestOptions = RequestInit & {
  token?: string;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function requestJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  const res = await fetch(url, { ...options, headers });
  const payload = (await res.json().catch(() => null)) as { message?: string } | null;

  if (!res.ok) {
    throw new Error(payload?.message ?? `HTTP ${res.status}`);
  }

  return payload as T;
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
  },

  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
    return requestJson("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    return requestJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async authMe(token: string): Promise<AuthUser> {
    return requestJson("/api/auth/me", { token });
  },

  async updateAccount(token: string, input: { name?: string; preferences?: AlertPreferences }): Promise<AuthUser> {
    return requestJson("/api/auth/me", {
      method: "PATCH",
      token,
      body: JSON.stringify(input)
    });
  },

  async saveLocation(token: string, location: SavedLocation): Promise<AuthUser> {
    return requestJson("/api/auth/saved-locations", {
      method: "POST",
      token,
      body: JSON.stringify(location)
    });
  },

  async removeLocation(token: string, slug: string): Promise<AuthUser> {
    return requestJson(`/api/auth/saved-locations/${encodeURIComponent(slug)}`, {
      method: "DELETE",
      token
    });
  }
};
