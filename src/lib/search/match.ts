import type { SearchEntry } from "./types";

/**
 * Pure query-matching logic for the search overlay, kept out of the React
 * component so it can be unit-tested directly (`__tests__/match.test.ts`) and
 * so the overlay's render path stays cheap. Only type imports from siblings —
 * this module must never pull the glossary corpus into the client bundle
 * (see `src/lib/design/__tests__/clientBoundary.test.ts`).
 */

/**
 * Folds a string for matching: strips diacritics (NFD-decompose, drop the
 * combining marks) and lowercases. "Schrödinger" → "schrodinger", so a query
 * typed on a keyboard with no ö still finds it — for a physics glossary full
 * of ö/é this is the difference between search working and not.
 */
export function foldForSearch(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/**
 * A search-index entry with its folded match fields precomputed once — at
 * index load, not per keystroke. The original entry rides along untouched for
 * display; folding is for matching only.
 */
export type SearchableEntry = {
  entry: SearchEntry;
  /** Folded title, matched on its own for ranking (title hits beat description hits). */
  foldedTitle: string;
  /** Folded `title + " " + description` — the haystack every query token must appear in. */
  foldedText: string;
};

export function prepareSearchEntries(entries: SearchEntry[]): SearchableEntry[] {
  return entries.map((entry) => {
    const foldedTitle = foldForSearch(entry.title);
    return {
      entry,
      foldedTitle,
      foldedText: `${foldedTitle} ${foldForSearch(entry.description)}`,
    };
  });
}

/**
 * Folds the query and splits it into whitespace-separated tokens. An empty or
 * all-whitespace query yields `[]`, which matches nothing.
 */
export function tokenizeQuery(query: string): string[] {
  return foldForSearch(query).split(/\s+/u).filter(Boolean);
}

/**
 * AND-semantics across tokens: every token must appear somewhere in the
 * entry's folded title-plus-description. Word order doesn't matter, so
 * "state bell" finds "Bell state" just as "bell state" does.
 */
export function matchesAllTokens(candidate: SearchableEntry, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  return tokens.every((token) => candidate.foldedText.includes(token));
}

/**
 * How well an entry matches, lower being better: exact title, title prefix,
 * title substring, then description-only — the same hierarchy the overlay has
 * always sorted by, so a literal title hit is never buried under a pillar
 * that merely happens to come earlier in the curriculum and mentions the word
 * in passing.
 *
 * Multi-token extension: the whole (whitespace-normalized) query is first
 * tried against the title as a phrase, so "bell state" still scores an exact
 * 0 on the "Bell state" entry; failing that, the score is the *worst* token's
 * title band — 2 when every token appears in the title, 3 the moment any
 * token is found only in the description. For a single-token query this
 * reduces exactly to the original scoring. Score 3 retains its old meaning
 * ("the title alone doesn't cover the query"), which the overlay's glossary
 * re-rank relies on.
 *
 * Only call with a candidate that already passed `matchesAllTokens`; the
 * score of a non-match is meaningless (it still returns 3).
 */
export function matchScore(
  candidate: SearchableEntry,
  tokens: string[],
  phrase: string = tokens.join(" ")
): number {
  const title = candidate.foldedTitle;
  if (title === phrase) return 0;
  if (title.startsWith(phrase)) return 1;
  let worst = 2;
  for (const token of tokens) {
    if (!title.includes(token)) {
      worst = 3;
      break;
    }
  }
  return worst;
}
