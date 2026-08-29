import type { SearchEntry } from "./types";

/**
 * Pure query-matching logic for the search overlay, kept out of the React
 * component so it can be unit-tested directly (`__tests__/match.test.ts`) and
 * so the overlay's render path stays cheap. Only type imports from siblings —
 * this module must never pull the glossary corpus into the client bundle
 * (see `src/lib/design/__tests__/clientBoundary.test.ts`).
 */

/**
 * Notation the corpus writes in Unicode but nobody can type: the angle
 * brackets of Dirac notation (U+27E8/U+27E9, plus the CJK and legacy
 * lookalikes KaTeX and hand-authored prose both produce) and the true minus
 * sign U+2212. 118 of the 1,073 index entries carry a ket in their title or
 * description — "The Density Matrix of |1⟩", "A 50/50 Mixture of |+⟩ and
 * |−⟩" — and a reader who types `|0>` or `|-⟩` on an ordinary keyboard got
 * the zero-result screen for a query the index could answer 118 times over.
 * Folding both sides onto the ASCII form makes the two spellings the same
 * string, so either one finds it.
 */
// Six of these render identically in every editor font, so read the trailing
// comment rather than the glyph: U+2329/U+232A and U+3008/U+3009 are distinct
// codepoints that merely look the same, not duplicated keys. (NFD, which runs
// first below, already collapses the U+2329 pair onto the U+3008 pair; both
// are listed anyway so this table stays correct if the fold order changes.)
const TYPEABLE_NOTATION: Record<string, string> = {
  "⟨": "<", // U+27E8 mathematical left angle bracket — what KaTeX and the corpus write
  "〈": "<", // U+2329 legacy left-pointing angle bracket
  "〈": "<", // U+3008 CJK left angle bracket
  "⟩": ">", // U+27E9 mathematical right angle bracket
  "〉": ">", // U+232A legacy right-pointing angle bracket
  "〉": ">", // U+3009 CJK right angle bracket
  "−": "-", // U+2212 true minus sign
};
const TYPEABLE_NOTATION_PATTERN = /[⟨〈〈⟩〉〉−]/gu;

/**
 * Folds a string for matching: strips diacritics (NFD-decompose, drop the
 * combining marks), lowercases, and maps the untypeable notation above onto
 * its ASCII spelling. "Schrödinger" → "schrodinger", so a query typed on a
 * keyboard with no ö still finds it — for a physics glossary full of ö/é
 * this is the difference between search working and not — and "|0⟩" → "|0>",
 * so is a query typed on a keyboard with no ⟩.
 */
export function foldForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(TYPEABLE_NOTATION_PATTERN, (character) => TYPEABLE_NOTATION[character]);
}

/**
 * Words skipped when reducing a title to its initialism below. People form an
 * acronym from the words that carry meaning — "Quantum Error Correction &
 * Fault Tolerance" is QECFT, never QECAFT — and keeping the joiners in also
 * manufactures false positives: without this list "Measurement and
 * Probability" reduces to "map", and the query "map" would return a lesson
 * that has nothing to do with the concept map.
 */
const ACRONYM_SKIP_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "into",
  "of",
  "on",
  "or",
  "the",
  "to",
  "via",
  "vs",
  "with",
]);

/**
 * The initialism of an already-folded title, or `""` for a title too short to
 * have one. "quantum error correction" → "qec", "quantum fourier transform" →
 * "qft", "quantum phase estimation" → "qpe".
 *
 * This exists because the index spells acronyms out. Every one of those three
 * concepts is in the corpus under its full name and nowhere under its
 * initials, so "QEC" — which is what a reader who just met the term in a
 * lesson actually types — returned nothing at all, and "QFT" returned two
 * entries that merely happen to mention the letters, with the Quantum Fourier
 * Transform entry itself ranked below them on a description-only hit.
 *
 * Single-word titles are excluded (`words.length < 2`): a one-letter
 * "acronym" is noise, not a name.
 */
export function acronymOf(foldedTitle: string): string {
  const words = foldedTitle
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 0 && !ACRONYM_SKIP_WORDS.has(word));
  if (words.length < 2) return "";
  return words.map((word) => word[0]).join("");
}

/** Below this a token is too short to be anyone's acronym. Defensive rather
 *  than load-bearing: every letter of an initialism is by construction a
 *  letter of the title, so a one-character token always matched the folded
 *  text anyway — this just keeps the rule stated where the length thresholds
 *  live, in case the initialism is ever derived from something other than the
 *  title. */
const MIN_ACRONYM_TOKEN = 2;
/** Prefix matching ("qec" → "qecft", the Quantum Error Correction & Fault
 *  Tolerance course) is only allowed from this length up, and the noise it
 *  admits is bounded: over the real 1,073-entry index the busiest 3-letter
 *  initialism prefix covers six entries. */
const MIN_ACRONYM_PREFIX_TOKEN = 3;

/** Whether one query token names an entry's initialism, exactly or as the
 *  leading run of it. */
