import { matchesAllTokens, type SearchableEntry } from "./match";

/**
 * The recovery pass: what to search for when the strict pass found nothing.
 *
 * `matchesAllTokens` is deliberately literal — every token must appear in the
 * entry's folded text or name its initialism — and that is the right contract
 * for the common path, because it is what keeps a good query from dragging in
 * near-misses. The cost is that a single mistyped letter ("entanglment") is a
 * hard zero, and a zero-result screen is the worst place on this site to fail:
 * search is how a reader recovers when they are lost, so it is the one surface
 * that must always offer a next move.
 *
 * So the fuzziness lives here instead, as a *second* pass that runs only after
 * the strict pass has already returned nothing. Nothing in this module is on
 * the common path: no distance is computed, and the vocabulary below is never
 * even built, for a query that found results.
 *
 * Pure and dependency-free for the same reason `match.ts` is — it must never
 * pull the glossary corpus into the client bundle (see
 * `src/lib/design/__tests__/clientBoundary.test.ts`).
 */

/**
 * Below this length a token is not worth correcting. At three characters an
 * edit distance of 1 reaches a third of the alphabet: "qec" is one edit from
 * "qed", "sec" and "qet", and guessing between them is worse than saying
 * nothing. It also protects the initialism channel `match.ts` added — short
 * all-caps tokens are usually names, not typos.
 */
const MIN_CORRECTABLE_LENGTH = 4;

/**
 * How far a token may be from a real corpus word before the suggestion stops
 * being a correction and starts being a different word. One edit for a short
 * token, two once the token is long enough that two edits are still a small
 * fraction of it ("entanglemnt" -> "entanglement" is two).
 */
const MAX_DISTANCE_SHORT = 1;
const MAX_DISTANCE_LONG = 2;
const LONG_TOKEN_LENGTH = 7;

function maxDistanceFor(token: string): number {
  return token.length >= LONG_TOKEN_LENGTH ? MAX_DISTANCE_LONG : MAX_DISTANCE_SHORT;
}

/**
 * Optimal string alignment distance (Levenshtein plus adjacent transposition)
 * with an early bail-out at `max`.
 *
 * Transposition is included because it is the single most common real typo —
 * "entanglemnet", "qubti", "measuremnet" — and plain Levenshtein charges two
 * edits for it, which pushes exactly the errors people actually make past the
 * threshold. The length pre-check and the per-row bail mean a candidate that
 * cannot win costs almost nothing, which is what makes scanning a few thousand
 * vocabulary words per zero-result keystroke cheap.
 *
 * Returns `max + 1` for "further than max" rather than the true distance —
 * callers only ever compare against the threshold.
 */
export function boundedEditDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Three rolling rows: the transposition case needs the row before last.
  let twoAgo: number[] = [];
  let previous: number[] = Array.from({ length: b.length + 1 }, (_, index) => index);
  let current: number[] = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    let rowBest = current[0];
    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(
        current[j - 1] + 1, // insertion
        previous[j] + 1, // deletion
        previous[j - 1] + substitutionCost // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, twoAgo[j - 2] + 1); // transposition
      }
      current[j] = value;
      if (value < rowBest) rowBest = value;
    }
    // Every remaining row can only add to the best value on this one, so once
    // the whole row is past the threshold no completion can come back under it.
    if (rowBest > max) return max + 1;
    twoAgo = previous;
    previous = current;
    current = new Array<number>(b.length + 1);
  }

  const distance = previous[b.length];
  return distance > max ? max + 1 : distance;
}

/** A corpus word and how many entry titles it appears in — the frequency is
 *  the tie-breaker when two candidates sit at the same distance. */
type VocabularyWord = { word: string; count: number };

/**
 * Built from **titles only**, not descriptions. A title word is a name the
 * corpus chose; a description word is prose, and correcting a typo onto a word
 * that happens to appear in one paragraph somewhere produces a suggestion that
 * is technically reachable and reads as nonsense. Titles also keep the
 * vocabulary small enough (a few thousand words over the real 1,073-entry
 * index) that a full scan per zero-result keystroke is not worth optimising
 * further.
 */
