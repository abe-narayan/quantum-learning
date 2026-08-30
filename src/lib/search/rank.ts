import type { Pillar } from "@/lib/content/types";
import { PILLAR_ORDER } from "@/lib/design/pillars";
import { stripQuestionStem } from "./questionQuery";
import {
  matchesAllTokens,
  matchesAsTerm,
  relevanceBand,
  tokenizeQuery,
  type SearchableEntry,
} from "./match";
import { TYPE_ORDER, compareGroups } from "./groupRanking";
import type { SearchEntry, SearchEntryType } from "./types";

/**
 * One query in, ordered groups out — the whole of what the search overlay
 * decides, with none of what it draws.
 *
 * This used to live inside `SearchOverlay`'s `useMemo`, which meant the only
 * way to ask "what does this site return for `power series`?" was to render a
 * dialog. That is the wrong shape for the thing this file does: the ranking is
 * pure, the corpus it ranks is a committed artifact, and the questions worth
 * asking about it ("does a body-text match still rank below a title match",
 * "does `QFT` still lead with the Quantum Fourier Transform") are exactly the
 * questions a unit test should be able to ask directly. It is tested against
 * the real `public/search-index.json` in
 * `__tests__/recoveryQueries.test.ts`.
 *
 * Everything presentational — the per-group cap, the pillar sub-headers, the
 * "+N more" line — stays in the component, which consumes what comes back.
 */

/**
 * `null` stands for "no pillar" (most simulators, and any entry the index
 * doesn't tag) — its rank sorts after every real pillar so a kind group reads
 * curriculum-order-first, general-last.
 */
/**
 * How often the corpus links to this entry, most-linked first. Missing reads as 0.
 *
 * Only glossary terms carry a `linkCount`, so within every other kind
 * group every entry gets 0 and this comparator is a no-op: the ordering of
 * lessons, problems, simulators, courses and tracks is exactly what it was.
 * Inside the term group it decides the pairs that score identically, where
 * the alternative was the alphabet. See `linkCount` in ./types.ts.
 */
function weightOf(entry: SearchEntry): number {
  return entry.linkCount ?? 0;
}
function pillarRank(pillar: Pillar | undefined): number {
  if (!pillar) return PILLAR_ORDER.length;
  const index = PILLAR_ORDER.indexOf(pillar);
  return index === -1 ? PILLAR_ORDER.length : index;
}

export type RankedMatch = {
  entry: SearchEntry;
  /** `relevanceBand` — `matchScore`'s bands with the two weakest split by
   *  whether the entry contains the query as a term. Lower is better. */
  score: number;
  /**
   * 0 when the entry contains the query as a whole term, 1 when it only
   * contains its words (`matchesAsTerm`), sorted on straight after `score`.
   *
   * `relevanceBand` has already used this to *reorder* the bands below the
   * title, where it is safe to; inside the title bands it is not, because an
   * initialism match has no literal text to be contiguous in and would be
   * demoted for it. So it survives here as a tie-break, which cannot move a
   * row past a better-scoring one.
   *
   * ## Why it is a tie-break and not the primary key
   *
   * A review proposed sorting on it first, so that a whole-term match always
   * preceded a fragment. Measured against the real index, that breaks two of
   * the pins in `__tests__/recoveryQueries.test.ts` and for exactly the reason
   * this field's own note gives:
   *
   *  - `QFT` stops leading with the Quantum Fourier Transform. That entry is
   *    reached through its initialism, which is not literal text anywhere in
   *    it, so its `termRank` is 1 and a lesson that merely spells "QFT" out
   *    goes first.
   *  - `bell state` stops leading with the glossary's "Bell States", whose
   *    title is the plural and so contains no contiguous "bell state" either.
   *
   * Both are entries the query *names*, demoted for a spelling detail. The
   * substring noise that motivated the proposal is removed where it enters
   * instead — see `containsToken` in ./match.ts.
   */
  termRank: number;
};

export type RankedGroup = {
  type: SearchEntryType;
  /** Every match of this kind, best first. The overlay shows a slice. */
  matches: RankedMatch[];
  /** `matches[0].score` — the group's relevance band, read by `compareGroups`. */
  bestScore: number;
};

export type RankedResults = {
  groups: RankedGroup[];
  /**
   * The query actually answered, when it is not the one the reader typed —
   * i.e. when a leading question stem was stripped (see ./questionQuery.ts).
   * `null` on the common path. The overlay says so on screen: silently
   * answering a different question is how a search box loses a reader's
   * trust, and the reader needs to know which words are doing the work
   * before they try to narrow the query.
   */
  interpretedAs: string | null;
};

/** `matchScore`'s band for "every token appears somewhere in the title". A
 *  query with no match at or above this names nothing in the index, which is
 *  the one condition under which the question-stem strip is allowed to run. */
const SCORE_TITLE = 2;

function groupsFor(index: SearchableEntry[], tokens: string[]): RankedGroup[] {
  const phrase = tokens.join(" ");
  const built = TYPE_ORDER.map((type) => {
    // Each entry's score is computed exactly once per query, here — not
    // inside the sort comparator, where it used to be recomputed
    // O(n log n) times per keystroke.
    const matches: RankedMatch[] = [];
    for (const candidate of index) {
      if (candidate.entry.type !== type || !matchesAllTokens(candidate, tokens)) continue;
      matches.push({
        entry: candidate.entry,
        score: relevanceBand(candidate, tokens, phrase),
        termRank: matchesAsTerm(candidate, tokens) ? 0 : 1,
      });
    }
    if (matches.length === 0) return null;

    matches.sort(
      (a, b) =>
        a.score - b.score ||
        a.termRank - b.termRank ||
        weightOf(b.entry) - weightOf(a.entry) ||
        pillarRank(a.entry.pillar) - pillarRank(b.entry.pillar) ||
        a.entry.title.localeCompare(b.entry.title)
    );
    return { type, matches, bestScore: matches[0].score };
  }).filter((group): group is RankedGroup => group !== null);

  // Relevance first, kind second (`compareGroups`). A group whose best result
  // is *named* by the query leads, whatever kind it is; only inside a band
  // does the curated type order decide, and that is where the glossary's
  // description-only demotion lives.
  built.sort(compareGroups);
  return built;
}

/**
 * Ranks `query` against a prepared index.
 *
 * Two passes at most, and the second one almost never runs. The first is the
 * literal query. If — and only if — nothing in the index is *named* by it (no
 * entry reached `matchScore` band 2 or better, which includes the case of no
 * matches at all) and the query opens with a question stem, the stem is
 * dropped and the remainder is ranked instead. `power series` and `factorial`
 * are answered by the first pass, off the lesson keyword sets; `what is a bra`
 * is answered by the second.
 *
 * The second pass is discarded unless it actually found something, so a
 * reader can never be shown an empty screen *because* of the rewrite — the
 * same contract `suggestCorrection` holds itself to, and for the same reason.
 */
export function rankResults(index: SearchableEntry[], query: string): RankedResults {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return { groups: [], interpretedAs: null };

  const groups = groupsFor(index, tokens);
  const named = groups.some((group) => group.bestScore <= SCORE_TITLE);
  if (named) return { groups, interpretedAs: null };

  const stripped = stripQuestionStem(tokens);
  if (stripped === null) return { groups, interpretedAs: null };

  const rephrased = groupsFor(index, stripped);
  if (rephrased.length === 0) return { groups, interpretedAs: null };
  return { groups: rephrased, interpretedAs: stripped.join(" ") };
}
