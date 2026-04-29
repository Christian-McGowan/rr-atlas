export function normalizeQuery(q: string) {
  return q.trim().replace(/\s+/g, " ");
}