function matchesAcronym(acronym: string, token: string): boolean {
  if (acronym.length === 0 || token.length < MIN_ACRONYM_TOKEN) return false;
  if (acronym === token) return true;
  return token.length >= MIN_ACRONYM_PREFIX_TOKEN && acronym.startsWith(token);
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
  /** The title's initialism (`acronymOf`), or `""` when it has none. Matched
   *  as a third, title-level channel so "QEC" reaches Quantum Error
   *  Correction, which spells itself out everywhere and nowhere abbreviates. */
  foldedAcronym: string;
  /**
   * Folded `entry.keywords` — the bounded set of terms a lesson's *body*
   * teaches (`lib/search/lessonKeywords.ts`), or `""` for every entry kind
   * that has none.
   *
   * Kept as a field of its own rather than concatenated into `foldedText`
   * precisely so `matchScore` can tell the two apart. Title and description
   * are what an entry says it is; keywords are what it happens to contain,
   * and the whole point of adding a matchable surface this much larger is
   * that it must never outrank the small one — see `SCORE_KEYWORD_ONLY`.
   */
  foldedKeywords: string;
};

export function prepareSearchEntries(entries: SearchEntry[]): SearchableEntry[] {
  return entries.map((entry) => {
    const foldedTitle = foldForSearch(entry.title);
    return {
      entry,
      foldedTitle,
      foldedText: `${foldedTitle} ${foldForSearch(entry.description)}`,
      foldedAcronym: acronymOf(foldedTitle),
      // Already lowercase ASCII by construction (the generator folds while it
      // extracts), but folded again rather than trusted: an index file
      // generated before this field existed, or by an older generator, must
      // not be able to make matching depend on which build wrote it.
      foldedKeywords: entry.keywords ? foldForSearch(entry.keywords) : "",
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
 * entry's folded title-plus-description, or name that entry's initialism, or
 * appear among the terms its body teaches. Word order doesn't matter, so
 * "state bell" finds "Bell state" just as "bell state" does.
 *
 * The initialism is the second channel because the corpus writes concept
 * names out in full: "QEC" appears in no title and no description anywhere in
 * the 1,073-entry index, so before this it produced the zero-result screen
 * even though Quantum Error Correction is a glossary term, a course, and the
 * subject of a simulator.
 *
 * The keyword set is the third, and is the reason `power series`, `factorial`,
 * `half angle` and `theta/2` stopped returning nothing: all four are taught in
 * the corpus and none of them was in any title or description. It is checked
 * last because it is by far the largest of the three haystacks, and `includes`
 * short-circuits — a query that the title or description already answers never
 * touches it.
 */
export function matchesAllTokens(candidate: SearchableEntry, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  return tokens.every(
    (token) =>
      candidate.foldedText.includes(token) ||
      matchesAcronym(candidate.foldedAcronym, token) ||
      candidate.foldedKeywords.includes(token)
  );
}

/**
 * The band an entry lands in when the query is answered only by the terms its
 * body teaches — strictly worse than description-only (3), and named here
 * because two other modules reason about it.
 *
 * This number is the whole safety argument for adding a matchable surface
 * roughly as large as the rest of the index put together. A body-text match
 * can never outrank, or even tie, a match on what an entry calls itself: the
 * keyword channel is only ever consulted for a token the title, description
 * and initialism have all already failed, and the moment it is consulted the
 * score is pinned to the bottom band. Concretely, adding keywords cannot
 * change the first result of any query that already had one — new matches
 * either join an existing group below every result it already held, or form a
 * new group that `leadBand` sorts last (see ./groupRanking.ts).
 */
export const SCORE_KEYWORD_ONLY = 4;

/** True when `character` is a letter or digit, i.e. would continue a word.
 *  Used instead of a `\b`-style regex so this stays free of lookbehind, which
 *  older Safari refuses to *compile* — a search box that throws on
 *  construction is worse than one that ranks imperfectly. */
function isWordCharacter(character: string | undefined): boolean {
  return character !== undefined && /[\p{L}\p{N}]/u.test(character);
}

/** Whether `needle` appears in `haystack` as a whole term rather than buried
 *  inside a longer word. */
function containsWholeTerm(haystack: string, needle: string): boolean {
  let from = 0;
  for (;;) {
    const at = haystack.indexOf(needle, from);
    if (at === -1) return false;
    if (!isWordCharacter(haystack[at - 1]) && !isWordCharacter(haystack[at + needle.length])) {
      return true;
    }
    from = at + 1;
  }
}

/**
 * Whether the query appears in the entry as a *term* — its tokens contiguous
 * and word-bounded — rather than as fragments scattered through the text.
 *
 * This is a tie-break inside a `matchScore` band, never a band of its own, and
 * it exists because substring matching is load-bearing here and cannot be
 * given up. `|0>` finds "|0⟩⟨1|" and `bra-ket` finds "Dirac Notation
 * (Bra-Ket)" precisely because a token needs no word boundary; the price is
 * that `bra` also finds "cali**bra**tion" and "alge**bra**", and `half angle`
 * finds a lesson holding "half-turn" and "rotation-angle" in different
 * sentences. Both were measured: before this, `what is a bra` led with
 * "Capstone: From Abstract Algebra to the Hydrogen Atom", and `half angle`
 * with "Quantum Gates", ahead of the two lessons that derive the Bloch
 * half-angle.
 *
 * Three separator spellings are tried — space, hyphen, slash — because the
 * corpus writes compound terms all three ways ("half-angle", "matrix
 * multiplication", "theta/2") and a reader types whichever they remember. A
 * tie-break is the right instrument rather than a score band: it can reorder
 * equally-relevant rows, and can never move a row past one the query names
 * more strongly.
 */
export function matchesAsTerm(candidate: SearchableEntry, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  const haystack =
    candidate.foldedKeywords === ""
      ? candidate.foldedText
      : `${candidate.foldedText} ${candidate.foldedKeywords}`;
  for (const separator of [" ", "-", "/"]) {
    if (containsWholeTerm(haystack, tokens.join(separator))) return true;
    if (tokens.length === 1) break;
  }
  return false;
}

/** `matchScore`'s weak bands, split by whether the entry contains the query as
 *  a term. Scattered-description (5) sits *below* whole-term-keyword (4): see
 *  `relevanceBand`. */
const SCORE_DESCRIPTION_SCATTERED = 5;
const SCORE_KEYWORD_SCATTERED = 6;

/**
 * The band the overlay actually sorts on: `matchScore`, with its two weakest
 * bands split by `matchesAsTerm`.
 *
 *   0  the title is the query          3  the description contains the term
 *   1  title prefix / whole initialism 4  the body teaches the term
 *   2  every token is in the title     5  the description contains the words
 *                                      6  the body contains the words
 *
 * The one non-obvious ordering is 4 above 5, and it is the point of the
 * function. `half angle` matched the glossary's "Entanglement Entropy" — whose
 * definition contains "half" in one sentence and "angle" in another — and that
 * description-only hit outranked the two lessons that derive the Bloch
 * half-angle, because "description" beats "body" band-for-band. It should not:
 * an entry that contains what the reader typed, as the thing they typed, is a
 * better answer than one that happens to contain its words. So below the title
 * bands the question "is this a term or a coincidence?" is asked before "which
 * field was it in?".
 *
 * The title bands are deliberately untouched. An initialism match (`QFT`)
 * never appears as literal text at all and would be demoted by any
 * term-contiguity rule, and an entry the query *names* should not be
 * reorderable by anything.
 */
export function relevanceBand(
  candidate: SearchableEntry,
  tokens: string[],
  phrase: string = tokens.join(" ")
): number {
  const score = matchScore(candidate, tokens, phrase);
  if (score <= 2 || matchesAsTerm(candidate, tokens)) return score;
  return score === 3 ? SCORE_DESCRIPTION_SCATTERED : SCORE_KEYWORD_SCATTERED;
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
 * Initialisms score in the title bands, not the description band, because
 * that is what they are — a name for the entry, not a word its prose happens
 * to contain. A query that *is* the whole initialism lands at 1 (alongside a
 * title prefix): "QFT" now puts Quantum Fourier Transform first instead of
 * behind "Phase Estimation Precision & Approximate QFT", which had the only
 * literal "QFT" in the corpus and was outranking the thing itself. A query
 * that is the leading run of a longer initialism lands at 2, so the Quantum
 * Error Correction & Fault Tolerance course follows the Quantum Error
 * Correction term for "QEC" rather than tying with it.
 *
 * Every band an entry could reach before it is preserved: the acronym checks
 * only ever run after the exact-title and title-prefix tests, and only ever
 * rescue a token the title does not literally contain.
 *
 * Band 4 (`SCORE_KEYWORD_ONLY`) extends the same idea one step down: the query
 * is only answerable at all because of a term the lesson's *body* teaches, so
 * it ranks below every entry whose own title or description covers it. The
 * band is reached by exactly the tokens `matchesAllTokens` had to fall through
 * to the keyword set for, which is why the loop below checks `foldedText`
 * rather than only the title once it has decided the title is insufficient.
 *
 * Only call with a candidate that already passed `matchesAllTokens`; the
 * score of a non-match is meaningless (it still returns 3 or 4).
 */
export function matchScore(
  candidate: SearchableEntry,
  tokens: string[],
  phrase: string = tokens.join(" ")
): number {
  const title = candidate.foldedTitle;
  if (title === phrase) return 0;
  if (title.startsWith(phrase)) return 1;
  if (candidate.foldedAcronym !== "" && candidate.foldedAcronym === phrase) return 1;
  let worst = 2;
  for (const token of tokens) {
    if (title.includes(token) || matchesAcronym(candidate.foldedAcronym, token)) continue;
    // The title doesn't cover this token; the question is only whether the
    // description does. One token that only the keyword set answers pins the
    // whole entry to the bottom band, so there is nothing further to learn
    // from the remaining tokens once that happens.
    if (!candidate.foldedText.includes(token)) return SCORE_KEYWORD_ONLY;
    worst = 3;
  }
  return worst;
}
