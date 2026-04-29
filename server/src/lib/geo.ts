import { searchPlaces } from "../data/places.js";

function stripFirePrefix(q: string) {
  const trimmed = q.trim();
  const lower = trimmed.toLowerCase();

  if (lower === "fire" || lower === "fire map" || lower === "firemap") {
    return { fireMode: true, remainder: "" };
  }

  if (lower.startsWith("fire ")) {
    return { fireMode: true, remainder: trimmed.slice(4).trim() };
  }

  return { fireMode: false, remainder: trimmed };
}

export function resolveSearch(raw: string) {
  const { fireMode, remainder } = stripFirePrefix(raw);

  if (fireMode && remainder.length === 0) {
    return { route: "/fire", message: "National fire map" };
  }

  const q = remainder.trim();
  if (!q) return { route: fireMode ? "/fire" : "/" };

  // Direct ZIP (5 digits)
  if (/^\d{5}$/.test(q)) {
    const matches = searchPlaces(q);
    if (matches[0]) {
      return { route: fireMode ? `/fire/${matches[0].slug}` : `/us/${matches[0].slug}`, match: matches[0] };
    }
  }

  // City/state fuzzy
  const matches = searchPlaces(q.toLowerCase());
  if (matches[0]) {
    return { route: fireMode ? `/fire/${matches[0].slug}` : `/us/${matches[0].slug}`, match: matches[0] };
  }

  return { message: "No match found" };
}
