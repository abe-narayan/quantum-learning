import type { SearchEntry } from "./types";

/**
 * Lazily fetches the static search index generated at build time (see
 * `scripts/generate-search-index.mjs` → `public/search-index.json`) and
 * caches the in-flight/resolved promise at module scope, so the file is
 * fetched over the network at most once per page load no matter how many
 * times the search overlay is opened and closed. A failed fetch clears the
 * cache so a later attempt (e.g. re-opening search) can retry rather than
 * being stuck failed for the rest of the session.
 */
let cachedIndex: Promise<SearchEntry[]> | null = null;

export function fetchSearchIndex(): Promise<SearchEntry[]> {
  if (!cachedIndex) {
    cachedIndex = fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.status} ${response.statusText}`);
        }
        return response.json() as Promise<SearchEntry[]>;
      })
      .catch((error: unknown) => {
        cachedIndex = null;
        throw error;
      });
  }
  return cachedIndex;
}