export function buildSuggestionVocabulary(entries: SearchableEntry[]): VocabularyWord[] {
  const counts = new Map<string, number>();
  for (const candidate of entries) {
    // Split on the same class boundary `acronymOf` uses, so "bra-ket" and
    // "|0⟩" contribute their word parts rather than one unmatchable blob.
    const seen = new Set<string>();
    for (const word of candidate.foldedTitle.split(/[^\p{L}\p{N}]+/u)) {
      if (word.length < MIN_CORRECTABLE_LENGTH || seen.has(word)) continue;
      seen.add(word);
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }
  return [...counts.entries()].map(([word, count]) => ({ word, count }));
}

/**
 * The vocabulary is derived from the prepared index, which the overlay holds
 * for the life of the page, so cache it against that array rather than
 * rebuilding it on every keystroke of a failing query ("entanglm",
 * "entanglme", "entanglmen" are three zero-result renders in a row while
 * someone types one wrong word). A `WeakMap` so a replaced index is not kept
 * alive by its own cache entry.
 *
 * Populated lazily, on first use — which is the first zero-result query of the
 * session, and never at all for a reader whose searches all land.
 */
const vocabularyCache = new WeakMap<SearchableEntry[], VocabularyWord[]>();

function vocabularyFor(entries: SearchableEntry[]): VocabularyWord[] {
  const cached = vocabularyCache.get(entries);
  if (cached) return cached;
  const built = buildSuggestionVocabulary(entries);
  vocabularyCache.set(entries, built);
  return built;
}

/** The closest vocabulary word to `token`, or `null` when nothing is close
 *  enough. Ties go to the word that heads more titles, then to the
 *  alphabetically first, so the same query always suggests the same thing. */
function nearestWord(token: string, vocabulary: VocabularyWord[]): string | null {
  if (token.length < MIN_CORRECTABLE_LENGTH) return null;
  const max = maxDistanceFor(token);
  let best: string | null = null;
  let bestDistance = max + 1;
  let bestCount = 0;
  for (const { word, count } of vocabulary) {
    const distance = boundedEditDistance(token, word, max);
    if (distance > max) continue;
    if (
      distance < bestDistance ||
      (distance === bestDistance &&
        (count > bestCount || (count === bestCount && best !== null && word < best)))
    ) {
      best = word;
      bestDistance = distance;
      bestCount = count;
    }
  }
  return best;
}

/**
 * A corrected spelling of `tokens` that the index can actually answer, or
 * `null`.
 *
 * Only the tokens that failed on their own are corrected — a query like
 * "bell entanglment" keeps "bell" exactly as typed and fixes the one word that
 * is wrong, because rewriting a word the reader got right is how a "did you
 * mean" turns into a search that answers a question nobody asked.
 *
 * The result is then run back through the strict matcher before it is offered.
 * That last check is the point of the whole function: a suggestion that leads
 * to a second zero-result screen is worse than no suggestion, because the
 * reader spent a click to arrive at the same dead end. Callers may render what
 * comes back without re-verifying it.
 *
 * Call only when the strict pass returned nothing.
 */
export function suggestCorrection(
  tokens: string[],
  entries: SearchableEntry[]
): string | null {
  if (tokens.length === 0 || entries.length === 0) return null;

  // Which tokens are individually unanswerable. A query can return zero
  // because two good words never co-occur ("grover hamiltonian"), and that is
  // not a spelling problem — there is nothing to correct, so we say nothing.
  const failing = tokens.filter(
    (token) => !entries.some((candidate) => matchesAllTokens(candidate, [token]))
  );
  if (failing.length === 0) return null;

  const vocabulary = vocabularyFor(entries);
  const corrections = new Map<string, string>();
  for (const token of failing) {
    const replacement = nearestWord(token, vocabulary);
    if (replacement === null) return null;
    corrections.set(token, replacement);
  }

  const corrected = tokens.map((token) => corrections.get(token) ?? token);
  if (corrected.every((token, index) => token === tokens[index])) return null;

  const answerable = entries.some((candidate) => matchesAllTokens(candidate, corrected));
  return answerable ? corrected.join(" ") : null;
}
