import { tokenizeQuery } from "@/lib/search/match";

/**
 * Above this many words, the zero-result screen offers no "did you mean".
 *
 * `suggestCorrection` is the one thing on the search overlay's keystroke path
 * whose cost scales with the *query* rather than with the index: it asks the
 * matcher about every token separately (tokens × ~1,100 entries) and then
 * walks the whole title vocabulary for each token that failed. That is cheap
 * for a search and ruinous for a paste. Measured in headless Chrome against
 * the real committed index, a 10,000-character paste of near-miss words
 * blocked the main thread for **1,076 ms** — and per keystroke, so every
 * further character typed or deleted pays it again and the field stops
 * responding while the reader is still holding a key down.
 *
 * A cap on words rather than on characters, because words are what the pass
 * actually costs: `tokenizeQuery` splits on whitespace, so a 10,000-character
 * single token is one comparison and already cheap, while 1,400 short words
 * are 1,400 scans of the corpus.
 *
 * The number is not chosen, it is bounded from below by the corpus and from
 * above by the cost. The longest title in the real index is 14 words ("Which
 * Gates Are Transversal on the Surface Code, and Why Not All of Them?"), and a
 * reader who pastes a title they half-remember must still get it corrected, so
 * anything at or under 14 is a cap that breaks real queries — the first
 * version of this was 12, and `suggestionQuery.test.ts` re-derives that number
 * from `public/search-index.json` and failed on it, which is why the assertion
 * is there rather than a comment. 24 clears the longest title with room for a
 * reader's own words around it, and still holds the pass to about 2% of the
 * pathological cost.
 *
 * Above the cap nothing that was working is lost, for the reason
 * `didYouMean.ts` gives about its own `failing` check: a query returning zero
 * because twenty-five words never co-occur is not a spelling problem, and no
 * single correction rescues it. The rest of the zero-result screen (the
 * "fewer words find more" line and the three routes onward) is unchanged, so a
 * reader who lands here still gets the advice that applies to a query this
 * long.
 */
export const MAX_SUGGESTION_TOKENS = 24;

/**
 * The tokens to run the spelling-recovery pass over, or `null` when the query
 * is too long to be a misspelling of anything.
 *
 * Split out of the overlay so the cap is testable without a DOM: this repo's
 * Vitest runs in Node with no `jsdom`, so a rule that lives inside a
 * `useMemo` in a `"use client"` component is a rule nothing can check.
 */
export function suggestionTokensFor(query: string): string[] | null {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0 || tokens.length > MAX_SUGGESTION_TOKENS) return null;
  return tokens;
}
